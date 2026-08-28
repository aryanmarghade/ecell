import { DIMENSIONS } from '../data/questions';
import { DimensionId, DimensionScores, PEHIResult, ScoreClassification } from '../types';

/**
 * Converts 1-5 rating scale to 0-100 scale
 * 1 = 0
 * 2 = 25
 * 3 = 50
 * 4 = 75
 * 5 = 100
 */
export function convertRatingToScore(rating: number): number {
  switch (rating) {
    case 1:
      return 0;
    case 2:
      return 25;
    case 3:
      return 50;
    case 4:
      return 75;
    case 5:
      return 100;
    default:
      return 0;
  }
}

/**
 * Classifies PEHI score into standard clinical index categories
 * 0–39 = Critical
 * 40–59 = Needs Improvement
 * 60–79 = Good
 * 80–100 = Excellent
 */
export function classifyPEHI(score: number): ScoreClassification {
  if (score < 40) return 'Critical';
  if (score < 60) return 'Needs Improvement';
  if (score < 80) return 'Good';
  return 'Excellent';
}

/**
 * Computes all dimension averages and the comprehensive PEHI score
 */
export function calculatePEHI(responses: Record<string, number>): PEHIResult {
  const questionScores: Record<string, number> = {};

  // Convert each response to 0-100 score
  for (let i = 1; i <= 20; i++) {
    const qKey = `Q${i}`;
    const rawVal = responses[qKey] || 3; // fallback neutral if missing
    questionScores[qKey] = convertRatingToScore(rawVal);
  }

  // Calculate dimension averages
  const dimensionScores: DimensionScores = {
    clinicalCare: 0,
    nursingStaff: 0,
    communication: 0,
    comfortFacilities: 0,
    serviceEfficiency: 0,
    happinessLoyalty: 0,
  };

  (Object.keys(DIMENSIONS) as DimensionId[]).forEach((dimId) => {
    const dim = DIMENSIONS[dimId];
    const scoresInDim = dim.questionIds.map((qId) => questionScores[qId] ?? 0);
    const sum = scoresInDim.reduce((acc, curr) => acc + curr, 0);
    dimensionScores[dimId] = sum / scoresInDim.length;
  });

  // Calculate weighted overall PEHI:
  // ClinicalCare × 0.25 + NursingStaff × 0.20 + Communication × 0.15 + ComfortFacilities × 0.15 + ServiceEfficiency × 0.10 + HappinessLoyalty × 0.15
  const rawPehi =
    dimensionScores.clinicalCare * DIMENSIONS.clinicalCare.weight +
    dimensionScores.nursingStaff * DIMENSIONS.nursingStaff.weight +
    dimensionScores.communication * DIMENSIONS.communication.weight +
    dimensionScores.comfortFacilities * DIMENSIONS.comfortFacilities.weight +
    dimensionScores.serviceEfficiency * DIMENSIONS.serviceEfficiency.weight +
    dimensionScores.happinessLoyalty * DIMENSIONS.happinessLoyalty.weight;

  // Final score rounded to one decimal place for display
  const pehiDisplay = (Math.round(rawPehi * 10) / 10).toFixed(1);
  const classification = classifyPEHI(rawPehi);

  return {
    questionScores,
    rawResponses: responses,
    dimensionScores,
    pehi: rawPehi,
    pehiDisplay,
    classification,
  };
}

export function getClassificationColor(classification: ScoreClassification): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
} {
  switch (classification) {
    case 'Excellent':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-900',
        border: 'border-emerald-200',
        badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
        badgeText: 'text-emerald-700',
        accent: '#059669',
      };
    case 'Good':
      return {
        bg: 'bg-teal-50',
        text: 'text-teal-900',
        border: 'border-teal-200',
        badgeBg: 'bg-teal-100 text-teal-800 border border-teal-300',
        badgeText: 'text-teal-700',
        accent: '#0d9488',
      };
    case 'Needs Improvement':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-900',
        border: 'border-amber-200',
        badgeBg: 'bg-amber-100 text-amber-800 border border-amber-300',
        badgeText: 'text-amber-700',
        accent: '#d97706',
      };
    case 'Critical':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-900',
        border: 'border-rose-200',
        badgeBg: 'bg-rose-100 text-rose-800 border border-rose-300',
        badgeText: 'text-rose-700',
        accent: '#e11d48',
      };
  }
}
