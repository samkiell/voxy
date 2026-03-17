import React from 'react';
import { Bot, User, Check } from 'lucide-react';

const MessageBubble = ({ message, senderType }) => {
  const isOwner = senderType === 'owner';
  const isAI = senderType === 'ai';
  const isCustomer = senderType === 'customer';

  const getSenderLabel = () => {
    if (isOwner) return 'You';
    if (isAI) return 'VOXY AI';
    return 'Customer';
  };

  return (
    <div className={`flex flex-col mb-10 group ${isOwner ? 'items-end' : 'items-start'}`}>
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isOwner ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-3 mb-2 px-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500 ${isOwner ? 'flex-row-reverse' : ''}`}>
          <div className={`size-6 rounded-lg flex items-center justify-center border shadow-sm ${
            isAI ? 'bg-[#00D18F]/10 border-[#00D18F]/20 text-[#00D18F]' : 'bg-white/5 border-white/5 text-zinc-500'
          }`}>
            {isAI ? <Bot size={12} /> : <User size={12} />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            {getSenderLabel()}
          </span>
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className={`relative px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed shadow-2xl transition-all duration-700 hover:scale-[1.01] ${
          isOwner 
            ? 'bg-gradient-to-tr from-[#00D18F] to-emerald-400 text-black font-bold rounded-tr-[0.5rem] shadow-[#00D18F]/10' 
            : 'bg-white/[0.03] text-zinc-100 border border-white/[0.05] rounded-tl-[0.5rem] backdrop-blur-3xl'
        }`}>
          {message.content}
          
          {isOwner && (
            <div className="absolute -bottom-5 right-2 flex items-center gap-1 opacity-40">
               <Check size={10} className="text-[#00D18F]" />
               <span className="text-[8px] font-black uppercase tracking-widest text-[#00D18F]">Delivered</span>
            </div>
          )}

          {isAI && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#00D18F]/20 to-transparent blur-sm rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
