import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { TbChartPie } from 'react-icons/tb';
import { useDarkMode } from '../../hooks/useDarkMode';
import { formatIDR } from "../../utils/assistantHelpers";

ChartJS.register(ArcElement, Tooltip);

interface MonthlyChartProps {
  income: number;
  expense: number;
}

export default function MonthlyChart({ income, expense }: Readonly<MonthlyChartProps>) {
  const isDark = useDarkMode();
  
  const colorIncome = '#003366';
  const colorExpense = isDark ? '#00F5FF' : '#00696B';

  const hasData = income > 0 || expense > 0;
  
  const ratio = hasData && expense > 0 ? (income / expense).toFixed(1) : (income > 0 ? '∞' : '0');

  const chartData = {
    labels: hasData ? ['Income', 'Expense'] : ['No Data'],
    datasets: [
      {
        data: hasData ? [income, expense] : [1],
        backgroundColor: hasData ? [colorIncome, colorExpense] : ['#e2e8f0'],
        borderWidth: 0,
        cutout: '80%',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            if (!hasData) return 'No data';
            return ` ${context.label}: ${formatIDR(context.raw)}`;
          }
        }
      }
    },
    borderRadius: [30, 30],
  };

  return (
    <div className="bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#003366] dark:text-slate-100 font-bold tracking-wide text-base">
          MONTHLY: INCOME vs EXPENSE
        </h2>
        <TbChartPie className="text-slate-500 text-2xl" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative size-32">
          <Doughnut data={chartData} options={chartOptions} />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              RATIO
            </span>
            <span className="text-base font-bold text-[#003366] dark:text-slate-100">
              {ratio}x
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 pl-4">
          <div className="flex items-start gap-2">
            <div className="mt-1.5 size-2.5 rounded-full" style={{ backgroundColor: colorIncome }} />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">Income</span>
              <span className="text-sm font-bold text-[#003366] dark:text-slate-100">{formatIDR(income)}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="mt-1.5 size-2.5 rounded-full" style={{ backgroundColor: colorExpense }} />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">Expense</span>
              <span className="text-sm font-bold text-[#003366] dark:text-slate-100">{formatIDR(expense)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}