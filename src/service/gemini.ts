import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Konfigurasi Model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    Nama: CFI Assistant.
    Role: Pakar Manajemen Keuangan Pribadi.
    Tugas: Menganalisa pengeluaran, memberi saran budget, dan memotivasi user untuk mengontrol keuangan.
    Gaya Bahasa: Santai, informatif, gunakan istilah keuangan yang mudah dipahami.
    Aplikasi: Cash Flow Intelligence.
  `,
});

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