import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Building2, 
  BedDouble, 
  MessageSquareText, 
  BellRing, 
  FileText, 
  Settings, 
  Activity,
  ShieldCheck,
  X
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activePage, setActivePage, alerts, metrics, hospital, userRole } = useDashboard();

  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' || a.severity === 'Needs Attention').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'wards', label: 'Wards', icon: BedDouble },
    { 
      id: 'reviews', 
      label: 'Patient Reviews', 
      icon: MessageSquareText,
      badge: metrics.unmarkedCount > 0 ? `${metrics.unmarkedCount} new` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { 
      id: 'alerts', 
      label: 'Alerts', 
      icon: BellRing,
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full text-xs transition-colors duration-150 bg-[#0f172a] text-slate-200 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#14B8A6] flex items-center justify-center text-white shadow-xs">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm tracking-tight text-[#F3F4F6]">PEHI</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded border bg-teal-900/70 text-teal-300 border-teal-700/60">
                HQ
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[130px]">
              Hospital Management
            </p>
          </div>
        </div>
        {mobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Hospital Context Pill */}
      <div className="px-3 py-2 border-b bg-slate-950/60 border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          <span>Hospital</span>
          <span className="text-[9px] px-1 rounded lowercase bg-slate-800 text-slate-300">
            {userRole.toLowerCase()}
          </span>
        </div>
        <p className="text-xs font-semibold text-[#F3F4F6] truncate mt-0.5" title={hospital.name}>
          {hospital.name}
        </p>
        <div className="flex items-center justify-between mt-0.5 text-[10px] text-slate-400 font-mono">
          <span>ID: <code className="text-slate-300 bg-slate-800/80 px-1 py-0.2 rounded">{hospital.id}</code></span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-2.5 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Role Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-full flex items-center justify-center font-semibold text-xs bg-slate-800 border border-slate-700 text-teal-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#F3F4F6] truncate">Executive Admin</p>
            <p className="text-[10px] text-slate-400 capitalize flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <span>Role: {userRole}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full h-full z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
