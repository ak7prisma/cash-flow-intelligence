import '../shared/setup-env';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { callAiEngine } from '../shared/engine-client';
import { calculateStats } from '../shared/stats';
import { LatencyRunRaw, LatencySummaryRow } from '../shared/types';

// Import existing db and models if writing to database
import { IncomeTransaction } from '../../src/models/IncomeTransaction';
import { ExpenseTransaction } from '../../src/models/ExpenseTransaction';
import { transactionService } from '../../src/service/TransactionService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();
program
  .requiredOption('--engine <type>', 'AI Engine to test (llm or slm)')
  .option('--n <number>', 'Number of repetitions per prompt', '30')
  .option('--no-db', 'Skip Firestore database write')
  .parse(process.argv);

const options = program.opts();
const engine = options.engine.toLowerCase() as 'llm' | 'slm';
const n = parseInt(options.n, 10);
const runDb = options.db !== false;

// Set AI_ENGINE in environment so client knows which model list to use
process.env.AI_ENGINE = engine;

const promptsPath = path.resolve(__dirname, 'prompts.txt');
const resultsDir = path.resolve(__dirname, '../results');

if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Generate default prompts.txt if it does not exist
if (!fs.existsSync(promptsPath)) {
  const defaultPrompts = [
    'Beli cilok di pinggir jalan 5rb',
    'Gajian bulanan masuk rekening 8.5jt',
    'Bayar kosan bulanan 1.5 juta rupiah',
    'Nonton bioskop habis 75.000',
    'Beli pulsa simpati 25k',
    'Dapat bonus projek 2 juta rupiah dari klien',
    'Makan siang nasi goreng spesial 35rb',
    'Isi bensin motor pertalite 20k',
    'Bayar tagihan listrik PLN 250rb',
    'Beli sepatu olahraga baru 450.000',
    'Dikasih uang jajan sama kaka 100k',
    'Belanja bulanan di minimarket 350 ribu',
    'Beli es kopi susu kekinian 18k',
    'Servis motor rutin bulanan 120rb',
    'Sumbangan kas masjid 10k'
  ];
  fs.writeFileSync(promptsPath, defaultPrompts.join('\n'), 'utf8');
}

