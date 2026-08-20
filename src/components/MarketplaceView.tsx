import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, Flame, Shield, MapPin, Calendar, CheckCircle2, 
  ChevronDown, ChevronUp, Sparkles, User, ArrowRight, Check, Award, Lock, 
  ExternalLink, Zap, Star, Users, UserCheck, Briefcase, ThumbsUp, ThumbsDown, 
  Clock, Eye, AlertCircle, RefreshCw
} from 'lucide-react';
import { JobListing, UserRole, JobApplicant } from '../types';
import { formatVND } from '../utils/formatters';
import { ApplicantProfileModal } from './ApplicantProfileModal';
import { HireConfirmationModal } from './HireConfirmationModal';

interface MarketplaceViewProps {
  jobs: JobListing[];
  role: UserRole;
  applicationCounter: number;
  isProPass?: boolean;
  onOpenProPassModal: () => void;
  onApplyJob: (job: JobListing) => void;
  onOpenPostJobModal: () => void;
  onSelectTransaction: (jobId: string) => void;
  onAcceptApplicant?: (jobId: string, applicant: JobApplicant, autoRejectOthers?: boolean) => void;
  onRejectApplicant?: (jobId: string, applicantId: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  jobs,
  role,
  applicationCounter,
  isProPass = false,
  onOpenProPassModal,
  onApplyJob,
  onOpenPostJobModal,
  onSelectTransaction,
  onAcceptApplicant,
  onRejectApplicant
}) => {
  // Main Segmented View Toggle: 'find_jobs' vs 'posted_jobs'
  const [marketplaceSubTab, setMarketplaceSubTab] = useState<'find_jobs' | 'posted_jobs'>('find_jobs');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [onlyPinned, setOnlyPinned] = useState<boolean>(false);
  const [expandedChecklists, setExpandedChecklists] = useState<Record<string, boolean>>({
    'JS-2026-000184': true
  });

  // Modal for reviewing applicant profile
  const [selectedApplicantData, setSelectedApplicantData] = useState<{
    isOpen: boolean;
    applicant: JobApplicant | null;
    job: JobListing | null;
  }>({
    isOpen: false,
    applicant: null,
    job: null
  });

  // Modal for confirming hire and auto-rejecting other candidates
  const [hireModalData, setHireModalData] = useState<{
    isOpen: boolean;
    applicant: JobApplicant | null;
    job: JobListing | null;
  }>({
    isOpen: false,
    applicant: null,
    job: null
  });

  const categories = useMemo(() => {
    const list = Array.from(new Set(jobs.map(j => j.category)));
    return ['ALL', ...list];
  }, [jobs]);

  // Employer's own posted jobs (e.g. Shop Thời Trang X or all if in employer mode)
  const employerPostedJobs = useMemo(() => {
    return jobs.filter(j => j.employerName === 'Shop Thời Trang X' || j.id === 'JS-2026-000184' || j.id === 'JS-2026-000195');
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'ALL' || job.category === selectedCategory;
      const matchesLocation = selectedLocation === 'ALL' || job.location.includes(selectedLocation);
      const matchesPinned = !onlyPinned || job.isPinned;

      return matchesSearch && matchesCategory && matchesLocation && matchesPinned;
    });
  }, [jobs, searchQuery, selectedCategory, selectedLocation, onlyPinned]);

  const toggleChecklist = (jobId: string) => {
    setExpandedChecklists(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const handleOpenApplicantReview = (job: JobListing, applicant: JobApplicant) => {
    setSelectedApplicantData({
      isOpen: true,
      applicant,
      job
    });
  };

  const totalPendingApplicantsCount = useMemo(() => {
    return employerPostedJobs.reduce((acc, job) => {
      const pending = (job.applicants || []).filter(a => a.status === 'PENDING').length;
      return acc + pending;
    }, 0);
  }, [employerPostedJobs]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 via-blue-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] sm:text-xs font-mono font-bold mb-3 sm:mb-4 border border-emerald-500/30">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">UPFRONT ESCROW • 0% WORKER FEE • 100% PROTECTED</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 sm:mb-3">
            Pre-funded escrow with 0% worker deduction.
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-5 sm:mb-6 max-w-2xl">
            Employers pre-fund the full job budget plus a 4% platform service fee upfront into secure escrow vaults. Workers deliver milestone proof and receive 100% of their earnings with zero commission cut.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              id="post-job-cta-btn"
              onClick={onOpenPostJobModal}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post Job & Pre-Fund Escrow (+4%)</span>
            </button>
            <button
              onClick={() => onSelectTransaction('JS-2026-000184')}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>View Active Workspace #000184</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 2 Navigation Buttons below Header: [Find a Job] & [Your Posted Jobs] */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/90 pb-4">
        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            id="subtab-find-jobs-btn"
            onClick={() => setMarketplaceSubTab('find_jobs')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              marketplaceSubTab === 'find_jobs'
                ? 'bg-white text-[#1E3A8A] shadow-md shadow-slate-900/5 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find a Job</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 text-blue-900 font-bold">
              {jobs.length}
            </span>
          </button>

          <button
            type="button"
            id="subtab-posted-jobs-btn"
            onClick={() => setMarketplaceSubTab('posted_jobs')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              marketplaceSubTab === 'posted_jobs'
                ? 'bg-[#1E3A8A] text-white shadow-md shadow-blue-900/20 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Your Posted Jobs</span>
            {totalPendingApplicantsCount > 0 ? (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-400 text-slate-950 font-black animate-pulse">
                {totalPendingApplicantsCount} New
              </span>
            ) : (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 text-slate-700 font-bold">
                {employerPostedJobs.length}
              </span>
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <Shield className="w-3.5 h-3.5" />
            100% Escrow Backed
          </span>
        </div>
      </div>

      {/* SUB-VIEW 1: FIND A JOB (MARKETPLACE FEED) */}
      {marketplaceSubTab === 'find_jobs' && (
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Left Sidebar (4 cols) */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            {/* Worker Freemium & Pro Pass Banner */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white rounded-2xl p-5 sm:p-6 border border-amber-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {isProPass ? 'Worker Pro Pass' : 'Casual Freemium Plan'}
                    </h3>
                    <span className="text-xs text-amber-800 font-medium">
                      {isProPass ? 'Unlimited applications active' : '2 free daily applications'}
                    </span>
                  </div>
                </div>
                {isProPass && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold">
                    PRO ACTIVE ⭐
                  </span>
                )}
              </div>

              {/* Quota Progress */}
              <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Daily Applications Left:</span>
                  <span className="font-mono font-bold text-amber-700">
                    {isProPass ? '∞ Unlimited' : `${applicationCounter} / 2 Free`}
                  </span>
                </div>
                {!isProPass && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(applicationCounter / 2) * 100}%` }}
                    />
                  </div>
                )}
                <p className="text-[11px] text-slate-500 leading-tight">
                  {isProPass 
                    ? 'Your Pro Pass unlocks unlimited applications and priority placement.'
                    : applicationCounter > 0 
                      ? 'Casual tier includes 2 free applications/day (resets midnight).'
                      : 'Free daily limit reached. Upgrade to Pro Pass (50,000 VND/mo) for unlimited.'}
                </p>
              </div>

              {!isProPass ? (
                <button
                  onClick={onOpenProPassModal}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Get Pro Pass (50k VND / Month)</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Worker Badge & Priority Enabled</span>
                </div>
              )}
            </div>

            {/* Filter Controls Box */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900 uppercase tracking-wider font-mono">
                  <Filter className="w-4 h-4 text-blue-900" />
                  <span>Filter Opportunities</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedLocation('ALL');
                    setOnlyPinned(false);
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-blue-900 hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Pinned Only Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-bold text-xs text-slate-900">Featured Pins Only</div>
                    <div className="text-[10px] text-slate-500">Fast hire & pre-funded</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={onlyPinned}
                  onChange={(e) => setOnlyPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
              </label>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#1E3A8A] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-blue-900 cursor-pointer"
                >
                  <option value="ALL">All Provinces / Locations (Toàn Quốc)</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Remote">Remote / Online</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Right Job Cards Feed (8 cols) */}
          <section className="col-span-12 lg:col-span-8 space-y-4">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, skills, or tags (e.g. Photography, Translation, Canva)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No micro-jobs matched your filter</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search keywords or resetting categories to view all active opportunities.
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isChecklistOpen = !!expandedChecklists[job.id];
                const isWorkingActiveContract = job.id === 'JS-2026-000184';

                return (
                  <div
                    key={job.id}
                    className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                      job.isPinned
                        ? 'border-amber-300 ring-1 ring-amber-300/40'
                        : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Job Card Header Banner */}
                    <div className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-950 border border-blue-200">
                              {job.category}
                            </span>

                            {job.isPinned && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                                <span>Featured Pin (24h Boost)</span>
                              </span>
                            )}

                            {isWorkingActiveContract && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 font-mono">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Active Milestone in Progress</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug pt-1">
                            {job.title}
                          </h3>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <strong className="text-slate-700">{job.employerName}</strong> ({job.employerRating} ★)
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {job.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {job.executionDate}
                            </span>
                          </div>
                        </div>

                        {/* Financial Price Pill */}
                        <div className="text-right shrink-0">
                          <span className="text-[10px] uppercase font-mono text-slate-400 block">Worker Net Payout</span>
                          <div className="text-lg sm:text-2xl font-extrabold font-mono text-emerald-800">
                            {formatVND(job.payVND)}
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-emerald-200">
                            0% Worker Deductions
                          </span>
                        </div>
                      </div>

                      {/* Job Description */}
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {job.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Upfront Pre-funded Escrow Breakdown Tag */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Pre-funded Escrow:</span>
                          <strong className="font-mono text-slate-900">{formatVND(job.totalEmployerDepositVND || (job.payVND * 1.04))}</strong>
                          <span className="text-[11px] text-slate-400">(4% Employer Fee Pre-paid)</span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                          <Users className="w-3.5 h-3.5" />
                          <span>{job.applicantCount} Applicants</span>
                        </div>
                      </div>

                      {/* Collapsible Requirements Checklist */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => toggleChecklist(job.id)}
                          className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-slate-900 py-1.5 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>Deliverables & Milestone Requirements ({job.checklist.length})</span>
                          </span>
                          {isChecklistOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {isChecklistOpen && (
                          <div className="mt-2 p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5 animate-in fade-in duration-150">
                            {job.checklist.map((item, idx) => (
                              <div key={item.id} className="flex items-start gap-2 text-xs text-slate-700">
                                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-900 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                  {idx + 1}
                                </span>
                                <span>{item.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Funds held in JOBSAFE Safety Guarantee</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isWorkingActiveContract ? (
                          <button
                            type="button"
                            onClick={() => onSelectTransaction(job.id)}
                            className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-900/20 flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>Open Transaction Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : job.status === 'APPLIED' ? (
                          <button
                            type="button"
                            disabled
                            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 cursor-default"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Application Submitted</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onApplyJob(job)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>{isProPass ? 'Apply with Pro Pass' : 'Apply Now (1 Free Try)'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </div>
      )}

      {/* SUB-VIEW 2: YOUR POSTED JOBS (EMPLOYER DASHBOARD & APPLICANT REVIEW) */}
      {marketplaceSubTab === 'posted_jobs' && (
        <div className="space-y-6">
          {/* Header Summary for Employer */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-900 uppercase tracking-wider mb-1">
                <Briefcase className="w-4 h-4" />
                <span>EMPLOYER MANAGEMENT PORTAL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Your Pre-Funded Job Listings & Applicants
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Inspect applicant profiles, check verified identity CCCD badges, review pitches, and approve hires. Accepting an applicant locks the contract and starts the milestone workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenPostJobModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post Another Job (+4% Pre-funded)</span>
            </button>
          </div>

          {/* List of Employer's Posted Jobs */}
          <div className="space-y-6">
            {employerPostedJobs.map((job) => {
              const applicantsList = job.applicants || [];
              const pendingApplicants = applicantsList.filter(a => a.status === 'PENDING');
              const acceptedApplicant = applicantsList.find(a => a.status === 'ACCEPTED');

              return (
                <div 
                  key={job.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100"
                >
                  {/* Job Overview Bar */}
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            {job.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                            job.status === 'IN_PROGRESS' 
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                              : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}>
                            {job.status === 'IN_PROGRESS' ? 'IN PROGRESS (WORKER HIRED)' : 'OPEN FOR CANDIDATES'}
                          </span>
                          {job.isPinned && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                              <span>24h Featured Boost Active</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-extrabold text-slate-900">{job.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{job.category} • {job.location} • Posted {job.executionDate}</p>
                      </div>

                      {/* Financials & Quick Action */}
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block">Pre-Funded Safe Vault</span>
                          <div className="text-xl font-extrabold font-mono text-slate-900">
                            {formatVND(job.totalEmployerDepositVND || (job.payVND * 1.04))}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            {formatVND(job.payVND)} base + 4% service fee
                          </span>
                        </div>

                        {job.status === 'IN_PROGRESS' && (
                          <button
                            type="button"
                            onClick={() => onSelectTransaction(job.id)}
                            className="px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs shadow-md shadow-blue-900/20 flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>Open Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Applicants Review Area */}
                  <div className="p-6 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-900" />
                        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider font-mono">
                          Applicants Received ({applicantsList.length})
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {pendingApplicants.length} pending your review
                      </span>
                    </div>

                    {applicantsList.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-slate-400 text-xs">
                        No candidates have applied yet. Pinned boosts increase visibility by 3x.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {applicantsList.map((applicant) => (
                          <div
                            key={applicant.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                              applicant.status === 'ACCEPTED'
                                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20'
                                : applicant.status === 'REJECTED'
                                ? 'bg-slate-100/60 border-slate-200 opacity-60'
                                : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                            }`}
                          >
                            {/* Candidate Header */}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={applicant.avatar}
                                    alt={applicant.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1">
                                      <h5 className="font-extrabold text-xs text-slate-900 leading-tight">
                                        {applicant.name}
                                      </h5>
                                      {applicant.isIdentityVerified && (
                                        <span title="CCCD Chip Verified" className="inline-flex">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                                      <span className="text-amber-600 font-bold flex items-center gap-0.5">
                                        ★ {applicant.rating}
                                      </span>
                                      <span>•</span>
                                      <span>{applicant.completedJobsCount} jobs</span>
                                    </div>
                                  </div>
                                </div>

                                {applicant.isProPass && (
                                  <span className="px-1.5 py-0.5 rounded-sm bg-amber-400 text-slate-950 text-[9px] font-black font-mono">
                                    PRO ⭐
                                  </span>
                                )}
                              </div>

                              {/* Pitch Preview */}
                              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                                "{applicant.pitchNote}"
                              </p>
                            </div>

                            {/* Actions on Candidate */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenApplicantReview(job, applicant)}
                                className="text-[11px] font-bold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Check Profile</span>
                              </button>

                              {applicant.status === 'ACCEPTED' ? (
                                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Hired</span>
                                </span>
                              ) : applicant.status === 'REJECTED' ? (
                                <span className="text-[11px] text-slate-400 font-semibold">Rejected</span>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => onRejectApplicant && onRejectApplicant(job.id, applicant.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Decline"
                                  >
                                    <ThumbsDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setHireModalData({ isOpen: true, applicant, job })}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Hire</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Applicant Profile Inspection Modal */}
      <ApplicantProfileModal
        isOpen={selectedApplicantData.isOpen}
        onClose={() => setSelectedApplicantData(prev => ({ ...prev, isOpen: false }))}
        applicant={selectedApplicantData.applicant}
        job={selectedApplicantData.job}
        onAcceptApplicant={(jobId, applicant) => {
          setSelectedApplicantData(prev => ({ ...prev, isOpen: false }));
          const targetJob = jobs.find(j => j.id === jobId) || selectedApplicantData.job;
          setHireModalData({
            isOpen: true,
            job: targetJob,
            applicant
          });
        }}
        onRejectApplicant={(jobId, applicantId) => {
          if (onRejectApplicant) onRejectApplicant(jobId, applicantId);
          setSelectedApplicantData(prev => ({ ...prev, isOpen: false }));
        }}
      />

      {/* Hire & Auto-Reject Confirmation Modal */}
      <HireConfirmationModal
        isOpen={hireModalData.isOpen}
        onClose={() => setHireModalData(prev => ({ ...prev, isOpen: false }))}
        job={hireModalData.job}
        applicant={hireModalData.applicant}
        onConfirmHire={(jobId, applicant, autoRejectOthers) => {
          if (onAcceptApplicant) {
            onAcceptApplicant(jobId, applicant, autoRejectOthers);
          }
          setHireModalData(prev => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};
