export interface TransactionData {
  amount: number;
  type: "income" | "expense";
  category: string;
  note: string;
  date: string;
}

export interface TransactionJSON {
  isTransaction: boolean;
  status?: string;
  transactions?: TransactionData[];
}

export interface LatencyRunRaw {
  runId: number;
  prompt: string;
  engine: string;
  inferenceLatencyMs: number;
  parsingOverheadMs: number;
  dbWriteLatencyMs?: number;
  isOverTarget: boolean;
  error?: string;
}

export interface LatencySummaryRow {
  metric: string;
  mean: number;
  median: number;
  p95: number;
  min: number;
  max: number;
  stddev: number;
  count_over_target: number;
}

export interface AccuracyPredictionRow {
  prompt_text: string;
  gt_transactionType: string;
  gt_amount: number;
  gt_category: string;
  gt_date: string;
  pred_transactionType: string;
  pred_amount: number;
  pred_category: string;
  pred_date: string;
  match_transactionType: number; // 1 or 0
  match_amount: number;          // 1 or 0
  match_category: number;        // 1 or 0
  all_match: number;             // 1 or 0
}

export interface AccuracyFieldMetric {
  precision: number;
  recall: number;
  f1: number;
}

export interface AccuracySummary {
  perField: {
    transactionType: AccuracyFieldMetric;
    amount: AccuracyFieldMetric;
    category: AccuracyFieldMetric;
  };
  macroF1: number;
  exactMatchAccuracy: number;
}

export interface RelevanceRaw {
  historyId: string;
  engine: string;
  insightText: string;
  rounds: Array<{
    contextualAccuracy: number;
    relevance: number;
    actionability: number;
    reasoning: string;
  }>;
}

export interface RelevanceSummaryRow {
  history_id: string;
  insight_text: string;
  avg_contextualAccuracy: number;
  avg_relevance: number;
  avg_actionability: number;
  human_score: string; // empty placeholder (nullable)
}
