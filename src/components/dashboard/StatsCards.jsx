import React from 'react';
import { MessageSquare, Users, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';

const StatsCard = ({ title, value, description, icon: Icon, colorClass, gradientClass }) => (
  <div className="relative group overflow-hidden bg-[#111111] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl transition-all duration-700 hover:border-[#00D18F]/30 hover:-translate-y-1">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl`} />
    
    <div className="relative z-10 space-y-4">
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 shadow-inner`}>
          <Icon size={24} className="group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="p-2 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <ArrowUpRight size={14} className="text-zinc-500" />
        </div>
      </div>
      
      <div>
        <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
        <p className="text-4xl font-display font-black text-white italic tracking-tighter">{value}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] font-bold text-zinc-600 truncate">{description}</span>
        </div>
      </div>
    </div>
  </div>
);

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Conversations',
      value: stats?.total || 0,
      description: 'Cumulative engagements',
      icon: MessageSquare,
      colorClass: 'text-blue-400 bg-blue-400',
      gradientClass: 'from-blue-500 to-transparent'
    },
    {
      title: 'Active Today',
      value: stats?.activeToday || 0,
      description: 'Conversations active now',
      icon: Users,
      colorClass: 'text-purple-400 bg-purple-400',
      gradientClass: 'from-purple-500 to-transparent'
    },
    {
      title: 'AI Resolved',
      value: stats?.aiResolved || 0,
      description: 'Fully handled by AI',
      icon: CheckCircle,
      colorClass: 'text-[#00D18F] bg-[#00D18F]',
      gradientClass: 'from-[#00D18F] to-transparent'
    },
    {
      title: 'Interventions',
      value: stats?.ownerInterventions || 0,
      description: 'Human-assisted responses',
      icon: AlertCircle,
      colorClass: 'text-orange-400 bg-orange-400',
      gradientClass: 'from-orange-500 to-transparent'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;
