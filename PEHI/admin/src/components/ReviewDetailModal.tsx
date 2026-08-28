import React from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  Building2, 
  BedDouble, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Trash2, 
  HeartHandshake,
  MessageSquare
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { PatientFeedback, ReviewStatus } from '../types';
import { QUESTIONS_META, DIMENSION_INFO, convertScaleToScore } from '../utils/pehiCalculator';

interface ReviewDetailModalProps {
  review: PatientFeedback | null;
  onClose: () => void;
}

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, onClose }) => {
  const { updateReviewStatus, setDeleteConfirmTarget, userRole } = useDashboard();

  if (!review) return null;

  const handleStatusChange = (newStatus: ReviewStatus) => {
    updateReviewStatus(review.id, newStatus);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-teal-700 bg-teal-50 border-teal-200';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3">
      <div className="bg-white dark:bg-[#182230] rounded-lg max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-xl border border-slate-200 dark:border-[#2A3748] animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 dark:bg-[#111827] text-white flex items-center justify-between rounded-t-lg sticky top-0 z-10 border-b dark:border-[#2A3748]">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-md bg-teal-600 dark:bg-[#0D9488] flex items-center justify-center text-white font-bold">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center space-x-2">
                  <span>{review.patientName}</span>
                  {review.age && <span className="text-[10px] font-normal text-slate-300">({review.age} yrs)</span>}
                </h3>
                <p className="text-[10px] text-slate-400">
                  Ref ID: <code className="text-teal-300 dark:text-[#2DD4BF] font-mono">{review.id}</code> &bull; Submitted {new Date(review.submissionDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md bg-slate-800 dark:bg-[#182230] text-slate-400 hover:text-white hover:bg-slate-700 dark:hover:bg-[#1D2938] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5">
          
          {/* Patient Meta & Workflow Control Bar */}
          <div className="bg-slate-50 dark:bg-[#151F2D] rounded-lg p-2.5 border border-slate-200 dark:border-[#2A3748] flex flex-wrap items-center justify-between gap-2.5">
            
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-[#CBD5E1]">
              <div className="flex items-center space-x-1 bg-white dark:bg-[#182230] px-2 py-0.5 rounded border border-slate-200 dark:border-[#2A3748]">
                <Building2 className="h-3 w-3 text-teal-600 dark:text-[#2DD4BF]" />
                <span className="font-semibold text-slate-900 dark:text-[#F3F4F6]">{review.department}</span>
              </div>
              {review.ward && (
                <div className="flex items-center space-x-1 bg-white dark:bg-[#182230] px-2 py-0.5 rounded border border-slate-200 dark:border-[#2A3748]">
                  <BedDouble className="h-3 w-3 text-teal-600 dark:text-[#2DD4BF]" />
                  <span>{review.ward}</span>
                </div>
              )}
              {review.patientCategory && (
                <div className="flex items-center space-x-1 bg-white dark:bg-[#182230] px-2 py-0.5 rounded border border-slate-200 dark:border-[#2A3748]">
                  <Tag className="h-3 w-3 text-slate-500 dark:text-[#94A3B8]" />
                  <span>{review.patientCategory}</span>
                </div>
              )}
              {review.phone && (
                <div className="flex items-center space-x-1 bg-white dark:bg-[#182230] px-2 py-0.5 rounded border border-slate-200 dark:border-[#2A3748]">
                  <Phone className="h-3 w-3 text-slate-500 dark:text-[#94A3B8]" />
                  <span>{review.phone}</span>
                </div>
              )}
              {review.email && (
                <div className="flex items-center space-x-1 bg-white dark:bg-[#182230] px-2 py-0.5 rounded border border-slate-200 dark:border-[#2A3748]">
                  <Mail className="h-3 w-3 text-slate-500 dark:text-[#94A3B8]" />
                  <span>{review.email}</span>
                </div>
              )}
            </div>

            {/* Status Switcher Buttons: [ Unmarked ] [ Marked ] [ Done ] */}
            <div className="flex items-center space-x-1 bg-white dark:bg-[#182230] p-0.5 rounded border border-slate-200 dark:border-[#2A3748]">
              <span className="text-[9px] font-semibold text-slate-400 dark:text-[#94A3B8] px-1.5 uppercase">Status:</span>
              {(['UNMARKED', 'MARKED', 'DONE'] as const).map(st => (
                <button
                  key={st}
                  disabled={userRole === 'VIEWER'}
                  onClick={() => handleStatusChange(st)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded transition ${
                    review.status === st
                      ? st === 'DONE' 
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : st === 'MARKED'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-amber-500 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#1D2938] disabled:opacity-50'
                  }`}
                >
                  {st === 'UNMARKED' ? 'Unmarked' : st === 'MARKED' ? 'Marked' : 'Done'}
                </button>
              ))}
            </div>

          </div>

          {/* PEHI Score & Classification Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-teal-900 dark:bg-[#0F4A44] border dark:border-[rgba(20,184,166,0.3)] text-white flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-teal-300 dark:text-[#5EEAD4] uppercase">Calculated PEHI</span>
              <div className="my-1">
                <span className="text-2xl font-extrabold">{review.pehiScore.toFixed(1)}</span>
                <span className="text-[10px] text-teal-300 dark:text-[#5EEAD4] ml-1">/ 100</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-800 dark:bg-[#134E48] text-teal-200 dark:text-[#5EEAD4] self-start">
                {review.pehiClassification}
              </span>
            </div>

            <div className="col-span-2 p-3 rounded-lg bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748]">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-[#94A3B8] uppercase">Six Dimension Scores</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-1.5">
                {[
                  { name: 'Clinical Care', score: review.dimensionScores.clinicalCare, wt: '25%' },
                  { name: 'Nursing Team', score: review.dimensionScores.nursingStaff, wt: '20%' },
                  { name: 'Communication', score: review.dimensionScores.communication, wt: '15%' },
                  { name: 'Facilities & Comfort', score: review.dimensionScores.comfortFacilities, wt: '15%' },
                  { name: 'Service Efficiency', score: review.dimensionScores.serviceEfficiency, wt: '10%' },
                  { name: 'Happiness & Loyalty', score: review.dimensionScores.happinessLoyalty, wt: '15%' },
                ].map(d => (
                  <div key={d.name} className="p-1.5 bg-white dark:bg-[#182230] rounded border border-slate-100 dark:border-[#263244] text-xs">
                    <div className="text-[9px] text-slate-400 dark:text-[#94A3B8] font-medium truncate">{d.name} ({d.wt})</div>
                    <div className="font-bold text-slate-800 dark:text-[#F3F4F6] text-xs mt-0.5">{d.score.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Qualitative Comment */}
          {review.comment && (
            <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-[rgba(245,158,11,0.10)] border border-amber-200/80 dark:border-[rgba(245,158,11,0.25)]">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 dark:text-[#FCD34D] mb-1">
                <MessageSquare className="h-3.5 w-3.5 text-amber-700 dark:text-[#FCD34D]" />
                <span>Qualitative Patient Feedback Comment:</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-[#CBD5E1] italic leading-relaxed bg-white dark:bg-[#151F2D] p-2 rounded border border-amber-100 dark:border-[rgba(245,158,11,0.20)]">
                "{review.comment}"
              </p>
            </div>
          )}

          {/* Complete 20 Questions Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] font-bold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider">
                Full 20 Questionnaire Responses (Scale 1 = 0%, 5 = 100%)
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-[#94A3B8]">
                Converted via standard PEHI scoring rubric
              </span>
            </div>

            <div className="border border-slate-200 dark:border-[#2A3748] rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-[#263244] text-xs">
              {QUESTIONS_META.map(q => {
                const rawVal = review.responses[`q${q.id}`] ?? review.responses[`Q${q.id}`] ?? review.responses[`${q.id}`];
                const score = convertScaleToScore(rawVal);
                const dimInfo = DIMENSION_INFO[q.dimensionKey];

                return (
                  <div key={q.id} className="px-3 py-1.5 hover:bg-slate-50/80 dark:hover:bg-[#1D2938]/60 flex items-center justify-between gap-2.5 transition">
                    <div className="flex items-start space-x-2 flex-1 min-w-0">
                      <span className="font-mono text-slate-400 dark:text-[#6B7280] font-bold text-[10px] w-5 shrink-0 pt-0.5">
                        Q{q.id}
                      </span>
                      <div className="min-w-0">
                        <p className="text-slate-800 dark:text-[#F3F4F6] font-medium leading-tight text-xs">{q.text}</p>
                        <span className="text-[9px] text-teal-700 dark:text-[#2DD4BF] font-semibold inline-block">
                          {dimInfo.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 shrink-0">
                      <div className="text-right">
                        <div className="font-bold text-slate-800 dark:text-[#F3F4F6] text-xs">
                          {rawVal !== undefined ? `Rating ${rawVal} / 5` : 'N/A'}
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-[#94A3B8]">
                          Score: <span className="font-semibold text-teal-700 dark:text-[#2DD4BF]">{score.toFixed(0)}/100</span>
                        </div>
                      </div>

                      {/* Visual score circle */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border ${
                        score >= 80 ? 'bg-emerald-50 dark:bg-[rgba(34,197,94,0.15)] text-emerald-700 dark:text-[#86EFAC] border-emerald-300 dark:border-[rgba(34,197,94,0.3)]' :
                        score >= 60 ? 'bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] text-teal-700 dark:text-[#5EEAD4] border-teal-300 dark:border-[rgba(20,184,166,0.3)]' :
                        score >= 40 ? 'bg-amber-50 dark:bg-[rgba(245,158,11,0.15)] text-amber-700 dark:text-[#FCD34D] border-amber-300 dark:border-[rgba(245,158,11,0.3)]' :
                        'bg-rose-50 dark:bg-[rgba(239,68,68,0.15)] text-rose-700 dark:text-[#FCA5A5] border-rose-300 dark:border-[rgba(239,68,68,0.3)]'
                      }`}>
                        {rawVal ?? '—'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#151F2D] border-t border-slate-200 dark:border-[#2A3748] flex items-center justify-between rounded-b-lg">
          {userRole === 'ADMIN' ? (
            <button
              onClick={() => {
                onClose();
                setDeleteConfirmTarget(review);
              }}
              className="flex items-center space-x-1 text-xs text-rose-600 dark:text-[#FCA5A5] hover:text-rose-800 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-[rgba(239,68,68,0.15)] px-2 py-1 rounded font-semibold transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Review</span>
            </button>
          ) : (
            <div className="text-[10px] text-slate-400 dark:text-[#94A3B8]">
              {userRole === 'VIEWER' ? 'Viewer Mode (Read-only)' : 'Manager Mode'}
            </div>
          )}

          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 dark:bg-[#182230] hover:bg-slate-900 dark:hover:bg-[#1D2938] text-white border dark:border-[#2A3748] rounded-md text-xs font-semibold transition"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
