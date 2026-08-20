import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { generateWithFallback, parseGeminiJson } from '../../src/service/gemini';
import { MODELS } from '../../src/data/geminiModel';
import { INTENT_SYSTEM_INSTRUCTION } from '../../src/data/geminiInstruction';
import { TransactionJSON } from './types';
import { defaultRateLimiter } from './rate-limiter';

export async function callAiEngine(promptText: string): Promise<{
  raw: string;
  parsed: TransactionJSON;
  timings: { t0: number; t1: number };
}> {
  await defaultRateLimiter.acquire();

  // Determine active engine ('llm' or 'slm') from process.env.AI_ENGINE
  const engine = process.env.AI_ENGINE || 'llm';

  // Use CLASSIFICATION models (all Gemini now, Gemma has been removed)
  let modelList: string[] = MODELS.CLASSIFICATION;

  // Prepend current date to the prompt as done in gemini.ts
  const today = new Date().toISOString().split('T')[0];
  const formattedPrompt = `Current Date: ${today}\nUser Message: ${promptText}`;

  // Record timings
  const t0 = performance.now();
  const raw = await generateWithFallback(modelList, formattedPrompt, INTENT_SYSTEM_INSTRUCTION);
  const t1 = performance.now();

  let parsed: TransactionJSON = { isTransaction: false };
  try {
    parsed = parseGeminiJson<TransactionJSON>(raw);
  } catch (error) {
    console.error("Engine Client: failed to parse JSON response:", raw, error);
  }

  return {
    raw,
    parsed,
    timings: { t0, t1 }
  };
}
