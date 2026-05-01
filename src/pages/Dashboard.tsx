import { useMemo, useState, useEffect } from "react";
import InsightCard from "../component/Dashboard/InsightCard";
import MonthlyChart from "../component/Dashboard/MonthlyChart";
import RecentMove from "../component/Dashboard/RecentMove";
import RevenueCard from "../component/Dashboard/RevenueCard";
import Title from "../component/Dashboard/Title";
import WeeklyChart from "../component/Dashboard/WeeklyCharts";
import { useTransactions } from "../hooks/useTransactions";
import { getDailyAnalytics } from "../service/gemini";

export default function Dashboard() {
  const { transactions, isLoading } = useTransactions();
  const [aiInsight, setAiInsight] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && transactions.length > 0) {
      const today = new Date().toISOString().split('T')[0];
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



  const weeklyTrend = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      dayMap.set(label, 0);
      labels.push(label);
    }

    transactions.forEach((t) => {
      const d = new Date(t.date);
      d.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        const label = d.toLocaleDateString("en-US", { weekday: "short" });
        if (dayMap.has(label) && t.type === "expense") {
          dayMap.set(label, dayMap.get(label)! + t.amount);
        }
      }
    });

    for (const label of labels) {
      data.push(dayMap.get(label)!);
    }
    
    return { labels, data };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-500 font-medium animate-pulse">
          Calculating your insights...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
        <Title />
        <RevenueCard balance={balance} />
        <InsightCard insight={aiInsight} isLoading={isAiLoading} />
        <WeeklyChart labels={weeklyTrend.labels} data={weeklyTrend.data} />
        <MonthlyChart income={totalIncome} expense={totalExpense} />
        <RecentMove transactions={transactions.slice(0, 3)} />
    </div>
  );
}