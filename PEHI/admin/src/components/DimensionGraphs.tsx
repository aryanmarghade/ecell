import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  Cell
} from 'recharts';
import { 
  Stethoscope, 
  Users, 
  MessageSquare, 
  Bed, 
  Gauge, 
  Smile, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { DIMENSION_INFO, classifyPEHI } from '../utils/pehiCalculator';
import { DimensionKey } from '../types';

export const DimensionGraphs: React.FC = () => {
  const { metrics, filteredReviews, thresholds, theme } = useDashboard();
  const [chartView, setChartView] = useState<'bar' | 'radar'>('bar');
  const isDark = theme === 'dark';

  const dimensionKeys: { key: DimensionKey; icon: any }[] = [
    { key: 'clinicalCare', icon: Stethoscope },
    { key: 'nursingStaff', icon: Users },
    { key: 'communication', icon: MessageSquare },
    { key: 'comfortFacilities', icon: Bed },
    { key: 'serviceEfficiency', icon: Gauge },
    { key: 'happinessLoyalty', icon: Smile },
  ];

  const dimensionData = dimensionKeys.map(({ key }) => {
    const info = DIMENSION_INFO[key];
    const score = metrics.dimensionAverages[key] || 0;
    const status = classifyPEHI(score);
    return {
      key,
      name: info.name,
      shortName: info.name.split('&')[0].trim(),
      score,
      weight: info.weight * 100,
      weightLabel: `${info.weight * 100}%`,
      questions: `Q${info.questions[0]}–Q${info.questions[info.questions.length - 1]}`,
      color: info.color,
      status,
      reviewCount: filteredReviews.length,
      isBelowAlert: score < thresholds.pehiAlertThreshold
    };
  });

  return (
    <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3.5 mb-4 transition-colors duration-150">
      
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-[#263244]">
        <div>
          <h2 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight">Six-Dimension Quality Matrix</h2>
          <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Core healthcare dimensions weighted to produce the overall PEHI index
          </p>
        </div>

        <div className="flex items-center space-x-0.5 bg-slate-100 dark:bg-[#151F2D] p-0.5 rounded-md self-start sm:self-auto border dark:border-[#2A3748]">
          <button
            onClick={() => setChartView('bar')}
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded transition ${
              chartView === 'bar' 
                ? 'bg-white dark:bg-[#182230] text-teal-800 dark:text-[#5EEAD4] shadow-2xs font-bold border dark:border-[#14B8A6]/40' 
                : 'text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
            }`}
          >
            Horizontal Bar
          </button>
          <button
            onClick={() => setChartView('radar')}
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded transition ${
              chartView === 'radar' 
                ? 'bg-white dark:bg-[#182230] text-teal-800 dark:text-[#5EEAD4] shadow-2xs font-bold border dark:border-[#14B8A6]/40' 
                : 'text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
            }`}
          >
            Radar Matrix
          </button>
        </div>
      </div>

      {/* 6 Dimension Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 my-3">
        {dimensionKeys.map(({ key, icon: Icon }) => {
          const info = DIMENSION_INFO[key];
          const score = metrics.dimensionAverages[key] || 0;
          const status = classifyPEHI(score);
          const isAlert = score < thresholds.pehiAlertThreshold;

          return (
            <div 
              key={key}
              className={`p-2.5 rounded-md border transition ${
                isAlert 
                  ? 'bg-rose-50/30 dark:bg-[rgba(239,68,68,0.10)] border-rose-200 dark:border-[rgba(239,68,68,0.30)]' 
                  : 'bg-slate-50/70 dark:bg-[#151F2D] border-slate-200 dark:border-[#2A3748] hover:bg-white dark:hover:bg-[#1D2938] hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-[#94A3B8]">
                  {`Q${info.questions[0]}–Q${info.questions[info.questions.length - 1]}`}
                </span>
                <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-slate-200/80 dark:bg-[#2A3748] text-slate-700 dark:text-[#CBD5E1]">
                  Wt: {info.weight * 100}%
                </span>
              </div>

              <div className="flex items-center space-x-1.5 mt-1.5">
                <div 
                  className="p-1 rounded-md text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: info.color }}
                >
                  <Icon className="h-3 w-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-[#F3F4F6] truncate leading-tight" title={info.name}>
                    {info.name}
                  </p>
                </div>
              </div>

              <div className="mt-1.5 flex items-baseline justify-between">
                <div className="flex items-baseline space-x-1">
                  <span className={`text-base font-black tabular-nums ${isAlert ? 'text-rose-600 dark:text-[#FCA5A5]' : 'text-slate-900 dark:text-[#F8FAFC]'}`}>
                    {score > 0 ? score.toFixed(1) : '—'}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-[#94A3B8]">/ 100</span>
                </div>
                <span className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                  status === 'Excellent' ? 'bg-emerald-100 dark:bg-[rgba(34,197,94,0.15)] text-emerald-800 dark:text-[#86EFAC]' :
                  status === 'Good' ? 'bg-teal-100 dark:bg-[rgba(20,184,166,0.15)] text-teal-800 dark:text-[#5EEAD4]' :
                  status === 'Needs Improvement' ? 'bg-amber-100 dark:bg-[rgba(245,158,11,0.15)] text-amber-800 dark:text-[#FCD34D]' :
                  'bg-rose-100 dark:bg-[rgba(239,68,68,0.15)] text-rose-800 dark:text-[#FCA5A5]'
                }`}>
                  {status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-[#2A3748] h-1 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, Math.max(0, score))}%`,
                    backgroundColor: isAlert ? '#ef4444' : info.color 
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-[#94A3B8] mt-1.5">
                <span>{filteredReviews.length} reviews</span>
                <span className="flex items-center space-x-0.5 text-slate-600 dark:text-[#CBD5E1] font-medium">
                  <TrendingUp className="h-2.5 w-2.5 text-teal-600 dark:text-[#2DD4BF] inline" />
                  <span>Avg</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dimension Comparison Visualizer */}
      <div className="mt-1 pt-2.5 border-t border-slate-100 dark:border-[#263244]">
        <h3 className="text-[11px] font-bold text-slate-700 dark:text-[#CBD5E1] mb-2 flex items-center justify-between">
          <span>Comparative Dimension Scoring</span>
          <span className="text-[10px] font-normal text-slate-500 dark:text-[#94A3B8]">Benchmark target: {thresholds.pehiAlertThreshold}.0</span>
        </h3>

        {filteredReviews.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400 dark:text-[#94A3B8]">
            No feedback data for dimension comparison chart.
          </div>
        ) : chartView === 'bar' ? (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dimensionData}
                layout="vertical"
                margin={{ top: 5, right: 25, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? 'rgba(148, 163, 184, 0.10)' : '#f1f5f9'} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: isDark ? '#94A3B8' : '#64748b' }} axisLine={{ stroke: isDark ? '#2A3748' : '#e2e8f0' }} />
                <YAxis 
                  dataKey="shortName" 
                  type="category" 
                  tick={{ fontSize: 10, fill: isDark ? '#CBD5E1' : '#334155', fontWeight: 500 }} 
                  width={130}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 dark:bg-[#151F2D] text-white p-2 rounded-md text-xs shadow-lg border border-slate-800 dark:border-[#2A3748]">
                          <div className="font-bold text-teal-300 dark:text-[#5EEAD4]">{d.name}</div>
                          <div className="mt-1 flex items-center justify-between space-x-3">
                            <span className="text-slate-300 dark:text-[#CBD5E1]">Score:</span>
                            <span className="font-bold text-white dark:text-[#F8FAFC] text-sm">{d.score.toFixed(1)} / 100</span>
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-[#94A3B8] mt-0.5">
                            Weight: {d.weightLabel} ({d.questions})
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-[#94A3B8]">
                            Status: <span className="font-semibold text-emerald-400 dark:text-[#86EFAC]">{d.status}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                  {dimensionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dimensionData} margin={{ top: 10, right: 25, left: 25, bottom: 10 }}>
                <PolarGrid stroke={isDark ? '#2A3748' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="shortName" tick={{ fill: isDark ? '#CBD5E1' : '#334155', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis domain={[0, 100]} angle={30} stroke={isDark ? '#6B7280' : '#94a3b8'} tick={{ fontSize: 9, fill: isDark ? '#94A3B8' : '#64748b' }} />
                <Radar
                  name="Dimension PEHI"
                  dataKey="score"
                  stroke="#14B8A6"
                  fill="#14B8A6"
                  fillOpacity={isDark ? 0.40 : 0.35}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 dark:bg-[#151F2D] text-white p-2 rounded-md text-xs shadow-lg border border-slate-800 dark:border-[#2A3748]">
                          <span className="font-bold text-teal-300 dark:text-[#5EEAD4]">{d.name}: </span>
                          <span className="font-extrabold text-white dark:text-[#F8FAFC]">{d.score.toFixed(1)} / 100</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
};
