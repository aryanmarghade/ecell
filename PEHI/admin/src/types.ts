export type UserRole = 'ADMIN' | 'MANAGER' | 'VIEWER';

export type ReviewStatus = 'UNMARKED' | 'MARKED' | 'DONE';

export type PEHIClassification = 'Critical' | 'Needs Improvement' | 'Good' | 'Excellent';

export type AlertSeverity = 'Critical' | 'Needs Attention' | 'Good';

export type PatientCategory = 'Inpatient' | 'Outpatient' | 'Day Care' | 'Emergency' | 'Maternity' | 'Pediatric' | 'ICU';

export interface QuestionMeta {
  id: number;
  text: string;
  dimensionKey: DimensionKey;
  dimensionName: string;
}

export type DimensionKey = 
  | 'clinicalCare'
  | 'nursingStaff'
  | 'communication'
  | 'comfortFacilities'
  | 'serviceEfficiency'
  | 'happinessLoyalty';

export interface DimensionScores {
  clinicalCare: number;        // Questions 1–4 (Weight 25%)
  nursingStaff: number;        // Questions 5–8 (Weight 20%)
  communication: number;       // Questions 9–11 (Weight 15%)
  comfortFacilities: number;   // Questions 12–14 (Weight 15%)
  serviceEfficiency: number;   // Questions 15–17 (Weight 10%)
  happinessLoyalty: number;    // Questions 18–20 (Weight 15%)
}

export interface PatientFeedback {
  id: string;
  hospitalId: string;
  patientName: string;
  age?: number | string;
  email?: string;
  phone?: string;
  department: string;
  ward?: string;
  patientCategory?: PatientCategory | string;
  submissionDate: string; // ISO format or YYYY-MM-DD
  timestamp?: number;
  status: ReviewStatus;
  comment?: string;
  // Raw 20 responses: rating 1 to 5 (or mapped)
  responses: { [key: string]: number }; // e.g. { q1: 5, q2: 4, ... } or { '1': 5, ... }
  // Computed values
  pehiScore: number;
  pehiClassification: PEHIClassification;
  dimensionScores: DimensionScores;
  markedBy?: string;
  markedAt?: string;
  notes?: string;
}

export interface DepartmentStat {
  department: string;
  reviewsCount: number;
  pehi: number;
  clinicalCare: number;
  nursingStaff: number;
  communication: number;
  comfortFacilities: number;
  serviceEfficiency: number;
  happinessLoyalty: number;
  status: PEHIClassification;
  trend?: number; // +/- change
}

export interface WardStat {
  ward: string;
  department?: string;
  reviewsCount: number;
  pehi: number;
  status: PEHIClassification;
  trend?: number;
}

export interface AlertItem {
  id: string;
  type: 'Overall' | 'Dimension' | 'Department' | 'Ward';
  title: string;
  entityName: string;
  dimensionKey?: DimensionKey;
  score: number;
  threshold: number;
  severity: AlertSeverity;
  status: string;
  message: string;
  detectedAt: string;
  affectedReviewsCount: number;
}

export interface HospitalProfile {
  id: string;
  name: string;
  logoUrl?: string;
  tagline?: string;
  address?: string;
  primaryContact?: string;
}

export interface FilterState {
  searchQuery: string;
  department: string;
  ward: string;
  patientCategory: string;
  status: string; // 'ALL' | 'UNMARKED' | 'MARKED' | 'DONE'
  pehiClassification: string; // 'ALL' | 'Critical' | 'Needs Improvement' | 'Good' | 'Excellent'
  dateRange: 'all' | 'today' | '7days' | '30days' | 'this_month' | 'this_year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface ThresholdSettings {
  pehiAlertThreshold: number; // default 60
  criticalThreshold: number;  // default 40
  needsAttentionThreshold: number; // default 60
}
