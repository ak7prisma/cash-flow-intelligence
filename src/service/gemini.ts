import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction } from "../models/Transaction";
import { MODELS } from "../data/geminiModel";
import { INTENT_SYSTEM_INSTRUCTION, CHAT_SYSTEM_INSTRUCTION } from "../data/geminiInstruction";
import { getLocalDateISO } from "../utils/dateHelpers";

// Constants & Configuration
// Resolve env from Vite (browser build) or Node (tsx test-suite). `import.meta.env`
// only exists under Vite, so reading it alone yields undefined under tsx and the SDK
// silently sends requests without a key, surfacing as a confusing 400 API_KEY_INVALID.
const nodeEnv: Record<string, string | undefined> | undefined =
  (globalThis as any).process?.env;
const env: Record<string, string | undefined> = (import.meta as any).env ?? nodeEnv ?? {};

const API_KEY = env.VITE_GEMINI_API_KEY ?? env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error(
    "VITE_GEMINI_API_KEY / GEMINI_API_KEY not found. " +
      "Ensure .env.local exists in the project root and is loaded before this module."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Helper to clean and parse JSON from Gemini's response.
 * Handles cases with or without markdown code blocks.
 */
export const parseGeminiJson = <T>(text: string): T => {
  try {
    // Look for JSON block within markdown code blocks or the whole string
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i) || [null, text];
    const candidate = jsonMatch[1] || text;
    
    // Clean up any potential leading/trailing non-JSON characters
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
      return JSON.parse(candidate.trim()) as T;
    }
    
    const cleaned = candidate.substring(start, end + 1).trim();
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("Failed to parse Gemini JSON. Raw text:", text);
    throw error;
  }
};

// Core helper to call Gemini with a model list fallback.

export interface AttemptLogInfo {
  model_id: string;
  t_start_iso: string;
  latency_ms: number;
  is_final_attempt: boolean;
  http_status?: number;
  error?: string;
  prompt_tokens?: number;
  output_tokens?: number;
  thinking_tokens?: number;
  cached_tokens?: number;
  total_tokens?: number;
  tokens_source: 'api' | 'estimated';
  input_chars: number;
}

export const generateWithFallback = async (
  modelList: string[],
  prompt: string,
  systemInstruction?: string,
  onAttempt?: (info: AttemptLogInfo) => void
): Promise<string> => {
  let lastError: any;

  for (let i = 0; i < modelList.length; i++) {
    const modelName = modelList[i];
    const t_start = performance.now();
    const t_start_iso = new Date().toISOString();
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });
      const result = await model.generateContent(prompt);
      const latency_ms = performance.now() - t_start;
      const text = result.response.text();
      const usage = result.response.usageMetadata;
      onAttempt?.({
        model_id: modelName,
        t_start_iso,
        latency_ms,
        is_final_attempt: true,
        http_status: 200,
        prompt_tokens: usage?.promptTokenCount,
        output_tokens: usage?.candidatesTokenCount,
        thinking_tokens: undefined,
        cached_tokens: usage?.cachedContentTokenCount,
        total_tokens: usage?.totalTokenCount,
        tokens_source: usage ? 'api' : 'estimated',
        input_chars: prompt.length + (systemInstruction?.length || 0),
      });
      if (text) return text;
    } catch (error) {
      const err = error as { status?: number; message?: string };
      const latency_ms = performance.now() - t_start;
      const status = err?.status && typeof err.status === 'number' ? err.status : undefined;
      onAttempt?.({
        model_id: modelName,
        t_start_iso,
        latency_ms,
        is_final_attempt: i === modelList.length - 1,
        http_status: status,
        error: err?.message || String(error),
        tokens_source: 'estimated',
        input_chars: prompt.length + (systemInstruction?.length || 0),
      });
      lastError = error;
      console.warn(`Model ${modelName} failed, trying next...`, error);
    }
  }

  console.error("All models failed. Last error:", lastError);
  throw lastError || new Error("Failed to generate content from all models");
};

// --- Interfaces ---

export interface TransactionData {
  amount: number;
  type: "income" | "expense";
  category: string;
  note: string;
  date: string;
}

export interface TransactionIntent {
  isTransaction: true;
  transactions: TransactionData[];
}

export interface NonTransactionIntent {
  isTransaction: false;
  status?: "missing_nominal" | "general_chat";
}

export type GeminiIntent = TransactionIntent | NonTransactionIntent;

