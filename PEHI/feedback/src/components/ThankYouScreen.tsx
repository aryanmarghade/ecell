import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { PEHIResult, DimensionId } from '../types';
import { DIMENSIONS } from '../data/questions';

interface ThankYouScreenProps {
  pehiResult: PEHIResult;
  hospitalName: string;
  docId: string;
  onReset: () => void;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({
  pehiResult,
  hospitalName,
  docId,
  onReset,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 space-y-5"
    >
      {/* Thank you Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 text-center shadow-xs">
        {/* Checkmark Badge */}
        <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Thank You
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
          Your feedback has been successfully submitted to the healthcare administration at <span className="font-semibold text-slate-800">{hospitalName}</span>.
        </p>

        {/* PEHI Score Summary */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 max-w-sm mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Patient Experience & Happiness Index
          </p>

          {/* Large Score Display */}
          <div className="text-4xl font-extrabold text-slate-900 tracking-tight my-1">
            {pehiResult.pehi.toFixed(1)}
            <span className="text-base text-slate-400 font-normal"> / 100</span>
          </div>

          {/* Classification */}
          <div className="mt-2">
            <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-teal-800">
              {pehiResult.classification}
            </span>
          </div>
        </div>
      </div>

      {/* Six Dimension Breakdown Scores */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-semibold text-slate-900">Dimension Score Breakdown</h2>
          <span className="text-xs text-slate-400">0 – 100 Scale</span>
        </div>

        <div className="space-y-3 pt-1">
          {(Object.keys(DIMENSIONS) as DimensionId[]).map((dimId) => {
            const dim = DIMENSIONS[dimId];
            const score = pehiResult.dimensionScores[dimId] || 0;
            const formattedScore = Math.round(score * 10) / 10;

            return (
              <div key={dimId} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-medium">{dim.name}</span>
                  <span className="font-semibold text-slate-900">{formattedScore}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-700 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, formattedScore))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Confirmation Receipt Info */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 shadow-xs">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            Submission ID: <code className="font-mono text-slate-800 font-semibold">{docId}</code>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">Logged to hospital database</span>
      </div>

      {/* Action to restart */}
      <div className="text-center pt-2">
        <button
          id="submit-another-feedback-btn"
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Submit Another Response</span>
        </button>
      </div>
    </motion.div>
  );
};

