import { 
  PatientFeedback, 
  DimensionScores, 
  DimensionKey, 
  PEHIClassification, 
  DepartmentStat, 
  WardStat, 
  AlertItem, 
  QuestionMeta 
} from '../types';

export const QUESTIONS_META: QuestionMeta[] = [
  // Clinical Care & Confidence (Q1-Q4)
  { id: 1, text: "Doctor attentiveness, thoroughness and examination depth", dimensionKey: "clinicalCare", dimensionName: "Clinical Care & Confidence" },
  { id: 2, text: "Clarity of diagnosis, treatment options and care explanations", dimensionKey: "clinicalCare", dimensionName: "Clinical Care & Confidence" },
  { id: 3, text: "Pain management, relief speed and clinical response efficacy", dimensionKey: "clinicalCare", dimensionName: "Clinical Care & Confidence" },
  { id: 4, text: "Confidence and trust in medical doctor competence", dimensionKey: "clinicalCare", dimensionName: "Clinical Care & Confidence" },
  
  // Nursing & Staff Behaviour (Q5-Q8)
  { id: 5, text: "Nurse responsiveness and call-bell promptness", dimensionKey: "nursingStaff", dimensionName: "Nursing & Staff Behaviour" },
  { id: 6, text: "Courtesy, respect and empathy shown by nursing team", dimensionKey: "nursingStaff", dimensionName: "Nursing & Staff Behaviour" },
  { id: 7, text: "Gentleness and care during medication, IV and procedures", dimensionKey: "nursingStaff", dimensionName: "Nursing & Staff Behaviour" },
  { id: 8, text: "Attentiveness of support and housekeeping staff to personal needs", dimensionKey: "nursingStaff", dimensionName: "Nursing & Staff Behaviour" },
  
  // Communication (Q9-Q11)
  { id: 9, text: "Clear updates on daily schedule, lab results and medical progress", dimensionKey: "communication", dimensionName: "Communication" },
  { id: 10, text: "Clarity of post-discharge instructions and medication dosage guide", dimensionKey: "communication", dimensionName: "Communication" },
  { id: 11, text: "Listening to patient concerns and including family in key decisions", dimensionKey: "communication", dimensionName: "Communication" },
  
  // Comfort & Facilities (Q12-Q14)
  { id: 12, text: "Room cleanliness, hygiene standards and restroom sanitation", dimensionKey: "comfortFacilities", dimensionName: "Comfort & Facilities" },
  { id: 13, text: "Restful environment, noise control and ambient temperature", dimensionKey: "comfortFacilities", dimensionName: "Comfort & Facilities" },
  { id: 14, text: "Quality, dietary suitability and presentation of hospital meals", dimensionKey: "comfortFacilities", dimensionName: "Comfort & Facilities" },
  
  // Service Efficiency (Q15-Q17)
  { id: 15, text: "Speed and smoothness of admission and reception check-in", dimensionKey: "serviceEfficiency", dimensionName: "Service Efficiency" },
  { id: 16, text: "Timeliness and coordination of diagnostic tests, labs and scans", dimensionKey: "serviceEfficiency", dimensionName: "Service Efficiency" },
  { id: 17, text: "Discharge workflow efficiency and billing transparency", dimensionKey: "serviceEfficiency", dimensionName: "Service Efficiency" },
  
  // Happiness & Loyalty (Q18-Q20)
  { id: 18, text: "Overall feeling of emotional safety, comfort and well-being", dimensionKey: "happinessLoyalty", dimensionName: "Happiness & Loyalty" },
  { id: 19, text: "Likelihood to recommend this hospital to family and friends (NPS)", dimensionKey: "happinessLoyalty", dimensionName: "Happiness & Loyalty" },
  { id: 20, text: "Overall satisfaction with hospital experience and hospital stay", dimensionKey: "happinessLoyalty", dimensionName: "Happiness & Loyalty" },
];

