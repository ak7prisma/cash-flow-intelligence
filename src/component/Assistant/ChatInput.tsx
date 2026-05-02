import { useState, useRef, useEffect } from "react";
import { RiMicLine, RiSendPlane2Line, RiStopCircleLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend?: (message: string) => void;
  disabled?: boolean;
}

// Support for Web Speech API
const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;

export default function ChatInput({ onSend, disabled = false }: Readonly<ChatInputProps>) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "id-ID";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser/device.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInput("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend?.(trimmed);
    setInput("");
    if (isListening) {
      recognitionRef.current?.stop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-25 left-0 right-0 px-5 z-40 animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-2xl mx-auto flex items-center gap-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none backdrop-blur-md relative overflow-hidden">
        
        {/* Pulse background when listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <button 
          onClick={toggleListening}
          className={`relative p-3 rounded-2xl transition-all duration-300 ${
            isListening 
              ? "text-red-500 bg-red-50 dark:bg-red-500/20" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <RiStopCircleLine size={22} />
            </motion.div>
          ) : (
            <RiMicLine size={22} />
          )}
        </button>
        
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={isListening ? "Listening..." : "Ask Gemini to log an expense..."}
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 py-2 disabled:opacity-50"
        />

        <button 
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="w-12 h-12 flex items-center justify-center bg-teal-800 dark:bg-cyan-400 text-white dark:text-slate-900 rounded-2xl shadow-lg shadow-teal-500/20 dark:shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
        >
          <RiSendPlane2Line size={20} />
        </button>
      </div>
    </div>
  );
}
