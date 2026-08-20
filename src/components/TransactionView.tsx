import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, CheckCircle2, AlertTriangle, Send, Upload, FileText, 
  Image as ImageIcon, Sparkles, Clock, Lock, CheckSquare, Square, 
  Paperclip, Flame, MessageSquare, Info, Award, User, RefreshCw, AlertCircle,
  Eye, Check, RotateCcw, Building, ThumbsUp, HelpCircle, ArrowRight, Briefcase,
  Search, Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Transaction, ProofFile, UserRole, ChecklistItem, JobListing, TabType } from '../types';
import { formatVND, calculateEscrowCommission } from '../utils/formatters';

interface TransactionViewProps {
  transaction: Transaction | null;
  role: UserRole;
  onBackToList?: () => void;
  onUpdateTransaction: (updated: Partial<Transaction>) => void;
  onReleaseEscrow: (payVND: number) => void;
  onShowReceipt: () => void;
  onSwitchRole?: () => void;
  onNavigateTab?: (tab: TabType) => void;
  onOpenPostJobModal?: () => void;
}

export const TransactionView: React.FC<TransactionViewProps> = ({
  transaction,
  role,
  onBackToList,
  onUpdateTransaction,
  onReleaseEscrow,
  onShowReceipt,
  onSwitchRole,
  onNavigateTab,
  onOpenPostJobModal
}) => {
  const [chatInput, setChatInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [selectedFileForRevision, setSelectedFileForRevision] = useState<ProofFile | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    if (transaction?.chatLogs) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transaction?.chatLogs]);

  // If there is no active transaction, render the Empty State
  if (!transaction || !transaction.id) {
    return (
      <div className="space-y-6">
        {/* Dynamic Role Indicator Banner */}
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
                  {role === 'employer' ? 'EMPLOYER CONTROL PANEL' : 'WORKER WORKSPACE'}
                </span>
                <span className="text-xs text-white/80">
                  Transaction Center
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                {role === 'employer'
                  ? 'All micro-job contracts are protected with upfront pre-funded escrow vaults and milestone verification.'
                  : 'Track milestone deliverables, upload proof files, and receive 100% net earnings upon employer approval.'}
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

        {/* Empty State Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-900 mx-auto flex items-center justify-center border border-blue-100 shadow-sm">
            <Shield className="w-10 h-10 text-blue-900" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              No Active Transaction In Progress
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              There are currently no active milestone contracts or pending deliverables to execute right now. You can explore new opportunities on the marketplace or manage your posted jobs.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('marketplace')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Browse Marketplace Jobs</span>
            </button>

            {role === 'employer' ? (
              <button
                type="button"
                onClick={() => onOpenPostJobModal && onOpenPostJobModal()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Post New Job (+4% Pre-funded)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('profile')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Past Completed Receipts</span>
              </button>
            )}
          </div>

          {/* Escrow Guarantee Pill */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              0% Worker Deduction Guarantee
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-900 font-bold">
              <Lock className="w-3.5 h-3.5" />
              4% Upfront Escrow
            </span>
          </div>
        </div>
      </div>
    );
  }

  const { employerServiceFeeVND, workerNetVND } = calculateEscrowCommission(transaction.payVND);


  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transaction.chatLogs]);

  // Worker toggles checklist completion
  const handleWorkerToggleChecklist = (itemId: string) => {
    const updatedChecklist = transaction.checklist.map(item => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    onUpdateTransaction({ checklist: updatedChecklist });
  };

  // Employer verifies / approves specific checklist item
  const handleEmployerVerifyChecklistItem = (itemId: string) => {
    const updatedChecklist = transaction.checklist.map(item => {
      if (item.id === itemId) {
        return { ...item, verifiedByEmployer: !item.verifiedByEmployer };
      }
      return item;
    });

    const verifiedItem = updatedChecklist.find(i => i.id === itemId);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isNowVerified = verifiedItem?.verifiedByEmployer;

    const auditMsg = {
      id: `audit_${Date.now()}`,
      sender: 'Employer' as const,
      text: isNowVerified 
        ? `✓ [Requirement Verified]: "${verifiedItem?.text}" has been inspected and approved.`
        : `⚠️ [Requirement Flagged]: "${verifiedItem?.text}" marked for review.`,
      timestamp: now
    };

    onUpdateTransaction({ 
      checklist: updatedChecklist,
      chatLogs: [...transaction.chatLogs, auditMsg]
    });
  };

  // Employer verifies / approves proof file
  const handleEmployerVerifyProofFile = (fileId: string, status: 'APPROVED' | 'REVISION_REQUESTED', customFeedback?: string) => {
    const updatedFiles = transaction.proofFiles.map(file => {
      if (file.id === fileId) {
        return { 
          ...file, 
          verificationStatus: status,
          feedback: customFeedback || (status === 'APPROVED' ? 'Approved by Employer' : 'Revision requested')
        };
      }
      return file;
    });

    const targetFile = transaction.proofFiles.find(f => f.id === fileId);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const auditMsg = {
      id: `file_audit_${Date.now()}`,
      sender: 'Employer' as const,
      text: status === 'APPROVED'
        ? `✓ [Deliverable Approved]: "${targetFile?.name}" was inspected and verified.`
        : `⚠️ [Revision Request]: "${targetFile?.name}" needs correction: "${customFeedback || 'Please check specifications'}"`,
      timestamp: now
    };

    onUpdateTransaction({
      proofFiles: updatedFiles,
      chatLogs: [...transaction.chatLogs, auditMsg]
    });
  };

  // Send message in in-app chat
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput.trim();
    if (!text) return;

    const senderRole = role === 'employer' ? 'Employer' : 'Worker';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: senderRole as 'Employer' | 'Worker',
      text,
      timestamp: timeStr
    };

    onUpdateTransaction({
      chatLogs: [...transaction.chatLogs, newMsg]
    });

    if (!textToSend) setChatInput('');
  };

  // Quick Action Buttons tailored to active role
  const handleQuickAction = (actionType: string) => {
    let msg = '';
    if (actionType === 'progress_check') {
      msg = '📋 [Employer Check]: How is the progress coming along on the remaining deliverable checklist?';
    } else if (actionType === 'lighting_note') {
      msg = '📸 [Employer Note]: Please ensure consistent daylight 5500K balance on all product photos.';
    } else if (actionType === 'upload_notice') {
      msg = '📦 [Worker Update]: New batch of deliverables has been uploaded for your inspection.';
    } else if (actionType === 'delay_note') {
      msg = '⏱️ [Worker Notice]: Minor 15-minute studio delay reported. Finishing up the batch now!';
    }
    handleSendMessage(msg);
  };

  // Proof Upload Simulation (Worker)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setTimeout(() => {
      const file = files[0];
      const newProof: ProofFile = {
        id: `pf_${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024) || 12.4).toFixed(1)} MB`,
        type: file.type || 'image/jpeg',
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        previewUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80",
        verificationStatus: 'PENDING'
      };

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const uploadNotice = {
        id: `sys_up_${Date.now()}`,
        sender: 'Worker' as const,
        text: `Uploaded new deliverable file: "${file.name}" for Employer inspection.`,
        timestamp: now
      };

      onUpdateTransaction({
        proofFiles: [...transaction.proofFiles, newProof],
        chatLogs: [...transaction.chatLogs, uploadNotice]
      });
      setIsUploading(false);
    }, 500);
  };

  // Submit Proof Action (Worker)
  const handleSubmitProof = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Mark remaining checklist items as completed
    const completedChecklist = transaction.checklist.map(item => ({ ...item, completed: true }));

    const systemMsg = {
      id: `sys_${Date.now()}`,
      sender: 'System' as const,
      text: 'Worker has completed the milestone tasks and submitted all deliverables for Employer inspection.',
      timestamp: now,
      isAction: true
    };

    onUpdateTransaction({
      status: 'SUBMITTED',
      checklist: completedChecklist,
      chatLogs: [...transaction.chatLogs, systemMsg]
    });
  };

  // Employer Release Payment Action (ONLY Employer can call this!)
  const handleApproveAndRelease = () => {
    if (role !== 'employer') return;

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const releaseMsg = {
      id: `sys_rel_${Date.now()}`,
      sender: 'System' as const,
      text: `Payment Approved & Released! Worker paid ${formatVND(transaction.payVND)} (100% Net - 0% worker deduction). Platform recognized ${formatVND(employerServiceFeeVND)} service fee.`,
      timestamp: now,
      isAction: true
    };

    onUpdateTransaction({
      status: 'COMPLETED',
      completedAt: '2026-08-25 18:30 GMT+7',
      chatLogs: [...transaction.chatLogs, releaseMsg]
    });

    onReleaseEscrow(transaction.payVND);
  };

  // Calculate Verification Stats
  const totalChecklistCount = transaction.checklist.length;
  const workerCompletedChecklistCount = transaction.checklist.filter(i => i.completed).length;
  const employerVerifiedChecklistCount = transaction.checklist.filter(i => i.verifiedByEmployer).length;
  
  const totalFilesCount = transaction.proofFiles.length;
  const approvedFilesCount = transaction.proofFiles.filter(f => f.verificationStatus === 'APPROVED').length;
  const pendingFilesCount = transaction.proofFiles.filter(f => !f.verificationStatus || f.verificationStatus === 'PENDING').length;

  const isFullyVerifiedByEmployer = employerVerifiedChecklistCount === totalChecklistCount && approvedFilesCount === totalFilesCount && totalFilesCount > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Navigation Bar: Back to List & Breadcrumbs */}
      {onBackToList && (
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <button
            onClick={onBackToList}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <span>← Back to All Contracts</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Contract ID:</span>
            <strong className="text-slate-800 font-bold">{transaction.id}</strong>
          </div>
        </div>
      )}

      {/* Dynamic Role Indicator Banner */}
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
                {role === 'employer' ? 'EMPLOYER CONTROL PANEL' : 'WORKER WORKSPACE'}
              </span>
              <span className="text-xs text-white/80">
                Active View: <strong>{role === 'employer' ? transaction.employerName : transaction.workerName}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              {role === 'employer'
                ? 'As Employer, inspect incoming deliverable images, verify checklist criteria, and release secured escrow payments.'
                : 'As Worker, track checklist requirements, upload proof files, and submit deliverables for employer verification.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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
      </div>

      {/* 2-Column Workspace Ratio: Left (7 cols) Main Workspace + Right (5 cols) Chat */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Left Main Workspace (col-span-12 lg:col-span-7) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 flex-wrap">
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold">
                    ID: {transaction.id}
                  </span>
                  {transaction.isPinned && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                      Pinned Priority
                    </span>
                  )}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {transaction.category}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {transaction.title}
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  {transaction.location} • Due: <strong className="font-mono text-slate-700">{transaction.executionDate}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">
                  Worker Net Payout
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#059669] font-mono">
                  {formatVND(transaction.payVND)}
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-emerald-200">
                  0% Deductions (100% Net)
                </span>
              </div>
            </div>

            {/* 3-Column Metric Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-slate-50 rounded-xl p-3.5 sm:p-4 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Pre-Funded Safe Vault</div>
                <div className="text-base sm:text-lg font-bold text-slate-800 font-mono">
                  {formatVND(transaction.totalEmployerPaidVND || Math.round(transaction.payVND * 1.04))}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">4% Service Fee Pre-Funded</div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 sm:p-4 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Worker Payout (100% Net)</div>
                <div className="text-base sm:text-lg font-bold text-emerald-700 font-mono">{formatVND(transaction.payVND)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">0% Commission Cut</div>
              </div>

              <div className={`rounded-xl p-3.5 sm:p-4 text-white flex flex-col justify-center items-center text-center shadow-xs ${
                transaction.status === 'COMPLETED' ? 'bg-emerald-600' : transaction.status === 'SUBMITTED' ? 'bg-blue-800' : 'bg-emerald-600'
              }`}>
                <div className="text-[10px] uppercase font-bold opacity-80 tracking-wider">Status</div>
                <div className="text-xs sm:text-sm font-bold font-mono tracking-wide">
                  {transaction.status === 'IN_PROGRESS' 
                    ? 'IN PROGRESS' 
                    : transaction.status === 'SUBMITTED' 
                    ? 'READY FOR REVIEW' 
                    : transaction.status}
                </div>
              </div>
            </div>

            {/* Parties Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Employer:</span>
                <span className="font-bold text-slate-800">{transaction.employerName}</span>
                {role === 'employer' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-mono">YOU</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Assigned Worker:</span>
                <span className="font-bold text-slate-800">{transaction.workerName}</span>
                {role === 'worker' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono">YOU</span>
                )}
              </div>
            </div>
          </div>

          {/* Status Alert Banner (Completed) */}
          {transaction.status === 'COMPLETED' && (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-emerald-950">Milestone Completed & Payment Released</h4>
                    <p className="text-xs text-emerald-700">Funds of {formatVND(workerNetVND)} successfully credited to worker wallet.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={onShowReceipt}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Settlement Receipt</span>
                  </button>
                  {onBackToList && (
                    <button
                      onClick={onBackToList}
                      className="px-4 py-2.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <span>← Back to Contracts</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1: Interactive Requirement Checklist Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  {role === 'employer' ? 'Employer Requirement Verification' : 'Milestone Execution Checklist'}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                {role === 'employer' ? (
                  <span className={`px-2.5 py-0.5 rounded-md ${
                    employerVerifiedChecklistCount === totalChecklistCount 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {employerVerifiedChecklistCount} of {totalChecklistCount} Verified by You
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {workerCompletedChecklistCount} of {totalChecklistCount} Completed
                  </span>
                )}
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {transaction.checklist.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.verifiedByEmployer
                      ? 'bg-emerald-50/70 border-emerald-200 ring-1 ring-emerald-500/20'
                      : item.completed
                      ? 'bg-blue-50/40 border-blue-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Left Status Icon */}
                      <div className="mt-0.5 shrink-0">
                        {role === 'worker' ? (
                          <button
                            type="button"
                            onClick={() => handleWorkerToggleChecklist(item.id)}
                            className="focus:outline-hidden cursor-pointer"
                            title="Click to toggle completion status"
                          >
                            {item.completed ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                                ✓
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-slate-400" />
                            )}
                          </button>
                        ) : (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            item.verifiedByEmployer
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : item.completed
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {item.verifiedByEmployer ? '✓' : idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 flex-1">
                        <p className={`text-xs sm:text-sm leading-snug ${
                          item.verifiedByEmployer
                            ? 'text-slate-900 font-semibold'
                            : item.completed
                            ? 'text-slate-800 font-medium'
                            : 'text-slate-600'
                        }`}>
                          {item.text}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          {item.completed && (
                            <span className="text-blue-700 font-medium font-mono">
                              • Worker marked completed
                            </span>
                          )}
                          {item.verifiedByEmployer ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Employer Verified
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">
                              • Pending Employer Verification
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Employer Quick Verification Toggle Button */}
                    {role === 'employer' && transaction.status !== 'COMPLETED' && (
                      <button
                        type="button"
                        onClick={() => handleEmployerVerifyChecklistItem(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                          item.verifiedByEmployer
                            ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-500'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{item.verifiedByEmployer ? 'Verified ✓' : 'Verify'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Checklist guidance footer */}
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>
                {role === 'employer'
                  ? '💡 Tip: Click "Verify" next to each item as you inspect delivered quality.'
                  : '💡 Tip: Mark checklist items as you complete each task, then upload files below.'}
              </span>
            </div>
          </div>

          {/* SECTION 2: Proof of Work & Incoming Deliverables Inspection */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {role === 'employer' 
                    ? `Incoming Deliverables & Image Verification (${transaction.proofFiles.length})` 
                    : `Proof of Work Deliverables (${transaction.proofFiles.length})`}
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-500">
                {approvedFilesCount} of {totalFilesCount} Approved
              </div>
            </div>

            {/* Dropzone Area (Available for Worker or Employer upload) */}
            {role === 'worker' && transaction.status !== 'COMPLETED' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center mx-auto transition-colors">
                  {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Click or drag & drop deliverable files here</span>
                  <span className="text-[11px] text-slate-400">Upload high-res JPG, PNG, RAW (.CR3), ZIP archive deliverables</span>
                </div>
              </div>
            )}

            {/* Uploaded Deliverables / Images List with Dedicated Verification Controls */}
            <div className="space-y-4">
              {transaction.proofFiles.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-400">
                  No proof files uploaded yet.
                </div>
              ) : (
                transaction.proofFiles.map((file) => {
                  const isApproved = file.verificationStatus === 'APPROVED';
                  const isRevision = file.verificationStatus === 'REVISION_REQUESTED';

                  return (
                    <div 
                      key={file.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        isApproved
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : isRevision
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* File Thumbnail & Meta */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          {file.previewUrl ? (
                            <div 
                              onClick={() => setPreviewImage(file.previewUrl || null)}
                              className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 relative group cursor-pointer shrink-0 bg-slate-100 shadow-xs"
                              title="Click to zoom in inspection lightbox"
                            >
                              <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Eye className="w-4 h-4" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}

                          <div className="min-w-0 space-y-0.5">
                            <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">{file.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {file.size} • Uploaded at {file.uploadedAt}
                            </div>
                            {file.feedback && (
                              <div className="text-[11px] text-slate-700 font-medium italic mt-1 bg-white/80 p-1.5 rounded border border-slate-200/80">
                                Feedback: "{file.feedback}"
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions & Verification Status */}
                        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
                          {file.previewUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewImage(file.previewUrl || null)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>Inspect Image</span>
                            </button>
                          )}

                          {/* Employer Verification Action Buttons */}
                          {role === 'employer' && transaction.status !== 'COMPLETED' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEmployerVerifyProofFile(file.id, 'APPROVED')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  isApproved
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isApproved ? 'Approved ✓' : 'Approve File'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFileForRevision(file);
                                  setShowRevisionModal(true);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3 text-amber-600" />
                                <span>Request Edit</span>
                              </button>
                            </div>
                          ) : (
                            /* Worker or Settled View of Verification Badge */
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono ${
                              isApproved
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isRevision
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {isApproved ? 'VERIFIED ✓' : isRevision ? 'REVISION NEEDED' : 'PENDING INSPECTION'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Worker Submit Deliverables Button */}
            {role === 'worker' && transaction.status === 'IN_PROGRESS' && (
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  id="worker-submit-proof-btn"
                  onClick={handleSubmitProof}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit All Deliverables for Employer Inspection</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: Dedicated Role-Based Milestone Conclusion & Payment Release */}
          {transaction.status !== 'COMPLETED' && (
            <div>
              {role === 'employer' ? (
                /* EMPLOYER CONTROLS: Approval & Payment Release */
                <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-blue-900">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-extrabold block mb-1">
                        EMPLOYER SETTLEMENT & RELEASE AUTHORIZATION
                      </span>
                      <h3 className="text-xl font-extrabold text-white">
                        Verify & Release Secured Escrow Payment
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                        Verify that all requirements are met. Once you click Approve & Release, the secured funds are transferred directly to the worker's balance with automated 4% platform fee calculation.
                      </p>
                    </div>

                    <div className="text-right font-mono bg-white/10 px-4 py-2 rounded-xl border border-white/10 shrink-0">
                      <span className="text-[10px] text-slate-300 block uppercase">Secured Funds</span>
                      <span className="text-2xl font-extrabold text-emerald-400">{formatVND(transaction.payVND)}</span>
                    </div>
                  </div>

                  {/* Verification Status Checklist Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-slate-300">Checklist Verified:</span>
                      <span className={`font-bold ${employerVerifiedChecklistCount === totalChecklistCount ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {employerVerifiedChecklistCount} / {totalChecklistCount} Items
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-slate-300">Deliverables Approved:</span>
                      <span className={`font-bold ${approvedFilesCount === totalFilesCount && totalFilesCount > 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {approvedFilesCount} / {totalFilesCount} Files
                      </span>
                    </div>
                  </div>

                  {/* Exact Financial Breakdown */}
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10 text-xs space-y-2 font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>Worker Budget (100% Net Payout):</span>
                      <span className="font-bold text-white">{formatVND(transaction.payVND)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Platform Service Fee (+4%):</span>
                      <span className="text-blue-300">+{formatVND(employerServiceFeeVND)}</span>
                    </div>
                    {transaction.isPinned && (
                      <div className="flex justify-between text-amber-300">
                        <span>Featured 24h Pin Fee:</span>
                        <span>+50,000 VND</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-bold text-emerald-300">
                      <span>Direct Worker Payout (0% Deductions):</span>
                      <span className="text-base text-emerald-400 font-bold">{formatVND(transaction.payVND)}</span>
                    </div>
                  </div>

                  {/* Employer Action Controls */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      id="employer-approve-and-release-btn"
                      onClick={handleApproveAndRelease}
                      className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 text-slate-950" />
                      <span>Approve & Release Full Payment ({formatVND(transaction.payVND)})</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* WORKER VIEW: Awaiting Employer Approval (NO Release Button!) */
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Worker Escrow Protection Status</h4>
                      <p className="text-xs text-slate-500">Employer pre-funded budget + 4% platform fee. 0% deductions from worker.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Secured Worker Payout:</span>
                      <span className="font-mono font-bold text-slate-900">{formatVND(transaction.payVND)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Worker Fee Rate:</span>
                      <span className="font-mono font-bold">0% (100% Net to You)</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                      <span>You Receive on Approval:</span>
                      <span className="font-mono text-emerald-700 text-base">{formatVND(transaction.payVND)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                      {transaction.status === 'SUBMITTED'
                        ? '✓ Deliverables submitted! Awaiting employer inspection and payment release.'
                        : 'Complete all checklist requirements and upload deliverables above to request approval.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Panel: In-App Chatroom (col-span-12 lg:col-span-5) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col h-[520px] sm:h-[620px] lg:h-[760px] bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden lg:sticky lg:top-24">
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Direct Job Workspace Chat</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">#000184</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto flex flex-col gap-3 sm:gap-4 bg-slate-50/30">
            {transaction.chatLogs.map((msg) => {
              if (msg.sender === 'System') {
                return (
                  <div key={msg.id} className="bg-slate-100 rounded-lg p-2.5 sm:p-3 text-[11px] text-slate-600 text-center border border-slate-200">
                    🔒 System: {msg.text}
                  </div>
                );
              }

              const isMe = (role === 'employer' && msg.sender === 'Employer') || (role === 'worker' && msg.sender === 'Worker');

              return (
                <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`p-2.5 sm:p-3 text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-blue-900 text-white rounded-2xl rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none border border-slate-200'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1">
                    {msg.sender} • {msg.timestamp} {isMe ? '• Delivered' : ''}
                  </span>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input & Controls */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder={role === 'employer' ? "Message worker (e.g. Please check lighting)..." : "Message employer (e.g. Uploaded batch 1)..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 pr-11 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Role-specific quick chat actions */}
            <div className="flex gap-2 mt-2.5 sm:mt-3 overflow-x-auto no-scrollbar">
              {role === 'employer' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickAction('progress_check')}
                    className="flex-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 py-1.5 sm:py-2 px-2 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                  >
                    Check Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAction('lighting_note')}
                    className="flex-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 py-1.5 sm:py-2 px-2 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                  >
                    Lighting Note
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickAction('upload_notice')}
                    className="flex-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 py-1.5 sm:py-2 px-2 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                  >
                    Files Uploaded
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAction('delay_note')}
                    className="flex-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 py-1.5 sm:py-2 px-2 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                  >
                    Report Status
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Inspection Lightbox Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-150"
        >
          <div className="max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-slate-900 font-mono">DELIVERABLE IMAGE INSPECTION (HIGH RESOLUTION)</span>
              </div>
              <button 
                onClick={() => setPreviewImage(null)} 
                className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>
            <div className="p-2 bg-slate-950 rounded-xl flex items-center justify-center">
              <img src={previewImage} alt="Deliverable preview" className="w-full h-auto max-h-[75vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Employer Revision Request Modal */}
      {showRevisionModal && selectedFileForRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Request Deliverable Revision</h3>
                <p className="text-xs text-slate-500 truncate max-w-[260px]">File: {selectedFileForRevision.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Specify what needs adjustment for the worker to update and re-upload.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Revision Instructions *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Please increase exposure by +0.5 EV and ensure the collar details are in sharp focus..."
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowRevisionModal(false);
                  setSelectedFileForRevision(null);
                  setRevisionNote('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!revisionNote.trim() || !selectedFileForRevision) return;
                  handleEmployerVerifyProofFile(selectedFileForRevision.id, 'REVISION_REQUESTED', revisionNote.trim());
                  setShowRevisionModal(false);
                  setSelectedFileForRevision(null);
                  setRevisionNote('');
                }}
                disabled={!revisionNote.trim()}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
