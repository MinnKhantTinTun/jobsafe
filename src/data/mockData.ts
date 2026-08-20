import { JobListing, Transaction, UserProfile, WalletTransactionItem, AppNotification } from '../types';

export const INITIAL_TRANSACTION: Transaction = {
  id: "JS-2026-000184",
  title: "Product Photography - 100 Fashion Items",
  category: "Product Photography",
  location: "District 1, Ho Chi Minh City",
  executionDate: "2026-08-25",
  payVND: 500000, // 100% net to worker
  serviceFeeVND: 20000, // 4% service fee paid by employer
  pinFeeVND: 50000, // 50,000 VND featured pin fee
  totalEmployerPaidVND: 570000, // 500k base + 20k fee + 50k pin
  isPinned: true,
  status: "IN_PROGRESS",
  actionRequiredSide: "employer",
  actionRequiredText: "Worker submitted Batch 1 deliverables. Employer review & checklist verification requested.",
  contractType: "POSTED_JOB",
  checklist: [
    { id: "c1", text: "Photograph 100 products on clean background", completed: true, required: true, verifiedByEmployer: true },
    { id: "c2", text: "Provide 3 high-res photos per product", completed: true, required: true, verifiedByEmployer: false },
    { id: "c3", text: "Deliver raw files by 6:00 PM", completed: false, required: true, verifiedByEmployer: false }
  ],
  proofFiles: [
    {
      id: "pf-1",
      name: "lookbook_white_bg_sample_batch1.zip",
      size: "84.2 MB",
      type: "application/zip",
      uploadedAt: "04:15 PM",
      previewUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80",
      checklistIdRef: "c1",
      verificationStatus: "APPROVED",
      feedback: "White balance and background framing look great."
    },
    {
      id: "pf-2",
      name: "raw_cr3_fashion_100items_part1.raw",
      size: "142.0 MB",
      type: "image/x-canon-cr3",
      uploadedAt: "05:10 PM",
      previewUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80",
      checklistIdRef: "c2",
      verificationStatus: "PENDING"
    }
  ],
  chatLogs: [
    { id: "m1", sender: "System", text: "Employer pre-funded 570,000 VND (500,000 VND worker budget + 20,000 VND 4% service fee + 50,000 VND Featured Pin). Secured safely in partner escrow vault. Worker receives full 500,000 VND (0% deductions).", timestamp: "09:00 AM", isAction: true },
    { id: "m2", sender: "Employer", text: "Hi Anh, please make sure the lighting is bright and even for the silk blouses.", timestamp: "09:05 AM" },
    { id: "m3", sender: "Worker", text: "Got it! I am using a dual softbox setup with 5500K daylight balance.", timestamp: "09:12 AM" },
    { id: "m4", sender: "Worker", text: "Batch 1 and RAW sample files have been uploaded to the proof workspace for review.", timestamp: "05:15 PM" }
  ],
  employerName: "Shop Thời Trang X",
  workerName: "Nguyễn Minh Anh"
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  INITIAL_TRANSACTION,
  {
    id: "JS-2026-000192",
    title: "Vietnamese to English Menu Translation (40 Dishes)",
    category: "Translation & Content",
    location: "Da Nang / Remote",
    executionDate: "2026-08-26",
    payVND: 350000,
    serviceFeeVND: 14000,
    pinFeeVND: 50000,
    totalEmployerPaidVND: 414000,
    isPinned: true,
    status: "IN_PROGRESS",
    actionRequiredSide: "worker",
    actionRequiredText: "Worker translating dishes 1-40. Milestone proof upload due by 18:00.",
    contractType: "ACCEPTED_JOB",
    checklist: [
      { id: "c21", text: "Translate 40 dish names and detailed ingredient descriptions", completed: true, required: true, verifiedByEmployer: true },
      { id: "c22", text: "Format in two-column print-ready Canva template", completed: false, required: true, verifiedByEmployer: false },
      { id: "c23", text: "Proofread culinary terms with allergen warnings", completed: false, required: true, verifiedByEmployer: false }
    ],
    proofFiles: [
      {
        id: "pf-21",
        name: "menu_draft_vietnamese_english_v1.pdf",
        size: "3.4 MB",
        type: "application/pdf",
        uploadedAt: "11:20 AM",
        checklistIdRef: "c21",
        verificationStatus: "APPROVED",
        feedback: "Translations are natural and accurately capture Vietnamese culinary nuances."
      }
    ],
    chatLogs: [
      { id: "tm1", sender: "System", text: "Escrow locked: 414,000 VND (350,000 VND worker net + 14,000 VND platform fee + 50k pin).", timestamp: "08:30 AM", isAction: true },
      { id: "tm2", sender: "Employer", text: "Please ensure chili spice levels are clearly noted for foreign tourists.", timestamp: "08:45 AM" },
      { id: "tm3", sender: "Worker", text: "Understood! I added 3-tier heat indicators for every spicy item.", timestamp: "11:22 AM" }
    ],
    employerName: "Bếp Cơm Mẹ Nấu",
    workerName: "Phạm Thảo Vy"
  },
  {
    id: "JS-2026-000195",
    title: "Shopee Live Stream Technical Host Assistant",
    category: "Live Commerce",
    location: "District 7, Ho Chi Minh City",
    executionDate: "2026-08-25",
    payVND: 450000,
    serviceFeeVND: 18000,
    pinFeeVND: 0,
    totalEmployerPaidVND: 468000,
    isPinned: false,
    status: "IN_PROGRESS",
    actionRequiredSide: "none",
    actionRequiredText: "Live stream studio broadcast session scheduled for 19:00 tonight.",
    contractType: "ACCEPTED_JOB",
    checklist: [
      { id: "c31", text: "Test OBS streaming bitrate and audio sync", completed: true, required: true, verifiedByEmployer: true },
      { id: "c32", text: "Pin voucher links on Shopee Live dashboard during 3-hour stream", completed: false, required: true, verifiedByEmployer: false },
      { id: "c33", text: "Log top customer inquiries and voucher conversions", completed: false, required: true, verifiedByEmployer: false }
    ],
    proofFiles: [],
    chatLogs: [
      { id: "sm1", sender: "System", text: "Escrow pre-funded: 468,000 VND safely held in vault. Worker guaranteed 450,000 VND net.", timestamp: "10:00 AM", isAction: true },
      { id: "sm2", sender: "Employer", text: "Studio setup is in Crescent Mall D7. See you at 18:30 for sound check!", timestamp: "10:15 AM" }
    ],
    employerName: "Shop Mỹ Phẩm Hana",
    workerName: "Nguyễn Minh Anh"
  },
  {
    id: "JS-2026-000172",
    title: "Shopee Live Stream Assistant (3 Hours)",
    category: "Live Commerce",
    location: "District 3, Ho Chi Minh City",
    executionDate: "2026-08-15",
    payVND: 450000,
    serviceFeeVND: 18000,
    pinFeeVND: 0,
    totalEmployerPaidVND: 468000,
    isPinned: false,
    status: "COMPLETED",
    completedAt: "2026-08-15 21:30 GMT+7",
    actionRequiredSide: "none",
    actionRequiredText: "Payment settled (100% Net). Receipt available in profile.",
    contractType: "ACCEPTED_JOB",
    checklist: [
      { id: "c171", text: "Manage live stream queue and pin promo items", completed: true, required: true, verifiedByEmployer: true },
      { id: "c172", text: "Assist streamer with sample swatches", completed: true, required: true, verifiedByEmployer: true }
    ],
    proofFiles: [
      {
        id: "pf-171",
        name: "stream_metrics_summary_hana.png",
        size: "1.2 MB",
        type: "image/png",
        uploadedAt: "09:30 PM",
        verificationStatus: "APPROVED"
      }
    ],
    chatLogs: [
      { id: "lm1", sender: "System", text: "Milestone Completed! Full payment of 450,000 VND released to worker wallet.", timestamp: "09:35 PM", isAction: true }
    ],
    employerName: "Shop Mỹ Phẩm Hana",
    workerName: "Nguyễn Minh Anh"
  }
];