export const DIMENSION_INFO: Record<DimensionKey, { name: string; weight: number; questions: number[]; color: string }> = {
  clinicalCare: {
    name: 'Clinical Care & Confidence',
    weight: 0.25,
    questions: [1, 2, 3, 4],
    color: '#0284c7' // sky-600
  },
  nursingStaff: {
    name: 'Nursing & Staff Behaviour',
    weight: 0.20,
    questions: [5, 6, 7, 8],
    color: '#0d9488' // teal-600
  },
  communication: {
    name: 'Communication',
    weight: 0.15,
    questions: [9, 10, 11],
    color: '#2563eb' // blue-600
  },
  comfortFacilities: {
    name: 'Comfort & Facilities',
    weight: 0.15,
    questions: [12, 13, 14],
    color: '#8b5cf6' // violet-500
  },
  serviceEfficiency: {
    name: 'Service Efficiency',
    weight: 0.10,
    questions: [15, 16, 17],
    color: '#f59e0b' // amber-500
  },
  happinessLoyalty: {
    name: 'Happiness & Loyalty',
    weight: 0.15,
    questions: [18, 19, 20],
    color: '#10b981' // emerald-500
  }
};

/**
 * Converts a 1-5 scale rating to 0-100 score:
 * 1 = 0
 * 2 = 25
 * 3 = 50
 * 4 = 75
 * 5 = 100
 */
export function convertScaleToScore(value: number | string | undefined): number {
  if (value === undefined || value === null) return 50;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 50;

  // If already in 0-100 range, return clamped
  if (num > 5 && num <= 100) return Math.min(100, Math.max(0, num));

  switch (Math.round(num)) {
    case 1: return 0;
    case 2: return 25;
    case 3: return 50;
    case 4: return 75;
    case 5: return 100;
    default:
      // Linear interpolation for continuous inputs between 1 and 5
      return Math.min(100, Math.max(0, ((num - 1) / 4) * 100));
  }
}

/**
 * Calculates the 6 dimension scores and overall PEHI for a single review document.
 */
export function calculateReviewScores(responses: Record<string, number | string | undefined>): {
  dimensionScores: DimensionScores;
  pehiScore: number;
  pehiClassification: PEHIClassification;
} {
  const getQScore = (qNum: number): number => {
    const directVal = responses[`q${qNum}`] ?? responses[`Q${qNum}`] ?? responses[`${qNum}`];
    return convertScaleToScore(directVal);
  };

  const getDimensionAvg = (questionIds: number[]): number => {
    if (questionIds.length === 0) return 0;
    const total = questionIds.reduce((sum, qId) => sum + getQScore(qId), 0);
    return Math.round((total / questionIds.length) * 10) / 10;
  };

  const clinicalCare = getDimensionAvg(DIMENSION_INFO.clinicalCare.questions);
  const nursingStaff = getDimensionAvg(DIMENSION_INFO.nursingStaff.questions);
  const communication = getDimensionAvg(DIMENSION_INFO.communication.questions);
  const comfortFacilities = getDimensionAvg(DIMENSION_INFO.comfortFacilities.questions);
  const serviceEfficiency = getDimensionAvg(DIMENSION_INFO.serviceEfficiency.questions);
  const happinessLoyalty = getDimensionAvg(DIMENSION_INFO.happinessLoyalty.questions);

  const dimensionScores: DimensionScores = {
    clinicalCare,
    nursingStaff,
    communication,
    comfortFacilities,
    serviceEfficiency,
    happinessLoyalty
  };

  // PEHI Formula:
  // ClinicalCare × 0.25 + NursingStaff × 0.20 + Communication × 0.15 + ComfortFacilities × 0.15 + ServiceEfficiency × 0.10 + HappinessLoyalty × 0.15
  const rawPehi = 
    clinicalCare * 0.25 +
    nursingStaff * 0.20 +
    communication * 0.15 +
    comfortFacilities * 0.15 +
    serviceEfficiency * 0.10 +
    happinessLoyalty * 0.15;

  const pehiScore = Math.round(rawPehi * 10) / 10;
  const pehiClassification = classifyPEHI(pehiScore);

  return { dimensionScores, pehiScore, pehiClassification };
}

