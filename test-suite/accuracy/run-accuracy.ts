import '../shared/setup-env';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { callAiEngine } from '../shared/engine-client';
import { AccuracyPredictionRow, AccuracySummary, AccuracyFieldMetric } from '../shared/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AMOUNT_TOLERANCE = 0;

const program = new Command();
program
  .requiredOption('--engine <type>', 'AI Engine to test (llm or slm)')
  .requiredOption('--dataset <path>', 'Path to the ground truth CSV dataset')
  .parse(process.argv);

const options = program.opts();
const engine = options.engine.toLowerCase() as 'llm' | 'slm';

let datasetPath = path.isAbsolute(options.dataset)
  ? options.dataset
  : path.resolve(process.cwd(), options.dataset);

if (!fs.existsSync(datasetPath)) {
  const fallback = path.resolve(__dirname, '../', options.dataset);
  if (fs.existsSync(fallback)) {
    datasetPath = fallback;
  } else {
    const fallback2 = path.resolve(__dirname, options.dataset);
    if (fs.existsSync(fallback2)) {
      datasetPath = fallback2;
    }
  }
}

// Set AI_ENGINE in environment
process.env.AI_ENGINE = engine;

const resultsDir = path.resolve(__dirname, '../results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Simple CSV parser
function parseCSV(content: string): { headers: string[]; rows: string[][] } {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

function normalizeDate(dStr: string): string {
  try {
    if (!dStr) return '';
    if (dStr === 'current_date') {
      return new Date().toISOString().split('T')[0];
    }
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return dStr;
    return d.toISOString().split('T')[0];
  } catch {
    return dStr;
  }
}

async function main() {
  console.log(`Starting Accuracy Test: engine=${engine}, dataset=${datasetPath}`);

  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset file not found at: ${datasetPath}`);
  }

  const csvContent = fs.readFileSync(datasetPath, 'utf8');
  const { headers, rows } = parseCSV(csvContent);

  // Validate headers
  const requiredHeaders = ['Prompt', 'True_Type', 'True_Amount', 'True_Category', 'True_Date'];
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(
      `CSV Validation Error: Missing required columns: [${missingHeaders.join(', ')}]. CSV has headers: [${headers.join(', ')}]`
    );
  }

  const headerIndices = {
    prompt: headers.indexOf('Prompt'),
    type: headers.indexOf('True_Type'),
    amount: headers.indexOf('True_Amount'),
    category: headers.indexOf('True_Category'),
    date: headers.indexOf('True_Date')
  };

  const predictions: AccuracyPredictionRow[] = [];

  // TP/FP/FN counters for each of the 4 fields
  const fieldCounters = {
    transactionType: { tp: 0, fp: 0, fn: 0 },
    amount: { tp: 0, fp: 0, fn: 0 },
    category: { tp: 0, fp: 0, fn: 0 },
    date: { tp: 0, fp: 0, fn: 0 }
  };

  let exactMatchCount = 0;

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const promptText = row[headerIndices.prompt];
    const gtType = row[headerIndices.type].toUpperCase();
    const gtAmount = parseFloat(row[headerIndices.amount]);
    const gtCategory = row[headerIndices.category].trim().toLowerCase();
    const gtDate = normalizeDate(row[headerIndices.date]);

    console.log(`[${idx + 1}/${rows.length}] engine=${engine} module=accuracy prompt="${promptText}"`);

    let predType = '';
    let predAmount = 0;
    let predCategory = '';
    let predDate = '';

    try {
      const { parsed } = await callAiEngine(promptText);

      if (parsed.isTransaction && parsed.transactions && parsed.transactions.length > 0) {
        const tx = parsed.transactions[0];
        predType = (tx.type || '').toUpperCase();
        predAmount = Number(tx.amount) || 0;
        predCategory = (tx.category || '').trim().toLowerCase();
        predDate = normalizeDate(tx.date);
      }
    } catch (error) {
      console.error(`  Error parsing AI response for prompt "${promptText}":`, error);
    }

    // Matching logic
    const matchType = predType === gtType ? 1 : 0;
    const matchAmount = Math.abs(predAmount - gtAmount) <= AMOUNT_TOLERANCE ? 1 : 0;
    const matchCategory = predCategory === gtCategory ? 1 : 0;
    const matchDate = predDate === gtDate ? 1 : 0;
    const allMatch = (matchType && matchAmount && matchCategory && matchDate) ? 1 : 0;

    if (allMatch) {
      exactMatchCount++;
    }

    predictions.push({
      prompt_text: promptText,
      gt_transactionType: gtType,
      gt_amount: gtAmount,
      gt_category: row[headerIndices.category],
      gt_date: gtDate,
      pred_transactionType: predType,
      pred_amount: predAmount,
      pred_category: predCategory,
      pred_date: predDate,
      match_transactionType: matchType,
      match_amount: matchAmount,
      match_category: matchCategory,
      match_date: matchDate,
      all_match: allMatch
    });

    // Update TP/FP/FN counters
    const updateCounters = (field: 'transactionType' | 'amount' | 'category' | 'date', isMatch: boolean, hasPred: boolean) => {
      if (isMatch) {
        fieldCounters[field].tp++;
      } else {
        if (hasPred) {
          fieldCounters[field].fp++;
        }
        fieldCounters[field].fn++;
      }
    };

    updateCounters('transactionType', matchType === 1, predType !== '');
    updateCounters('amount', matchAmount === 1, predAmount !== 0);
    updateCounters('category', matchCategory === 1, predCategory !== '');
    updateCounters('date', matchDate === 1, predDate !== '');

    console.log(`  Matches: Type=${matchType}, Amount=${matchAmount}, Category=${matchCategory}, Date=${matchDate} -> All=${allMatch}`);
  }

  // Calculate Precision, Recall, F1
  const calculateMetrics = (counters: { tp: number; fp: number; fn: number }): AccuracyFieldMetric => {
    const precision = (counters.tp + counters.fp) > 0 ? counters.tp / (counters.tp + counters.fp) : 0;
    const recall = (counters.tp + counters.fn) > 0 ? counters.tp / (counters.tp + counters.fn) : 0;
    const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    return { precision, recall, f1 };
  };

  const typeMetrics = calculateMetrics(fieldCounters.transactionType);
  const amountMetrics = calculateMetrics(fieldCounters.amount);
  const categoryMetrics = calculateMetrics(fieldCounters.category);
  const dateMetrics = calculateMetrics(fieldCounters.date);

  const macroF1 = (typeMetrics.f1 + amountMetrics.f1 + categoryMetrics.f1 + dateMetrics.f1) / 4;
  const exactMatchAccuracy = exactMatchCount / rows.length;

  const summary: AccuracySummary = {
    perField: {
      transactionType: typeMetrics,
      amount: amountMetrics,
      category: categoryMetrics,
      date: dateMetrics
    },
    macroF1,
    exactMatchAccuracy
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const predictionsPath = path.resolve(resultsDir, `accuracy_predictions_${engine}_${timestamp}.csv`);
  const summaryPath = path.resolve(resultsDir, `accuracy_summary_${engine}_${timestamp}.json`);

  // Save predictions CSV
  const csvHeaders = 'prompt_text,gt_transactionType,gt_amount,gt_category,gt_date,pred_transactionType,pred_amount,pred_category,pred_date,match_transactionType,match_amount,match_category,match_date,all_match\n';
  const csvRows = predictions
    .map(
      (p) =>
        `"${p.prompt_text.replace(/"/g, '""')}",${p.gt_transactionType},${p.gt_amount},"${p.gt_category}",${p.gt_date},${p.pred_transactionType},${p.pred_amount},"${p.pred_category}",${p.pred_date},${p.match_transactionType},${p.match_amount},${p.match_category},${p.match_date},${p.all_match}`
    )
    .join('\n');
  fs.writeFileSync(predictionsPath, csvHeaders + csvRows, 'utf8');
  console.log(`Saved predictions to ${predictionsPath}`);

  // Save summary JSON
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`Saved summary to ${summaryPath}`);

  console.log('\nAccuracy Report Summary:');
  console.log(`Macro-F1: ${macroF1.toFixed(4)}`);
  console.log(`Exact Match Accuracy: ${(exactMatchAccuracy * 100).toFixed(2)}%`);
}

main().catch((err) => {
  console.error('Fatal Accuracy Suite Error:', err);
  process.exit(1);
});
