'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { StorageService } from '@/lib/storage';
import { calculateMatchScore } from '@/lib/scoring';
import { Job, CandidateProfile, Institute, Application } from '@/types';
import ExplainableMatchModal from '@/components/ExplainableMatchModal';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Send, 
  Award,
  ChevronRight,
  FileCheck
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [existingApp, setExistingApp] = useState<Application | null>(null);
  const [screeningAnswers, setScreeningAnswers] = useState<{ [qIdx: number]: string }>({});
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    const j = StorageService.getJobById(jobId);
    if (j) {
      setJob(j);
      const inst = StorageService.getInstituteById(j.instituteId);
      if (inst) setInstitute(inst);
    }
    const cand = StorageService.getCandidateProfile();
    setCandidateProfile(cand);

    const apps = StorageService.getApplications();
    const found = apps.find(a => a.jobId === jobId && a.candidateId === cand.id);
    if (found) setExistingApp(found);
  }, [jobId]);

  if (!job) {
    return (
      <div className="w-full px-4 sm:px-8 py-20 text-center text-slate-500 space-y-4">
        <h2 className="text-xl font-serif text-slate-900 font-bold">Faculty Vacancy Not Found</h2>
        <p className="text-xs">The requested academic vacancy does not exist or has expired.</p>
        <Link href="/jobs" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 text-white text-xs font-bold shadow-sm">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Job Directory
        </Link>
      </div>
    );
  }

  const matchBreakdown = candidateProfile ? calculateMatchScore(candidateProfile, job) : null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);

    const formattedAnswers = job.screeningQuestions.map((q, idx) => ({
      question: q,
      answer: screeningAnswers[idx] || 'Satisfies institutional criteria.',
    }));

    const newApp = StorageService.applyToJob(job.id, formattedAnswers);
    
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#2563EB', '#10B981'],
      });
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsApplying(false);
      setAppliedSuccess(true);
      if (newApp) setExistingApp(newApp);
    }, 800);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/jobs" className="hover:text-brand-700 flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3 h-3" /> All Vacancies
        </Link>
        <span>/</span>
        <span className="text-slate-700">{job.instituteShortName}</span>
        <span>/</span>
        <span className="text-brand-900 font-bold truncate max-w-md">{job.title}</span>
      </div>

      {/* Main Header Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 shrink-0 overflow-hidden shadow-sm">
              <Image
                src={job.instituteLogo}
                alt={job.instituteName}
                width={80}
                height={80}
                unoptimized
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  Advt No: {job.advertisementNumber}
                </span>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
                  {job.reservationCategory}
                </span>
                {institute?.accreditation.naacGrade && (
                  <span className="text-[11px] font-mono font-bold bg-brand-50 text-brand-800 px-2 py-0.5 rounded-lg border border-brand-200">
                    NAAC {institute.accreditation.naacGrade}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5 font-medium">
                <span className="font-bold text-slate-900">{job.instituteName}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location.city}, {job.location.state}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Deadline: <strong className="text-amber-800 font-bold">{job.applicationDeadline}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Match Pill */}
          {matchBreakdown && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center shrink-0 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Candidate Profile Fit
              </span>
              <div className="font-mono text-3xl font-black text-amber-700">
                {matchBreakdown.overallScore}%
              </div>
              <button
                onClick={() => setShowMatchModal(true)}
                className="text-[11px] text-brand-700 hover:text-brand-900 font-bold underline block mx-auto"
              >
                Explainable Breakdown &rarr;
              </button>
            </div>
          )}

        </div>

        {/* 7th CPC Pay Scale & Highlights Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">7th CPC Pay Scale</span>
            <div className="font-bold text-slate-900 flex items-center gap-1 text-sm">
              <IndianRupee className="w-4 h-4 text-amber-600" />
              <span>{job.payScale.cpcBand}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Entry Pay: {job.payScale.entryPay}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Estimated Gross Monthly</span>
            <div className="font-bold text-emerald-800 text-sm">{job.payScale.grossMonthlyEstimated}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">With 50% DA + 27% HRA + TA</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Minimum Qualification</span>
            <div className="font-bold text-slate-900 flex items-center gap-1 text-sm">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>{job.requiredQualifications.minDegree}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{job.requiredQualifications.ugcRegulationsYear}</div>
          </div>
        </div>

      </div>

      {/* Main Content Layout - Full Space */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Column: Detailed Descriptions & Requirements */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Overview */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Position Overview</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
              {job.description}
            </p>
          </div>

          {/* Statutory Minimum Qualifications */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                Statutory Qualifications per UGC / AICTE Gazette
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Degree &amp; Ph.D. Regulations: </strong>
                  <span>{job.requiredQualifications.minDegree} with {job.requiredQualifications.phdNorms}.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">National Eligibility Test (NET/SLET): </strong>
                  <span>
                    {job.requiredQualifications.netSletMandatory 
                      ? 'UGC/CSIR NET or SLET qualification is MANDATORY for candidate consideration.' 
                      : 'Exemption from NET granted per UGC 2009/2016 Ph.D. regulations.'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Publications Benchmark: </strong>
                  <span>Minimum {job.requiredQualifications.minUgcCarePubs} peer-reviewed research papers in UGC-CARE / Scopus / SCI indexed journals.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Experience Criterion: </strong>
                  <span>Minimum {job.requiredQualifications.minExperienceYears} years of teaching/research/postdoc experience post-qualification.</span>
                </div>
              </div>
            </div>

            {/* Specialization Requirements */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Domain Specialization Priorities:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {job.requiredQualifications.specializationRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Institutional Allowances & Benefits */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Institutional Grants &amp; Campus Perks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {job.payScale.allowances.map((allw, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium">{allw}</span>
                </div>
              ))}
              {job.benefits.map((ben, idx) => (
                <div key={`b-${idx}`} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="font-medium">{ben}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 8-Stage Selection Roadmap */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Selection Process Roadmap</h3>
            <div className="space-y-2 text-xs">
              {job.selectionProcess.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-mono font-bold text-brand-700 bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-sm">
                    0{idx + 1}
                  </span>
                  <span className="text-slate-700 mt-0.5 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Application Form */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="sticky top-24 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-5 shadow-md">
            
            {appliedSuccess || existingApp ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-lg">Application Submitted!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your academic dossier has been logged into {job.instituteShortName}&apos;s ATS selection committee queue.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Stage:</span>
                    <span className="font-bold text-brand-900 uppercase">
                      {(existingApp?.status || 'applied').replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Computed Fit:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {existingApp?.matchScore || matchBreakdown?.overallScore}%
                    </span>
                  </div>
                </div>

                <Link
                  href="/candidate/applications"
                  className="w-full px-4 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <span>Track in My Applications</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base">
                    Submit Formal Application
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Applying as <strong className="text-slate-900">{candidateProfile?.name}</strong> with verified UGC dossier.
                  </p>
                </div>

                {/* Candidate Credentials Quick Summary */}
                {candidateProfile && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Highest Degree:</span>
                      <span className="text-slate-900 font-semibold truncate max-w-[150px]">{candidateProfile.highestDegree}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">UGC 2018 API Score:</span>
                      <span className="font-mono text-brand-900 font-bold">{candidateProfile.apiScore} / 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">UGC-CARE Pubs:</span>
                      <span className="text-emerald-700 font-bold">{candidateProfile.publications.length} Papers</span>
                    </div>
                  </div>
                )}

                {/* Mandatory Screening Questions */}
                {job.screeningQuestions.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                      Departmental Screening Questions ({job.screeningQuestions.length})
                    </span>

                    {job.screeningQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-1">
                        <label className="block text-xs text-slate-700 leading-snug font-medium">
                          {qIdx + 1}. {q}
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={screeningAnswers[qIdx] || ''}
                          onChange={(e) => setScreeningAnswers({ ...screeningAnswers, [qIdx]: e.target.value })}
                          placeholder="Provide specific details or citations..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="w-full px-5 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                  >
                    {isApplying ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Transmitting Dossier...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Submit to Selection Committee
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  By submitting, you authorize the institution&apos;s Faculty Search Committee to verify your publications and academic credentials per DPDP Act (2023) guidelines.
                </p>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* Explainable Match Modal */}
      {showMatchModal && candidateProfile && (
        <ExplainableMatchModal
          job={job}
          candidateProfile={candidateProfile}
          onClose={() => setShowMatchModal(false)}
        />
      )}

    </div>
  );
}