export function classifyPEHI(score: number): PEHIClassification {
  if (score < 40) return 'Critical';
  if (score < 60) return 'Needs Improvement';
  if (score < 80) return 'Good';
  return 'Excellent';
}

/**
 * Calculates aggregated statistics over a list of reviews.
 */
export function aggregateReviews(reviews: PatientFeedback[]) {
  if (!reviews || reviews.length === 0) {
    return {
      overallPEHI: 0,
      totalReviews: 0,
      todayReviews: 0,
      thisMonthReviews: 0,
      excellentReviews: 0,
      criticalReviews: 0,
      needsImprovementReviews: 0,
      goodReviews: 0,
      unmarkedCount: 0,
      markedCount: 0,
      doneCount: 0,
      dimensionAverages: {
        clinicalCare: 0,
        nursingStaff: 0,
        communication: 0,
        comfortFacilities: 0,
        serviceEfficiency: 0,
        happinessLoyalty: 0,
      } as DimensionScores,
    };
  }

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const thisMonthPrefix = now.toISOString().slice(0, 7);

  let totalPEHI = 0;
  let todayCount = 0;
  let thisMonthCount = 0;
  let excellentCount = 0;
  let criticalCount = 0;
  let needsImprovementCount = 0;
  let goodCount = 0;
  let unmarkedCount = 0;
  let markedCount = 0;
  let doneCount = 0;

  const dimensionTotals = {
    clinicalCare: 0,
    nursingStaff: 0,
    communication: 0,
    comfortFacilities: 0,
    serviceEfficiency: 0,
    happinessLoyalty: 0,
  };

  reviews.forEach(r => {
    totalPEHI += r.pehiScore;
    const dateStr = (r.submissionDate || '').slice(0, 10);
    if (dateStr === todayStr) todayCount++;
    if (dateStr.startsWith(thisMonthPrefix)) thisMonthCount++;

    if (r.pehiClassification === 'Excellent') excellentCount++;
    else if (r.pehiClassification === 'Good') goodCount++;
    else if (r.pehiClassification === 'Needs Improvement') needsImprovementCount++;
    else if (r.pehiClassification === 'Critical') criticalCount++;

    if (r.status === 'UNMARKED') unmarkedCount++;
    else if (r.status === 'MARKED') markedCount++;
    else if (r.status === 'DONE') doneCount++;

    dimensionTotals.clinicalCare += r.dimensionScores.clinicalCare;
    dimensionTotals.nursingStaff += r.dimensionScores.nursingStaff;
    dimensionTotals.communication += r.dimensionScores.communication;
    dimensionTotals.comfortFacilities += r.dimensionScores.comfortFacilities;
    dimensionTotals.serviceEfficiency += r.dimensionScores.serviceEfficiency;
    dimensionTotals.happinessLoyalty += r.dimensionScores.happinessLoyalty;
  });

  const count = reviews.length;
  const overallPEHI = Math.round((totalPEHI / count) * 10) / 10;

  const dimensionAverages: DimensionScores = {
    clinicalCare: Math.round((dimensionTotals.clinicalCare / count) * 10) / 10,
    nursingStaff: Math.round((dimensionTotals.nursingStaff / count) * 10) / 10,
    communication: Math.round((dimensionTotals.communication / count) * 10) / 10,
    comfortFacilities: Math.round((dimensionTotals.comfortFacilities / count) * 10) / 10,
    serviceEfficiency: Math.round((dimensionTotals.serviceEfficiency / count) * 10) / 10,
    happinessLoyalty: Math.round((dimensionTotals.happinessLoyalty / count) * 10) / 10,
  };

  return {
    overallPEHI,
    totalReviews: count,
    todayReviews: todayCount,
    thisMonthReviews: thisMonthCount,
    excellentReviews: excellentCount,
    criticalReviews: criticalCount,
    needsImprovementReviews: needsImprovementCount,
    goodReviews: goodCount,
    unmarkedCount,
    markedCount,
    doneCount,
    dimensionAverages
  };
}

/**
 * Aggregates Department performance.
 */