export const INITIAL_JOB_LISTINGS: JobListing[] = [
  {
    id: "JS-2026-000184",
    title: "Product Photography - 100 Fashion Items",
    category: "Product Photography",
    location: "District 1, Ho Chi Minh City",
    executionDate: "2026-08-25",
    payVND: 500000,
    serviceFeeVND: 20000,
    pinFeeVND: 50000,
    totalEmployerDepositVND: 570000,
    isPinned: true,
    status: "IN_PROGRESS",
    employerName: "Shop Thời Trang X",
    employerRating: 4.9,
    applicantCount: 3,
    applicants: [
      {
        id: "app-1",
        name: "Nguyễn Minh Anh",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 128,
        completedJobsCount: 128,
        isIdentityVerified: true,
        isProPass: true,
        appliedAt: "10 mins ago",
        pitchNote: "I have Sony A7IV + studio softboxes ready. Can shoot the 100 items today in District 1 studio and deliver RAWs by 6 PM.",
        status: "ACCEPTED"
      },
      {
        id: "app-2",
        name: "Lê Hoàng Phúc",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        rating: 4.8,
        reviewCount: 64,
        completedJobsCount: 59,
        isIdentityVerified: true,
        isProPass: false,
        appliedAt: "25 mins ago",
        pitchNote: "Professional product photographer with Canon R6. Specializing in lookbooks and fashion e-commerce.",
        status: "PENDING"
      },
      {
        id: "app-3",
        name: "Trần Bảo Nam",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        rating: 4.7,
        reviewCount: 32,
        completedJobsCount: 30,
        isIdentityVerified: true,
        isProPass: false,
        appliedAt: "1 hour ago",
        pitchNote: "Available immediately. I have a portable studio lightbox and can come to your boutique in D1.",
        status: "PENDING"
      }
    ],
    checklist: [
      { id: "c1", text: "Photograph 100 products on clean background", completed: true },
      { id: "c2", text: "Provide 3 high-res photos per product", completed: true },
      { id: "c3", text: "Deliver raw files by 6:00 PM", completed: false }
    ],
    description: "Need an experienced photographer with basic lighting gear to shoot 100 fashion items (dresses, tops, skirts) on seamless white backdrop.",
    tags: ["Studio", "Photography", "Fashion", "Same Day"]
  },
  {
    id: "JS-2026-000192",
    title: "Vietnamese to English Menu Translation (40 Dishes)",
    category: "Translation & Content",
    location: "Da Nang / Remote",
    executionDate: "2026-08-26",
    payVND: 350000,
    serviceFeeVND: 14000,
    pinFeeVND: 50000,
    totalEmployerDepositVND: 414000,
    isPinned: true,
    status: "OPEN",
    employerName: "Bếp Cơm Mẹ Nấu",
    employerRating: 5.0,
    applicantCount: 2,
    applicants: [
      {
        id: "app-21",
        name: "Phạm Thảo Vy",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        rating: 5.0,
        reviewCount: 41,
        completedJobsCount: 41,
        isIdentityVerified: true,
        isProPass: true,
        appliedAt: "15 mins ago",
        pitchNote: "IELTS 8.0 with 3 years culinary translation experience for Da Nang & Hoi An boutique hotels.",
        status: "PENDING"
      },
      {
        id: "app-22",
        name: "Đỗ Quốc Huy",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
        rating: 4.8,
        reviewCount: 28,
        completedJobsCount: 26,
        isIdentityVerified: true,
        isProPass: false,
        appliedAt: "45 mins ago",
        pitchNote: "Fluent in English with food blog background. Can finish within 3 hours.",
        status: "PENDING"
      }
    ],
    checklist: [
      { id: "t1", text: "Translate 40 dish names & ingredient descriptions", completed: false },
      { id: "t2", text: "Format into provided Excel template with dietary tags", completed: false },
      { id: "t3", text: "Check phonetic spelling for foreign tourists", completed: false }
    ],
    description: "Translate traditional Central Vietnamese restaurant menu for international tourists with appealing culinary descriptions.",
    tags: ["Translation", "English", "Culinary", "Remote"]
  },
  {
    id: "JS-2026-000195",
    title: "Shopee & TikTok Shop Banner Design (Set of 6)",
    category: "Graphic Design",
    location: "Hanoi / Remote",
    executionDate: "2026-08-27",
    payVND: 600000,
    serviceFeeVND: 24000,
    pinFeeVND: 0,
    totalEmployerDepositVND: 624000,
    isPinned: false,
    status: "OPEN",
    employerName: "Shop Thời Trang X",
    employerRating: 4.9,
    applicantCount: 3,
    applicants: [
      {
        id: "app-31",
        name: "Vũ Khánh Linh",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 52,
        completedJobsCount: 50,
        isIdentityVerified: true,
        isProPass: true,
        appliedAt: "30 mins ago",
        pitchNote: "Figma UI/UX & Shopee Mall banner specialist. Can provide interactive Figma link + instant PNG exports.",
        status: "PENDING"
      },
      {
        id: "app-32",
        name: "Trần Minh Quang",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
        rating: 4.7,
        reviewCount: 19,
        completedJobsCount: 18,
        isIdentityVerified: true,
        isProPass: false,
        appliedAt: "1 hour ago",
        pitchNote: "Canva Pro designer. Ready to start as soon as brand guidelines are shared.",
        status: "PENDING"
      }
    ],
    checklist: [
      { id: "g1", text: "Design 6 sale event banners (1:1 & 16:9)", completed: false },
      { id: "g2", text: "Deliver editable Canva / Figma project links", completed: false },
      { id: "g3", text: "Include 1 round of revisions within 2 hours", completed: false }
    ],
    description: "Urgent flash sale 9.9 campaign banners for cosmetics brand. Brand guidelines and product PNG cutouts will be provided upon acceptance.",
    tags: ["Design", "Figma", "Canva", "E-commerce"]
  },
  {
    id: "JS-2026-000198",
    title: "Flyer Distribution at Landmark 81 & Park",
    category: "Field Marketing",
    location: "Bình Thạnh District, Ho Chi Minh City",
    executionDate: "2026-08-28",
    payVND: 300000,
    serviceFeeVND: 12000,
    pinFeeVND: 0,
    totalEmployerDepositVND: 312000,
    isPinned: false,
    status: "OPEN",
    employerName: "Trung Tâm Anh Ngữ Apex",
    employerRating: 4.7,
    applicantCount: 2,
    applicants: [
      {
        id: "app-41",
        name: "Ngô Đức Trọng",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        rating: 4.8,
        reviewCount: 37,
        completedJobsCount: 37,
        isIdentityVerified: true,
        isProPass: false,
        appliedAt: "2 hours ago",
        pitchNote: "Living 5 minutes away from Landmark 81 park. Punctual, energetic, and active on field check-ins.",
        status: "PENDING"
      }
    ],
    checklist: [
      { id: "f1", text: "Distribute 500 promotional brochures to families", completed: false },
      { id: "f2", text: "Check in via GPS photo every 60 minutes (4 check-ins)", completed: false },
      { id: "f3", text: "Wear provided branded uniform vest", completed: false }
    ],
    description: "Distribute flyers for our upcoming weekend back-to-school open house. Shift: 4:00 PM - 8:00 PM (4 hours).",
    tags: ["Marketing", "Direct Promo", "Outdoor", "Fast Pay"]
  },
  {
    id: "JS-2026-000201",
    title: "Audio Transcription - 45 Min Podcast Interview",
    category: "Data Entry & Audio",
    location: "Remote / Anywhere in VN",
    executionDate: "2026-08-29",
    payVND: 400000,
    serviceFeeVND: 16000,
    pinFeeVND: 0,
    totalEmployerDepositVND: 416000,
    isPinned: false,
    status: "OPEN",
    employerName: "TechVibes Media",
    employerRating: 4.9,
    applicantCount: 2,
    applicants: [
      {
        id: "app-51",
        name: "Hoàng Mai Chi",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 60,
        completedJobsCount: 58,
        isIdentityVerified: true,
        isProPass: true,
        appliedAt: "3 hours ago",
        pitchNote: "Experienced transcriber with 99.5% accuracy. Familiar with tech terms and Vietnamese startup ecosystem.",
        status: "PENDING"
      }
    ],
    checklist: [
      { id: "a1", text: "Transcribe 45-minute Vietnamese audio file accurately", completed: false },
      { id: "a2", text: "Add speaker timestamps every 2 minutes", completed: false },
      { id: "a3", text: "Deliver clean .docx format without filler words", completed: false }
    ],
    description: "Startup founder interview podcast transcription. Audio quality is studio-recorded and clear.",
    tags: ["Audio", "Transcription", "Word", "Remote"]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "noti-1",
    roleTarget: "employer",
    title: "New Job Applicant",
    message: "Nguyễn Minh Anh applied for 'Product Photography - 100 Fashion Items'. Review profile & pitch note.",
    timestamp: "10 mins ago",
    type: "APPLICANT",
    read: false,
    jobId: "JS-2026-000184",
    actionTab: "marketplace"
  },
  {
    id: "noti-2",
    roleTarget: "employer",
    title: "Proof Deliverable Uploaded",
    message: "Worker uploaded raw photo batch for milestone inspection on JS-2026-000184.",
    timestamp: "25 mins ago",
    type: "VERIFICATION",
    read: false,
    transactionId: "JS-2026-000184",
    actionTab: "transaction"
  },
  {
    id: "noti-3",
    roleTarget: "employer",
    title: "New Job Applicant",
    message: "Vũ Khánh Linh (⭐ Pro Pass) applied for 'Shopee & TikTok Shop Banner Design'.",
    timestamp: "40 mins ago",
    type: "APPLICANT",
    read: false,
    jobId: "JS-2026-000195",
    actionTab: "marketplace"
  },
  {
    id: "noti-4",
    roleTarget: "worker",
    title: "Application Accepted! 🎉",
    message: "Shop Thời Trang X accepted your application for 'Product Photography - 100 Fashion Items'. Escrow secured.",
    timestamp: "15 mins ago",
    type: "PAYMENT",
    read: false,
    transactionId: "JS-2026-000184",
    actionTab: "transaction"
  },
  {
    id: "noti-5",
    roleTarget: "worker",
    title: "Payment Secured in Safe Vault",
    message: "500,000 VND pre-funded by employer is now locked safely in JOBSAFE Safety Guarantee.",
    timestamp: "20 mins ago",
    type: "PAYMENT",
    read: false,
    transactionId: "JS-2026-000184",
    actionTab: "transaction"
  },
  {
    id: "noti-6",
    roleTarget: "both",
    title: "JOBSAFE Trust Guarantee Active",
    message: "100% net earnings guarantee is live. 0% deductions on all worker milestone settlements.",
    timestamp: "1 hour ago",
    type: "SYSTEM",
    read: true,
    actionTab: "marketplace"
  }
];

