import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

const execFileAsync = promisify(execFile);

/**
 * espeak-ng TTS Wrapper
 * 
 * Generates WAV audio from text using espeak-ng.
 * Uses execFile (NOT exec) to prevent shell injection.
 * Writes to /tmp and returns a Buffer.
 */

// Valid espeak-ng voice identifiers for supported languages
const VOICE_MAP = {
  yo: 'yo',
  ig: 'ig',
  ha: 'ha',
  en: 'en',
};

// espeak-ng binary name varies by platform
const ESPEAK_BIN = process.platform === 'win32' ? 'espeak-ng.exe' : 'espeak-ng';

/**
 * Generate WAV audio buffer from text using espeak-ng.
 * 
 * @param {string} text - Text to synthesize
 * @param {string} langCode - Language code: yo, ig, ha, en
 * @returns {Promise<Buffer>} WAV audio buffer
 * @throws {Error} If espeak-ng fails or text is empty
 */
export async function synthesize(text, langCode = 'en') {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text input is required and must be non-empty');
  }

  const voice = VOICE_MAP[langCode] || VOICE_MAP.en;
  const sanitizedText = text.trim().slice(0, 5000); // Cap at 5000 chars

  // Generate temp file path
  const tmpFile = path.join(
    os.tmpdir(),
    `voxy_tts_${crypto.randomBytes(8).toString('hex')}.wav`
  );

  try {
    // execFile is safe — no shell interpolation, args are passed as array
    await execFileAsync(ESPEAK_BIN, [
      '-v', voice,
      '-w', tmpFile,
      '--', // end of options, prevents text starting with - from being parsed as flag
      sanitizedText,
    ], {
      timeout: 15000, // 15s hard timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });

    // Read the generated WAV file into a buffer
    const audioBuffer = await fs.readFile(tmpFile);

    if (audioBuffer.length === 0) {
      throw new Error('espeak-ng produced empty audio output');
    }

    return audioBuffer;
  } finally {
    // Always clean up temp file
    try {
      await fs.unlink(tmpFile);
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Check if espeak-ng is available on the system.
 * 
 * @returns {Promise<{ available: boolean, version?: string, error?: string }>}
 */
export async function checkEspeakAvailability() {
  try {
    const { stdout } = await execFileAsync(ESPEAK_BIN, ['--version'], {
      timeout: 5000,
    });
    return { available: true, version: stdout.trim() };
  } catch (error) {
    return { available: false, error: error.message };
  }
}
