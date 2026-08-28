import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PatientFeedback, HospitalProfile, DimensionScores, DepartmentStat, WardStat, AlertItem } from '../types';
import { DIMENSION_INFO, QUESTIONS_META } from './pehiCalculator';

export function exportReviewsToCSV(reviews: PatientFeedback[], hospitalName = 'Hospital'): void {
  const headers = [
    'Date',
    'Patient Name',
    'Age',
    'Email',
    'Phone',
    'Department',
    'Ward',
    'Patient Category',
    ...Array.from({ length: 20 }, (_, i) => `Q${i + 1}`),
    'Clinical Care & Confidence',
    'Nursing & Staff Behaviour',
    'Communication',
    'Comfort & Facilities',
    'Service Efficiency',
    'Happiness & Loyalty',
    'PEHI Score',
    'PEHI Classification',
    'Review Status',
    'Qualitative Comment'
  ];

  const escapeCSV = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = reviews.map(r => {
    const qValues = Array.from({ length: 20 }, (_, i) => {
      const qNum = i + 1;
      return r.responses[`q${qNum}`] ?? r.responses[`Q${qNum}`] ?? r.responses[`${qNum}`] ?? '';
    });

    return [
      escapeCSV(r.submissionDate),
      escapeCSV(r.patientName),
      escapeCSV(r.age ?? ''),
      escapeCSV(r.email ?? ''),
      escapeCSV(r.phone ?? ''),
      escapeCSV(r.department),
      escapeCSV(r.ward ?? ''),
      escapeCSV(r.patientCategory ?? ''),
      ...qValues.map(v => escapeCSV(v)),
      escapeCSV(r.dimensionScores.clinicalCare.toFixed(1)),
      escapeCSV(r.dimensionScores.nursingStaff.toFixed(1)),
      escapeCSV(r.dimensionScores.communication.toFixed(1)),
      escapeCSV(r.dimensionScores.comfortFacilities.toFixed(1)),
      escapeCSV(r.dimensionScores.serviceEfficiency.toFixed(1)),
      escapeCSV(r.dimensionScores.happinessLoyalty.toFixed(1)),
      escapeCSV(r.pehiScore.toFixed(1)),
      escapeCSV(r.pehiClassification),
      escapeCSV(r.status),
      escapeCSV(r.comment ?? '')
    ].join(',');
  });

  const csvContent = [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PEHI_Reviews_${hospitalName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface PDFReportPayload {
  hospital: HospitalProfile;
  reportTitle: string;
  dateRangeLabel: string;
  overallPEHI: number;
  totalReviews: number;
  unmarkedCount: number;
  markedCount: number;
  doneCount: number;
  dimensionScores: DimensionScores;
  departments: DepartmentStat[];
  wards: WardStat[];
  alerts: AlertItem[];
  recentReviews: PatientFeedback[];
}

export function exportExecutivePDF(payload: PDFReportPayload): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [14, 116, 144]; // cyan-700
  const navyColor: [number, number, number] = [15, 39, 68]; // slate-900
  const darkTextColor: [number, number, number] = [30, 41, 59];

  // Header Banner
  doc.setFillColor(...navyColor);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PEHI — Hospital Management & Happiness Report', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${payload.hospital.name} | Period: ${payload.dateRangeLabel}`, 14, 20);

  const generatedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  doc.text(`Generated: ${generatedDate}`, 155, 20);

  // Executive Summary Section
  let curY = 36;
  doc.setTextColor(...navyColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive KPI Summary', 14, curY);

  curY += 6;

  // KPI boxes
  const boxWidth = 43;
  const boxHeight = 22;
  const kpis = [
    { label: 'Overall PEHI', val: `${payload.overallPEHI.toFixed(1)} / 100`, highlight: payload.overallPEHI >= 60 ? '#059669' : '#dc2626' },
    { label: 'Total Reviews', val: `${payload.totalReviews}`, highlight: '#0284c7' },
    { label: 'Unmarked / New', val: `${payload.unmarkedCount}`, highlight: '#d97706' },
    { label: 'Actioned (Done)', val: `${payload.doneCount}`, highlight: '#10b981' },
  ];

  kpis.forEach((kpi, idx) => {
    const x = 14 + idx * (boxWidth + 4);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, curY, boxWidth, boxHeight, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 4, curY + 6);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navyColor);
    doc.text(kpi.val, x + 4, curY + 16);
  });

  curY += boxHeight + 8;

  // 2. Six Dimensions
  doc.setTextColor(...navyColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Patient Experience Dimension Scores', 14, curY);
  curY += 4;

  const dimensionTableData = [
    ['Clinical Care & Confidence (Q1–4)', '25%', `${payload.dimensionScores.clinicalCare.toFixed(1)}`, payload.dimensionScores.clinicalCare >= 60 ? 'Satisfactory' : 'Action Needed'],
    ['Nursing & Staff Behaviour (Q5–8)', '20%', `${payload.dimensionScores.nursingStaff.toFixed(1)}`, payload.dimensionScores.nursingStaff >= 60 ? 'Satisfactory' : 'Action Needed'],
    ['Communication & Clarity (Q9–11)', '15%', `${payload.dimensionScores.communication.toFixed(1)}`, payload.dimensionScores.communication >= 60 ? 'Satisfactory' : 'Action Needed'],
    ['Comfort & Facilities (Q12–14)', '15%', `${payload.dimensionScores.comfortFacilities.toFixed(1)}`, payload.dimensionScores.comfortFacilities >= 60 ? 'Satisfactory' : 'Action Needed'],
    ['Service Efficiency (Q15–17)', '10%', `${payload.dimensionScores.serviceEfficiency.toFixed(1)}`, payload.dimensionScores.serviceEfficiency >= 60 ? 'Satisfactory' : 'Action Needed'],
    ['Happiness & Loyalty (Q18–20)', '15%', `${payload.dimensionScores.happinessLoyalty.toFixed(1)}`, payload.dimensionScores.happinessLoyalty >= 60 ? 'Satisfactory' : 'Action Needed'],
  ];

  autoTable(doc, {
    startY: curY,
    head: [['Dimension', 'Weight', 'Score (0–100)', 'Status']],
    body: dimensionTableData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: darkTextColor },
    margin: { left: 14, right: 14 }
  });

  curY = (doc as any).lastAutoTable.finalY + 8;

  // 3. Department Breakdown
  if (curY > 230) {
    doc.addPage();
    curY = 20;
  }

  doc.setTextColor(...navyColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Department Performance Breakdown', 14, curY);
  curY += 4;

  const deptData = payload.departments.slice(0, 10).map(d => [
    d.department,
    `${d.reviewsCount}`,
    `${d.pehi.toFixed(1)}`,
    `${d.clinicalCare.toFixed(1)}`,
    `${d.nursingStaff.toFixed(1)}`,
    `${d.communication.toFixed(1)}`,
    `${d.comfortFacilities.toFixed(1)}`,
    d.status
  ]);

  autoTable(doc, {
    startY: curY,
    head: [['Department', 'Reviews', 'PEHI', 'Clinical', 'Nursing', 'Comms', 'Comfort', 'Status']],
    body: deptData.length > 0 ? deptData : [['No department data available for this range', '-', '-', '-', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: navyColor, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: darkTextColor },
    margin: { left: 14, right: 14 }
  });

  curY = (doc as any).lastAutoTable.finalY + 8;

  // 4. Alerts & Recommendations
  if (curY > 230) {
    doc.addPage();
    curY = 20;
  }

  doc.setTextColor(...navyColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Improvement Alerts & Areas of Concern', 14, curY);
  curY += 4;

  const alertData = payload.alerts.slice(0, 6).map(a => [
    a.type,
    a.entityName,
    `${a.score.toFixed(1)} / 100`,
    a.severity,
    a.message
  ]);

  autoTable(doc, {
    startY: curY,
    head: [['Level', 'Target Entity', 'Score', 'Severity', 'Recommended Action / Summary']],
    body: alertData.length > 0 ? alertData : [['All Clear', 'Hospital Wide', `${payload.overallPEHI.toFixed(1)}`, 'Good', 'No critical alerts active for the selected date range.']],
    theme: 'grid',
    headStyles: { fillColor: [225, 29, 72], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: darkTextColor },
    margin: { left: 14, right: 14 }
  });

  curY = (doc as any).lastAutoTable.finalY + 8;

  // 5. Qualitative Feedback Highlights
  if (curY > 220) {
    doc.addPage();
    curY = 20;
  }

  doc.setTextColor(...navyColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('5. Qualitative Patient Feedback Highlights', 14, curY);
  curY += 4;

  const feedbackWithComments = payload.recentReviews.filter(r => r.comment && r.comment.trim().length > 0).slice(0, 8);
  const commentRows = feedbackWithComments.map(r => [
    r.submissionDate.slice(0, 10),
    r.patientName,
    r.department,
    `${r.pehiScore.toFixed(1)} (${r.pehiClassification})`,
    r.comment || ''
  ]);

  autoTable(doc, {
    startY: curY,
    head: [['Date', 'Patient', 'Dept', 'PEHI', 'Patient Voice & Comments']],
    body: commentRows.length > 0 ? commentRows : [['-', 'No qualitative comments recorded for this period', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 7.5, textColor: darkTextColor },
    columnStyles: {
      4: { cellWidth: 80 }
    },
    margin: { left: 14, right: 14 }
  });

  // Footer on each page
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount} — Confidential Healthcare Management Report`, 14, 290);
    doc.text('PEHI Analytics Engine', 170, 290);
  }

  doc.save(`PEHI_Report_${payload.hospital.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
