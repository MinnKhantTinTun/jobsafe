import React from 'react';
import { 
  X, CheckCircle2, Shield, AlertTriangle, Users, Star, 
  ArrowRight, Check, Sparkles, Building, Lock
} from 'lucide-react';
import { JobApplicant, JobListing } from '../types';
import { formatVND } from '../utils/formatters';

interface HireConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmHire: (jobId: string, applicant: JobApplicant, autoRejectOthers: boolean) => void;
  job: JobListing | null;
  applicant: JobApplicant | null;
}

export const HireConfirmationModal: React.FC<HireConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmHire,
  job,
  applicant
}) => {
  if (!isOpen || !job || !applicant) return null;

  const otherPendingApplicants = (job.applicants || []).filter(
    a => a.id !== applicant.id && a.status === 'PENDING'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight text-white">
                  Confirm Hiring Decision
                </h3>
                <p className="text-xs text-slate-300">
                  Lock escrow vault & start milestone contract
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 text-xs">
          {/* Target Job Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Selected Task
            </div>
            <div className="font-extrabold text-slate-900 text-sm">{job.title}</div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-0.5">
              <span>{job.category}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span className="font-mono text-emerald-700 font-bold">{formatVND(job.payVND)} Net Payout</span>
            </div>
          </div>

          {/* Selected Candidate Card */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Worker to be Hired
            </label>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={applicant.avatar}
                    alt={applicant.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-400 shadow-sm"
                  />
                  {applicant.isIdentityVerified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-white">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">{applicant.name}</span>
                    {applicant.isProPass && (
                      <span className="px-1.5 py-0.2 rounded-sm bg-amber-400 text-slate-950 text-[9px] font-black font-mono">
                        PRO ⭐
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono mt-0.5">
                    <span className="text-amber-600 font-bold">★ {applicant.rating}</span>
                    <span>•</span>
                    <span>{applicant.completedJobsCount} jobs completed</span>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-[11px] flex items-center gap-1 shrink-0 shadow-xs">
                <Check className="w-3.5 h-3.5" />
                <span>HIRED</span>
              </div>
            </div>
          </div>

          {/* Auto-Reject Section */}
          {otherPendingApplicants.length > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300/80 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-xs text-amber-950">
                    Auto-Reject Other Candidates ({otherPendingApplicants.length})
                  </h4>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed mt-0.5">
                    Because this job only requires 1 worker, confirming will automatically notify and mark the remaining candidates as declined so they can apply to other jobs.
                  </p>
                </div>
              </div>

              {/* List of candidates who will be rejected */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                  Candidates to be auto-notified:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {otherPendingApplicants.map(other => (
                    <div
                      key={other.id}
                      className="p-2 rounded-xl bg-white/80 border border-amber-200 flex items-center gap-2 text-[11px]"
                    >
                      <img
                        src={other.avatar}
                        alt={other.name}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                      />
                      <div className="truncate flex-1">
                        <div className="font-bold text-slate-800 truncate">{other.name}</div>
                        <div className="text-[10px] text-red-600 font-semibold flex items-center gap-0.5">
                          <span>Auto-Reject</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-blue-700 shrink-0" />
              <p className="text-[11px] leading-relaxed">
                You are hiring the primary applicant for this task. The live milestone contract will activate immediately.
              </p>
            </div>
          )}

          {/* Upfront Escrow Security Note */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-blue-900" />
              <span>Escrow Vault Security Active</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your pre-funded escrow ({formatVND(job.totalEmployerDepositVND || Math.round(job.payVND * 1.04))}) remains securely held in escrow. Payout is only released after you inspect and approve deliverables.
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel / Keep Reviewing
          </button>

          <button
            type="button"
            id="confirm-hire-auto-reject-btn"
            onClick={() => {
              onConfirmHire(job.id, applicant, true);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>
              {otherPendingApplicants.length > 0 
                ? `Confirm Hire & Auto-Reject (${otherPendingApplicants.length}) Others`
                : 'Confirm Hire & Start Contract'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
