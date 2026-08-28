import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDashboard();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(t => {
        const isSuccess = t.type === 'success';
        const isWarning = t.type === 'warning' || t.type === 'error';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-lg border shadow-md flex items-start space-x-3 text-xs animate-in slide-in-from-bottom-5 duration-200 transition-colors ${
              isSuccess 
                ? 'bg-slate-900 dark:bg-[#182230] text-white border-slate-800 dark:border-[#2A3748]' 
                : isWarning 
                ? 'bg-rose-900 dark:bg-[#23151B] text-white border-rose-800 dark:border-[rgba(239,68,68,0.4)]' 
                : 'bg-teal-900 dark:bg-[#0F2327] text-white border-teal-800 dark:border-[rgba(20,184,166,0.4)]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-[#4ADE80]" />}
              {isWarning && <AlertTriangle className="h-4 w-4 text-rose-400 dark:text-[#F87171]" />}
              {t.type === 'info' && <Info className="h-4 w-4 text-teal-400 dark:text-[#2DD4BF]" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-100 dark:text-[#F3F4F6]">{t.title}</div>
              <p className="text-slate-300 dark:text-[#94A3B8] text-[11px] mt-0.5 leading-normal">{t.message}</p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 dark:text-[#94A3B8] hover:text-white p-1 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
