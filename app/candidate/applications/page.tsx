'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StorageService } from '@/lib/storage';
import { Application } from '@/types';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ArrowLeft, 
  ExternalLink,
  Users
} from 'lucide-react';

const STAGES = [
  { key: 'applied', label: '1. Applied' },
  { key: 'screening', label: '2. Screening' },
  { key: 'eligible', label: '3. Eligible' },
  { key: 'shortlisted', label: '4. Shortlisted' },
  { key: 'interview_scheduled', label: '5. Colloquium Set' },
  { key: 'committee_review', label: '6. Board Scoring' },
  { key: 'offer_extended', label: '7. Offer Issued' },
  { key: 'joined', label: '8. Joined' },
];

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    setApplications(StorageService.getApplications());
    const handleUpdate = () => setApplications(StorageService.getApplications());
    window.addEventListener('acad-storage-updated', handleUpdate);
    return () => window.removeEventListener('acad-storage-updated', handleUpdate);
  }, []);

  const getStageIndex = (status: string) => {
    const idx = STAGES.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
            <Link href="/candidate/dashboard" className="hover:text-brand-700 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-brand-900 font-bold">Applications</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            My Applications &amp; Selection Board Tracker
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time multi-stage status across university faculty search committees.
          </p>
        </div>

        <Link
          href="/jobs"
          className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
        >
          <span>Find More Vacancies</span>
        </Link>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.map((app) => {
          const currentStageIdx = getStageIndex(app.status);

          return (
            <div
              key={app.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-brand-900 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                      {app.instituteName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">App #{app.id}</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {app.jobTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Applied on: <strong className="text-slate-800">{app.appliedDate}</strong> • Profile Fit Index: <strong className="text-emerald-700 font-mono">{app.matchScore}%</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/jobs/${app.jobId}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition border border-slate-200"
                  >
                    <span>View Advert</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 8-Stage Visual Progress Ribbon */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Selection Pipeline (8 Stages):
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {STAGES.map((stage, idx) => {
                    const isPassed = idx <= currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div
                        key={stage.key}
                        className={`p-3 rounded-2xl border text-center transition ${
                          isCurrent
                            ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                            : isPassed
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {isPassed ? (
                            <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-amber-700' : 'text-emerald-600'}`} />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <span className="text-[10px] font-bold block leading-tight">
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interview Box if scheduled */}
              {app.interviewSlot && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-emerald-900">
                      <Calendar className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-sm">Faculty Selection Colloquium Scheduled</h4>
                    </div>

                    {app.interviewSlot.meetingLink && (
                      <a
                        href={app.interviewSlot.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm self-start sm:self-auto"
                      >
                        <span>Join Virtual Meeting</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div>
                      <strong className="text-slate-900">Date &amp; Time: </strong>
                      <span>{app.interviewSlot.date} at {app.interviewSlot.time}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900">Format: </strong>
                      <span>{app.interviewSlot.platform}</span>
                    </div>
                  </div>

                  {app.interviewSlot.instructions && (
                    <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-emerald-100">
                      &quot;{app.interviewSlot.instructions}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Selection Committee Review Summary */}
              {app.reviewerScores && app.reviewerScores.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-700" /> Selection Committee Evaluation Feedback:
                  </span>
                  <div className="space-y-1.5">
                    {app.reviewerScores.map((score, i) => (
                      <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-800 font-medium">{score.reviewerRole} ({score.reviewerName})</span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-emerald-700 font-bold">{score.recommendation}</span>
                          <span className="font-black text-slate-900">{score.totalScore}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {applications.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 mx-auto flex items-center justify-center border border-brand-200">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-slate-900 text-lg">No Applications Submitted Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You haven&apos;t applied to any academic faculty vacancies yet. Explore UGC &amp; AICTE accredited positions with verified 7th CPC pay bands.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-900 text-white font-bold text-xs hover:bg-brand-800 transition shadow-sm"
            >
              <span>Explore Faculty Openings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
