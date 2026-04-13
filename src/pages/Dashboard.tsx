import InsightCard from "../component/Dashboard/InsightCard";
import MonthlyChart from "../component/Dashboard/MonthlyChart";
import RecentMove from "../component/Dashboard/RecentMove";
import RevenueCard from "../component/Dashboard/RevenueCard";
import Title from "../component/Dashboard/Title";
import WeeklyChart from "../component/Dashboard/WeeklyCharts";

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-4">
            <Title />
            <RevenueCard />
            <InsightCard />
            <WeeklyChart />
            <MonthlyChart />
            <RecentMove />
        </div>
    );
}