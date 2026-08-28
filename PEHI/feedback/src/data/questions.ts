import { DimensionId, DimensionMeta, Question, RatingOption } from '../types';

export const DIMENSIONS: Record<DimensionId, DimensionMeta> = {
  clinicalCare: {
    id: 'clinicalCare',
    name: 'Clinical Care & Confidence',
    shortName: 'Clinical Care',
    weight: 0.25,
    weightDisplay: '25%',
    description: 'Medical care quality, doctor confidence, treatment safety, and attention to clinical needs.',
    questionIds: ['Q1', 'Q2', 'Q3', 'Q4'],
  },
  nursingStaff: {
    id: 'nursingStaff',
    name: 'Nursing & Staff Behaviour',
    shortName: 'Nursing & Staff',
    weight: 0.20,
    weightDisplay: '20%',
    description: 'Nursing attention, staff courtesy, responsiveness to calls, empathy, and understanding.',
    questionIds: ['Q5', 'Q6', 'Q7', 'Q8'],
  },
  communication: {
    id: 'communication',
    name: 'Communication',
    shortName: 'Communication',
    weight: 0.15,
    weightDisplay: '15%',
    description: 'Clarity of doctor and staff explanations and handling of questions and concerns.',
    questionIds: ['Q9', 'Q10', 'Q11'],
  },
  comfortFacilities: {
    id: 'comfortFacilities',
    name: 'Comfort & Facilities',
    shortName: 'Comfort & Facilities',
    weight: 0.15,
    weightDisplay: '15%',
    description: 'Cleanliness of wards, environmental comfort, beds, and physical hospital amenities.',
    questionIds: ['Q12', 'Q13', 'Q14'],
  },
  serviceEfficiency: {
    id: 'serviceEfficiency',
    name: 'Service Efficiency',
    shortName: 'Service Efficiency',
    weight: 0.10,
    weightDisplay: '10%',
    description: 'Waiting durations, service coordination across units, and admission/discharge fluidity.',
    questionIds: ['Q15', 'Q16', 'Q17'],
  },
  happinessLoyalty: {
    id: 'happinessLoyalty',
    name: 'Happiness & Loyalty',
    shortName: 'Happiness & Loyalty',
    weight: 0.15,
    weightDisplay: '15%',
    description: 'Overall emotional satisfaction, care happiness, and willingness to recommend.',
    questionIds: ['Q18', 'Q19', 'Q20'],
  },
};

export const QUESTIONS: Question[] = [
  // Dimension 1: Clinical Care & Confidence (Q1-Q4, 25%)
  {
    id: 'Q1',
    number: 1,
    text: 'How satisfied are you with the quality of medical care you received?',
    dimensionId: 'clinicalCare',
    dimensionName: 'Clinical Care & Confidence',
  },
  {
    id: 'Q2',
    number: 2,
    text: 'How confident did you feel in the doctors and medical team caring for you?',
    dimensionId: 'clinicalCare',
    dimensionName: 'Clinical Care & Confidence',
  },
  {
    id: 'Q3',
    number: 3,
    text: 'How safe and comfortable did you feel during your treatment?',
    dimensionId: 'clinicalCare',
    dimensionName: 'Clinical Care & Confidence',
  },
  {
    id: 'Q4',
    number: 4,
    text: 'How satisfied are you with the attention given to your medical needs?',
    dimensionId: 'clinicalCare',
    dimensionName: 'Clinical Care & Confidence',
  },

  // Dimension 2: Nursing & Staff Behaviour (Q5-Q8, 20%)
  {
    id: 'Q5',
    number: 5,
    text: 'How satisfied are you with the nursing care you received?',
    dimensionId: 'nursingStaff',
    dimensionName: 'Nursing & Staff Behaviour',
  },
  {
    id: 'Q6',
    number: 6,
    text: 'How courteous and respectful were the hospital staff?',
    dimensionId: 'nursingStaff',
    dimensionName: 'Nursing & Staff Behaviour',
  },
  {
    id: 'Q7',
    number: 7,
    text: 'How responsive were the nurses and staff when you needed assistance?',
    dimensionId: 'nursingStaff',
    dimensionName: 'Nursing & Staff Behaviour',
  },
  {
    id: 'Q8',
    number: 8,
    text: 'How satisfied are you with the empathy and understanding shown by the staff?',
    dimensionId: 'nursingStaff',
    dimensionName: 'Nursing & Staff Behaviour',
  },

  // Dimension 3: Communication (Q9-Q11, 15%)
  {
    id: 'Q9',
    number: 9,
    text: 'How clearly did the doctors explain your treatment or condition?',
    dimensionId: 'communication',
    dimensionName: 'Communication',
  },
  {
    id: 'Q10',
    number: 10,
    text: 'How clearly did hospital staff explain the information you needed?',
    dimensionId: 'communication',
    dimensionName: 'Communication',
  },
  {
    id: 'Q11',
    number: 11,
    text: 'How satisfied are you with the way your questions and concerns were addressed?',
    dimensionId: 'communication',
    dimensionName: 'Communication',
  },

  // Dimension 4: Comfort & Facilities (Q12-Q14, 15%)
  {
    id: 'Q12',
    number: 12,
    text: 'How satisfied are you with the cleanliness of the hospital/ward?',
    dimensionId: 'comfortFacilities',
    dimensionName: 'Comfort & Facilities',
  },
  {
    id: 'Q13',
    number: 13,
    text: 'How comfortable were the room, bed and surrounding environment?',
    dimensionId: 'comfortFacilities',
    dimensionName: 'Comfort & Facilities',
  },
  {
    id: 'Q14',
    number: 14,
    text: 'How satisfied are you with the facilities provided during your stay?',
    dimensionId: 'comfortFacilities',
    dimensionName: 'Comfort & Facilities',
  },

  // Dimension 5: Service Efficiency (Q15-Q17, 10%)
  {
    id: 'Q15',
    number: 15,
    text: 'How satisfied are you with the waiting time for services?',
    dimensionId: 'serviceEfficiency',
    dimensionName: 'Service Efficiency',
  },
  {
    id: 'Q16',
    number: 16,
    text: 'How efficiently were different hospital services coordinated?',
    dimensionId: 'serviceEfficiency',
    dimensionName: 'Service Efficiency',
  },
  {
    id: 'Q17',
    number: 17,
    text: 'How satisfied are you with the admission/discharge/service processes?',
    dimensionId: 'serviceEfficiency',
    dimensionName: 'Service Efficiency',
  },

  // Dimension 6: Happiness & Loyalty (Q18-Q20, 15%)
  {
    id: 'Q18',
    number: 18,
    text: 'Overall, how happy are you with your hospital experience?',
    dimensionId: 'happinessLoyalty',
    dimensionName: 'Happiness & Loyalty',
  },
  {
    id: 'Q19',
    number: 19,
    text: 'Overall, how satisfied are you with the care and services provided?',
    dimensionId: 'happinessLoyalty',
    dimensionName: 'Happiness & Loyalty',
  },
  {
    id: 'Q20',
    number: 20,
    text: 'How likely are you to recommend this hospital to others or return when needed?',
    dimensionId: 'happinessLoyalty',
    dimensionName: 'Happiness & Loyalty',
  },
];

