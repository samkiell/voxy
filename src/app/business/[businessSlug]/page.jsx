"use client";

import React, { useState, useEffect, use } from 'react';
import { Loader2, ChevronLeft, Bot, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BusinessStorefront from '@/components/business/BusinessStorefront';

export default function BusinessPublicProfilePage({ params }) {
  const resolvedParams = use(params);
  const { businessSlug } = resolvedParams;
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/businesses?slug=${businessSlug}`);
        const data = await res.json();
        if (data.success && data.business) {
          setBusiness(data.business);
        } else {
          setError("Business not found");
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError("Failed to load business profile");
      } finally {
        setLoading(false);
      }
    };

    if (businessSlug) {
      fetchBusiness();
    }
  }, [businessSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#00D18F]/20 border-t-[#00D18F] rounded-full animate-spin"></div>
          <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#00D18F]" />
        </div>
        <p className="mt-8 text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">Connecting to storefront...</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-10 text-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-8">
          <Info className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 tracking-tighter">{error || "Profile Unavailable"}</h1>
        <p className="text-zinc-500 dark:text-zinc-500 max-w-sm mb-10 font-medium">This business profile might be private or hasn't been set up yet. Check back soon!</p>
        <Link href="/">
          <Button className="bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[10px]">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors duration-500 selection:bg-[#00D18F]/30">
      {/* Dynamic Nav for Public View */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-zinc-100 dark:border-white/5 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
             <div className="text-[10px] font-black italic text-[#00D18F]">V</div>
          </div>
          <span className="text-sm font-black tracking-widest uppercase hidden sm:block">Storefront</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/customer/find-business">
            <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest px-6 h-11 transition-all hover:bg-zinc-100 dark:hover:bg-white/5">
              Explore
            </Button>
          </Link>
          <Link href={`/customer/chat/${business.slug}`}>
            <Button className="bg-[#00D18F] hover:bg-[#00D18F]/90 text-black rounded-xl font-black text-[10px] uppercase tracking-widest px-8 h-11 shadow-lg shadow-[#00D18F]/20">
              Message
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <BusinessStorefront business={business} />
      </main>

      {/* Footer / Copyright */}
      <footer className="py-12 border-t border-zinc-100 dark:border-white/5 px-6 text-center">
        <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.4em]">
          Powered by VOXY AI &copy; 2026
        </p>
      </footer>
    </div>
  );
}
