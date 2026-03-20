import { franc } from 'franc';

/**
 * Language Detection Module
 * 
 * Uses `franc` for lightweight, offline language detection.
 * Maps ISO 639-3 codes to espeak-ng voice codes.
 * Falls back to English on low confidence or unsupported languages.
 */

// franc uses ISO 639-3 codes internally
const LANG_MAP = {
  yor: 'yo',  // Yoruba
  ibo: 'ig',  // Igbo (franc uses 'ibo' for ISO 639-3)
  hau: 'ha',  // Hausa
  eng: 'en',  // English
};

const SUPPORTED_CODES = new Set(Object.keys(LANG_MAP));

/**
 * Detects language from text input.
 * 
 * @param {string} text - Input text to detect language of
 * @returns {{ langCode: string, langName: string, raw: string }}
 *   - langCode: espeak-ng voice code (yo, ig, ha, en)
 *   - langName: human-readable language name
 *   - raw: raw ISO 639-3 code from franc
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return { langCode: 'en', langName: 'English', raw: 'und' };
  }

  const cleaned = text.trim();

  // franc needs at least ~10 chars for reasonable detection
  // Short inputs default to English
  if (cleaned.length < 10) {
    return { langCode: 'en', langName: 'English', raw: 'short' };
  }

  const detected = franc(cleaned, {
    only: ['eng', 'yor', 'hau', 'ibo'],
    minLength: 3,
  });

  // franc returns 'und' when it can't determine the language
  if (detected === 'und' || !SUPPORTED_CODES.has(detected)) {
    return { langCode: 'en', langName: 'English', raw: detected };
  }

  const NAMES = {
    yor: 'Yoruba',
    ibo: 'Igbo',
    hau: 'Hausa',
    eng: 'English',
  };

  return {
    langCode: LANG_MAP[detected],
    langName: NAMES[detected],
    raw: detected,
  };
}
