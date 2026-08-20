import React from 'react';
import { X, Sparkles, ShieldCheck, Wallet, AlertCircle, ArrowRight, Zap, Check, Star, Award } from 'lucide-react';
import { formatVND } from '../utils/formatters';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onSubscribeProPass: () => void;
  onOpenDeposit: () => void;
  jobTitle?: string;
  isSubscribingFromProfile?: boolean;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  walletBalance,
  onSubscribeProPass,
  onOpenDeposit,
  jobTitle = "Selected Micro-Job",
  isSubscribingFromProfile = false
}) => {
  if (!isOpen) return null;

  const PRO_PASS_PRICE = 50000;
  const hasEnoughFunds = walletBalance >= PRO_PASS_PRICE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-3 border border-amber-400/30">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {isSubscribingFromProfile ? 'Worker Upgrade' : 'Daily Free Limit (2/2 Used)'}
            </span>
          </div>

          <h3 className="font-extrabold text-xl sm:text-2xl leading-tight">
            Unlock Worker "Pro Pass"
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            {isSubscribingFromProfile 
              ? 'Get unlimited job applications and priority placement on high-paying micro-jobs.'
              : `You've used today's 2 free daily applications. Upgrade to apply to "${jobTitle}" immediately.`}
          </p>
        </div>

        {/* Details & Pricing */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Subscription Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-400/40 relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
                  Monthly Membership
                </span>
                <h4 className="font-black text-lg text-slate-900">Worker Pro Pass</h4>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-amber-600">
                  50,000 <span className="text-xs font-normal text-slate-500">VND/mo</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Auto-renews monthly</span>
              </div>
            </div>

            {/* Feature List */}
            <div className="mt-4 pt-3 border-t border-amber-200/60 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Unlimited Daily Job Applications (No 2-job daily cap)</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Priority Application Placement at the top of employer applicants</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </div>
                <span>Exclusive "Verified Worker ⭐" Golden Profile Badge</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>Instant Push Alerts for Newly Posted High-Pay Tasks</span>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-700 mb-1">Free Casual Tier</div>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li>• 2 free applications/day</li>
                <li>• Standard placement</li>
                <li>• 0% fee on payouts</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
              <div className="font-bold text-blue-900 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Pro Pass (50k/mo)</span>
              </div>
              <ul className="space-y-1 text-[11px] text-blue-900/80">
                <li>• ∞ Unlimited applications</li>
                <li>• Top priority placement</li>
                <li>• Verified Worker badge</li>
              </ul>
            </div>
          </div>

          {/* Wallet Balance State */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Your Current Wallet Balance:</span>
            <span className={`font-mono font-bold text-sm ${hasEnoughFunds ? 'text-emerald-700' : 'text-red-600'}`}>
              {formatVND(walletBalance)}
            </span>
          </div>

          {/* Action buttons */}
          {hasEnoughFunds ? (
            <button
              id="confirm-subscribe-pro-pass-btn"
              onClick={onSubscribeProPass}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Subscribe Pro Pass (50,000 VND/mo) & Unlock Unlimited</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Wallet balance ({formatVND(walletBalance)}) is insufficient for Pro Pass (50,000 VND).</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDeposit();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Top-Up Wallet (Min 50,000 VND)</span>
              </button>
            </div>
          )}

          <p className="text-[11px] text-center text-slate-400">
            Casual free quota resets daily at 00:00 GMT+7. Cancel Pro Pass subscription anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
