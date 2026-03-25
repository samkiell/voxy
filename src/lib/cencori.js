import { Cencori } from 'cencori';

/**
 * Shared Cencori Client
 * Ref: https://cencori.com/docs
 */
// Stub for Vercel Build (prevents crash during static analysis/build phase when variables aren't yet available)
const apiKey = process.env.CENCORI_SECRET_KEY || process.env.CENCORI_API_KEY || 'csk_build_stub_key_for_vercel';

export const cencoriClient = new Cencori({
  apiKey: apiKey,
});
