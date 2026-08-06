import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsDir = path.resolve(__dirname, 'results');

function getLatestFile(dir: string, pattern: RegExp): string | null {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const matched = files
    .filter((f) => pattern.test(f))
    .map((f) => {
      const filePath = path.join(dir, f);
      const stat = fs.statSync(filePath);
      return { name: f, path: filePath, mtime: stat.mtimeMs };
    });

  if (matched.length === 0) return null;
  matched.sort((a, b) => b.mtime - a.mtime);
  return matched[0].path;
}

function parseCSVLine(line: string): string[] {
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
}

interface LatencyData {
  mean: string;
  p95: string;
}

function extractLatency(filePath: string | null): LatencyData {
  if (!filePath) return { mean: 'N/A', p95: 'N/A' };
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    for (const line of lines) {
      const cols = parseCSVLine(line);
      if (cols[0] && cols[0].toLowerCase().includes('inference')) {
        // mean is cols[1], p95 is cols[3] in milliseconds, convert to seconds
        const meanMs = parseFloat(cols[1]);
        const p95Ms = parseFloat(cols[3]);
        return {
          mean: isNaN(meanMs) ? 'N/A' : `${(meanMs / 1000).toFixed(2)}s`,
          p95: isNaN(p95Ms) ? 'N/A' : `${(p95Ms / 1000).toFixed(2)}s`
        };
      }
    }
  } catch (err) {
    console.error(`Error reading/parsing latency file ${filePath}:`, err);
  }
  return { mean: 'N/A', p95: 'N/A' };
}

interface AccuracyData {
  macroF1: string;
  exactMatch: string;
}

function extractAccuracy(filePath: string | null): AccuracyData {
  if (!filePath) return { macroF1: 'N/A', exactMatch: 'N/A' };
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const macroF1 = Number(content.macroF1);
    const exactMatch = Number(content.exactMatchAccuracy);
    return {
      macroF1: isNaN(macroF1) ? 'N/A' : macroF1.toFixed(4),
      exactMatch: isNaN(exactMatch) ? 'N/A' : `${(exactMatch * 100).toFixed(2)}%`
    };
  } catch (err) {
    console.error(`Error reading/parsing accuracy file ${filePath}:`, err);
  }
  return { macroF1: 'N/A', exactMatch: 'N/A' };
}

interface RelevanceData {
  avgAcc: string;
  avgRel: string;
  avgAct: string;
}

function extractRelevance(filePath: string | null): RelevanceData {
  if (!filePath) return { avgAcc: 'N/A', avgRel: 'N/A', avgAct: 'N/A' };
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    // skip header row
    const dataLines = lines.slice(1);
    let totalAcc = 0;
    let totalRel = 0;
    let totalAct = 0;
    let count = 0;

    for (const line of dataLines) {
      const cols = parseCSVLine(line);
      if (cols.length >= 5) {
        // history_id, insight_text, avg_contextualAccuracy, avg_relevance, avg_actionability, human_score
        const acc = parseFloat(cols[2]);
        const rel = parseFloat(cols[3]);
        const act = parseFloat(cols[4]);
        if (!isNaN(acc) && !isNaN(rel) && !isNaN(act)) {
          totalAcc += acc;
          totalRel += rel;
          totalAct += act;
          count++;
        }
      }
    }

    if (count > 0) {
      return {
        avgAcc: (totalAcc / count).toFixed(2),
        avgRel: (totalRel / count).toFixed(2),
        avgAct: (totalAct / count).toFixed(2)
      };
    }
  } catch (err) {
    console.error(`Error reading/parsing relevance file ${filePath}:`, err);
  }
  return { avgAcc: 'N/A', avgRel: 'N/A', avgAct: 'N/A' };
}

async function main() {
  console.log(`Summarizing evaluation results...`);

  // Find latest files
  const latestLatencyLlm = getLatestFile(resultsDir, /^latency_summary_llm_.*\.csv$/);
  const latestLatencySlm = getLatestFile(resultsDir, /^latency_summary_slm_.*\.csv$/);
  const latestAccuracyLlm = getLatestFile(resultsDir, /^accuracy_summary_llm_.*\.json$/);
  const latestAccuracySlm = getLatestFile(resultsDir, /^accuracy_summary_slm_.*\.json$/);
  const latestRelevanceLlm = getLatestFile(resultsDir, /^relevance_summary_llm_.*\.csv$/);
  const latestRelevanceSlm = getLatestFile(resultsDir, /^relevance_summary_slm_.*\.csv$/);

  console.log('Latest Files Found:');
  console.log(`- Latency LLM: ${latestLatencyLlm ? path.basename(latestLatencyLlm) : 'Missing'}`);
  console.log(`- Latency SLM: ${latestLatencySlm ? path.basename(latestLatencySlm) : 'Missing'}`);
  console.log(`- Accuracy LLM: ${latestAccuracyLlm ? path.basename(latestAccuracyLlm) : 'Missing'}`);
  console.log(`- Accuracy SLM: ${latestAccuracySlm ? path.basename(latestAccuracySlm) : 'Missing'}`);
  console.log(`- Relevance LLM: ${latestRelevanceLlm ? path.basename(latestRelevanceLlm) : 'Missing'}`);
  console.log(`- Relevance SLM: ${latestRelevanceSlm ? path.basename(latestRelevanceSlm) : 'Missing'}`);

  const latLlm = extractLatency(latestLatencyLlm);
  const latSlm = extractLatency(latestLatencySlm);
  const accLlm = extractAccuracy(latestAccuracyLlm);
  const accSlm = extractAccuracy(latestAccuracySlm);
  const relLlm = extractRelevance(latestRelevanceLlm);
  const relSlm = extractRelevance(latestRelevanceSlm);

  const markdownTable = `# Evaluation Summary Table (LLM vs SLM)

| Metric | LLM (gemini-flash) | SLM (gemma) |
| --- | --- | --- |
| Model Inference Latency (Mean) | ${latLlm.mean} | ${latSlm.mean} |
| Model Inference Latency (P95) | ${latLlm.p95} | ${latSlm.p95} |
| Macro-F1 | ${accLlm.macroF1} | ${accSlm.macroF1} |
| Exact-Match Accuracy | ${accLlm.exactMatch} | ${accSlm.exactMatch} |
| Avg Contextual Accuracy | ${relLlm.avgAcc} | ${relSlm.avgAcc} |
| Avg Relevance | ${relLlm.avgRel} | ${relSlm.avgRel} |
| Avg Actionability | ${relLlm.avgAct} | ${relSlm.avgAct} |
`;

  const outputPath = path.resolve(resultsDir, 'evaluation_summary.md');
  fs.writeFileSync(outputPath, markdownTable, 'utf8');
  console.log(`Saved evaluation summary to ${outputPath}`);
}

main().catch((err) => {
  console.error('Fatal Summarizer Error:', err);
  process.exit(1);
});
