import React, { useState } from 'react';
import { Clock, User, ShieldCheck, Bot, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConversationHeader = ({ customerName, status, startTime, businessLogo, useAi, onToggleAi, onClearChat }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-black border-b border-white/[0.03] px-4 py-4 sm:px-8 sm:py-6 flex items-center justify-between gap-4 relative z-20">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative">
          <div className="size-12 sm:size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl">
            {businessLogo ? (
              <img src={businessLogo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center bg-voxy-primary/10 text-voxy-primary font-bold text-xl">
                {customerName?.charAt(0) || 'C'}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 bg-black rounded-lg border border-white/10 shadow-xl">
            <ShieldCheck className="w-3 h-3 text-[#00D18F]" />
          </div>
        </div>

        <div>
           <h2 className="font-display font-bold text-lg sm:text-2xl text-white tracking-tight leading-tight">
            {customerName || "Customer"}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active Now' ? 'bg-[#00D18F] shadow-[0_0_8px_#00D18F]' : 'bg-zinc-600'}`}></span>
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              {status || 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleAi}
          className={`rounded-xl sm:rounded-2xl hover:bg-white/5 h-10 w-10 sm:h-12 sm:w-12 transition-colors ${useAi ? 'text-[#00D18F]' : 'text-zinc-500'}`}
        >
          <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-xl sm:rounded-2xl hover:bg-white/5 text-zinc-500 h-10 w-10 sm:h-12 sm:w-12"
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <button 
                onClick={() => {
                  onClearChat();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-white/5 transition-colors"
              >
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
