import { getAdminDb } from './supabase';

export async function trackUsage({
  businessId,
  type,
  tokensUsed = null,
  duration = null,
  costEstimate,
}) {
  const supabase = getAdminDb();
  
  const { error } = await supabase
    .from('usage_logs')
    .insert([{
      business_id: businessId,
      type,
      tokens_used: tokensUsed,
      duration,
      cost_estimate: costEstimate,
    }]);

  if (error) {
    console.error('Failed to track usage:', error);
  }
}