async function main() {
  const prompts = fs
    .readFileSync(promptsPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log(`Starting Latency Test Suite: engine=${engine}, n=${n}, runDb=${runDb}`);
  console.log(`Loaded ${prompts.length} prompts.`);

  const rawRuns: LatencyRunRaw[] = [];
  let runCounter = 1;

  for (let pIdx = 0; pIdx < prompts.length; pIdx++) {
    const prompt = prompts[pIdx];
    console.log(`[Prompt ${pIdx + 1}/${prompts.length}] "${prompt}"`);

    for (let i = 0; i < n; i++) {
      const runId = runCounter++;
      process.stdout.write(`  [${i + 1}/${n}] engine=${engine} module=latency... `);

      let success = false;
      let raw = '';
      let parsed: any = null;
      let t0 = 0;
      let t1 = 0;

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await callAiEngine(prompt);
          raw = res.raw;
          parsed = res.parsed;
          t0 = res.timings.t0;
          t1 = res.timings.t1;
          success = true;
          break;
        } catch (err: any) {
          console.warn(`\n  [Attempt ${attempt}/3 failed] error: ${err?.message || err}`);
          if (attempt === 3) {
            rawRuns.push({
              runId,
              prompt,
              engine,
              inferenceLatencyMs: 0,
              parsingOverheadMs: 0,
              isOverTarget: false,
              error: err?.message || String(err)
            });
          }
        }
      }

      if (!success) continue;

      // Parsing overhead (in-memory mapping to transaction)
      const t1_parse = performance.now();
      let dbWriteLatencyMs: number | undefined;
      let mapped = false;

      if (parsed?.isTransaction && parsed?.transactions?.length > 0) {
        try {
          const txData = parsed.transactions[0];
          const params = {
            userId: 'test-suite-user',
            amount: Number(txData.amount) || 0,
            category: txData.category || 'Other',
            date: new Date(txData.date || new Date()),
            note: txData.note || ''
          };

          const tx = txData.type === 'income' ? new IncomeTransaction(params) : new ExpenseTransaction(params);
          mapped = true;

          const t2 = performance.now();
          const parseOverhead = t2 - t1_parse;

          if (runDb) {
            await transactionService.addTransaction(tx);
            const t3 = performance.now();
            dbWriteLatencyMs = t3 - t2;
          }

          const inferenceLatency = t1 - t0;
          const isOverTarget = inferenceLatency > 10000; // 10 seconds in milliseconds

          rawRuns.push({
            runId,
            prompt,
            engine,
            inferenceLatencyMs: inferenceLatency,
            parsingOverheadMs: parseOverhead,
            dbWriteLatencyMs,
            isOverTarget
          });

          console.log(`Success! Inference: ${(inferenceLatency / 1000).toFixed(2)}s, Parse: ${parseOverhead.toFixed(2)}ms, DB: ${dbWriteLatencyMs ? (dbWriteLatencyMs / 1000).toFixed(2) + 's' : 'N/A'}`);
        } catch (err: any) {
          console.log(`Failed inside parsing/DB write: ${err?.message || err}`);
          rawRuns.push({
            runId,
            prompt,
            engine,
            inferenceLatencyMs: t1 - t0,
            parsingOverheadMs: performance.now() - t1_parse,
            isOverTarget: (t1 - t0) > 10000,
            error: `Parsing/DB Error: ${err?.message || err}`
          });
        }
      } else {
        const t2 = performance.now();
        const parseOverhead = t2 - t1_parse;
        const inferenceLatency = t1 - t0;
        const isOverTarget = inferenceLatency > 10000;

        rawRuns.push({
          runId,
          prompt,
          engine,
          inferenceLatencyMs: inferenceLatency,
          parsingOverheadMs: parseOverhead,
          isOverTarget
        });

        console.log(`Success (Non-tx)! Inference: ${(inferenceLatency / 1000).toFixed(2)}s, Parse: ${parseOverhead.toFixed(2)}ms`);
      }
    }
  }

  // Calculate statistics
  const inferenceTimes = rawRuns.filter((r) => !r.error).map((r) => r.inferenceLatencyMs);
  const parseTimes = rawRuns.filter((r) => !r.error).map((r) => r.parsingOverheadMs);
  const dbTimes = rawRuns.filter((r) => !r.error && r.dbWriteLatencyMs !== undefined).map((r) => r.dbWriteLatencyMs as number);

  const infStats = calculateStats(inferenceTimes);
  const parseStats = calculateStats(parseTimes);
  const dbStats = calculateStats(dbTimes);

  const overTargetCount = rawRuns.filter((r) => r.isOverTarget).length;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const rawPath = path.resolve(resultsDir, `latency_raw_${engine}_${timestamp}.json`);
  const summaryPath = path.resolve(resultsDir, `latency_summary_${engine}_${timestamp}.csv`);

  // Save Raw
  fs.writeFileSync(rawPath, JSON.stringify(rawRuns, null, 2), 'utf8');
  console.log(`Saved raw runs to ${rawPath}`);

  // Create Summary CSV
  const csvHeaders = 'metric,mean,median,p95,min,max,stddev,count_over_target\n';
  const infRow = `Inference Latency,${infStats.mean.toFixed(2)},${infStats.median.toFixed(2)},${infStats.p95.toFixed(2)},${infStats.min.toFixed(2)},${infStats.max.toFixed(2)},${infStats.stddev.toFixed(2)},${overTargetCount}\n`;
  const parseRow = `Parsing Overhead,${parseStats.mean.toFixed(2)},${parseStats.median.toFixed(2)},${parseStats.p95.toFixed(2)},${parseStats.min.toFixed(2)},${parseStats.max.toFixed(2)},${parseStats.stddev.toFixed(2)},0\n`;
  const dbRow = `DB Write Latency,${dbStats.mean.toFixed(2)},${dbStats.median.toFixed(2)},${dbStats.p95.toFixed(2)},${dbStats.min.toFixed(2)},${dbStats.max.toFixed(2)},${dbStats.stddev.toFixed(2)},0\n`;

  fs.writeFileSync(summaryPath, csvHeaders + infRow + parseRow + dbRow, 'utf8');
  console.log(`Saved summary to ${summaryPath}`);
}

main().catch((err) => {
  console.error('Fatal Latency Suite Error:', err);
  process.exit(1);
});
