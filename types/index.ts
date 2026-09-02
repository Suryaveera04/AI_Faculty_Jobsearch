export type UserRole = 'candidate' | 'institute_admin' | 'super_admin' | 'recruiter';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  instituteId?: string;
  avatar?: string;
  createdAt: string;
}

export type InstitutionType = 
  | 'IIT / NIT / IISc / IIIT (Institute of National Importance)'
  | 'Central University (Govt. of India)'
  | 'State Public University'
  | 'Deemed-to-be University'
  | 'Premier Private University'
  | 'Autonomous Engineering College';

export interface Institute {
  id: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  location: {
    city: string;
    state: string;
    pincode: string;
    campusType: 'Urban' | 'Suburban' | 'Residential Mega Campus';
  };
  accreditation: {
    naacGrade: 'A++' | 'A+' | 'A' | 'B++' | 'Under Review';
    naacScore?: number;
    nirfRankOverall?: number;
    nirfRankUniversity?: number;
    nirfRankEngineering?: number;
    aicteApproved: boolean;
    ugc2f12bStatus: boolean;
    nbaAccreditedDepts: string[];
  };
  departments: string[];
  aisheCode: string;
  establishedYear: number;
  website: string;
  logo: string;
  bannerImage: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verifiedAt?: string;
  about: string;
  contactEmail: string;
  contactPhone: string;
  stats: {
    facultyCount: number;
    studentCount: number;
    patentsFiled: number;
    hIndexAverage: number;
  };
}

export type DesignationType =
  | 'Assistant Professor (Level 10 - 7th CPC)'
  | 'Assistant Professor (Level 11 - 7th CPC)'
  | 'Assistant Professor (Level 12 - 7th CPC)'
  | 'Associate Professor (Level 13A - 7th CPC)'
  | 'Professor (Level 14 - 7th CPC)'
  | 'Senior Professor (Level 15 - 7th CPC)'
  | 'Chair Professor / Eminent Scholar'
  | 'Postdoctoral Research Fellow'
  | 'Professor of Practice (Industry Track)'
  | 'Dean / Director / Head of School';

export type ReservationCategory =
  | 'Unreserved (UR / General)'
  | 'OBC - Non Creamy Layer'
  | 'Scheduled Caste (SC)'
  | 'Scheduled Tribe (ST)'
  | 'Economically Weaker Section (EWS)'
  | 'Persons with Benchmark Disabilities (PwD)'
  | 'Open to All Categories';

export interface Job {
  id: string;
  instituteId: string;
  instituteName: string;
  instituteShortName: string;
  instituteLogo: string;
  instituteType: InstitutionType;
  title: string;
  designation: DesignationType;
  department: string;
  specializationTags: string[];
  advertisementNumber: string;
  location: {
    city: string;
    state: string;
  };
  payScale: {
    cpcBand: string; // e.g. "Level 10 (₹57,700 - ₹1,82,400)"
    entryPay: string; // e.g. "₹57,700"
    grossMonthlyEstimated: string; // e.g. "₹1,08,000/mo (with 50% DA + HRA)"
    consolidated?: boolean;
    allowances: string[];
  };
  requiredQualifications: {
    minDegree: 'Ph.D. Mandatory' | 'Ph.D. with First Class Master' | 'Master with NET/SLET' | 'PostDoc Preferred';
    netSletMandatory: boolean;
    phdNorms: 'UGC 2009/2016 Compliant' | 'Any Recognized' | 'Not Required for Industry Track';
    minExperienceYears: number;
    minUgcCarePubs: number;
    ugcRegulationsYear: 'UGC 2018 Regulations' | 'AICTE 2019/2023 Gazette';
    specializationRequirements: string[];
  };
  reservationCategory: ReservationCategory;
  applicationDeadline: string; // YYYY-MM-DD
  status: 'published' | 'closed' | 'draft' | 'under_review';
  isClaimedByInstitute: boolean;
  screeningQuestions: string[];
  selectionProcess: string[];
  description: string;
  responsibilities: string[];
  benefits: string[];
  postedAt: string;
  applicantCount: number;
  featured?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institute: string;
  year: number;
  gradePercentage: string;
  distinctionOrRank?: string;
}

export interface ExperienceItem {
  id: string;
  designation: string;
  instituteOrCompany: string;
  department: string;
  startDate: string;
  endDate: string | 'Present';
  isCurrent: boolean;
  type: 'Teaching' | 'Research / Postdoc' | 'Industry / R&D';
  keyAccomplishments?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  journalOrConference: string;
  year: number;
  doi?: string;
  ugcCareListed: boolean;
  scopusIndexed: boolean;
  sciScieIndexed: boolean;
  impactFactor?: number;
  authors: string;
  citationsCount?: number;
  type: 'Journal' | 'Conference' | 'Book Chapter' | 'Patent';
}

