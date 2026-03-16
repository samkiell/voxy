import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages }) => {
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          <MessageBubble 
            key={msg.id || index} 
            message={msg} 
            senderType={msg.sender_type} 
          />
        ))
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-zinc-500 italic space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
            <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p>Start the conversation below.</p>
        </div>
      )}
      <div ref={scrollRef} className="h-4" />
    </div>
  );
};

export default MessageList;
