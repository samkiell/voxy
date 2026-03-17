import React from 'react';
import Link from 'next/link';
import { ChevronRight, MessageSquare, Volume2 } from 'lucide-react';

const RecentConversations = ({ conversations }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'AI Responding':
        return <span className="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500">AI Active</span>;
      case 'AI Resolved':
        return <span className="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">Resolved</span>;
      case 'Needs Owner Response':
        return <span className="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500">Needs Review</span>;
      default:
        return <span className="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest bg-zinc-800 text-zinc-500">{status}</span>;
    }
  };

  return (
    <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <div className="p-8 border-b border-white/[0.03] flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-black text-white italic tracking-tight">Recent <span className="text-[#00D18F]">Activity</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Live interactions</p>
        </div>
        <Link href="/business/conversation" className="text-[10px] font-black uppercase tracking-widest text-[#00D18F] hover:text-white transition-colors">
          View All
        </Link>
      </div>

      <div className="divide-y divide-white/[0.03]">
        {conversations && conversations.length > 0 ? (
          conversations.map((conv) => (
            <Link 
              key={conv.id} 
              href={`/business/conversation/${conv.id}`}
              className="flex items-center justify-between p-8 hover:bg-white/[0.01] transition-all group"
            >
              <div className="flex items-center gap-6 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="size-14 rounded-2xl bg-gradient-to-tr from-[#00D18F]/20 to-emerald-400/20 flex items-center justify-center text-[#00D18F] font-black text-lg border border-[#00D18F]/10">
                    {conv.customer_name?.charAt(0) || 'C'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 bg-black rounded-lg border border-white/5">
                    <Volume2 className="w-3 h-3 text-[#00D18F]" />
                  </div>
                </div>

                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold tracking-tight truncate">{conv.customer_name || 'Anonymous'}</span>
                    {getStatusBadge(conv.status)}
                  </div>
                  <p className="text-zinc-500 text-sm italic truncate max-w-[200px] sm:max-w-md">
                    "{conv.last_message || 'N/A'}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hidden sm:block">
                  {conv.time}
                </span>
                <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))
        ) : (
          <div className="p-20 text-center">
            <div className="size-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
              <MessageSquare className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-zinc-500 font-medium italic">No recent activity detected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentConversations;
