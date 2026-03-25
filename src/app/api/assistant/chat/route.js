import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateAIResponse } from "@/lib/ai/core/generateAIResponse";
import { 
  buildBusinessSummary, 
  shouldIncludeBusinessContext, 
  buildAIPayload,
  summarizeConversation,
  detectIntent
} from '@/lib/ai-context';
import { notifyBusiness } from '@/lib/notifications';
import { detectLanguageGemini, validateResponseLanguage } from '@/lib/ai/utils/language';
import { trackUsage } from '@/lib/tracking';
import { trackAIUsage } from '@/lib/ai/observability';
import { getFallbackResponse, validateAIResponse } from '@/lib/ai/utils/fallback';
import { deductCredit, CREDIT_ERRORS } from '@/lib/services/credit-service';

export async function POST(req) {
  try {
    const body = await req.json();
    const { conversationId } = body;

    if (!conversationId) return NextResponse.json({ success: false, error: 'Conversation ID is required' }, { status: 400 });

    // 1. Parallel Context Loading (High-Speed Optimization)
    // Fetch DB record and build context concurrently
    const convRes = await db.query(`
      SELECT c.*, b.name as business_name, b.category, b.assistant_tone, b.assistant_instructions, b.description as business_desc, b.ai_summary, b.credit_balance, u.name as customer_name
      FROM conversations c
      JOIN businesses b ON c.business_id = b.id
      LEFT JOIN users u ON c.customer_id = u.id
      WHERE c.id = $1
    `, [conversationId]);
    
    if (convRes.rowCount === 0) return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    const conv = convRes.rows[0];

    // Credit Gate
    if (conv.credit_balance <= 0) return NextResponse.json({ error: 'NO_CREDITS', message: 'No credits' }, { status: 403 });

    // Get last user message
    const lastMsgRes = await db.query('SELECT content FROM messages WHERE conversation_id = $1 AND sender_type = $2 ORDER BY created_at DESC LIMIT 1', [conversationId, 'customer']);
    const lastMessage = lastMsgRes.rows[0]?.content || '';

    // 2. Parallel AI Context Engine (The sub-2s engine)
    // We run language detection and summarization in parallel
    const [detectedLanguage, summary] = await Promise.all([
      detectLanguageGemini(lastMessage), // This should ideally be fast or use a local fallback
      conv.summary ? Promise.resolve(conv.summary) : summarizeConversation(conversationId)
    ]);

    // Intent Detection (Local Regex-powered is faster)
    const intent = detectIntent(lastMessage, { category: conv.category });
    if (intent === 'human_request') {
      await notifyBusiness(conversationId, 'high');
      return NextResponse.json({ success: true, message: { content: "One moment, let me call someone to help." } });
    }

    // 3. Build System Instructions (Consolidated)
    const systemInstruction = `You are an AI for ${conv.business_name}. Tone: ${conv.assistant_tone}. Respond ONLY in ${detectedLanguage}. ${conv.assistant_instructions}`;
    const normalizedPayload = await buildAIPayload(conversationId, !!summary);

    // 4. Generate AI Response (Primary Logic)
    // Circuit Breaker handled internally in generateAI
    const aiResponse = await generateAI({
      userId: conv.customer_id,
      businessId: conv.business_id,
      prompt: normalizedPayload,
      systemInstruction
    });

    // 5. Finalize & Save (Non-blocking tracking)
    try {
      await deductCredit(conv.business_id);
    } catch (e) { return NextResponse.json({ error: 'CREDIT_ERROR' }, { status: 403 }); }

    const saveRes = await db.query('INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3) RETURNING *', [conversationId, 'ai', aiResponse.text]);
    
    return NextResponse.json({ success: true, message: saveRes.rows[0], language: detectedLanguage, latencyMs: aiResponse.latency });

  } catch (error) {
    console.error('[CHAT-ROUTE-ERROR]:', error);
    return NextResponse.json({ success: false, error: 'Engine overload' }, { status: 500 });
  }
}
