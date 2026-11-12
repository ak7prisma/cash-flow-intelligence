import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ScriptableContext,
  type ChartOptions,
  type ChartData,
  type ChartDataset,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MdOutlineShowChart } from 'react-icons/md';
import { useMemo } from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import type { ChartMode, ChartPeriod } from '../../utils/chartHelpers';
import { formatIDR } from '../../utils/assistantHelpers';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface WeeklyChartProps {
  labels: string[];
  income: number[];
  expense: number[];
  period: ChartPeriod;
  mode: ChartMode;
  onPeriodChange: (period: ChartPeriod) => void;
  onModeChange: (mode: ChartMode) => void;
}

const MODE_OPTIONS: { value: ChartMode; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'both', label: 'Income vs Expense' },
];

const PERIOD_OPTIONS: { value: ChartPeriod; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const TITLES: Record<ChartMode, string> = {
  expense: 'SPENDING TREND',
  income: 'INCOME TREND',
  both: 'INCOME VS EXPENSE',
};

function makeGradient(color: string) {
  return (context: ScriptableContext<'line'>) => {
    const { ctx, chartArea } = context.chart;
    if (!chartArea) return undefined;

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    return gradient;
  };
}

function filterButtonClass(active: boolean) {
  return `px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 ${
    active
      ? 'bg-blue-950 text-white dark:bg-cyan-400 dark:text-slate-950 shadow-lg shadow-cyan-400/20'
      : 'bg-slate-200/60 text-slate-500 dark:bg-slate-800/40 dark:text-slate-400'
  }`;
}

export default function WeeklyChart({
  labels,
  income,
  expense,
  period,
  mode,
  onPeriodChange,
  onModeChange,
}: Readonly<WeeklyChartProps>) {
  const isDark = useDarkMode();

  const expenseColor = isDark ? '#00F5FF' : '#00696B';
  const incomeColor = isDark ? '#4ADE80' : '#047857';
  const periodLabel = PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? period;

  const chartData: ChartData<'line'> = useMemo(() => {
    const datasets: ChartDataset<'line'>[] = [];
    const base = {
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 3,
      pointBorderWidth: 2,
    };

    if (mode === 'expense' || mode === 'both') {
      datasets.push({
        ...base,
        label: 'Expense',
        data: expense,
        borderColor: expenseColor,
        pointBackgroundColor: expenseColor,
        pointBorderColor: expenseColor,
        backgroundColor: makeGradient(
          isDark ? 'rgba(0, 245, 255, 0.2)' : 'rgba(0, 105, 107, 0.2)'
        ),
      });
    }

    if (mode === 'income' || mode === 'both') {
      datasets.push({
        ...base,
        label: 'Income',
        data: income,
        borderColor: incomeColor,
        pointBackgroundColor: incomeColor,
        pointBorderColor: incomeColor,
        backgroundColor: makeGradient(
          isDark ? 'rgba(74, 222, 128, 0.2)' : 'rgba(4, 120, 87, 0.2)'
        ),
      });
    }

    return {
      labels: labels.length > 0 ? labels : ['No Data'],
      datasets,
    };
  }, [isDark, labels, income, expense, mode, expenseColor, incomeColor]);

  const chartOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: mode === 'both',
        position: 'bottom',
        labels: {
          color: isDark ? '#cbd5e1' : '#334155',
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          font: { size: 10, family: 'inherit' },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#cbd5e1' : '#334155',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? '#1e293b' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${formatIDR(Number(context.raw))}`,
        },
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#A8ABB3',
          maxTicksLimit: 12,
          font: {
            size: 11,
            family: 'inherit'
          }
        }
      },
      y: {
        display: false,
        min: 0,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  }), [isDark, mode]);

  return (
    <div className="bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-blue-950 dark:text-slate-100 font-bold tracking-wide text-base">
          {TITLES[mode]} <span className="text-slate-400">/ {periodLabel}</span>
        </h2>
        <MdOutlineShowChart className="text-slate-400 text-xl font-semibold" />
      </div>

      <div className="flex flex-col gap-2 mt-3">
        <div className="flex flex-wrap gap-2">
          {MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onModeChange(option.value)}
              className={filterButtonClass(mode === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onPeriodChange(option.value)}
              className={filterButtonClass(period === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-56 w-full mt-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
