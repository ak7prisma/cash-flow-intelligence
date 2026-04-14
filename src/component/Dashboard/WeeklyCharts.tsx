import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ScriptableContext,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MdOutlineShowChart } from 'react-icons/md';
import { useMemo } from 'react';
import { DAYS, CHART_DATA, TARGET_INDEX } from '../../data/dummytester';
import { useDarkMode } from '../../hooks/useDarkMode';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function WeeklyChart() {
  const isDark = useDarkMode();

  const chartData: ChartData<'line'> = useMemo(() => ({
    labels: DAYS,
    datasets: [
      {
        data: CHART_DATA,
        fill: true,
        tension: 0.4,
        borderColor: isDark ? '#00F5FF' : '#00696B',
        borderWidth: 3,
        pointBackgroundColor: isDark ? '#00F5FF' : '#00696B',
        pointBorderColor: isDark ? '#00F5FF' : '#00696B',
        pointBorderWidth: 2,
        pointRadius: 4,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return undefined;
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          if (isDark) {
            gradient.addColorStop(0, 'rgba(0, 245, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(0, 105, 107, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 105, 107, 0)');
          }
          return gradient;
        },
      }
    ]
  }), [isDark]);

  const chartOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#cbd5e1' : '#334155',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? '#1e293b' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: (ctx) => {
            if (ctx.index === TARGET_INDEX) return isDark ? '#00F5FF' : '#00696B';
            return '#A8ABB3';
          },
          font: (ctx) => ({
            size: 11,
            family: 'inherit',
            weight: ctx.index === TARGET_INDEX ? 'bold' : 'normal'
          })
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
  }), [isDark]);

  return (
    <div className="bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-blue-950 dark:text-slate-100 font-bold tracking-wide text-base">
          WEEKLY SPENDING TREND
        </h2>
        <MdOutlineShowChart className="text-slate-400 text-xl font-semibold" />
      </div>

      <div className="h-56 w-full mt-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}