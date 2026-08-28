/**
 * PEHI — Patient Experience & Happiness Index
 * Core Logic & Calculation Engine
 */

import { firebaseConfig } from './firebase-config.js';

export const DIMENSIONS = {
  clinicalCare: {
    id: 'clinicalCare',
    name: 'Clinical Care & Confidence',
    weight: 0.25,
    questions: ['Q1', 'Q2', 'Q3', 'Q4'],
  },
  nursingStaff: {
    id: 'nursingStaff',
    name: 'Nursing & Staff Behaviour',
    weight: 0.20,
    questions: ['Q5', 'Q6', 'Q7', 'Q8'],
  },
  communication: {
    id: 'communication',
    name: 'Communication',
    weight: 0.15,
    questions: ['Q9', 'Q10', 'Q11'],
  },
  comfortFacilities: {
    id: 'comfortFacilities',
    name: 'Comfort & Facilities',
    weight: 0.15,
    questions: ['Q12', 'Q13', 'Q14'],
  },
  serviceEfficiency: {
    id: 'serviceEfficiency',
    weight: 0.10,
    name: 'Service Efficiency',
    questions: ['Q15', 'Q16', 'Q17'],
  },
  happinessLoyalty: {
    id: 'happinessLoyalty',
    weight: 0.15,
    name: 'Happiness & Loyalty',
    questions: ['Q18', 'Q19', 'Q20'],
  },
};

export function convertRatingToScore(rating) {
  switch (Number(rating)) {
    case 1: return 0;
    case 2: return 25;
    case 3: return 50;
    case 4: return 75;
    case 5: return 100;
    default: return 0;
  }
}

export function classifyPEHI(score) {
  if (score < 40) return 'Critical';
  if (score < 60) return 'Needs Improvement';
  if (score < 80) return 'Good';
  return 'Excellent';
}

export function calculatePEHI(responses) {
  const questionScores = {};
  for (let i = 1; i <= 20; i++) {
    const qKey = `Q${i}`;
    const rawVal = responses[qKey] || 3;
    questionScores[qKey] = convertRatingToScore(rawVal);
  }

  const dimensionScores = {};
  Object.keys(DIMENSIONS).forEach((dimKey) => {
    const dim = DIMENSIONS[dimKey];
    const sum = dim.questions.reduce((acc, q) => acc + (questionScores[q] || 0), 0);
    dimensionScores[dimKey] = sum / dim.questions.length;
  });

  const pehi =
    dimensionScores.clinicalCare * DIMENSIONS.clinicalCare.weight +
    dimensionScores.nursingStaff * DIMENSIONS.nursingStaff.weight +
    dimensionScores.communication * DIMENSIONS.communication.weight +
    dimensionScores.comfortFacilities * DIMENSIONS.comfortFacilities.weight +
    dimensionScores.serviceEfficiency * DIMENSIONS.serviceEfficiency.weight +
    dimensionScores.happinessLoyalty * DIMENSIONS.happinessLoyalty.weight;

  return {
    questionScores,
    rawResponses: responses,
    dimensionScores,
    pehi,
    pehiDisplay: (Math.round(pehi * 10) / 10).toFixed(1),
    classification: classifyPEHI(pehi),
  };
}

export { firebaseConfig };
