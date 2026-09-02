'use client';

import {
  Institute,
  Job,
  CandidateProfile,
  Application,
  DPDPDataRequest,
  AuditLog,
  User,
  UserRole,
  ApplicationStage,
  ReviewerScoreItem,
  InterviewSlot,
} from '@/types';
import {
  INITIAL_INSTITUTES,
  INITIAL_JOBS,
  INITIAL_CANDIDATE_PROFILE,
  INITIAL_APPLICATIONS,
  INITIAL_DPDP_REQUESTS,
  INITIAL_AUDIT_LOGS,
} from './data';
import { calculateMatchScore } from './scoring';

const STORAGE_KEYS = {
  INSTITUTES: 'acad_institutes_v2',
  JOBS: 'acad_jobs_v2',
  CANDIDATE_PROFILES_MAP: 'acad_candidate_profiles_map_v2',
  APPLICATIONS: 'acad_applications_v2',
  DPDP_REQUESTS: 'acad_dpdp_requests_v2',
  AUDIT_LOGS: 'acad_audit_logs_v2',
  CURRENT_ROLE: 'acad_current_role_v2',
  CURRENT_USER: 'acad_current_user_v2',
  USERS: 'acad_users_v2',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-cand-1',
    name: 'Dr. Aarav Sundaram',
    email: 'aarav.sundaram@iitb-alumni.org',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01',
  },
  {
    id: 'user-inst-1',
    name: 'Prof. Ramesh K. Narang',
    email: 'dean.faculty@iitb.ac.in',
    role: 'institute_admin',
    instituteId: 'inst-iitb',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    createdAt: '2026-07-15',
  },
  {
    id: 'user-admin-1',
    name: 'Dr. Rajeshwar Singh',
    email: 'dpo.ugc@gov.in',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&auto=format&fit=crop&q=80',
    createdAt: '2026-06-10',
  },
];

// Helper to create a fresh default profile for a newly registered candidate
export function createDefaultCandidateProfile(user: { id: string; name: string; email: string }): CandidateProfile {
  return {
    id: `cand-${user.id}`,
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: '+91-98765-43210',
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
    },
    currentDesignation: 'Assistant Professor / Doctoral Researcher',
    currentInstitute: 'Indian Institute of Technology',
    highestDegree: 'Ph.D.',
    netSletStatus: {
      isQualified: true,
      examType: 'UGC-NET (JRF)',
      qualifiedYear: 2023,
      subject: 'Computer Science & Applications',
      rollNumber: `NET-2023-CS-${Math.floor(Math.random() * 89999 + 10000)}`,
    },
    phdStatus: {
      isCompleted: true,
      institute: 'Indian Institute of Technology',
      thesisTitle: 'Architectures and Algorithms for Next-Generation Scalable Computing Systems',
      graduationYear: 2024,
      isUgc2009_2016Compliant: true,
      supervisorName: 'Prof. Senior Faculty',
    },
    education: [
      {
        id: 'edu-1',
        degree: 'Ph.D.',
        field: 'Computer Science and Engineering',
        institute: 'Indian Institute of Technology',
        year: 2024,
        gradePercentage: '9.4 CGPA (Doctoral Thesis Commended)',
      },
      {
        id: 'edu-2',
        degree: 'M.Tech / M.E.',
        field: 'Computer Science & Engineering',
        institute: 'National Institute of Technology',
        year: 2020,
        gradePercentage: '8.9 CGPA (First Class Distinction)',
      },
      {
        id: 'edu-3',
        degree: 'B.Tech / B.E.',
        field: 'Computer Science',
        institute: 'State Technical University',
        year: 2018,
        gradePercentage: '85.2% (First Class)',
      }
    ],
    experience: [
      {
        id: 'exp-1',
        designation: 'Assistant Professor / Postdoc Scholar',
        instituteOrCompany: 'National Academic Institute',
        department: 'Department of Computer Science',
        startDate: '2024-02-01',
        endDate: 'Present',
        isCurrent: true,
        type: 'Teaching',
        keyAccomplishments: 'Instruction in core algorithmic courses, lab leadership, and doctoral mentoring.',
      }
    ],
    publications: [],
    researchInterests: ['Artificial Intelligence', 'Machine Learning', 'Edge Computing', 'Distributed Systems'],
    skills: ['Python', 'PyTorch', 'Data Structures', 'Distributed Systems', 'Algorithms'],
    scholarLinks: {
      googleScholar: '',
      orcid: '',
      scopusId: '',
      researchGate: '',
    },
    apiScore: 75,
    profileCompleteness: 75,
    bio: `${user.name} is an academic and researcher dedicated to excellence in teaching, doctoral guidance, and cutting-edge publications.`,
    teachingPhilosophy: 'My teaching pedagogy balances foundational computational theory with hands-on systems programming and interdisciplinary inquiry.',
  };
}

