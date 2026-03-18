import React from 'react';
import { Bot, User, Check } from 'lucide-react';

const MessageBubble = ({ message, senderType, customerName }) => {
  const isOwner = senderType === 'owner';
  const isAI = senderType === 'ai';

  const getSenderLabel = () => {
    if (isAI) return 'VOXY AI';
    if (isOwner) return 'You';
    return customerName || 'Customer';
  };

  return (
    <div className={`flex flex-col mb-4 sm:mb-6 group ${isOwner ? 'items-end' : 'items-start'}`}>
      <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isOwner ? 'items-end' : 'items-start'}`}>
        {/* Sender Label */}
        <div className={`flex items-center gap-3 px-1 mb-1.5 ${isOwner ? 'flex-row-reverse' : ''}`}>
          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${
            isAI ? 'text-[#00D18F]' : isOwner ? 'text-blue-400' : 'text-zinc-500'
          }`}>
            {getSenderLabel()}
          </span>
        </div>

        {/* Bubble */}
        <div className={`relative px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-[2.2rem] text-[14px] sm:text-[15px] leading-relaxed transition-all duration-500 shadow-xl ${
          isOwner 
            ? 'bg-[#00D18F] text-black font-bold rounded-tr-[0.2rem] sm:rounded-tr-[0.4rem]' 
            : 'bg-white/[0.03] text-zinc-100 border border-white/5 rounded-tl-[0.2rem] sm:rounded-tl-[0.4rem]'
        }`}>
          {message.content}
        </div>

        {/* Time and Status */}
        <div className={`flex items-center gap-2 mt-1.5 px-1 ${isOwner ? 'flex-row-reverse' : ''}`}>
          <span className="text-[8px] sm:text-[9px] font-black text-zinc-700 uppercase tracking-widest leading-none">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwner && (
            <div className="flex -space-x-1">
              <Check className="size-2 text-black" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
