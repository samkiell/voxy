import React from 'react';
import { CheckCircle2, AlertTriangle, Infinity } from 'lucide-react';

const ProfileCompletion = ({ completion }) => {
  const isLive = completion >= 80;

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-white tracking-tight">Business Profile Completion</h2>
        <span className={`text-2xl font-black ${isLive ? 'text-[#00D18F]' : 'text-orange-500'}`}>
          {completion}%
        </span>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-4 mb-6 relative overflow-hidden">
        <div 
          className={`h-4 rounded-full transition-all duration-1000 ease-out fill-mode-forwards ${
            isLive ? 'bg-gradient-to-r from-emerald-500 to-[#00D18F]' : 'bg-gradient-to-r from-orange-600 to-orange-400'
          }`}
          style={{ width: `${completion}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>

      {isLive ? (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <CheckCircle2 size={24} className="shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Your business is now visible to customers!</p>
            <p className="opacity-80">You've reached the 80% completion threshold.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400">
          <AlertTriangle size={24} className="shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Almost there!</p>
            <p className="opacity-80">Complete at least 80% of your profile to appear in search results.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletion;
