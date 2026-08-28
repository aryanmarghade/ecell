import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Question } from '../types';
import { DIMENSIONS, RATING_OPTIONS } from '../data/questions';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onSelectAnswer: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  direction: number; // 1 for forward, -1 for backward
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onBack,
  direction,
}) => {
  const currentDimension = DIMENSIONS[question.dimensionId];
  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const transitionVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 25 : -25,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -25 : 25,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-8">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Progress & Question Counter Header */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-teal-800 font-medium">
              {progressPercentage}%
            </span>
          </div>

          {/* Thin, clean progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-teal-700 rounded-full"
              initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Animated Question Content */}
        <div className="overflow-hidden min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={transitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="w-full pt-1"
            >
              {/* Dimension Name */}
              <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
                {currentDimension.name}
              </p>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-5">
                {question.text}
              </h2>

              {/* 5 Response Options */}
              <div className="space-y-2.5" role="radiogroup" aria-label={question.text}>
                {RATING_OPTIONS.map((option) => {
                  const isSelected = selectedAnswer === option.value;
                  return (
                    <button
                      key={option.value}
                      id={`rating-option-${option.value}`}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelectAnswer(option.value)}
                      className={`w-full px-4 py-3 sm:py-3.5 rounded-lg border text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-teal-700 bg-teal-50/70 text-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Radio selection circle */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-teal-700 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>

                        <div>
                          <span className={`text-sm ${isSelected ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'}`}>
                            {option.label}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
            <button
              id="question-back-btn"
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentIndex === 0 ? 'Patient Info' : 'Previous'}</span>
            </button>

            <button
              id="question-next-btn"
              type="button"
              disabled={selectedAnswer === undefined}
              onClick={onNext}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors ${
                selectedAnswer !== undefined
                  ? 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white cursor-pointer shadow-xs'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <span>{isLastQuestion ? 'Review Answers' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
