import React from 'react';
import { motion } from 'motion/react';
import { Hospital, ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  hospitalName: string;
  hospitalId: string;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  hospitalName,
  onStart,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-lg mx-auto px-4 py-6 sm:py-12"
    >
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center">
        {/* Hospital Logo / Icon */}
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
          <Hospital className="w-6 h-6" />
        </div>

        {/* Hospital Name */}
        <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
          {hospitalName}
        </p>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Your Experience Matters
        </h2>

        {/* Short Explanation */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
          Your feedback helps us improve patient care and hospital services.
        </p>

        {/* Time estimate */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 mb-8">
          <span>20 questions</span>
          <span className="text-slate-300">•</span>
          <span>About 3–4 minutes</span>
        </div>

        {/* Main Button */}
        <div>
          <button
            id="start-feedback-button"
            type="button"
            onClick={onStart}
            className="w-full py-3.5 px-6 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-base cursor-pointer shadow-xs"
          >
            <span>Start Feedback</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Privacy Information */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Responses are strictly confidential and used for quality improvement.</span>
        </div>
      </div>
    </motion.div>
  );
};

