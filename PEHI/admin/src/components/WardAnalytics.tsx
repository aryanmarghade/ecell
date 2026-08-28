import React, { useState, useMemo } from 'react';
import { 
  BedDouble, 
  ArrowUpDown, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  X,
  MessageSquare,
  Building2,
  AlertTriangle
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
import { WardStat } from '../types';
import { aggregateTimeSeries } from '../utils/pehiCalculator';

export const WardAnalytics: React.FC = () => {
  const { wardStats, filteredReviews, thresholds, theme } = useDashboard();
  const [sortField, setSortField] = useState<keyof WardStat>('pehi');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleSort = (field: keyof WardStat) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedWards = useMemo(() => {
    return [...wardStats].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      if (typeof aVal === 'string') {
        return sortAsc ? (aVal as string).localeCompare(bVal as string) : (bVal as string).localeCompare(aVal as string);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [wardStats, sortField, sortAsc]);

  const wardReviews = useMemo(() => {
    if (!selectedWard) return [];
    return filteredReviews.filter(r => r.ward === selectedWard);
  }, [selectedWard, filteredReviews]);

  const selectedWardStat = useMemo(() => {
    return wardStats.find(w => w.ward === selectedWard);
  }, [wardStats, selectedWard]);

  const wardTimeSeries = useMemo(() => {
    return aggregateTimeSeries(wardReviews, 'Daily');
  }, [wardReviews]);

  return (
    <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3.5 mb-4 transition-colors duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-[#263244]">
        <div>
          <div className="flex items-center space-x-1.5">
            <BedDouble className="h-4 w-4 text-teal-700 dark:text-[#2DD4BF]" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight">Ward & Unit Quality Analytics</h2>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Granular inpatient ward patient satisfaction indices and bed-unit performance
          </p>
        </div>

        <div className="text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-50 dark:bg-[#151F2D] px-2 py-1 rounded-md border border-slate-200 dark:border-[#2A3748]">
          Showing <span className="font-bold text-slate-800 dark:text-[#F3F4F6]">{wardStats.length}</span> Active Wards
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2.5">
        {wardStats.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-[#94A3B8] text-xs bg-slate-50 dark:bg-[#151F2D] rounded-md border dark:border-[#2A3748]">
            No ward feedback available for current filters.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#151F2D] border-b border-slate-200 dark:border-[#2A3748] text-slate-500 dark:text-[#94A3B8] font-bold text-[10px] uppercase tracking-wider">
                <th className="py-2 px-2.5 cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6]" onClick={() => handleSort('ward')}>
                  <div className="flex items-center space-x-1">
                    <span>Ward / Unit</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400 dark:text-[#6B7280]" />
                  </div>
                </th>
                <th className="py-2 px-2.5 cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6] hidden sm:table-cell" onClick={() => handleSort('department')}>
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
                    <span>PEHI Score</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400 dark:text-[#6B7280]" />
                  </div>
                </th>
                <th className="py-2 px-2.5 text-center cursor-pointer hover:text-slate-900 dark:hover:text-[#F3F4F6]" onClick={() => handleSort('status')}>
                  Status
                </th>
                <th className="py-2 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#263244] font-medium text-slate-700 dark:text-[#CBD5E1]">
              {sortedWards.map((ward) => {
                const isAlert = ward.pehi < thresholds.pehiAlertThreshold;
                return (
                  <tr 
                    key={ward.ward}
                    onClick={() => setSelectedWard(ward.ward)}
                    className="hover:bg-teal-50/40 dark:hover:bg-[#1D2938] transition cursor-pointer group"
                  >
                    <td className="py-2 px-2.5 font-bold text-slate-900 dark:text-[#F3F4F6] flex items-center space-x-1.5">
                      <span>{ward.ward}</span>
                      {isAlert && (
                        <span title="Performance Alert: Ward PEHI below threshold">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-500 dark:text-[#FCA5A5]" />
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2.5 text-slate-600 dark:text-[#94A3B8] hidden sm:table-cell text-xs">
                      {ward.department || 'Clinical'}
                    </td>
                    <td className="py-2 px-2.5 text-right font-medium text-slate-600 dark:text-[#CBD5E1]">
                      {ward.reviewsCount}
                    </td>
                    <td className="py-2 px-2.5 text-right font-black text-xs tabular-nums">
                      <span className={`px-2 py-0.2 rounded border ${
                        ward.pehi >= 80 ? 'bg-emerald-50 dark:bg-[rgba(34,197,94,0.15)] text-emerald-700 dark:text-[#86EFAC] border-emerald-200 dark:border-[rgba(34,197,94,0.30)]' :
                        ward.pehi >= 60 ? 'bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] text-teal-700 dark:text-[#5EEAD4] border-teal-200 dark:border-[rgba(20,184,166,0.30)]' :
                        ward.pehi >= 40 ? 'bg-amber-50 dark:bg-[rgba(245,158,11,0.15)] text-amber-700 dark:text-[#FCD34D] border-amber-200 dark:border-[rgba(245,158,11,0.30)]' :
                        'bg-rose-50 dark:bg-[rgba(239,68,68,0.15)] text-rose-700 dark:text-[#FCA5A5] border-rose-200 dark:border-[rgba(239,68,68,0.30)]'
                      }`}>
                        {ward.pehi.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        ward.status === 'Excellent' ? 'bg-emerald-100 dark:bg-[rgba(34,197,94,0.15)] text-emerald-800 dark:text-[#86EFAC]' :
                        ward.status === 'Good' ? 'bg-teal-100 dark:bg-[rgba(20,184,166,0.15)] text-teal-800 dark:text-[#5EEAD4]' :
                        ward.status === 'Needs Improvement' ? 'bg-amber-100 dark:bg-[rgba(245,158,11,0.15)] text-amber-800 dark:text-[#FCD34D]' :
                        'bg-rose-100 dark:bg-[rgba(239,68,68,0.15)] text-rose-800 dark:text-[#FCA5A5]'
                      }`}>
                        {ward.status}
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

      {/* Ward Detail Modal */}
      {selectedWard && selectedWardStat && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-[#182230] rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-[#2A3748]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 dark:bg-[#0B1220] text-white flex items-center justify-between rounded-t-xl border-b dark:border-[#2A3748]">
              <div>
                <div className="flex items-center space-x-2">
                  <BedDouble className="h-4 w-4 text-teal-400 dark:text-[#2DD4BF]" />
                  <h3 className="text-sm font-bold text-white dark:text-[#F8FAFC]">{selectedWardStat.ward}</h3>
                </div>
                <p className="text-[10px] text-slate-300 dark:text-[#94A3B8] mt-0.5">
                  Department: {selectedWardStat.department || 'Hospital General'} &bull; Inpatient Experience
                </p>
              </div>
              <button
                onClick={() => setSelectedWard(null)}
                className="p-1 rounded-md bg-slate-800 dark:bg-[#151F2D] text-slate-400 hover:text-white hover:bg-slate-700 dark:hover:bg-[#1D2938] transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-teal-50 dark:bg-[rgba(20,184,166,0.12)] border border-teal-200 dark:border-[rgba(20,184,166,0.25)]">
                  <span className="text-[10px] font-bold text-teal-800 dark:text-[#5EEAD4]">Ward PEHI</span>
                  <div className="text-2xl font-black text-teal-900 dark:text-[#F8FAFC] mt-0.5">
                    {selectedWardStat.pehi.toFixed(1)} <span className="text-[10px] font-normal text-teal-700 dark:text-[#5EEAD4]">/ 100</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 dark:text-[#5EEAD4] capitalize mt-0.5 inline-block">
                    Status: {selectedWardStat.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748]">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-[#94A3B8]">Total Patient Feedbacks</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] mt-0.5">
                    {selectedWardStat.reviewsCount}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5 inline-block">
                    {wardReviews.filter(r => r.status === 'DONE').length} Actioned &bull; {wardReviews.filter(r => r.status === 'UNMARKED').length} New
                  </span>
                </div>
              </div>

              {/* Trend Chart */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider mb-1.5">
                  Ward Trend History
                </h4>
                <div className="h-32 bg-slate-50 dark:bg-[#151F2D] p-2 rounded-lg border border-slate-200 dark:border-[#2A3748]">
                  {wardTimeSeries.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-[#94A3B8]">
                      Insufficient feedback data for ward trend.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={wardTimeSeries} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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

              {/* Patient Comments in Ward */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <MessageSquare className="h-3.5 w-3.5 text-teal-600 dark:text-[#2DD4BF]" />
                  <span>Patient Voice in {selectedWardStat.ward}</span>
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {wardReviews.filter(r => r.comment).length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-[#94A3B8] italic">No specific comments recorded for this ward.</p>
                  ) : (
                    wardReviews
                      .filter(r => r.comment)
                      .slice(0, 4)
                      .map(r => (
                        <div key={r.id} className="p-2 bg-slate-50 dark:bg-[#151F2D] rounded-md border border-slate-200 dark:border-[#2A3748] text-xs">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-[#94A3B8] mb-0.5">
                            <span>{r.patientName} &bull; {r.submissionDate.slice(0, 10)}</span>
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
                onClick={() => setSelectedWard(null)}
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
