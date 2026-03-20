import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

/**
 * Hybrid Multilingual Text-to-Speech (Serverless-Safe)
 * 
 * 3-Tier Fallback Chain:
 *   1. MsEdge Neural (native voice for detected language)
 *   2. Google Translate TTS (direct HTTP, no npm package)
 *   3. MsEdge English voice reading the original text (guaranteed audio)
 * 
 * Returns base64 Data URIs — no filesystem writes, Vercel-safe.
 */
export async function generateHybridSpeech(text, detectedLanguage = 'english') {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    console.error('[HYBRID TTS] Empty input provided, returning null.');
    return null;
  }

  const normalizedLang = detectedLanguage?.toLowerCase() || 'english';

  // ─── TIER 1: MsEdge Neural (native voice) ───
  const tier1Result = await tryMsEdgeNative(text, normalizedLang);
  if (tier1Result) return tier1Result;

  // ─── TIER 2: Google Translate TTS (direct HTTP) ───
  const tier2Result = await tryGoogleTranslateDirect(text, normalizedLang);
  if (tier2Result) return tier2Result;

  // ─── TIER 3: MsEdge English voice reading original text ───
  // Guarantees audio output. Won't have perfect pronunciation for 
  // Yoruba/Igbo/Hausa but the text is still in the correct language.
  const tier3Result = await tryMsEdgeEnglishFallback(text);
  if (tier3Result) return tier3Result;

  throw new Error('All TTS engines failed to generate audio.');
}

/**
 * TIER 1: MsEdge with native African language voices.
 * Known issue: yo/ig/ha voices often produce 0 bytes.
 */
async function tryMsEdgeNative(text, normalizedLang) {
  try {
    const edgeVoiceMap = {
      'english':     'en-NG-AbeoNeural',
      'yoruba':      'yo-NG-OluNeural',
      'hausa':       'ha-NG-AminaNeural',
      'igbo':        'ig-NG-NkechiNeural',
      'unsupported': 'en-US-AriaNeural',
    };

    let voice = edgeVoiceMap[normalizedLang];
    let spokenText = text;

    if (!voice) {
      voice = edgeVoiceMap['unsupported'];
      spokenText = 'Language not supported.';
    }

    console.log(`[TTS T1] MsEdge native: ${voice}`);
    const buffer = await generateMsEdgeAudio(spokenText, voice);

    if (buffer.length < 1024) {
      console.warn(`[TTS T1] Buffer too small (${buffer.length}B) for ${voice}. Skipping.`);
      return null;
    }

    console.log(`[TTS T1] ✅ MsEdge native succeeded: ${buffer.length}B`);
    return `data:audio/mp3;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.warn(`[TTS T1] MsEdge native failed:`, err.message);
    return null;
  }
}

/**
 * TIER 2: Google Translate TTS via direct HTTP.
 * Uses client=gtx (more permissive than tw-ob).
 * Chunks text at ~200 char boundaries.
 */
async function tryGoogleTranslateDirect(text, normalizedLang) {
  try {
    const langMap = {
      'english': 'en',
      'yoruba':  'yo',
      'hausa':   'ha',
      'igbo':    'ig',
      'unsupported': 'en',
    };

    const lang = langMap[normalizedLang] || 'en';
    const spokenText = langMap[normalizedLang] ? text : 'Language not supported.';

    console.log(`[TTS T2] Google Translate direct: lang=${lang}`);
    const buffer = await fetchGoogleTTS(spokenText, lang);

    if (buffer.length < 1024) {
      console.warn(`[TTS T2] Buffer too small (${buffer.length}B). Skipping.`);
      return null;
    }

    console.log(`[TTS T2] ✅ Google Translate succeeded: ${buffer.length}B`);
    return `data:audio/mp3;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.warn(`[TTS T2] Google Translate failed:`, err.message);
    return null;
  }
}

/**
 * TIER 3: MsEdge English voice reading original text.
 * This works because Yoruba/Igbo/Hausa use Latin script
 * and the English voice CAN pronounce them (imperfectly, but audibly).
 */
async function tryMsEdgeEnglishFallback(text) {
  try {
    const voice = 'en-NG-AbeoNeural'; // Nigerian English — closest accent match
    console.log(`[TTS T3] MsEdge English fallback: ${voice}`);

    const buffer = await generateMsEdgeAudio(text, voice);

    if (buffer.length < 1024) {
      console.warn(`[TTS T3] English fallback also produced ${buffer.length}B. Giving up.`);
      return null;
    }

    console.log(`[TTS T3] ✅ MsEdge English fallback succeeded: ${buffer.length}B`);
    return `data:audio/mp3;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error(`[TTS T3] MsEdge English fallback failed:`, err.message);
    return null;
  }
}

// ─── Shared Helpers ───

/**
 * Generate audio via MsEdge TTS. Returns raw Buffer.
 */
async function generateMsEdgeAudio(text, voiceName) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const stream = tts.toStream(text);
  const chunks = [];

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.warn(`[MSEDGE] Stream timeout for ${voiceName}`);
      resolve(); // Don't reject — let buffer validation handle it
    }, 10000);

    stream.audioStream.on('data', chunk => chunks.push(chunk));
    stream.audioStream.on('end', () => { clearTimeout(timeout); resolve(); });
    stream.audioStream.on('error', (err) => { clearTimeout(timeout); reject(err); });
  });

  return Buffer.concat(chunks);
}

/**
 * Fetch TTS audio from Google Translate's endpoint.
 * Uses client=gtx (most permissive, no token needed).
 * Splits long text into ≤200 char chunks.
 */
async function fetchGoogleTTS(text, lang) {
  const chunks = splitText(text, 200);
  const buffers = [];

  for (let i = 0; i < chunks.length; i++) {
    const encoded = encodeURIComponent(chunks[i]);

    // Try gtx client first (most permissive)
    const urls = [
      `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=gtx&q=${encoded}`,
      `https://translate.google.co.uk/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}&textlen=${chunks[i].length}`,
    ];

    let fetched = false;
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://translate.google.com/',
          },
        });

        if (res.ok) {
          const ab = await res.arrayBuffer();
          if (ab.byteLength > 0) {
            buffers.push(Buffer.from(ab));
            fetched = true;
            break;
          }
        }
      } catch {
        continue;
      }
    }

    if (!fetched) {
      throw new Error(`Google TTS failed for chunk ${i + 1}/${chunks.length} in lang '${lang}'`);
    }
  }

  return Buffer.concat(buffers);
}

/**
 * Split text into chunks at sentence/word boundaries.
 */
function splitText(text, maxLen) {
  if (text.length <= maxLen) return [text];

  const result = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      result.push(remaining);
      break;
    }

    let idx = remaining.lastIndexOf('. ', maxLen);
    if (idx < maxLen * 0.3) idx = remaining.lastIndexOf(', ', maxLen);
    if (idx < maxLen * 0.3) idx = remaining.lastIndexOf(' ', maxLen);
    if (idx < maxLen * 0.3) idx = maxLen;

    result.push(remaining.slice(0, idx + 1).trim());
    remaining = remaining.slice(idx + 1).trim();
  }

  return result.filter(c => c.length > 0);
}
