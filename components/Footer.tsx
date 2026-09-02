'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorageService } from '@/lib/storage';
import { Shield, Lock, FileCheck, CheckCircle2, RefreshCw, Send, AlertTriangle } from 'lucide-react';

export default function Footer() {
  const [showDpdpModal, setShowDpdpModal] = useState(false);
  const [requestType, setRequestType] = useState<'Right to Erasure (Delete all Academic CV & Personal Data)' | 'Data Portability Export (JSON/PDF)' | 'Revoke AI Matching Processing Consent'>('Right to Erasure (Delete all Academic CV & Personal Data)');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitDpdp = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.createDPDPRequest(requestType, reason || 'Requested via Footer DPDP Rights portal');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowDpdpModal(false);
      setReason('');
    }, 2500);
  };

  const handleResetData = () => {
    if (confirm('Reset application state and restore official sample academic vacancies and seed data?')) {
      StorageService.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <>
      <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-20 w-full">
        {/* Compliance Highlights Bar */}
        <div className="border-b border-slate-200 bg-slate-50 py-8 px-4 sm:px-8 lg:px-12 w-full">
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="p-2 rounded-xl bg-gold-50 text-gold-700 border border-gold-200 shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">UGC &amp; AICTE Gazette Norms</h4>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                  Automated validation against 2018/2023 Minimum Standards for Assistant Professor, Associate Professor &amp; Chair recruitment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">7th CPC &amp; Reservation Roster</h4>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                  Pre-configured Level 10-15 pay bands with statutory reservation categories (UR, OBC-NCL, SC, ST, EWS, PwD).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">DPDP Act (2023) Compliant</h4>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                  Purpose-limited consent, granular AI matching permissions, 90-day Right to Erasure, and immutable audit logging.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Explainable Academic Match</h4>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                  Transparent criteria-weighted score; zero black-box automated video/emotion inferences or biased filtering.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links - Full Width */}
        <div className="w-full px-4 sm:px-8 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-xl text-brand-950">
                ACADEX<span className="text-gold-600">MATCH</span><span className="text-brand-600 font-mono text-sm">.AI</span>
              </span>
              <span className="bg-brand-50 text-brand-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-brand-200">
                v1.0 (2026 Edition)
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-lg font-normal">
              India&apos;s full-stack academic recruitment operating system for Universities, IITs, NITs, Central &amp; State Colleges, Researchers, and Selection Committees. Replaces unstructured notice boards with verified candidate dossiers, UGC-CARE validation, and multi-reviewer committee workflows.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowDpdpModal(true)}
                className="text-xs font-bold text-brand-700 hover:text-brand-900 underline underline-offset-2 flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-emerald-600" /> Exercise DPDP Data Rights (Right to Erasure / Portability)
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-3.5">For Faculty &amp; Candidates</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/jobs" className="hover:text-brand-700 transition">Search Faculty Vacancies</Link></li>
              <li><Link href="/candidate/resume-parser" className="hover:text-brand-700 transition">AI Academic CV Parser</Link></li>
              <li><Link href="/candidate/profile" className="hover:text-brand-700 transition">UGC API Score Calculator</Link></li>
              <li><Link href="/candidate/applications" className="hover:text-brand-700 transition">Application Tracker (8 Stages)</Link></li>
              <li><Link href="/institutes" className="hover:text-brand-700 transition">NIRF &amp; NAAC A++ Directory</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-3.5">For Universities &amp; Colleges</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/institute/dashboard" className="hover:text-brand-700 transition">Institute Dashboard</Link></li>
              <li><Link href="/institute/post-job" className="hover:text-brand-700 transition">Post 7th CPC Compliant Job</Link></li>
              <li><Link href="/institute/ats" className="hover:text-brand-700 transition">Multi-Stage ATS Kanban</Link></li>
              <li><span className="text-slate-400">UGC-CARE Journal Validation</span></li>
              <li><span className="text-slate-400">Selection Board Scoring Sheet</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-3.5">Governance &amp; Tools</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/admin" className="hover:text-brand-700 transition">UGC/AISHE Verification Desk</Link></li>
              <li><button onClick={() => setShowDpdpModal(true)} className="hover:text-brand-700 text-left transition">DPDP Data Principal Desk</button></li>
              <li><button onClick={handleResetData} className="hover:text-crimson-600 text-left transition flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Reset Demo Seed Data</button></li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-slate-200 py-4 px-4 sm:px-8 lg:px-12 text-slate-500 text-xs w-full bg-slate-50">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              &copy; 2026 ACADEXMATCH.AI. Designed for Indian Higher Education Institutions.
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span>National Academic Depository (NAD) Compatible</span>
              <span>•</span>
              <span>All India Survey on Higher Education (AISHE)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* DPDP Act Data Principal Rights Modal */}
      {showDpdpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-800 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-brand-900">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-slate-900 text-base">DPDP Act (2023) Data Subject Desk</h3>
              </div>
              <button
                onClick={() => setShowDpdpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Request Submitted Successfully</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your request has been logged in the Data Protection Officer queue. Under Section 12 of the DPDP Act (2023), action will be recorded within the statutory window.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDpdp} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Statutory Right to Exercise:</label>
                  <select
                    value={requestType}
                    onChange={(e: any) => setRequestType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="Right to Erasure (Delete all Academic CV & Personal Data)">
                      Right to Erasure (Section 12 - Right to be Forgotten)
                    </option>
                    <option value="Data Portability Export (JSON/PDF)">
                      Data Portability Export (Download complete dossier)
                    </option>
                    <option value="Revoke AI Matching Processing Consent">
                      Revoke Automated AI Matching / Profile Processing Consent
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason or Reference Notes (Optional):</label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide any specific instructions regarding your academic records or institutional applications..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    ACADEXMATCH.AI acts as a certified Data Fiduciary. Application records submitted to formal selection committees are archived per university statutory retention rules.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDpdpModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
