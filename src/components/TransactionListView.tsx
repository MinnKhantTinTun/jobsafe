import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, AlertTriangle, Clock, ArrowRight, 
  Search, Filter, CheckSquare, FileText, User, Building, 
  Lock, Sparkles, Check, ChevronRight, AlertCircle, RefreshCw,
  Info
} from 'lucide-react';
import { Transaction, UserRole, TabType } from '../types';
import { formatVND, calculateEscrowCommission } from '../utils/formatters';

interface TransactionListViewProps {
  transactions: Transaction[];
  role: UserRole;
  onSelectTransaction: (id: string) => void;
  onSwitchRole?: () => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const TransactionListView: React.FC<TransactionListViewProps> = ({
  transactions,
  role,
  onSelectTransaction,
  onSwitchRole,
  onNavigateTab
}) => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTION_NEEDED' | 'IN_PROGRESS' | 'POSTED_JOBS' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to determine whether action is required on a transaction for the active role
  const getActionRequiredInfo = (tx: Transaction, activeRole: UserRole) => {
    if (tx.status === 'COMPLETED' || tx.status === 'REFUNDED') {
      return { isActionRequired: false, reason: null };
    }

    const hasPendingProof = tx.proofFiles.some(f => !f.verificationStatus || f.verificationStatus === 'PENDING');
    const hasRevisionRequest = tx.proofFiles.some(f => f.verificationStatus === 'REVISION_REQUESTED');
    const allTasksCompleted = tx.checklist.every(c => c.completed);
    const unverifiedTasks = tx.checklist.some(c => !c.verifiedByEmployer);

    if (activeRole === 'employer') {
      if (tx.status === 'SUBMITTED' || hasPendingProof) {
        return {
          isActionRequired: true,
          reason: 'Worker submitted deliverables. Employer inspection & checklist verification requested.'
        };
      }
      if (tx.actionRequiredSide === 'employer' || tx.actionRequiredSide === 'both') {
        return {
          isActionRequired: true,
          reason: tx.actionRequiredText || 'Employer verification or response requested.'
        };
      }
    } else {
      // Worker role
      if (hasRevisionRequest) {
        return {
          isActionRequired: true,
          reason: 'Employer requested revision on deliverable files. Please review feedback and re-upload.'
        };
      }
      if (tx.actionRequiredSide === 'worker' || tx.actionRequiredSide === 'both') {
        return {
          isActionRequired: true,
          reason: tx.actionRequiredText || 'Deliverable files due before milestone deadline.'
        };
      }
      if (!allTasksCompleted) {
        return {
          isActionRequired: true,
          reason: 'Complete remaining checklist items and upload proof of work.'
        };
      }
    }

    return { isActionRequired: false, reason: null };
  };

