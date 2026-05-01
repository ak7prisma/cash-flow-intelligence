import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Konfigurasi Model
const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  systemInstruction: `
    Nama: CFI Assistant.
    Role: Pakar Manajemen Keuangan Pribadi.
    Tugas: Menganalisa pengeluaran, memberi saran budget, dan memotivasi user untuk mengontrol keuangan.
    Gaya Bahasa: Santai, informatif, gunakan istilah keuangan yang mudah dipahami.
    Aplikasi: Cash Flow Intelligence.
  `,
});

// Model khusus untuk Intent Parsing (Data Extractor)
const intentModel = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  systemInstruction: `You are a data extractor. If the user wants to record an income or expense, extract the data into this JSON format: {"isTransaction": true, "amount": number, "type": "income"|"expense", "category": string, "note": string}. If it is NOT a transaction, return {"isTransaction": false}. Return ONLY raw JSON.`,
});

export interface TransactionIntent {
  isTransaction: true;
  amount: number;
  type: "income" | "expense";
  category: string;
  note: string;
}

export interface NonTransactionIntent {
  isTransaction: false;
}

export type GeminiIntent = TransactionIntent | NonTransactionIntent;

/**
 * Parses user message to determine if it's a transaction recording intent.
 * Returns structured JSON from Gemini's data-extractor model.
 */
export const parseTransactionIntent = async (message: string): Promise<GeminiIntent> => {
  try {
    const result = await intentModel.generateContent(message);
    const response = result.response;
    const text = response.text().trim();

    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed: GeminiIntent = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error("Intent Parse Error:", error);

    return { isTransaction: false };
  }
};

export const chatWithGemini = async (message: string) => {
  try {
    const result = await model.generateContent(message);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf Bre, koneksi ke otak AI gue lagi terganggu. Coba lagi ya!";
  }
};