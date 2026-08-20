import React, { useState } from 'react';
import { X, Plus, Trash2, Shield, Flame, CheckCircle2, AlertCircle, Calendar, MapPin, Tag, Info } from 'lucide-react';
import { ChecklistItem, JobListing } from '../types';
import { formatVND } from '../utils/formatters';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onPostJob: (job: JobListing, totalCost: number) => void;
  onOpenDeposit: () => void;
}

const CATEGORIES = [
  'Product Photography',
  'Translation & Content',
  'Graphic Design',
  'Field Marketing',
  'E-Commerce & Logistics',
  'Event Staff & Hospitality',
  'Data Entry & Admin',
  'Software & Testing'
];

const PROVINCES = [
  'Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Bình Dương',
  'Đồng Nai',
  'Hải Phòng',
  'Cần Thơ',
  'Bà Rịa - Vũng Tàu',
  'Khánh Hòa (Nha Trang)',
  'Lâm Đồng (Đà Lạt)',
  'Quảng Nam (Hội An)',
  'Thừa Thiên Huế',
  'Bắc Ninh',
  'Hải Dương',
  'An Giang',
  'Kiên Giang (Phú Quốc)',
  'Remote / Online (Toàn Quốc)'
];

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  walletBalance,
  onPostJob,
  onOpenDeposit
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [province, setProvince] = useState(PROVINCES[0]);
  const [detailedLocation, setDetailedLocation] = useState('');
  const [executionDate, setExecutionDate] = useState('2026-08-30');
  const [payVND, setPayVND] = useState<number>(500000);
  const [payInput, setPayInput] = useState<string>('500,000');
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [description, setDescription] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'c1', text: 'Deliver requested deliverables on time', completed: false, required: true },
    { id: 'c2', text: 'Follow employer quality instructions', completed: false, required: true }
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  if (!isOpen) return null;

  // New Pricing Mechanics:
  // Base worker budget (worker receives 100% net with 0 deductions)
  const workerBudget = payVND || 0;
  // Upfront 4% Platform Service Fee paid by employer
  const serviceFee = Math.round(workerBudget * 0.04);
  // Optional 50,000 VND 24h Pin & Urgency Boost
  const pinFee = isPinned ? 50000 : 0;
  // Total employer checkout deposit
  const totalDeposit = workerBudget + serviceFee + pinFee;
  const hasEnoughFunds = walletBalance >= totalDeposit;

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      {
        id: `c_${Date.now()}`,
        text: newChecklistText.trim(),
        completed: false,
        required: true
      }
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    if (checklist.length <= 1) return;
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const handlePayChange = (val: string) => {
    const numeric = val.replace(/\D/g, '');
    const num = numeric ? parseInt(numeric, 10) : 0;
    setPayVND(num);
    setPayInput(numeric ? new Intl.NumberFormat('vi-VN').format(num) : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || payVND <= 0 || !hasEnoughFunds) return;

    const fullLocation = detailedLocation.trim()
      ? (province.includes('Remote')
          ? detailedLocation.trim()
          : `${detailedLocation.trim()}, ${province}`)
      : province;

    const isRemote = province.includes('Remote') || 
                     detailedLocation.toLowerCase().includes('remote') || 
                     detailedLocation.toLowerCase().includes('online');

    const newJob: JobListing = {
      id: `JS-2026-${Math.floor(100000 + Math.random() * 900000).toString().slice(0, 6)}`,
      title: title.trim(),
      category,
      location: fullLocation,
      executionDate,
      payVND: workerBudget,
      serviceFeeVND: serviceFee,
      pinFeeVND: pinFee,
      totalEmployerDepositVND: totalDeposit,
      isPinned,
      status: 'OPEN',
      employerName: 'Shop Thời Trang X',
      employerRating: 4.9,
      applicantCount: 0,
      checklist,
      description: description.trim() || 'Detailed micro-job requirements defined in the checklist above.',
      tags: [category.split(' ')[0], isRemote ? 'Remote' : 'On-Site', '0% Worker Fee']
    };

    onPostJob(newJob, totalDeposit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/40">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">Post Micro-Job & Pre-Fund Escrow (+4%)</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Funds secured in partner vault until deliverable approval</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task / Job Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lookbook Photography - 50 Silk Dresses"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
            />
          </div>

          {/* Category & Province Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-blue-600 font-medium"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Province / City (Tỉnh / Thành phố) *
              </label>
              <div className="relative">
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-blue-600 font-medium"
                >
                  {PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Detailed Location / Workplace Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Location / Workplace Address *
              </label>
              <span className="text-[11px] text-slate-400">Street, district, studio or 'Online'</span>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. 45 Lê Lợi, P. Bến Nghé, Quận 1 (or 'Online / Remote')"
                value={detailedLocation}
                onChange={(e) => setDetailedLocation(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium placeholder-slate-400"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Provides the worker with the exact physical address or online task destination.
            </p>
          </div>

          {/* Execution Date & Worker Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Execution Date
              </label>
              <input
                type="date"
                value={executionDate}
                onChange={(e) => setExecutionDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Worker Net Budget (VND) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={payInput}
                  onChange={(e) => handlePayChange(e.target.value)}
                  placeholder="500,000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-mono font-bold">VND</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                ✓ Worker receives 100% of this budget (0 deductions).
              </span>
            </div>
          </div>

          {/* Mandatory Milestone Checklist */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Verifiable Milestone Checklist ({checklist.length} items)
              </label>
              <span className="text-[10px] text-slate-400">Employer verifies before releasing payment</span>
            </div>

            <div className="space-y-2 mb-2">
              {checklist.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold font-mono flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-800 flex-1">{item.text}</span>
                  {checklist.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add explicit requirement (e.g. Upload 5 raw photo samples)..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Brief / Context (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Describe background, equipment needed, or reference sample links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* Pin Boost & Urgency Toggle */}
          <div
            onClick={() => setIsPinned(!isPinned)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              isPinned
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isPinned ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <span>Post-Pinning & Urgency Boost (24 Hours)</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    +50,000 VND
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Featured at the top of the feed with instant push alerts to top-rated nearby workers
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={() => {}} // handled by parent div
              className="w-5 h-5 rounded-md text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Upfront Employer Escrow Deposit Calculation Summary */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1">
                <span>Worker Base Budget (100% Net):</span>
              </span>
              <span className="font-mono font-bold text-slate-900">{formatVND(workerBudget)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-blue-900">
              <span className="flex items-center gap-1 font-medium">
                <span>Platform Service Fee (+4%):</span>
              </span>
              <span className="font-mono font-bold text-blue-900">+{formatVND(serviceFee)}</span>
            </div>

            {isPinned && (
              <div className="flex items-center justify-between text-xs text-amber-800">
                <span>Featured 24h Pin & Urgency Boost:</span>
                <span className="font-mono font-bold">+50,000 VND</span>
              </div>
            )}

            <div className="pt-2.5 border-t border-blue-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-blue-950 uppercase tracking-wider block">Total Upfront Escrow Deposit</span>
                <span className="text-[11px] text-slate-500">Pre-funded & held securely in partner escrow vault</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-blue-900">
                {formatVND(totalDeposit)}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600 border-t border-blue-100">
              <span>Your Current Wallet Balance:</span>
              <span className={`font-mono font-bold ${hasEnoughFunds ? 'text-emerald-700' : 'text-red-600'}`}>
                {formatVND(walletBalance)}
              </span>
            </div>
          </div>

          {/* Submit Actions */}
          {hasEnoughFunds ? (
            <button
              type="submit"
              id="confirm-fund-and-post-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Pre-Fund Escrow ({formatVND(totalDeposit)}) & Post Job</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Wallet balance is insufficient to pre-fund {formatVND(totalDeposit)}.</span>
              </div>
              <button
                type="button"
                onClick={onOpenDeposit}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Deposit Funds to Wallet</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
