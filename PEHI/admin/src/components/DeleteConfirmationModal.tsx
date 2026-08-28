import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const DeleteConfirmationModal: React.FC = () => {
  const { deleteConfirmTarget, setDeleteConfirmTarget, deleteReview, userRole } = useDashboard();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!deleteConfirmTarget) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await deleteReview(deleteConfirmTarget.id);
    setIsDeleting(false);
    setDeleteConfirmTarget(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3">
      <div className="bg-white dark:bg-[#182230] rounded-lg max-w-sm w-full p-4 shadow-xl border border-slate-200 dark:border-[#2A3748] animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Warning Icon */}
        <div className="mx-auto h-9 w-9 rounded-full bg-rose-100 dark:bg-[rgba(239,68,68,0.20)] flex items-center justify-center text-rose-600 dark:text-[#FCA5A5] mb-2.5">
          <AlertTriangle className="h-4.5 w-4.5" />
        </div>

        {/* Title and Confirmation text */}
        <div className="text-center">
          <h3 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
            Delete this patient review?
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Deleting this review cannot be undone. This record will be permanently removed from the hospital Firestore collection.
          </p>
        </div>

        {/* Patient Review Summary Snapshot */}
        <div className="my-3 p-2.5 rounded-md bg-slate-50 dark:bg-[#151F2D] border border-slate-200 dark:border-[#2A3748] text-xs text-left">
          <div className="flex justify-between text-slate-700 dark:text-[#F3F4F6] font-semibold text-xs">
            <span>{deleteConfirmTarget.patientName}</span>
            <span className="text-teal-700 dark:text-[#2DD4BF] font-bold">PEHI: {deleteConfirmTarget.pehiScore.toFixed(1)}</span>
          </div>
          <div className="text-slate-500 dark:text-[#94A3B8] text-[10px] mt-0.5">
            Dept: {deleteConfirmTarget.department} &bull; Ward: {deleteConfirmTarget.ward || 'N/A'}
          </div>
          <div className="text-slate-400 dark:text-[#6B7280] text-[9px] mt-0.5 font-mono">
            ID: {deleteConfirmTarget.id}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mt-4">
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => setDeleteConfirmTarget(null)}
            className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-[#151F2D] hover:bg-slate-200 dark:hover:bg-[#1D2938] text-slate-700 dark:text-[#CBD5E1] border dark:border-[#2A3748] font-semibold rounded-md text-xs transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting || userRole !== 'ADMIN'}
            onClick={handleConfirm}
            className="flex-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md text-xs transition flex items-center justify-center space-x-1 shadow-2xs disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Review</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
