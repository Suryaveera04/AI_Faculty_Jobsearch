'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroCanvas3D from '@/components/HeroCanvas3D';
import JobCard from '@/components/JobCard';
import ExplainableMatchModal from '@/components/ExplainableMatchModal';
import ResumeParserModal from '@/components/ResumeParserModal';
import { StorageService } from '@/lib/storage';
import { Job, CandidateProfile, Institute } from '@/types';
import { 
  Search, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  FileCheck,
  Award
} from 'lucide-react';

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [selectedMatchJob, setSelectedMatchJob] = useState<Job | null>(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setJobs(StorageService.getJobs());
    setInstitutes(StorageService.getInstitutes());
    setCandidateProfile(StorageService.getCandidateProfile());

    const handleUpdate = () => {
      setJobs(StorageService.getJobs());
      setInstitutes(StorageService.getInstitutes());
      setCandidateProfile(StorageService.getCandidateProfile());
    };
    window.addEventListener('acad-storage-updated', handleUpdate);
    return () => window.removeEventListener('acad-storage-updated', handleUpdate);
  }, []);

  const featuredJobs = jobs.filter(j => j.featured || j.applicantCount > 20).slice(0, 4);

  return (
    <div className="space-y-16 pb-20 w-full">
      
      {/* 1. HERO SECTION - Full Space Layout */}
      <section className="relative pt-6 sm:pt-10 pb-10 w-full px-4 sm:px-8 lg:px-12">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Vision & Pitch */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Next-Gen Academic Recruitment Operating System for India</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.12] tracking-tight">
                India&apos;s Intelligent <br className="hidden sm:inline" />
                <span className="blue-gradient-text">Academic Recruitment</span> <br />
                Ecosystem
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Replace unstructured notice boards and generic job portals with India&apos;s dedicated academic hiring operating system. Built for <strong>UGC &amp; AICTE 2018/2023 regulations</strong>, <strong>7th CPC pay bands</strong>, <strong>AI academic CV parsing</strong>, and <strong>multi-reviewer selection committee ATS</strong>.
              </p>

              {/* Search & Actions Bar */}
              <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-md max-w-2xl space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Search className="w-4 h-4 text-brand-600 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Designation, Department, or IIT / Central University..."
                    className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                  />
                </div>

                <Link
                  href={searchQuery ? `/jobs?search=${encodeURIComponent(searchQuery)}` : '/jobs'}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition shrink-0"
                >
                  <span>Search Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick Action Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <button
                  onClick={() => setShowCvModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 transition font-bold"
                >
                  <Sparkles className="w-4 h-4 text-brand-700" />
                  <span>Parse My Academic CV with AI</span>
                </button>

                <Link
                  href="/institute/post-job"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition font-semibold"
                >
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Post 7th CPC Vacancy (For Institutes)</span>
                </Link>
              </div>

              {/* Compliance Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>UGC 2018 Table 3A Scoring</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>UGC-CARE Journal Verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>DPDP Act (2023) Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Knowledge Graph Hero */}
            <div className="lg:col-span-6 w-full">
              <HeroCanvas3D />
            </div>

          </div>
        </div>
      </section>

      {/* 2. NATIONAL RECRUITMENT METRICS TICKER - Full Space */}
      <section className="border-y border-slate-200 bg-white py-8 w-full px-4 sm:px-8 lg:px-12">
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="font-mono text-3xl sm:text-4xl font-black text-brand-900">150+</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Verified Universities &amp; IITs</div>
              <div className="text-[11px] text-slate-500 mt-0.5">AISHE &amp; NAAC A++ Empanelled</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="font-mono text-3xl sm:text-4xl font-black text-brand-700">4,280+</div>
              <div className="text-xs font-bold text-slate-900 mt-1">7th CPC Faculty Vacancies</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Levels 10 through 15</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="font-mono text-3xl sm:text-4xl font-black text-emerald-700">94.8%</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Explainable Match Accuracy</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Deterministic UGC Algorithms</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="font-mono text-3xl sm:text-4xl font-black text-purple-700">8 Stages</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Selection Committee ATS</div>
              <div className="text-[11px] text-slate-500 mt-0.5">From Screening to Joining</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED 7TH CPC FACULTY VACANCIES - Full Space */}
      <section className="w-full px-4 sm:px-8 lg:px-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" /> High-Priority Vacancies
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Featured Positions at Premier Indian Institutions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Positions with verified 7th CPC Pay Bands, UGC-mandated qualifications, and housing allowances.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-brand-900 border border-slate-200 shadow-sm text-xs font-bold transition"
          >
            <span>View All {jobs.length} Vacancies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              candidateProfile={candidateProfile || undefined}
              onOpenMatchModal={(j) => setSelectedMatchJob(j)}
              featured={job.featured}
            />
          ))}
        </div>
      </section>

      {/* 4. THE ACADEXMATCH DIFFERENCE (VS AD-BOARDS) - Full Space */}
      <section className="bg-slate-100/80 py-16 border-y border-slate-200 w-full px-4 sm:px-8 lg:px-12">
        <div className="w-full space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider font-mono">
              The Academic Operating System
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
              Why Indian Academia Needs More Than a Notice Board
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Generic portals treat academic hiring like corporate IT jobs. ACADEXMATCH.AI models the full depth of Indian higher-education statutory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            
            {/* Card 1 */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                UGC &amp; AICTE Statutory Eligibility
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Automated enforcement of UGC 2009/2016 Ph.D. regulations, NET/SLET exemptions, API Table 3A score calculations, and mandatory 7th CPC Level 10-15 pay scales.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pre-screened reservation rosters (UR, OBC, SC, ST, EWS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>UGC-CARE List I &amp; Scopus journal checks</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                Multi-Reviewer Selection ATS
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Full 8-stage committee pipeline matching Indian university selection boards: Screening &rarr; Eligible &rarr; Shortlist &rarr; Colloquium &rarr; Committee Scoring &rarr; Offer.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Independent Dean, HOD &amp; Expert scoring sheets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Statutory recommendation &amp; confidential remarks</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                Explainable AI Matching
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Zero black-box video scoring or bias. Transparent match breakdown across qualifications (35%), research synergy (30%), UGC-CARE density (20%), and experience (15%).
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>AI academic CV parser with 96% accuracy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>DPDP Act (2023) Section 12 consent safeguards</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 5. TOP EMPANELLED UNIVERSITIES STRIP - Full Space */}
      <section className="w-full px-4 sm:px-8 lg:px-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Accredited Institutional Network
            </span>
            <h3 className="font-serif font-bold text-slate-900 text-xl sm:text-2xl mt-0.5">
              Leading Universities &amp; Institutes of Eminence
            </h3>
          </div>

          <Link
            href="/institutes"
            className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
          >
            <span>Explore All {institutes.length} Institutes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {institutes.map((inst) => (
            <Link
              key={inst.id}
              href={`/institutes/${inst.id}`}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition text-center space-y-2.5 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-1 mx-auto overflow-hidden shadow-sm">
                <Image
                  src={inst.logo}
                  alt={inst.name}
                  width={56}
                  height={56}
                  unoptimized
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-brand-700 transition">
                  {inst.shortName}
                </h4>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                    NAAC {inst.accreditation.naacGrade}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER - Full Space */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 p-8 sm:p-12 overflow-hidden shadow-xl text-white">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wider font-mono">
              Start Your Academic Journey Today
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
              Ready to Discover Your Next Professorship or Build Your Department?
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Join thousands of Indian scholars and research universities streamlining higher education hiring with statutory compliance and AI matching.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/jobs"
                className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs shadow-md transition"
              >
                Browse Faculty Openings
              </Link>
              <button
                onClick={() => setShowCvModal(true)}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition"
              >
                Launch AI Academic CV Parser
              </button>
            </div>
          </div>
        </div>
      </section>

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

      {/* AI Resume Parser Modal */}
      <ResumeParserModal
        isOpen={showCvModal}
        onClose={() => setShowCvModal(false)}
        onProfileUpdated={() => {
          setCandidateProfile(StorageService.getCandidateProfile());
        }}
      />

    </div>
  );
}
