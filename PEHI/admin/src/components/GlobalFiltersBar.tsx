import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const GlobalFiltersBar: React.FC = () => {
  const { filters, setFilters, resetFilters, rawReviews } = useDashboard();

  // Extract unique departments and wards from data
  const availableDepartments = Array.from(new Set(rawReviews.map(r => r.department).filter(Boolean))).sort();
  const availableWards = Array.from(new Set(
    rawReviews
      .filter(r => filters.department === 'ALL' || r.department === filters.department)
      .map(r => r.ward)
      .filter(Boolean)
  )).sort() as string[];

  const isFiltered = 
    filters.department !== 'ALL' || 
    filters.ward !== 'ALL' || 
    filters.patientCategory !== 'ALL' || 
    filters.status !== 'ALL' || 
    filters.pehiClassification !== 'ALL' || 
    filters.searchQuery.trim().length > 0 ||
    filters.dateRange !== 'all';

  return (
    <div className="bg-white dark:bg-[#182230] rounded-lg border border-slate-200 dark:border-[#2A3748] shadow-2xs p-2.5 mb-4 transition-colors duration-150">
      <div className="flex flex-wrap items-center justify-between gap-2">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400 dark:text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search patient, doctor, comment, or ID..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 dark:bg-[#151F2D] text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#6B7280] border border-slate-200 dark:border-[#2A3748] rounded-md focus:outline-none focus:ring-1.5 focus:ring-teal-500 focus:bg-white dark:focus:bg-[#151F2D] transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-1.5">
          
          {/* Department Filter */}
          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, ward: 'ALL' }))}
            className="text-xs bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748] text-slate-700 dark:text-[#CBD5E1] rounded-md px-2 py-1 focus:outline-none focus:ring-1.5 focus:ring-teal-500 font-medium cursor-pointer"
          >
            <option value="ALL" className="dark:bg-[#182230] dark:text-[#F3F4F6]">All Departments</option>
            {availableDepartments.map(dept => (
              <option key={dept} value={dept} className="dark:bg-[#182230] dark:text-[#F3F4F6]">{dept}</option>
            ))}
          </select>

          {/* Ward Filter */}
          <select
            value={filters.ward}
            onChange={(e) => setFilters(prev => ({ ...prev, ward: e.target.value }))}
            className="text-xs bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748] text-slate-700 dark:text-[#CBD5E1] rounded-md px-2 py-1 focus:outline-none focus:ring-1.5 focus:ring-teal-500 font-medium cursor-pointer"
          >
            <option value="ALL" className="dark:bg-[#182230] dark:text-[#F3F4F6]">All Wards</option>
            {availableWards.map(w => (
              <option key={w} value={w} className="dark:bg-[#182230] dark:text-[#F3F4F6]">{w}</option>
            ))}
          </select>

          {/* Patient Category */}
          <select
            value={filters.patientCategory}
            onChange={(e) => setFilters(prev => ({ ...prev, patientCategory: e.target.value }))}
            className="text-xs bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748] text-slate-700 dark:text-[#CBD5E1] rounded-md px-2 py-1 focus:outline-none focus:ring-1.5 focus:ring-teal-500 font-medium cursor-pointer"
          >
            <option value="ALL" className="dark:bg-[#182230] dark:text-[#F3F4F6]">All Categories</option>
            <option value="Inpatient" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Inpatient</option>
            <option value="Outpatient" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Outpatient</option>
            <option value="Emergency" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Emergency</option>
            <option value="Day Care" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Day Care</option>
            <option value="Maternity" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Maternity</option>
          </select>

          {/* PEHI Range */}
          <select
            value={filters.pehiClassification}
            onChange={(e) => setFilters(prev => ({ ...prev, pehiClassification: e.target.value }))}
            className="text-xs bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748] text-slate-700 dark:text-[#CBD5E1] rounded-md px-2 py-1 focus:outline-none focus:ring-1.5 focus:ring-teal-500 font-medium cursor-pointer"
          >
            <option value="ALL" className="dark:bg-[#182230] dark:text-[#F3F4F6]">All PEHI Ranges</option>
            <option value="Excellent" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Excellent (80–100)</option>
            <option value="Good" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Good (60–79.9)</option>
            <option value="Needs Improvement" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Needs Improvement (40–59.9)</option>
            <option value="Critical" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Critical (&lt; 40)</option>
          </select>

          {/* Review Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="text-xs bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748] text-slate-700 dark:text-[#CBD5E1] rounded-md px-2 py-1 focus:outline-none focus:ring-1.5 focus:ring-teal-500 font-medium cursor-pointer"
          >
            <option value="ALL" className="dark:bg-[#182230] dark:text-[#F3F4F6]">All Review Statuses</option>
            <option value="UNMARKED" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Unmarked (New)</option>
            <option value="MARKED" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Marked (In Review)</option>
            <option value="DONE" className="dark:bg-[#182230] dark:text-[#F3F4F6]">Done (Resolved)</option>
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 text-xs px-2 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/70 rounded-md font-medium border border-rose-200 dark:border-rose-800 transition"
              title="Reset all active filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
