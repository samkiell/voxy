"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Recharts to prevent build errors if the package is missing
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

const ConversationChart = ({ data, timeRange, setTimeRange }) => {
  const [isRechartsLoaded, setIsRechartsLoaded] = useState(false);

  useEffect(() => {
    // Check if recharts can be loaded
    import('recharts').then(() => {
      setIsRechartsLoaded(true);
    }).catch(() => {
// Keep false
    });
  }, []);

  return (
    <div className="bg-[#111111] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D18F]/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-display font-black text-white italic tracking-tight">Activity <span className="text-[#00D18F]">Insights</span></h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Message volume overview</p>
        </div>
        
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl self-start border border-white/5">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                timeRange === range 
                  ? 'bg-[#00D18F] text-black shadow-lg shadow-[#00D18F]/20' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {range === '24h' ? '24h' : range === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[320px] w-full relative z-10">
        {isRechartsLoaded && data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="8 8" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#3f3f46" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontWeight: 800, letterSpacing: '0.1em' }}
              />
              <YAxis 
                stroke="#3f3f46" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
                tick={{ fontWeight: 800 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  padding: '12px 16px'
                }}
                itemStyle={{ color: '#00D18F', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#00D18F" 
                strokeWidth={5}
                dot={{ fill: '#00D18F', strokeWidth: 4, r: 6, stroke: '#111111' }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : !isRechartsLoaded ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4 border-2 border-dashed border-white/5 rounded-3xl">
            <div className="size-12 rounded-full border-4 border-[#00D18F]/20 border-t-[#00D18F] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Initializing Engine</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4">
            <div className="w-16 h-1 bg-white/5 rounded-full" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">No activity detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationChart;
