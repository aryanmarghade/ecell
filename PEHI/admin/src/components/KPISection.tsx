import React from 'react';
import { 
  HeartHandshake, 
  MessageSquare, 
  Clock, 
  CalendarDays, 
  Award, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const KPISection: React.FC = () => {
  const { metrics, alerts, setActivePage, theme } = useDashboard();

  const getPEHIColor = (score: number, total: number) => {
    if (total === 0 || score === 0) {
      return { 
        text: 'text-slate-700 dark:text-[#CBD5E1]', 
        bg: 'bg-slate-50 dark:bg-[#151F2D]', 
        border: 'border-slate-200 dark:border-[#2A3748]' 
      };
    }
    if (score >= 80) {
      return { 
        text: 'text-emerald-700 dark:text-[#86EFAC]', 
        bg: 'bg-emerald-50 dark:bg-[rgba(34,197,94,0.12)]', 
        border: 'border-emerald-200 dark:border-[rgba(34,197,94,0.25)]' 
      };
    }
    if (score >= 60) {
      return { 
        text: 'text-teal-700 dark:text-[#5EEAD4]', 
        bg: 'bg-teal-50 dark:bg-[rgba(20,184,166,0.12)]', 
        border: 'border-teal-200 dark:border-[rgba(20,184,166,0.25)]' 
      };
    }
    if (score >= 40) {
      return { 
        text: 'text-amber-700 dark:text-[#FCD34D]', 
        bg: 'bg-amber-50 dark:bg-[rgba(245,158,11,0.12)]', 
        border: 'border-amber-200 dark:border-[rgba(245,158,11,0.25)]' 
      };
    }
    return { 
      text: 'text-rose-700 dark:text-[#FCA5A5]', 
      bg: 'bg-rose-50 dark:bg-[rgba(239,68,68,0.12)]', 
      border: 'border-rose-200 dark:border-[rgba(239,68,68,0.25)]' 
    };
  };

  const pehiTheme = getPEHIColor(metrics.overallPEHI, metrics.totalReviews);
  const excellentPct = metrics.totalReviews > 0 
    ? Math.round((metrics.excellentReviews / metrics.totalReviews) * 100) 
    : 0;

  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' || a.severity === 'Needs Attention').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
      
      {/* 1. Overall PEHI Card */}
      <div className={`col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-1 bg-white dark:bg-[#182230] rounded-lg p-3 border ${pehiTheme.border} shadow-2xs relative overflow-hidden transition-colors duration-150`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">Overall PEHI</span>
          <span className={`p-1 rounded-md ${pehiTheme.bg} ${pehiTheme.text}`}>
            <HeartHandshake className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1">
            <span className={`text-2xl font-black tracking-tight tabular-nums ${pehiTheme.text}`}>
              {metrics.totalReviews > 0 && metrics.overallPEHI > 0 ? metrics.overallPEHI.toFixed(1) : '—'}
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-[#94A3B8]">/ 100</span>
          </div>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${pehiTheme.bg} ${pehiTheme.text} border ${pehiTheme.border}`}>
            {metrics.totalReviews === 0 ? 'No Data' : metrics.overallPEHI >= 80 ? 'Excellent' : metrics.overallPEHI >= 60 ? 'Good' : metrics.overallPEHI >= 40 ? 'Attention' : 'Critical'}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-1.5 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#263244]">
          <span>Benchmark</span>
          <span className="font-semibold text-slate-700 dark:text-[#CBD5E1]">60.0 PEHI</span>
        </p>
      </div>

      {/* 2. Total Reviews */}
      <div className="bg-white dark:bg-[#182230] rounded-lg p-3 border border-slate-200 dark:border-[#2A3748] shadow-2xs transition-colors duration-150">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">Total Reviews</span>
          <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
            <MessageSquare className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="mt-1.5">
          <div className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight tabular-nums">
            {metrics.totalReviews.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#94A3B8] mt-1.5 pt-1 border-t border-slate-100 dark:border-[#263244]">
            <span>Actioned</span>
            <span className="font-semibold text-emerald-600 dark:text-[#86EFAC]">{metrics.doneCount} done</span>
          </div>
        </div>
      </div>

      {/* 3. Today's Reviews */}
      <div className="bg-white dark:bg-[#182230] rounded-lg p-3 border border-slate-200 dark:border-[#2A3748] shadow-2xs transition-colors duration-150">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">Today's Reviews</span>
          <span className="p-1 rounded-md bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] text-teal-700 dark:text-[#5EEAD4]">
            <Clock className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="mt-1.5">
          <div className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight tabular-nums">
            {metrics.todayReviews}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#94A3B8] mt-1.5 pt-1 border-t border-slate-100 dark:border-[#263244]">
            <span>Pending</span>
            <span className="font-semibold text-amber-600 dark:text-[#FCD34D]">{metrics.unmarkedCount} unmarked</span>
          </div>
        </div>
      </div>

      {/* 4. This Month's Reviews */}
      <div className="bg-white dark:bg-[#182230] rounded-lg p-3 border border-slate-200 dark:border-[#2A3748] shadow-2xs transition-colors duration-150">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">This Month</span>
          <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
            <CalendarDays className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="mt-1.5">
          <div className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight tabular-nums">
            {metrics.thisMonthReviews.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#94A3B8] mt-1.5 pt-1 border-t border-slate-100 dark:border-[#263244]">
            <span>In Review</span>
            <span className="font-semibold text-blue-600 dark:text-blue-300">{metrics.markedCount} marked</span>
          </div>
        </div>
      </div>

      {/* 5. Excellent Reviews */}
      <div className="bg-white dark:bg-[#182230] rounded-lg p-3 border border-slate-200 dark:border-[#2A3748] shadow-2xs transition-colors duration-150">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">Excellent Rating</span>
          <span className="p-1 rounded-md bg-emerald-50 dark:bg-[rgba(34,197,94,0.12)] text-emerald-700 dark:text-[#86EFAC]">
            <Award className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="mt-1.5">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-emerald-700 dark:text-[#86EFAC] tracking-tight tabular-nums">
              {metrics.excellentReviews}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-[#86EFAC]">({excellentPct}%)</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#94A3B8] mt-1.5 pt-1 border-t border-slate-100 dark:border-[#263244]">
            <span>Score ≥ 80.0</span>
            <span className="font-semibold text-emerald-600 dark:text-[#86EFAC]">Top Tier</span>
          </div>
        </div>
      </div>

      {/* 6. Improvement Alerts */}
      <button
        onClick={() => setActivePage('alerts')}
        className={`text-left bg-white dark:bg-[#182230] rounded-lg p-3 border transition-all shadow-2xs hover:shadow-xs cursor-pointer ${
          criticalAlertsCount > 0 
            ? 'border-rose-200 dark:border-[rgba(239,68,68,0.30)] bg-rose-50/30 dark:bg-[rgba(239,68,68,0.10)] hover:bg-rose-50/50 dark:hover:bg-[rgba(239,68,68,0.15)]' 
            : 'border-slate-200 dark:border-[#2A3748] hover:bg-slate-50 dark:hover:bg-[#1D2938]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">Improvement Alerts</span>
          <span className={`p-1 rounded-md ${
            criticalAlertsCount > 0 
              ? 'bg-rose-100 dark:bg-[rgba(239,68,68,0.20)] text-rose-700 dark:text-[#FCA5A5]' 
              : 'bg-slate-100 dark:bg-[#151F2D] text-slate-600 dark:text-[#CBD5E1]'
          }`}>
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="mt-1.5">
          <div className="flex items-baseline space-x-1.5">
            <span className={`text-2xl font-black tracking-tight tabular-nums ${
              criticalAlertsCount > 0 
                ? 'text-rose-600 dark:text-[#FCA5A5]' 
                : 'text-slate-700 dark:text-[#CBD5E1]'
            }`}>
              {alerts.length}
            </span>
            {criticalAlertsCount > 0 && (
              <span className="text-[10px] font-semibold text-rose-600 dark:text-[#FCA5A5] bg-rose-100 dark:bg-[rgba(239,68,68,0.20)] px-1 py-0.2 rounded border dark:border-[rgba(239,68,68,0.30)]">
                {criticalAlertsCount} active
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#94A3B8] mt-1.5 pt-1 border-t border-slate-100 dark:border-[#263244]">
            <span>Action Required</span>
            <span className="font-semibold text-teal-700 dark:text-[#2DD4BF]">View &rarr;</span>
          </div>
        </div>
      </button>

    </div>
  );
};