export const RATING_OPTIONS: RatingOption[] = [
  {
    value: 1,
    label: 'Very Dissatisfied',
    description: 'Significantly fell short of expectations',
    sentiment: 'very-negative',
    color: 'rose',
    activeBg: 'bg-rose-50/60 border-rose-600 text-slate-900',
    activeBorder: 'border-rose-600 ring-1 ring-rose-600/20',
    activeText: 'text-rose-700',
  },
  {
    value: 2,
    label: 'Dissatisfied',
    description: 'Below expected healthcare standards',
    sentiment: 'negative',
    color: 'orange',
    activeBg: 'bg-amber-50/60 border-amber-600 text-slate-900',
    activeBorder: 'border-amber-600 ring-1 ring-amber-600/20',
    activeText: 'text-amber-700',
  },
  {
    value: 3,
    label: 'Neutral',
    description: 'Adequate, with room for improvement',
    sentiment: 'neutral',
    color: 'amber',
    activeBg: 'bg-slate-100/80 border-slate-600 text-slate-900',
    activeBorder: 'border-slate-600 ring-1 ring-slate-600/20',
    activeText: 'text-slate-700',
  },
  {
    value: 4,
    label: 'Satisfied',
    description: 'Met care standards effectively',
    sentiment: 'positive',
    color: 'teal',
    activeBg: 'bg-teal-50/70 border-teal-600 text-slate-900',
    activeBorder: 'border-teal-600 ring-1 ring-teal-600/20',
    activeText: 'text-teal-700',
  },
  {
    value: 5,
    label: 'Very Satisfied',
    description: 'Exceeded expectations with excellence',
    sentiment: 'very-positive',
    color: 'sky',
    activeBg: 'bg-teal-50/90 border-teal-700 text-slate-900',
    activeBorder: 'border-teal-700 ring-1 ring-teal-700/20',
    activeText: 'text-teal-800',
  },
];

export const DEPARTMENTS = [
  'Emergency',
  'General Medicine',
  'Surgery',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Radiology',
  'Pharmacy',
  'Oncology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Other',
];

export const WARDS = [
  'General Ward - Male',
  'General Ward - Female',
  'Intensive Care Unit (ICU)',
  'Semi-Private Ward',
  'Private Deluxe Room',
  'Day Care / Observation',
  'Post-Operative Recovery',
  'Pediatric Ward',
  'Maternity & Neonatal Ward',
  'Outpatient Consultation Suite',
  'Other',
];

export const PATIENT_CATEGORIES = [
  'Inpatient',
  'Outpatient',
  'Discharged Patient',
  'Attendant/Caregiver',
  'Other',
];