export const WORKER_PROFILE: UserProfile = {
  id: "u-worker-1",
  name: "Nguyễn Minh Anh",
  role: "worker",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  rating: 4.9,
  reviewCount: 128,
  isIdentityVerified: true,
  completedJobsCount: 128,
  completionRate: 98,
  disputeRate: 1.5,
  avgEarningVND: 500000,
  badges: [
    "Top Rated Worker 🏆",
    "Verified Worker ✅",
    "0% Fee Payout Guarantee 🛡️",
    "Fast Delivery ⚡",
    "CCCD Chip Verified 🔒"
  ],
  bio: "Professional freelance commercial photographer and content creator based in District 1, HCMC. 5+ years experience in e-commerce, lookbook, and micro-job assignments with 100% on-time milestone delivery.",
  location: "District 1, Ho Chi Minh City",
  memberSince: "March 2024",
  isProPass: false,
  dailyFreeApplicationsLeft: 2
};

export const EMPLOYER_PROFILE: UserProfile = {
  id: "u-employer-1",
  name: "Shop Thời Trang X",
  role: "employer",
  avatar: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=200&auto=format&fit=crop&q=80",
  rating: 4.9,
  reviewCount: 45,
  isIdentityVerified: true,
  completedJobsCount: 45,
  completionRate: 100,
  disputeRate: 0.8,
  avgEarningVND: 650000,
  badges: [
    "Verified Business 🏢",
    "Pre-funded Escrow (+4%) 🔒",
    "Instant Payout 💸",
    "Super Employer 🌟"
  ],
  bio: "Modern Vietnamese contemporary fashion retailer operating across 3 boutiques in HCMC and top-performing Shopee Mall store. We pre-fund 100% of worker budgets (+4% platform fee) into secure vaults and release payouts promptly upon deliverable approval.",
  location: "Hai Ba Trung, District 1, Ho Chi Minh City",
  memberSince: "January 2024"
};

