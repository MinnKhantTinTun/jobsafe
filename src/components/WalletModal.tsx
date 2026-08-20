import React, { useState } from 'react';
import { X, Wallet, QrCode, CreditCard, ArrowDownLeft, ArrowUpRight, CheckCircle2, Shield, RefreshCw } from 'lucide-react';
import { WalletTransactionItem } from '../types';
import { formatVND } from '../utils/formatters';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onDeposit: (amount: number, description: string) => void;
  ledger: WalletTransactionItem[];
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  walletBalance,
  onDeposit,
  ledger
}) => {
  const [activeTab, setActiveTab] = useState<'topup' | 'ledger'>('topup');
  const [selectedAmount, setSelectedAmount] = useState<number>(500000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'momo' | 'bank'>('vietqr');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDepositSubmit = () => {
    const amount = customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) : selectedAmount;
    if (!amount || amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      onDeposit(amount, `Top-up via ${paymentMethod === 'vietqr' ? 'VietQR Napas247' : paymentMethod === 'momo' ? 'MoMo E-Wallet' : 'Direct Bank Transfer'}`);
      setIsProcessing(false);
      setSuccessMessage(`Successfully deposited ${formatVND(amount)} to your JOBSAFE wallet.`);
      setCustomAmount('');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }, 600);
  };

  const currentDepositAmount = customAmount ? (parseInt(customAmount.replace(/\D/g, ''), 10) || 0) : selectedAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">JOBSAFE Trust Wallet</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Secured funds & Worker earnings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 p-4 sm:p-6 text-white border-b border-blue-800/40 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-mono text-blue-200/80 uppercase tracking-wider block">Available VND Balance</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                {formatVND(walletBalance)}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Shield className="w-3.5 h-3.5" />
                Payment Secured
              </span>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveTab('topup')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'topup' ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              + Quick Top-up
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ledger' ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Transaction Ledger ({ledger.length})
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'topup' ? (
            <div className="space-y-5">
              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Deposit Gateway
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'vietqr'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-blue-900 mb-1" />
                    <div className="font-bold text-xs text-slate-900">VietQR 24/7</div>
                    <div className="text-[10px] text-slate-500">Auto instant credit</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'momo'
                        ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-md bg-pink-600 text-white font-black text-[10px] flex items-center justify-center mb-1">M</div>
                    <div className="font-bold text-xs text-slate-900">MoMo Pay</div>
                    <div className="text-[10px] text-slate-500">E-wallet transfer</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-700 mb-1" />
                    <div className="font-bold text-xs text-slate-900">Bank Transfer</div>
                    <div className="text-[10px] text-slate-500">VCB, MB, TCB</div>
                  </button>
                </div>
              </div>

              {/* Quick Amount Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Deposit Amount (VND)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {[100000, 200000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition-all ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-blue-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {formatVND(amt, false)}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Or enter custom VND (e.g. 750,000)"
                    value={customAmount}
                    onChange={(e) => {
                      const numeric = e.target.value.replace(/\D/g, '');
                      setCustomAmount(numeric ? new Intl.NumberFormat('vi-VN').format(parseInt(numeric, 10)) : '');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* VietQR Mock Code Box */}
              {paymentMethod === 'vietqr' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shrink-0">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-slate-900">Scan via Banking App (Napas247)</div>
                    <div className="text-slate-500 font-mono text-[11px]">Bank: Vietcombank | Acc: 9876543210</div>
                    <div className="text-slate-500 font-mono text-[11px]">Memo: <span className="font-bold text-blue-900">JOBSAFE USER01</span></div>
                  </div>
                </div>
              )}

              {/* Submit Top-up button */}
              <button
                type="button"
                id="confirm-deposit-btn"
                onClick={handleDepositSubmit}
                disabled={isProcessing || currentDepositAmount <= 0}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Gateway...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Deposit {formatVND(currentDepositAmount)}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Ledger View */
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {ledger.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">No transactions recorded yet.</div>
              ) : (
                ledger.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.type === 'DEPOSIT' || item.type === 'ESCROW_RELEASE' || item.type === 'REFUND'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.type === 'DEPOSIT' || item.type === 'ESCROW_RELEASE' || item.type === 'REFUND' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{item.description}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.timestamp}</div>
                      </div>
                    </div>
                    <div className={`font-mono text-xs font-bold ${
                      item.type === 'DEPOSIT' || item.type === 'ESCROW_RELEASE' || item.type === 'REFUND'
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}>
                      {item.type === 'DEPOSIT' || item.type === 'ESCROW_RELEASE' || item.type === 'REFUND' ? '+' : '-'}
                      {formatVND(item.amountVND)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
