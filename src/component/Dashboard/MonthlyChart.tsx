import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { TbChartPie } from 'react-icons/tb';
import { useDarkMode } from '../../hooks/useDarkMode';

ChartJS.register(ArcElement, Tooltip);

export default function MonthlyRatioCard() {
  const isDark = useDarkMode();
  
  const colorIncome = '#003366';
  const colorExpense = isDark ? '#00F5FF' : '#00696B';

  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [6.3, 2.8],
        backgroundColor: [colorIncome, colorExpense],
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
      }
    },
    borderRadius: [30, 30],
  };

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#003366] dark:text-slate-100 font-bold tracking-wide text-sm">
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
              1.8x
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 pl-4">
          
          <div className="flex items-start gap-2">
            <div className="mt-1.5 size-2.5 rounded-full" style={{ backgroundColor: colorIncome }} />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">Income</span>
              <span className="text-sm font-bold text-[#003366] dark:text-slate-100">Rp 6.3M</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="mt-1.5 size-2.5 rounded-full" style={{ backgroundColor: colorExpense }} />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">Expense</span>
              <span className="text-sm font-bold text-[#003366] dark:text-slate-100">Rp 2.8M</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}