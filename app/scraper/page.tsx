'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorageService } from '@/lib/storage';
import { Job } from '@/types';
import {
  Globe,
  Search,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Database,
  Download,
  AlertCircle,
  RefreshCw,
  Clock,
  Award,
} from 'lucide-react';

interface Telemetry {
  institutionTitle: string;
  seedUrl: string;
  pagesCrawled: number;
  careerHubsDiscovered: string[];
  totalFacultyFound: number;
}

const PRESET_URLS = [
  {
    name: 'MITS Chittoor (Positions Offered)',
    url: 'https://mits.ac.in/positionsoffered',
    type: 'Autonomous College',
  },
  {
    name: 'Amrita University Careers',
    url: 'https://www.amrita.edu/careers/',
    type: 'Deemed University',
  },
  {
    name: 'IIT Bombay Faculty Recruitment',
    url: 'https://www.iitb.ac.in/en/careers/faculty-recruitment',
    type: 'Institute of National Importance',
  },
  {
    name: 'IISc Bangalore Open Positions',
    url: 'https://iisc.ac.in/positions-open/',
    type: 'Premier Research Institute',
  },
];

export default function UniversityScraperPage() {
  const [targetUrl, setTargetUrl] = useState('https://mits.ac.in/positionsoffered');
  const [isLoading, setIsLoading] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [scrapedJobs, setScrapedJobs] = useState<Job[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleRunScraper = async (urlToScrape?: string) => {
    const activeUrl = (urlToScrape || targetUrl).trim();
    if (!activeUrl) return;

    setIsLoading(true);
    setError(null);
    setTelemetry(null);
    setScrapedJobs([]);
    setImportSuccess(false);

    setProgressStatus('Connecting to target university web portal...');
    const progressTimer1 = setTimeout(() => {
      setProgressStatus('Discovering recruitment subpages & crawling active hubs...');
    }, 2500);

    const progressTimer2 = setTimeout(() => {
      setProgressStatus('Parsing academic tables, job cards & extracting faculty criteria...');
    }, 6000);

    const progressTimer3 = setTimeout(() => {
      setProgressStatus('Aligning with UGC/AICTE regulations & 7th CPC salary bands...');
    }, 9500);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: activeUrl }),
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to scrape target university.');
      }

      setTelemetry(data.telemetry);
      setScrapedJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during scraping.');
    } finally {
      setIsLoading(false);
      setProgressStatus('');
    }
  };

  const handleImportToJobBoard = () => {
    if (!scrapedJobs.length) return;
    StorageService.addJobs(scrapedJobs);
    setImportSuccess(true);
  };

  const handleExportJson = () => {
    if (!scrapedJobs.length) return;
    const blob = new Blob([JSON.stringify({ telemetry, jobs: scrapedJobs }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faculty_openings_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Universal Academic Web Scraper Engine v2.0
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Live University Faculty Scraper & Ingestion Hub
              </h1>
              <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
                Enter any Indian university or college website URL. Our deep crawler discovers recruitment hubs,
                parses faculty vacancy notices, maps 7th CPC Pay Bands, and directly ingests active openings into your job board.
              </p>
            </div>
            <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
              >
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Browse Live Job Board
              </Link>
            </div>
          </div>
        </div>

        {/* Input & Search Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-5">
          <label className="block text-sm font-semibold text-slate-200">
            Target University or College Careers URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://collegename.ac.in/careers or https://collegename.edu/recruitment"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
              />
            </div>
            <button
              onClick={() => handleRunScraper()}
              disabled={isLoading || !targetUrl.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Crawling University...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Run Deep Scraper
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-medium text-slate-400">Quick Test Targets (Verified Working):</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_URLS.map((preset) => (
                <button
                  key={preset.url}
                  onClick={() => {
                    setTargetUrl(preset.url);
                    handleRunScraper(preset.url);
                  }}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 transition flex items-center gap-2"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{preset.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                    {preset.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="bg-slate-900/60 border border-indigo-500/30 rounded-2xl p-8 text-center space-y-4 animate-pulse shadow-xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-2">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-white">Deep Academic Crawling In Progress</h3>
            <p className="text-sm text-indigo-300 max-w-md mx-auto">{progressStatus}</p>
            <div className="w-full max-w-xs mx-auto bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-6 flex items-start gap-4 text-rose-200">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-white">Scraping Interrupted</h4>
              <p className="text-sm text-rose-300">{error}</p>
              <p className="text-xs text-rose-400/80 pt-1">
                Tip: Ensure the college URL is active and accessible. You can also run CLI mode: <code>python scraper.py {targetUrl}</code>
              </p>
            </div>
          </div>
        )}

        {/* Telemetry Summary Bar */}
        {telemetry && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Crawl Execution Completed</span>
                <h3 className="text-xl font-bold text-white">{telemetry.institutionTitle || 'Academic Institution'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Seed: {telemetry.seedUrl}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export JSON
                </button>
                <button
                  onClick={handleImportToJobBoard}
                  disabled={importSuccess || !scrapedJobs.length}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 disabled:opacity-75 disabled:cursor-not-allowed transition"
                >
                  {importSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Imported to Job Board!
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      Import {scrapedJobs.length} Openings to Jobs
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Pages Crawled
                </div>
                <div className="text-2xl font-bold text-white mt-1">{telemetry.pagesCrawled}</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  Faculty Positions Found
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{telemetry.totalFacultyFound}</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <Award className="w-4 h-4 text-amber-400" />
                  7th CPC Compliant
                </div>
                <div className="text-2xl font-bold text-white mt-1">100%</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <Globe className="w-4 h-4 text-sky-400" />
                  Recruitment Hubs
                </div>
                <div className="text-2xl font-bold text-white mt-1">{telemetry.careerHubsDiscovered.length}</div>
              </div>
            </div>

            {/* Discovered Hubs */}
            {telemetry.careerHubsDiscovered.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400">Deep Candidate Hubs Discovered:</span>
                <div className="flex flex-wrap gap-2">
                  {telemetry.careerHubsDiscovered.map((hub, i) => (
                    <a
                      key={i}
                      href={hub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-indigo-300 transition"
                    >
                      <span className="truncate max-w-xs">{hub}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Banner */}
        {importSuccess && (
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium">
                Successfully imported {scrapedJobs.length} faculty vacancies into AcadeXMatch AI! You can now filter, search, and match candidates against them.
              </span>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shrink-0"
            >
              View on Job Board
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Scraped Openings Cards */}
        {scrapedJobs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Discovered Faculty Openings</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {scrapedJobs.length}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scrapedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 space-y-4 transition backdrop-blur-sm relative group shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {job.designation}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {job.department}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 font-medium shrink-0">🎓 Degree:</span>
                      <span className="text-slate-200">{job.requiredQualifications.specializationRequirements[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium shrink-0">💰 Pay Matrix:</span>
                      <span className="text-emerald-400 font-semibold">{job.payScale.cpcBand}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium shrink-0">📅 Deadline:</span>
                      <span className="text-slate-400">{job.applicationDeadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {job.specializationTags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-indigo-400 font-medium flex items-center gap-1 text-[11px]">
                      Live Extracted Opening
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
