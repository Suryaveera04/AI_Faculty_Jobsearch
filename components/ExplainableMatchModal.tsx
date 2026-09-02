'use client';

import React from 'react';
import { Job, CandidateProfile } from '@/types';
import { calculateMatchScore } from '@/lib/scoring';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Layers,
  X 
} from 'lucide-react';

interface ExplainableMatchModalProps {
  job: Job | null;
  candidateProfile: CandidateProfile;
  onClose: () => void;
  onApply?: (jobId: string) => void;
}

export default function ExplainableMatchModal({
  job,
  candidateProfile,
  onClose,
  onApply,
}: ExplainableMatchModalProps) {
  if (!job) return null;

  const match = calculateMatchScore(candidateProfile, job);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-800 shadow-2xl animate-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">
                Explainable Match Breakdown
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Transparent assessment comparing Dr. {candidateProfile.name}&apos;s credentials against statutory job criteria.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Overall Match Banner */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-white border border-amber-300 flex flex-col items-center justify-center shadow-sm">
              <span className="font-mono text-2xl font-black text-amber-700">{match.overallScore}%</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Fit Index</span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {match.overallScore >= 85 ? 'Outstanding Candidate Fit' : match.overallScore >= 70 ? 'Strong Candidate Alignment' : 'Moderate Alignment'}
              </h4>
              <p className="text-xs text-slate-600">
                {job.title} • <strong className="text-brand-900">{job.instituteShortName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border ${
              match.meetsMandatoryNetPhd
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-crimson-50 text-crimson-800 border-crimson-300'
            }`}>
              <ShieldCheck className="w-4 h-4" />
              {match.meetsMandatoryNetPhd ? 'Statutory Eligibility: PASS' : 'Statutory Criteria: DEFICIENT'}
            </span>
          </div>
        </div>

        {/* 4-Pillar Score Breakdown Bars */}
        <div className="mt-6 space-y-3.5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Weighted Evaluation Pillars (UGC/AICTE Model)
          </h4>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {/* 1. Qualifications */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  Mandatory Qualifications &amp; NET/Ph.D. Norms (35%)
                </span>
                <span className="font-mono text-brand-700 font-bold">{match.qualificationMatch}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${match.qualificationMatch}%` }}
                />
              </div>
            </div>

            {/* 2. Research Synergy */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Research Domain &amp; Specialization Synergy (30%)
                </span>
                <span className="font-mono text-amber-700 font-bold">{match.researchSynergy}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${match.researchSynergy}%` }}
                />
              </div>
            </div>

            {/* 3. UGC-CARE Pubs */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  UGC-CARE / Scopus Publication Density (20%)
                </span>
                <span className="font-mono text-emerald-700 font-bold">{match.ugcCarePubsFit}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${match.ugcCarePubsFit}%` }}
                />
              </div>
            </div>

            {/* 4. Experience */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  Teaching &amp; Postdoctoral Experience Delta (15%)
                </span>
                <span className="font-mono text-purple-700 font-bold">{match.experienceMatch}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${match.experienceMatch}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Positive Signals & Gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Positive Candidate Signals
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {match.positiveSignals.map((sig, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Advisory Notes &amp; Gaps
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {match.potentialGaps.length > 0 ? (
                match.potentialGaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{gap}</span>
                  </li>
                ))
              ) : (
                <li className="text-emerald-700 text-xs font-medium">No critical deficits detected.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            Computed using deterministic UGC-2018 algorithms.
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Close
            </button>

            {onApply && (
              <button
                onClick={() => {
                  onApply(job.id);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold transition shadow-sm"
              >
                Proceed to Apply
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