export const WORKER_PAST_TRANSACTIONS_HISTORY = [
  {
    id: "JS-2026-000172",
    title: "Shopee Live Stream Assistant (3 Hours)",
    category: "Live Commerce",
    date: "2026-08-15",
    grossVND: 450000,
    feeVND: 0, // 0 deductions from worker
    netVND: 450000, // 100% worker payout
    employerPaidVND: 468000, // 450k + 18k (4%)
    rating: 5.0,
    employer: "Shop Mỹ Phẩm Hana",
    worker: "Nguyễn Minh Anh",
    status: "COMPLETED",
    review: "Very energetic assistant! Prepared pinned product links promptly and managed viewer Q&A smoothly."
  },
  {
    id: "JS-2026-000165",
    title: "E-Commerce Package Labeling & Sorting (150 Boxes)",
    category: "Logistics",
    date: "2026-08-10",
    grossVND: 500000,
    feeVND: 0,
    netVND: 500000,
    employerPaidVND: 520000,
    rating: 5.0,
    employer: "Kho Gia Dụng Sài Gòn",
    worker: "Nguyễn Minh Anh",
    status: "COMPLETED",
    review: "Completed 150 labels in under 2.5 hours without a single error. Payment approved & released immediately."
  },
  {
    id: "JS-2026-000151",
    title: "Lookbook Shoot for Autumn Collection",
    category: "Product Photography",
    date: "2026-08-02",
    grossVND: 800000,
    feeVND: 0,
    netVND: 800000,
    employerPaidVND: 832000,
    rating: 4.8,
    employer: "The Minimalist Wardrobe",
    worker: "Nguyễn Minh Anh",
    status: "COMPLETED",
    review: "Great photo composition. Color grading was spot on and files uploaded well before the deadline."
  },
  {
    id: "JS-2026-000139",
    title: "Canva Social Media Templates for Coffee Shop",
    category: "Graphic Design",
    date: "2026-07-28",
    grossVND: 400000,
    feeVND: 0,
    netVND: 400000,
    employerPaidVND: 416000,
    rating: 5.0,
    employer: "Cà Phê Sài Gòn Xưa",
    worker: "Nguyễn Minh Anh",
    status: "COMPLETED",
    review: "Modern retro vibe templates, easily editable on Canva. Highly recommend!"
  }
];

