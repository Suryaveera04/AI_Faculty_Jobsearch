'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/lib/storage';
import { generateUgcJobDescription } from '@/lib/ai-engine';
import { Job, DesignationType } from '@/types';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  Send,
  FileCheck
} from 'lucide-react';

const CPC_LEVELS = [
  { label: 'Level 10 (Entry Pay ₹57,700 - Asst. Professor)', value: 'Level 10 (Entry Pay ₹57,700 - ₹1,82,400)', entryPay: '₹57,700', gross: '₹1,02,000/mo' },
  { label: 'Level 11 (Entry Pay ₹68,900 - Asst. Professor Senior)', value: 'Level 11 (Entry Pay ₹68,900 - ₹2,05,500)', entryPay: '₹68,900', gross: '₹1,22,000/mo' },
  { label: 'Level 12 (Entry Pay ₹79,800 - Asst. Professor Selection Grade)', value: 'Level 12 (Entry Pay ₹79,800 - ₹2,11,500)', entryPay: '₹79,800', gross: '₹1,42,000/mo' },
  { label: 'Level 13A (Entry Pay ₹1,31,400 - Associate Professor)', value: 'Level 13A (Entry Pay ₹1,31,400 - ₹2,17,100)', entryPay: '₹1,31,400', gross: '₹2,32,000/mo' },
  { label: 'Level 14 (Entry Pay ₹1,44,200 - Professor)', value: 'Level 14 (Entry Pay ₹1,44,200 - ₹2,18,200)', entryPay: '₹1,44,200', gross: '₹2,55,000/mo' },
  { label: 'Level 15 (Entry Pay ₹1,82,200 - Senior Professor / HAG)', value: 'Level 15 (Entry Pay ₹1,82,200 - ₹2,24,100)', entryPay: '₹1,82,200', gross: '₹3,20,000/mo' },
];

