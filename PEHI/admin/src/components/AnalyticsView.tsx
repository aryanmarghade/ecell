import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Layers, 
  Award, 
  AlertCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell, 
  PieChart as RechartsPie, 
  Pie 
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { DimensionGraphs } from './DimensionGraphs';
import { GlobalFiltersBar } from './GlobalFiltersBar';

export const AnalyticsView: React.FC = () => {
  const { filteredReviews, metrics, theme } = useDashboard();
  const isDark = theme === 'dark';

  // PEHI Distribution Buckets: <40, 40-59.9, 60-79.9, 80-100
  const distributionData = useMemo(() => {
    const buckets = [
      { name: 'Critical (<40)', count: 0, color: '#EF4444' },
      { name: 'Needs Attention (40-59.9)', count: 0, color: '#F59E0B' },
      { name: 'Good (60-79.9)', count: 0, color: '#14B8A6' },
      { name: 'Excellent (80-100)', count: 0, color: '#22C55E' },
    ];

    filteredReviews.forEach(r => {
      if (r.pehiScore < 40) buckets[0].count++;
      else if (r.pehiScore < 60) buckets[1].count++;
      else if (r.pehiScore < 80) buckets[2].count++;
      else buckets[3].count++;
    });

    return buckets;
  }, [filteredReviews]);

  // Review status distribution
  const statusData = useMemo(() => {
    return [
      { name: 'Unmarked', value: metrics.unmarkedCount, color: '#F59E0B' },
      { name: 'Marked', value: metrics.markedCount, color: '#60A5FA' },
      { name: 'Done', value: metrics.doneCount, color: '#22C55E' },
    ];
  }, [metrics]);

  return (
    <div className="space-y-3">
      
      {/* Universal Filter Bar */}
      <GlobalFiltersBar />

      {/* Six Dimension Matrix */}
      <DimensionGraphs />

      {/* Distribution & Workflow Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        
        {/* PEHI Score Distribution */}
        <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3.5 transition-colors duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#263244]">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">PEHI Score Distribution</h3>
              <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">Classification breakdown across patient feedback</p>
            </div>
            <span className="text-[10px] font-bold text-teal-700 dark:text-[#5EEAD4] bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] px-2 py-0.5 rounded border border-teal-200 dark:border-[rgba(20,184,166,0.30)]">
              {filteredReviews.length} total
            </span>
          </div>

          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 5, right: 5, left: -25, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(148, 163, 184, 0.10)' : '#f1f5f9'} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 9, fill: isDark ? '#94A3B8' : '#64748b' }} 
                  axisLine={{ stroke: isDark ? '#2A3748' : '#e2e8f0' }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 9, fill: isDark ? '#94A3B8' : '#64748b' }} axisLine={{ stroke: isDark ? '#2A3748' : '#e2e8f0' }} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      const pct = filteredReviews.length > 0 ? ((d.count / filteredReviews.length) * 100).toFixed(1) : '0';
                      return (
                        <div className="bg-slate-900 dark:bg-[#151F2D] text-white p-2 rounded text-xs shadow-xl border dark:border-[#2A3748]">
                          <div className="font-bold">{d.name}</div>
                          <div className="text-teal-300 dark:text-[#5EEAD4] font-bold mt-0.5">{d.count} reviews ({pct}%)</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
                  {distributionData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review Management Triage Status */}
        <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3.5 transition-colors duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#263244]">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">Review Management Workflow</h3>
              <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">Triage pipeline from Unmarked to Done</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-[#86EFAC] bg-emerald-50 dark:bg-[rgba(34,197,94,0.15)] px-2 py-0.5 rounded border border-emerald-200 dark:border-[rgba(34,197,94,0.30)]">
              {metrics.doneCount} Resolved
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2.5">
            <div className="p-2 bg-amber-50 dark:bg-[rgba(245,158,11,0.12)] rounded-lg border border-amber-200 dark:border-[rgba(245,158,11,0.25)] text-center">
              <span className="text-[9px] font-bold text-amber-800 dark:text-[#FCD34D] uppercase">Unmarked</span>
              <div className="text-xl font-black text-amber-900 dark:text-[#F8FAFC] mt-0.5">{metrics.unmarkedCount}</div>
              <span className="text-[9px] text-amber-700 dark:text-[#FCD34D]">Needs Triage</span>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-[rgba(96,165,250,0.12)] rounded-lg border border-blue-200 dark:border-[rgba(96,165,250,0.25)] text-center">
              <span className="text-[9px] font-bold text-blue-800 dark:text-[#93C5FD] uppercase">Marked</span>
              <div className="text-xl font-black text-blue-900 dark:text-[#F8FAFC] mt-0.5">{metrics.markedCount}</div>
              <span className="text-[9px] text-blue-700 dark:text-[#93C5FD]">Under Review</span>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-[rgba(34,197,94,0.12)] rounded-lg border border-emerald-200 dark:border-[rgba(34,197,94,0.25)] text-center">
              <span className="text-[9px] font-bold text-emerald-800 dark:text-[#86EFAC] uppercase">Done</span>
              <div className="text-xl font-black text-emerald-900 dark:text-[#F8FAFC] mt-0.5">{metrics.doneCount}</div>
              <span className="text-[9px] text-emerald-700 dark:text-[#86EFAC]">Action Taken</span>
            </div>
          </div>

          <div className="h-28 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 dark:bg-[#151F2D] text-white p-2 rounded text-xs shadow-xl border dark:border-[#2A3748]">
                          <div className="font-bold">{d.name}</div>
                          <div className="text-teal-300 dark:text-[#5EEAD4] font-bold mt-0.5">{d.value} reviews</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
