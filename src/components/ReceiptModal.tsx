import React from 'react';
import { X, CheckCircle2, Shield, Download, Printer, FileText } from 'lucide-react';
import { formatVND } from '../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  jobTitle: string;
  grossAmountVND: number;
  platformFeeVND?: number;
  workerNetVND?: number;
  employerRefundVND?: number;
  employerName: string;
  workerName: string;
  completedAt?: string;
  resolutionType?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transactionId,
  jobTitle,
  grossAmountVND,
  platformFeeVND = Math.round(grossAmountVND * 0.04),
  workerNetVND = grossAmountVND,
  employerRefundVND = 0,
  employerName,
  workerName,
  completedAt = "2026-08-25 18:30 GMT+7",
  resolutionType = "EMPLOYER_APPROVAL_RELEASE"
}) => {
  if (!isOpen) return null;

  const totalEmployerPaid = grossAmountVND + platformFeeVND;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-emerald-700 p-5 sm:p-6 text-white text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-full bg-white/20 text-white mx-auto flex items-center justify-center mb-2">
            <CheckCircle2 className="w-7 h-7 text-emerald-200" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-800/80 inline-block mb-1">
            OFFICIAL SETTLEMENT & PAYMENT RECEIPT
          </span>
          <h3 className="font-extrabold text-xl">Payment Released Successfully</h3>
          <p className="text-xs text-emerald-100 font-mono mt-0.5">Vault ID: {transactionId}</p>
        </div>

        {/* Receipt Details Card */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 font-sans">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Job Assignment</span>
                <span className="font-bold text-slate-900 text-sm">{jobTitle}</span>
              </div>
              <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                SETTLED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 block">Employer</span>
                <span className="font-semibold text-slate-900">{employerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Verified Worker</span>
                <span className="font-semibold text-slate-900">{workerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Settlement Method</span>
                <span className="font-mono text-slate-800">{resolutionType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Settlement Time</span>
                <span className="font-mono text-slate-800">{completedAt}</span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="pt-3 border-t border-slate-200 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Worker Base Budget (100%):</span>
                <span className="font-bold text-slate-900">{formatVND(grossAmountVND)}</span>
              </div>
              
              <div className="flex justify-between text-slate-600">
                <span>Employer Service Fee (+4%):</span>
                <span className="text-blue-900 font-semibold">+{formatVND(platformFeeVND)}</span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Total Pre-Funded by Employer:</span>
                <span>{formatVND(totalEmployerPaid)}</span>
              </div>

              {employerRefundVND > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Employer Refund Portion:</span>
                  <span className="font-bold">{formatVND(employerRefundVND)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between items-center text-sm font-extrabold text-emerald-800">
                <span>Net Worker Payout (0% Worker Fee):</span>
                <span className="text-base text-emerald-700">{formatVND(workerNetVND)}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Trust Stamp */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900">
            <Shield className="w-5 h-5 text-blue-700 shrink-0" />
            <div>
              <span className="font-bold block">JOBSAFE Escrow Partner Vault Settlement</span>
              <span className="text-blue-700 font-mono text-[10px]">Hash: 0x7b48f9c184d0092ac910815b3c • 0% Worker Deductions</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
