import { useState, useRef, useEffect } from "react";
import ChatBubble from "../component/Assistant/ChatBubble";
import ChatInput from "../component/Assistant/ChatInput";
import { RiSparkling2Line, RiRobot2Line, RiCheckLine, RiStickyNoteLine, RiErrorWarningLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { parseTransactionIntent, chatWithGemini } from "../service/gemini";
import { Transaction } from "../models/Transaction";
import { transactionService } from "../service/TransactionService";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  message: string | React.ReactNode;
  time: string;
  insight?: {
    title: string;
    content: string;
  };
}

/**
 * Returns the current time formatted as "HH:MM AM/PM".
 */
function getCurrentTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a number as IDR currency string.
 * Example: 75000 → "Rp 75.000"
 */
function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Generates a unique ID for each chat message. */
let messageCounter = 0;
function generateId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

export default function Assistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      type: "bot",
      message:
        "Hello! I'm your AI Cash Intelligence assistant. How can I help you log your expenses today?",
      time: getCurrentTime(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /**
   * Core agentic workflow handler:
   * 1. Parse user intent with Gemini data-extractor
   * 2. If transaction → save to Firestore → show confirmation
   * 3. If not → forward to conversational Gemini → show response
   */
  const handleSendMessage = async (text: string) => {
    if (!user) return;

    // Add user message to chat
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

        await transactionService.addTransaction(newTransaction);

        // Build the confirmation bubble with the existing premium UI
        const typeLabel = intent.type === "income" ? "Income" : "Expense";
        const confirmationMessage: ChatMessage = {
          id: generateId(),
          type: "bot",
          time: getCurrentTime(),
          message: (
            <div className="space-y-3">
              <p className="flex items-center gap-1.5 flex-wrap">
                Sip, <span className="font-bold">{typeLabel}</span> sebesar{" "}
                <span className="font-bold text-teal-800 dark:text-cyan-400">
                  {formatIDR(intent.amount)}
                </span>{" "}
                sudah dicatat ke kategori{" "}
                <span className="font-bold text-teal-800 dark:text-cyan-400">
                  {intent.category}
                </span>
                ! <RiCheckLine className="text-teal-600 dark:text-cyan-400 text-lg" />
              </p>
              {intent.note && (
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <RiStickyNoteLine /> Catatan: {intent.note}
                </p>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 dark:bg-cyan-400/10 border border-teal-500/20 dark:border-cyan-400/20 text-[10px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-widest">
                <RiSparkling2Line size={12} className="animate-pulse" />
                Logged Successfully
              </div>
            </div>
          ),
        };

        setMessages((prev) => [...prev, confirmationMessage]);
      } else {
        // Step 2B: Normal conversational response
        const geminiReply = await chatWithGemini(text);

        const botMessage: ChatMessage = {
          id: generateId(),
          type: "bot",
          message: geminiReply,
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
            Maaf, terjadi kesalahan saat memproses permintaan kamu. Coba lagi ya! <RiErrorWarningLine className="text-lg text-rose-500 shrink-0" />
          </div>
        ),
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col mb-20 max-w-2xl mx-auto animate-in fade-in duration-700">

      
      {/* Date Divider */}
      <div className="flex justify-center mt-2 mb-7">
        <span className="px-4 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-300/50 dark:bg-slate-800/60 rounded-full uppercase tracking-widest backdrop-blur-sm border border-slate-700/30">
          Today
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col gap-8 px-1">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            type={msg.type}
            message={msg.message}
            time={msg.time}
            insight={msg.insight}
          />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 opacity-80 animate-in fade-in duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-950 dark:bg-slate-800 flex items-center justify-center text-cyan-400 shadow-sm">
              <RiRobot2Line size={22} />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center h-10">
               <div className="w-1.5 h-1.5 bg-teal-700/70 dark:bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-1.5 h-1.5 bg-teal-700/70 dark:bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
               <div className="w-1.5 h-1.5 bg-teal-700/70 dark:bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input — now rendered within Assistant for shared state */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />

    </div>

  );
}