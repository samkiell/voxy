"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Star, MessageSquare, MapPin, Loader2, Bot } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FindBusinessPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/businesses?public=true');
        const data = await res.json();
        if (data.success) {
          setBusinesses(data.businesses);
        } else {
          throw new Error(data.error || 'Failed to fetch');
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (b.custom_category && b.custom_category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout title="Find Business">
      <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out p-4 md:p-8">
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-8">
          <Badge className="bg-[#00D18F]/10 text-[#00D18F] border-none px-4 py-1.5 rounded-full text-xs font-black tracking-[0.3em] uppercase mb-4">
            Directory
          </Badge>
          <h1 className="text-5xl md:text-7xl font-display font-black text-zinc-900 dark:text-white tracking-tighter leading-[1] italic">
            Find <span className="text-[#00D18F]">Businesses</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
            Search for local businesses to inquire about services or make bookings.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto group">
          <div className="absolute inset-x-0 -top-20 h-64 bg-gradient-radial from-[#00D18F]/10 to-transparent blur-3xl opacity-50"></div>
          <div className="relative flex items-center bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 rounded-[3rem] p-3 shadow-2xl focus-within:ring-[12px] focus-within:ring-[#00D18F]/5 focus-within:border-[#00D18F]/30 transition-all duration-700">
            <Search className="w-6 h-6 ml-6 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search by name, category, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium tracking-tight"
            />
            <Button className="bg-[#00D18F] hover:bg-[#00A370] text-white rounded-[2.5rem] h-14 px-10 shadow-xl shadow-[#00D18F]/20 transition-all duration-500 active:scale-95 text-xs font-black uppercase tracking-widest">
              Search
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-8 opacity-60">
            {['Restaurants', 'Technology', 'Retail', 'Wellness'].map(cat => (
              <button key={cat} onClick={() => setSearchQuery(cat)} className="px-5 py-2 rounded-full border border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:bg-[#00D18F] hover:text-white hover:border-[#00D18F] transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <Loader2 className="w-16 h-16 animate-spin text-[#00D18F]" />
            <p className="text-zinc-400 font-black uppercase tracking-[0.4em] text-sm">Loading businesses...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredBusinesses.map((business, idx) => (
              <div 
                key={business.id}
                className="group relative bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-[3.5rem] overflow-hidden hover:shadow-[0_48px_96px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_48px_96px_-12px_rgba(0,0,0,0.4)] transition-all duration-700 animate-in fade-in slide-in-from-bottom-6"
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-0 md:h-full">
                  <div className="h-48 md:h-auto md:w-2/5 overflow-hidden relative flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-[#00D18F]/20 to-[#00A370]/20 flex items-center justify-center">
                      <Bot className="w-12 h-12 md:w-16 md:h-16 text-[#00D18F]/40" />
                    </div>
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 scale-90 md:scale-100">
                      <Badge className="bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-xl text-zinc-900 dark:text-white border-none px-3 py-1 md:px-4 md:py-1.5 rounded-xl md:rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-xl">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        Top Rated
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 space-y-4 md:space-y-6 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-2 md:space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-[#00D18F]/10 text-[#00D18F] border-none px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                          {business.category === 'Other' ? business.custom_category : business.category}
                        </Badge>
                      </div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-zinc-900 dark:text-white group-hover:text-[#00D18F] transition-colors leading-tight tracking-tighter truncate">
                        {business.name}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed font-medium line-clamp-2">
                        {business.description || "Premium business providing excellent services."}
                      </p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-center gap-6 text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-widest border-t border-zinc-100 dark:border-white/5 pt-4 md:pt-8 overflow-hidden">
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#00D18F] flex-shrink-0" />
                          Location
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link href={`/customer/business/${business.id}`} className="w-full">
                          <Button variant="outline" className="w-full border-2 rounded-xl md:rounded-2xl py-3.5 md:py-5 text-[10px] md:text-xs font-black uppercase tracking-widest h-auto">
                            Profile
                          </Button>
                        </Link>
                        <Link href={`/customer/chat/${business.id}`} className="w-full">
                          <Button className="w-full bg-[#00D18F] hover:bg-[#00A370] text-white rounded-xl md:rounded-2xl py-3.5 md:py-5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all h-auto">
                            Chat Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredBusinesses.length === 0 && (
          <div className="text-center py-32 bg-[#fcfcfd] dark:bg-white/5 rounded-[4rem] border-4 border-dashed border-zinc-200 dark:border-white/10">
            <h3 className="text-4xl font-display font-black text-zinc-900 dark:text-white tracking-tighter">No businesses found</h3>
            <p className="text-zinc-500 mt-4 text-xl font-medium opacity-80">Try adjusting your search criteria.</p>
            <Button 
              variant="outline" 
              className="mt-10 rounded-[1.5rem] px-12 h-14 border-2 font-black uppercase tracking-widest text-xs"
              onClick={() => setSearchQuery("")}
            >
              Reset Search
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

