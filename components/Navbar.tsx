'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { StorageService } from '@/lib/storage';
import { User, UserRole } from '@/types';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Search, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Layers, 
  Bell, 
  ChevronDown,
  CheckCircle2,
  LogIn,
  LogOut,
  UserPlus,
  Globe
} from 'lucide-react';

interface NavLinkItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  count?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('candidate');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    setRole(StorageService.getCurrentRole());

    const handleStorage = () => {
      setCurrentUser(StorageService.getCurrentUser());
      setRole(StorageService.getCurrentRole());
    };
    window.addEventListener('acad-storage-updated', handleStorage);
    return () => window.removeEventListener('acad-storage-updated', handleStorage);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    StorageService.setCurrentRole(newRole);
    setRole(newRole);
    setShowUserMenu(false);

    if (newRole === 'candidate') {
      StorageService.loginAsDemoUser('user-cand-1');
      router.push('/candidate/dashboard');
    } else if (newRole === 'institute_admin') {
      StorageService.loginAsDemoUser('user-inst-1');
      router.push('/institute/dashboard');
    } else if (newRole === 'super_admin') {
      StorageService.loginAsDemoUser('user-admin-1');
      router.push('/admin');
    }
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setShowUserMenu(false);
    router.push('/login');
  };

  const navLinks: Record<string, NavLinkItem[]> = {
    public: [
      { href: '/jobs', label: 'Explore Vacancies', icon: Search },
      { href: '/institutes', label: 'Universities & IITs', icon: Building2 },
      { href: '/candidate/resume-parser', label: 'AI CV Parser', icon: Sparkles, badge: 'AI' },
      { href: '/scraper', label: 'University Scraper', icon: Globe, badge: 'Live' },
      { href: '/candidate/dashboard', label: 'Candidate Portal', icon: GraduationCap },
      { href: '/institute/dashboard', label: 'Institute ATS', icon: Briefcase },
    ],
    candidate: [
      { href: '/candidate/dashboard', label: 'Dashboard', icon: Layers },
      { href: '/jobs', label: 'Find Faculty Jobs', icon: Search },
      { href: '/candidate/applications', label: 'My Applications', icon: FileText, count: '3' },
      { href: '/candidate/profile', label: 'Academic Profile & API', icon: GraduationCap },
      { href: '/candidate/resume-parser', label: 'AI CV Parser', icon: Sparkles, badge: 'New' },
      { href: '/scraper', label: 'Live Scraper', icon: Globe, badge: 'Live' },
    ],
    institute_admin: [
      { href: '/institute/dashboard', label: 'Overview', icon: Layers },
      { href: '/institute/ats', label: '8-Stage ATS Kanban', icon: Briefcase, count: '28' },
      { href: '/institute/post-job', label: 'Post 7th CPC Vacancy', icon: Sparkles, badge: 'UGC' },
      { href: '/scraper', label: 'University Scraper', icon: Globe, badge: 'Live' },
      { href: '/institutes', label: 'Institute Directory', icon: Building2 },
    ],
    super_admin: [
      { href: '/admin', label: 'Compliance & Verification', icon: ShieldCheck },
      { href: '/scraper', label: 'Universal Scraper', icon: Globe, badge: 'Live' },
      { href: '/jobs', label: 'Live Job Inventory', icon: Search },
      { href: '/institutes', label: 'AISHE Registry', icon: Building2 },
    ],
  };

  const currentLinks = mounted 
    ? (role === 'institute_admin' ? navLinks.institute_admin : role === 'super_admin' ? navLinks.super_admin : navLinks.candidate)
    : navLinks.public;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm w-full">
      {/* Top Regulatory Compliance Banner */}
      <div className="bg-slate-100 border-b border-slate-200/80 px-4 sm:px-8 lg:px-12 py-1 text-xs text-slate-600 flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5 w-full">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gold-100 text-gold-800 border border-gold-300">
            UGC &amp; AICTE 2018/2023 COMPLIANT
          </span>
          <span className="hidden sm:inline text-slate-600 font-medium">
            National Academic Recruitment Operating System • DPDP Act (2023) Certified
          </span>
          <div className="ml-auto flex items-center gap-3 text-[11px]">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 7th CPC Bands
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-slate-600 font-medium">NIRF &amp; NAAC A++ Empanelled</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Full Width */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-2">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-900 via-brand-700 to-brand-500 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-brand-900 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-lg sm:text-xl tracking-tight text-brand-950">
                  ACADEX<span className="text-gold-600">MATCH</span><span className="text-brand-600 text-xs font-mono ml-0.5">.AI</span>
                </span>
                <span className="bg-brand-100 text-brand-800 border border-brand-300 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block tracking-wide font-medium">
                Higher Education Recruitment Ecosystem
              </p>
            </div>
          </Link>

          {/* Navigation Links - Uncongested & Free */}
          <nav className="hidden lg:flex items-center gap-1.5 mx-6">
            {currentLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-900 font-semibold shadow-sm border border-brand-200'
                      : 'text-slate-600 hover:text-brand-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded border border-brand-300">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] font-bold bg-gold-100 text-gold-800 px-2 py-0.5 rounded-full border border-gold-300">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotification(!showNotification)}
                aria-label="Toggle notifications"
                className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-500" />
              </button>

              {showNotification && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-xs text-slate-700 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Academic Notifications</span>
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">3 New</span>
                  </div>
                  <div className="space-y-2.5 mt-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="font-semibold text-brand-900">IIT Bombay Colloquium Scheduled</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">Your interview for Asst. Prof Level 12 is set for Sep 12, 11:00 AM.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="font-semibold text-slate-900">API Score Verified</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">UGC 2018 Table 3A Score computed at 88/100 based on 4 Scopus pubs.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">1 day ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Authentication & User Session Pill */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-sm transition text-xs shadow-sm"
                >
                  <div className="w-7 h-7 rounded-xl bg-brand-900 text-white flex items-center justify-center font-bold text-xs font-serif shrink-0 shadow-sm">
                    {currentUser.name.split(' ')[1]?.[0] || currentUser.name[0]}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-bold text-slate-900 text-xs truncate max-w-[130px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium capitalize">
                      {role === 'candidate' && 'Faculty Candidate'}
                      {role === 'institute_admin' && 'Dean / Registrar'}
                      {role === 'super_admin' && 'UGC Administrator'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                      <div className="font-bold text-slate-900 text-xs">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-800 border border-brand-200">
                        {currentUser.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Academic Persona
                    </div>
                    <div className="p-1 space-y-1">
                      <button
                        onClick={() => handleRoleChange('candidate')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          role === 'candidate' ? 'bg-gold-50 text-gold-900 border border-gold-300 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 text-gold-600 shrink-0" />
                        <div>
                          <div className="font-bold">Dr. Aarav Sundaram</div>
                          <div className="text-[10px] text-slate-500">Postdoc Scholar Profile</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleRoleChange('institute_admin')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          role === 'institute_admin' ? 'bg-brand-50 text-brand-900 border border-brand-300 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-brand-600 shrink-0" />
                        <div>
                          <div className="font-bold">Prof. Ramesh Narang</div>
                          <div className="text-[10px] text-slate-500">Dean of Faculty Affairs (IITB)</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleRoleChange('super_admin')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          role === 'super_admin' ? 'bg-purple-50 text-purple-900 border border-purple-300 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <div className="font-bold">Dr. Rajeshwar Singh</div>
                          <div className="text-[10px] text-slate-500">UGC Compliance &amp; DPO</div>
                        </div>
                      </button>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-crimson-600 hover:bg-crimson-50 font-bold flex items-center gap-2 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200"
                >
                  <LogIn className="w-3.5 h-3.5 text-brand-700" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/register"
                  className="px-3.5 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Quick Action Button */}
            <Link
              href={role === 'institute_admin' ? '/institute/post-job' : '/jobs'}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition"
            >
              {role === 'institute_admin' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Post Vacancy
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 text-brand-200" /> Browse Jobs
                </>
              )}
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
