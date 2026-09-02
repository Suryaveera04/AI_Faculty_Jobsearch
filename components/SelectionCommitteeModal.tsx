'use client';

import React, { useState } from 'react';
import { Application, ReviewerScoreItem } from '@/types';
import { StorageService } from '@/lib/storage';
import { 
  Users, 
  Award, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  X, 
  ShieldAlert 
} from 'lucide-react';

interface SelectionCommitteeModalProps {
  application: Application | null;
  onClose: () => void;
  onScoreSubmitted?: () => void;
}

export default function SelectionCommitteeModal({
  application,
  onClose,
  onScoreSubmitted,
}: SelectionCommitteeModalProps) {
  const [reviewerName, setReviewerName] = useState('Prof. Ramesh K. Narang');
  const [reviewerRole, setReviewerRole] = useState<ReviewerScoreItem['reviewerRole']>('Dean (Academic)');
  const [researchScore, setResearchScore] = useState<number>(28);
  const [teachingScore, setTeachingScore] = useState<number>(23);
  const [apiScoreVal, setApiScoreVal] = useState<number>(19);
  const [interviewScore, setInterviewScore] = useState<number>(23);
  const [recommendation, setRecommendation] = useState<ReviewerScoreItem['recommendation']>('Strongly Recommend');
  const [confidentialNotes, setConfidentialNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!application) return null;

  const totalScore = researchScore + teachingScore + apiScoreVal + interviewScore;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const scoreItem: ReviewerScoreItem = {
      reviewerId: `rev-${Date.now()}`,
      reviewerName,
      reviewerRole,
      researchPotentialScore: researchScore,
      teachingPedagogyScore: teachingScore,
      apiScoreValidation: apiScoreVal,
      interviewPerformance: interviewScore,
      totalScore,
      recommendation,
      confidentialNotes: confidentialNotes || 'Candidate demonstrated exemplary research output and pedagogical vision.',
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    StorageService.addReviewerScore(application.id, scoreItem);

    setTimeout(() => {
      setSubmitting(false);
      if (onScoreSubmitted) onScoreSubmitted();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-800 shadow-2xl animate-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200">
                <Users className="w-5 h-5" />
              </span>
              <h3 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">
                Statutory Selection Committee Scoring
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Applicant: <strong className="text-slate-900">{application.candidateName}</strong> • {application.jobTitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Committee Reviews if any */}
        {application.reviewerScores && application.reviewerScores.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Previous Member Assessments ({application.reviewerScores.length})
            </span>
            <div className="space-y-2">
              {application.reviewerScores.map((score, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div>
                    <span className="font-bold text-slate-900">{score.reviewerName}</span>{' '}
                    <span className="text-slate-500">({score.reviewerRole})</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">&quot;{score.confidentialNotes}&quot;</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-amber-700 text-sm">{score.totalScore}/100</span>
                    <span className="block text-[10px] text-emerald-700 font-bold">{score.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Reviewer Name:</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reviewer Role on Board:</label>
              <select
                value={reviewerRole}
                onChange={(e: any) => setReviewerRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
              >
                <option value="Dean (Academic)">Dean (Academic / Faculty Affairs)</option>
                <option value="Head of Department">Head of Department (HOD)</option>
                <option value="External Subject Expert 1">External Subject Expert 1 (IIT/IISc Nominee)</option>
                <option value="External Subject Expert 2">External Subject Expert 2 (UGC Nominee)</option>
                <option value="Vice Chancellor Nominee">Vice Chancellor / Board of Governors Nominee</option>
              </select>
            </div>
          </div>

          {/* Criteria Sliders */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-600 uppercase text-[11px]">Evaluation Dimensions</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-500">Total Score:</span>
                <span className="text-lg font-black text-brand-900">{totalScore} / 100</span>
              </div>
            </div>

            {/* 1. Research Potential */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> Research Quality &amp; Publication Track (Max: 30 pts)
                </span>
                <span className="font-mono font-bold text-amber-700">{researchScore} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={researchScore}
                onChange={(e) => setResearchScore(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* 2. Teaching Pedagogy */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-600" /> Teaching Pedagogy &amp; Statement (Max: 25 pts)
                </span>
                <span className="font-mono font-bold text-brand-700">{teachingScore} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={teachingScore}
                onChange={(e) => setTeachingScore(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* 3. API Score Validation */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> UGC 2018 API Score Verification (Max: 20 pts)
                </span>
                <span className="font-mono font-bold text-emerald-700">{apiScoreVal} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={apiScoreVal}
                onChange={(e) => setApiScoreVal(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 4. Interview & Seminar Talk */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-600" /> Colloquium &amp; Committee Interaction (Max: 25 pts)
                </span>
                <span className="font-mono font-bold text-purple-700">{interviewScore} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={interviewScore}
                onChange={(e) => setInterviewScore(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Recommendation Dropdown */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Statutory Recommendation:</label>
            <select
              value={recommendation}
              onChange={(e: any) => setRecommendation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-bold"
            >
              <option value="Strongly Recommend">Strongly Recommend (Rank 1 Preference)</option>
              <option value="Recommend">Recommend for Selection</option>
              <option value="Reserve / Waitlist">Place on Statutory Reserve / Waitlist</option>
              <option value="Not Recommended">Not Recommended</option>
            </select>
          </div>

          {/* Confidential Remarks */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Confidential Selection Committee Notes:</label>
            <textarea
              rows={3}
              value={confidentialNotes}
              onChange={(e) => setConfidentialNotes(e.target.value)}
              placeholder="Record specific observations regarding candidate's research vision, external grant potential, or departmental fit..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Signed and logged in institute audit records.
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                {submitting ? 'Saving Assessment...' : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Submit Evaluation
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
