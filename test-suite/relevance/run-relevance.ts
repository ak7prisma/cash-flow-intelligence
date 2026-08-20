import '../shared/setup-env';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fsPromises from 'fs/promises';
import { Command } from 'commander';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateWithFallback, parseGeminiJson } from '../../src/service/gemini';
import { CHAT_SYSTEM_INSTRUCTION } from '../../src/data/geminiInstruction';
import { MODELS } from '../../src/data/geminiModel';
import { RelevanceRaw, RelevanceSummaryRow } from '../shared/types';
import { defaultRateLimiter } from '../shared/rate-limiter';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const program = new Command();
program
  .requiredOption('--engine <type>', 'AI Engine to test (llm or slm)')
  .option('--rounds <number>', 'Number of evaluation rounds by judge model', '3')
  .parse(process.argv);

const options = program.opts();
const engine = options.engine.toLowerCase() as 'llm' | 'slm';
const rounds = parseInt(options.rounds, 10);

// Set AI_ENGINE in environment
process.env.AI_ENGINE = engine;

const historyPath = path.resolve(__dirname, 'sample-history.json');
const resultsDir = path.resolve(__dirname, '../results');

if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Generate sample-history.json if it doesn't exist
if (!fs.existsSync(historyPath)) {
  const defaultHistory = [
  {
    "historyId": "user_food_and_groceries",
    "transactions": [
      { "date": "2026-08-09", "amount": 18000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 7000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 15000, "category": "Entertainment", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 7500, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 20000, "category": "Transportation", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 7000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 8000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 125000, "category": "Bill", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 7000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 10000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 15000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 161, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 20, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 20, "category": "Transportation", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 70, "category": "Bill", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 90000, "category": "Entertainment", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 92000, "category": "Entertainment", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 13000, "category": "Entertainment", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 10000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 30000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 5000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 26000, "category": "Transportation", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 24000, "category": "Shopping", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 45000, "category": "Bill", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 360000, "category": "Transportation", "transactionType": "expense" }
    ]
  },
  {
    "historyId": "user_shopping_and_lifestyle",
    "transactions": [
      { "date": "2026-08-09", "amount": 12000, "category": "Transportation", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 11000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 14000, "category": "Shopping", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 10000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 8000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 14000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 7000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 80000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 55000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 48000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 24000, "category": "Shopping", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 50000, "category": "Transportation", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 56000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 90000, "category": "Shopping", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 180000, "category": "Shopping", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 4000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 3000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 3000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 10000, "category": "Shopping", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 7000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 6000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 13000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 22000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 400000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 15000, "category": "Shopping", "transactionType": "expense" }
    ]
  },
  {
    "historyId": "user_entertainment_and_income",
    "transactions": [
      { "date": "2026-08-09", "amount": 975000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 125, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 185000, "category": "Entertainment", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 36, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 109000, "category": "Bill", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 40000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 35000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 150000, "category": "Bill", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 50000, "category": "Bill", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 30000, "category": "Transportation", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 11000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 30000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 26000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 300000, "category": "Entertainment", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 11000, "category": "Food & Beverage", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 10000, "category": "Entertainment", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 40, "category": "Entertainment", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 10000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 20000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 10000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 20000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 500000, "category": "Other", "transactionType": "expense" },
      { "date": "2026-08-09", "amount": 100000, "category": "Others (Income)", "transactionType": "income" },
      { "date": "2026-08-09", "amount": 200000, "category": "Others (Income)", "transactionType": "income" },
      { "date": "2026-08-09", "amount": 100000, "category": "Others (Income)", "transactionType": "income" },
      { "date": "2026-08-09", "amount": 250000, "category": "Others (Income)", "transactionType": "income" },
      { "date": "2026-08-09", "amount": 2000000, "category": "Others (Income)", "transactionType": "income" }
    ]
  }
];
  fs.writeFileSync(historyPath, JSON.stringify(defaultHistory, null, 2), 'utf8');
}

