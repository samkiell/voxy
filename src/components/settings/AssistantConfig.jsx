import React from 'react';
import { Zap, ShieldCheck, Smile, Briefcase } from 'lucide-react';

const tones = [
  { id: 'Friendly', icon: Smile, color: 'text-yellow-400' },
  { id: 'Professional', icon: Briefcase, color: 'text-blue-400' },
  { id: 'Casual', icon: Zap, color: 'text-orange-400' },
  { id: 'Formal', icon: ShieldCheck, color: 'text-purple-400' }
];

const AssistantConfig = ({ config, setConfig }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleToneSelect = (tone) => {
    setConfig(prev => ({ ...prev, assistant_tone: tone }));
  };

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Assistant Configuration</h2>
        <p className="text-sm text-zinc-500">Fine-tune how your AI responds to customers.</p>
      </div>
      
      <div className="space-y-4">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Assistant Tone</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {tones.map(({ id, icon: Icon, color }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleToneSelect(id)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                config.assistant_tone === id
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  : 'bg-black/40 text-zinc-500 border-white/5 hover:border-white/20'
              }`}
            >
              <Icon size={24} className={config.assistant_tone === id ? 'text-black' : color} />
              <span className="text-xs font-black uppercase">{id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Assistant Instructions</label>
        </div>
        <textarea
          name="assistant_instructions"
          value={config.assistant_instructions || ''}
          onChange={handleChange}
          placeholder="e.g. Answer customer questions clearly. If they ask about prices, encourage them to visit the store."
          rows={6}
          className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-[#00D18F]/50 transition-all resize-none shadow-inner text-sm leading-relaxed"
        />
        <p className="text-[10px] text-zinc-600 px-1 italic">
          These instructions define the AI's personality and core mission.
        </p>
      </div>
    </div>
  );
};

export default AssistantConfig;
