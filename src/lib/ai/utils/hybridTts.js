import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

/**
 * Hybrid Multilingual Text-to-Speech (Serverless-Safe)
 * 
 * Optimized for Nigerian context:
 * 1. Tries Google Translate Direct (Free) - Works for English & Hausa.
 * 2. Tries Nigerian English Neural (Free) - Nigerian accent reading native text (Yoruba/Igbo).
 * 3. Tries American Neural voice (Fallback) - Last resort.
 * 
 * Note: msedge-tts 'yo-NG' and 'ig-NG' are currently non-functional in the free service.
 */
export async function generateHybridSpeech(text, detectedLanguage = 'english') {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return null;
  }

  const normalizedLang = (detectedLanguage || 'english').toLowerCase();

  // Tier 1: Try Google Translate Direct (Best quality for Hausa/English)
  const tier1 = await tryGoogleTranslateDirect(text, normalizedLang);
  if (tier1) return tier1;

  // Tier 2: Try Nigerian Accent Native Reading (Best fallback for Yoruba/Igbo)
  // This uses a Nigerian voice (Abeo) to read Yoruba/Igbo text. 
  // It sounds much more native than a British/American voice.
  const tier2 = await tryMsEdgeNigerianAccent(text);
  if (tier2) return tier2;

  // Tier 3: Final fallback to US English
  const tier3 = await tryMsEdgeUSAccent(text);
  if (tier3) return tier3;

  throw new Error('All TTS engines failed to generate audio.');
}

async function tryGoogleTranslateDirect(text, lang) {
  const codes = { 'yoruba': 'yo', 'igbo': 'ig', 'hausa': 'ha', 'english': 'en' };
  const tl = codes[lang] || 'en';
  
  // Skip to T2 if we know Google blocks it (yo and ig often return 400)
  if (tl === 'yo' || tl === 'ig') return null;

  try {
    console.log(`[TTS T1] Google Translate: ${tl}`);
    const buffer = await fetchGoogleTTS(text, tl);
    if (buffer && buffer.length > 2000) {
       console.log(`[TTS T1] ✅ Success (${buffer.length}B)`);
       return `data:audio/mp3;base64,${buffer.toString('base64')}`;
    }
    return null;
  } catch (e) {
    console.warn(`[TTS T1] Failed: ${e.message}`);
    return null;
  }
}

async function tryMsEdgeNigerianAccent(text) {
  try {
    const voice = 'en-NG-AbeoNeural'; // The primary Nigerian voice
    console.log(`[TTS T2] MsEdge Nigerian Accent: ${voice}`);
    const buffer = await generateMsEdgeAudio(text, voice);
    if (buffer && buffer.length > 2000) {
       console.log(`[TTS T2] ✅ Success (${buffer.length}B)`);
       return `data:audio/mp3;base64,${buffer.toString('base64')}`;
    }
    return null;
  } catch (e) {
    console.warn(`[TTS T2] Failed: ${e.message}`);
    return null;
  }
}

async function tryMsEdgeUSAccent(text) {
  try {
    const voice = 'en-US-AriaNeural';
    console.log(`[TTS T3] MsEdge US Fallback: ${voice}`);
    const buffer = await generateMsEdgeAudio(text, voice);
    if (buffer) return `data:audio/mp3;base64,${buffer.toString('base64')}`;
    return null;
  } catch (e) {
    console.error(`[TTS T3] Failed: ${e.message}`);
    return null;
  }
}

// --- Helpers ---

async function generateMsEdgeAudio(text, voiceName) {
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const stream = tts.toStream(text);
    const chunks = [];
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => resolve(), 8000);
      stream.audioStream.on('data', chunk => chunks.push(chunk));
      stream.audioStream.on('end', () => { clearTimeout(timeout); resolve(); });
      stream.audioStream.on('error', reject);
    });
    return Buffer.concat(chunks);
  } catch (e) {
    return null;
  }
}

async function fetchGoogleTTS(text, lang) {
  const chunks = text.length > 200 ? text.match(/.{1,200}/g) : [text];
  const buffers = [];
  for (const chunk of chunks) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=gtx&q=${encodeURIComponent(chunk)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ab = await res.arrayBuffer();
    buffers.push(Buffer.from(ab));
  }
  return Buffer.concat(buffers);
}
