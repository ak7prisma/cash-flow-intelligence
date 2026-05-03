import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction } from "../models/Transaction";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../data/categories";

// Constants & Configuration
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const DEFAULT_MODEL = "gemini-3.1-flash-lite-preview";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Helper to clean and parse JSON from Gemini's response.
 * Handles cases with or without markdown code blocks.
 */
const parseGeminiJson = <T>(text: string): T => {
  try {
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("Failed to parse Gemini JSON:", text);
    throw error;
  }
};

// --- Models ---

const mainModel = genAI.getGenerativeModel({
  model: DEFAULT_MODEL,
  systemInstruction: `
    Nama: CFI Assistant.
    Role: Pakar Manajemen Keuangan Pribadi.
    Tugas: Menganalisa pengeluaran, memberi saran budget, dan memotivasi user untuk mengontrol keuangan.
    Gaya Bahasa: Santai, informatif, gunakan istilah keuangan yang mudah dipahami.
    Aplikasi: Cash Flow Intelligence.
  `,
});

const intentModel = genAI.getGenerativeModel({
  model: DEFAULT_MODEL,
  systemInstruction: `Your task is to parse user messages into an array of transaction data.
Identify ALL transactions mentioned in the message.

Allowed Categories:
Expense: ${JSON.stringify(EXPENSE_CATEGORIES)}
Income: ${JSON.stringify(INCOME_CATEGORIES)}

CRITICAL RULES:
1. ONLY set "isTransaction": true if there is at least one CLEAR transaction with a valid AMOUNT mentioned.
2. If the user mentions a transaction but NO amount is found, set "isTransaction": false.
3. For the 'date' field, use ISO 8601 format (YYYY-MM-DD). Use the current date provided in the prompt.
4. 'amount' must be a positive number. Assume currency is IDR. Convert 'rb'/'k' to thousands (e.g., 10rb = 10000).
5. 'category' MUST be from the allowed lists.

Return ONLY raw JSON:
{
  "isTransaction": boolean,
  "transactions": [
    { "amount": number, "type": "income" | "expense", "category": string, "note": string, "date": string }
  ]
}`,
});

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

/**
 * Parses user message to determine if it's a transaction recording intent.
 */
export const parseTransactionIntent = async (message: string): Promise<GeminiIntent> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const prompt = `Current Date: ${today}\nUser Message: ${message}`;
    
    const result = await intentModel.generateContent(prompt);
    return parseGeminiJson<GeminiIntent>(result.response.text());
  } catch (error) {
    if (error instanceof SyntaxError) return { isTransaction: false };
    console.error("Intent Parse Error:", error);
    throw error;
  }
};

/**
 * Handles general chat and financial analysis requests.
 */
export const chatWithGemini = async (message: string, userData?: any): Promise<GeminiChatResponse> => {
  const prompt = `
    You are a Cash Flow & Financial Analyst. Your PRIMARY jobs are: 1) Analyzing the user's injected financial data, 2) Providing short, concise financial advice/summaries based on the data, and 3) Answering general finance questions.

    Context Data: ${userData ? JSON.stringify(userData) : "No data provided."}

    Conditions for JSON response:
    1. Financial analysis/summary: { "isFinance": true, "isAnalysis": true, "status": string, "analysis": string, "advice": string }
    2. General finance question: { "isFinance": true, "isAnalysis": false, "reply": string }
    3. Non-finance: { "isFinance": false, "reply": string }
    4. Transaction attempt without amount: { "isFinance": true, "isAnalysis": false, "reply": "Boleh tahu berapa nominalnya kak?..." }

    IMPORTANT: Return ONLY raw JSON. Respond in Indonesian.
    
    User Message: ${message}
  `;

  try {
    const result = await mainModel.generateContent(prompt);
    return parseGeminiJson<GeminiChatResponse>(result.response.text());
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

/**
 * Generates a short daily financial summary based on transactions.
 */
export const getDailyAnalytics = async (transactions: Transaction[]): Promise<string> => {
  const models = [DEFAULT_MODEL, 'gemini-3-flash-preview', 'gemini-2.5-flash-lite-preview'];
  const prompt = `
    You are a Financial Analyst. Based on the user's recent transactions, provide a very short, insightful financial summary (max 2 sentences). 
    Focus on their biggest expense or income. Respond in Indonesian. Plain text only.

    Transactions: ${JSON.stringify(transactions)}
  `;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.warn(`Model ${modelName} failed, trying next...`);
    }
  }

  return "Analisis AI sedang beristirahat karena limit server. Silakan cek kembali nanti!";
};