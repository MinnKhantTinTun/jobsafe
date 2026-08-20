import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, AlertCircle, Info, Sparkles, X, ChevronRight, Award 
} from 'lucide-react';
import { TabType, UserRole, Transaction, JobListing, WalletTransactionItem, AppNotification, JobApplicant } from './types';
import { INITIAL_TRANSACTION, INITIAL_TRANSACTIONS, INITIAL_JOB_LISTINGS, INITIAL_WALLET_LEDGER, INITIAL_NOTIFICATIONS } from './data/mockData';
import { formatVND, calculateEscrowCommission } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { MarketplaceView } from './components/MarketplaceView';
import { TransactionView } from './components/TransactionView';
import { TransactionListView } from './components/TransactionListView';
import { ProfileView } from './components/ProfileView';
import { AdminDisputeView } from './components/AdminDisputeView';
import { WalletModal } from './components/WalletModal';
import { PaywallModal } from './components/PaywallModal';
import { PostJobModal } from './components/PostJobModal';
import { ReceiptModal } from './components/ReceiptModal';
import { NotificationCenter } from './components/NotificationCenter';

export default function App() {
  // Core Wallet & Financial State
  const [walletBalance, setWalletBalance] = useState<number>(500000); // User VND Wallet Balance
  const [applicationCounter, setApplicationCounter] = useState<number>(2); // Worker Free Applications Left (Casual: 2/day)
  const [isProPass, setIsProPass] = useState<boolean>(false); // Worker Pro Pass Active
  const [platformRevenue, setPlatformRevenue] = useState<number>(0); // Cumulative Platform Income
  const [currentTab, setCurrentTab] = useState<TabType>('marketplace'); // 'marketplace' | 'transaction' | 'profile' | 'admin'
  const [role, setRole] = useState<UserRole>('employer'); // 'employer' | 'worker'

  // Transactions Map for multi-job support
  const [transactionsMap, setTransactionsMap] = useState<Record<string, Transaction>>(() => {
    const map: Record<string, Transaction> = {};
    INITIAL_TRANSACTIONS.forEach(tx => {
      map[tx.id] = tx;
    });
    return map;
  });

  // Selected Transaction ID for detail view (null means showing the Transaction Hub list)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  // Active Transaction ID (fallback reference)
  const [activeTransactionId, setActiveTransactionId] = useState<string>('JS-2026-000184');

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('transactions/')) {
        const txId = hash.replace('transactions/', '');
        setCurrentTab('transaction');
        setSelectedTransactionId(txId);
      } else if (hash === 'transactions' || hash === 'transaction') {
        setCurrentTab('transaction');
        setSelectedTransactionId(null);
      } else if (hash === 'profile') {
        setCurrentTab('profile');
      } else if (hash === 'admin') {
        setCurrentTab('admin');
      } else if (hash === 'marketplace' || hash === '') {
        setCurrentTab('marketplace');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash on tab switch
  const navigateToTab = (tab: TabType, txId?: string | null) => {
    setCurrentTab(tab);
    if (tab === 'transaction') {
      if (txId) {
        setSelectedTransactionId(txId);
        window.location.hash = `#/transactions/${txId}`;
      } else {
        setSelectedTransactionId(null);
        window.location.hash = '#/transactions';
      }
    } else if (tab === 'marketplace') {
      window.location.hash = '#/marketplace';
    } else if (tab === 'profile') {
      window.location.hash = '#/profile';
    } else if (tab === 'admin') {
      window.location.hash = '#/admin';
    }
  };

  // Marketplace Jobs State
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOB_LISTINGS);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Wallet Transaction Ledger
  const [ledger, setLedger] = useState<WalletTransactionItem[]>(INITIAL_WALLET_LEDGER);

  // Modals state
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isProPassModalOpen, setIsProPassModalOpen] = useState(false);
  const [pendingApplyJob, setPendingApplyJob] = useState<JobListing | null>(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    isOpen: boolean;
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
  }>({
    isOpen: false,
    transactionId: 'JS-2026-000184',
    jobTitle: 'Product Photography - 100 Fashion Items',
    grossAmountVND: 500000,
    employerName: 'Shop Thời Trang X',
    workerName: 'Nguyễn Minh Anh'
  });

  // Dynamic Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Helper to get or dynamically instantiate a transaction for any job
  const getActiveTransaction = (): Transaction | null => {
    if (transactionsMap[activeTransactionId]) {
      return transactionsMap[activeTransactionId];
    }
    const targetJob = jobs.find(j => j.id === activeTransactionId);
    if (targetJob) {
      const { employerServiceFeeVND } = calculateEscrowCommission(targetJob.payVND);
      const newTx: Transaction = {
        id: targetJob.id,
        title: targetJob.title,
        category: targetJob.category,
        location: targetJob.location,
        executionDate: targetJob.executionDate,
        payVND: targetJob.payVND,
        serviceFeeVND: targetJob.serviceFeeVND || employerServiceFeeVND,
        pinFeeVND: targetJob.pinFeeVND || (targetJob.isPinned ? 50000 : 0),
        totalEmployerPaidVND: targetJob.totalEmployerDepositVND || Math.round(targetJob.payVND * 1.04),
        isPinned: targetJob.isPinned,
        status: targetJob.status === 'OPEN' ? 'IN_PROGRESS' : targetJob.status,
        checklist: targetJob.checklist.map(c => ({
          id: c.id,
          text: c.text,
          completed: c.completed || false,
          required: true,
          verifiedByEmployer: false
        })),
        proofFiles: [],
        chatLogs: [
          {
            id: `msg_init_${Date.now()}`,
            sender: 'System',
            text: `Upfront escrow of ${formatVND(targetJob.totalEmployerDepositVND || Math.round(targetJob.payVND * 1.04))} secured in vault. Worker receives 100% net earnings (${formatVND(targetJob.payVND)}) upon approval.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAction: true
          }
        ],
        employerName: targetJob.employerName,
        workerName: targetJob.applicants?.find(a => a.status === 'ACCEPTED')?.name || 'Nguyễn Minh Anh'
      };
      return newTx;
    }
    return transactionsMap['JS-2026-000184'] || null;
  };

  const activeTransaction = getActiveTransaction();

  // Deposit into wallet
  const handleDeposit = (amount: number, description: string) => {
    setWalletBalance(prev => prev + amount);
    const newTx: WalletTransactionItem = {
      id: `wtx_${Date.now()}`,
      type: 'DEPOSIT',
      amountVND: amount,
      description,
      timestamp: new Date().toLocaleString()
    };
    setLedger(prev => [newTx, ...prev]);
    showToast('Deposit Successful', `${formatVND(amount)} credited to your wallet.`, 'success');
  };

  // Switch / Select Transaction for any job
  const handleSelectTransaction = (jobId: string) => {
    setActiveTransactionId(jobId);
    setSelectedTransactionId(jobId);
    // If not already in transactionsMap, instantiate it
    if (!transactionsMap[jobId]) {
      const targetJob = jobs.find(j => j.id === jobId);
      if (targetJob) {
        const { employerServiceFeeVND } = calculateEscrowCommission(targetJob.payVND);
        const newTx: Transaction = {
          id: targetJob.id,
          title: targetJob.title,
          category: targetJob.category,
          location: targetJob.location,
          executionDate: targetJob.executionDate,
          payVND: targetJob.payVND,
          serviceFeeVND: targetJob.serviceFeeVND || employerServiceFeeVND,
          pinFeeVND: targetJob.pinFeeVND || (targetJob.isPinned ? 50000 : 0),
          totalEmployerPaidVND: targetJob.totalEmployerDepositVND || Math.round(targetJob.payVND * 1.04),
          isPinned: targetJob.isPinned,
          status: targetJob.status === 'OPEN' ? 'IN_PROGRESS' : targetJob.status,
          checklist: targetJob.checklist.map(c => ({
            id: c.id,
            text: c.text,
            completed: c.completed || false,
            required: true,
            verifiedByEmployer: false
          })),
          proofFiles: [],
          chatLogs: [
            {
              id: `msg_init_${Date.now()}`,
              sender: 'System',
              text: `Upfront escrow of ${formatVND(targetJob.totalEmployerDepositVND || Math.round(targetJob.payVND * 1.04))} secured in vault. Worker receives 100% net payout with 0 deductions.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAction: true
            }
          ],
          employerName: targetJob.employerName,
          workerName: targetJob.applicants?.find(a => a.status === 'ACCEPTED')?.name || 'Nguyễn Minh Anh'
        };
        setTransactionsMap(prev => ({ ...prev, [jobId]: newTx }));
      }
    }
    navigateToTab('transaction', jobId);
  };

  // Apply to job handler
  const handleApplyJob = (job: JobListing) => {
    if (job.id === activeTransactionId) {
      setCurrentTab('transaction');
      return;
    }

    const newApplicant: JobApplicant = {
      id: `app_${Date.now()}`,
      name: 'Nguyễn Minh Anh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewCount: 128,
      completedJobsCount: 128,
      isIdentityVerified: true,
      isProPass: isProPass,
      appliedAt: 'Just now',
      pitchNote: 'Ready to execute immediately with high quality and on-time milestone delivery.',
      status: 'PENDING'
    };

    if (isProPass) {
      setJobs(prev => prev.map(j => {
        if (j.id === job.id) {
          const currentApplicants = j.applicants || [];
          return { 
            ...j, 
            status: 'APPLIED', 
            applicantCount: j.applicantCount + 1,
            applicants: [newApplicant, ...currentApplicants]
          };
        }
        return j;
      }));

      // Add notification for Employer
      const newNoti: AppNotification = {
        id: `noti_${Date.now()}`,
        roleTarget: 'employer',
        title: 'New Applicant (⭐ Pro Pass)',
        message: `Nguyễn Minh Anh applied for '${job.title}'. Check profile & proposal.`,
        timestamp: 'Just now',
        type: 'APPLICANT',
        read: false,
        jobId: job.id,
        actionTab: 'marketplace'
      };
      setNotifications(prev => [newNoti, ...prev]);

      showToast(
        'Application Submitted (Pro Pass)!',
        `Unlimited application sent with Verified Worker Priority badge.`,
        'success'
      );
      return;
    }

    if (applicationCounter > 0) {
      setApplicationCounter(prev => prev - 1);
      setJobs(prev => prev.map(j => {
        if (j.id === job.id) {
          const currentApplicants = j.applicants || [];
          return { 
            ...j, 
            status: 'APPLIED', 
            applicantCount: j.applicantCount + 1,
            applicants: [newApplicant, ...currentApplicants]
          };
        }
        return j;
      }));

      // Add notification for Employer
      const newNoti: AppNotification = {
        id: `noti_${Date.now()}`,
        roleTarget: 'employer',
        title: 'New Job Applicant',
        message: `Nguyễn Minh Anh applied for '${job.title}'. Review proposal.`,
        timestamp: 'Just now',
        type: 'APPLICANT',
        read: false,
        jobId: job.id,
        actionTab: 'marketplace'
      };
      setNotifications(prev => [newNoti, ...prev]);

      showToast(
        'Application Submitted!',
        `Free application used (${applicationCounter - 1} remaining today).`,
        'success'
      );
    } else {
      setPendingApplyJob(job);
      setIsProPassModalOpen(true);
    }
  };

  // Employer Accepts Applicant (with Auto-Reject of other applicants)
  const handleAcceptApplicant = (jobId: string, applicant: JobApplicant, autoRejectOthers: boolean = true) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    const otherPending = (targetJob.applicants || []).filter(
      a => a.id !== applicant.id && a.status === 'PENDING'
    );

    // Update job status and applicant status
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const updatedApplicants = (j.applicants || []).map(a => {
          if (a.id === applicant.id) {
            return { ...a, status: 'ACCEPTED' as const };
          }
          if (autoRejectOthers && a.status === 'PENDING') {
            return { ...a, status: 'REJECTED' as const };
          }
          return a;
        });
        return {
          ...j,
          status: 'IN_PROGRESS',
          applicants: updatedApplicants
        };
      }
      return j;
    }));

    // Create or update active transaction
    const { employerServiceFeeVND } = calculateEscrowCommission(targetJob.payVND);
    const newTx: Transaction = {
      id: targetJob.id,
      title: targetJob.title,
      category: targetJob.category,
      location: targetJob.location,
      executionDate: targetJob.executionDate,
      payVND: targetJob.payVND,
      serviceFeeVND: targetJob.serviceFeeVND || employerServiceFeeVND,
      pinFeeVND: targetJob.pinFeeVND || 0,
      totalEmployerPaidVND: targetJob.totalEmployerDepositVND || Math.round(targetJob.payVND * 1.04),
      isPinned: targetJob.isPinned,
      status: 'IN_PROGRESS',
      checklist: targetJob.checklist.map(c => ({
        id: c.id,
        text: c.text,
        completed: false,
        required: true,
        verifiedByEmployer: false
      })),
      proofFiles: [],
      chatLogs: [
        {
          id: `msg_hired_${Date.now()}`,
          sender: 'System',
          text: `Contract started! Employer accepted ${applicant.name}. Escrow vault locked with 100% net earnings guarantee.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAction: true
        }
      ],
      employerName: targetJob.employerName,
      workerName: applicant.name
    };

    setTransactionsMap(prev => ({ ...prev, [jobId]: newTx }));
    setActiveTransactionId(jobId);
    setSelectedTransactionId(jobId);

    // Notifications
    const newNotifications: AppNotification[] = [];

    // Notification to accepted worker
    newNotifications.push({
      id: `noti_hired_w_${Date.now()}`,
      roleTarget: 'worker',
      title: 'Application Accepted! 🎉',
      message: `${targetJob.employerName} hired you for '${targetJob.title}'. Upfront escrow is ready in workspace.`,
      timestamp: 'Just now',
      type: 'PAYMENT',
      read: false,
      transactionId: jobId,
      actionTab: 'transaction'
    });

    // Notification to employer
    newNotifications.push({
      id: `noti_hired_e_${Date.now()}`,
      roleTarget: 'employer',
      title: 'Contract Activated',
      message: `You hired ${applicant.name} for '${targetJob.title}'. Milestone workspace is now active.`,
      timestamp: 'Just now',
      type: 'VERIFICATION',
      read: false,
      transactionId: jobId,
      actionTab: 'transaction'
    });

    // Auto-rejection notifications to other applicants
    if (autoRejectOthers && otherPending.length > 0) {
      otherPending.forEach((other, index) => {
        newNotifications.push({
          id: `noti_rej_${other.id}_${Date.now()}_${index}`,
          roleTarget: 'worker',
          title: 'Position Filled',
          message: `Another candidate was selected for '${targetJob.title}'. Thank you for your application!`,
          timestamp: 'Just now',
          type: 'SYSTEM',
          read: false,
          actionTab: 'marketplace'
        });
      });
    }

    setNotifications(prev => [...newNotifications, ...prev]);

    showToast(
      'Worker Hired & Contract Started!',
      otherPending.length > 0
        ? `${applicant.name} hired. ${otherPending.length} other candidate(s) auto-notified and declined.`
        : `${applicant.name} is assigned to ${targetJob.title}. Workspace activated.`,
      'success'
    );
  };

  // Employer Rejects Applicant
  const handleRejectApplicant = (jobId: string, applicantId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const updatedApplicants = (j.applicants || []).map(a => 
          a.id === applicantId ? { ...a, status: 'REJECTED' as const } : a
        );
        return { ...j, applicants: updatedApplicants };
      }
      return j;
    }));

    showToast('Applicant Declined', 'The candidate has been marked as rejected.', 'info');
  };

  // Notification interaction handlers
  const handleSelectNotification = (noti: AppNotification) => {
    // Mark this notification as read
    setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, read: true } : n));

    if (noti.transactionId) {
      handleSelectTransaction(noti.transactionId);
    } else if (noti.jobId) {
      setCurrentTab('marketplace');
    } else if (noti.actionTab) {
      setCurrentTab(noti.actionTab);
    }
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All Read', 'All notifications marked as read.', 'info');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    showToast('Cleared', 'Notification history cleared.', 'info');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Subscribe to Pro Pass (50,000 VND / month)
  const handleSubscribeProPass = () => {
    if (walletBalance < 50000) {
      showToast('Insufficient Balance', 'Please top up at least 50,000 VND to activate Pro Pass.', 'warning');
      setIsWalletOpen(true);
      return;
    }

    setWalletBalance(prev => prev - 50000);
    setPlatformRevenue(prev => prev + 50000);
    setIsProPass(true);

    const proTx: WalletTransactionItem = {
      id: `wtx_pro_${Date.now()}`,
      type: 'PRO_PASS_SUBSCRIPTION',
      amountVND: 50000,
      description: 'Worker Pro Pass Monthly Subscription (Unlimited Applications + Verified Badge)',
      timestamp: new Date().toLocaleString()
    };
    setLedger(prev => [proTx, ...prev]);

    setIsProPassModalOpen(false);

    if (pendingApplyJob) {
      handleApplyJob(pendingApplyJob);
      setPendingApplyJob(null);
    }

    showToast(
      'Worker Pro Pass Activated ⭐',
      'You now have unlimited applications, priority ranking, and a Verified Worker badge.',
      'success'
    );
  };

  // Post new job & lock upfront escrow (+4% service fee and optional 50k pin)
  const handlePostJob = (newJob: JobListing, totalDeposit: number) => {
    if (walletBalance < totalDeposit) return;

    setWalletBalance(prev => prev - totalDeposit);

    const lockTx: WalletTransactionItem = {
      id: `wtx_lock_${Date.now()}`,
      type: 'ESCROW_LOCK',
      amountVND: totalDeposit,
      description: `Upfront Escrow Secured for Job (${newJob.id}): ${formatVND(newJob.payVND)} budget + 4% service fee (${formatVND(newJob.serviceFeeVND || Math.round(newJob.payVND * 0.04))})${newJob.isPinned ? ' + 50k Pin Boost' : ''}`,
      timestamp: new Date().toLocaleString()
    };
    setLedger(prev => [lockTx, ...prev]);

    if (newJob.isPinned) {
      setPlatformRevenue(prev => prev + 50000);
    }

    setJobs(prev => [newJob, ...prev]);

    // Add notification
    const jobNoti: AppNotification = {
      id: `noti_job_${Date.now()}`,
      roleTarget: 'employer',
      title: 'Job Live on Marketplace',
      message: `'${newJob.title}' is live. Escrow of ${formatVND(totalDeposit)} locked in safe vault.`,
      timestamp: 'Just now',
      type: 'SYSTEM',
      read: false,
      jobId: newJob.id,
      actionTab: 'marketplace'
    };
    setNotifications(prev => [jobNoti, ...prev]);

    showToast(
      'Job Posted & Escrow Pre-Funded!',
      `Pre-funded ${formatVND(totalDeposit)} into JOBSAFE Escrow Partner Vault (4% service fee included).`,
      'success'
    );
  };

  // Update active transaction state
  const handleUpdateTransaction = (updatedFields: Partial<Transaction>) => {
    const targetId = selectedTransactionId || activeTransactionId;
    const currentTx = transactionsMap[targetId] || activeTransaction;
    if (!currentTx) return;
    const updated = { ...currentTx, ...updatedFields };
    setTransactionsMap(prev => ({ ...prev, [targetId]: updated }));
  };

  // Release Escrow (Employer releases full 100% net budget to worker)
  const handleReleaseEscrow = (payVND: number) => {
    const targetId = selectedTransactionId || activeTransactionId;
    const currentTx = transactionsMap[targetId] || activeTransaction;
    if (!currentTx) return;
    const { employerServiceFeeVND, workerNetVND } = calculateEscrowCommission(payVND);

    setWalletBalance(prev => prev + workerNetVND);
    setPlatformRevenue(prev => prev + employerServiceFeeVND);

    const releaseTx: WalletTransactionItem = {
      id: `wtx_rel_${Date.now()}`,
      type: 'ESCROW_RELEASE',
      amountVND: workerNetVND,
      description: `Net Payout for ${currentTx.id} (100% Net - 0% worker deduction. Platform recognized ${formatVND(employerServiceFeeVND)} fee from employer)`,
      timestamp: new Date().toLocaleString(),
      relatedTransactionId: currentTx.id
    };
    setLedger(prev => [releaseTx, ...prev]);

    setJobs(prev => prev.map(j => j.id === currentTx.id ? { ...j, status: 'COMPLETED' } : j));

    setReceiptData({
      isOpen: true,
      transactionId: currentTx.id,
      jobTitle: currentTx.title,
      grossAmountVND: payVND,
      platformFeeVND: employerServiceFeeVND,
      workerNetVND,
      employerRefundVND: 0,
      employerName: currentTx.employerName,
      workerName: currentTx.workerName,
      completedAt: new Date().toLocaleString() + ' GMT+7',
      resolutionType: 'EMPLOYER_APPROVAL_RELEASE'
    });

    // Notification for worker
    const payoutNoti: AppNotification = {
      id: `noti_payout_${Date.now()}`,
      roleTarget: 'worker',
      title: 'Payment Released! 💸',
      message: `${formatVND(workerNetVND)} (100% Net) credited to your wallet for '${currentTx.title}'.`,
      timestamp: 'Just now',
      type: 'PAYMENT',
      read: false,
      transactionId: currentTx.id,
      actionTab: 'profile'
    };
    setNotifications(prev => [payoutNoti, ...prev]);

    showToast(
      'Payment Released & Settled!',
      `Worker received ${formatVND(workerNetVND)} (100% Net Payout with 0 deductions).`,
      'success'
    );
  };

  // Admin Override Execution
  const handleAdminResolve = (
    resolution: 'FULL_RELEASE' | 'PARTIAL_SPLIT' | 'FULL_REFUND',
    splitData?: {
      workerPercent: number;
      workerNetVND: number;
      employerRefundVND: number;
      platformFeeVND: number;
    }
  ) => {
    if (!activeTransaction) return;
    const nowStr = new Date().toLocaleString() + ' GMT+7';

    if (resolution === 'FULL_RELEASE') {
      const { employerServiceFeeVND, workerNetVND } = calculateEscrowCommission(activeTransaction.payVND);
      setWalletBalance(prev => prev + workerNetVND);
      setPlatformRevenue(prev => prev + employerServiceFeeVND);

      const sysMsg = {
        id: `sys_adm_${Date.now()}`,
        sender: 'Admin' as const,
        text: `ADMIN ARBITRATION OVERRIDE: Full Release awarded to Worker (${formatVND(workerNetVND)} 100% Net, ${formatVND(employerServiceFeeVND)} employer fee recognized).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAction: true
      };

      const updated = {
        ...activeTransaction,
        status: 'COMPLETED' as const,
        completedAt: nowStr,
        platformFeeVND: employerServiceFeeVND,
        workerPayoutVND: workerNetVND,
        employerRefundVND: 0,
        chatLogs: [...activeTransaction.chatLogs, sysMsg]
      };

      setTransactionsMap(prev => ({ ...prev, [activeTransaction.id]: updated }));

      setReceiptData({
        isOpen: true,
        transactionId: activeTransaction.id,
        jobTitle: activeTransaction.title,
        grossAmountVND: activeTransaction.payVND,
        platformFeeVND: employerServiceFeeVND,
        workerNetVND,
        employerRefundVND: 0,
        employerName: activeTransaction.employerName,
        workerName: activeTransaction.workerName,
        completedAt: nowStr,
        resolutionType: 'ADMIN_FULL_RELEASE_OVERRIDE'
      });

      showToast('Admin Full Release Executed', `${formatVND(workerNetVND)} transferred to worker with 0% worker deduction.`, 'success');
    } else if (resolution === 'PARTIAL_SPLIT' && splitData) {
      setWalletBalance(prev => prev + splitData.workerNetVND + splitData.employerRefundVND);
      setPlatformRevenue(prev => prev + splitData.platformFeeVND);

      const sysMsg = {
        id: `sys_adm_${Date.now()}`,
        sender: 'Admin' as const,
        text: `ADMIN ARBITRATION OVERRIDE: Partial Settlement executed (${splitData.workerPercent}% Worker / ${100 - splitData.workerPercent}% Employer). Worker Net: ${formatVND(splitData.workerNetVND)}, Employer Refund: ${formatVND(splitData.employerRefundVND)}, Platform Fee: ${formatVND(splitData.platformFeeVND)}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAction: true
      };

      const updated = {
        ...activeTransaction,
        status: 'COMPLETED' as const,
        completedAt: nowStr,
        platformFeeVND: splitData.platformFeeVND,
        workerPayoutVND: splitData.workerNetVND,
        employerRefundVND: splitData.employerRefundVND,
        chatLogs: [...activeTransaction.chatLogs, sysMsg]
      };

      setTransactionsMap(prev => ({ ...prev, [activeTransaction.id]: updated }));

      setReceiptData({
        isOpen: true,
        transactionId: activeTransaction.id,
        jobTitle: activeTransaction.title,
        grossAmountVND: activeTransaction.payVND,
        platformFeeVND: splitData.platformFeeVND,
        workerNetVND: splitData.workerNetVND,
        employerRefundVND: splitData.employerRefundVND,
        employerName: activeTransaction.employerName,
        workerName: activeTransaction.workerName,
        completedAt: nowStr,
        resolutionType: `ADMIN_PARTIAL_SPLIT (${splitData.workerPercent}% / ${100 - splitData.workerPercent}%)`
      });

      showToast('Admin Partial Split Executed', `Split settled: Worker ${formatVND(splitData.workerNetVND)}, Employer Refund ${formatVND(splitData.employerRefundVND)}.`, 'success');
    } else if (resolution === 'FULL_REFUND') {
      setWalletBalance(prev => prev + activeTransaction.payVND);

      const sysMsg = {
        id: `sys_adm_${Date.now()}`,
        sender: 'Admin' as const,
        text: `ADMIN ARBITRATION OVERRIDE: Full Refund returned 100% escrow (${formatVND(activeTransaction.payVND)}) back to Employer. Platform fee waived (0 VND).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAction: true
      };

      const updated = {
        ...activeTransaction,
        status: 'REFUNDED' as const,
        completedAt: nowStr,
        platformFeeVND: 0,
        workerPayoutVND: 0,
        employerRefundVND: activeTransaction.payVND,
        chatLogs: [...activeTransaction.chatLogs, sysMsg]
      };

      setTransactionsMap(prev => ({ ...prev, [activeTransaction.id]: updated }));

      setReceiptData({
        isOpen: true,
        transactionId: activeTransaction.id,
        jobTitle: activeTransaction.title,
        grossAmountVND: activeTransaction.payVND,
        platformFeeVND: 0,
        workerNetVND: 0,
        employerRefundVND: activeTransaction.payVND,
        employerName: activeTransaction.employerName,
        workerName: activeTransaction.workerName,
        completedAt: nowStr,
        resolutionType: 'ADMIN_FULL_REFUND_OVERRIDE'
      });

      showToast('Admin Full Refund Executed', `${formatVND(activeTransaction.payVND)} returned to employer.`, 'info');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans flex flex-col selection:bg-blue-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => navigateToTab(tab)}
        role={role}
        setRole={setRole}
        walletBalance={walletBalance}
        applicationCounter={applicationCounter}
        isProPass={isProPass}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenProPassModal={() => setIsProPassModalOpen(true)}
        transactionStatus={activeTransaction?.status || 'OPEN'}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 w-full">
        {currentTab === 'marketplace' && (
          <MarketplaceView
            jobs={jobs}
            role={role}
            applicationCounter={applicationCounter}
            isProPass={isProPass}
            onOpenProPassModal={() => setIsProPassModalOpen(true)}
            onApplyJob={handleApplyJob}
            onOpenPostJobModal={() => setIsPostJobOpen(true)}
            onSelectTransaction={handleSelectTransaction}
            onAcceptApplicant={handleAcceptApplicant}
            onRejectApplicant={handleRejectApplicant}
          />
        )}

        {currentTab === 'transaction' && (
          selectedTransactionId && transactionsMap[selectedTransactionId] ? (
            <TransactionView
              transaction={transactionsMap[selectedTransactionId]}
              role={role}
              onBackToList={() => {
                setSelectedTransactionId(null);
                navigateToTab('transaction', null);
              }}
              onUpdateTransaction={handleUpdateTransaction}
              onReleaseEscrow={handleReleaseEscrow}
              onSwitchRole={() => setRole(role === 'employer' ? 'worker' : 'employer')}
              onNavigateTab={(tab) => navigateToTab(tab)}
              onOpenPostJobModal={() => setIsPostJobOpen(true)}
              onShowReceipt={() => {
                const targetTx = transactionsMap[selectedTransactionId];
                if (!targetTx) return;
                const { employerServiceFeeVND, workerNetVND } = calculateEscrowCommission(targetTx.payVND);
                setReceiptData({
                  isOpen: true,
                  transactionId: targetTx.id,
                  jobTitle: targetTx.title,
                  grossAmountVND: targetTx.payVND,
                  platformFeeVND: employerServiceFeeVND,
                  workerNetVND,
                  employerRefundVND: 0,
                  employerName: targetTx.employerName,
                  workerName: targetTx.workerName,
                  completedAt: targetTx.completedAt || '2026-08-25 18:30 GMT+7',
                  resolutionType: 'EMPLOYER_APPROVAL_RELEASE'
                });
              }}
            />
          ) : (
            <TransactionListView
              transactions={Object.values(transactionsMap)}
              role={role}
              onSelectTransaction={(id) => {
                setSelectedTransactionId(id);
                setActiveTransactionId(id);
                navigateToTab('transaction', id);
              }}
              onSwitchRole={() => setRole(role === 'employer' ? 'worker' : 'employer')}
              onNavigateTab={(tab) => navigateToTab(tab)}
            />
          )
        )}

        {currentTab === 'profile' && (
          <ProfileView
            role={role}
            onSwitchRole={setRole}
            onOpenReceipt={(txData) => {
              setReceiptData({
                isOpen: true,
                transactionId: txData.id,
                jobTitle: txData.title,
                grossAmountVND: txData.grossVND,
                platformFeeVND: txData.feeVND,
                workerNetVND: txData.netVND,
                employerRefundVND: 0,
                employerName: txData.employer,
                workerName: txData.worker || 'Nguyễn Minh Anh',
                completedAt: txData.date,
                resolutionType: 'COMPLETED_ESCROW_RELEASE'
              });
            }}
          />
        )}

        {currentTab === 'admin' && activeTransaction && (
          <AdminDisputeView
            transaction={activeTransaction}
            platformRevenue={platformRevenue}
            onAdminResolve={handleAdminResolve}
            onSelectTransactionTab={() => navigateToTab('transaction')}
          />
        )}
      </main>

      {/* Floating Notification Center Bubble & Popover */}
      <NotificationCenter
        notifications={notifications}
        role={role}
        onSelectNotification={handleSelectNotification}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onClearNotifications={handleClearNotifications}
        onDeleteNotification={handleDeleteNotification}
      />

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 px-4 sm:px-6 py-3 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">JOBSAFE VIETNAM</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Trusted Micro-Job Safety Guarantee Network v2.5.0</span>
          </div>

          <div className="flex items-center gap-4 uppercase tracking-widest text-[10px] text-slate-400">
            <span>User: Nguyen Minh Anh</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {isProPass ? 'Pro Pass Verified Worker ⭐' : 'Identity Verified'}
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        walletBalance={walletBalance}
        onDeposit={handleDeposit}
        ledger={ledger}
      />

      <PaywallModal
        isOpen={isProPassModalOpen}
        onClose={() => {
          setIsProPassModalOpen(false);
          setPendingApplyJob(null);
        }}
        walletBalance={walletBalance}
        onSubscribeProPass={handleSubscribeProPass}
        onOpenDeposit={() => setIsWalletOpen(true)}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        walletBalance={walletBalance}
        onPostJob={handlePostJob}
        onOpenDeposit={() => setIsWalletOpen(true)}
      />

      <ReceiptModal
        isOpen={receiptData.isOpen}
        onClose={() => setReceiptData(prev => ({ ...prev, isOpen: false }))}
        transactionId={receiptData.transactionId}
        jobTitle={receiptData.jobTitle}
        grossAmountVND={receiptData.grossAmountVND}
        platformFeeVND={receiptData.platformFeeVND}
        workerNetVND={receiptData.workerNetVND}
        employerRefundVND={receiptData.employerRefundVND}
        employerName={receiptData.employerName}
        workerName={receiptData.workerName}
        completedAt={receiptData.completedAt}
        resolutionType={receiptData.resolutionType}
      />

      {/* Dynamic Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-4 sm:left-auto right-4 sm:right-24 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-sm">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/40 shadow-emerald-950/20'
              : toastMessage.type === 'warning'
              ? 'bg-red-950 text-white border-red-500/40 shadow-red-950/20'
              : 'bg-slate-900 text-white border-blue-500/40 shadow-blue-950/20'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              toastMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : toastMessage.type === 'warning' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : toastMessage.type === 'warning' ? <AlertCircle className="w-5 h-5 text-red-400" /> : <Info className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-xs leading-tight text-white">{toastMessage.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toastMessage.desc}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
