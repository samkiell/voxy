import React from 'react';
import { Clock, User } from 'lucide-react';

const ConversationHeader = ({ customerName, status, startTime }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'AI Responding':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'AI Resolved':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Needs Owner Response':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="bg-zinc-900 border-b border-white/5 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D18F] to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {customerName?.charAt(0) || 'C'}
        </div>
        <div>
          <h1 className="text-white font-black text-lg flex items-center gap-2">
            {customerName || 'Anonymous Customer'}
            <User size={16} className="text-zinc-500" />
          </h1>
          <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
            <Clock size={12} />
            Started: {startTime ? new Date(startTime).toLocaleString() : 'Just now'}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(status)} transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default ConversationHeader;
