'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StorageService } from '@/lib/storage';
import { getUgcTable3ABreakdown, verifyJournalUgcCareStatus } from '@/lib/scoring';
import { CandidateProfile, PublicationItem, EducationItem, ExperienceItem } from '@/types';
import ResumeParserModal from '@/components/ResumeParserModal';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  CheckCircle2, 
  Plus, 
  Save, 
  Trash2, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // New Publication Quick Add state
  const [newPubTitle, setNewPubTitle] = useState('');
  const [newPubJournal, setNewPubJournal] = useState('');
  const [newPubYear, setNewPubYear] = useState(2026);
  const [newPubAuthors, setNewPubAuthors] = useState('');
  const [newPubDoi, setNewPubDoi] = useState('');

  useEffect(() => {
    setProfile(StorageService.getCandidateProfile());
    const handleUpdate = () => setProfile(StorageService.getCandidateProfile());
    window.addEventListener('acad-storage-updated', handleUpdate);
    return () => window.removeEventListener('acad-storage-updated', handleUpdate);
  }, []);

  if (!profile) return null;

  const currentApiBreakdown = getUgcTable3ABreakdown(profile);

  const handleProfileFieldChange = (field: keyof CandidateProfile, value: any) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSaveProfile = () => {
    if (!profile) return;
    const computed = getUgcTable3ABreakdown(profile);
    const updated = {
      ...profile,
      apiScore: computed.totalScore,
    };
    StorageService.updateCandidateProfile(updated);
    setProfile(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubTitle || !newPubJournal) return;

    const ugcStatus = verifyJournalUgcCareStatus(newPubJournal);

    const newPub: PublicationItem = {
      id: `pub-${Date.now()}`,
      title: newPubTitle,
      journalOrConference: newPubJournal,
      year: Number(newPubYear),
      authors: newPubAuthors || profile.name,
      doi: newPubDoi || undefined,
      ugcCareListed: ugcStatus.isUgcCare,
      scopusIndexed: ugcStatus.isScopus,
      sciScieIndexed: ugcStatus.group === 'Group II (Scopus/SCI)',
      impactFactor: ugcStatus.sampleImpactFactor,
      type: 'Journal',
    };

    const updatedPubs = [newPub, ...profile.publications];
    const updatedProfile = { ...profile, publications: updatedPubs };
    const computed = getUgcTable3ABreakdown(updatedProfile);
    updatedProfile.apiScore = computed.totalScore;

    StorageService.updateCandidateProfile(updatedProfile);
    setProfile(updatedProfile);

    // Reset Form
    setNewPubTitle('');
    setNewPubJournal('');
    setNewPubAuthors('');
    setNewPubDoi('');
  };

  const handleDeletePublication = (pubId: string) => {
    const updatedPubs = profile.publications.filter(p => p.id !== pubId);
    const updatedProfile = { ...profile, publications: updatedPubs };
    const computed = getUgcTable3ABreakdown(updatedProfile);
    updatedProfile.apiScore = computed.totalScore;

    StorageService.updateCandidateProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
            <Link href="/candidate/dashboard" className="hover:text-brand-700 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-brand-900 font-bold">Academic Dossier</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            Academic Profile &amp; UGC API Score Dossier
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Compliant with UGC Regulations 2018 Table 3A (Criteria for Short-listing of Candidates for Assistant Professor in Universities).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCvModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-brand-700" />
            <span>Re-Parse CV with AI</span>
          </button>

          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-bold">Academic dossier saved and UGC API score recalculated successfully!</span>
        </div>
      )}

      {/* Main Grid: Left Form/Pubs + Right UGC API Score Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Column (8 cols): Bio, Degrees, NET/Ph.D. Compliance, Publications */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Basic Scholar Identity */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-slate-900 text-lg">Scholar Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name (with Title):</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Email:</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Academic Designation:</label>
                <input
                  type="text"
                  value={profile.currentDesignation}
                  onChange={(e) => handleProfileFieldChange('currentDesignation', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current University / Institution:</label>
                <input
                  type="text"
                  value={profile.currentInstitute}
                  onChange={(e) => handleProfileFieldChange('currentInstitute', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">Research Biography &amp; Scholarly Focus:</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => handleProfileFieldChange('bio', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-brand-500 font-medium leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Statutory NET/SLET & Ph.D. Compliance */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                UGC &amp; AICTE Statutory Declarations
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.netSletStatus?.isQualified || false}
                    onChange={(e) => handleProfileFieldChange('netSletStatus', { ...profile.netSletStatus, isQualified: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 accent-brand-600"
                  />
                  <span>UGC-NET / CSIR-NET Qualified</span>
                </label>
                {profile.netSletStatus?.isQualified && (
                  <div className="space-y-1 pt-1">
                    <input
                      type="text"
                      placeholder="Roll / Certificate No."
                      value={profile.netSletStatus?.rollNumber || ''}
                      onChange={(e) => handleProfileFieldChange('netSletStatus', { ...profile.netSletStatus, rollNumber: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Exam: {profile.netSletStatus?.examType || 'UGC-NET (JRF)'} ({profile.netSletStatus?.subject || 'Computer Science'})
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.phdStatus?.isUgc2009_2016Compliant || false}
                    onChange={(e) => handleProfileFieldChange('phdStatus', { ...profile.phdStatus, isUgc2009_2016Compliant: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>Ph.D. Compliant (UGC 2009/2016 Regs)</span>
                </label>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Certified that Ph.D. degree was awarded via regular mode with external thesis evaluation and open viva voce per UGC regulations.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Publications & UGC-CARE Validator */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span>Research Publications &amp; UGC-CARE List ({profile.publications.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  Scored under UGC Table 3A Item 5 (2 points per peer-reviewed journal paper, max 10 points for Asst. Prof).
                </p>
              </div>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddPublication} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-slate-700 uppercase text-[11px] block">
                Add Peer-Reviewed Journal / Conference Paper
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Paper Title..."
                  value={newPubTitle}
                  onChange={(e) => setNewPubTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400"
                />
                <input
                  type="text"
                  placeholder="Journal Name (e.g. IEEE Transactions, Nature, ACM)..."
                  value={newPubJournal}
                  onChange={(e) => setNewPubJournal(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Year"
                  value={newPubYear}
                  onChange={(e) => setNewPubYear(Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Authors (comma separated)"
                  value={newPubAuthors}
                  onChange={(e) => setNewPubAuthors(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
                <input
                  type="text"
                  placeholder="DOI / Link"
                  value={newPubDoi}
                  onChange={(e) => setNewPubDoi(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Validate &amp; Add Paper
                </button>
              </div>
            </form>

            {/* List of Publications */}
            <div className="space-y-3">
              {profile.publications.map((pub) => (
                <div
                  key={pub.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs shadow-sm hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {pub.title}
                      </h4>
                      <p className="text-slate-500 text-xs">
                        {pub.authors} • <strong className="text-slate-700">{pub.journalOrConference}</strong> ({pub.year})
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeletePublication(pub.id)}
                      className="text-slate-400 hover:text-crimson-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {pub.ugcCareListed && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        UGC-CARE Group I Validated
                      </span>
                    )}
                    {(pub.scopusIndexed || pub.sciScieIndexed) && (
                      <span className="text-[10px] font-bold bg-brand-50 text-brand-800 px-2 py-0.5 rounded border border-brand-200">
                        Scopus / SCI Indexed
                      </span>
                    )}
                    {pub.impactFactor && (
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        IF: {pub.impactFactor}
                      </span>
                    )}
                    {pub.doi && (
                      <span className="text-[10px] font-mono text-slate-400">
                        DOI: {pub.doi}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column (4 cols): UGC Regulations 2018 Table 3A Scoring Card */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="sticky top-24 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-5 shadow-md">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">
                  UGC 2018 Statutory Model
                </span>
                <h3 className="font-serif font-bold text-slate-900 text-lg">
                  Table 3A API Score
                </h3>
              </div>

              <div className="text-right">
                <span className="font-mono text-3xl font-black text-brand-900">
                  {currentApiBreakdown.totalScore}
                </span>
                <span className="text-xs text-slate-400 block font-mono">/ 100</span>
              </div>
            </div>

            {/* Score Breakdown List */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">1. Graduation Score:</span>
                <span className="font-mono font-bold text-brand-900">{currentApiBreakdown.graduationScore} / 15</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">2. Post Graduation Score:</span>
                <span className="font-mono font-bold text-brand-900">{currentApiBreakdown.postGraduationScore} / 25</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">3. Ph.D. Degree:</span>
                <span className="font-mono font-bold text-brand-900">{currentApiBreakdown.phdScore} / 30</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">4. NET with JRF / NET:</span>
                <span className="font-mono font-bold text-brand-900">{currentApiBreakdown.netJrfScore} / 7</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">5. Research Publications:</span>
                <span className="font-mono font-bold text-emerald-700">{currentApiBreakdown.publicationsScore} / 10</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">6. Teaching / Postdoc Exp:</span>
                <span className="font-mono font-bold text-purple-700">{currentApiBreakdown.experienceScore} / 10</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">7. National / State Awards:</span>
                <span className="font-mono font-bold text-amber-700">{currentApiBreakdown.awardsScore} / 3</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
              <strong className="block font-bold">University Shortlisting Benchmark:</strong>
              <span>
                Institutions usually invite candidates having an API Table 3A score of <strong>70+</strong> for the Selection Committee colloquium.
              </span>
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition"
            >
              Commit Changes &amp; Recalculate
            </button>

          </div>

        </div>

      </div>

      {/* Resume Parser Modal */}
      <ResumeParserModal
        isOpen={showCvModal}
        onClose={() => setShowCvModal(false)}
        onProfileUpdated={() => {
          setProfile(StorageService.getCandidateProfile());
        }}
      />

    </div>
  );
}
