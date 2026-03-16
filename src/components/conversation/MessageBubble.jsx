import React from 'react';

const MessageBubble = ({ message, senderType }) => {
  const isOwner = senderType === 'owner';
  const isAI = senderType === 'ai';
  const isCustomer = senderType === 'customer';

  const getSenderLabel = () => {
    if (isOwner) return 'You';
    if (isAI) return 'AI Assistant';
    return 'Customer';
  };

  return (
    <div className={`flex flex-col mb-6 ${isOwner ? 'items-end' : 'items-start'}`}>
      <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isOwner ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
            {getSenderLabel()}
          </span>
          <span className="text-[10px] text-zinc-600">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg transition-all hover:scale-[1.01] ${
          isOwner 
            ? 'bg-[#00D18F] text-black font-medium rounded-tr-none' 
            : isAI
              ? 'bg-zinc-800 text-white border border-white/5 rounded-tl-none'
              : 'bg-zinc-900 text-zinc-100 border border-white/10 rounded-tl-none'
        }`}>
          {message.content}
          
          {/* Subtle glow for AI messages */}
          {isAI && (
            <div className="absolute inset-0 rounded-2xl bg-[#00D18F]/5 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