export function aggregateByDepartment(reviews: PatientFeedback[]): DepartmentStat[] {
  const groups: Record<string, PatientFeedback[]> = {};
  
  reviews.forEach(r => {
    const dept = r.department || 'General';
    if (!groups[dept]) groups[dept] = [];
    groups[dept].push(r);
  });

  return Object.entries(groups).map(([dept, deptReviews]) => {
    const stats = aggregateReviews(deptReviews);
    return {
      department: dept,
      reviewsCount: deptReviews.length,
      pehi: stats.overallPEHI,
      clinicalCare: stats.dimensionAverages.clinicalCare,
      nursingStaff: stats.dimensionAverages.nursingStaff,
      communication: stats.dimensionAverages.communication,
      comfortFacilities: stats.dimensionAverages.comfortFacilities,
      serviceEfficiency: stats.dimensionAverages.serviceEfficiency,
      happinessLoyalty: stats.dimensionAverages.happinessLoyalty,
      status: classifyPEHI(stats.overallPEHI),
      trend: calculateTrend(deptReviews)
    };
  }).sort((a, b) => b.pehi - a.pehi);
}

/**
 * Aggregates Ward performance.
 */
export function aggregateByWard(reviews: PatientFeedback[]): WardStat[] {
  const groups: Record<string, PatientFeedback[]> = {};
  
  reviews.forEach(r => {
    const ward = r.ward || 'Main Ward';
    if (!groups[ward]) groups[ward] = [];
    groups[ward].push(r);
  });

  return Object.entries(groups).map(([ward, wardReviews]) => {
    const stats = aggregateReviews(wardReviews);
    const mainDept = wardReviews[0]?.department || 'General';
    return {
      ward,
      department: mainDept,
      reviewsCount: wardReviews.length,
      pehi: stats.overallPEHI,
      status: classifyPEHI(stats.overallPEHI),
      trend: calculateTrend(wardReviews)
    };
  }).sort((a, b) => b.pehi - a.pehi);
}

/**
 * Generates automated alerts based on configurable threshold (default 60).
 */
export function generateAlerts(
  reviews: PatientFeedback[], 
  threshold: number = 60,
  criticalThreshold: number = 40
): AlertItem[] {
  if (reviews.length === 0) return [];
  const alerts: AlertItem[] = [];
  const aggregated = aggregateReviews(reviews);

  // 1. Overall Hospital PEHI Alert
  if (aggregated.overallPEHI < threshold && reviews.length > 0) {
    const isCritical = aggregated.overallPEHI < criticalThreshold;
    alerts.push({
      id: 'alert-overall',
      type: 'Overall',
      title: `${isCritical ? '🚨 Critical' : '⚠'} Hospital PEHI Warning`,
      entityName: 'Hospital Wide',
      score: aggregated.overallPEHI,
      threshold,
      severity: isCritical ? 'Critical' : 'Needs Attention',
      status: isCritical ? 'Critical' : 'Needs Improvement',
      message: `Overall hospital PEHI score is ${aggregated.overallPEHI.toFixed(1)}, below the target threshold of ${threshold}.`,
      detectedAt: new Date().toISOString(),
      affectedReviewsCount: reviews.length
    });
  }

  // 2. Dimension Alerts
  const dimKeys: DimensionKey[] = ['clinicalCare', 'nursingStaff', 'communication', 'comfortFacilities', 'serviceEfficiency', 'happinessLoyalty'];
  dimKeys.forEach(dimKey => {
    const score = aggregated.dimensionAverages[dimKey];
    if (score < threshold && reviews.length > 0) {
      const isCritical = score < criticalThreshold;
      const dimInfo = DIMENSION_INFO[dimKey];
      alerts.push({
        id: `alert-dim-${dimKey}`,
        type: 'Dimension',
        title: `${dimInfo.name} Alert`,
        entityName: dimInfo.name,
        dimensionKey: dimKey,
        score,
        threshold,
        severity: isCritical ? 'Critical' : 'Needs Attention',
        status: isCritical ? 'Critical' : 'Needs Improvement',
        message: `${dimInfo.name} score is ${score.toFixed(1)}/100, which requires executive attention.`,
        detectedAt: new Date().toISOString(),
        affectedReviewsCount: reviews.length
      });
    }
  });

  // 3. Department Alerts
  const deptStats = aggregateByDepartment(reviews);
  deptStats.forEach(dept => {
    if (dept.pehi < threshold && dept.reviewsCount >= 1) {
      const isCritical = dept.pehi < criticalThreshold;
      alerts.push({
        id: `alert-dept-${dept.department}`,
        type: 'Department',
        title: `${dept.department} Performance Alert`,
        entityName: dept.department,
        score: dept.pehi,
        threshold,
        severity: isCritical ? 'Critical' : 'Needs Attention',
        status: isCritical ? 'Critical' : 'Needs Improvement',
        message: `${dept.department} PEHI fell to ${dept.pehi.toFixed(1)} across ${dept.reviewsCount} reviews.`,
        detectedAt: new Date().toISOString(),
        affectedReviewsCount: dept.reviewsCount
      });
    }
  });

  // 4. Ward Alerts
  const wardStats = aggregateByWard(reviews);
  wardStats.forEach(ward => {
    if (ward.pehi < threshold && ward.reviewsCount >= 1) {
      const isCritical = ward.pehi < criticalThreshold;
      alerts.push({
        id: `alert-ward-${ward.ward}`,
        type: 'Ward',
        title: `${ward.ward} Alert`,
        entityName: ward.ward,
        score: ward.pehi,
        threshold,
        severity: isCritical ? 'Critical' : 'Needs Attention',
        status: isCritical ? 'Critical' : 'Needs Improvement',
        message: `${ward.ward} scored ${ward.pehi.toFixed(1)} in patient satisfaction index.`,
        detectedAt: new Date().toISOString(),
        affectedReviewsCount: ward.reviewsCount
      });
    }
  });

  return alerts.sort((a, b) => {
    if (a.severity === 'Critical' && b.severity !== 'Critical') return -1;
    if (b.severity === 'Critical' && a.severity !== 'Critical') return 1;
    return a.score - b.score;
  });
}

