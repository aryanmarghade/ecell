import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { TrendingUp, Calendar, Info } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { aggregateTimeSeries } from '../utils/pehiCalculator';

export const PEHITimeChart: React.FC = () => {
  const { filteredReviews, thresholds, theme } = useDashboard();
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Daily');

  const chartData = useMemo(() => {
    return aggregateTimeSeries(filteredReviews, timeframe);
  }, [filteredReviews, timeframe]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return { avg: 0, max: 0, min: 0 };
    const scores = chartData.map(d => d.pehi);
    const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    return { avg, max, min };
  }, [chartData]);

  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3.5 mb-4 transition-colors duration-150">
      
      {/* Header with Title and Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-[#263244]">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight">PEHI Performance Trajectory</h2>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] text-teal-700 dark:text-[#5EEAD4] font-semibold border border-teal-200/60 dark:border-[#14B8A6]/40">
              Live Aggregate
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Hospital Patient Experience & Happiness Index trajectory across selected period
          </p>
        </div>

        {/* Timeframe Buttons: Daily, Weekly, Monthly, Yearly */}
        <div className="flex items-center space-x-0.5 bg-slate-100 dark:bg-[#151F2D] p-0.5 rounded-md self-start sm:self-auto border dark:border-[#2A3748]">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-0.5 text-[11px] font-semibold rounded transition ${
                timeframe === tf
                  ? 'bg-white dark:bg-[#182230] text-teal-800 dark:text-[#5EEAD4] shadow-2xs font-bold border dark:border-[#14B8A6]/40'
                  : 'text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Mini Stats Strip */}
      <div className="grid grid-cols-3 gap-2.5 my-2.5">
        <div className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#151F2D] border border-slate-100 dark:border-[#2A3748]">
          <span className="text-[9px] font-bold text-slate-400 dark:text-[#94A3B8] uppercase tracking-wider">Period Average</span>
          <p className="text-sm font-black text-slate-800 dark:text-[#F8FAFC] mt-0.5 tabular-nums">
            {stats.avg > 0 ? `${stats.avg.toFixed(1)}` : '—'} <span className="text-[10px] font-normal text-slate-400 dark:text-[#94A3B8]">/ 100</span>
          </p>
        </div>
        <div className="px-2.5 py-1.5 rounded-md bg-emerald-50/60 dark:bg-[rgba(34,197,94,0.12)] border border-emerald-100 dark:border-[rgba(34,197,94,0.25)]">
          <span className="text-[9px] font-bold text-emerald-600 dark:text-[#86EFAC] uppercase tracking-wider">Peak Recorded</span>
          <p className="text-sm font-black text-emerald-800 dark:text-[#86EFAC] mt-0.5 tabular-nums">
            {stats.max > 0 ? `${stats.max.toFixed(1)}` : '—'}
          </p>
        </div>
        <div className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#151F2D] border border-slate-100 dark:border-[#2A3748]">
          <span className="text-[9px] font-bold text-slate-400 dark:text-[#94A3B8] uppercase tracking-wider">Threshold Target</span>
          <p className="text-sm font-black text-teal-700 dark:text-[#5EEAD4] mt-0.5 tabular-nums">
            {thresholds.pehiAlertThreshold}.0
          </p>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-60 w-full mt-1">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-[#94A3B8] text-xs bg-slate-50/50 dark:bg-[#151F2D]/50 rounded-lg border border-dashed border-slate-200 dark:border-[#2A3748]">
            <Info className="h-5 w-5 text-slate-400 dark:text-[#94A3B8] mb-1" />
            <p className="font-semibold text-slate-600 dark:text-[#CBD5E1]">No historical data available</p>
            <p className="text-[10px] text-slate-400 dark:text-[#94A3B8] mt-0.5">Historical trend points will appear automatically as patient feedback is recorded.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="pehiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={isDark ? 0.35 : 0.25} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? 'rgba(148, 163, 184, 0.10)' : '#f1f5f9'} 
                vertical={false} 
              />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 10, fill: isDark ? '#94A3B8' : '#64748b' }} 
                axisLine={{ stroke: isDark ? '#2A3748' : '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                ticks={[0, 25, 50, 75, 100]} 
                tick={{ fontSize: 10, fill: isDark ? '#94A3B8' : '#64748b' }}
                axisLine={{ stroke: isDark ? '#2A3748' : '#e2e8f0' }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 dark:bg-[#151F2D] text-white rounded-md p-2.5 shadow-xl border border-slate-800 dark:border-[#2A3748] text-xs">
                        <div className="font-bold text-teal-300 dark:text-[#5EEAD4] text-xs">{label}</div>
                        <div className="mt-1 flex items-center justify-between space-x-3">
                          <span className="text-slate-300 dark:text-[#CBD5E1]">PEHI Score:</span>
                          <span className="font-black text-white dark:text-[#F8FAFC] text-sm">{data.pehi.toFixed(1)} / 100</span>
                        </div>
                        <div className="mt-0.5 flex items-center justify-between space-x-3 text-[10px] text-slate-400 dark:text-[#94A3B8]">
                          <span>Patient Reviews:</span>
                          <span className="font-semibold text-slate-200 dark:text-[#E5E7EB]">{data.reviewsCount} submissions</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine 
                y={thresholds.pehiAlertThreshold} 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                label={{ value: `Alert (${thresholds.pehiAlertThreshold})`, position: 'insideTopRight', fill: isDark ? '#FCD34D' : '#d97706', fontSize: 9 }}
              />
              <Area 
                type="monotone" 
                dataKey="pehi" 
                stroke="#14B8A6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#pehiGradient)" 
                activeDot={{ r: 5, fill: '#0d9488', stroke: isDark ? '#182230' : '#fff', strokeWidth: 1.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
