export type JobStatus = 'OPEN' | 'APPLIED' | 'IN_PROGRESS' | 'SUBMITTED' | 'DISPUTED' | 'COMPLETED' | 'REFUNDED';

export type UserRole = 'employer' | 'worker';

export type TabType = 'marketplace' | 'transaction' | 'profile' | 'admin';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  required?: boolean;
  verifiedByEmployer?: boolean;
}

export interface ProofFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  previewUrl?: string;
  checklistIdRef?: string;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REVISION_REQUESTED';
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'System' | 'Employer' | 'Worker' | 'Admin';
  senderName?: string;
  text: string;
  timestamp: string;
  isAction?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  location: string;
  executionDate: string;
  payVND: number; // Base worker payout (100% net to worker)
  serviceFeeVND?: number; // 4% platform fee paid upfront by employer
  pinFeeVND?: number; // Optional 50k pin fee paid by employer
  totalEmployerPaidVND?: number; // Total upfront deposit = payVND + 4% service fee + pinFee
  isPinned: boolean;
  status: JobStatus;
  checklist: ChecklistItem[];
  proofFiles: ProofFile[];
  chatLogs: ChatMessage[];
  employerName: string;
  workerName: string;
  disputeReason?: string;
  resolutionNotes?: string;
  platformFeeVND?: number;
  workerPayoutVND?: number;
  employerRefundVND?: number;
  completedAt?: string;
  rating?: number;
  reviewComment?: string;
  actionRequiredSide?: 'employer' | 'worker' | 'both' | 'none';
  actionRequiredText?: string;
  contractType?: 'ACCEPTED_JOB' | 'POSTED_JOB';
}

export interface JobApplicant {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  isIdentityVerified: boolean;
  isProPass: boolean;
  appliedAt: string;
  pitchNote: string;
  portfolioUrl?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface AppNotification {
  id: string;
  roleTarget: 'employer' | 'worker' | 'both';
  title: string;
  message: string;
  timestamp: string;
  type: 'APPLICANT' | 'VERIFICATION' | 'PAYMENT' | 'CHAT' | 'SYSTEM';
  read: boolean;
  jobId?: string;
  transactionId?: string;
  actionTab?: TabType;
}

export interface JobListing {
  id: string;
  title: string;
  category: string;
  location: string;
  executionDate: string;
  payVND: number; // Base worker payout (100% net)
  serviceFeeVND?: number; // 4% upfront service fee (e.g. 20,000 VND for 500k)
  pinFeeVND?: number; // 50,000 VND if pinned
  totalEmployerDepositVND?: number; // payVND + serviceFeeVND + pinFeeVND
  isPinned: boolean;
  status: 'OPEN' | 'APPLIED' | 'IN_PROGRESS' | 'COMPLETED';
  employerName: string;
  employerRating: number;
  applicantCount: number;
  applicants?: JobApplicant[];
  checklist: ChecklistItem[];
  description: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  rating: number;
  reviewCount: number;
  isIdentityVerified: boolean;
  completedJobsCount: number;
  completionRate: number;
  disputeRate: number;
  avgEarningVND: number;
  badges: string[];
  bio: string;
  location: string;
  memberSince: string;
  isProPass?: boolean;
  proPassExpiresAt?: string;
  dailyFreeApplicationsLeft?: number;
}

export interface WalletTransactionItem {
  id: string;
  type: 'DEPOSIT' | 'ESCROW_LOCK' | 'ESCROW_RELEASE' | 'APPLICATION_FEE' | 'PRO_PASS_SUBSCRIPTION' | 'PIN_BOOST_FEE' | 'PLATFORM_FEE' | 'REFUND';
  amountVND: number;
  description: string;
  timestamp: string;
  relatedTransactionId?: string;
}
