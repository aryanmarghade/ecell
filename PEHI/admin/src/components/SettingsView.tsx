import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Bell, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Sliders, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Info, 
  Clock, 
  Sparkles, 
  Monitor 
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const SettingsView: React.FC = () => {
  const { 
    hospital, 
    userRole, 
    userEmail,
    thresholds,
    filters,
    setFilters,
    addToast 
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<'preferences' | 'notifications' | 'account'>('preferences');

  // User-level operational preferences
  const [audioAlerts, setAudioAlerts] = useState<boolean>(() => {
    return localStorage.getItem('pehi_pref_audio_alerts') === 'true';
  });

  const [criticalOnlyAlerts, setCriticalOnlyAlerts] = useState<boolean>(() => {
    return localStorage.getItem('pehi_pref_critical_only') === 'true';
  });

  const [autoRefreshInterval, setAutoRefreshInterval] = useState<string>(() => {
    return localStorage.getItem('pehi_pref_refresh_interval') || 'realtime';
  });

  const handleToggleAudio = () => {
    const next = !audioAlerts;
    setAudioAlerts(next);
    localStorage.setItem('pehi_pref_audio_alerts', String(next));
    addToast({
      type: 'info',
      title: 'Preferences Saved',
      message: `Audio alert chimes ${next ? 'enabled' : 'disabled'}.`
    });
  };

  const handleToggleCriticalOnly = () => {
    const next = !criticalOnlyAlerts;
    setCriticalOnlyAlerts(next);
    localStorage.setItem('pehi_pref_critical_only', String(next));
    addToast({
      type: 'info',
      title: 'Alert Filter Updated',
      message: next ? 'Notification badge will prioritize Critical alerts.' : 'Notification badge will alert on all performance triggers.'
    });
  };

  const handleSaveRefresh = (interval: string) => {
    setAutoRefreshInterval(interval);
    localStorage.setItem('pehi_pref_refresh_interval', interval);
    addToast({
      type: 'success',
      title: 'Data Polling Updated',
      message: interval === 'realtime' ? 'Real-time Firestore listeners active.' : `Auto-poll set to ${interval}.`
    });
  };

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-3.5 flex items-center justify-between transition-colors duration-150">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] text-teal-700 dark:text-[#2DD4BF] rounded-lg border border-teal-200 dark:border-[rgba(20,184,166,0.30)]">
            <Settings className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
              Hospital Administrator Preferences
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
              Personal workspace settings, visual themes, notification alerts, and facility credentials
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-[#2A3748] space-x-1">
        {[
          { id: 'preferences', label: 'Appearance & Display', icon: Monitor },
          { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
          { id: 'account', label: 'Facility & Account Profile', icon: Building2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold border-b-2 transition ${
                isActive 
                  ? 'border-teal-600 dark:border-[#14B8A6] text-teal-700 dark:text-[#2DD4BF] bg-white dark:bg-[#182230] rounded-t-md' 
                  : 'border-transparent text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-[#F3F4F6]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Appearance & Display */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-4 transition-colors duration-150">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Hospital Display Configuration</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Standard clinical daylight layout optimized for high-density hospital administrative monitoring.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-teal-200 bg-teal-50/50 flex items-center space-x-3 max-w-lg">
            <div className="p-2 rounded-md bg-white text-teal-700 border border-teal-200">
              <Sun className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Clinical Light Theme Active</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                High-contrast daylight clinical palette with slate borders and teal accents.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Default Date Range Filter</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Set which review period is displayed when opening the dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: "Today's Feedback" },
                { id: '7days', label: 'Last 7 Days' },
                { id: '30days', label: 'Last 30 Days' },
                { id: 'this_month', label: 'This Month' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFilters(prev => ({ ...prev, dateRange: opt.id as any }))}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                    filters.dateRange === opt.id
                      ? 'bg-teal-600 dark:bg-[#0D9488] text-white border-teal-600 dark:border-[#0D9488]'
                      : 'bg-slate-50 dark:bg-[#151F2D] text-slate-700 dark:text-[#CBD5E1] border-slate-200 dark:border-[#2A3748] hover:bg-slate-100 dark:hover:bg-[#1D2938]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Alerts & Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] p-4 shadow-2xs space-y-4 transition-colors duration-150">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">Quality Alert Notification Preferences</h3>
            <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
              Configure how automated clinical and operational alerts are flagged in your active session.
            </p>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-[#263244]">
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-[#F3F4F6]">
                  Critical Score Audio Chime
                </span>
                <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                  Plays a subtle acoustic chime when an incoming patient review scores below 40.0 (Critical).
                </p>
              </div>
              <button
                onClick={handleToggleAudio}
                className={`p-2 rounded-md border transition ${
                  audioAlerts 
                    ? 'bg-teal-50 dark:bg-[rgba(20,184,166,0.15)] border-teal-300 dark:border-[rgba(20,184,166,0.30)] text-teal-700 dark:text-[#2DD4BF]' 
                    : 'bg-slate-100 dark:bg-[#151F2D] border-slate-200 dark:border-[#2A3748] text-slate-400 dark:text-[#94A3B8]'
                }`}
              >
                {audioAlerts ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-[#F3F4F6]">
                  Prioritize Critical Alerts in Header
                </span>
                <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                  Only show the pulsing notification indicator when critical department/ward alerts exist.
                </p>
              </div>
              <input
                type="checkbox"
                checked={criticalOnlyAlerts}
                onChange={handleToggleCriticalOnly}
                className="h-4 w-4 text-teal-600 dark:text-[#14B8A6] rounded focus:ring-teal-500 cursor-pointer bg-white dark:bg-[#151F2D] border-slate-300 dark:border-[#2A3748]"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-[#F3F4F6]">
                  Data Stream Synchronization
                </span>
                <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                  Live real-time Firestore listeners keep dashboard KPIs instantly synchronized.
                </p>
              </div>
              <select
                value={autoRefreshInterval}
                onChange={(e) => handleSaveRefresh(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748] text-slate-700 dark:text-[#F3F4F6] rounded-md px-2 py-1 focus:outline-none"
              >
                <option value="realtime">Real-time (Firestore onSnapshot)</option>
                <option value="30s">Poll every 30s</option>
                <option value="60s">Poll every 1m</option>
                <option value="manual">Manual Refresh Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Facility & Account Profile (Read-Only) */}
      {activeTab === 'account' && (
        <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] p-4 shadow-2xs space-y-4 transition-colors duration-150">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">Facility System Identity & Authorization</h3>
              <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                Hospital identity and credentials derived from authenticated tenant environment
              </p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-[rgba(34,197,94,0.15)] text-emerald-700 dark:text-[#86EFAC] border border-emerald-200 dark:border-[rgba(34,197,94,0.30)] rounded-md text-[10px] font-bold">
              ● Authenticated Session
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 dark:bg-[#151F2D] rounded-md border border-slate-200 dark:border-[#2A3748]">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-[#94A3B8] uppercase tracking-wider">Hospital Facility</span>
              <p className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] mt-0.5">{hospital.name}</p>
              <div className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-1 font-mono">
                hospitalId: <span className="font-semibold text-slate-700 dark:text-[#CBD5E1]">{hospital.id}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#151F2D] rounded-md border border-slate-200 dark:border-[#2A3748]">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-[#94A3B8] uppercase tracking-wider">Administrator Account</span>
              <p className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] mt-0.5">{userEmail}</p>
              <div className="text-[10px] text-teal-600 dark:text-[#2DD4BF] mt-1 font-semibold flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Role: {userRole} (Authorized Admin)</span>
              </div>
            </div>
          </div>

          {/* PEHI Standard Benchmarks Info Box */}
          <div className="p-3 bg-teal-50/50 dark:bg-[rgba(20,184,166,0.10)] rounded-md border border-teal-200 dark:border-[rgba(20,184,166,0.25)] text-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-teal-900 dark:text-[#5EEAD4] font-bold text-[11px]">
              <Info className="h-3.5 w-3.5 text-teal-700 dark:text-[#2DD4BF]" />
              <span>Standard PEHI Healthcare Benchmark Framework</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
              PEHI index scores are weighted: Clinical Care (25%), Nursing Behaviour (20%), Communication (15%), Comfort & Facilities (15%), Service Efficiency (10%), Happiness & Loyalty (15%).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-1.5 bg-white dark:bg-[#182230] rounded border border-rose-200 dark:border-[rgba(239,68,68,0.30)] text-center">
                <div className="text-[9px] font-bold text-rose-600 dark:text-[#FCA5A5]">0 – 39.9</div>
                <div className="text-[9px] text-slate-500 dark:text-[#94A3B8]">Critical</div>
              </div>
              <div className="p-1.5 bg-white dark:bg-[#182230] rounded border border-amber-200 dark:border-[rgba(245,158,11,0.30)] text-center">
                <div className="text-[9px] font-bold text-amber-600 dark:text-[#FCD34D]">40.0 – 59.9</div>
                <div className="text-[9px] text-slate-500 dark:text-[#94A3B8]">Needs Attention</div>
              </div>
              <div className="p-1.5 bg-white dark:bg-[#182230] rounded border border-teal-200 dark:border-[rgba(20,184,166,0.30)] text-center">
                <div className="text-[9px] font-bold text-teal-600 dark:text-[#2DD4BF]">60.0 – 79.9</div>
                <div className="text-[9px] text-slate-500 dark:text-[#94A3B8]">Good</div>
              </div>
              <div className="p-1.5 bg-white dark:bg-[#182230] rounded border border-emerald-200 dark:border-[rgba(34,197,94,0.30)] text-center">
                <div className="text-[9px] font-bold text-emerald-600 dark:text-[#86EFAC]">80.0 – 100.0</div>
                <div className="text-[9px] text-slate-500 dark:text-[#94A3B8]">Excellent</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