export default function PostJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState('Assistant Professor (Grade I - AI & Machine Learning)');
  const [department, setDepartment] = useState('Department of Computer Science and Engineering');
  const [advtNo, setAdvtNo] = useState('IITB/FAC/2026/04');
  const [designation, setDesignation] = useState<DesignationType>('Assistant Professor (Level 12 - 7th CPC)');
  const [selectedCpcIdx, setSelectedCpcIdx] = useState(2); // Level 12
  const [reservationCategory, setReservationCategory] = useState<'Unreserved (UR / General)' | 'OBC - Non Creamy Layer' | 'Scheduled Caste (SC)' | 'Scheduled Tribe (ST)' | 'Economically Weaker Section (EWS)' | 'Open to All Categories'>('Unreserved (UR / General)');
  const [deadline, setDeadline] = useState('2026-10-15');
  const [minDegree, setMinDegree] = useState('Ph.D. in Computer Science, Artificial Intelligence, or closely related discipline');
  const [netMandatory, setNetMandatory] = useState(false);
  const [minUgcPubs, setMinUgcPubs] = useState(4);
  const [minExpYears, setMinExpYears] = useState(3);
  const [specializations, setSpecializations] = useState('Generative AI, LLMs, Computer Vision, Deep Learning Systems');
  const [description, setDescription] = useState('');
  const [screeningQ1, setScreeningQ1] = useState('Do you possess a Ph.D. with a minimum of 3 years postdoctoral / industrial research experience?');
  const [screeningQ2, setScreeningQ2] = useState('Detail your top 3 publications in Scopus / SCI indexed Q1 journals in the proposed area.');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGenerateAiDescription = async () => {
    setIsGeneratingAi(true);
    const generated = await generateUgcJobDescription(
      title,
      department,
      'Indian Institute of Technology Bombay',
      CPC_LEVELS[selectedCpcIdx].value,
      specializations
    );
    setDescription(generated);
    setIsGeneratingAi(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const cpc = CPC_LEVELS[selectedCpcIdx];

    const newJob: Job = {
      id: `job-iitb-${Date.now()}`,
      instituteId: 'inst-iitb',
      instituteName: 'Indian Institute of Technology Bombay',
      instituteShortName: 'IIT Bombay',
      instituteLogo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=128&auto=format&fit=crop&q=80',
      instituteType: 'IIT / NIT / IISc / IIIT (Institute of National Importance)',
      title,
      department,
      advertisementNumber: advtNo,
      designation,
      reservationCategory,
      applicationDeadline: deadline,
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
      },
      payScale: {
        cpcBand: cpc.value,
        entryPay: cpc.entryPay,
        grossMonthlyEstimated: cpc.gross,
        allowances: ['50% Dearness Allowance (DA)', '27% House Rent Allowance (HRA)', 'Transport Allowance', 'Cumulative Professional Development Allowance (CPDA) ₹3 Lakhs/3yrs'],
      },
      requiredQualifications: {
        minDegree: 'Ph.D. with First Class Master',
        phdNorms: 'UGC 2009/2016 Compliant',
        netSletMandatory: netMandatory,
        minUgcCarePubs: Number(minUgcPubs),
        minExperienceYears: Number(minExpYears),
        specializationRequirements: specializations.split(',').map(s => s.trim()),
        ugcRegulationsYear: 'UGC 2018 Regulations',
      },
      description: description || `Applications are invited from Indian nationals for the position of ${title} in the ${department} at IIT Bombay. Candidates must possess outstanding academic credentials, strong publication record in UGC-CARE / Scopus indexed venues, and demonstrated capacity for sponsored research.`,
      specializationTags: specializations.split(',').map(s => s.trim()),
      benefits: ['Campus Housing / 27% HRA', '₹15 Lakhs Seed Research Grant', 'Medical Coverage for Family', 'CPDA Grant'],
      responsibilities: ['Instruction in UG/PG courses', 'Doctoral scholar guidance', 'Sponsored research acquisition'],
      selectionProcess: ['Initial UGC Table 3A Screening', 'Departmental Shortlisting Committee Review', 'Dean & HOD Preliminary Interview', 'Faculty Selection Board & Colloquium Presentation', 'Board of Governors Formal Appointment'],
      screeningQuestions: [screeningQ1, screeningQ2].filter(Boolean),
      applicantCount: 0,
      status: 'published',
      isClaimedByInstitute: true,
      postedAt: new Date().toISOString().split('T')[0],
      featured: true,
    };

    StorageService.addJob(newJob);

    setTimeout(() => {
      setSubmitting(false);
      router.push('/jobs');
    }, 600);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
            <Link href="/institute/dashboard" className="hover:text-brand-700 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-brand-900 font-bold">Post Vacancy</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            Post 7th CPC &amp; UGC Compliant Faculty Vacancy
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Publish an institutional advertisement with statutory pay bands, reservation rosters, and departmental screening questions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateAiDescription}
          disabled={isGeneratingAi}
          className="px-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 font-bold text-xs flex items-center gap-2 transition shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-brand-700" />
          <span>{isGeneratingAi ? 'Drafting UGC Text...' : 'AI Auto-Draft UGC Description'}</span>
        </button>
      </div>

      {/* Form Grid - Full Space */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Column (8 cols): Main Posting Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Box 1: Position Core Meta */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base">Position &amp; Departmental Cadre</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Position Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Department / Center:</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Advertisement / Rolling Ref No:</label>
                <input
                  type="text"
                  value={advtNo}
                  onChange={(e) => setAdvtNo(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Application Deadline:</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Box 2: 7th CPC Pay Scale & Reservation */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base">7th CPC Pay Scale &amp; Reservation Category</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">7th CPC Pay Band Level:</label>
                <select
                  value={selectedCpcIdx}
                  onChange={(e) => setSelectedCpcIdx(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                >
                  {CPC_LEVELS.map((c, i) => (
                    <option key={i} value={i}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Statutory Reservation Roster:</label>
                <select
                  value={reservationCategory}
                  onChange={(e: any) => setReservationCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-bold"
                >
                  <option value="Unreserved (UR / General)">Unreserved (UR / General)</option>
                  <option value="OBC - Non Creamy Layer">OBC - Non Creamy Layer</option>
                  <option value="Scheduled Caste (SC)">Scheduled Caste (SC)</option>
                  <option value="Scheduled Tribe (ST)">Scheduled Tribe (ST)</option>
                  <option value="Economically Weaker Section (EWS)">Economically Weaker Section (EWS)</option>
                  <option value="Open to All Categories">Open to All Categories</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong className="block font-bold">Selected Pay Scale Benchmark:</strong>
              <span>{CPC_LEVELS[selectedCpcIdx].value} • Estimated Gross Monthly: <strong>{CPC_LEVELS[selectedCpcIdx].gross}</strong> (including 50% DA + 27% HRA)</span>
            </div>
          </div>

          {/* Box 3: Statutory Qualifications */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base">UGC / AICTE Statutory Criteria</h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Degree &amp; Discipline:</label>
                <input
                  type="text"
                  value={minDegree}
                  onChange={(e) => setMinDegree(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min UGC-CARE / Scopus Pubs:</label>
                  <input
                    type="number"
                    value={minUgcPubs}
                    onChange={(e) => setMinUgcPubs(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Post-Ph.D. Exp (Years):</label>
                  <input
                    type="number"
                    value={minExpYears}
                    onChange={(e) => setMinExpYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Research Specialization Domains (Comma-separated):</label>
                <input
                  type="text"
                  value={specializations}
                  onChange={(e) => setSpecializations(e.target.value)}
                  placeholder="e.g. Artificial Intelligence, Cryptography, VLSI..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={netMandatory}
                  onChange={(e) => setNetMandatory(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 accent-brand-600"
                />
                <span>UGC/CSIR NET/SLET Mandatory for this position</span>
              </label>
            </div>
          </div>

          {/* Box 4: Job Description */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm text-xs">
            <div className="flex items-center justify-between">
              <label className="font-serif font-bold text-slate-900 text-base">Full Statutory Description:</label>
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                className="text-xs text-brand-700 hover:text-brand-900 font-bold underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto-generate
              </button>
            </div>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description, department facilities, teaching responsibilities, and research expectations..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 leading-relaxed focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

        </div>

        {/* Right Column (4 cols): Screening Questions & Publish */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="sticky top-24 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-5 shadow-md text-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base">Departmental Screening Questions</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
              Candidates must answer these structured questions during submission for fast-triage by the selection committee.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Question 1 (Qualifications &amp; Exp):</label>
                <textarea
                  rows={2}
                  value={screeningQ1}
                  onChange={(e) => setScreeningQ1(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question 2 (Publications &amp; Grants):</label>
                <textarea
                  rows={2}
                  value={screeningQ2}
                  onChange={(e) => setScreeningQ2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {submitting ? 'Publishing Vacancy...' : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Publish 7th CPC Vacancy
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 text-center font-medium">
                Compliant with UGC 2018/2023 Gazette &amp; DPDP Act.
              </div>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
}
