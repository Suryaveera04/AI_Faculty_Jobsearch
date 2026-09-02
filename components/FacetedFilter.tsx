'use client';

import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  MapPin, 
  GraduationCap, 
  Building2, 
  IndianRupee, 
  Users, 
  Search,
} from 'lucide-react';

export interface FilterState {
  search: string;
  state: string;
  designation: string;
  instituteType: string;
  reservationCategory: string;
  netSletOnly: boolean;
  phdOnly: boolean;
}

interface FacetedFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

const INDIAN_STATES = [
  'All States',
  'Maharashtra',
  'Karnataka',
  'Delhi',
  'Tamil Nadu',
  'Rajasthan',
  'Haryana',
  'West Bengal',
  'Telangana',
  'Uttar Pradesh',
  'Kerala',
  'Gujarat',
];

const DESIGNATIONS = [
  'All Designations',
  'Assistant Professor (Level 10 - 7th CPC)',
  'Assistant Professor (Level 11 - 7th CPC)',
  'Assistant Professor (Level 12 - 7th CPC)',
  'Associate Professor (Level 13A - 7th CPC)',
  'Professor (Level 14 - 7th CPC)',
  'Senior Professor (Level 15 - 7th CPC)',
  'Professor of Practice (Industry Track)',
];

const INSTITUTE_TYPES = [
  'All Institution Types',
  'IIT / NIT / IISc / IIIT (Institute of National Importance)',
  'Central University (Govt. of India)',
  'State Public University',
  'Premier Private University',
];

const RESERVATIONS = [
  'All Reservation Categories',
  'Open to All Categories',
  'Unreserved (UR / General)',
  'OBC - Non Creamy Layer',
  'Scheduled Caste (SC)',
  'Scheduled Tribe (ST)',
  'Economically Weaker Section (EWS)',
];

export default function FacetedFilter({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: FacetedFilterProps) {
  const handleChange = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = 
    (filters.search ? 1 : 0) +
    (filters.state !== 'All States' ? 1 : 0) +
    (filters.designation !== 'All Designations' ? 1 : 0) +
    (filters.instituteType !== 'All Institution Types' ? 1 : 0) +
    (filters.reservationCategory !== 'All Reservation Categories' ? 1 : 0) +
    (filters.netSletOnly ? 1 : 0) +
    (filters.phdOnly ? 1 : 0);

  return (
    <aside className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-800 shadow-sm space-y-6">
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-700" />
          <h3 className="font-serif font-bold text-slate-900 text-base">Faceted Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {activeFiltersCount} active
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-crimson-600 flex items-center gap-1 transition font-medium"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Keyword Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-brand-600" /> Keyword / Specialization
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="e.g. AI/ML, VLSI, Cryptography, IIT..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
        />
      </div>

      {/* State Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-600" /> Indian State / Region
        </label>
        <select
          value={filters.state}
          onChange={(e) => handleChange('state', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-500 transition font-medium"
        >
          {INDIAN_STATES.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* 7th CPC Designation Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> 7th CPC Level / Post
        </label>
        <select
          value={filters.designation}
          onChange={(e) => handleChange('designation', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-500 transition font-medium"
        >
          {DESIGNATIONS.map((desig) => (
            <option key={desig} value={desig}>{desig}</option>
          ))}
        </select>
      </div>

      {/* Institution Type */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-brand-600" /> Institution Category
        </label>
        <select
          value={filters.instituteType}
          onChange={(e) => handleChange('instituteType', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-500 transition font-medium"
        >
          {INSTITUTE_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Reservation Category */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-teal-600" /> Reservation Roster
        </label>
        <select
          value={filters.reservationCategory}
          onChange={(e) => handleChange('reservationCategory', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-500 transition font-medium"
        >
          {RESERVATIONS.map((res) => (
            <option key={res} value={res}>{res}</option>
          ))}
        </select>
      </div>

      {/* Quick UGC Qualification Toggles */}
      <div className="pt-3 border-t border-slate-200 space-y-2.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Statutory Eligibility Checks
        </span>

        <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none font-medium">
          <input
            type="checkbox"
            checked={filters.phdOnly}
            onChange={(e) => handleChange('phdOnly', e.target.checked)}
            className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-brand-600 focus:ring-0 focus:ring-offset-0"
          />
          <span>Ph.D. Mandatory Positions Only</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none font-medium">
          <input
            type="checkbox"
            checked={filters.netSletOnly}
            onChange={(e) => handleChange('netSletOnly', e.target.checked)}
            className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-brand-600 focus:ring-0 focus:ring-offset-0"
          />
          <span>NET / SLET Mandatory Posts</span>
        </label>
      </div>

      {/* Matching Result Count Badge */}
      <div className="pt-2">
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center text-xs">
          <span className="text-slate-600">Showing </span>
          <strong className="text-brand-900 font-mono text-sm font-bold">{totalResults}</strong>
          <span className="text-slate-600"> compliant vacancies</span>
        </div>
      </div>
    </aside>
  );
}
