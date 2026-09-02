'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StorageService } from '@/lib/storage';
import { Application, ApplicationStage } from '@/types';
import SelectionCommitteeModal from '@/components/SelectionCommitteeModal';
import InterviewScheduleModal from '@/components/InterviewScheduleModal';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Search, 
  Sparkles,
  Award
} from 'lucide-react';

const KANBAN_STAGES: { key: ApplicationStage; label: string; countColor: string }[] = [
  { key: 'applied', label: '1. Applied', countColor: 'bg-slate-200 text-slate-800' },
  { key: 'screening', label: '2. Screening', countColor: 'bg-blue-100 text-blue-800' },
  { key: 'eligible', label: '3. Eligible', countColor: 'bg-amber-100 text-amber-800' },
  { key: 'shortlisted', label: '4. Shortlisted', countColor: 'bg-purple-100 text-purple-800' },
  { key: 'interview_scheduled', label: '5. Colloquium Set', countColor: 'bg-indigo-100 text-indigo-800' },
  { key: 'committee_review', label: '6. Board Scoring', countColor: 'bg-emerald-100 text-emerald-800' },
  { key: 'offer', label: '7. Offer Extended', countColor: 'bg-emerald-200 text-emerald-900' },
  { key: 'joined', label: '8. Joined', countColor: 'bg-green-200 text-green-900' },
];

export default function InstituteAtsKanbanPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedScoreApp, setSelectedScoreApp] = useState<Application | null>(null);
  const [selectedScheduleApp, setSelectedScheduleApp] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setApplications(StorageService.getApplications());
    const handleUpdate = () => setApplications(StorageService.getApplications());
    window.addEventListener('acad-storage-updated', handleUpdate);
    return () => window.removeEventListener('acad-storage-updated', handleUpdate);
  }, []);

  const handleMoveStage = (appId: string, currentStage: ApplicationStage, direction: 'forward' | 'backward') => {
    const stageKeys = KANBAN_STAGES.map(s => s.key);
    const currentIdx = stageKeys.indexOf(currentStage);
    const nextIdx = direction === 'forward' ? currentIdx + 1 : currentIdx - 1;
    if (nextIdx >= 0 && nextIdx < stageKeys.length) {
      const nextStage = stageKeys[nextIdx];
      StorageService.updateApplicationStage(appId, nextStage);
    }
  };

  const filteredApps = applications.filter(app => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.candidateName.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-6">
      
      {/* Header Bar - Full Width */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
            <Link href="/institute/dashboard" className="hover:text-brand-700 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-brand-900 font-bold">Academic ATS</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            8-Stage Academic ATS Kanban Board
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            UGC &amp; AICTE compliant multi-reviewer selection workflow from Table 3A screening to formal appointment orders.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 shadow-sm">
            <Search className="w-4 h-4 text-brand-600 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applicants..."
              className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-36 sm:w-48 font-medium"
            />
          </div>

          <Link
            href="/institute/post-job"
            className="px-4 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Vacancy</span>
          </Link>
        </div>
      </div>

      {/* 8-Stage Kanban Horizontal Scroll Area - Full Space */}
      <div className="overflow-x-auto pb-6">
        <div className="flex items-start gap-4 min-w-[1700px]">
          
          {KANBAN_STAGES.map((stage) => {
            const stageApps = filteredApps.filter(a => a.status === stage.key);

            return (
              <div
                key={stage.key}
                className="w-72 bg-slate-100 rounded-3xl border border-slate-200 p-4 shrink-0 flex flex-col space-y-3 shadow-sm min-h-[600px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900 text-xs truncate">
                    {stage.label}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${stage.countColor}`}>
                    {stageApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-3 text-xs"
                    >
                      {/* Candidate Name & Job */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {app.candidateName}
                          </h4>
                          <span className="text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                            {app.matchScore}% Fit
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                          {app.jobTitle}
                        </p>
                      </div>

                      {/* UGC Metrics */}
                      <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-slate-50 text-[10px] text-slate-600 border border-slate-100">
                        <div>Degree: <strong className="text-brand-900 font-mono">{app.highestDegree.split(' ')[0] || 'Ph.D.'}</strong></div>
                        <div>NET: <strong className="text-emerald-700">Qualified</strong></div>
                      </div>

                      {/* Interview Badge if present */}
                      {app.interviewSlot && (
                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-900">
                          Colloquium: <strong>{app.interviewSlot.date}</strong>
                        </div>
                      )}

                      {/* Committee Scores if present */}
                      {app.reviewerScores && app.reviewerScores.length > 0 && (
                        <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-[10px] text-purple-900">
                          {app.reviewerScores.length} Committee Reviews Logged
                        </div>
                      )}

                      {/* Quick Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t border-slate-100 text-[11px]">
                        <button
                          onClick={() => setSelectedScoreApp(app)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                        >
                          Score
                        </button>

                        <button
                          onClick={() => setSelectedScheduleApp(app)}
                          className="px-2 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-900 font-bold transition"
                        >
                          Colloquium
                        </button>

                        {/* Move Stage arrows */}
                        <div className="flex items-center gap-1">
                          {stage.key !== 'applied' && (
                            <button
                              onClick={() => handleMoveStage(app.id, app.status, 'backward')}
                              title="Move Back"
                              className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 font-mono text-[10px]"
                            >
                              &larr;
                            </button>
                          )}
                          {stage.key !== 'joined' && (
                            <button
                              onClick={() => handleMoveStage(app.id, app.status, 'forward')}
                              title="Advance Stage"
                              className="p-1 rounded bg-brand-900 text-white hover:bg-brand-800 font-mono text-[10px]"
                            >
                              &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-[11px] text-slate-400 text-center p-2 font-medium">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}

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
