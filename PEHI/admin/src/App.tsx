import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { DepartmentAnalytics } from './components/DepartmentAnalytics';
import { WardAnalytics } from './components/WardAnalytics';
import { PatientReviews } from './components/PatientReviews';
import { AnalyticsView } from './components/AnalyticsView';
import { AlertsView } from './components/AlertsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { ReviewDetailModal } from './components/ReviewDetailModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { activePage, selectedReviewForDetail, setSelectedReviewForDetail } = useDashboard();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden font-sans antialiased selection:bg-teal-600 selection:text-white bg-[#f8fafc] text-[#334155]">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header setMobileOpen={setMobileOpen} />

        {/* Scrollable Page Body - High Density Layout */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto pb-8 space-y-4">
            {activePage === 'dashboard' && <DashboardOverview />}
            {activePage === 'departments' && <DepartmentAnalytics />}
            {activePage === 'wards' && <WardAnalytics />}
            {activePage === 'reviews' && <PatientReviews />}
            {activePage === 'analytics' && <AnalyticsView />}
            {activePage === 'alerts' && <AlertsView />}
            {activePage === 'reports' && <ReportsView />}
            {activePage === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Modals & Overlays */}
      <ReviewDetailModal 
        review={selectedReviewForDetail} 
        onClose={() => setSelectedReviewForDetail(null)} 
      />
      <DeleteConfirmationModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <MainContent />
    </DashboardProvider>
  );
}
