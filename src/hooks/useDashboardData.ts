import { useState, useEffect, useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { getDailyAnalytics } from "../service/gemini";
import { getLocalDateISO } from "../utils/dateHelpers";
import {
  buildChartTrend,
  type ChartMode,
  type ChartPeriod,
} from "../utils/chartHelpers";

export type { ChartMode, ChartPeriod } from "../utils/chartHelpers";

export function useDashboardData() {
  const { transactions, isLoading } = useTransactions();
  const [aiInsight, setAiInsight] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("weekly");
  const [chartMode, setChartMode] = useState<ChartMode>("expense");

  useEffect(() => {
    if (!isLoading && transactions.length > 0) {
      const today = getLocalDateISO();
      const cacheKey = `geminiInsight_${today}`;
      const cachedInsight = localStorage.getItem(cacheKey);

      if (cachedInsight) {
        setAiInsight(cachedInsight);
        return;
      }

      setIsAiLoading(true);
      getDailyAnalytics(transactions.slice(0, 10))
        .then((res) => {
          setAiInsight(res);
          localStorage.setItem(cacheKey, res);
        })
        .catch(() => setAiInsight("Gagal memuat analisis AI."))
        .finally(() => setIsAiLoading(false));
    } else if (!isLoading && transactions.length === 0) {
      setAiInsight("Belum ada data transaksi untuk dianalisis.");
    }
  }, [isLoading, transactions]);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [transactions]);

  const chartTrend = useMemo(
    () => buildChartTrend(transactions, chartPeriod),
    [transactions, chartPeriod]
  );

  return {
    transactions,
    isLoading,
    aiInsight,
    isAiLoading,
    totalIncome,
    totalExpense,
    balance,
    chartTrend,
    chartPeriod,
    setChartPeriod,
    chartMode,
    setChartMode,
  };
}