export interface FinancialAnalysisResponse {
  isFinance: true;
  isAnalysis: true;
  status: string;
  analysis: string;
  advice: string;
}

export interface GeneralChatResponse {
  isFinance: true;
  isAnalysis: false;
  reply: string;
}

export interface NonFinanceResponse {
  isFinance: false;
  reply: string;
}

export type GeminiChatResponse = FinancialAnalysisResponse | GeneralChatResponse | NonFinanceResponse;

// --- Service Functions ---

// Parses user message to determine if it's a transaction recording intent.
export const parseTransactionIntent = async (message: string): Promise<GeminiIntent> => {
  try {
    const today = getLocalDateISO();
    const prompt = `Current Date: ${today}\nUser Message: ${message}`;
    
    const text = await generateWithFallback(MODELS.CLASSIFICATION, prompt, INTENT_SYSTEM_INSTRUCTION);
    return parseGeminiJson<GeminiIntent>(text);
  } catch (error) {
    if (error instanceof SyntaxError) return { isTransaction: false };
    console.error("Intent Parse Error:", error);
    throw error;
  }
};

//Handles general chat and financial analysis requests.

export const chatWithGemini = async (message: string, userData?: any): Promise<GeminiChatResponse> => {
  const prompt = `
User Message: "${message}"

Context Data Keuangan Pengguna:
${userData ? JSON.stringify(userData, null, 2) : "Belum ada data transaksi."}

PANDUAN PEMROSESAN PERMINTAAN USER:
1. Jika pengguna meminta analisis, kalkulasi, evaluasi pengeluaran, atau saran (misal: "hitung pendapatan hari ini", "berapa pengeluaran bulan ini", "analisis keuangan saya", "rekap saldo"):
   - Gunakan data faktual dari 'todayStats' (untuk pertanyaan hari ini), 'thisMonthStats' (untuk pertanyaan bulan ini), atau 'overallStats' (untuk total/saldo).
   - Format response dalam format JSON Analisis:
     {
       "isFinance": true,
       "isAnalysis": true,
       "status": "<Ringkasan angka kunci, misal: 'Pemasukan Hari Ini: Rp 500.000 | Saldo: Rp 3.200.000'>",
       "analysis": "<Penjelasan detail kalkulasi, sumber kategori, atau perbandingan pemasukan vs pengeluaran>",
       "advice": "<Saran finansial konkret, solusi budgeting, atau tips praktis>"
     }

2. Jika pengguna mengajukan pertanyaan umum tentang keuangan, konsultasi santai, atau tips:
   - Format response dalam format JSON Chat Umum:
     {
       "isFinance": true,
       "isAnalysis": false,
       "reply": "<Jawaban informatif, ramah, dan solutif disertai saran aplikatif>"
     }

3. Jika pengguna menyebut transaksi tapi tanpa nominal (misal: "tadi beli bensin"):
   - Format response:
     {
       "isFinance": true,
       "isAnalysis": false,
       "reply": "Boleh tahu berapa nominalnya kak? Contoh: 'Beli bensin 50rb' supaya bisa langsung saya catat."
     }

4. Jika pesan sama sekali di luar topik keuangan:
   - Format response:
     {
       "isFinance": false,
       "reply": "Saya adalah asisten keuangan Cash Flow Intelligence. Saya siap membantu mengelola catatan, menganalisis arus kas, serta memberi saran keuangan Anda!"
     }

PENTING: Hanya kembalikan RAW JSON yang valid tanpa markdown code block dan tanpa teks tambahan lainnya.
  `;

  try {
    const text = await generateWithFallback(MODELS.DEFAULT, prompt, CHAT_SYSTEM_INSTRUCTION);
    return parseGeminiJson<GeminiChatResponse>(text);
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

// Generates a short daily financial summary based on transactions.

export const getDailyAnalytics = async (transactions: Transaction[]): Promise<string> => {
  const prompt = `
    You are a Financial Analyst. Based on the user's recent transactions, provide a very short, insightful financial summary (max 2 sentences). 
    Focus on their biggest expense or income. Respond in Indonesian. Plain text only.

    Transactions: ${JSON.stringify(transactions)}
  `;

  try {
    const text = await generateWithFallback(MODELS.DAILY_INSIGHT, prompt);
    return text.trim();
  } catch (error) {
    console.error("Daily Analytics Error:", error);
    return "Analisis AI sedang beristirahat karena limit server. Silakan cek kembali nanti!";
  }
};