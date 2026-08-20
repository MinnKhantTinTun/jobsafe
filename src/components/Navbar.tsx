import React from 'react';
import { Shield, Sparkles, Wallet, UserCheck, ArrowRightLeft, Plus, Award, Star } from 'lucide-react';
import { TabType, UserRole } from '../types';
import { formatVND } from '../utils/formatters';

interface NavbarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  walletBalance: number;
  applicationCounter: number;
  isProPass?: boolean;
  onOpenWallet: () => void;
  onOpenProPassModal?: () => void;
  transactionStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  role,
  setRole,
  walletBalance,
  applicationCounter,
  isProPass = false,
  onOpenWallet,
  onOpenProPassModal,
  transactionStatus
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#1E3A8A] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 sm:gap-8 shrink-0">
            <button
              id="brand-logo-btn"
              onClick={() => setCurrentTab('marketplace')}
              className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-hidden cursor-pointer"
            >
              <div className="bg-white p-1 sm:p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#059669] rounded-sm flex items-center justify-center">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono">JOBSAFE</span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  SAFE PAY
                </span>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button
                id="nav-tab-marketplace"
                onClick={() => setCurrentTab('marketplace')}
                className={`py-1 transition-all cursor-pointer ${
                  currentTab === 'marketplace'
                    ? 'border-b-2 border-white text-white font-bold'
                    : 'text-white/80 hover:text-white hover:opacity-100'
                }`}
              >
                Marketplace
              </button>

              <button
                id="nav-tab-transaction"
                onClick={() => setCurrentTab('transaction')}
                className={`py-1 transition-all flex items-center gap-2 cursor-pointer ${
                  currentTab === 'transaction'
                    ? 'border-b-2 border-white text-white font-bold'
                    : 'text-white/80 hover:text-white hover:opacity-100'
                }`}
              >
                <span>Transaction Center</span>
                {transactionStatus === 'IN_PROGRESS' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {transactionStatus === 'SUBMITTED' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
                    Review
                  </span>
                )}
                {transactionStatus === 'COMPLETED' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-400 text-slate-950 font-bold">
                    Done
                  </span>
                )}
              </button>

              <button
                id="nav-tab-profile"
                onClick={() => setCurrentTab('profile')}
                className={`py-1 transition-all cursor-pointer ${
                  currentTab === 'profile'
                    ? 'border-b-2 border-white text-white font-bold'
                    : 'text-white/80 hover:text-white hover:opacity-100'
                }`}
              >
                Profiles & History
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Free Tries / Pro Pass Badge */}
            <button
              type="button"
              onClick={onOpenProPassModal}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isProPass
                  ? 'bg-amber-400 text-slate-950 border border-amber-300 shadow-xs'
                  : applicationCounter > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30'
              }`}
              title={isProPass ? 'Pro Pass Active: Unlimited applications' : applicationCounter > 0 ? `${applicationCounter} free applications remaining today (resets midnight)` : 'Upgrade to Pro Pass for unlimited applications'}
            >
              {isProPass ? (
                <>
                  <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  <span>PRO PASS ⭐</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{applicationCounter > 0 ? `${applicationCounter} / 2 Free` : 'Get Pro Pass'}</span>
                </>
              )}
            </button>

            {/* Sleek User Wallet Balance Pill */}
            <button
              id="wallet-balance-button"
              onClick={onOpenWallet}
              className="bg-white/10 hover:bg-white/15 px-2.5 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2.5 text-white transition-all group cursor-pointer"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0"></div>
              <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wide">{formatVND(walletBalance)}</span>
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300 opacity-80 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>

            {/* Role Switcher & Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 border-l border-white/20 pl-2 sm:pl-4">
              <button
                id="role-switch-toggle"
                onClick={() => setRole(role === 'employer' ? 'worker' : 'employer')}
                className="text-left group focus:outline-hidden cursor-pointer flex items-center gap-1.5"
                title={`Current Mode: ${role === 'employer' ? 'Employer' : 'Worker'}. Click to switch.`}
              >
                <div className="hidden sm:block">
                  <span className="text-[10px] uppercase tracking-wider text-white/70 block font-semibold group-hover:text-white transition-colors">
                    {role === 'employer' ? 'Employer Mode' : 'Worker Mode'}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1">
                    <span>Switch Role</span>
                    <ArrowRightLeft className="w-3 h-3" />
                  </span>
                </div>
                <div className="sm:hidden flex items-center justify-center p-1 rounded-md bg-white/10 text-emerald-300">
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </div>
              </button>

              <div 
                onClick={() => setRole(role === 'employer' ? 'worker' : 'employer')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 border-2 border-emerald-500 overflow-hidden shadow-xs shrink-0 cursor-pointer"
                title={`Active profile: ${role === 'employer' ? 'Shop Thời Trang X (Employer)' : 'Nguyễn Minh Anh (Worker)'}`}
              >
                <img
                  src={role === 'employer' 
                    ? "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=100&auto=format&fit=crop&q=80"
                    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tab Segmented Control Bar */}
        <div className="flex md:hidden items-center py-2 border-t border-white/15 overflow-x-auto no-scrollbar gap-1.5 text-xs">
          <button
            onClick={() => setCurrentTab('marketplace')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              currentTab === 'marketplace' 
                ? 'bg-white text-[#1E3A8A] shadow-xs' 
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setCurrentTab('transaction')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              currentTab === 'transaction' 
                ? 'bg-white text-[#1E3A8A] shadow-xs' 
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <span>Transaction</span>
            {transactionStatus === 'IN_PROGRESS' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {transactionStatus === 'SUBMITTED' && (
              <span className="px-1 py-0.2 rounded-full text-[9px] bg-amber-400 text-amber-950 font-bold">
                Review
              </span>
            )}
            {transactionStatus === 'COMPLETED' && (
              <span className="px-1 py-0.2 rounded-full text-[9px] bg-emerald-400 text-slate-950 font-bold">
                Done
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('profile')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              currentTab === 'profile' 
                ? 'bg-white text-[#1E3A8A] shadow-xs' 
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            Profiles
          </button>
        </div>
      </div>
    </header>
  );
};