function calculateTrend(reviews: PatientFeedback[]): number {
  if (reviews.length < 4) return 0;
  const sorted = [...reviews].sort((a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime());
  const half = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, half);
  const secondHalf = sorted.slice(half);

  const avg1 = firstHalf.reduce((sum, r) => sum + r.pehiScore, 0) / firstHalf.length;
  const avg2 = secondHalf.reduce((sum, r) => sum + r.pehiScore, 0) / secondHalf.length;

  return Math.round((avg2 - avg1) * 10) / 10;
}

/**
 * Aggregates time series data for charts.
 */
export function aggregateTimeSeries(
  reviews: PatientFeedback[], 
  timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
) {
  if (reviews.length === 0) return [];

  const sorted = [...reviews].sort((a, b) => 
    new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime()
  );

  const groups: Record<string, { totalPEHI: number; count: number; dateLabel: string }> = {};

  sorted.forEach(r => {
    const d = new Date(r.submissionDate);
    if (isNaN(d.getTime())) return;

    let key = '';
    let label = '';

    if (timeframe === 'Daily') {
      key = d.toISOString().slice(0, 10);
      label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (timeframe === 'Weekly') {
      const year = d.getFullYear();
      const firstDayOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
      const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      key = `${year}-W${weekNum < 10 ? '0' + weekNum : weekNum}`;
      label = `Wk ${weekNum}, ${year}`;
    } else if (timeframe === 'Monthly') {
      key = d.toISOString().slice(0, 7);
      label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      key = `${d.getFullYear()}`;
      label = `${d.getFullYear()}`;
    }

    if (!groups[key]) {
      groups[key] = { totalPEHI: 0, count: 0, dateLabel: label };
    }
    groups[key].totalPEHI += r.pehiScore;
    groups[key].count += 1;
  });

  return Object.keys(groups).sort().map(key => {
    const item = groups[key];
    const pehi = Math.round((item.totalPEHI / item.count) * 10) / 10;
    return {
      periodKey: key,
      label: item.dateLabel,
      pehi,
      reviewsCount: item.count
    };
  });
}
