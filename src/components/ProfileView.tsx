import React from 'react';
import { 
  Award, Star, ShieldCheck, CheckCircle2, AlertCircle, TrendingUp, 
  Clock, DollarSign, Briefcase, FileText, ChevronRight, User, Building, MapPin, Calendar, ArrowRightLeft
} from 'lucide-react';
import { WORKER_PROFILE, EMPLOYER_PROFILE, WORKER_PAST_TRANSACTIONS_HISTORY, EMPLOYER_PAST_TRANSACTIONS_HISTORY } from '../data/mockData';
import { formatVND } from '../utils/formatters';
import { UserRole } from '../types';

interface ProfileViewProps {
  role: UserRole;
  onSwitchRole: (newRole: UserRole) => void;
  onOpenReceipt: (txData: {
    id: string;
    title: string;
    grossVND: number;
    feeVND: number;
    netVND: number;
    employer: string;
    worker?: string;
    date: string;
  }) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ role, onSwitchRole, onOpenReceipt }) => {
  const currentProfile = role === 'employer' ? EMPLOYER_PROFILE : WORKER_PROFILE;
  const historyList = role === 'employer' ? EMPLOYER_PAST_TRANSACTIONS_HISTORY : WORKER_PAST_TRANSACTIONS_HISTORY;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Mode Switcher Header - Directly controls global Employer/Worker mode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-sm gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            id="profile-view-employer-tab"
            onClick={() => onSwitchRole('employer')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              role === 'employer'
                ? 'bg-blue-900 text-white shadow-sm ring-2 ring-blue-900/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4 text-emerald-300" />
            <span>Employer Mode (Shop Thời Trang X)</span>
            {role === 'employer' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            )}
          </button>

          <button
            id="profile-view-worker-tab"
            onClick={() => onSwitchRole('worker')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              role === 'worker'
                ? 'bg-blue-900 text-white shadow-sm ring-2 ring-blue-900/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 text-emerald-300" />
            <span>Worker Mode (Nguyễn Minh Anh)</span>
            {role === 'worker' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CCCD Chip & Biometrics Verified</span>
          </span>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-blue-900/10"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-slate-900">{currentProfile.name}</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{role === 'employer' ? 'Verified Business' : 'Identity Verified'}</span>
                </span>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  {role === 'employer' ? 'Employer Account' : 'Worker Account'}
                </span>
              </div>

              {/* Rating & Location */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-slate-900 font-mono text-sm">{currentProfile.rating}</span>
                  <span className="text-slate-400 font-normal">({currentProfile.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentProfile.location}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Member since {currentProfile.memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Trust Level</span>
            <div className="text-lg font-black text-blue-900 font-mono">TIER 1 PREMIER</div>
            <span className="text-xs text-emerald-600 font-medium">100% Trust & Safety Compliance</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-6 border-t border-slate-100 max-w-3xl">
          {currentProfile.bio}
        </p>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2">
          {currentProfile.badges.map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/80 shadow-xs"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* 4-Card Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {role === 'employer' ? 'Funded Assignments' : 'Completed Jobs'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            {currentProfile.completedJobsCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{role === 'employer' ? '+8 posted this month' : '+14 completed this month'}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {role === 'employer' ? 'Fast Payout Rate' : 'Completion Rate'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-700">
            {currentProfile.completionRate}%
          </div>
          <div className="text-[11px] text-slate-500">
            {role === 'employer' ? 'Instant escrow release upon delivery' : 'Strict on-time milestone delivery'}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Safety Score</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            100%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Zero security or delivery incidents
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {role === 'employer' ? 'Avg Job Budget' : 'Avg Earning'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-blue-950">
            {formatVND(currentProfile.avgEarningVND)}
          </div>
          <div className="text-[11px] text-slate-500">
            Per completed assignment
          </div>
        </div>
      </div>

      {/* Completed Transaction History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {role === 'employer' ? 'Employer Hiring & Payout History' : 'Worker Earning & Settlement History'}
            </h3>
            <p className="text-xs text-slate-500">
              {role === 'employer' 
                ? 'Official records of jobs funded and payments released by Shop Thời Trang X'
                : 'Official records of completed micro-jobs and net payouts earned by Nguyễn Minh Anh'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {historyList.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500 font-mono">
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-6">Job Title & Category</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">{role === 'employer' ? 'Hired Worker' : 'Employer'}</th>
                <th className="py-3.5 px-6">{role === 'employer' ? 'Worker Budget' : 'Milestone Pay'}</th>
                <th className="py-3.5 px-6">{role === 'employer' ? 'Upfront 4% Fee' : 'Worker Fee (0%)'}</th>
                <th className="py-3.5 px-6">{role === 'employer' ? 'Total Pre-Funded' : 'Worker Net Payout'}</th>
                <th className="py-3.5 px-6">Rating</th>
                <th className="py-3.5 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {historyList.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {tx.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{tx.title}</div>
                    <div className="text-[11px] text-slate-500">{tx.category}</div>
                    <p className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-1.5 rounded-md border border-slate-100">
                      "{tx.review}"
                    </p>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-600 whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800 whitespace-nowrap">
                    {role === 'employer' ? tx.worker : tx.employer}
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-slate-900 whitespace-nowrap">
                    {formatVND(tx.grossVND)}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-500 whitespace-nowrap">
                    {role === 'employer' ? `+${formatVND(tx.feeVND)}` : '0 VND (0%)'}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-emerald-700 whitespace-nowrap">
                    {role === 'employer' ? formatVND(tx.grossVND + tx.feeVND) : formatVND(tx.netVND)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{tx.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenReceipt(tx)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
