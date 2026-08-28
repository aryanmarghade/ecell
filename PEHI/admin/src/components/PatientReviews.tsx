import React, { useState } from 'react';
import { 
  MessageSquareText, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Building2, 
  BedDouble, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Calendar
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { ReviewStatus, PatientFeedback } from '../types';
import { exportReviewsToCSV } from '../utils/exportUtils';
import { GlobalFiltersBar } from './GlobalFiltersBar';

export const PatientReviews: React.FC = () => {
  const { 
    filteredReviews, 
    rawReviews,
    hospital, 
    updateReviewStatus, 
    setSelectedReviewForDetail, 
    setDeleteConfirmTarget, 
    userRole 
  } = useDashboard();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const handleStatusToggle = (e: React.MouseEvent, reviewId: string, nextStatus: ReviewStatus) => {
    e.stopPropagation();
    updateReviewStatus(reviewId, nextStatus);
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'DONE':
        return 'bg-emerald-100 dark:bg-[rgba(34,197,94,0.15)] text-emerald-800 dark:text-[#86EFAC] border-emerald-200 dark:border-[rgba(34,197,94,0.30)]';
      case 'MARKED':
        return 'bg-blue-100 dark:bg-[rgba(96,165,250,0.15)] text-blue-800 dark:text-blue-300 border-blue-200 dark:border-[rgba(96,165,250,0.30)]';
      default:
        return 'bg-amber-100 dark:bg-[rgba(245,158,11,0.15)] text-amber-800 dark:text-[#FCD34D] border-amber-200 dark:border-[rgba(245,158,11,0.30)]';
    }
  };

  const getPEHIBadge = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-[rgba(34,197,94,0.15)] text-emerald-700 dark:text-[#86EFAC] border-emerald-200 dark:border-[rgba(34,197,94,0.30)]';
    if (score >= 60) return 'bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] text-teal-700 dark:text-[#5EEAD4] border-teal-200 dark:border-[rgba(20,184,166,0.30)]';
    if (score >= 40) return 'bg-amber-50 dark:bg-[rgba(245,158,11,0.15)] text-amber-700 dark:text-[#FCD34D] border-amber-200 dark:border-[rgba(245,158,11,0.30)]';
    return 'bg-rose-50 dark:bg-[rgba(239,68,68,0.15)] text-rose-700 dark:text-[#FCA5A5] border-rose-200 dark:border-[rgba(239,68,68,0.30)]';
  };

  return (
    <div className="space-y-3">
      
      {/* Universal Filter Component */}
      <GlobalFiltersBar />

      {/* Header Bar with Action Controls */}
      <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-2.5 sm:px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors duration-150">
        <div>
          <div className="flex items-center space-x-1.5">
            <MessageSquareText className="h-4 w-4 text-teal-700 dark:text-[#2DD4BF]" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight">Patient Experience Reviews</h2>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Showing <span className="font-bold text-slate-800 dark:text-[#F3F4F6]">{filteredReviews.length}</span> of {rawReviews.length} records for {hospital.name}
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          
          {/* View Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-[#151F2D] p-0.5 rounded-md border border-slate-200 dark:border-[#2A3748]">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded transition ${
                viewMode === 'table' ? 'bg-white dark:bg-[#1D2938] text-slate-900 dark:text-[#F3F4F6] shadow-2xs font-bold' : 'text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-[#F3F4F6]'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded transition ${
                viewMode === 'cards' ? 'bg-white dark:bg-[#1D2938] text-slate-900 dark:text-[#F3F4F6] shadow-2xs font-bold' : 'text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-[#F3F4F6]'
              }`}
            >
              Cards
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={() => exportReviewsToCSV(filteredReviews, hospital.name)}
            disabled={filteredReviews.length === 0}
            className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 dark:bg-[#151F2D] hover:bg-slate-900 dark:hover:bg-[#1D2938] text-white rounded-md text-xs font-semibold border dark:border-[#2A3748] transition disabled:opacity-50"
            title="Export filtered records to CSV"
          >
            <Download className="h-3 w-3" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Reviews Container */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] p-8 text-center shadow-2xs">
          <div className="mx-auto h-10 w-10 rounded-full bg-slate-100 dark:bg-[#151F2D] flex items-center justify-center text-slate-400 dark:text-[#94A3B8] mb-2">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6]">No patient feedback available for this period.</h3>
          <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-0.5 max-w-sm mx-auto">
            No feedback entries match your active filters. Try adjusting your search query, department, or date range.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        
        /* Table View */
        <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs overflow-hidden transition-colors duration-150">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#151F2D] border-b border-slate-200 dark:border-[#2A3748] text-slate-500 dark:text-[#94A3B8] font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-2 px-2.5">Date</th>
                  <th className="py-2 px-2.5">Patient Info</th>
                  <th className="py-2 px-2.5">Location</th>
                  <th className="py-2 px-2.5">Category</th>
                  <th className="py-2 px-2.5 text-center">PEHI Score</th>
                  <th className="py-2 px-2.5">Comment Preview</th>
                  <th className="py-2 px-2.5 text-center">Review Status</th>
                  <th className="py-2 px-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#263244] font-medium text-slate-700 dark:text-[#CBD5E1]">
                {filteredReviews.map((r) => {
                  const subDate = new Date(r.submissionDate);
                  return (
                    <tr 
                      key={r.id} 
                      onClick={() => setSelectedReviewForDetail(r)}
                      className="hover:bg-teal-50/40 dark:hover:bg-[#1D2938] transition cursor-pointer group"
                    >
                      {/* Date */}
                      <td className="py-2 px-2.5 text-slate-600 dark:text-[#CBD5E1] whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-[#F3F4F6] text-xs">
                          {subDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-[9px] text-slate-400 dark:text-[#94A3B8] font-mono">
                          {subDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Patient Name & Details */}
                      <td className="py-2 px-2.5">
                        <div className="font-bold text-slate-900 dark:text-[#F3F4F6] group-hover:text-teal-700 dark:group-hover:text-[#2DD4BF] transition text-xs">
                          {r.patientName}
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-[#94A3B8] flex items-center space-x-1 mt-0.5">
                          {r.age && <span>{r.age} yrs &bull;</span>}
                          <span>{r.phone || r.email || 'Verified Patient'}</span>
                        </div>
                      </td>

                      {/* Department & Ward */}
                      <td className="py-2 px-2.5">
                        <div className="font-bold text-slate-800 dark:text-[#F3F4F6] text-xs">{r.department}</div>
                        <div className="text-[9px] text-slate-500 dark:text-[#94A3B8]">{r.ward || 'General'}</div>
                      </td>

                      {/* Patient Category */}
                      <td className="py-2 px-2.5 whitespace-nowrap">
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#151F2D] text-slate-700 dark:text-[#CBD5E1] border border-slate-200 dark:border-[#2A3748]">
                          {r.patientCategory || 'Inpatient'}
                        </span>
                      </td>

                      {/* PEHI Score & Badge */}
                      <td className="py-2 px-2.5 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-xs font-black px-2 py-0.2 rounded border tabular-nums ${getPEHIBadge(r.pehiScore)}`}>
                            {r.pehiScore.toFixed(1)}
                          </span>
                          <span className="text-[8px] text-slate-400 dark:text-[#94A3B8] mt-0.5">{r.pehiClassification}</span>
                        </div>
                      </td>

                      {/* Qualitative Comment */}
                      <td className="py-2 px-2.5 max-w-[200px]">
                        {r.comment ? (
                          <p className="text-slate-600 dark:text-[#CBD5E1] truncate italic text-[11px]" title={r.comment}>
                            "{r.comment}"
                          </p>
                        ) : (
                          <span className="text-slate-400 dark:text-[#94A3B8] text-[9px] italic">No text comment</span>
                        )}
                      </td>

                      {/* Inline Status Buttons: [ Unmarked ] [ Marked ] [ Done ] */}
                      <td className="py-2 px-2.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex rounded-md border border-slate-200 dark:border-[#2A3748] p-0.5 bg-slate-50 dark:bg-[#151F2D] text-[9px] font-bold">
                          <button
                            disabled={userRole === 'VIEWER'}
                            onClick={(e) => handleStatusToggle(e, r.id, 'UNMARKED')}
                            className={`px-1.5 py-0.2 rounded transition ${
                              r.status === 'UNMARKED' 
                                ? 'bg-amber-500 text-white shadow-2xs' 
                                : 'text-slate-600 dark:text-[#94A3B8] hover:bg-slate-200 dark:hover:bg-[#1D2938] disabled:opacity-50'
                            }`}
                          >
                            Unmarked
                          </button>
                          <button
                            disabled={userRole === 'VIEWER'}
                            onClick={(e) => handleStatusToggle(e, r.id, 'MARKED')}
                            className={`px-1.5 py-0.2 rounded transition ${
                              r.status === 'MARKED' 
                                ? 'bg-blue-600 text-white shadow-2xs' 
                                : 'text-slate-600 dark:text-[#94A3B8] hover:bg-slate-200 dark:hover:bg-[#1D2938] disabled:opacity-50'
                            }`}
                          >
                            Marked
                          </button>
                          <button
                            disabled={userRole === 'VIEWER'}
                            onClick={(e) => handleStatusToggle(e, r.id, 'DONE')}
                            className={`px-1.5 py-0.2 rounded transition ${
                              r.status === 'DONE' 
                                ? 'bg-emerald-600 text-white shadow-2xs' 
                                : 'text-slate-600 dark:text-[#94A3B8] hover:bg-slate-200 dark:hover:bg-[#1D2938] disabled:opacity-50'
                            }`}
                          >
                            Done
                          </button>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-2 px-2.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setSelectedReviewForDetail(r)}
                            className="p-1 text-slate-500 dark:text-[#94A3B8] hover:text-teal-700 dark:hover:text-[#2DD4BF] hover:bg-teal-50 dark:hover:bg-[#1D2938] rounded-md transition"
                            title="View Full Questionnaire & Breakdown"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {userRole === 'ADMIN' && (
                            <button
                              onClick={() => setDeleteConfirmTarget(r)}
                              className="p-1 text-slate-400 dark:text-[#6B7280] hover:text-rose-600 dark:hover:text-[#FCA5A5] hover:bg-rose-50 dark:hover:bg-[#1D2938] rounded-md transition"
                              title="Delete Review (Admin only)"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (

        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredReviews.map((r) => (
            <div 
              key={r.id} 
              onClick={() => setSelectedReviewForDetail(r)}
              className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs hover:shadow-xs hover:border-teal-500/50 dark:hover:border-teal-500/50 transition p-3 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-[#F3F4F6]">{r.patientName}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-[#94A3B8]">
                      {r.department} &bull; {r.ward || 'General'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-black px-2 py-0.2 rounded border tabular-nums ${getPEHIBadge(r.pehiScore)}`}>
                      {r.pehiScore.toFixed(1)}
                    </span>
                  </div>
                </div>

                {r.comment && (
                  <p className="text-[11px] text-slate-700 dark:text-[#CBD5E1] bg-slate-50 dark:bg-[#151F2D] p-2 rounded-md border border-slate-100 dark:border-[#2A3748] mt-2 line-clamp-3 italic">
                    "{r.comment}"
                  </p>
                )}

                <div className="grid grid-cols-3 gap-1 mt-2 text-[9px] text-slate-500 dark:text-[#94A3B8]">
                  <div className="bg-slate-50 dark:bg-[#151F2D] border border-slate-100 dark:border-[#2A3748] p-1 rounded">
                    Clinical: <span className="font-bold text-slate-700 dark:text-[#F3F4F6]">{r.dimensionScores.clinicalCare.toFixed(0)}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#151F2D] border border-slate-100 dark:border-[#2A3748] p-1 rounded">
                    Nursing: <span className="font-bold text-slate-700 dark:text-[#F3F4F6]">{r.dimensionScores.nursingStaff.toFixed(0)}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#151F2D] border border-slate-100 dark:border-[#2A3748] p-1 rounded">
                    Comms: <span className="font-bold text-slate-700 dark:text-[#F3F4F6]">{r.dimensionScores.communication.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#263244] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <div className="inline-flex rounded-md border border-slate-200 dark:border-[#2A3748] p-0.5 bg-slate-50 dark:bg-[#151F2D] text-[9px] font-bold">
                  {(['UNMARKED', 'MARKED', 'DONE'] as const).map(st => (
                    <button
                      key={st}
                      disabled={userRole === 'VIEWER'}
                      onClick={(e) => handleStatusToggle(e, r.id, st)}
                      className={`px-1.5 py-0.2 rounded transition ${
                        r.status === st 
                          ? st === 'DONE' ? 'bg-emerald-600 text-white' : st === 'MARKED' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'
                          : 'text-slate-600 dark:text-[#94A3B8] hover:bg-slate-200 dark:hover:bg-[#1D2938] disabled:opacity-50'
                      }`}
                    >
                      {st === 'UNMARKED' ? 'Unmarked' : st === 'MARKED' ? 'Marked' : 'Done'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-0.5">
                  <button
                    onClick={() => setSelectedReviewForDetail(r)}
                    className="p-1 text-slate-500 dark:text-[#94A3B8] hover:text-teal-700 dark:hover:text-[#2DD4BF] hover:bg-slate-100 dark:hover:bg-[#1D2938] rounded-md transition"
                    title="View details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  {userRole === 'ADMIN' && (
                    <button
                      onClick={() => setDeleteConfirmTarget(r)}
                      className="p-1 text-slate-400 dark:text-[#6B7280] hover:text-rose-600 dark:hover:text-[#FCA5A5] hover:bg-rose-50 dark:hover:bg-[#1D2938] rounded-md transition"
                      title="Delete review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
