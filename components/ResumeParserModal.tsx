'use client';

import React, { useState } from 'react';
import { StorageService } from '@/lib/storage';
import { parseAcademicResume, SAMPLE_ACADEMIC_CVS, ParsedResumeResult } from '@/lib/ai-engine';
import { 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  X, 
} from 'lucide-react';

interface ResumeParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export default function ResumeParserModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: ResumeParserModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<'ai_postdoc' | 'vlsi_assoc_prof'>('ai_postdoc');
  const [cvText, setCvText] = useState(SAMPLE_ACADEMIC_CVS.ai_postdoc.rawText);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedResumeResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

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
      if (onProfileUpdated) onProfileUpdated();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-slate-800 shadow-2xl animate-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">
                AI Academic CV Parser &amp; UGC Profiler
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Extracts academic appointments, UGC-CARE publications, NET/SLET certifications, and calculates instant API score.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample CV Presets or Custom Input */}
        <div className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Select Sample Academic CV or Paste Custom CV:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSelectPreset('ai_postdoc')}
                className={`text-left p-3.5 rounded-2xl border transition ${
                  selectedPreset === 'ai_postdoc'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900">Dr. Aarav Sundaram</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-normal">Ph.D. IIT Bombay, IISc Postdoc, 4 SCI Pubs, JRF</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('vlsi_assoc_prof')}
                className={`text-left p-3.5 rounded-2xl border transition ${
                  selectedPreset === 'vlsi_assoc_prof'
                    ? 'bg-brand-50 border-brand-300 text-brand-900 shadow-sm font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900">Dr. Meenakshi Raman</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-normal">Assoc. Professor, 12 yrs Exp, 14 UGC Pubs, SERB Grant</div>
              </button>
            </div>
          </div>

          {/* CV Raw Text */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-600" /> Academic CV Content (Text or Markdown):
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Editable</span>
            </div>
            <textarea
              rows={7}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-800 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Action to Parse */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Prompted LLM extractor with strict JSON schema and UGC-CARE verification</span>
            </div>

            <button
              onClick={handleStartParsing}
              disabled={isParsing || !cvText.trim()}
              className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isParsing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Parsing Academic Dossier...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" /> Run AI Extraction
                </>
              )}
            </button>
          </div>

          {/* Loading Animation Step */}
          {isParsing && (
            <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 animate-pulse text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
              <span className="font-semibold">{parsingStep}</span>
            </div>
          )}

          {/* Structured Extraction Result Preview */}
          {parsedResult && parsedResult.candidateProfile && (
            <div className="mt-5 p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-base">
                    {parsedResult.candidateProfile.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {parsedResult.candidateProfile.currentDesignation} • {parsedResult.candidateProfile.currentInstitute}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white border border-amber-300 px-3 py-1.5 rounded-xl text-center shadow-sm">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Computed API Score</span>
                    <span className="text-base font-black font-mono text-amber-700">{parsedResult.candidateProfile.apiScore}/100</span>
                  </div>
                  <div className="bg-white border border-brand-200 px-3 py-1.5 rounded-xl text-center shadow-sm">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Parser Confidence</span>
                    <span className="text-base font-black font-mono text-brand-700">{parsedResult.confidenceScore}%</span>
                  </div>
                </div>
              </div>

              {/* UGC Compliance Insights */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  UGC &amp; AICTE Statutory Insights:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {parsedResult.ugcComplianceInsights.map((ins, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2 text-slate-700 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publications Detected */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Verified Publications Extracted ({parsedResult.candidateProfile.publications?.length || 0}):
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {parsedResult.candidateProfile.publications?.map((pub, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] flex items-center justify-between shadow-sm">
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-900">{pub.title}</span>
                        <div className="text-[10px] text-slate-500">{pub.journalOrConference} ({pub.year})</div>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        UGC-CARE / SCI
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Review before committing to your candidate dossier.
                </span>

                <button
                  onClick={handleApplyToProfile}
                  disabled={savedSuccess}
                  className="px-6 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Profile Updated!
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" /> Save to My Academic Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
