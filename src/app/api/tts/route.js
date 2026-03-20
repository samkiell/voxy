import { NextResponse } from 'next/server';
import { detectLanguage } from '@/lib/langDetect';
import { synthesize, checkEspeakAvailability } from '@/lib/tts';

/**
 * POST /api/tts
 * 
 * Multilingual Text-to-Speech endpoint using espeak-ng.
 * Supports: Yoruba (yo), Igbo (ig), Hausa (ha), English (en).
 * 
 * Request body: { "text": "user input text" }
 * Response: audio/wav binary stream
 * 
 * Error responses: JSON { error: string }
 */

// Simple in-memory rate limiter
const rateLimiter = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;      // 30 requests per minute per IP

// Language usage logger (in-memory, logs to console)
const langUsageLog = { yo: 0, ig: 0, ha: 0, en: 0 };

function getRateLimitKey(req) {
  return req.headers.get('x-forwarded-for')
    || req.headers.get('x-real-ip')
    || 'unknown';
}

function checkRateLimit(key) {
  const now = Date.now();
  const entry = rateLimiter.get(key);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimiter.set(key, { windowStart: now, count: 1 });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}

// Periodic cleanup of stale rate limiter entries (every 5 min)
if (typeof globalThis.__ttsRateLimiterCleanup === 'undefined') {
  globalThis.__ttsRateLimiterCleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimiter) {
      if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
        rateLimiter.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export async function POST(req) {
  try {
    // Rate limiting
    const clientKey = getRateLimitKey(req);
    if (!checkRateLimit(clientKey)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 }
      );
    }

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { text } = body || {};

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Field "text" is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text exceeds maximum length of 5000 characters' },
        { status: 400 }
      );
    }

    // Detect language
    const detection = detectLanguage(text);
    console.log(`[TTS API] Language detected: ${detection.langName} (${detection.langCode}), raw: ${detection.raw}`);

    // Track language usage
    if (langUsageLog[detection.langCode] !== undefined) {
      langUsageLog[detection.langCode]++;
    }

    // Generate speech
    const audioBuffer = await synthesize(text.trim(), detection.langCode);

    console.log(`[TTS API] Generated ${audioBuffer.length} bytes of WAV audio for "${text.slice(0, 50)}..." [${detection.langName}]`);
    console.log(`[TTS API] Usage stats:`, langUsageLog);

    // Return WAV audio buffer
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.length.toString(),
        'X-Detected-Language': detection.langName,
        'X-Language-Code': detection.langCode,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('[TTS API] Error:', error);

    // Check if it's an espeak-ng availability issue
    if (error.message?.includes('ENOENT') || error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'espeak-ng is not installed or not in PATH. See installation instructions.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error during speech synthesis' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tts
 * 
 * Health check — verifies espeak-ng is available.
 */
export async function GET() {
  const status = await checkEspeakAvailability();
  return NextResponse.json({
    service: 'voxy-tts',
    engine: 'espeak-ng',
    supportedLanguages: ['yo (Yoruba)', 'ig (Igbo)', 'ha (Hausa)', 'en (English)'],
    espeakStatus: status,
    usage: langUsageLog,
  });
}
