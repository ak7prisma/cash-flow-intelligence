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
  systemInstruction: `Your task is to parse user messages into transaction data. You MUST categorize each transaction into exactly ONE of the allowed categories below. If a transaction doesn't perfectly fit, choose the closest one or use 'Other'/'Others (Income)'. NEVER create your own category names.

Allowed Categories:
Expense: ['Food & Drink', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Other']
Income: ['Salary', 'Bonus', 'Investment', 'Others (Income)']

Return the response in this JSON format:
{
"isTransaction": boolean,
"amount": number,
"type": "income" | "expense",
"category": string (MUST be from the allowed list),
"note": string
}

Also, ensure that if the user mentions 'pemasukan', 'gaji', or 'dapat uang', the type is 'income'. Otherwise, the default is 'expense'. Return ONLY raw JSON.`,
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
    if (error instanceof SyntaxError) {
      return { isTransaction: false };
    }
    console.error("Intent Parse Error:", error);
    throw error;
  }
};

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

export const chatWithGemini = async (message: string, userData?: any): Promise<GeminiChatResponse> => {
  const strictPrompt = `
You are a Cash Flow & Financial Analyst. Your PRIMARY jobs are: 1) Analyzing the user's injected financial data, 2) Providing short, concise financial advice/summaries (weekly/monthly) based on the data, and 3) Answering general finance questions.

You MUST return your response in purely JSON format based on the following conditions:

Condition 1: The user asks for a financial analysis or summary of their data.
Return JSON: { "isFinance": true, "isAnalysis": true, "status": "Short status of their balance (e.g. Aman!, Defisit)", "analysis": "1-2 sentences analyzing their biggest expenses or income", "advice": "1-2 sentences of actionable financial advice" }

Condition 2: The user asks a general finance question (not requiring analysis of their data).
Return JSON: { "isFinance": true, "isAnalysis": false, "reply": "Your concise answer here" }

Condition 3: The user asks about things completely UNRELATED to finance (e.g., cooking, coding, poems).
Return JSON: { "isFinance": false, "reply": "Polite text refusing the request because you only handle finance." }

IMPORTANT: Return ONLY raw JSON. No markdown, no \`\`\`json wrappers. Do not use markdown formatting like ** or * in the text values. Keep text values plain and conversational.

Context Data: ${userData ? JSON.stringify(userData) : "No data provided."}

User Message: ${message}
`;

  const result = await model.generateContent(strictPrompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
};