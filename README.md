# 🎓 AcadeXMatch AI — AI-Powered Faculty Recruitment & Academic Career Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**AcadeXMatch AI** is a specialized, intelligent academic job matching and Applicant Tracking System (ATS) tailored for higher education institutions in India (IITs, NITs, Central/State Public Universities, Deemed Universities, and Premier Autonomous Colleges). 

It bridges academic talent and university hiring committees through automated UGC/AICTE regulatory screening, UGC-CARE & Scopus publication verification, API (Academic Performance Index) calculation, and explainable AI candidate ranking.

---

## 🌟 Key Features

### 👨‍🏫 For Academic Candidates & Scholars
- **Smart Academic Job Search & Faceted Filtering**: Filter vacancies by 7th CPC Pay Bands (Level 10 to Level 15), NAAC Accreditation (A++, A+, A), NIRF Rankings, Reservation Categories (UR, OBC-NCL, SC, ST, EWS, PwD), and Academic Specializations.
- **AI Resume & CV Parser**: Upload academic CVs to automatically extract Ph.D. details (UGC 2009/2016 compliance), UGC-NET/CSIR-NET/SLET qualifications, research publications (Scopus, SCI/SCIE, UGC-CARE), patents, and citations.
- **Explainable Match Scoring**: Get real-time, transparent breakdown of how well your profile aligns with job qualifications, research synergy, publication minimums, and experience requirements.
- **Automated UGC API Score Calculation**: Instant computation of your Academic Performance Index (API) according to UGC 2018 / AICTE Gazette guidelines.
- **Application Tracking Pipeline**: Real-time tracking through all recruitment stages (`Applied` ➔ `Screening` ➔ `Eligible` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Committee Review` ➔ `Offer` ➔ `Joined`).

### 🏛️ For Universities & Selection Committees
- **Regulatory-Compliant Job Posting**: Create advertisements with pre-configured 7th CPC Pay Matrix bands, AISHE codes, statutory reservation categories, and AICTE/UGC qualification criteria.
- **Intelligent Academic ATS & Kanban Board**: Drag-and-drop recruitment workflow with AI-ranked candidate shortlists and instant eligibility checks.
- **Selection Committee Evaluation Module**: Structured digital scoring rubrics for Deans, HODs, and External Subject Experts across Research Potential (30), Teaching Pedagogy (25), API Score Validation (20), and Interview Performance (25).
- **Automated Interview Colloquium Scheduling**: Integrated scheduling for Google Meet, Microsoft Teams, Zoom, or On-Campus Boardrooms with automated notifications.

### 🛡️ For System Administrators & Compliance Officers
- **Institution Verification**: AISHE code and NAAC grade validation portal.
- **India DPDP Act Compliance Hub**: Data privacy management including Right to Erasure, Data Portability exports, and consent tracking.
- **Tamper-Evident Audit Logging**: Comprehensive audit trail for committee scores, PII access, and selection decisions.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Client Hooks)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Glassmorphism & Modern Dark Theme
- **Animations & Interactivity**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data & State Management**: Localized Mock Database with schema validation & persistent local storage helpers

---

## 📁 Project Structure

```text
ai-faculty-job-search/
├── app/
│   ├── admin/                 # Super admin & DPDP compliance hub
│   ├── candidate/
│   │   ├── applications/      # Candidate applied jobs & stage tracker
│   │   ├── dashboard/         # Candidate home, API score & recommendations
│   │   ├── profile/           # Academic profile & publication manager
│   │   └── resume-parser/     # AI CV parser & extractor
│   ├── institute/
│   │   ├── ats/               # Institute ATS recruitment pipeline & Kanban
│   │   ├── dashboard/         # Institute analytics & active postings
│   │   └── post-job/          # UGC-compliant job posting form
│   ├── institutes/
│   │   ├── [id]/              # Individual institute profile & openings
│   │   └── page.tsx           # Directory of accredited universities
│   ├── jobs/
│   │   ├── [id]/              # Detailed job view & one-click application
│   │   └── page.tsx           # Faceted job search portal
│   ├── login/                 # Role-based authentication (Candidate/Institute/Admin)
│   ├── register/              # Onboarding flow
│   ├── globals.css            # Custom CSS tokens & animation keyframes
│   ├── layout.tsx             # Root layout with navigation & footer
│   └── page.tsx               # High-converting Hero Landing Page
├── components/
│   ├── ExplainableMatchModal.tsx     # AI match score breakdown popup
│   ├── FacetedFilter.tsx             # Multi-attribute search & filter sidebar
│   ├── Footer.tsx                    # Global footer
│   ├── HeroCanvas3D.tsx              # Interactive particle canvas
│   ├── InterviewScheduleModal.tsx    # Interview slot scheduling dialog
│   ├── JobCard.tsx                   # Interactive faculty opening card
│   ├── Navbar.tsx                    # Responsive navigation with role switcher
│   ├── ResumeParserModal.tsx         # CV upload & parsing component
│   └── SelectionCommitteeModal.tsx   # Multi-reviewer digital evaluation rubric
├── lib/
│   ├── ai-engine.ts           # Semantic matching & gap analysis algorithms
│   ├── data.ts                # Seed data (Jobs, Institutes, Candidates)
│   ├── mongodb.ts             # Database connection helper
│   ├── scoring.ts             # UGC API Score computation logic
│   └── storage.ts             # Browser storage & state persistence helpers
├── types/
│   └── index.ts               # Core TypeScript interfaces & types
├── tailwind.config.ts         # Custom themes, colors & glassmorphic styles
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.17.0` or later (Recommended: `v20.x` or `v22.x`)
- **npm**: `v9.x` or later (or `yarn` / `pnpm`)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Suryaveera04/AI_Faculty_Jobsearch.git
   cd AI_Faculty_Jobsearch
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with Hot Module Replacement (HMR). |
| `npm run build` | Builds the production bundle optimized for deployment. |
| `npm run start` | Starts the production server after running `npm run build`. |
| `npm run lint` | Runs Next.js ESLint to analyze code quality and potential errors. |

---

## 👥 Demo User Accounts & Roles

To explore all perspectives of the platform, you can switch roles or sign in via the demo accounts on the `/login` page:

| Role | Email | Use Case |
| :--- | :--- | :--- |
| **Candidate / Scholar** | `candidate@acadexmatch.ai` | Browse jobs, parse CV, check API score, submit applications |
| **Institute Recruiter** | `recruiter@iitd.ac.in` | Post vacancies, manage ATS pipeline, schedule interviews |
| **Selection Committee** | `dean.faculty@iitb.ac.in` | Evaluate candidates on rubric, submit scores & remarks |
| **Super Administrator** | `admin@acadexmatch.ai` | Verify universities, manage DPDP compliance, view audit logs |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for Indian Higher Education & Academic Excellence.</sub>
</div>
