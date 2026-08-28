import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Calendar, 
  RotateCw, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { signOut } from '../auth/AuthGate';
import { getFirebaseAuth } from '../firebase';
import { useDashboard } from '../context/DashboardContext';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const { 
    hospital, 
    hospitalId, 
    filters, 
    setFilters, 
    loading, 
    refreshData, 
    isFirebaseLive,
    alerts,
    userRole,
    userEmail,
    setActivePage
  } = useDashboard();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleDateChange = (val: any) => {
    setFilters(prev => ({ ...prev, dateRange: val }));
  };

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-20 border-b shadow-xs bg-white border-slate-200 text-slate-900 transition-colors duration-150">
      <div className="px-3 sm:px-4 lg:px-5 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Mobile Toggle & Authenticated Hospital Header */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>

          {/* Hospital Identity Badge (Static / Secure Tenant) */}
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-md bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-xs shadow-2xs">
              🏥
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
                {hospital.name}
              </h1>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                <span className="font-mono bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-medium">
                  ID: {hospitalId}
                </span>
                <span>•</span>
                <span>Hospital Quality Management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Period Selector, Firebase Status, Notifications, Role Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          
          {/* Period Selector */}
          <div className="relative hidden md:flex items-center rounded-md p-0.5 border bg-slate-100/90 border-slate-200">
            <Calendar className="h-3 w-3 text-slate-400 ml-1.5 mr-1" />
            <select
              value={filters.dateRange}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-transparent text-[11px] font-medium pr-2 py-0.5 focus:outline-none cursor-pointer text-slate-700"
            >
              <option value="all">All Time Records</option>
              <option value="today">Today's Feedback</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={loading}
            title="Refresh Hospital Data from Firestore"
            className="p-1.5 rounded-md border transition disabled:opacity-50 text-slate-500 hover:text-teal-700 hover:bg-slate-100 border-slate-200"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-1.5 rounded-md border transition text-slate-600 hover:bg-slate-100 border-slate-200"
              aria-label="View alerts and notifications"
            >
              <Bell className="h-3.5 w-3.5" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-76 sm:w-84 rounded-lg shadow-xl border py-2 z-50 animate-in fade-in zoom-in-95 duration-150 bg-white border-slate-200 text-slate-900">
                <div className="px-3 pb-1.5 border-b flex items-center justify-between border-slate-100">
                  <div className="font-semibold text-xs flex items-center space-x-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span>Improvement Alerts ({alerts.length})</span>
                  </div>
                  <button 
                    onClick={() => { setActivePage('alerts'); setNotifDropdownOpen(false); }}
                    className="text-[10px] text-teal-600 hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {alerts.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-500">
                      No active alerts.
                    </div>
                  ) : (
                    alerts.slice(0, 5).map(alert => (
                      <div 
                        key={alert.id} 
                        className="p-2.5 transition cursor-pointer hover:bg-slate-50" 
                        onClick={() => { setActivePage('alerts'); setNotifDropdownOpen(false); }}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{alert.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            alert.severity === 'Critical' 
                              ? 'bg-rose-100 text-rose-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {alert.score.toFixed(1)} / 100
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge (Read-only Authenticated Staff) */}
          <div className="flex items-center space-x-1.5 pl-1.5 pr-2 py-1 rounded-md border select-none border-slate-200 bg-slate-50 text-slate-800">
            <div className="h-6 w-6 rounded-md bg-[#14B8A6] text-white font-bold text-[10px] flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight truncate max-w-[120px] text-slate-900">
                Hospital Administrator
              </div>
              <div className="text-[9px] text-slate-500 leading-tight">
                {userEmail}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Log out
          </button>

        </div>
      </div>
    </header>
  );
};