  // Helper to determine card border style based on user requirements:
  // - Yellow: Action Needed (applies to both employer & worker)
  // - Blue: Your Posted Job
  // - Green: Your Accepted Job / Ongoing Process
  // - Slate: Completed
  const getCardStyle = (tx: Transaction) => {
    if (tx.status === 'COMPLETED' || tx.status === 'REFUNDED') {
      return {
        type: 'COMPLETED',
        borderClass: 'border border-slate-200 bg-white/90 shadow-xs hover:border-slate-300 hover:shadow-md',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        badgeText: '✓ SETTLED & 100% PAID',
        indicatorColor: 'bg-slate-400'
      };
    }

    const actionInfo = getActionRequiredInfo(tx, role);
    if (actionInfo.isActionRequired) {
      return {
        type: 'ACTION_NEEDED',
        borderClass: 'border-2 border-amber-400/80 bg-amber-50/20 shadow-xs hover:border-amber-500 hover:shadow-amber-500/10',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
        badgeText: '⚠️ ACTION REQUIRED',
        indicatorColor: 'bg-amber-500 animate-pulse'
      };
    }

    // If it's an employer posted job or role is employer
    if (role === 'employer' || tx.contractType === 'POSTED_JOB' || tx.employerName === 'Shop Thời Trang X') {
      return {
        type: 'POSTED_JOB',
        borderClass: 'border-2 border-blue-400/70 bg-blue-50/15 shadow-xs hover:border-blue-500 hover:shadow-blue-500/10',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
        badgeText: '🏢 YOUR POSTED JOB (ESCROW SECURED)',
        indicatorColor: 'bg-blue-600'
      };
    }

    // Default to green for accepted job / ongoing process
    return {
      type: 'IN_PROGRESS',
      borderClass: 'border-2 border-emerald-400/70 bg-emerald-50/15 shadow-xs hover:border-emerald-500 hover:shadow-emerald-500/10',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      badgeText: '🟢 ACCEPTED JOB / IN PROGRESS',
      indicatorColor: 'bg-emerald-500'
    };
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    // Search query matching
    const matchesSearch = 
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.workerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const style = getCardStyle(tx);
    const isCompleted = tx.status === 'COMPLETED' || tx.status === 'REFUNDED';

    if (filterTab === 'ALL') return !isCompleted;
    if (filterTab === 'ACTION_NEEDED') return style.type === 'ACTION_NEEDED' && !isCompleted;
    if (filterTab === 'IN_PROGRESS') return style.type === 'IN_PROGRESS' && !isCompleted;
    if (filterTab === 'POSTED_JOBS') return style.type === 'POSTED_JOB' && !isCompleted;
    if (filterTab === 'COMPLETED') return isCompleted;

    return !isCompleted;
  });

  const actionNeededCount = transactions.filter(tx => tx.status !== 'COMPLETED' && tx.status !== 'REFUNDED' && getActionRequiredInfo(tx, role).isActionRequired).length;
  const inProgressCount = transactions.filter(tx => tx.status !== 'COMPLETED' && tx.status !== 'REFUNDED' && getCardStyle(tx).type === 'IN_PROGRESS').length;
  const postedJobsCount = transactions.filter(tx => tx.status !== 'COMPLETED' && tx.status !== 'REFUNDED' && getCardStyle(tx).type === 'POSTED_JOB').length;
  const activeCount = transactions.filter(tx => tx.status !== 'COMPLETED' && tx.status !== 'REFUNDED').length;
  const completedCount = transactions.filter(tx => tx.status === 'COMPLETED' || tx.status === 'REFUNDED').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner / Role Summary */}
      <div className={`rounded-2xl p-4 sm:p-5 border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
        role === 'employer'
          ? 'bg-blue-900 text-white border-blue-800'
          : 'bg-emerald-900 text-white border-emerald-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            role === 'employer' ? 'bg-white/20 text-white' : 'bg-emerald-500/30 text-emerald-200'
          }`}>
            {role === 'employer' ? <Building className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-white/20">
                {role === 'employer' ? 'EMPLOYER CONTRACT HUB' : 'WORKER CONTRACT HUB'}
              </span>
              <span className="text-xs text-white/80">
                {activeCount} Active Contracts • {actionNeededCount} Action Required
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Select any transaction card below to enter the live milestone checklist, review deliverables, or chat with the other party.
            </p>
          </div>
        </div>

        {onSwitchRole && (
          <button
            onClick={onSwitchRole}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Switch to {role === 'employer' ? 'Worker View' : 'Employer View'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Visual Color Border Legend */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Info className="w-4 h-4 text-blue-900" />
          <span>Status Color Borders:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-emerald-400/80 bg-emerald-50/50 text-emerald-950 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Green: Accepted Job / Ongoing Process
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-amber-400/90 bg-amber-50/60 text-amber-950 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Yellow: Action Needed (Inspection / Revision)
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-blue-400/80 bg-blue-50/50 text-blue-950 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Blue: Your Posted Job (Escrow Locked)
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Active ({activeCount})
          </button>
          
          {actionNeededCount > 0 && (
            <button
              onClick={() => setFilterTab('ACTION_NEEDED')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                filterTab === 'ACTION_NEEDED'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Action Needed ({actionNeededCount})</span>
            </button>
          )}

          <button
            onClick={() => setFilterTab('IN_PROGRESS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              filterTab === 'IN_PROGRESS'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>In Progress ({inProgressCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('POSTED_JOBS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              filterTab === 'POSTED_JOBS'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Posted Jobs ({postedJobsCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('COMPLETED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              filterTab === 'COMPLETED'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Completed ({completedCount})</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contracts or ID..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
          />
        </div>
      </div>

      {/* Transaction Cards List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">No Matching Contracts Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your filter or search query. You can find open micro-jobs on the marketplace.
            </p>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="px-5 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-950 transition-colors cursor-pointer"
            >
              Browse Marketplace
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((tx) => {
            const cardStyle = getCardStyle(tx);
            const actionInfo = getActionRequiredInfo(tx, role);
            const totalTasks = tx.checklist.length;
            const completedTasks = tx.checklist.filter(c => c.completed).length;
            const verifiedTasks = tx.checklist.filter(c => c.verifiedByEmployer).length;
            const progressPercent = totalTasks > 0 ? Math.round((verifiedTasks / totalTasks) * 100) : 0;
            const isCompleted = tx.status === 'COMPLETED' || tx.status === 'REFUNDED';

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx.id)}
                className={`rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer relative group ${cardStyle.borderClass}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left Main Information */}
                  <div className="flex-1 space-y-3">
                    {/* Tags row */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono font-bold text-slate-600 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs">
                        ID: {tx.id}
                      </span>
                      
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-2xs ${cardStyle.badgeBg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cardStyle.indicatorColor}`}></span>
                        {cardStyle.badgeText}
                      </span>

                      <span className="font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full text-[11px]">
                        {tx.category}
                      </span>

                      {tx.isPinned && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight">
                          Featured Priority
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                        {tx.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span>{tx.location}</span>
                        <span>•</span>
                        <span>Due: <strong className="font-mono text-slate-700">{tx.executionDate}</strong></span>
                        {tx.completedAt && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">Completed: {tx.completedAt}</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Parties & Progress Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100/80">
                      {/* Employer & Worker */}
                      <div className="flex items-center gap-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-500">Employer:</span>
                          <strong className="text-slate-800">{tx.employerName}</strong>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-500">Worker:</span>
                          <strong className="text-slate-800">{tx.workerName}</strong>
                        </div>
                      </div>

                      {/* Checklist Milestone Progress Bar */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Milestone Verification</span>
                          <span className="font-mono">{verifiedTasks}/{totalTasks} Approved ({progressPercent}%)</span>
                        </div>
                        <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-emerald-600' 
                                : progressPercent === 100 
                                ? 'bg-emerald-500' 
                                : 'bg-blue-900'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Action Callout Box (if Action Needed) */}
                    {actionInfo.isActionRequired && actionInfo.reason && (
                      <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="font-medium leading-tight">
                          <strong>Action Needed:</strong> {actionInfo.reason}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Financial & Action Section */}
                  <div className="lg:pl-6 lg:border-l lg:border-slate-200/80 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0">
                    <div className="text-left lg:text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        {isCompleted ? 'Payout Released' : 'Escrow Secured'}
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#059669] font-mono">
                        {formatVND(tx.payVND)}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-emerald-200">
                        100% Net (0% Worker Cut)
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTransaction(tx.id);
                      }}
                      className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : cardStyle.type === 'ACTION_NEEDED'
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                          : 'bg-blue-900 hover:bg-blue-950 text-white shadow-blue-900/20'
                      }`}
                    >
                      <span>{isCompleted ? 'View Details & Receipt' : 'Open Workspace'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
