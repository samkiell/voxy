import React from 'react';
import { Clock, Moon } from 'lucide-react';

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const BusinessHoursEditor = ({ hours, setHours }) => {
  const handleToggleClosed = (day) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day]?.closed }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
      <h2 className="text-xl font-bold text-white mb-2">Business Hours</h2>
      
      <div className="space-y-4">
        {days.map((day) => {
          const dayData = hours[day] || { open: '09:00', close: '18:00', closed: false };
          const isClosed = dayData.closed;

          return (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-[#00D18F]/20 transition-all">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isClosed ? 'bg-zinc-800 text-zinc-500' : 'bg-[#00D18F]/10 text-[#00D18F]'}`}>
                  {isClosed ? <Moon size={18} /> : <Clock size={18} />}
                </div>
                <span className={`font-bold transition-colors ${isClosed ? 'text-zinc-500' : 'text-zinc-200'}`}>{day}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    disabled={isClosed}
                    value={dayData.open}
                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                    className="bg-black border border-white/10 rounded-lg py-1.5 px-3 text-sm text-white disabled:opacity-20 transition-opacity focus:outline-none focus:border-[#00D18F]/50"
                  />
                  <span className="text-zinc-600">to</span>
                  <input
                    type="time"
                    disabled={isClosed}
                    value={dayData.close}
                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                    className="bg-black border border-white/10 rounded-lg py-1.5 px-3 text-sm text-white disabled:opacity-20 transition-opacity focus:outline-none focus:border-[#00D18F]/50"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleClosed(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${
                    isClosed 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {isClosed ? 'Closed' : 'Open'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessHoursEditor;
