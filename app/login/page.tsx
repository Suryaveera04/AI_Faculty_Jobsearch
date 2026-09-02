'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/lib/storage';
import { UserRole } from '@/types';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<UserRole>('candidate');
  const [email, setEmail] = useState('aarav.sundaram@iitb-alumni.org');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleTabChange = (role: UserRole) => {
    setSelectedTab(role);
    setLoginError(null);
    if (role === 'candidate') {
      setEmail('aarav.sundaram@iitb-alumni.org');
    } else if (role === 'institute_admin') {
      setEmail('dean.faculty@iitb.ac.in');
    } else if (role === 'super_admin') {
      setEmail('dpo.ugc@gov.in');
    }
  };

  const handleDemoLogin = (userId: string, targetPath: string) => {
    setIsSubmitting(true);
    const user = StorageService.loginAsDemoUser(userId);
    setTimeout(() => {
      setIsSubmitting(false);
      if (user) {
        router.push(targetPath);
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setLoginError('Please enter your academic email address.');
      return;
    }
    setIsSubmitting(true);
    setLoginError(null);

    setTimeout(() => {
      const res = StorageService.login(email, password);
      setIsSubmitting(false);
      if (res.success && res.user) {
        if (res.user.role === 'institute_admin') router.push('/institute/dashboard');
        else if (res.user.role === 'super_admin') router.push('/admin');
        else router.push('/candidate/dashboard');
      } else {
        setLoginError(res.error || 'Authentication failed. Please check credentials.');
      }
    }, 500);
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 sm:px-8 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Academic Brand & Value Banner (5 cols) */}
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
              Single Sign-On for Indian Higher Education
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Sign in to manage faculty applications, calculate UGC API Table 3A scores, publish 7th CPC vacancies, or access selection committee scoring sheets.
            </p>
          </div>

          {/* Quick Demo 1-Click Access Cards */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              1-Click Academic Demo Profiles:
            </span>

            {/* Candidate Demo */}
            <button
              onClick={() => handleDemoLogin('user-cand-1', '/candidate/dashboard')}
              className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition text-left flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-brand-700 transition">
                    Dr. Aarav Sundaram (Candidate)
                  </h4>
                  <p className="text-[10px] text-slate-500">Ph.D. IITB • Postdoc IISc • 4 SCI Pubs</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-brand-700 flex items-center gap-0.5">
                Log In &rarr;
              </span>
            </button>

            {/* Institute Admin Demo */}
            <button
              onClick={() => handleDemoLogin('user-inst-1', '/institute/dashboard')}
              className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition text-left flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-800 border border-brand-200 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-brand-700 transition">
                    Prof. Ramesh Narang (IIT Bombay)
                  </h4>
                  <p className="text-[10px] text-slate-500">Dean of Faculty Affairs • 8-Stage ATS</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-brand-700 flex items-center gap-0.5">
                Log In &rarr;
              </span>
            </button>

            {/* Super Admin Demo */}
            <button
              onClick={() => handleDemoLogin('user-admin-1', '/admin')}
              className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition text-left flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-purple-700 transition">
                    Dr. Rajeshwar Singh (UGC / DPO)
                  </h4>
                  <p className="text-[10px] text-slate-500">AISHE Verification • DPDP Act Desk</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-purple-700 flex items-center gap-0.5">
                Log In &rarr;
              </span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted per Digital Personal Data Protection (DPDP) Act 2023.</span>
          </div>
        </div>

        {/* Right Column: Interactive Login Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
            
            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => handleTabChange('candidate')}
                className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedTab === 'candidate'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span className="truncate">Candidate</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('institute_admin')}
                className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedTab === 'institute_admin'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-brand-600" />
                <span className="truncate">Institute / Dean</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('super_admin')}
                className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedTab === 'super_admin'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span className="truncate">Super Admin</span>
              </button>
            </div>

            <div>
              <h2 className="font-serif font-bold text-slate-900 text-xl">
                {selectedTab === 'candidate' && 'Faculty & Researcher Sign In'}
                {selectedTab === 'institute_admin' && 'University Registrar & Search Board Sign In'}
                {selectedTab === 'super_admin' && 'UGC / Statutory Regulatory Desk Sign In'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedTab === 'candidate' && 'Enter your verified email or ORCID iD to continue.'}
                {selectedTab === 'institute_admin' && 'Enter your official university email domain (@iitb.ac.in, @du.ac.in).'}
                {selectedTab === 'super_admin' && 'Enter your statutory administrator credentials.'}
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-crimson-50 border border-crimson-200 text-crimson-800 text-xs font-semibold">
                {loginError}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Academic / Official Email Address:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. professor@university.ac.in"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Password / SSO Pin:</label>
                  <a href="#" className="text-[11px] text-brand-700 hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded text-brand-600 accent-brand-600" />
                  <span>Remember this workstation</span>
                </label>
                <span className="text-slate-400 font-mono">256-Bit SSL</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to ACADEXMATCH</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Alternative SSO Sign Ins */}
            <div className="pt-4 border-t border-slate-100 space-y-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Or Connect via National Academic Depository
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('user-cand-1', '/candidate/dashboard')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span>ORCID iD Connect</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('user-inst-1', '/institute/dashboard')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>SAMARTH e-Gov SSO</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 pt-2 font-medium">
                Don&apos;t have an account yet?{' '}
                <Link href="/register" className="text-brand-700 hover:text-brand-900 font-bold underline">
                  Register as Scholar or University
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