async function main() {
  console.log(`Starting Relevance Test: engine=${engine}, rounds=${rounds}`);

  const historyData = JSON.parse(fs.readFileSync(historyPath, 'utf8'));

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const genAI = new GoogleGenerativeAI(apiKey);

  const rawResults: RelevanceRaw[] = [];
  const summaryResults: RelevanceSummaryRow[] = [];

  // Determine model list for generating insight
  let modelList: string[] = [];
  if (engine === 'slm') {
    modelList = MODELS.CLASSIFICATION.filter((m) => m.toLowerCase().includes('gemma'));
    if (modelList.length === 0) {
      modelList = ['gemma-4-31b-it', 'gemma-4-26b-it'];
    }
  } else {
    modelList = MODELS.CLASSIFICATION.filter((m) => m.toLowerCase().includes('gemini'));
    if (modelList.length === 0) {
      modelList = MODELS.DEFAULT.filter((m) => m.toLowerCase().includes('gemini'));
    }
    if (modelList.length === 0) {
      modelList = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'];
    }
  }

  // Judge model config
  const judgeModelName = process.env.JUDGE_MODEL || 'gemini-3.5-flash';
  const judgeModel = genAI.getGenerativeModel({ model: judgeModelName });

  for (let idx = 0; idx < historyData.length; idx++) {
    const history = historyData[idx];
    const historyId = history.historyId;

    console.log(`[${idx + 1}/${historyData.length}] engine=${engine} module=relevance historyId=${historyId}`);

    // Generate prompt for advice/insight
    const prompt = `
      You are a Cash Flow & Financial Analyst. Your PRIMARY jobs are: 1) Analyzing the user's injected financial data, 2) Providing short, concise financial advice/summaries based on the data, and 3) Answering general finance questions.

      Context Data: ${JSON.stringify({ transactions: history.transactions })}

      Conditions for JSON response:
      1. Financial analysis/summary: { "isFinance": true, "isAnalysis": true, "status": string, "analysis": string, "advice": string }
      2. General finance question: { "isFinance": true, "isAnalysis": false, "reply": string }
      3. Non-finance: { "isFinance": false, "reply": string }
      4. Transaction attempt without amount: { "isFinance": true, "isAnalysis": false, "reply": "Boleh tahu berapa nominalnya kak?..." }

      IMPORTANT: Return ONLY raw JSON. Respond in Indonesian.
      
      User Message: Berikan analisis keuangan dan saran anggaran berdasarkan data transaksi saya.
    `;

    console.log(`  Calling model to generate insight...`);
    let rawResponse = '';
    try {
      await defaultRateLimiter.acquire();
      rawResponse = await generateWithFallback(modelList, prompt, CHAT_SYSTEM_INSTRUCTION);
    } catch (err) {
      console.error(`  Error calling model for insight generation:`, err);
      continue;
    }

    let insightText = '';
    try {
      const parsed = parseGeminiJson<any>(rawResponse);
      insightText = (parsed.analysis || '') + ' ' + (parsed.advice || parsed.reply || '');
    } catch (err) {
      insightText = rawResponse; // fallback to raw
    }

    console.log(`  Generated insight: "${insightText.trim().replace(/\n/g, ' ')}"`);

    // Call judge model N rounds
    const roundsEvaluations = [];
    let sumContextualAccuracy = 0;
    let sumRelevance = 0;
    let sumActionability = 0;

    for (let r = 1; r <= rounds; r++) {
      process.stdout.write(`  Round ${r}/${rounds} call to judge (${judgeModelName})... `);

      const judgePrompt = `
        You are an expert Financial Advisory Evaluator. 
        Your task is to grade the quality of the financial advice/insight generated for a user based on their monthly transaction history.

        Transaction History:
        ${JSON.stringify(history.transactions, null, 2)}

        Generated Financial Insight:
        "${insightText}"

        Please evaluate the insight on three dimensions (scale of 1-5, where 1 is worst and 5 is best):
        1. contextualAccuracy: How accurately does the insight reflect the actual transactions provided? (e.g., does it mention correct categories, amounts, or trends?)
        2. relevance: How relevant is the advice to the user's financial behavior depicted in the transactions?
        3. actionability: How concrete, helpful, and realistic is the budget warning or financial advice for the user to act upon?

        Provide a short reasoning (max 2 sentences) for your scores.

        CRITICAL: Return ONLY raw JSON. Do not include markdown code blocks. The JSON schema must be exactly:
        {
          "contextualAccuracy": number,
          "relevance": number,
          "actionability": number,
          "reasoning": "string"
        }
      `;

      try {
        await defaultRateLimiter.acquire();
        const result = await judgeModel.generateContent(judgePrompt);
        const text = result.response.text();
        const evalObj = parseGeminiJson<{
          contextualAccuracy: number;
          relevance: number;
          actionability: number;
          reasoning: string;
        }>(text);

        roundsEvaluations.push(evalObj);
        sumContextualAccuracy += Number(evalObj.contextualAccuracy) || 0;
        sumRelevance += Number(evalObj.relevance) || 0;
        sumActionability += Number(evalObj.actionability) || 0;
        console.log(`Done! Acc: ${evalObj.contextualAccuracy}, Rel: ${evalObj.relevance}, Act: ${evalObj.actionability}`);
      } catch (err: any) {
        console.log(`Failed! Error: ${err?.message || err}`);
        roundsEvaluations.push({
          contextualAccuracy: 1,
          relevance: 1,
          actionability: 1,
          reasoning: `Error calling judge: ${err?.message || err}`
        });
        sumContextualAccuracy += 1;
        sumRelevance += 1;
        sumActionability += 1;
      }
    }

    const avgContextualAccuracy = sumContextualAccuracy / rounds;
    const avgRelevance = sumRelevance / rounds;
    const avgActionability = sumActionability / rounds;

    rawResults.push({
      historyId,
      engine,
      insightText,
      rounds: roundsEvaluations
    });

    summaryResults.push({
      history_id: historyId,
      insight_text: insightText.replace(/\r?\n/g, ' '),
      avg_contextualAccuracy: avgContextualAccuracy,
      avg_relevance: avgRelevance,
      avg_actionability: avgActionability,
      human_score: ''
    });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const rawPath = path.resolve(resultsDir, `relevance_raw_${engine}_${timestamp}.json`);
  const summaryPath = path.resolve(resultsDir, `relevance_summary_${engine}_${timestamp}.csv`);

  // Save raw evaluations
  fs.writeFileSync(rawPath, JSON.stringify(rawResults, null, 2), 'utf8');
  console.log(`Saved raw evaluations to ${rawPath}`);

  // Save summary CSV
  const csvHeaders = 'history_id,insight_text,avg_contextualAccuracy,avg_relevance,avg_actionability,human_score\n';
  const csvRows = summaryResults
    .map(
      (s) =>
        `"${s.history_id}","${s.insight_text.replace(/"/g, '""')}",${s.avg_contextualAccuracy.toFixed(2)},${s.avg_relevance.toFixed(2)},${s.avg_actionability.toFixed(2)},`
    )
    .join('\n');
  fs.writeFileSync(summaryPath, csvHeaders + csvRows, 'utf8');
  console.log(`Saved summary CSV to ${summaryPath}`);
}

main().catch((err) => {
  console.error('Fatal Relevance Suite Error:', err);
  process.exit(1);
});
