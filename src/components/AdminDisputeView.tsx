import React, { useState } from 'react';
import { 
  ShieldAlert, CheckCircle2, RefreshCw, AlertTriangle, ArrowRight, 
  FileText, MessageSquare, Image as ImageIcon, DollarSign, Scale, Percent, 
  RotateCcw, Sliders, CheckSquare, Square, Lock, Clock, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Transaction } from '../types';
import { formatVND, calculateDisputeSplit, calculateEscrowCommission } from '../utils/formatters';

interface AdminDisputeViewProps {
  transaction: Transaction;
  platformRevenue: number;
  onAdminResolve: (
    resolution: 'FULL_RELEASE' | 'PARTIAL_SPLIT' | 'FULL_REFUND',
    splitData?: {
      workerPercent: number;
      workerNetVND: number;
      employerRefundVND: number;
      platformFeeVND: number;
    }
  ) => void;
  onSelectTransactionTab: () => void;
}

export const AdminDisputeView: React.FC<AdminDisputeViewProps> = ({
  transaction,
  platformRevenue,
  onAdminResolve,
  onSelectTransactionTab
}) => {
  const [workerPercent, setWorkerPercent] = useState<number>(60);
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const splitMath = calculateDisputeSplit(transaction.payVND, workerPercent);
  const fullReleaseMath = calculateEscrowCommission(transaction.payVND);

  const isCaseDisputed = transaction.status === 'DISPUTED';

  const handleExecuteFullRelease = () => {
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}

    onAdminResolve('FULL_RELEASE', {
      workerPercent: 100,
      workerNetVND: fullReleaseMath.workerNetVND,
      employerRefundVND: 0,
      platformFeeVND: fullReleaseMath.platformFeeVND
    });
  };

  const handleExecutePartialSplit = () => {
    onAdminResolve('PARTIAL_SPLIT', {
      workerPercent: splitMath.workerPercent,
      workerNetVND: splitMath.workerNetVND,
      employerRefundVND: splitMath.employerRefundVND,
      platformFeeVND: splitMath.platformFeeVND
    });
  };

  const handleExecuteFullRefund = () => {
    onAdminResolve('FULL_REFUND', {
      workerPercent: 0,
      workerNetVND: 0,
      employerRefundVND: transaction.payVND,
      platformFeeVND: 0
    });
  };

  return (
    <div className="space-y-8">
      {/* Admin Top Dashboard Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative Platform Revenue */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Cumulative Platform Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {formatVND(platformRevenue)}
          </div>
          <div className="text-[11px] text-slate-400">
            From upfront 4% employer fees, 50k pin boosts & Pro Pass subscriptions
          </div>
        </div>

        {/* Total Escrow Held */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Funds in Secure Vault</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-blue-950">
            {formatVND(transaction.payVND)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            100% Backed by Bank Reserves
          </div>
        </div>

        {/* Dispute Queue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Payment Reviews in Queue</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isCaseDisputed ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {isCaseDisputed ? '1 Active' : '0 Pending'}
          </div>
          <div className="text-[11px] text-slate-500">
            {isCaseDisputed ? 'Urgent arbitration review' : 'All transactions healthy'}
          </div>
        </div>

        {/* Arbitration SLA */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Resolution SLA</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            18 Mins
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Average review decision time
          </div>
        </div>
      </div>

      {/* Main Dispute Case Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCaseDisputed ? 'bg-red-600 text-white' : 'bg-blue-900 text-white'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-sm bg-slate-900 text-white">
                  {transaction.id}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isCaseDisputed ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse' : 'bg-blue-100 text-blue-900'
                }`}>
                  Status: {transaction.status}
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                {transaction.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Secured Funds in Review</span>
              <span className="text-xl font-extrabold font-mono text-blue-900">{formatVND(transaction.payVND)}</span>
            </div>
            <button
              onClick={onSelectTransactionTab}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Workspace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dispute Summary Context */}
        <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-xs text-red-900 space-y-1.5">
          <div className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Payment Review Request: "{transaction.disputeReason || 'Employer reported non-delivery of raw files on schedule and lighting inconsistencies.'}"</span>
          </div>
          <p className="text-red-700 leading-relaxed">
            Employer ({transaction.employerName}) and Worker ({transaction.workerName}) have submitted claims. Admin must inspect original requirements (Panel A), delivered files (Panel B), and chat communication (Panel C) before selecting an override resolution.
          </p>
        </div>
      </div>

      {/* Side-by-Side 3-Panel Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel A: Original Requirements Checklist */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 uppercase tracking-wider font-mono">
              <span className="w-5 h-5 rounded-md bg-blue-900 text-white flex items-center justify-center text-[10px]">A</span>
              <span>Original Requirements</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Contract Terms</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {transaction.checklist.map((item, idx) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-400 font-mono text-[10px]">Item #{idx + 1}</span>
                  <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                    item.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {item.completed ? 'FULFILLED' : 'REVIEW PENDING'}
                  </span>
                </div>
                <p className="font-semibold text-slate-900 leading-snug">{item.text}</p>
              </div>
            ))}

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
              <div className="font-bold text-[11px] text-blue-900">Contract Metadata</div>
              <div>Execution Date: <strong className="font-mono">{transaction.executionDate}</strong></div>
              <div>Location: <strong>{transaction.location}</strong></div>
              <div>Total Secured Value: <strong className="font-mono">{formatVND(transaction.payVND)}</strong></div>
            </div>
          </div>
        </div>

        {/* Panel B: Uploaded Proof Files */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 uppercase tracking-wider font-mono">
              <span className="w-5 h-5 rounded-md bg-emerald-700 text-white flex items-center justify-center text-[10px]">B</span>
              <span>Uploaded Proof Evidence</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{transaction.proofFiles.length} Deliverables</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {transaction.proofFiles.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No proof files were submitted prior to dispute.
              </div>
            ) : (
              transaction.proofFiles.map((file) => (
                <div key={file.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                      {file.type.includes('image') ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{file.size} • {file.uploadedAt}</div>
                    </div>
                  </div>

                  {file.previewUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-100">
                      <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPreviewImage(file.previewUrl || null)}
                        className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold"
                      >
                        Enlarge Inspection
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel C: Full Chat Log History */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 uppercase tracking-wider font-mono">
              <span className="w-5 h-5 rounded-md bg-purple-700 text-white flex items-center justify-center text-[10px]">C</span>
              <span>In-App Chatroom Audit</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Verified Logs</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
            {transaction.chatLogs.map((msg) => (
              <div key={msg.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold font-mono text-slate-700">{msg.sender}</span>
                  <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                </div>
                <p className="text-slate-800 text-[11px] leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Admin Override Control Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              <span>OFFICIAL ARBITRATION OVERRIDE SYSTEM</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Execute Final Binding Resolution
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Choose an arbitration decision below to automatically re-route secured funds, apply platform fee formulas, and settle the case ledger.
            </p>
          </div>

          <div className="text-right font-mono bg-white/10 px-4 py-2 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-300 block uppercase">Funds in Review</span>
            <span className="text-2xl font-extrabold text-emerald-400">{formatVND(transaction.payVND)}</span>
          </div>
        </div>

        {/* Partial Payout Slider Area */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Partial Settlement Split Ratio:</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-sm">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Worker: {splitMath.workerPercent}%
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                Employer Refund: {splitMath.employerPercent}%
              </span>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={workerPercent}
              onChange={(e) => setWorkerPercent(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0% (Full Refund)</span>
              <span>25%</span>
              <span>50% (Equal Split)</span>
              <span>75%</span>
              <span>100% (Full Release)</span>
            </div>
          </div>

          {/* Live Mathematical Breakdown of Selected Split */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Worker Net Payout (0% Deduction)</span>
              <div className="text-lg font-bold text-emerald-400">{formatVND(splitMath.workerNetVND)}</div>
              <span className="text-[10px] text-slate-400">Allocated: {formatVND(splitMath.workerGrossVND)}</span>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Recognized Service Fee (4%)</span>
              <div className="text-lg font-bold text-amber-400">+{formatVND(splitMath.platformFeeVND)}</div>
              <span className="text-[10px] text-slate-400">From employer upfront deposit</span>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Employer Refund (0% Fee)</span>
              <div className="text-lg font-bold text-blue-300">{formatVND(splitMath.employerRefundVND)}</div>
              <span className="text-[10px] text-slate-400">Returned to employer wallet</span>
            </div>
          </div>
        </div>

        {/* The 3 Working Admin Override Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Button 1: Full Release (100% Worker) */}
          <button
            type="button"
            id="admin-full-release-btn"
            onClick={handleExecuteFullRelease}
            className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Full Release (100% Worker)</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-100 font-normal">
              Worker gets 100% ({formatVND(fullReleaseMath.workerNetVND)}) • Fee {formatVND(fullReleaseMath.platformFeeVND)}
            </span>
          </button>

          {/* Button 2: Partial Payout (Custom Split Slider) */}
          <button
            type="button"
            id="admin-partial-payout-btn"
            onClick={handleExecutePartialSplit}
            className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/30 flex flex-col items-center text-center gap-1.5 transition-all"
          >
            <div className="flex items-center gap-1.5 text-sm">
              <Percent className="w-5 h-5 text-slate-950" />
              <span>Execute Partial Payout ({splitMath.workerPercent}% / {splitMath.employerPercent}%)</span>
            </div>
            <span className="text-[11px] font-mono text-amber-950 font-semibold">
              Worker {formatVND(splitMath.workerNetVND)} • Refund {formatVND(splitMath.employerRefundVND)}
            </span>
          </button>

          {/* Button 3: Full Refund (100% Employer) */}
          <button
            type="button"
            id="admin-full-refund-btn"
            onClick={handleExecuteFullRefund}
            className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex flex-col items-center text-center gap-1.5 transition-all"
          >
            <div className="flex items-center gap-1.5 text-sm">
              <RotateCcw className="w-5 h-5 text-white" />
              <span>Full Refund (100% Employer)</span>
            </div>
            <span className="text-[11px] font-mono text-blue-100 font-normal">
              Employer gets {formatVND(transaction.payVND)} • 0 VND Fee
            </span>
          </button>
        </div>
      </div>

      {/* Lightbox for Admin Evidence Inspector */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-3 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-900 font-mono">ARBITRATION EVIDENCE ZOOM INSPECTOR</span>
              <button onClick={() => setPreviewImage(null)} className="text-xs text-slate-400 hover:text-slate-800">Close</button>
            </div>
            <img src={previewImage} alt="Proof" className="w-full h-auto max-h-[75vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
