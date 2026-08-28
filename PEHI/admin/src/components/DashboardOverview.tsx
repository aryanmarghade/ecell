import React from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  MessageSquareText, 
  Building2, 
  Eye, 
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { KPISection } from './KPISection';
import { PEHITimeChart } from './PEHITimeChart';
import { DimensionGraphs } from './DimensionGraphs';
import { GlobalFiltersBar } from './GlobalFiltersBar';

export const DashboardOverview: React.FC = () => {
  const { 
    filteredReviews, 
    departmentStats, 
    alerts, 
    setActivePage, 
    setSelectedReviewForDetail, 
    updateReviewStatus,
    userRole,
    thresholds,
    hospital
  } = useDashboard();

  const criticalAlerts = alerts.filter(a => a.severity === 'Critical' || a.severity === 'Needs Attention');

  return (
    <div className="space-y-4">
      
      {/* Universal Active Filter Bar */}
      <GlobalFiltersBar />

      {/* Main KPI Cards */}
      <KPISection />

      {/* Critical Alert Warning Banner if any */}
      {criticalAlerts.length > 0 && (
        <div className="bg-rose-50 dark:bg-[rgba(239,68,68,0.12)] border border-rose-200 dark:border-[rgba(239,68,68,0.30)] rounded-lg p-3 flex items-center justify-between gap-3 shadow-2xs transition-colors">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-md bg-rose-100 dark:bg-[rgba(239,68,68,0.25)] text-rose-700 dark:text-[#FCA5A5] shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-rose-900 dark:text-[#FCA5A5]">
                Quality Action Required: {criticalAlerts.length} Action Items Triggered
              </h3>
              <p className="text-[11px] text-rose-700 dark:text-[#CBD5E1] mt-0.5">
                {criticalAlerts[0].message}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('alerts')}
            className="shrink-0 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold transition flex items-center space-x-1"
          >
            <span>Review Alerts</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Interactive PEHI Time Series Chart */}
      <PEHITimeChart />

      {/* Six Dimensions Breakdown */}
      <DimensionGraphs />

      {/* Department & Recent Reviews Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Top Performing & Underperforming Departments */}
        <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3.5 flex flex-col justify-between transition-colors duration-150">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#263244]">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-teal-700 dark:text-[#2DD4BF]" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">Department Performance</h3>
              </div>
              <button
                onClick={() => setActivePage('departments')}
                className="text-[11px] font-semibold text-teal-700 dark:text-[#2DD4BF] hover:text-teal-900 dark:hover:text-[#5EEAD4] flex items-center space-x-1"
              >
                <span>View All ({departmentStats.length})</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-[#263244] mt-1">
              {departmentStats.slice(0, 5).map(dept => {
                const isBelow = dept.pehi < thresholds.pehiAlertThreshold;
                return (
                  <div 
                    key={dept.department} 
                    onClick={() => setActivePage('departments')}
                    className="py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#1D2938] px-1.5 rounded-md transition cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] flex items-center space-x-1.5">
                        <span>{dept.department}</span>
                        {isBelow && <span className="text-[9px] text-rose-600 dark:text-[#FCA5A5] font-bold bg-rose-50 dark:bg-rose-950/50 px-1 py-0.2 rounded border dark:border-rose-900/50">Alert</span>}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-[#94A3B8]">{dept.reviewsCount} verified reviews</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-black px-1.5 py-0.2 rounded ${
                        dept.pehi >= 80 ? 'bg-emerald-50 dark:bg-[rgba(34,197,94,0.15)] text-emerald-700 dark:text-[#86EFAC]' :
                        dept.pehi >= 60 ? 'bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] text-teal-700 dark:text-[#5EEAD4]' :
                        'bg-rose-50 dark:bg-[rgba(239,68,68,0.15)] text-rose-700 dark:text-[#FCA5A5]'
                      }`}>
                        {dept.pehi.toFixed(1)}
                      </span>
                      <div className="text-[9px] text-slate-400 dark:text-[#94A3B8] mt-0.5">{dept.status}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#263244] text-[10px] text-slate-500 dark:text-[#94A3B8] flex justify-between items-center">
            <span>Aggregated hospital departments</span>
            <span className="font-semibold text-teal-700 dark:text-[#2DD4BF]">Live ranking</span>
          </div>
        </div>

        {/* Recent Patient Feedback Feed */}
        <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3.5 flex flex-col justify-between transition-colors duration-150">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#263244]">
              <div className="flex items-center space-x-2">
                <MessageSquareText className="h-4 w-4 text-teal-700 dark:text-[#2DD4BF]" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">Recent Patient Feedbacks</h3>
              </div>
              <button
                onClick={() => setActivePage('reviews')}
                className="text-[11px] font-semibold text-teal-700 dark:text-[#2DD4BF] hover:text-teal-900 dark:hover:text-[#5EEAD4] flex items-center space-x-1"
              >
                <span>Manage Reviews</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-[#263244] mt-1 space-y-0.5">
              {filteredReviews.slice(0, 4).map(r => (
                <div 
                  key={r.id} 
                  onClick={() => setSelectedReviewForDetail(r)}
                  className="py-1.5 px-1.5 hover:bg-slate-50 dark:hover:bg-[#1D2938] rounded-md transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-900 dark:text-[#F3F4F6] flex items-center space-x-1.5">
                      <span>{r.patientName}</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-[#94A3B8]">({r.department})</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      r.pehiScore >= 80 ? 'bg-emerald-100 dark:bg-[rgba(34,197,94,0.15)] text-emerald-800 dark:text-[#86EFAC]' :
                      r.pehiScore >= 60 ? 'bg-teal-100 dark:bg-[rgba(20,184,166,0.15)] text-teal-800 dark:text-[#5EEAD4]' :
                      'bg-rose-100 dark:bg-[rgba(239,68,68,0.15)] text-rose-800 dark:text-[#FCA5A5]'
                    }`}>
                      PEHI: {r.pehiScore.toFixed(1)}
                    </span>
                  </div>

                  {r.comment ? (
                    <p className="text-[10px] text-slate-600 dark:text-[#CBD5E1] line-clamp-1 italic mt-0.5">
                      "{r.comment}"
                    </p>
                  ) : (
                    <p className="text-[9px] text-slate-400 dark:text-[#94A3B8] italic mt-0.5">Full 20-question rating recorded</p>
                  )}

                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-50 dark:border-[#263244] text-[9px]">
                    <span className="text-slate-400 dark:text-[#94A3B8]">
                      {new Date(r.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>

                    <span className={`px-1 py-0.2 rounded font-semibold ${
                      r.status === 'DONE' ? 'bg-emerald-50 dark:bg-[rgba(34,197,94,0.15)] text-emerald-700 dark:text-[#86EFAC]' :
                      r.status === 'MARKED' ? 'bg-blue-50 dark:bg-[rgba(96,165,250,0.15)] text-blue-700 dark:text-blue-300' : 'bg-amber-50 dark:bg-[rgba(245,158,11,0.15)] text-amber-700 dark:text-[#FCD34D]'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#263244] text-[10px] text-slate-500 dark:text-[#94A3B8] flex justify-between items-center">
            <span>Direct patient submissions from feedback form</span>
            <span className="font-semibold text-slate-700 dark:text-[#CBD5E1]">{filteredReviews.length} total records</span>
          </div>
        </div>

      </div>

    </div>
  );
};
