"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="w-full max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between relative z-50">
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <div className="w-5 h-5 rounded-full bg-voxy-primary"></div>
        <span className="font-bold text-[20px] tracking-tight text-voxy-text">VOXY</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#problem" className="text-[14px] font-medium text-voxy-textMuted hover:text-voxy-text transition-colors">The Problem</a>
        <a href="#how-it-works" className="text-[14px] font-medium text-voxy-textMuted hover:text-voxy-text transition-colors">How it Works</a>
        <a href="#features" className="text-[14px] font-medium text-voxy-textMuted hover:text-voxy-text transition-colors">Features</a>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" className="hidden md:inline-flex" onClick={() => router.push('/login')}>
          Log in
        </Button>
        <Button onClick={() => router.push('/signup')}>
          Get Started
        </Button>
      </div>
    </nav>
  );
}
