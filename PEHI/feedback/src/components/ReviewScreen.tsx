import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Edit3,
  CheckSquare,
  Square,
  MessageSquare,
  ShieldCheck,
  Send,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { PatientInfo, DimensionId } from '../types';
import { DIMENSIONS, QUESTIONS, RATING_OPTIONS } from '../data/questions';

interface ReviewScreenProps {
  patientInfo: PatientInfo;
  responses: Record<string, number>;
  comment: string;
  onCommentChange: (comment: string) => void;
  onEditPatientInfo: () => void;
  onEditQuestion: (questionIndex: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submissionError: string;
  onBackToQuestions: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  patientInfo,
  responses,
  comment,
  onCommentChange,
  onEditPatientInfo,
  onEditQuestion,
  onSubmit,
  isSubmitting,
  submissionError,
  onBackToQuestions,
}) => {
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [validationError, setValidationError] = useState('');

  const getRatingMeta = (val: number) => {
    return RATING_OPTIONS.find((opt) => opt.value === val) || RATING_OPTIONS[2];
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAgreed) {
      setValidationError('Please agree to the consent declaration before submitting.');
      return;
    }
    setValidationError('');
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto px-4 py-4 sm:py-8 space-y-5"
    >
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
          Step 3 of 3
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Review Your Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Please review your details and ratings before final submission.
        </p>
      </div>

      {/* Patient Information Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <User className="w-4 h-4 text-teal-700" />
            <span>Patient & Visit Details</span>
          </div>
          <button
            id="edit-patient-info-btn"
            type="button"
            onClick={onEditPatientInfo}
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider mb-0.5">
              Patient Name & Age
            </span>
            <span className="font-semibold text-slate-900">
              {patientInfo.name}, {patientInfo.age} yrs
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider mb-0.5">
              Contact
            </span>
            <div className="font-medium text-slate-800 truncate">{patientInfo.email}</div>
            <div className="text-slate-600 text-xs mt-0.5">{patientInfo.phone}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider mb-0.5">
              Department
            </span>
            <span className="font-semibold text-slate-900">{patientInfo.department}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider mb-0.5">
              Ward & Category
            </span>
            <div className="font-semibold text-slate-900">{patientInfo.ward}</div>
            <div className="text-slate-600 text-xs mt-0.5">{patientInfo.patientCategory}</div>
          </div>
        </div>
      </div>

      {/* 20 Responses Grouped by Dimension */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Your Ratings (20 Questions)</h2>
          </div>
          <button
            id="review-all-questions-btn"
            type="button"
            onClick={onBackToQuestions}
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit All</span>
          </button>
        </div>

        {(Object.keys(DIMENSIONS) as DimensionId[]).map((dimId) => {
          const dimension = DIMENSIONS[dimId];
          const questionsInDim = QUESTIONS.filter((q) => q.dimensionId === dimId);

          return (
            <div key={dimId} className="space-y-2">
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-xs text-slate-800">
                  {dimension.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  Weight: {dimension.weightDisplay}
                </span>
              </div>

              <div className="divide-y divide-slate-100 border-y border-slate-100">
                {questionsInDim.map((q) => {
                  const ratingVal = responses[q.id] || 3;
                  const ratingMeta = getRatingMeta(ratingVal);
                  const qIndex = QUESTIONS.findIndex((item) => item.id === q.id);

                  return (
                    <div key={q.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex-1 pr-2 text-slate-700">
                        <span className="font-semibold text-slate-900 mr-1">{q.id}.</span>
                        <span>{q.text}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onEditQuestion(qIndex)}
                        className="shrink-0 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 font-medium text-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
                      >
                        <span>{ratingMeta.label}</span>
                        <span className="text-slate-400">({ratingVal}/5)</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tell Us More (Optional Text Field) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-sm">
            <MessageSquare className="w-4 h-4 text-teal-700" />
            <span>Tell Us More</span>
          </div>
          <span className="text-xs text-slate-400">Optional</span>
        </div>

        <label htmlFor="patient-feedback-comment" className="block text-xs text-slate-600">
          Is there anything else you would like us to know about your experience?
        </label>

        <textarea
          id="patient-feedback-comment"
          rows={3}
          maxLength={500}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Share compliments, comments, or suggestions for improvement..."
          className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition-colors resize-none"
        />

        <div className="text-right text-xs text-slate-400">
          <span>{comment.length}</span> / 500 characters
        </div>
      </div>

      {/* Privacy & Consent */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-sm">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Feedback Declaration</span>
        </div>

        <div
          onClick={() => setConsentAgreed(!consentAgreed)}
          className={`flex items-start gap-3 p-3.5 rounded-lg border transition-colors cursor-pointer select-none ${
            consentAgreed
              ? 'bg-teal-50/70 border-teal-600'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="mt-0.5 shrink-0 text-teal-700">
            {consentAgreed ? (
              <CheckSquare className="w-4 h-4 text-teal-700" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            I agree to the collection and use of my feedback for hospital service quality improvement.
          </p>
        </div>

        {validationError && (
          <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-md border border-rose-200">
            {validationError}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {submissionError && (
        <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-md border border-rose-200">
          {submissionError}
        </p>
      )}
      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
        <button
          id="back-to-questions-bottom-btn"
          type="button"
          disabled={isSubmitting}
          onClick={onBackToQuestions}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          id="final-submit-feedback-btn"
          type="button"
          disabled={isSubmitting}
          onClick={handleFinalSubmit}
          className={`w-full sm:flex-1 py-3 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs ${
            isSubmitting
              ? 'bg-slate-400 text-white cursor-wait'
              : 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Feedback...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

