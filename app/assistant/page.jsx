import DashboardLayout from '@/components/layout/DashboardLayout';
import { Mic } from 'lucide-react';

export default function AssistantPage() {
  return (
    <DashboardLayout title="AI Assistant">
      <div className="p-8 h-full flex flex-col">
        <h1 className="text-3xl font-bold text-white tracking-tight">AI Assistant</h1>
        <p className="mt-2 text-zinc-400">Interface where businesses interact with the AI assistant using text or voice.</p>
        
        <div className="flex-1 mt-8 bg-zinc-900/40 rounded-2xl border border-white/5 p-6 flex flex-col justify-end">
          <div className="text-center text-zinc-500 mb-6 italic text-sm">No messages yet. Start a conversation above.</div>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D18F]/50" 
              disabled 
            />
            <button className="px-6 py-3 bg-[#00D18F] text-black font-bold rounded-xl opacity-50 cursor-not-allowed transition-all">Send</button>
            <button className="p-3 bg-zinc-800 text-zinc-400 rounded-xl opacity-50 cursor-not-allowed hover:bg-zinc-700 transition-all flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
