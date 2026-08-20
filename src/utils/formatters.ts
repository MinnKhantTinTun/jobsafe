/**
 * Utility functions for Vietnamese Dong formatting and Escrow calculations
 */

export function formatVND(amount: number, withSymbol: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return withSymbol ? '0 ₫' : '0 VND';
  }
  const formatted = new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  return withSymbol ? `${formatted} ₫` : `${formatted} VND`;
}

export function formatVNDShort(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M ₫`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k ₫`;
  }
  return `${amount} ₫`;
}

export interface EscrowBreakdown {
  payVND: number;              // Worker base budget (100% net to worker)
  employerServiceFeeVND: number; // 4% platform fee paid upfront by employer
  totalEmployerPaidVND: number;  // 520,000 VND (500k + 20k)
  workerNetVND: number;        // 500,000 VND (0 deductions from worker)
  platformRevenueVND: number;  // 20,000 VND
  platformFeeVND: number;      // Backward-compat alias for 4% fee
}

export function calculateEscrowCommission(payVND: number): EscrowBreakdown {
  const employerServiceFeeVND = Math.round(payVND * 0.04);
  const totalEmployerPaidVND = payVND + employerServiceFeeVND;
  const workerNetVND = payVND; // 100% net to worker with 0 deductions!
  return {
    payVND,
    employerServiceFeeVND,
    totalEmployerPaidVND,
    workerNetVND,
    platformRevenueVND: employerServiceFeeVND,
    platformFeeVND: employerServiceFeeVND,
  };
}

export interface DisputeSplitCalculation {
  workerPercent: number;
  employerPercent: number;
  workerGrossVND: number;
  platformFeeVND: number;
  workerNetVND: number;
  employerRefundVND: number;
}

export function calculateDisputeSplit(payVND: number, workerPercent: number): DisputeSplitCalculation {
  const clampedWorkerPercent = Math.max(0, Math.min(100, workerPercent));
  const employerPercent = 100 - clampedWorkerPercent;
  
  const workerGrossVND = Math.round((payVND * clampedWorkerPercent) / 100);
  // Platform fee is recognized from employer upfront deposit, worker gets 100% of their split portion
  const platformFeeVND = Math.round(workerGrossVND * 0.04);
  const workerNetVND = workerGrossVND; // 0 deductions from worker
  const employerRefundVND = payVND - workerGrossVND;

  return {
    workerPercent: clampedWorkerPercent,
    employerPercent,
    workerGrossVND,
    platformFeeVND,
    workerNetVND,
    employerRefundVND,
  };
}
