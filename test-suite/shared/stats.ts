export function calculateStats(values: number[]): {
  mean: number;
  median: number;
  p95: number;
  min: number;
  max: number;
  stddev: number;
} {
  if (values.length === 0) {
    return { mean: 0, median: 0, p95: 0, min: 0, max: 0, stddev: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  const sum = values.reduce((acc, v) => acc + v, 0);
  const mean = sum / values.length;

  // Median
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // P95
  const p95Idx = Math.min(Math.max(0, Math.ceil(0.95 * sorted.length) - 1), sorted.length - 1);
  const p95 = sorted[p95Idx];

  // Stddev
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
  const stddev = Math.sqrt(variance);

  return { mean, median, p95, min, max, stddev };
}