// Initial profiles map seeded with Dr. Aarav Sundaram
const INITIAL_PROFILES_MAP: Record<string, CandidateProfile> = {
  'user-cand-1': INITIAL_CANDIDATE_PROFILE,
  'cand-prof-001': INITIAL_CANDIDATE_PROFILE,
  'aarav.sundaram@iitb-alumni.org': INITIAL_CANDIDATE_PROFILE,
};

// Safe JSON parse from localStorage with fallback
function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('acad-storage-updated'));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  // Authentication & Users
  getUsers(): User[] {
    return getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): User | null {
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },

  setCurrentUser(user: User | null): void {
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);
    if (user) {
      this.setCurrentRole(user.role);
    }
  },

  login(email: string, _password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    let found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // Auto-assign role based on institutional email pattern
      let autoRole: UserRole = 'candidate';
      if (cleanEmail.includes('iit') || cleanEmail.includes('.ac.in') || cleanEmail.includes('.edu')) {
        autoRole = 'institute_admin';
      } else if (cleanEmail.includes('ugc') || cleanEmail.includes('gov.in')) {
        autoRole = 'super_admin';
      }

      found = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: cleanEmail,
        role: autoRole,
        instituteId: autoRole === 'institute_admin' ? 'inst-iitb' : undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updatedUsers = [...users, found];
      setToStorage(STORAGE_KEYS.USERS, updatedUsers);

      // If candidate, initialize their isolated profile
      if (autoRole === 'candidate') {
        const newProfile = createDefaultCandidateProfile(found);
        this.updateCandidateProfile(newProfile);
      }
    }

    this.setCurrentUser(found);
    this.addAuditLog(found.role, `Authenticated via SSO / Password Login as ${found.email}`, found.id, 'AUTHENTICATION');
    return { success: true, user: found };
  },

  loginAsDemoUser(userId: string): User | null {
    const users = this.getUsers();
    const found = users.find(u => u.id === userId) || INITIAL_USERS.find(u => u.id === userId);
    if (found) {
      this.setCurrentUser(found);
      this.addAuditLog(found.role, `1-Click Demo Login as ${found.name} (${found.role})`, found.id, 'AUTHENTICATION');
      return found;
    }
    return null;
  },

  registerUser(name: string, email: string, role: UserRole, instituteId?: string): User {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if user exists
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name,
        email: cleanEmail,
        role,
        instituteId: role === 'institute_admin' ? (instituteId || 'inst-iitb') : undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updatedUsers = [...users, user];
      setToStorage(STORAGE_KEYS.USERS, updatedUsers);
    }

    // If candidate, initialize their isolated profile with 0 applications
    if (role === 'candidate') {
      const newProfile = createDefaultCandidateProfile(user);
      this.updateCandidateProfile(newProfile);
    }

    this.setCurrentUser(user);
    this.addAuditLog(role, `New User Account Registered for ${name} (${cleanEmail})`, user.id, 'AUTHENTICATION');
    return user;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      this.setCurrentRole('candidate');
      window.dispatchEvent(new Event('acad-storage-updated'));
    }
  },

  // Roles
  getCurrentRole(): UserRole {
    return getFromStorage<UserRole>(STORAGE_KEYS.CURRENT_ROLE, 'candidate');
  },
  setCurrentRole(role: UserRole): void {
    setToStorage(STORAGE_KEYS.CURRENT_ROLE, role);
  },

  // Institutes
  getInstitutes(): Institute[] {
    return getFromStorage<Institute[]>(STORAGE_KEYS.INSTITUTES, INITIAL_INSTITUTES);
  },
  getInstituteById(id: string): Institute | undefined {
    return this.getInstitutes().find(i => i.id === id);
  },
  updateInstituteVerification(id: string, status: 'verified' | 'rejected'): void {
    const institutes = this.getInstitutes().map(i => {
      if (i.id === id) {
        return {
          ...i,
          verificationStatus: status,
          verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        };
      }
      return i;
    });
    setToStorage(STORAGE_KEYS.INSTITUTES, institutes);
    this.addAuditLog('super_admin', `Updated institute verification for ${id} to ${status}`, id, 'INSTITUTE_VERIFICATION');
  },

  // Jobs
  getJobs(): Job[] {
    return getFromStorage<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  },
  getJobById(id: string): Job | undefined {
    return this.getJobs().find(j => j.id === id);
  },
  addJob(job: Job): void {
    const jobs = [job, ...this.getJobs()];
    setToStorage(STORAGE_KEYS.JOBS, jobs);
    this.addAuditLog('institute_admin', `Published new 7th CPC faculty vacancy: ${job.title}`, job.id, 'JOB_MODERATION');
  },

  // Candidate Profile (Isolated per-user)
  getCandidateProfilesMap(): Record<string, CandidateProfile> {
    return getFromStorage<Record<string, CandidateProfile>>(STORAGE_KEYS.CANDIDATE_PROFILES_MAP, INITIAL_PROFILES_MAP);
  },

  getCandidateProfile(explicitUserId?: string): CandidateProfile {
    const currentUser = this.getCurrentUser();
    const targetUserId = explicitUserId || currentUser?.id || 'user-cand-1';
    const targetEmail = currentUser?.email?.toLowerCase();

    const profilesMap = this.getCandidateProfilesMap();

    // Check by user ID or email
    if (profilesMap[targetUserId]) return profilesMap[targetUserId];
    if (targetEmail && profilesMap[targetEmail]) return profilesMap[targetEmail];

    // If Dr. Aarav Sundaram demo user
    if (targetUserId === 'user-cand-1' || targetEmail === 'aarav.sundaram@iitb-alumni.org') {
      return INITIAL_CANDIDATE_PROFILE;
    }

    // Generate and save new profile for this user
    const generated = createDefaultCandidateProfile(currentUser || {
      id: targetUserId,
      name: 'Faculty Scholar',
      email: 'scholar@university.edu',
    });
    this.updateCandidateProfile(generated);
    return generated;
  },

  updateCandidateProfile(profile: CandidateProfile): void {
    const profilesMap = this.getCandidateProfilesMap();
    const key = profile.userId || profile.id;
    profilesMap[key] = profile;
    if (profile.email) {
      profilesMap[profile.email.toLowerCase()] = profile;
    }
    setToStorage(STORAGE_KEYS.CANDIDATE_PROFILES_MAP, profilesMap);
    this.addAuditLog('candidate', `Updated Candidate Academic Profile and API Score to ${profile.apiScore}`, profile.id, 'PII_ACCESS');
  },

  // Applications (Isolated per-user)
  getAllApplications(): Application[] {
    return getFromStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  getApplications(explicitUserId?: string): Application[] {
    const allApps = this.getAllApplications();
    const currentUser = this.getCurrentUser();
    const role = currentUser?.role || this.getCurrentRole();

    // For Super Admin: return all applications
    if (role === 'super_admin') {
      return allApps;
    }

    // For Institute Admin: return applications for their institute (e.g. IIT Bombay)
    if (role === 'institute_admin') {
      const instId = currentUser?.instituteId || 'inst-iitb';
      return allApps.filter(a => a.instituteId === instId);
    }

    // For Candidate: Filter ONLY applications belonging to this candidate!
    const targetUserId = explicitUserId || currentUser?.id;
    const targetEmail = currentUser?.email?.toLowerCase();

    // If Dr. Aarav Sundaram demo user: return his seed applications
    if (targetUserId === 'user-cand-1' || targetEmail === 'aarav.sundaram@iitb-alumni.org') {
      return allApps.filter(a => a.candidateEmail.toLowerCase() === 'aarav.sundaram@iitb-alumni.org' || a.candidateId === 'cand-prof-001');
    }

    // For any other registered user: return ONLY applications they submitted!
    if (!targetUserId && !targetEmail) return [];

    return allApps.filter(a => 
      (targetUserId && a.candidateId === targetUserId) || 
      (targetEmail && a.candidateEmail.toLowerCase() === targetEmail)
    );
  },

  getApplicationById(id: string): Application | undefined {
    return this.getAllApplications().find(a => a.id === id);
  },

  applyToJob(jobId: string, screeningAnswers?: { question: string; answer: string }[]): Application | null {
    const job = this.getJobById(jobId);
    const currentUser = this.getCurrentUser();
    const candidate = this.getCandidateProfile(currentUser?.id);
    if (!job) return null;

    const match = calculateMatchScore(candidate, job);

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      candidateId: currentUser?.id || candidate.userId || candidate.id,
      jobTitle: job.title,
      department: job.department,
      instituteId: job.instituteId,
      instituteName: job.instituteName,
      candidateName: currentUser?.name || candidate.name,
      candidateEmail: currentUser?.email || candidate.email,
      candidatePhone: candidate.phone,
      candidateLocation: `${candidate.location.city}, ${candidate.location.state}`,
      currentDesignation: candidate.currentDesignation,
      highestDegree: candidate.highestDegree,
      matchScore: match.overallScore,
      matchBreakdown: match,
      status: 'applied',
      stageHistory: [
        {
          stage: 'applied',
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          actor: currentUser?.name || candidate.name,
          note: 'Formal faculty application submitted via portal',
        },
      ],
      reviewerScores: [],
      screeningAnswers,
      appliedDate: new Date().toISOString().split('T')[0],
    };

    const allApps = [newApp, ...this.getAllApplications()];
    setToStorage(STORAGE_KEYS.APPLICATIONS, allApps);

    // Increment job count
    const jobs = this.getJobs().map(j => j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j);
    setToStorage(STORAGE_KEYS.JOBS, jobs);

    this.addAuditLog('candidate', `Submitted formal application for ${job.title} at ${job.instituteShortName}`, newApp.id, 'PII_ACCESS');
    return newApp;
  },

  updateApplicationStage(appId: string, newStage: ApplicationStage, note?: string): void {
    const apps = this.getAllApplications().map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: newStage,
          stageHistory: [
            ...a.stageHistory,
            {
              stage: newStage,
              timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
              actor: 'Faculty Search Committee',
              note: note || `Application transitioned to stage: ${newStage}`,
            },
          ],
        };
      }
      return a;
    });
    setToStorage(STORAGE_KEYS.APPLICATIONS, apps);
    this.addAuditLog('institute_admin', `Updated candidate ${appId} stage to ${newStage}`, appId, 'COMMITTEE_SCORING');
  },

  addReviewerScore(appId: string, score: ReviewerScoreItem): void {
    const apps = this.getAllApplications().map(a => {
      if (a.id === appId) {
        const scores = [...a.reviewerScores.filter(s => s.reviewerId !== score.reviewerId), score];
        return {
          ...a,
          reviewerScores: scores,
          status: a.status === 'applied' || a.status === 'screening' ? 'committee_review' : a.status,
        };
      }
      return a;
    });
    setToStorage(STORAGE_KEYS.APPLICATIONS, apps);
    this.addAuditLog('institute_admin', `Submitted committee score (${score.totalScore}/100) for application ${appId}`, appId, 'COMMITTEE_SCORING');
  },

  scheduleInterview(appId: string, slot: InterviewSlot): void {
    const apps = this.getAllApplications().map(a => {
      if (a.id === appId) {
        return {
          ...a,
          interviewSlot: slot,
          status: 'interview_scheduled' as ApplicationStage,
        };
      }
      return a;
    });
    setToStorage(STORAGE_KEYS.APPLICATIONS, apps);
    this.addAuditLog('institute_admin', `Scheduled selection colloquium for application ${appId} on ${slot.date}`, appId, 'INTERVIEW_COLLOQUIUM');
  },

  // DPDP & Audit
  getDPDPRequests(): DPDPDataRequest[] {
    return getFromStorage<DPDPDataRequest[]>(STORAGE_KEYS.DPDP_REQUESTS, INITIAL_DPDP_REQUESTS);
  },
  createDPDPRequest(type: DPDPDataRequest['requestType'], reason?: string): DPDPDataRequest {
    const user = this.getCurrentUser();
    const newReq: DPDPDataRequest = {
      id: `dpdp-${Date.now()}`,
      userId: user?.id || 'user-cand-1',
      userName: user?.name || 'Dr. Aarav Sundaram',
      userEmail: user?.email || 'aarav.sundaram@iitb-alumni.org',
      requestType: type,
      status: 'Pending',
      requestedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      reason,
    };
    const reqs = [newReq, ...this.getDPDPRequests()];
    setToStorage(STORAGE_KEYS.DPDP_REQUESTS, reqs);
    this.addAuditLog('candidate', `Submitted DPDP Data Subject Request: ${type}`, newReq.id, 'DPDP_CONSENT');
    return newReq;
  },
  updateDPDPStatus(reqId: string, status: DPDPDataRequest['status'], notes?: string): void {
    const reqs = this.getDPDPRequests().map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status,
          completedAt: status === 'Completed' ? new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : r.completedAt,
          dpoActionNotes: notes || r.dpoActionNotes,
        };
      }
      return r;
    });
    setToStorage(STORAGE_KEYS.DPDP_REQUESTS, reqs);
    this.addAuditLog('super_admin', `Updated DPDP request status for ${reqId} to ${status}`, reqId, 'DPDP_CONSENT');
  },

  getAuditLogs(): AuditLog[] {
    return getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(actorRole: UserRole, action: string, target: string, category: AuditLog['complianceCategory']): void {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      actor: actorRole === 'super_admin' ? 'admin@acadexmatch.ai' : actorRole === 'institute_admin' ? 'facrec@institute.ac.in' : 'candidate@portal',
      actorRole,
      action,
      target,
      ipAddress: '103.15.66.' + Math.floor(Math.random() * 200 + 10),
      complianceCategory: category,
    };
    const logs = [newLog, ...this.getAuditLogs().slice(0, 49)];
    setToStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.INSTITUTES);
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.CANDIDATE_PROFILES_MAP);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.DPDP_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    window.dispatchEvent(new Event('acad-storage-updated'));
  },
};
