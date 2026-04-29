import ChatBubble from "../component/Assistant/ChatBubble";
import { RiSparkling2Line, RiRobot2Line } from "react-icons/ri";


export default function Assistant() {
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
        <ChatBubble 
          type="bot" 
          message="Hello! I'm your AI Cash Intelligence assistant. How can I help you log your expenses today?" 
          time="09:41 AM" 
        />
        
        <ChatBubble 
          type="user" 
          message="Makan malam, 75k" 
          time="09:42 AM" 
        />
        
        <ChatBubble 
          type="bot" 
          message={
            <div className="space-y-3">
              <p>
                Added <span className="font-bold text-teal-800 dark:text-cyan-400">Rp 75,000</span> to Food & Beverage Category. Current monthly total: <span className="font-bold text-teal-800 dark:text-cyan-400">Rp 1,250,000</span>.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 dark:bg-cyan-400/10 border border-teal-500/20 dark:border-cyan-400/20 text-[10px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-widest">
                <RiSparkling2Line size={12} className="animate-pulse" />
                Logged Successfully
              </div>
            </div>
          } 
          time="09:42 AM" 
          insight={{
            title: "INSIGHT",
            content: "This is your 4th restaurant visit this week. You're 15% above your dining budget."
          }}
        />

        <ChatBubble 
          type="user" 
          message="Beli bensin Shell 200rb barusan" 
          time="09:45 AM" 
        />

        {/* Typing Indicator */}
        <div className="flex items-start gap-3 opacity-80">
          <div className="w-10 h-10 rounded-xl bg-blue-950 dark:bg-slate-800 flex items-center justify-center text-cyan-400 shadow-sm">
            <RiRobot2Line size={22} />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center h-10">
             <div className="w-1.5 h-1.5 bg-teal-700/70 dark:bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
             <div className="w-1.5 h-1.5 bg-teal-700/70 dark:bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
             <div className="w-1.5 h-1.5 bg-teal-700/70 dark:bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      </div>

    </div>

  );
}