export interface CandidateProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  location: {
    city: string;
    state: string;
  };
  currentDesignation: string;
  currentInstitute: string;
  highestDegree: string;
  netSletStatus: {
    isQualified: boolean;
    examType?: 'UGC-NET (JRF)' | 'UGC-NET (LS)' | 'CSIR-NET (JRF)' | 'CSIR-NET (LS)' | 'SLET/SET' | 'GATE';
    qualifiedYear?: number;
    subject?: string;
    rollNumber?: string;
  };
  phdStatus: {
    isCompleted: boolean;
    institute?: string;
    thesisTitle?: string;
    graduationYear?: number;
    isUgc2009_2016Compliant: boolean;
    supervisorName?: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  publications: PublicationItem[];
  researchInterests: string[];
  skills: string[];
  scholarLinks: {
    googleScholar?: string;
    orcid?: string;
    scopusId?: string;
    researchGate?: string;
  };
  apiScore: number; // Academic Performance Index calculated as per UGC criteria
  profileCompleteness: number; // 0-100 percentage
  resumeFileName?: string;
  resumeParsedAt?: string;
  avatar?: string;
  bio?: string;
  teachingPhilosophy?: string;
}

export type ApplicationStage =
  | 'applied'
  | 'screening'
  | 'eligible'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'committee_review'
  | 'offer'
  | 'joined'
  | 'rejected';

export interface ReviewerScoreItem {
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'Dean (Academic)' | 'Head of Department' | 'External Subject Expert 1' | 'External Subject Expert 2' | 'Vice Chancellor Nominee';
  researchPotentialScore: number; // out of 30
  teachingPedagogyScore: number;  // out of 25
  apiScoreValidation: number;     // out of 20
  interviewPerformance: number;   // out of 25
  totalScore: number;             // out of 100
  recommendation: 'Strongly Recommend' | 'Recommend' | 'Reserve / Waitlist' | 'Not Recommended';
  confidentialNotes: string;
  submittedAt: string;
}

export interface MatchBreakdown {
  overallScore: number; // 0-100%
  qualificationMatch: number; // 0-100%
  researchSynergy: number; // 0-100%
  ugcCarePubsFit: number; // 0-100%
  experienceMatch: number; // 0-100%
  meetsMandatoryNetPhd: boolean;
  positiveSignals: string[];
  potentialGaps: string[];
}

export interface StageHistoryItem {
  stage: ApplicationStage;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface InterviewSlot {
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM IST"
  platform: 'Google Meet' | 'Microsoft Teams' | 'Zoom' | 'In-Person (Campus Selection Board Room)';
  meetingLink?: string;
  roomVenue?: string;
  committeeMembers: string[];
  instructions: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  jobTitle: string;
  department: string;
  instituteId: string;
  instituteName: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateLocation: string;
  currentDesignation: string;
  highestDegree: string;
  matchScore: number;
  matchBreakdown: MatchBreakdown;
  status: ApplicationStage;
  stageHistory: StageHistoryItem[];
  reviewerScores: ReviewerScoreItem[];
  interviewSlot?: InterviewSlot;
  appliedDate: string;
  screeningAnswers?: { question: string; answer: string }[];
  offerDetails?: {
    designation: string;
    grossPay: string;
    joiningDate: string;
    offerLetterGenerated: boolean;
  };
}

export interface DPDPDataRequest {
  id: string;
  userId?: string;
  userEmail: string;
  userName: string;
  requestType: 'Right to Erasure (Delete all Academic CV & Personal Data)' | 'Data Portability Export (JSON/PDF)' | 'Revoke AI Matching Processing Consent';
  status: 'Pending' | 'Under Review' | 'Completed' | 'Rejected';
  requestedAt: string;
  completedAt?: string;
  reason?: string;
  dpoActionNotes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  target: string;
  ipAddress: string;
  complianceCategory: 
    | 'DPDP_CONSENT' 
    | 'INSTITUTE_VERIFICATION' 
    | 'SELECTION_COMMITTEE' 
    | 'PII_ACCESS'
    | 'AUTHENTICATION'
    | 'JOB_MODERATION'
    | 'COMMITTEE_SCORING'
    | 'INTERVIEW_COLLOQUIUM';
}