export const EMPLOYER_PAST_TRANSACTIONS_HISTORY = [
  {
    id: "JS-2026-000168",
    title: "Summer Collection Studio Model Shoot (40 Outfits)",
    category: "Product Photography",
    date: "2026-08-12",
    grossVND: 900000,
    feeVND: 36000, // 4% service fee paid by employer
    netVND: 900000, // 100% paid to worker
    totalPaidVND: 936000, // 900k + 36k
    rating: 5.0,
    employer: "Shop Thời Trang X",
    worker: "Lê Hoàng Phúc",
    status: "COMPLETED",
    review: "Excellent photographer. Delivered clean color-balanced shots on seamless backdrop."
  },
  {
    id: "JS-2026-000159",
    title: "TikTok Reels Video Editing for Silk Blouses (5 Videos)",
    category: "Video Editing",
    date: "2026-08-05",
    grossVND: 600000,
    feeVND: 24000,
    netVND: 600000,
    totalPaidVND: 624000,
    rating: 4.9,
    employer: "Shop Thời Trang X",
    worker: "Trần Bảo Nam",
    status: "COMPLETED",
    review: "Trendy transitions and sound sync. Generated 15k views on TikTok in 48 hours."
  },
  {
    id: "JS-2026-000144",
    title: "Inventory Counting & Barcode Scanning (District 1 Store)",
    category: "Logistics",
    date: "2026-07-29",
    grossVND: 450000,
    feeVND: 18000,
    netVND: 450000,
    totalPaidVND: 468000,
    rating: 5.0,
    employer: "Shop Thời Trang X",
    worker: "Phạm Thảo Vy",
    status: "COMPLETED",
    review: "Punctual, fast, and 100% accurate count against our POS database."
  }
];

export const PAST_TRANSACTIONS_HISTORY = WORKER_PAST_TRANSACTIONS_HISTORY;

export const INITIAL_WALLET_LEDGER: WalletTransactionItem[] = [
  {
    id: "wtx-1",
    type: "DEPOSIT",
    amountVND: 570000,
    description: "VietQR Bank Transfer Top-up via Vietcombank",
    timestamp: "2026-08-18 08:30"
  },
  {
    id: "wtx-2",
    type: "ESCROW_RELEASE",
    amountVND: 500000,
    description: "100% Full Payout (JS-2026-000165) - 0 deductions",
    timestamp: "2026-08-15 18:45",
    relatedTransactionId: "JS-2026-000165"
  }
];
