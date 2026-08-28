import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PatientInfoScreen } from './components/PatientInfoScreen';
import { QuestionCard } from './components/QuestionCard';
import { ReviewScreen } from './components/ReviewScreen';
import { ThankYouScreen } from './components/ThankYouScreen';
import { QUESTIONS } from './data/questions';
import { PatientInfo, Step, PEHIResult } from './types';
import { calculatePEHI } from './utils/pehiCalculator';
import { submitFeedbackToFirestore } from './services/firebase';

const HOSPITAL_MAP: Record<string, string> = {
  hosp_A: 'Apex General Hospital & Medical Centre',
  hosp_B: 'St. Jude Metropolitan Health System',
  hosp_C: 'Cityview Memorial Healthcare',
  default: 'Apex General Hospital & Medical Centre',
};

const initialPatientInfo: PatientInfo = {
  name: '',
  age: '',
  email: '',
  phone: '',
  department: '',
  ward: '',
  patientCategory: '',
};

export default function App() {
  const [hospitalId, setHospitalId] = useState<string>('hosp_A');
  const [hospitalName, setHospitalName] = useState<string>('Apex General Hospital & Medical Centre');

  const [step, setStep] = useState<Step>('welcome');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(initialPatientInfo);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string>('');
  const [submissionResult, setSubmissionResult] = useState<{
    pehiResult: PEHIResult;
    docId: string;
  } | null>(null);

  // Extract ?hospitalId from URL on mount
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryHospId = urlParams.get('hospitalId');
      if (queryHospId) {
        setHospitalId(queryHospId);
        if (HOSPITAL_MAP[queryHospId]) {
          setHospitalName(HOSPITAL_MAP[queryHospId]);
        } else {
          // Format custom hospital ID e.g. "hosp_metro" -> "Metro Hospital & Medical Center"
          const cleanName = queryHospId
            .replace(/^hosp_/, '')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setHospitalName(`${cleanName} Hospital`);
        }
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleStart = () => {
    setStep('patient-info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePatientInfoSubmit = (info: PatientInfo) => {
    setPatientInfo(info);
    setStep('questionnaire');
    setCurrentQuestionIndex(0);
    setDirection(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (value: number) => {
    const currentQ = QUESTIONS[currentQuestionIndex];
    setResponses((prev) => ({
      ...prev,
      [currentQ.id]: value,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Reached the end of 20 questions -> Go to review
      setStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Back from Q1 -> Go to Patient Info
      setStep('patient-info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEditPatientInfo = () => {
    setStep('patient-info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setDirection(1);
    setStep('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToQuestions = () => {
    setStep('questionnaire');
    setCurrentQuestionIndex(QUESTIONS.length - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionError('');
    const pehiResult = calculatePEHI(responses);

    const feedbackPayload = {
      hospitalId,
      patientName: patientInfo.name,
      age: parseInt(patientInfo.age, 10) || 0,
      email: patientInfo.email,
      phone: patientInfo.phone,
      department: patientInfo.department,
      ward: patientInfo.ward,
      patientCategory: patientInfo.patientCategory,
      responses,
      dimensionScores: pehiResult.dimensionScores,
      pehiScore: pehiResult.pehi,
      comment: comment.trim(),
      status: 'unmarked' as const,
      feedbackVersion: 'v2',
    };

    try {
      const response = await submitFeedbackToFirestore(feedbackPayload);
      setSubmissionResult({
        pehiResult,
        docId: response.docId,
      });
      setStep('thank-you');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmissionError(
        'We could not submit your feedback. Your answers are still here; please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPatientInfo(initialPatientInfo);
    setResponses({});
    setCurrentQuestionIndex(0);
    setComment('');
    setSubmissionResult(null);
    setSubmissionError('');
    setStep('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header with Hospital Info */}
      <Header hospitalName={hospitalName} hospitalId={hospitalId} />

      {/* Main Form Flow */}
      <main className="flex-1 flex flex-col justify-center py-4 sm:py-6">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <WelcomeScreen
              key="welcome"
              hospitalName={hospitalName}
              hospitalId={hospitalId}
              onStart={handleStart}
            />
          )}

          {step === 'patient-info' && (
            <PatientInfoScreen
              key="patient-info"
              initialData={patientInfo}
              onSubmit={handlePatientInfoSubmit}
              onBack={() => setStep('welcome')}
            />
          )}

          {step === 'questionnaire' && (
            <QuestionCard
              key="questionnaire"
              question={QUESTIONS[currentQuestionIndex]}
              currentIndex={currentQuestionIndex}
              totalQuestions={QUESTIONS.length}
              selectedAnswer={responses[QUESTIONS[currentQuestionIndex].id]}
              onSelectAnswer={handleSelectAnswer}
              onNext={handleNextQuestion}
              onBack={handleBackQuestion}
              direction={direction}
            />
          )}

          {step === 'review' && (
            <ReviewScreen
              key="review"
              patientInfo={patientInfo}
              responses={responses}
              comment={comment}
              onCommentChange={setComment}
              onEditPatientInfo={handleEditPatientInfo}
              onEditQuestion={handleEditQuestion}
              onSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
              submissionError={submissionError}
              onBackToQuestions={handleBackToQuestions}
            />
          )}

          {step === 'thank-you' && submissionResult && (
            <ThankYouScreen
              key="thank-you"
              pehiResult={submissionResult.pehiResult}
              hospitalName={hospitalName}
              docId={submissionResult.docId}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        <div className="max-w-xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PEHI © {new Date().getFullYear()} Patient Experience & Happiness Index</span>
          <span className="text-[11px] text-slate-400">Hospital Patient Feedback Portal</span>
        </div>
      </footer>
    </div>
  );
}
