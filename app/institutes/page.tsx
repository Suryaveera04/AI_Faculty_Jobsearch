'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StorageService } from '@/lib/storage';
import { Institute, Job } from '@/types';
import { 
  Building2, 
  MapPin, 
  Search, 
  ArrowRight,
} from 'lucide-react';

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    setInstitutes(StorageService.getInstitutes());
    setJobs(StorageService.getJobs());

    const handleUpdate = () => {
      setInstitutes(StorageService.getInstitutes());
      setJobs(StorageService.getJobs());
    };
    window.addEventListener('acad-storage-updated', handleUpdate);
    return () => window.removeEventListener('acad-storage-updated', handleUpdate);
  }, []);

  const filteredInstitutes = institutes.filter((inst) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = inst.name.toLowerCase().includes(q) || inst.shortName.toLowerCase().includes(q);
      const matchCity = inst.location.city.toLowerCase().includes(q) || inst.location.state.toLowerCase().includes(q);
      if (!matchName && !matchCity) return false;
    }
    if (selectedType !== 'all' && !inst.type.includes(selectedType)) return false;
    return true;
  });

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      
      {/* Header Bar - Full Width */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> AISHE Verified Directory
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            Universities, IITs &amp; Research Institutes
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Explore NAAC A++ accredited universities, Institutes of Eminence, and central technical institutions across India.
          </p>
        </div>

        {/* Quick Search */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 shadow-sm max-w-sm w-full">
          <Search className="w-4 h-4 text-brand-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, state, or city..."
            className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-medium"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            selectedType === 'all'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          All Institutions ({institutes.length})
        </button>

        <button
          onClick={() => setSelectedType('IIT')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            selectedType === 'IIT'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Institutes of National Importance (IIT / NIT / IISc)
        </button>

        <button
          onClick={() => setSelectedType('Central')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            selectedType === 'Central'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Central Universities
        </button>

        <button
          onClick={() => setSelectedType('Private')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            selectedType === 'Private'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Premier Private Universities
        </button>
      </div>

      {/* Institutes Cards Grid - Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredInstitutes.map((inst) => {
          const instJobs = jobs.filter(j => j.instituteId === inst.id);

          return (
            <div
              key={inst.id}
              className="rounded-3xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition p-6 space-y-4 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-1 shrink-0 overflow-hidden shadow-sm">
                    <Image
                      src={inst.logo}
                      alt={inst.name}
                      width={56}
                      height={56}
                      unoptimized
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      NAAC {inst.accreditation.naacGrade}
                    </span>
                    {inst.accreditation.nirfRankOverall && (
                      <span className="text-[10px] font-bold text-brand-700">
                        NIRF #{inst.accreditation.nirfRankOverall}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base line-clamp-1">
                    {inst.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{inst.location.city}, {inst.location.state}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                  {inst.about}
                </p>

                {/* Accreditations and Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-100">
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">Faculty Cadre</span>
                    <strong className="text-slate-900 font-mono">{inst.stats.facultyCount} Sanctioned</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-100">
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">Live Openings</span>
                    <strong className="text-brand-900 font-mono font-bold">{instJobs.length} Vacancies</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono font-medium">
                  AISHE: {inst.aisheCode}
                </span>

                <Link
                  href={`/institutes/${inst.id}`}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-900 hover:text-white text-slate-800 font-bold transition text-xs border border-slate-200 shadow-sm"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
