import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction } from "../models/Transaction";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../data/categories";
import { MODELS } from "../data/geminimodels";

// Constants & Configuration
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
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

// Core helper to call Gemini with a model list fallback.

const generateWithFallback = async (
  modelList: string[],
  prompt: string,
  systemInstruction?: string
): Promise<string> => {
  let lastError: any;

  for (const modelName of modelList) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (error) {
      lastError = error;
      console.warn(`Model ${modelName} failed, trying next...`, error);
    }
  }

  console.error("All models failed. Last error:", lastError);
  throw lastError || new Error("Failed to generate content from all models");
};

// --- Instructions ---

const INTENT_SYSTEM_INSTRUCTION = `Your task is to parse user messages into an array of transaction data.
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
}`;

const CHAT_SYSTEM_INSTRUCTION = `
  Nama: CFI Assistant.
  Role: Pakar Manajemen Keuangan Pribadi.
  Tugas: Menganalisa pengeluaran, memberi saran budget, dan memotivasi user untuk mengontrol keuangan.
  Gaya Bahasa: Santai, informatif, gunakan istilah keuangan yang mudah dipahami.
  Aplikasi: Cash Flow Intelligence.
`;

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

// Parses user message to determine if it's a transaction recording intent.
export const parseTransactionIntent = async (message: string): Promise<GeminiIntent> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const prompt = `Current Date: ${today}\nUser Message: ${message}`;
    
    const text = await generateWithFallback(MODELS.DEFAULT, prompt, INTENT_SYSTEM_INSTRUCTION);
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