import InsightCard from "../component/Dashboard/InsightCard";
import MonthlyChart from "../component/Dashboard/MonthlyChart";
import RecentMove from "../component/Dashboard/RecentMove";
import RevenueCard from "../component/Dashboard/RevenueCard";
import Title from "../component/Dashboard/Title";
import WeeklyChart from "../component/Dashboard/WeeklyCharts";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
  const {
    transactions,
    isLoading,
    aiInsight,
    isAiLoading,
    totalIncome,
    totalExpense,
    balance,
    weeklyTrend,
  } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center text-slate-500 font-medium animate-pulse">
          Calculating your insights...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Title />
      <RevenueCard balance={balance} />
      <InsightCard insight={aiInsight} isLoading={isAiLoading} />
      <WeeklyChart labels={weeklyTrend.labels} data={weeklyTrend.data} />
      <MonthlyChart income={totalIncome} expense={totalExpense} />
      <RecentMove transactions={transactions.slice(0, 3)} />
    </div>
  );
}