import { trackAIUsage } from './observability.js';
import { callCencoriAI } from './cencori.js';
import { runSecurityChecks } from './cencori-security.js';
import { generateGeminiResponse } from './providers/gemini.js'; // Fallback provider
import { generateGroqResponse } from './providers/groq.js';   // Fallback provider

/**
 * Resilient AI Provider Layer (Step 2)
 * Centralizes primary Cencori execution with robust internal fallbacks.
 */
export async function generateAI({ userId, businessId, prompt, type = 'chat', model = 'gpt-4o-mini', systemInstruction = "" }) {
  
  // 1. PRE-PROCESSING SECURITY SCAN (Step 3 & 4 Upgrade)
  // Ensures active protection + sanitization before any tokens are sent.
  const rawInput = typeof prompt === 'string' ? prompt : prompt[prompt.length - 1].content;
  const security = await runSecurityChecks(rawInput);

  if (security.riskLevel === 'high') {
    console.warn(`🛡️ [AI-PROVIDER] High Risk Detected: ${security.flags.join(', ')}. Sanitizing aggressively.`);
  }

  // Use sanitized input for the actual AI call
  const sanitizedInput = security.sanitizedInput;

  // Rebuild prompt/messages if it was an array
  const finalPrompt = typeof prompt === 'string' 
    ? sanitizedInput 
    : prompt.map((m, i) => i === prompt.length - 1 ? { ...m, content: sanitizedInput } : m);

  // 2. EXECUTION WITH INTERNAL OBSERVABILITY
  return await trackAIUsage(
    { userId, businessId, requestType: type, provider: "cencori", model },
    async () => {
      try {
        // A. PRIMARY GATEWAY: CENCORI
        const res = await callCencoriAI({ 
          prompt: finalPrompt, 
          model, 
          metadata: { systemInstruction } 
        });
        
        return {
          ...res,
          ...security, // Inject riskLevel, wasSanitized for Step 5 logging
          providerUsed: "cencori"
        };
      } catch (err) {
        // B. SECONDARY FALLBACK: DIRECT PROVIDER
        console.warn(`⚠️ [AI-PROVIDER] Cencori Gateway failed. Falling back to direct provider...`);
        
        try {
          const fallbackRes = await generateGroqResponse(finalPrompt, systemInstruction);
          return {
            ...fallbackRes,
            ...security, // Carry security metadata to fallback log
            providerUsed: "groq (fallback)",
            fallbackUsed: true
          };
        } catch (fallbackErr) {
          console.error(`❌ [AI-PROVIDER] Primary Fallback failed. Trying Final Fallback (Gemini)...`);
          const finalRes = await generateGeminiResponse(finalPrompt, systemInstruction);
          return {
            ...finalRes,
            ...security, 
            providerUsed: "gemini (fallback)",
            fallbackUsed: true
          };
        }
      }
    }
  );
}
