# JOBSAFE - Micro-Job Trust & Escrow Platform

A modern, production-grade micro-job trust and milestone escrow platform designed to eliminate payment defaults and deliverable disputes. Built with React 19, TypeScript, and Tailwind CSS.

---

## 🌟 Key Features

### 1. 🛡️ Upfront Escrow Vault Protection
- **100% Net Worker Earnings**: Workers receive their full agreed payout with 0% deductions upon task completion.
- **Upfront 4% Platform Fee**: Transparent pricing structure where the employer funds the task budget plus a 4% platform fee upon posting or hiring.
- **Vault State Management**: Escrow deposits remain securely locked in the vault until the employer reviews and approves proof deliverables.

### 2. 📋 Milestone Checklist & Proof Workspace
- **Interactive Checklists**: Real-time deliverable requirements tracking between employers and workers.
- **Proof Deliverables Upload**: Drag-and-drop file uploader supporting images, raw assets, archives, and documents.
- **Side-by-Side Review**: Employers inspect submitted proof items with live status badges (`PENDING`, `APPROVED`, `REVISION_REQUESTED`).

### 3. 🎯 Centralized Transaction Center
- **Categorized Tabs**: 
  - **All Active Contracts**: High-priority contracts needing action or currently in progress.
  - **Your Accepted Jobs**: Worker-specific active engagements.
  - **Your Posted Tasks**: Employer-created listings.
  - **Completed & Settled**: Isolated archive for closed contracts with downloadable digital receipts.
- **Action-Needed Highlighting**: Color-coded borders (Green for in progress, Amber for pending actions, Blue for posted jobs).

### 4. 👥 Candidate Review, Hire & Auto-Reject
- **Applicant Profile Inspection**: CCCD Chip verification status, past job completion stats, and worker pitch notes.
- **Hire Confirmation & Auto-Reject**: When hiring a candidate, the platform prompts the employer and automatically declines remaining applicants with polite automated notifications.

### 5. 📍 Location & Province Management
- **Provinces Selection**: Comprehensive coverage of Vietnamese provinces (Hồ Chí Minh, Hà Nội, Đà Nẵng, Bình Dương, Đồng Nai, etc.) and Remote/Online options.
- **Detailed Workplace Address**: Dedicated field for exact physical street addresses, studio locations, or remote workplace destinations.

### 6. ⚖️ 3-Way Admin Dispute Arbitration
- **Evidence Panel**: Side-by-side inspection of initial checklist requirements, submitted proof files, and transaction chat logs.
- **Arbitration Overrides**: Admins can issue full refunds, full worker payouts, or custom percentage splits.

### 7. 🔔 Floating Notification Center & Wallet
- **Real-Time Notification Bell**: Unread indicators, tab navigation shortcuts, and interactive notification cards.
- **Digital Receipts**: Itemized fee breakdown and payment verification certificates.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations & Effects**: Motion, Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/jobsafe-escrow-platform.git
cd jobsafe-escrow-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`.

### Production Build

To compile a production-ready build:
```bash
npm run build
```

---

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Modular UI components
│   │   ├── AdminDisputeView.tsx       # Dispute arbitration engine
│   │   ├── ApplicantProfileModal.tsx  # Candidate review modal
│   │   ├── Header.tsx                 # Navigation & role switch bar
│   │   ├── HireConfirmationModal.tsx  # Hire & auto-reject modal
│   │   ├── MarketplaceView.tsx        # Job exploration & posting
│   │   ├── NotificationCenter.tsx     # Floating notification hub
│   │   ├── PaywallModal.tsx           # Pro pass upgrade modal
│   │   ├── PostJobModal.tsx           # Job posting with provinces
│   │   ├── ProfileView.tsx            # User profile & wallet
│   │   ├── ReceiptModal.tsx           # Digital escrow receipt
│   │   ├── TransactionListView.tsx    # Central contract hub
│   │   └── TransactionView.tsx        # Active workspace & proof review
│   ├── data/
│   │   └── mockData.ts                # Initial seed data & scenarios
│   ├── utils/
│   │   └── formatters.ts              # Currency & date formatters
│   ├── types.ts                       # Core TypeScript definitions
│   ├── App.tsx                        # Main state orchestrator
│   └── main.tsx                       # React application entry point
├── index.html                         # HTML entry template
├── package.json                       # Dependencies and scripts
└── vite.config.ts                     # Vite build configuration
```

---

## 📄 License

This project is licensed under the MIT License.
