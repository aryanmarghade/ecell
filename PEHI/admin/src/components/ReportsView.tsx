import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  BedDouble, 
  AlertTriangle, 
  Printer, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { exportExecutivePDF, exportReviewsToCSV } from '../utils/exportUtils';
import { DIMENSION_INFO } from '../utils/pehiCalculator';

export const ReportsView: React.FC = () => {
  const { 
    hospital, 
    filteredReviews, 
    rawReviews, 
    metrics, 
    departmentStats, 
    wardStats, 
    alerts,
    filters,
    setFilters
  } = useDashboard();

  const [reportType, setReportType] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Custom'>('Monthly');

  const dateRangeLabel = useMemo(() => {
    if (reportType === 'Daily') return `Daily Report (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`;
    if (reportType === 'Weekly') return `Weekly Executive Summary (Last 7 Days)`;
    if (reportType === 'Monthly') return `Monthly Quality Review (${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`;
    return `Custom Audit Range (${filteredReviews.length} records)`;
  }, [reportType, filteredReviews.length]);

  const handleExportPDF = () => {
    exportExecutivePDF({
      hospital,
      reportTitle: `PEHI ${reportType} Management Report`,
      dateRangeLabel,
      overallPEHI: metrics.overallPEHI,
      totalReviews: metrics.totalReviews,
      unmarkedCount: metrics.unmarkedCount,
      markedCount: metrics.markedCount,
      doneCount: metrics.doneCount,
      dimensionScores: metrics.dimensionAverages,
      departments: departmentStats,
      wards: wardStats,
      alerts,
      recentReviews: filteredReviews
    });
  };

  const handleExportCSV = () => {
    exportReviewsToCSV(filteredReviews, hospital.name);
  };

  return (
    <div className="space-y-3">
      
      {/* Top Banner with Period Buttons & Download Triggers */}
      <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 transition-colors duration-150">
        <div>
          <div className="flex items-center space-x-1.5">
            <FileText className="h-4 w-4 text-teal-700 dark:text-[#2DD4BF]" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
              Hospital Executive Quality Reports
            </h2>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Formal board-level analytics reports for patient satisfaction, dimension indices, and department rankings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Report Type Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-[#151F2D] p-0.5 rounded-md border border-slate-200 dark:border-[#2A3748]">
            {(['Daily', 'Weekly', 'Monthly', 'Custom'] as const).map(t => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded transition ${
                  reportType === t ? 'bg-white dark:bg-[#1D2938] text-slate-900 dark:text-[#F3F4F6] shadow-2xs font-bold' : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
                }`}
              >
                {t} Report
              </button>
            ))}
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1 px-2.5 py-1 bg-teal-700 dark:bg-[#0D9488] hover:bg-teal-800 dark:hover:bg-[#14B8A6] text-white rounded-md text-[11px] font-bold transition shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 dark:bg-[#151F2D] hover:bg-slate-900 dark:hover:bg-[#1D2938] text-white rounded-md text-[11px] font-bold border dark:border-[#2A3748] transition shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Document Preview Container */}
      <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-4 sm:p-5 space-y-4 max-w-5xl mx-auto transition-colors duration-150">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 dark:border-[#2A3748] pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-100 dark:bg-[rgba(20,184,166,0.20)] text-teal-900 dark:text-[#5EEAD4]">CONFIDENTIAL</span>
              <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-mono">PEHI-REPORT-{hospital.id}</span>
            </div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-1">
              Patient Experience & Happiness Index Report
            </h1>
            <p className="text-xs font-semibold text-teal-800 dark:text-[#2DD4BF] mt-0.2">
              {hospital.name} &bull; {dateRangeLabel}
            </p>
          </div>

          <div className="text-left sm:text-right text-[10px] text-slate-500 dark:text-[#94A3B8]">
            <div>Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div className="text-slate-400 dark:text-[#6B7280] text-[9px] mt-0.2">Audited from Live Firestore Records</div>
          </div>
        </div>

        {/* Section 1: Executive KPI Overview */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-900 dark:text-[#F3F4F6] uppercase tracking-wider mb-2">
            1. Executive Score Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-teal-50/70 dark:bg-[rgba(20,184,166,0.12)] border border-teal-200 dark:border-[rgba(20,184,166,0.25)]">
              <span className="text-[10px] font-bold text-teal-800 dark:text-[#5EEAD4]">Overall PEHI Score</span>
              <div className="text-2xl font-black text-teal-900 dark:text-[#F8FAFC] mt-0.5">
                {metrics.overallPEHI > 0 ? metrics.overallPEHI.toFixed(1) : '—'} <span className="text-[10px] font-normal text-teal-700 dark:text-[#5EEAD4]">/ 100</span>
              </div>
              <div className="text-[9px] text-teal-800 dark:text-[#5EEAD4] font-bold mt-0.5">
                Status: {metrics.overallPEHI >= 80 ? 'Excellent' : metrics.overallPEHI >= 60 ? 'Good' : 'Needs Action'}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748]">
              <span className="text-[10px] font-bold text-slate-600 dark:text-[#94A3B8]">Sample Population</span>
              <div className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] mt-0.5">
                {metrics.totalReviews}
              </div>
              <div className="text-[9px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                100% verified submissions
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748]">
              <span className="text-[10px] font-bold text-slate-600 dark:text-[#94A3B8]">Review Resolution</span>
              <div className="text-2xl font-black text-emerald-700 dark:text-[#86EFAC] mt-0.5">
                {metrics.doneCount} <span className="text-[10px] font-normal text-slate-500 dark:text-[#94A3B8]">done</span>
              </div>
              <div className="text-[9px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                {metrics.unmarkedCount} pending triage
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748]">
              <span className="text-[10px] font-bold text-slate-600 dark:text-[#94A3B8]">Quality Alerts</span>
              <div className={`text-2xl font-black mt-0.5 ${alerts.length > 0 ? 'text-rose-600 dark:text-[#FCA5A5]' : 'text-emerald-700 dark:text-[#86EFAC]'}`}>
                {alerts.length}
              </div>
              <div className="text-[9px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                {alerts.filter(a => a.severity === 'Critical').length} critical issues
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Six Dimensions */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-900 dark:text-[#F3F4F6] uppercase tracking-wider mb-2">
            2. Six-Dimension Performance Matrix
          </h3>
          <div className="border border-slate-200 dark:border-[#2A3748] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151F2D] border-b border-slate-200 dark:border-[#2A3748] text-slate-500 dark:text-[#94A3B8] font-bold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2 px-2.5">Dimension</th>
                  <th className="py-2 px-2">Questions</th>
                  <th className="py-2 px-2">Weight</th>
                  <th className="py-2 px-2 text-right">Score (0–100)</th>
                  <th className="py-2 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#263244] text-slate-700 dark:text-[#CBD5E1] font-medium">
                {[
                  { name: 'Clinical Care & Confidence', q: 'Q1–4', wt: '25%', score: metrics.dimensionAverages.clinicalCare },
                  { name: 'Nursing & Staff Behaviour', q: 'Q5–8', wt: '20%', score: metrics.dimensionAverages.nursingStaff },
                  { name: 'Communication & Clarity', q: 'Q9–11', wt: '15%', score: metrics.dimensionAverages.communication },
                  { name: 'Comfort & Facilities', q: 'Q12–14', wt: '15%', score: metrics.dimensionAverages.comfortFacilities },
                  { name: 'Service Efficiency', q: 'Q15–17', wt: '10%', score: metrics.dimensionAverages.serviceEfficiency },
                  { name: 'Happiness & Loyalty', q: 'Q18–20', wt: '15%', score: metrics.dimensionAverages.happinessLoyalty },
                ].map(row => (
                  <tr key={row.name}>
                    <td className="py-1.5 px-2.5 font-bold text-slate-900 dark:text-[#F3F4F6]">{row.name}</td>
                    <td className="py-1.5 px-2 text-slate-500 dark:text-[#94A3B8] font-mono text-[10px]">{row.q}</td>
                    <td className="py-1.5 px-2 text-slate-600 dark:text-[#94A3B8] text-[11px]">{row.wt}</td>
                    <td className="py-1.5 px-2 text-right font-black text-xs text-slate-900 dark:text-[#F3F4F6] tabular-nums">{row.score.toFixed(1)}</td>
                    <td className="py-1.5 px-2 text-center">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        row.score >= 80 ? 'bg-emerald-100 dark:bg-[rgba(34,197,94,0.15)] text-emerald-800 dark:text-[#86EFAC]' :
                        row.score >= 60 ? 'bg-teal-100 dark:bg-[rgba(20,184,166,0.15)] text-teal-800 dark:text-[#5EEAD4]' :
                        row.score >= 40 ? 'bg-amber-100 dark:bg-[rgba(245,158,11,0.15)] text-amber-800 dark:text-[#FCD34D]' : 'bg-rose-100 dark:bg-[rgba(239,68,68,0.15)] text-rose-800 dark:text-[#FCA5A5]'
                      }`}>
                        {row.score >= 80 ? 'Excellent' : row.score >= 60 ? 'Good' : row.score >= 40 ? 'Needs Attention' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Department Performance */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-900 dark:text-[#F3F4F6] uppercase tracking-wider mb-2">
            3. Department Rankings
          </h3>
          <div className="border border-slate-200 dark:border-[#2A3748] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151F2D] border-b border-slate-200 dark:border-[#2A3748] text-slate-500 dark:text-[#94A3B8] font-bold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2 px-2.5">Department</th>
                  <th className="py-2 px-2 text-right">Reviews</th>
                  <th className="py-2 px-2 text-right">PEHI</th>
                  <th className="py-2 px-2 text-right">Clinical</th>
                  <th className="py-2 px-2 text-right">Nursing</th>
                  <th className="py-2 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#263244] text-slate-700 dark:text-[#CBD5E1]">
                {departmentStats.slice(0, 6).map(dept => (
                  <tr key={dept.department}>
                    <td className="py-1.5 px-2.5 font-bold text-slate-900 dark:text-[#F3F4F6]">{dept.department}</td>
                    <td className="py-1.5 px-2 text-right text-slate-600 dark:text-[#94A3B8]">{dept.reviewsCount}</td>
                    <td className="py-1.5 px-2 text-right font-black text-teal-800 dark:text-[#5EEAD4] tabular-nums">{dept.pehi.toFixed(1)}</td>
                    <td className="py-1.5 px-2 text-right text-slate-600 dark:text-[#94A3B8] tabular-nums">{dept.clinicalCare.toFixed(1)}</td>
                    <td className="py-1.5 px-2 text-right text-slate-600 dark:text-[#94A3B8] tabular-nums">{dept.nursingStaff.toFixed(1)}</td>
                    <td className="py-1.5 px-2 text-center">
                      <span className="text-[9px] font-semibold text-slate-700 dark:text-[#CBD5E1]">{dept.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Improvement Alerts */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-900 dark:text-[#F3F4F6] uppercase tracking-wider mb-2">
            4. Improvement Priorities & Alerts
          </h3>
          {alerts.length === 0 ? (
            <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] italic p-2.5 bg-slate-50 dark:bg-[#151F2D] rounded-lg border dark:border-[#2A3748]">
              No active quality alerts for this period. All department and dimension indicators are operating above threshold.
            </p>
          ) : (
            <div className="space-y-1.5">
              {alerts.slice(0, 4).map(alert => (
                <div key={alert.id} className="p-2.5 bg-rose-50/40 dark:bg-[rgba(239,68,68,0.10)] border border-rose-200 dark:border-[rgba(239,68,68,0.25)] rounded-lg text-xs flex items-start justify-between">
                  <div>
                    <span className="font-bold text-rose-900 dark:text-[#FCA5A5]">{alert.title}</span>
                    <p className="text-slate-700 dark:text-[#CBD5E1] mt-0.5 text-[11px]">{alert.message}</p>
                  </div>
                  <span className="font-bold text-rose-700 dark:text-[#FCA5A5] text-xs shrink-0 ml-2">
                    {alert.score.toFixed(1)} / 100
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Qualitative Voice */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-900 dark:text-[#F3F4F6] uppercase tracking-wider mb-2">
            5. Key Patient Qualitative Feedback
          </h3>
          <div className="space-y-1.5">
            {filteredReviews
              .filter(r => r.comment && r.comment.trim().length > 0)
              .slice(0, 4)
              .map(r => (
                <div key={r.id} className="p-2.5 bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748] rounded-lg text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-[#94A3B8] text-[10px] font-bold mb-0.5">
                    <span>{r.patientName} &bull; {r.department}</span>
                    <span className="font-bold text-teal-700 dark:text-[#5EEAD4]">PEHI: {r.pehiScore.toFixed(1)}</span>
                  </div>
                  <p className="text-slate-800 dark:text-[#CBD5E1] italic text-[11px]">"{r.comment}"</p>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};
