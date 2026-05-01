import { useRef, useEffect } from "react";
import ChatBubble from "../component/Assistant/ChatBubble";
import ChatInput from "../component/Assistant/ChatInput";
import TypingIndicator from "../component/Assistant/TypingIndicator";
import { useAuth } from "../context/AuthContext";
import { useAssistantChat } from "../hooks/useAssistantChat";

export default function Assistant() {
  const { user } = useAuth();
  const { messages, isLoading, handleSendMessage } = useAssistantChat(user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
        {isLoading && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input — now rendered within Assistant for shared state */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />

    </div>

  );
}