/**
 * PEHI Data Types and Interfaces
 */

export type DimensionId =
  | 'clinicalCare'
  | 'nursingStaff'
  | 'communication'
  | 'comfortFacilities'
  | 'serviceEfficiency'
  | 'happinessLoyalty';

export interface DimensionMeta {
  id: DimensionId;
  name: string;
  shortName: string;
  weight: number; // e.g. 0.25 for 25%
  weightDisplay: string;
  description: string;
  questionIds: string[];
}

export interface Question {
  id: string; // "Q1", "Q2", etc.
  number: number; // 1 to 20
  text: string;
  dimensionId: DimensionId;
  dimensionName: string;
}

export interface RatingOption {
  value: number; // 1 to 5
  label: string;
  description: string;
  sentiment: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
  color: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
}

export interface PatientInfo {
  name: string;
  age: string;
  email: string;
  phone: string;
  department: string;
  ward: string;
  patientCategory: string;
}

export type ScoreClassification = 'Critical' | 'Needs Improvement' | 'Good' | 'Excellent';

export interface DimensionScores {
  clinicalCare: number;
  nursingStaff: number;
  communication: number;
  comfortFacilities: number;
  serviceEfficiency: number;
  happinessLoyalty: number;
}

export interface PEHIResult {
  questionScores: Record<string, number>; // Q1 -> 100
  rawResponses: Record<string, number>; // Q1 -> 5
  dimensionScores: DimensionScores;
  pehi: number; // 0 to 100 raw float
  pehiDisplay: string; // e.g. "82.5"
  classification: ScoreClassification;
}

export interface FeedbackSubmission {
  hospitalId: string;
  patientName: string;
  age: number;
  email: string;
  phone: string;
  department: string;
  ward: string;
  patientCategory: string;
  responses: Record<string, number>; // Q1: 5, etc.
  dimensionScores: DimensionScores;
  pehiScore: number;
  comment: string;
  status: 'unmarked' | 'marked' | 'done';
  feedbackVersion: string;
  createdAt: string;
}

export type Step =
  | 'welcome'
  | 'patient-info'
  | 'questionnaire'
  | 'review'
  | 'thank-you';
