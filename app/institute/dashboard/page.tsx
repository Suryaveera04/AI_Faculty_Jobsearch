'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StorageService } from '@/lib/storage';
import { Institute, Job, Application } from '@/types';
import SelectionCommitteeModal from '@/components/SelectionCommitteeModal';
import InterviewScheduleModal from '@/components/InterviewScheduleModal';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Award
} from 'lucide-react';

export default function InstituteDashboardPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedScoreApp, setSelectedScoreApp] = useState<Application | null>(null);
  const [selectedScheduleApp, setSelectedScheduleApp] = useState<Application | null>(null);

  useEffect(() => {
    // Current demo institute: IIT Bombay (inst-iitb)
    const inst = StorageService.getInstituteById('inst-iitb');
    if (inst) setInstitute(inst);

    const allJobs = StorageService.getJobs();
    setJobs(allJobs.filter(j => j.instituteId === 'inst-iitb'));

    setApplications(StorageService.getApplications());

    const handleUpdate = () => {
      const i = StorageService.getInstituteById('inst-iitb');
      if (i) setInstitute(i);
      const aj = StorageService.getJobs();
      setJobs(aj.filter(j => j.instituteId === 'inst-iitb'));
      setApplications(StorageService.getApplications());
    };
    window.addEventListener('acad-storage-updated', handleUpdate);
    return () => window.removeEventListener('acad-storage-updated', handleUpdate);
  }, []);

  if (!institute) return null;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      
      {/* Header Profile - Full Width */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 shrink-0 overflow-hidden shadow-sm">
              <Image
                src={institute.logo}
                alt={institute.name}
                width={80}
                height={80}
                unoptimized
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  {institute.name}
                </h1>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  AISHE: {institute.aisheCode}
                </span>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                  NAAC {institute.accreditation.naacGrade}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {institute.type} • {institute.location.city}, {institute.location.state}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5 font-medium">
                <span>Sanctioned Faculty: <strong>{institute.stats.facultyCount}</strong></span>
                <span>•</span>
                <span>Active 7th CPC Vacancies: <strong className="text-brand-900">{jobs.length}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/institute/post-job"
              className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Post 7th CPC Vacancy</span>
            </Link>

            <Link
              href="/institute/ats"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200"
            >
              <Briefcase className="w-4 h-4 text-brand-700" />
              <span>8-Stage ATS Kanban</span>
            </Link>
          </div>

        </div>

        {/* Quick Institutional Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-100 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Live Positions</span>
            <strong className="font-mono text-2xl font-black text-brand-900">{jobs.length}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Total Applicants</span>
            <strong className="font-mono text-2xl font-black text-amber-700">{applications.length + 24}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Colloquiums Scheduled</span>
            <strong className="font-mono text-2xl font-black text-emerald-700">6</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Average Candidate API</span>
            <strong className="font-mono text-2xl font-black text-purple-700">84.2</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Postings + Recent Applicant Fast Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Column: Active Faculty Postings */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-700" />
              <span>Active Departmental Vacancies ({jobs.length})</span>
            </h2>
            <Link href="/institute/post-job" className="text-xs font-bold text-brand-700 hover:underline">
              + Post New &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {job.reservationCategory}
                    </span>
                    <h3 className="font-serif font-bold text-slate-900 text-base sm:text-lg mt-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{job.department} • Advt: {job.advertisementNumber}</p>
                  </div>

                  <span className="text-xs font-bold font-mono text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                    {job.payScale.cpcBand.split('(')[0]}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
                  <span>Deadline: <strong className="text-slate-900">{job.applicationDeadline}</strong></span>
                  <span>•</span>
                  <span>Applicants: <strong className="text-brand-900 font-bold">{job.applicantCount}</strong></span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-brand-700 hover:text-brand-900 font-bold underline"
                  >
                    View Public Page
                  </Link>

                  <Link
                    href="/institute/ats"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-900 text-white hover:bg-brand-800 font-bold text-xs transition shadow-sm"
                  >
                    <span>Manage ATS Candidates</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Fast-Triage Candidate Stream */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span>Selection Committee Fast-Triage</span>
            </h2>
            <Link href="/institute/ats" className="text-xs font-bold text-brand-700 hover:underline">
              Open ATS Kanban &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {app.candidateName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Applied for: {app.jobTitle}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                      {app.matchScore}% Match
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                      Degree: {app.highestDegree.split(' ')[0] || 'Ph.D.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Stage: {app.status.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedScoreApp(app)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition text-xs border border-slate-200"
                    >
                      Committee Score
                    </button>
                    <button
                      onClick={() => setSelectedScheduleApp(app)}
                      className="px-3 py-1.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold transition text-xs shadow-sm"
                    >
                      Schedule Colloquium
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Selection Committee Score Modal */}
      {selectedScoreApp && (
        <SelectionCommitteeModal
          application={selectedScoreApp}
          onClose={() => setSelectedScoreApp(null)}
          onScoreSubmitted={() => {
            setApplications(StorageService.getApplications());
          }}
        />
      )}

      {/* Interview Scheduler Modal */}
      {selectedScheduleApp && (
        <InterviewScheduleModal
          application={selectedScheduleApp}
          onClose={() => setSelectedScheduleApp(null)}
          onScheduled={() => {
            setApplications(StorageService.getApplications());
          }}
        />
      )}

    </div>
  );
}
