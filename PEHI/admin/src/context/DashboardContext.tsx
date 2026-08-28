import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  PatientFeedback, 
  UserRole, 
  ReviewStatus, 
  FilterState, 
  HospitalProfile, 
  ThresholdSettings, 
  DepartmentStat, 
  WardStat, 
  AlertItem 
} from '../types';
import { 
  getDb, 
  isFirebaseConfigured, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs 
} from '../firebase';
import { getFirebaseAuth } from '../firebase';
import { 
  calculateReviewScores, 
  aggregateReviews, 
  aggregateByDepartment, 
  aggregateByWard, 
  generateAlerts 
} from '../utils/pehiCalculator';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface DashboardContextType {
  hospitalId: string;
  hospital: HospitalProfile;
  userRole: UserRole;
  userEmail: string;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Data
  rawReviews: PatientFeedback[];
  filteredReviews: PatientFeedback[];
  loading: boolean;
  error: string | null;
  isFirebaseLive: boolean;
  
  // Aggregated
  metrics: ReturnType<typeof aggregateReviews>;
  departmentStats: DepartmentStat[];
  wardStats: WardStat[];
  alerts: AlertItem[];
  
  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Threshold Settings (Read-only / standard benchmark)
  thresholds: ThresholdSettings;
  
  // Actions
  updateReviewStatus: (reviewId: string, newStatus: ReviewStatus) => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  refreshData: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Navigation / Active View
  activePage: string;
  setActivePage: (page: string) => void;
  selectedReviewForDetail: PatientFeedback | null;
  setSelectedReviewForDetail: (review: PatientFeedback | null) => void;
  deleteConfirmTarget: PatientFeedback | null;
  setDeleteConfirmTarget: (review: PatientFeedback | null) => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  department: 'ALL',
  ward: 'ALL',
  patientCategory: 'ALL',
  status: 'ALL',
  pehiClassification: 'ALL',
  dateRange: 'all',
  startDate: '',
  endDate: ''
};

// System hospital identity configured from authenticated / environment context
const configuredHospitalId = (import.meta.env.VITE_HOSPITAL_ID as string) || 'hosp_A';
const configuredHospitalName = (import.meta.env.VITE_HOSPITAL_NAME as string) || 'St. Jude Apex Medical Center';

const defaultHospital: HospitalProfile = {
  id: configuredHospitalId,
  name: configuredHospitalName,
  tagline: 'Excellence in Clinical Care & Patient Satisfaction',
  primaryContact: 'director.quality@apexmedical.org',
  address: '742 Healthcare Parkway, Metro Health District'
};

