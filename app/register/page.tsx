'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/lib/storage';
import { UserRole } from '@/types';
import { 
  GraduationCap, 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  FileCheck
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [aisheCode, setAisheCode] = useState('');
  const [highestDegree, setHighestDegree] = useState('Ph.D.');
  const [ugcNetChecked, setUgcNetChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and official academic email.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      const newUser = StorageService.registerUser(name, email, role, role === 'institute_admin' ? 'inst-iitb' : undefined);
      setIsSubmitting(false);
      if (role === 'institute_admin') router.push('/institute/dashboard');
      else router.push('/candidate/dashboard');
    }, 600);
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 sm:px-8 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-900 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-brand-900 flex items-center justify-center shadow-sm">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif font-black text-2xl text-slate-900">
                ACADEX<span className="text-amber-600">MATCH</span><span className="text-brand-600 text-sm font-mono">.AI</span>
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Create Your Academic Account
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Join India&apos;s intelligent academic recruitment ecosystem. Build your verified UGC-2018 dossier or list accredited institutional vacancies.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-3xl bg-white border border-slate-200 shadow-sm text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" /> Statutory Advantages:
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant UGC Table 3A API score calculation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Automated UGC-CARE &amp; Scopus journal verification</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>8-Stage selection committee applicant tracking</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column (7 cols): Registration Form */}
        <div className="lg:col-span-7">
          <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
            
            {/* Role Select */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  role === 'candidate'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span>Faculty / Scholar</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('institute_admin')}
                className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  role === 'institute_admin'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-brand-600" />
                <span>University / Institute</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-crimson-50 border border-crimson-200 text-crimson-800 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {role === 'candidate' ? 'Full Legal Name (with Title):' : 'Registrar / Search Committee Representative Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'candidate' ? 'e.g. Dr. Aarav Sundaram' : 'e.g. Prof. Ramesh Narang'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {role === 'candidate' ? 'Academic Email Address:' : 'Official University Email Domain:'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'candidate' ? 'scholar@university.edu' : 'dean.faculty@iitb.ac.in'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              {role === 'institute_admin' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">University / Institute Name:</label>
                    <input
                      type="text"
                      required
                      value={instituteName}
                      onChange={(e) => setInstituteName(e.target.value)}
                      placeholder="e.g. IIT Bombay"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">AISHE Registry Code:</label>
                    <input
                      type="text"
                      required
                      value={aisheCode}
                      onChange={(e) => setAisheCode(e.target.value)}
                      placeholder="e.g. U-0306"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono"
                    />
                  </div>
                </div>
              )}

              {role === 'candidate' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Highest Degree Awarded:</label>
                    <select
                      value={highestDegree}
                      onChange={(e) => setHighestDegree(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
                    >
                      <option value="Ph.D.">Ph.D. (Doctor of Philosophy)</option>
                      <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                      <option value="M.Sc / M.S.">M.Sc / M.S.</option>
                      <option value="Postdoctoral Fellow">Postdoctoral Fellow</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 select-none">
                      <input
                        type="checkbox"
                        checked={ugcNetChecked}
                        onChange={(e) => setUgcNetChecked(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-600 accent-brand-600"
                      />
                      <span>UGC / CSIR NET Qualified</span>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Create Password:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Creating Academic Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center pt-2 font-medium">
                Already registered?{' '}
                <Link href="/login" className="text-brand-700 hover:text-brand-900 font-bold underline">
                  Sign In Here
                </Link>
              </p>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
