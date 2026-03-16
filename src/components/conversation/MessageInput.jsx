import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() && !isLoading) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-zinc-900 border-t border-white/5">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-3">
        <div className="flex-1 relative group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="w-full bg-black border border-white/10 rounded-2xl py-3 px-4 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#00D18F]/50 transition-all resize-none max-h-32"
          />
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="bg-[#00D18F] text-black p-3.5 rounded-xl font-bold hover:bg-[#00B078] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Send size={18} className="group-active:scale-90 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
