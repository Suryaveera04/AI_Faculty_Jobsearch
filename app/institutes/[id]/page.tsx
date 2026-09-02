'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { StorageService } from '@/lib/storage';
import { Institute, Job, CandidateProfile } from '@/types';
import JobCard from '@/components/JobCard';
import ExplainableMatchModal from '@/components/ExplainableMatchModal';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Briefcase, 
  ExternalLink, 
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';

export default function InstituteDetailPage() {
  const params = useParams();
  const instId = params?.id as string;

  const [institute, setInstitute] = useState<Institute | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [selectedMatchJob, setSelectedMatchJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!instId) return;
    const inst = StorageService.getInstituteById(instId);
    if (inst) setInstitute(inst);

    const allJobs = StorageService.getJobs();
    setJobs(allJobs.filter(j => j.instituteId === instId));
    setCandidateProfile(StorageService.getCandidateProfile());
  }, [instId]);

  if (!institute) {
    return (
      <div className="w-full px-4 sm:px-8 py-20 text-center text-slate-500 space-y-4">
        <h2 className="text-xl font-serif text-slate-900 font-bold">University Not Found</h2>
        <p className="text-xs">The requested institution does not exist in the AISHE registry.</p>
        <Link href="/institutes" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 text-white text-xs font-bold shadow-sm">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to University Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/institutes" className="hover:text-brand-700 flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3 h-3" /> All Institutions
        </Link>
        <span>/</span>
        <span className="text-brand-900 font-bold">{institute.name}</span>
      </div>

      {/* University Profile Banner - Full Width */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 shrink-0 overflow-hidden shadow-sm">
              <Image
                src={institute.logo}
                alt={institute.name}
                width={96}
                height={96}
                unoptimized
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  AISHE Code: {institute.aisheCode}
                </span>
                <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                  NAAC {institute.accreditation.naacGrade} (Score: {institute.accreditation.naacScore}/4.0)
                </span>
                {institute.accreditation.nirfRankOverall && (
                  <span className="text-[11px] font-mono font-bold bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-full border border-brand-200">
                    NIRF #{institute.accreditation.nirfRankOverall} Overall
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                {institute.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {institute.location.city}, {institute.location.state} ({institute.location.pincode})
                </span>
                <span>•</span>
                <span>Est. {institute.establishedYear}</span>
                <span>•</span>
                <a
                  href={institute.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-700 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Official Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Faculty Recruitment Secretariat
            </span>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Mail className="w-3.5 h-3.5 text-brand-700" />
              <span>{institute.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{institute.contactPhone}</span>
            </div>
          </div>

        </div>

        {/* Research & Infrastructure Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Faculty Strength</span>
            <strong className="text-slate-900 font-mono text-base font-black">{institute.stats.facultyCount}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Scholars Enrolled</span>
            <strong className="text-brand-900 font-mono text-base font-black">{institute.stats.studentCount}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Patents Awarded</span>
            <strong className="text-amber-700 font-mono text-base font-black">{institute.stats.patentsFiled}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Average Faculty h-Index</span>
            <strong className="text-emerald-700 font-mono text-base font-black">{institute.stats.hIndexAverage}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Open Faculty Positions + Departments - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Left Column: Active Faculty Postings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              <span>Active Faculty Postings ({jobs.length})</span>
            </h2>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  candidateProfile={candidateProfile || undefined}
                  onOpenMatchModal={(j) => setSelectedMatchJob(j)}
                  featured={job.featured}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-500 shadow-sm">
              No current open vacancies for this institution at this moment.
            </div>
          )}
        </div>

        {/* Right Column: Academic Departments & Statutory Approvals */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-700" />
              <span>Academic Departments</span>
            </h3>

            <div className="space-y-2">
              {institute.departments.map((dept, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {dept}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm text-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Statutory Approvals</span>
            </h3>

            <div className="space-y-2 text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>UGC Section 2(f) &amp; 12(B) Recognition</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>AICTE Gazette Approved Standards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>NBA Tier-I Accredited Engineering Cadres</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Explainable Match Modal */}
      {selectedMatchJob && candidateProfile && (
        <ExplainableMatchModal
          job={selectedMatchJob}
          candidateProfile={candidateProfile}
          onClose={() => setSelectedMatchJob(null)}
          onApply={(jobId) => {
            StorageService.applyToJob(jobId);
          }}
        />
      )}

    </div>
  );
}
