import { useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { parseTransactionIntent, chatWithGemini } from "../service/gemini";
import { Transaction } from "../models/Transaction";
import { transactionService } from "../service/TransactionService";
import { type ChatMessage, generateId, getCurrentTime, formatIDR } from "../utils/assistantHelpers";
import TransactionConfirmationBubble from "../component/Assistant/TransactionConfirmationBubble";
import FinancialAnalysisBubble from "../component/Assistant/FinancialAnalysisBubble";
import { useChatStore } from "../store/useChatStore";
import { useTransactionStore } from "../store/useTransactionStore";

export function useAssistantChat(user: any) {
  const { messages, setMessages } = useChatStore();
  const { addTransaction } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!user) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      type: "user",
      message: text,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Step 1: Intent Parsing
      const intent = await parseTransactionIntent(text);

      if (intent.isTransaction) {
        // Step 2A: Transaction Recording
        const newTransaction = new Transaction({
          userId: user.uid,
          amount: intent.amount,
          type: intent.type,
          category: intent.category,
          date: new Date(),
          note: intent.note || undefined,
        });

        const docId = await transactionService.addTransaction(newTransaction);
        
        // Sync to store
        newTransaction.id = docId;
        addTransaction(newTransaction);

        const confirmationMessage: ChatMessage = {
          id: generateId(),
          type: "bot",
          time: getCurrentTime(),
          message: (
            <TransactionConfirmationBubble
              type={intent.type}
              amountFormatted={formatIDR(intent.amount)}
              category={intent.category}
              note={intent.note}
            />
          ),
        };

        setMessages((prev) => [...prev, confirmationMessage]);
      } else {
        const stats = await transactionService.getDashboardStats(user.uid);
        const recentTxs = await transactionService.getRecentTransactions(user.uid, 5);
        
        const userData = {
          stats,
          recentTransactions: recentTxs.map(tx => ({
            amount: tx.amount,
            type: tx.type,
            category: tx.category,
            date: tx.date
          }))
        };

        const geminiReply = await chatWithGemini(text, userData);

        let botMessageContent: React.ReactNode;
        
        if (geminiReply.isFinance && geminiReply.isAnalysis) {
          botMessageContent = <FinancialAnalysisBubble reply={geminiReply} />;
        } else {
          // If it's a general reply or non-finance refusal
          botMessageContent = (geminiReply as any).reply;
        }

        const botMessage: ChatMessage = {
          id: generateId(),
          type: "bot",
          message: botMessageContent,
          time: getCurrentTime(),
        };

        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Assistant Error:", error);

      const errorMessage: ChatMessage = {
        id: generateId(),
        type: "bot",
        message: (
          <div className="flex items-center gap-2">
            Error connecting to AI server. Please try again! <RiErrorWarningLine className="text-lg text-rose-500 shrink-0" />
          </div>
        ),
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, handleSendMessage };
}
