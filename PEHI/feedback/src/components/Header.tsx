import React from 'react';
import { Hospital, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  hospitalName?: string;
  hospitalId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  hospitalName = 'Apex General Hospital & Medical Centre',
  hospitalId,
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-2xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
            <Hospital className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {hospitalName}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Patient Feedback Portal
              {hospitalId && (
                <span className="text-slate-400 ml-1.5 font-normal">({hospitalId})</span>
              )}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Confidential</span>
        </div>
      </div>
    </header>
  );
};