const STANDARD_THRESHOLDS: ThresholdSettings = {
  pehiAlertThreshold: Number(import.meta.env.VITE_PEHI_ALERT_THRESHOLD) || 60,
  criticalThreshold: 40,
  needsAttentionThreshold: 60
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hospitalId] = useState<string>(configuredHospitalId);
  const [hospital] = useState<HospitalProfile>(defaultHospital);

  const [userRole] = useState<UserRole>('ADMIN');
  const [userEmail] = useState<string>(getFirebaseAuth()?.currentUser?.email || '');
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [selectedReviewForDetail, setSelectedReviewForDetail] = useState<PatientFeedback | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<PatientFeedback | null>(null);

  // Theme support (Always Light Mode)
  const theme: 'light' | 'dark' = 'light';
  const setTheme = useCallback((_newTheme: 'light' | 'dark') => {}, []);
  const toggleTheme = useCallback(() => {}, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pehi_dashboard_theme');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const [thresholds] = useState<ThresholdSettings>(STANDARD_THRESHOLDS);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [rawReviews, setRawReviews] = useState<PatientFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirebaseLive, setIsFirebaseLive] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Helper to parse Firestore documents safely and derive PEHI scores using real responses
  const parseFirestoreDocument = useCallback((docId: string, data: any): PatientFeedback => {
    const responses: { [key: string]: number } = data.responses || data.answers || data.ratings || {};
    
    // Support top-level questions q1..q20 if present
    for (let i = 1; i <= 20; i++) {
      if (data[`q${i}`] !== undefined && responses[`q${i}`] === undefined) {
        responses[`q${i}`] = Number(data[`q${i}`]);
      }
      if (data[`Q${i}`] !== undefined && responses[`q${i}`] === undefined) {
        responses[`q${i}`] = Number(data[`Q${i}`]);
      }
    }

    const { dimensionScores, pehiScore, pehiClassification } = calculateReviewScores(responses);

    const subDate = data.submissionDate || 
      (data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : 
      (data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString()));

    return {
      id: docId,
      hospitalId: data.hospitalId || hospitalId,
      patientName: data.patientName || data.name || 'Anonymous Patient',
      age: data.age,
      email: data.email,
      phone: data.phone,
      department: data.department || 'General',
      ward: data.ward || 'Main Ward',
      patientCategory: data.patientCategory || data.category || 'Inpatient',
      submissionDate: subDate,
      timestamp: data.timestamp || new Date(subDate).getTime(),
      status: String(data.status || 'UNMARKED').toUpperCase() as ReviewStatus,
      comment: data.comment || data.feedback || data.notes || '',
      responses,
      pehiScore: data.pehiScore !== undefined ? Number(data.pehiScore) : pehiScore,
      pehiClassification: data.pehiClassification || pehiClassification,
      dimensionScores: data.dimensionScores || dimensionScores,
      markedBy: data.markedBy,
      markedAt: data.markedAt,
      notes: data.notes
    };
  }, [hospitalId]);

  // Subscribe to real Firestore 'feedback' collection
  useEffect(() => {
    setLoading(true);
    setError(null);

    const isConfigured = isFirebaseConfigured();
    const db = getDb();

    if (isConfigured && db) {
      try {
        setIsFirebaseLive(true);
        const feedbackRef = collection(db, 'feedback');
        const q = query(feedbackRef, where('hospitalId', '==', hospitalId));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const docsList: PatientFeedback[] = [];
            snapshot.forEach(docSnap => {
              const data = docSnap.data();
              docsList.push(parseFirestoreDocument(docSnap.id, data));
            });

            // Sort newest first
            docsList.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
            setRawReviews(docsList);
            setLoading(false);
          },
          (err) => {
            console.error('Firestore subscription error:', err);
            setError(`Unable to load hospital feedback: ${err.message}`);
            setIsFirebaseLive(false);
            setRawReviews([]);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (err: any) {
        console.error('Firebase setup failed:', err);
        setError(`Unable to connect to Firestore: ${err.message}`);
        setIsFirebaseLive(false);
        setRawReviews([]);
        setLoading(false);
      }
    } else {
      // Firebase not configured yet
      setIsFirebaseLive(false);
      setRawReviews([]);
      setLoading(false);
    }
  }, [hospitalId, parseFirestoreDocument]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return rawReviews.filter(review => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = review.patientName.toLowerCase().includes(q);
        const matchesDept = review.department.toLowerCase().includes(q);
        const matchesWard = (review.ward || '').toLowerCase().includes(q);
        const matchesComment = (review.comment || '').toLowerCase().includes(q);
        const matchesEmail = (review.email || '').toLowerCase().includes(q);
        const matchesId = review.id.toLowerCase().includes(q);
        if (!matchesName && !matchesDept && !matchesWard && !matchesComment && !matchesEmail && !matchesId) {
          return false;
        }
      }

      // Department
      if (filters.department !== 'ALL' && review.department !== filters.department) {
        return false;
      }

      // Ward
      if (filters.ward !== 'ALL' && review.ward !== filters.ward) {
        return false;
      }

      // Patient Category
      if (filters.patientCategory !== 'ALL' && review.patientCategory !== filters.patientCategory) {
        return false;
      }

      // Status
      if (filters.status !== 'ALL' && review.status !== filters.status) {
        return false;
      }

      // PEHI Classification
      if (filters.pehiClassification !== 'ALL' && review.pehiClassification !== filters.pehiClassification) {
        return false;
      }

      // Date Range
      if (filters.dateRange !== 'all') {
        const reviewDate = new Date(review.submissionDate);
        const now = new Date();

        if (filters.dateRange === 'today') {
          const todayStr = now.toISOString().slice(0, 10);
          if (review.submissionDate.slice(0, 10) !== todayStr) return false;
        } else if (filters.dateRange === '7days') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (reviewDate < sevenDaysAgo) return false;
        } else if (filters.dateRange === '30days') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (reviewDate < thirtyDaysAgo) return false;
        } else if (filters.dateRange === 'this_month') {
          const thisMonthPrefix = now.toISOString().slice(0, 7);
          if (!review.submissionDate.startsWith(thisMonthPrefix)) return false;
        } else if (filters.dateRange === 'this_year') {
          const thisYearPrefix = `${now.getFullYear()}`;
          if (!review.submissionDate.startsWith(thisYearPrefix)) return false;
        } else if (filters.dateRange === 'custom') {
          if (filters.startDate && new Date(review.submissionDate) < new Date(filters.startDate)) {
            return false;
          }
          if (filters.endDate && new Date(review.submissionDate) > new Date(filters.endDate + 'T23:59:59')) {
            return false;
          }
        }
      }

      return true;
    });
  }, [rawReviews, filters]);

  // Aggregated KPIs & Charts from filtered reviews
  const metrics = useMemo(() => {
    return aggregateReviews(filteredReviews);
  }, [filteredReviews]);

  const departmentStats = useMemo(() => {
    return aggregateByDepartment(filteredReviews);
  }, [filteredReviews]);

  const wardStats = useMemo(() => {
    return aggregateByWard(filteredReviews);
  }, [filteredReviews]);

  const alerts = useMemo(() => {
    return generateAlerts(
      filteredReviews, 
      thresholds.pehiAlertThreshold, 
      thresholds.criticalThreshold
    );
  }, [filteredReviews, thresholds]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Update Review Status (Unmarked -> Marked -> Done) in real Firestore
  const updateReviewStatus = async (reviewId: string, newStatus: ReviewStatus): Promise<boolean> => {
    try {
      const db = getDb();
      if (isFirebaseConfigured() && db) {
        const reviewRef = doc(db, 'feedback', reviewId);
        await updateDoc(reviewRef, {
          status: newStatus,
          markedBy: userEmail,
          markedAt: new Date().toISOString()
        });
      }

      // Optimistically update state
      setRawReviews(prev => prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            status: newStatus,
            markedBy: userEmail,
            markedAt: new Date().toISOString()
          };
        }
        return r;
      }));

      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Review status changed to ${newStatus}.`
      });
      return true;
    } catch (err: any) {
      console.error('Failed to update review status in Firestore:', err);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Unable to update review status in Firestore.'
      });
      return false;
    }
  };

  // Delete Review (Authorized Hospital Administrator only)
  const deleteReview = async (reviewId: string): Promise<boolean> => {
    try {
      const db = getDb();
      if (isFirebaseConfigured() && db) {
        const reviewRef = doc(db, 'feedback', reviewId);
        await deleteDoc(reviewRef);
      }

      setRawReviews(prev => prev.filter(r => r.id !== reviewId));

      addToast({
        type: 'success',
        title: 'Review Deleted',
        message: 'The patient review record has been permanently removed.'
      });
      return true;
    } catch (err: any) {
      console.error('Failed to delete review:', err);
      addToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err.message || 'Could not remove document from Firestore.'
      });
      return false;
    }
  };

  // Manual refresh from Firestore
  const refreshData = useCallback(() => {
    setLoading(true);
    const db = getDb();
    if (isFirebaseConfigured() && db) {
      const feedbackRef = collection(db, 'feedback');
      const q = query(feedbackRef, where('hospitalId', '==', hospitalId));
      getDocs(q).then(snapshot => {
        const docsList: PatientFeedback[] = [];
        snapshot.forEach(docSnap => {
          docsList.push(parseFirestoreDocument(docSnap.id, docSnap.data()));
        });
        docsList.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
        setRawReviews(docsList);
        setLoading(false);
        addToast({ type: 'success', title: 'Data Refreshed', message: 'Loaded latest records from Firestore.' });
      }).catch(err => {
        setError(`Unable to refresh data: ${err.message}`);
        setLoading(false);
      });
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [hospitalId, parseFirestoreDocument, addToast]);

  return (
    <DashboardContext.Provider value={{
      hospitalId,
      hospital,
      userRole,
      userEmail,
      theme,
      setTheme,
      toggleTheme,
      rawReviews,
      filteredReviews,
      loading,
      error,
      isFirebaseLive,
      metrics,
      departmentStats,
      wardStats,
      alerts,
      filters,
      setFilters,
      resetFilters,
      thresholds,
      updateReviewStatus,
      deleteReview,
      refreshData,
      toasts,
      addToast,
      removeToast,
      activePage,
      setActivePage,
      selectedReviewForDetail,
      setSelectedReviewForDetail,
      deleteConfirmTarget,
      setDeleteConfirmTarget
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
