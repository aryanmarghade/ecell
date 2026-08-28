import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ArrowUpDown, 
  ChevronRight, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { DepartmentStat, PatientFeedback } from '../types';
import { aggregateTimeSeries } from '../utils/pehiCalculator';

export const DepartmentAnalytics: React.FC = () => {
  const { departmentStats, filteredReviews, alerts, thresholds, theme } = useDashboard();
  const [sortField, setSortField] = useState<keyof DepartmentStat>('pehi');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleSort = (field: keyof DepartmentStat) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedDepartments = useMemo(() => {
    return [...departmentStats].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      if (typeof aVal === 'string') {
        return sortAsc ? (aVal as string).localeCompare(bVal as string) : (bVal as string).localeCompare(aVal as string);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [departmentStats, sortField, sortAsc]);

  // Selected Department Details
  const deptReviews = useMemo(() => {
    if (!selectedDept) return [];
    return filteredReviews.filter(r => r.department === selectedDept);
  }, [selectedDept, filteredReviews]);

  const selectedDeptStat = useMemo(() => {
    return departmentStats.find(d => d.department === selectedDept);
  }, [departmentStats, selectedDept]);

  const deptAlerts = useMemo(() => {
    if (!selectedDept) return [];
    return alerts.filter(a => a.entityName === selectedDept || a.message.includes(selectedDept));
  }, [selectedDept, alerts]);

  const deptTimeSeries = useMemo(() => {
    return aggregateTimeSeries(deptReviews, 'Daily');
  }, [deptReviews]);

  return (
    <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3.5 mb-4 transition-colors duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-[#263244]">
        <div>
          <div className="flex items-center space-x-1.5">
            <Building2 className="h-4 w-4 text-teal-700 dark:text-[#2DD4BF]" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight">Department Performance Analytics</h2>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Compare PEHI satisfaction metrics across clinical hospital departments. Click any department for deep dive.
          </p>
        </div>

        <div className="text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-50 dark:bg-[#151F2D] px-2 py-1 rounded-md border border-slate-200 dark:border-[#2A3748]">
          Showing <span className="font-bold text-slate-800 dark:text-[#F3F4F6]">{departmentStats.length}</span> Active Departments
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2.5">
        {departmentStats.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-[#94A3B8] text-xs bg-slate-50 dark:bg-[#151F2D] rounded-md border dark:border-[#2A3748]">
            No department feedback available for current filters.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#151F2D] border-b border-slate-200 dark:border-[#2A3748] text-slate-500 dark:text-[#94A3B8] font-bold text-[10px] uppercase tracking-wider">
                <th className="py-2 px-2.5 cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6]" onClick={() => handleSort('department')}>
                  <div className="flex items-center space-x-1">
                    <span>Department</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400 dark:text-[#6B7280]" />
                  </div>
                </th>
                <th className="py-2 px-2.5 text-right cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6]" onClick={() => handleSort('reviewsCount')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Reviews</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400 dark:text-[#6B7280]" />
                  </div>
                </th>
                <th className="py-2 px-2.5 text-right cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6] font-bold text-slate-900 dark:text-[#F3F4F6]" onClick={() => handleSort('pehi')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>PEHI</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400 dark:text-[#6B7280]" />
                  </div>
                </th>
                <th className="py-2 px-2 text-right cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6] hidden md:table-cell" onClick={() => handleSort('clinicalCare')}>
                  Clinical
                </th>
                <th className="py-2 px-2 text-right cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6] hidden md:table-cell" onClick={() => handleSort('nursingStaff')}>
                  Nursing
                </th>
                <th className="py-2 px-2 text-right cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6] hidden lg:table-cell" onClick={() => handleSort('communication')}>
                  Comms
                </th>
                <th className="py-2 px-2 text-right cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6] hidden lg:table-cell" onClick={() => handleSort('comfortFacilities')}>
                  Comfort
                </th>
                <th className="py-2 px-2 text-right cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6] hidden xl:table-cell" onClick={() => handleSort('serviceEfficiency')}>
                  Efficiency
                </th>
                <th className="py-2 px-2 text-right cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6] hidden xl:table-cell" onClick={() => handleSort('happinessLoyalty')}>
                  Happiness
                </th>
                <th className="py-2 px-2.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6]" onClick={() => handleSort('status')}>
                  Status
                </th>
                <th className="py-2 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#263244] font-medium text-slate-700 dark:text-[#CBD5E1]">
              {sortedDepartments.map((dept) => {
                const isAlert = dept.pehi < thresholds.pehiAlertThreshold;
                return (
                  <tr 
                    key={dept.department}
                    onClick={() => setSelectedDept(dept.department)}
                    className="hover:bg-teal-50/40 dark:hover:bg-[#1D2938] transition cursor-pointer group"
                  >
                    <td className="py-2 px-2.5 font-bold text-slate-900 dark:text-[#F3F4F6] flex items-center space-x-1.5">
                      <span>{dept.department}</span>
                      {isAlert && (
                        <span title="Performance Alert: PEHI below threshold">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-500 dark:text-[#FCA5A5]" />
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2.5 text-right font-medium text-slate-600 dark:text-[#CBD5E1]">
                      {dept.reviewsCount}
                    </td>
                    <td className="py-2 px-2.5 text-right font-black text-xs tabular-nums">
                      <span className={`px-2 py-0.2 rounded border ${
                        dept.pehi >= 80 ? 'bg-emerald-50 dark:bg-[rgba(34,197,94,0.15)] text-emerald-700 dark:text-[#86EFAC] border-emerald-200 dark:border-[rgba(34,197,94,0.30)]' :
                        dept.pehi >= 60 ? 'bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] text-teal-700 dark:text-[#5EEAD4] border-teal-200 dark:border-[rgba(20,184,166,0.30)]' :
                        dept.pehi >= 40 ? 'bg-amber-50 dark:bg-[rgba(245,158,11,0.15)] text-amber-700 dark:text-[#FCD34D] border-amber-200 dark:border-[rgba(245,158,11,0.30)]' :
                        'bg-rose-50 dark:bg-[rgba(239,68,68,0.15)] text-rose-700 dark:text-[#FCA5A5] border-rose-200 dark:border-[rgba(239,68,68,0.30)]'
                      }`}>
                        {dept.pehi.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right text-slate-600 dark:text-[#94A3B8] hidden md:table-cell">{dept.clinicalCare.toFixed(1)}</td>
                    <td className="py-2 px-2 text-right text-slate-600 dark:text-[#94A3B8] hidden md:table-cell">{dept.nursingStaff.toFixed(1)}</td>
                    <td className="py-2 px-2 text-right text-slate-600 dark:text-[#94A3B8] hidden lg:table-cell">{dept.communication.toFixed(1)}</td>
                    <td className="py-2 px-2 text-right text-slate-600 dark:text-[#94A3B8] hidden lg:table-cell">{dept.comfortFacilities.toFixed(1)}</td>
                    <td className="py-2 px-2 text-right text-slate-600 dark:text-[#94A3B8] hidden xl:table-cell">{dept.serviceEfficiency.toFixed(1)}</td>
                    <td className="py-2 px-2 text-right text-slate-600 dark:text-[#94A3B8] hidden xl:table-cell">{dept.happinessLoyalty.toFixed(1)}</td>
                    <td className="py-2 px-2.5 text-center">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        dept.status === 'Excellent' ? 'bg-emerald-100 dark:bg-[rgba(34,197,94,0.15)] text-emerald-800 dark:text-[#86EFAC]' :
                        dept.status === 'Good' ? 'bg-teal-100 dark:bg-[rgba(20,184,166,0.15)] text-teal-800 dark:text-[#5EEAD4]' :
                        dept.status === 'Needs Improvement' ? 'bg-amber-100 dark:bg-[rgba(245,158,11,0.15)] text-amber-800 dark:text-[#FCD34D]' :
                        'bg-rose-100 dark:bg-[rgba(239,68,68,0.15)] text-rose-800 dark:text-[#FCA5A5]'
                      }`}>
                        {dept.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-[#6B7280] group-hover:text-teal-600 dark:group-hover:text-[#2DD4BF] inline" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Dedicated Department Detail Modal */}
      {selectedDept && selectedDeptStat && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-[#182230] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-[#2A3748]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 dark:bg-[#0B1220] text-white flex items-center justify-between rounded-t-xl border-b dark:border-[#2A3748]">
              <div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-teal-400 dark:text-[#2DD4BF]" />
                  <h3 className="text-sm font-bold text-white dark:text-[#F8FAFC]">{selectedDeptStat.department}</h3>
                </div>
                <p className="text-[10px] text-slate-300 dark:text-[#94A3B8] mt-0.5">
                  Department Deep-Dive Quality Analytics & Historical Feedback
                </p>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                className="p-1 rounded-md bg-slate-800 dark:bg-[#151F2D] text-slate-400 hover:text-white hover:bg-slate-700 dark:hover:bg-[#1D2938] transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              
              {/* Top Score Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-lg bg-teal-50 dark:bg-[rgba(20,184,166,0.12)] border border-teal-200 dark:border-[rgba(20,184,166,0.25)]">
                  <span className="text-[10px] font-bold text-teal-800 dark:text-[#5EEAD4]">Department PEHI</span>
                  <div className="text-2xl font-black text-teal-900 dark:text-[#F8FAFC] mt-0.5">
                    {selectedDeptStat.pehi.toFixed(1)} <span className="text-[10px] font-normal text-teal-700 dark:text-[#5EEAD4]">/ 100</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 dark:text-[#5EEAD4] capitalize mt-0.5 inline-block">
                    Status: {selectedDeptStat.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748]">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-[#94A3B8]">Total Patient Reviews</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] mt-0.5">
                    {selectedDeptStat.reviewsCount}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5 inline-block">
                    {deptReviews.filter(r => r.status === 'DONE').length} Actioned &bull; {deptReviews.filter(r => r.status === 'UNMARKED').length} Unmarked
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748]">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-[#94A3B8]">Active Alerts</span>
                  <div className={`text-2xl font-black mt-0.5 ${deptAlerts.length > 0 ? 'text-rose-600 dark:text-[#FCA5A5]' : 'text-emerald-600 dark:text-[#86EFAC]'}`}>
                    {deptAlerts.length}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5 inline-block">
                    {deptAlerts.length > 0 ? 'Action required by lead' : 'All dimensions optimal'}
                  </span>
                </div>
              </div>

              {/* Six Dimensions Breakdown Grid */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider mb-2">
                  Six Dimension Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Clinical Care', score: selectedDeptStat.clinicalCare, weight: '25%' },
                    { label: 'Nursing Behaviour', score: selectedDeptStat.nursingStaff, weight: '20%' },
                    { label: 'Communication', score: selectedDeptStat.communication, weight: '15%' },
                    { label: 'Comfort & Facilities', score: selectedDeptStat.comfortFacilities, weight: '15%' },
                    { label: 'Service Efficiency', score: selectedDeptStat.serviceEfficiency, weight: '10%' },
                    { label: 'Happiness & Loyalty', score: selectedDeptStat.happinessLoyalty, weight: '15%' },
                  ].map(dim => (
                    <div key={dim.label} className="p-2.5 bg-slate-50 dark:bg-[#151F2D] rounded-md border border-slate-200 dark:border-[#2A3748]">
                      <div className="flex justify-between text-[10px] text-slate-500 dark:text-[#94A3B8] font-semibold">
                        <span>{dim.label}</span>
                        <span>{dim.weight}</span>
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-[#F8FAFC] mt-0.5">
                        {dim.score.toFixed(1)} <span className="text-[9px] text-slate-400 dark:text-[#94A3B8]">/ 100</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-[#2A3748] h-1 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-teal-600 dark:bg-[#2DD4BF] rounded-full" 
                          style={{ width: `${dim.score}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Trend Chart */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider mb-1.5">
                  Daily PEHI Trend
                </h4>
                <div className="h-36 bg-slate-50 dark:bg-[#151F2D] p-2 rounded-lg border border-slate-200 dark:border-[#2A3748]">
                  {deptTimeSeries.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-[#94A3B8]">
                      Insufficient historical data points for this department.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={deptTimeSeries} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(148, 163, 184, 0.10)' : '#e2e8f0'} />
                        <XAxis dataKey="label" tick={{ fontSize: 9, fill: isDark ? '#94A3B8' : '#64748b' }} axisLine={{ stroke: isDark ? '#2A3748' : '#e2e8f0' }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: isDark ? '#94A3B8' : '#64748b' }} axisLine={{ stroke: isDark ? '#2A3748' : '#e2e8f0' }} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-900 dark:bg-[#151F2D] text-white p-2 rounded-md text-xs shadow-lg border border-slate-800 dark:border-[#2A3748]">
                                  <div className="font-bold text-teal-300 dark:text-[#5EEAD4]">{label}</div>
                                  <div className="mt-0.5 text-sm font-black">{Number(payload[0].value).toFixed(1)} PEHI</div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey="pehi" stroke="#14B8A6" fill={isDark ? 'rgba(20, 184, 166, 0.25)' : '#ccfbf1'} strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Qualitative Patient Comments */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <MessageSquare className="h-3.5 w-3.5 text-teal-600 dark:text-[#2DD4BF]" />
                  <span>Recent Department Feedback ({deptReviews.filter(r => r.comment).length})</span>
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {deptReviews.filter(r => r.comment && r.comment.trim().length > 0).length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-[#94A3B8] italic">No qualitative comments recorded for this department.</p>
                  ) : (
                    deptReviews
                      .filter(r => r.comment && r.comment.trim().length > 0)
                      .slice(0, 5)
                      .map(r => (
                        <div key={r.id} className="p-2 bg-slate-50 dark:bg-[#151F2D] rounded-md border border-slate-200 dark:border-[#2A3748] text-xs">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-[#94A3B8] mb-0.5">
                            <span>{r.patientName} &bull; Ward: {r.ward || 'General'}</span>
                            <span className="text-teal-700 dark:text-[#5EEAD4] font-black">PEHI: {r.pehiScore.toFixed(1)}</span>
                          </div>
                          <p className="text-slate-700 dark:text-[#CBD5E1] italic text-[11px]">"{r.comment}"</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 dark:bg-[#151F2D] border-t border-slate-200 dark:border-[#2A3748] flex justify-end">
              <button
                onClick={() => setSelectedDept(null)}
                className="px-3 py-1.5 bg-slate-800 dark:bg-[#182230] hover:bg-slate-900 dark:hover:bg-[#1D2938] text-white rounded-md text-xs font-semibold border dark:border-[#2A3748] transition"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
