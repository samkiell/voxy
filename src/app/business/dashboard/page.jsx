"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import StatsCards from '@/components/dashboard/StatsCards';
import ConversationChart from '@/components/dashboard/ConversationChart';
import RecentConversations from '@/components/dashboard/RecentConversations';
import ProfileHealth from '@/components/dashboard/ProfileHealth';
import { Loader2 } from 'lucide-react';

export default function BusinessDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    activeToday: 0,
    aiResolved: 0,
    ownerInterventions: 0
  });
  const [chartData, setChartData] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Business Info
        // Assuming the business is linked to the user. Fetching the first one for now.
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.id) // Assuming owner_id links business to user
          .single();

        if (businessError) {
          console.error('Error fetching business:', businessError);
          // If no business found, use a placeholder for demo purposes if needed
          // setBusiness({ name: "Your Business" });
        } else {
          setBusiness(businessData);
        }

        const businessId = businessData?.id || 1; // Fallback for demo

        // 2. Fetch Stats
        // Total Conversations
        const { count: totalCount } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', businessId);

        // AI Resolved
        const { count: resolvedCount } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', businessId)
          .eq('status', 'AI Resolved');

        // Active Today (Conversations with messages today)
        const today = new Date().toISOString().split('T')[0];
        const { data: activeTodayData } = await supabase
          .from('messages')
          .select('conversation_id')
          .gte('created_at', `${today}T00:00:00`)
          .eq('sender_type', 'customer');
        
        const uniqueActiveIds = new Set(activeTodayData?.map(m => m.conversation_id));

        // Owner Interventions (Conversations with owner replies)
        const { data: interventionData } = await supabase
          .from('messages')
          .select('conversation_id')
          .eq('sender_type', 'owner');
        
        const uniqueInterventionIds = new Set(interventionData?.map(m => m.conversation_id));

        setStats({
          total: totalCount || 0,
          activeToday: uniqueActiveIds.size || 0,
          aiResolved: resolvedCount || 0,
          ownerInterventions: uniqueInterventionIds.size || 0
        });

        // 3. Fetch Recent Conversations
        const { data: recentConvs } = await supabase
          .from('conversations')
          .select(`
            id,
            status,
            created_at,
            messages (
              content,
              created_at
            )
          `)
          .eq('business_id', businessId)
          .order('created_at', { ascending: false })
          .limit(10);

        const formattedConvs = recentConvs?.map(conv => ({
          id: conv.id,
          customer_name: "Customer", // In a real app, join with customers/users table
          last_message: conv.messages?.[0]?.content || "No messages yet",
          status: conv.status,
          time: new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })) || [];

        setConversations(formattedConvs);

        // 4. Fetch Chart Data (Mocking for now as Supabase grouping is complex)
        // In a real app, you'd use a postgres function or group by dates in JS
        const mockChartData = [
          { name: 'Mon', count: 12 },
          { name: 'Tue', count: 18 },
          { name: 'Wed', count: 15 },
          { name: 'Thu', count: 25 },
          { name: 'Fri', count: 32 },
          { name: 'Sat', count: 20 },
          { name: 'Sun', count: 14 },
        ];
        setChartData(mockChartData);

      } catch (err) {
        console.error('Dashboard Data Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-zinc-400 mb-8">Please log in to view your business dashboard.</p>
        <a href="/login" className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold">Login</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <header className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-zinc-400 text-lg">
            Welcome back, <span className="text-emerald-400 font-semibold">{user.name || 'Samuel'}</span>. 
            Here’s what’s happening with your business today.
          </p>
        </header>

        {/* Stats Cards Section */}
        <StatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart & Table */}
          <div className="lg:col-span-2 space-y-8">
            <ConversationChart data={chartData} />
            <RecentConversations conversations={conversations} />
          </div>

          {/* Sidebar / Profile Health */}
          <div className="space-y-8">
            <ProfileHealth business={business} />
            
            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-6 rounded-2xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16" />
              <h3 className="text-lg font-bold mb-2">Need help?</h3>
              <p className="text-zinc-400 text-sm mb-6">Explore our guides on how to train your AI assistant more effectively.</p>
              <button className="text-emerald-400 text-sm font-semibold hover:underline">View Documentation →</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
