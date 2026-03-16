"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import ConversationHeader from '@/components/conversation/ConversationHeader';
import MessageList from '@/components/conversation/MessageList';
import MessageInput from '@/components/conversation/MessageInput';
import { Loader2 } from 'lucide-react';

export default function ConversationPage() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Conversation Details
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();

        if (convError) throw convError;
        setConversation(convData);

        // 2. Fetch Messages
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (msgError) throw msgError;
        setMessages(msgData || []);

      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 3. Subscribe to Realtime Updates
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          
          // Re-evaluate conversation status locally if needed
          // Realistically, the DB trigger or backend will handle this, 
          // but we can update the header status if the latest message is from AI
          if (payload.new.sender_type === 'ai') {
            setConversation(prev => ({ ...prev, status: 'AI Responding' }));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`
        },
        (payload) => {
          setConversation(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleSendMessage = async (content) => {
    if (!user || !conversationId) return;
    
    try {
      setSending(true);

      // 1. Insert message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_type: 'owner',
          content: content
        });

      if (msgError) throw msgError;

      // 2. Update conversation status
      const { error: convError } = await supabase
        .from('conversations')
        .update({ status: 'AI Responding' })
        .eq('id', conversationId);

      if (convError) throw convError;

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Conversation">
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="w-10 h-10 animate-spin text-[#00D18F]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!conversation) {
    return (
      <DashboardLayout title="Error">
        <div className="flex flex-col items-center justify-center h-[70vh] text-zinc-500">
          <h2 className="text-xl font-bold text-white mb-2">Conversation not found</h2>
          <p>The conversation may have been deleted or you don't have access.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Chat with ${conversation.customer_name || 'Customer'}`}>
      <div className="flex flex-col h-[calc(100vh-140px)] bg-black rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <ConversationHeader 
          customerName={conversation.customer_name}
          status={conversation.status}
          startTime={conversation.created_at}
        />
        
        <MessageList messages={messages} />
        
        <MessageInput onSendMessage={handleSendMessage} isLoading={sending} />
      </div>
    </DashboardLayout>
  );
}
