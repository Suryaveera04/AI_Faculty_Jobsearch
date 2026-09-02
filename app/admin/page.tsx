'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/lib/storage';
import { Institute, DPDPDataRequest, AuditLog, Job } from '@/types';
import { 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Lock, 
  Activity, 
  AlertTriangle,
} from 'lucide-react';

export default function AdminCompliancePage() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [dpdpRequests, setDpdpRequests] = useState<DPDPDataRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'verification' | 'dpdp' | 'audit'>('verification');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    setInstitutes(StorageService.getInstitutes());
    setDpdpRequests(StorageService.getDPDPRequests());
    setAuditLogs(StorageService.getAuditLogs());

    const handleUpdate = () => {
      setInstitutes(StorageService.getInstitutes());
      setDpdpRequests(StorageService.getDPDPRequests());
      setAuditLogs(StorageService.getAuditLogs());
    };
    window.addEventListener('acad-storage-updated', handleUpdate);
    return () => window.removeEventListener('acad-storage-updated', handleUpdate);
  }, []);

  const handleVerifyInstitute = (instId: string, status: 'verified' | 'rejected') => {
    StorageService.updateInstituteVerification(instId, status);
    setActionSuccess(`Institute ${instId} marked as ${status.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleCompleteDpdp = (reqId: string) => {
    StorageService.updateDPDPStatus(reqId, 'Completed', 'Data purged/exported per DPDP Act Section 12 protocols.');
    setActionSuccess(`DPDP Request ${reqId} completed.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      
      {/* Header - Full Width */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-700" /> Super Admin &amp; Data Protection Officer (DPO) Desk
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            UGC Verification &amp; DPDP Act (2023) Compliance
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
            Statutory governance for AISHE university accreditations, Right to Erasure workflows, and immutable audit trails.
          </p>
        </div>

        {actionSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2 animate-in fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'verification'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>AISHE &amp; NAAC Verification Queue ({institutes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dpdp')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'dpdp'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>DPDP Act Data Rights Desk ({dpdpRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Immutable Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: AISHE & NAAC Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold">Statutory Rule: </strong>
              Only institutions with verified AISHE codes and NAAC / AICTE documentation are permitted to issue formal 7th CPC appointment orders and access candidate PII dossiers.
            </div>
          </div>

          <div className="space-y-3">
            {institutes.map((inst) => (
              <div
                key={inst.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif font-bold text-slate-900 text-base truncate">
                      {inst.name}
                    </h3>
                    <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      AISHE: {inst.aisheCode}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      NAAC {inst.accreditation.naacGrade}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs font-medium">
                    {inst.type} • {inst.location.city}, {inst.location.state}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 font-medium">
                    <span>Contact: {inst.contactEmail}</span>
                    <span>•</span>
                    <span>UGC 2(f)/12(B): <strong className="text-slate-700">{inst.accreditation.ugc2f12bStatus ? 'Approved' : 'Pending'}</strong></span>
                    <span>•</span>
                    <span>AICTE: <strong className="text-slate-700">{inst.accreditation.aicteApproved ? 'Approved' : 'Exempt / University'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                    inst.verificationStatus === 'verified'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-900 border-amber-300'
                  }`}>
                    {inst.verificationStatus}
                  </span>

                  {inst.verificationStatus !== 'verified' ? (
                    <button
                      onClick={() => handleVerifyInstitute(inst.id, 'verified')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve &amp; Verify
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyInstitute(inst.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-crimson-50 text-slate-600 hover:text-crimson-600 border border-slate-200 transition text-[11px] font-bold"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DPDP Act Data Rights Desk */}
      {activeTab === 'dpdp' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-xs text-brand-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-brand-950 font-bold">DPDP Act (2023) Section 12 Mandate: </strong>
              Data Principal rights (Erasure, Portability, and Processing Revocation) must be actioned and certified by the Data Protection Officer within statutory timelines.
            </div>
          </div>

          <div className="space-y-3">
            {dpdpRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{req.userName}</span>
                      <span className="text-slate-500 font-mono">({req.userEmail})</span>
                    </div>
                    <div className="text-brand-900 font-bold mt-0.5">
                      Request: {req.requestType}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border self-start ${
                    req.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-900 border-amber-300'
                  }`}>
                    {req.status}
                  </span>
                </div>

                {req.reason && (
                  <p className="text-slate-600 text-xs italic bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    &quot;{req.reason}&quot;
                  </p>
                )}

                {req.dpoActionNotes && (
                  <div className="p-3 rounded-2xl bg-emerald-50 text-[11px] text-emerald-900 border border-emerald-200">
                    <strong className="text-emerald-950">DPO Action: </strong>{req.dpoActionNotes}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  <span>Requested on: {req.requestedAt}</span>

                  {req.status !== 'Completed' && (
                    <button
                      onClick={() => handleCompleteDpdp(req.id)}
                      className="px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold transition flex items-center gap-1 text-xs shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Execute &amp; Certify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Immutable Security & Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between font-medium">
            <span>Immutable security trail of administrative, scoring, and PII interactions.</span>
            <span className="font-mono text-brand-900 font-bold">{auditLogs.length} Events Logged</span>
          </div>

          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px]"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-900 font-bold">{log.action}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-700 font-sans">{log.target}</span>
                  </div>
                  <div className="text-slate-500 text-[10px] font-sans font-medium">
                    Actor: <strong className="text-slate-900">{log.actor}</strong> ({log.actorRole}) • IP: {log.ipAddress}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[10px] self-end sm:self-center">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                    {log.complianceCategory}
                  </span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
