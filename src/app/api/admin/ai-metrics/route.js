import { NextResponse } from 'next/server';
import { isAdmin, adminError } from '@/lib/adminAuth';

export async function GET() {
  const auth = await isAdmin();
  if (!auth.authorized) return adminError(auth.error, auth.status);

  const supabase = await import('@/lib/supabase').then(m => m.getAdminDb());
  
  // Real AI usage metrics from ai_usage_logs (Unified Observability)
  const { data: logs, error } = await supabase
    .from('ai_usage_logs')
    .select('request_type, input_size, latency, cost_estimate, created_at, status')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // last 30 days
  
  if (error) {
    console.error('Failed to fetch AI usage logs:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
  
  const totalRequests = logs.length;
  if (totalRequests === 0) {
    return NextResponse.json({
      success: true,
      metrics: {
        total_tokens: 0,
        avg_latency: '0ms',
        error_rate: '0%',
        model_distribution: [
          { name: 'Language Engine', usage: 100 },
          { name: 'Speech Synthesis', usage: 0 },
        ],
        usage_trends: []
      }
    });
  }

  let totalTokens = 0;
  let totalLatency = 0;
  let errorCount = 0;
  const modelUsage = { chat: 0, voice: 0, system: 0 };
  const dailyTrends = {};

  logs.forEach(log => {
    totalTokens += (log.input_size || 0);
    totalLatency += (log.latency || 0);
    if (log.status === 'error') errorCount++;

    const type = log.request_type || 'chat';
    modelUsage[type] = (modelUsage[type] || 0) + 1;

    const date = new Date(log.created_at).toISOString().split('T')[0];
    if (!dailyTrends[date]) dailyTrends[date] = 0;
    dailyTrends[date] += (log.input_size || 0);
  });

  const avgLatency = Math.round(totalLatency / totalRequests);
  const errorRate = ((errorCount / totalRequests) * 100).toFixed(2);

  const metrics = {
    total_tokens: totalTokens,
    avg_latency: `${avgLatency}ms`,
    error_rate: errorRate,
    model_distribution: [
      { name: 'Voice & Speech', usage: Math.round((modelUsage.voice / totalRequests) * 100) },
      { name: 'Chat Engine', usage: Math.round((modelUsage.chat / totalRequests) * 100) },
      { name: 'System Context', usage: Math.round((modelUsage.system / totalRequests) * 100) },
    ],
    usage_trends: Object.entries(dailyTrends)
      .map(([date, tokens]) => ({ date, tokens }))
      .sort((a, b) => a.date.localeCompare(b.date))
  };

  return NextResponse.json({ success: true, metrics });
}
