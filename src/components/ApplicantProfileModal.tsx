import React from 'react';
import { 
  X, CheckCircle2, Shield, Star, Award, Briefcase, MapPin, Calendar, 
  UserCheck, ExternalLink, ThumbsUp, ThumbsDown, Sparkles, AlertCircle 
} from 'lucide-react';
import { JobApplicant, JobListing } from '../types';
import { formatVND } from '../utils/formatters';

interface ApplicantProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: JobApplicant | null;
  job: JobListing | null;
  onAcceptApplicant: (jobId: string, applicant: JobApplicant) => void;
  onRejectApplicant: (jobId: string, applicantId: string) => void;
}

export const ApplicantProfileModal: React.FC<ApplicantProfileModalProps> = ({
  isOpen,
  onClose,
  applicant,
  job,
  onAcceptApplicant,
  onRejectApplicant
}) => {
  if (!isOpen || !applicant || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={applicant.avatar}
                  alt={applicant.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                />
                {applicant.isIdentityVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-slate-900" title="CCCD Chip Verified">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-lg text-white leading-tight">
                    {applicant.name}
                  </h3>
                  {applicant.isProPass && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold font-mono flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950" />
                      PRO WORKER ⭐
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {applicant.rating} ({applicant.reviewCount} reviews)
                  </span>
                  <span>•</span>
                  <span className="text-emerald-300 font-semibold">
                    {applicant.completedJobsCount} jobs completed
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {/* Target Job Reference Box */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-blue-900 font-bold uppercase tracking-wider font-mono">Job Applied For</span>
              <span className="font-mono font-bold text-emerald-800">{formatVND(job.payVND)} Net Payout</span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{job.title}</h4>
            <div className="text-[11px] text-slate-600 flex items-center gap-3 pt-1">
              <span>{job.category}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span className="font-mono text-emerald-700 font-semibold">4% Escrow Fee Pre-Funded</span>
            </div>
          </div>

          {/* Applicant Pitch Note */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Applicant Proposal & Pitch
            </label>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700 font-medium">
              "{applicant.pitchNote}"
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Applied {applicant.appliedAt}</span>
              {applicant.status === 'ACCEPTED' ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hired & Contract Started
                </span>
              ) : applicant.status === 'REJECTED' ? (
                <span className="text-red-600 font-bold">Declined</span>
              ) : (
                <span className="text-blue-600 font-bold">Pending Your Decision</span>
              )}
            </div>
          </div>

          {/* Verification & Trust Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Identity Check</span>
              <div className="font-bold text-emerald-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                CCCD Chip
              </div>
              <span className="text-[10px] text-slate-400">Verified by JOBSAFE</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Success Rate</span>
              <div className="font-bold text-slate-900">98.5%</div>
              <span className="text-[10px] text-emerald-600 font-semibold">128/130 on time</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase block">Dispute Rate</span>
              <div className="font-bold text-slate-900">0.0%</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Zero chargebacks</span>
            </div>
          </div>

          {/* Skill & Badges */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Verified Badges & Accreditations
            </label>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Identity & Bank Verified
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[11px] flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                Top Rated Fashion Specialist
              </span>
              <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-semibold text-[11px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Fast 2-Hour Delivery Track
              </span>
            </div>
          </div>

          {/* Safe Escrow Assurance for Employer */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>JOBSAFE Upfront Escrow Protection</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              When you accept this worker, your pre-funded escrow ({formatVND(job.totalEmployerDepositVND || (job.payVND * 1.04))}) activates the milestone contract. Funds remain securely locked in the vault until you inspect and approve their proof deliverables.
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200/60 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {applicant.status !== 'REJECTED' && applicant.status !== 'ACCEPTED' && (
              <button
                type="button"
                onClick={() => {
                  onRejectApplicant(job.id, applicant.id);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            )}

            {applicant.status !== 'ACCEPTED' ? (
              <button
                type="button"
                id="accept-applicant-btn"
                onClick={() => {
                  onAcceptApplicant(job.id, applicant);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Start Contract</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Worker Already Hired</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
