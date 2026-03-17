import React from 'react';
import { Check, X, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const ProfileHealth = ({ business }) => {
  const fields = [
    { label: 'Business Name', key: 'name' },
    { label: 'Description', key: 'description' },
    { label: 'Category', key: 'category' },
    { label: 'Business Hours', key: 'business_hours' },
    { label: 'Assistant Tone', key: 'assistant_tone' },
  ];

  const completedFields = fields.filter(f => !!business?.[f.key]).length;
  const completionPercentage = Math.round((completedFields / fields.length) * 100);

  return (
    <div className="bg-[#111111] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl sticky top-6 overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D18F]/5 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-[#00D18F]/10 text-[#00D18F]">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="text-xl font-display font-black text-white italic tracking-tight">Trust <span className="text-[#00D18F]">Score</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Identity verification</p>
        </div>
      </div>
      
      <div className="space-y-5 mb-10">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center justify-between group/item">
            <span className="text-zinc-500 group-hover/item:text-zinc-300 transition-colors text-xs font-bold">{field.label}</span>
            {business?.[field.key] ? (
              <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-500">
                <Check size={12} strokeWidth={4} />
              </div>
            ) : (
              <div className="bg-white/5 p-1.5 rounded-lg text-zinc-700">
                <X size={12} strokeWidth={4} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-white/[0.03]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Efficiency</span>
          <span className={`text-sm font-black italic tracking-tighter ${completionPercentage === 100 ? 'text-[#00D18F]' : 'text-zinc-400'}`}>
            {completionPercentage}%
          </span>
        </div>
        
        <div className="w-full bg-white/[0.03] rounded-full h-3 mb-8 overflow-hidden p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,209,143,0.3)] bg-gradient-to-r from-[#00D18F] to-emerald-400`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <Link 
          href="/business/settings"
          className="w-full group/btn relative flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#00D18F] hover:text-black transition-all duration-500 active:scale-95"
        >
          Optimize Profile
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ProfileHealth;
