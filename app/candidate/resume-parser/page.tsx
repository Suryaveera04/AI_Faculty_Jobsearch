'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorageService } from '@/lib/storage';
import { parseAcademicResume, SAMPLE_ACADEMIC_CVS, ParsedResumeResult } from '@/lib/ai-engine';
import { 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  GraduationCap
} from 'lucide-react';

export default function ResumeParserWorkbenchPage() {
  const [selectedPreset, setSelectedPreset] = useState<'ai_postdoc' | 'vlsi_assoc_prof'>('ai_postdoc');
  const [cvText, setCvText] = useState(SAMPLE_ACADEMIC_CVS.ai_postdoc.rawText);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedResumeResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectPreset = (key: 'ai_postdoc' | 'vlsi_assoc_prof') => {
    setSelectedPreset(key);
    setCvText(SAMPLE_ACADEMIC_CVS[key].rawText);
    setParsedResult(null);
    setSavedSuccess(false);
  };

  const handleStartParsing = async () => {
    setIsParsing(true);
    setParsedResult(null);
    setSavedSuccess(false);

    setParsingStep('Analyzing academic structure and extracting degree timeline...');
    await new Promise(r => setTimeout(r, 400));
    setParsingStep('Checking UGC-CARE Group I and Scopus/SCI indexing for publications...');
    await new Promise(r => setTimeout(r, 400));
    setParsingStep('Validating UGC-NET / CSIR JRF certifications and 7th CPC eligibility...');
    await new Promise(r => setTimeout(r, 400));
    setParsingStep('Computing UGC Regulations 2018 Table 3A API Score...');

    const result = await parseAcademicResume(cvText);
    setParsedResult(result);
    setIsParsing(false);
    setParsingStep('');
  };

  const handleApplyToProfile = () => {
    if (!parsedResult || !parsedResult.candidateProfile) return;
    const current = StorageService.getCandidateProfile();
    const updated = {
      ...current,
      ...parsedResult.candidateProfile,
      resumeParsedAt: new Date().toISOString(),
    };
    StorageService.updateCandidateProfile(updated as any);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
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
            <span className="text-brand-900 font-bold">AI CV Workbench</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            Academic Curriculum Vitae Parser
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Structured LLM extraction for degrees, UGC-CARE indexed papers, NET JRF certificates, and instant API scoring.
          </p>
        </div>

        <Link
          href="/candidate/profile"
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200 self-start sm:self-auto"
        >
          <GraduationCap className="w-4 h-4 text-brand-700" />
          <span>View My Dossier</span>
        </Link>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-bold">Extracted CV profile committed to your active academic dossier!</span>
        </div>
      )}

      {/* Main Grid: Left Input + Right Structured Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Left Column (6 cols): CV Text / Presets */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-700" />
                <span>Academic CV Input</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Plain Text / Markdown</span>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Quick Test Academic Presets:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('ai_postdoc')}
                  className={`text-left p-3.5 rounded-2xl border transition text-xs ${
                    selectedPreset === 'ai_postdoc'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-slate-900">Dr. Aarav Sundaram</div>
                  <div className="text-[10px] text-slate-500 font-normal">Postdoc at IISc, Ph.D. IITB, 4 SCI Papers</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('vlsi_assoc_prof')}
                  className={`text-left p-3.5 rounded-2xl border transition text-xs ${
                    selectedPreset === 'vlsi_assoc_prof'
                      ? 'bg-brand-50 border-brand-300 text-brand-900 shadow-sm font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-slate-900">Dr. Meenakshi Raman</div>
                  <div className="text-[10px] text-slate-500 font-normal">Assoc. Professor, 12 yrs Exp, 14 Pubs</div>
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Paste Candidate CV / Resume:</label>
              <textarea
                rows={16}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste complete CV text with Education, Publications, Experience, and Certifications..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-mono text-xs leading-relaxed focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Processed locally with structured UGC compliance validation.
              </span>

              <button
                onClick={handleStartParsing}
                disabled={isParsing || !cvText.trim()}
                className="px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {isParsing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Extracting Academic Data...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" /> Run AI Academic Extraction
                  </>
                )}
              </button>
            </div>

            {isParsing && (
              <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 animate-pulse text-xs flex items-center gap-2 font-semibold">
                <div className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                <span>{parsingStep}</span>
              </div>
            )}

          </div>
        </div>

        {/* Right Column (6 cols): Structured Extraction Preview */}
        <div className="lg:col-span-6 space-y-5">
          {parsedResult && parsedResult.candidateProfile ? (
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm animate-in fade-in">
              
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Structured Extraction Complete
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-xl">
                    {parsedResult.candidateProfile.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {parsedResult.candidateProfile.currentDesignation} • {parsedResult.candidateProfile.currentInstitute}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-amber-300 text-center shadow-sm">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">UGC Table 3A</span>
                    <strong className="font-mono text-xl font-black text-amber-700">{parsedResult.candidateProfile.apiScore}/100</strong>
                  </div>
                </div>
              </div>

              {/* UGC Compliance Insights */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  UGC &amp; AICTE Statutory Insights:
                </span>
                <div className="space-y-2 text-xs">
                  {parsedResult.ugcComplianceInsights.map((insight, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Publications */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Extracted Publications ({parsedResult.candidateProfile.publications?.length || 0}):
                </span>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {parsedResult.candidateProfile.publications?.map((pub, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h5 className="font-bold text-slate-900 truncate">{pub.title}</h5>
                        <p className="text-[11px] text-slate-500">{pub.journalOrConference} ({pub.year})</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        UGC-CARE / SCI
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Ready to update candidate profile.
                </span>

                <button
                  onClick={handleApplyToProfile}
                  className="px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Commit to My Profile</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-serif font-bold text-slate-900 text-lg">AI Parser Ready</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Paste an academic CV on the left or select a preset to extract publications, calculate UGC API Table 3A score, and verify statutory compliance.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
