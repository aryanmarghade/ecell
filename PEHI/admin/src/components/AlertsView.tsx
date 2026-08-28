import React, { useState } from 'react';
import { 
  BellRing, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal, 
  ShieldAlert, 
  Building2, 
  BedDouble, 
  Stethoscope, 
  Activity,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const AlertsView: React.FC = () => {
  const { alerts, thresholds, setThresholds, setActivePage, setFilters, hospital } = useDashboard();
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'Critical' | 'Needs Attention'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  const criticalCount = alerts.filter(a => a.severity === 'Critical').length;
  const attentionCount = alerts.filter(a => a.severity === 'Needs Attention').length;

  const handleInspectEntity = (alert: any) => {
    if (alert.type === 'Department') {
      setFilters(prev => ({ ...prev, department: alert.entityName }));
      setActivePage('departments');
    } else if (alert.type === 'Ward') {
      setFilters(prev => ({ ...prev, ward: alert.entityName }));
      setActivePage('wards');
    } else if (alert.type === 'Dimension') {
      setActivePage('analytics');
    } else {
      setActivePage('dashboard');
    }
  };

  return (
    <div className="space-y-3">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors duration-150">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-rose-50 dark:bg-[rgba(239,68,68,0.15)] text-rose-600 dark:text-[#FCA5A5] border border-rose-200 dark:border-[rgba(239,68,68,0.30)]">
              <BellRing className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight">Hospital Quality & PEHI Alerts</h2>
              <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                Automated clinical & operational performance triggers for <span className="font-semibold text-slate-700 dark:text-[#CBD5E1]">{hospital.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Severity Badges & Filter */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setSeverityFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              severityFilter === 'ALL' ? 'bg-slate-900 dark:bg-[#151F2D] text-white border dark:border-[#2A3748]' : 'bg-slate-100 dark:bg-[#151F2D] text-slate-700 dark:text-[#94A3B8] hover:bg-slate-200 dark:hover:bg-[#1D2938]'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setSeverityFilter('Critical')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              severityFilter === 'Critical' ? 'bg-rose-600 text-white' : 'bg-rose-50 dark:bg-[rgba(239,68,68,0.15)] text-rose-700 dark:text-[#FCA5A5] border border-rose-200 dark:border-[rgba(239,68,68,0.30)] hover:bg-rose-100 dark:hover:bg-[rgba(239,68,68,0.25)]'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setSeverityFilter('Needs Attention')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              severityFilter === 'Needs Attention' ? 'bg-amber-600 text-white' : 'bg-amber-50 dark:bg-[rgba(245,158,11,0.15)] text-amber-700 dark:text-[#FCD34D] border border-amber-200 dark:border-[rgba(245,158,11,0.30)] hover:bg-amber-100 dark:hover:bg-[rgba(245,158,11,0.25)]'
            }`}
          >
            Needs Attention ({attentionCount})
          </button>
        </div>
      </div>

      {/* Threshold Status Banner */}
      <div className="bg-slate-50 dark:bg-[#151F2D] rounded-lg p-2.5 px-3.5 border border-slate-200 dark:border-[#2A3748] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-[#94A3B8]">
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="font-bold text-slate-800 dark:text-[#F3F4F6]">Alert Rules:</span>
          <span>Target Benchmark: <strong className="text-teal-700 dark:text-[#2DD4BF]">{thresholds.pehiAlertThreshold}.0</strong></span>
          <span>Critical Limit: <strong className="text-rose-700 dark:text-[#FCA5A5]">&lt; {thresholds.criticalThreshold}.0</strong></span>
          <span>Needs Attention: <strong className="text-amber-700 dark:text-[#FCD34D]">{thresholds.criticalThreshold}.0 – 59.9</strong></span>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-medium">
          Automated Healthcare Quality Monitor
        </span>
      </div>

      {/* Alert Cards List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] p-8 text-center shadow-2xs">
          <div className="mx-auto h-10 w-10 rounded-full bg-emerald-100 dark:bg-[rgba(34,197,94,0.15)] flex items-center justify-center text-emerald-600 dark:text-[#86EFAC] mb-2">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6]">No active alerts.</h3>
          <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-0.5 max-w-sm mx-auto">
            No departments, wards, or dimension scores fall below the {thresholds.pehiAlertThreshold}.0 PEHI threshold for the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'Critical';
            return (
              <div
                key={alert.id}
                className={`bg-white dark:bg-[#182230] rounded-lg border shadow-2xs p-3.5 transition flex flex-col justify-between ${
                  isCritical 
                    ? 'border-rose-200 dark:border-[rgba(239,68,68,0.30)] bg-rose-50/10 dark:bg-[rgba(239,68,68,0.06)] hover:border-rose-300 dark:hover:border-[rgba(239,68,68,0.50)]' 
                    : 'border-amber-200 dark:border-[rgba(245,158,11,0.30)] bg-amber-50/10 dark:bg-[rgba(245,158,11,0.06)] hover:border-amber-300 dark:hover:border-[rgba(245,158,11,0.50)]'
                }`}
              >
                <div>
                  {/* Alert Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-md ${isCritical ? 'bg-rose-100 dark:bg-[rgba(239,68,68,0.20)] text-rose-700 dark:text-[#FCA5A5]' : 'bg-amber-100 dark:bg-[rgba(245,158,11,0.20)] text-amber-700 dark:text-[#FCD34D]'}`}>
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isCritical ? 'text-rose-600 dark:text-[#FCA5A5]' : 'text-amber-600 dark:text-[#FCD34D]'}`}>
                          {alert.type} Quality Alert
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">{alert.title}</h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-black tabular-nums ${isCritical ? 'text-rose-600 dark:text-[#FCA5A5]' : 'text-amber-600 dark:text-[#FCD34D]'}`}>
                        {alert.score.toFixed(1)} <span className="text-[9px] font-normal text-slate-400 dark:text-[#94A3B8]">/ 100</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isCritical ? 'bg-rose-100 dark:bg-[rgba(239,68,68,0.18)] text-rose-800 dark:text-[#FCA5A5]' : 'bg-amber-100 dark:bg-[rgba(245,158,11,0.18)] text-amber-800 dark:text-[#FCD34D]'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>

                  {/* Message & Context */}
                  <p className="text-xs text-slate-700 dark:text-[#CBD5E1] mt-2 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="mt-2 p-2 rounded-md bg-slate-50 dark:bg-[#151F2D] border border-slate-100 dark:border-[#2A3748] text-[10px] text-slate-600 dark:text-[#CBD5E1] flex items-center justify-between">
                    <span>Target: <strong className="text-slate-900 dark:text-[#F3F4F6]">{alert.threshold}.0</strong></span>
                    <span>Deficit: <strong className="text-rose-600 dark:text-[#FCA5A5]">{(alert.threshold - alert.score).toFixed(1)} pts</strong></span>
                    <span>Affected: <strong className="text-slate-900 dark:text-[#F3F4F6]">{alert.affectedReviewsCount} reviews</strong></span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#263244] flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 dark:text-[#94A3B8]">
                    Real-time Firestore trigger
                  </span>

                  <button
                    onClick={() => handleInspectEntity(alert)}
                    className="flex items-center space-x-1 text-xs font-semibold text-teal-700 dark:text-[#2DD4BF] hover:text-teal-900 dark:hover:text-[#5EEAD4] hover:underline"
                  >
                    <span>Inspect {alert.type}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
