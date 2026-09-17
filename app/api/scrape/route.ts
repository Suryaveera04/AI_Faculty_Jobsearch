import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { Job, DesignationType, InstitutionType, ReservationCategory } from '@/types';

interface ScrapedRawOpening {
  position: string;
  department: string | null;
  qualification: string | null;
  experience: string | null;
  pay_scale: string | null;
  deadline: string | null;
  source_url: string;
  layout: string;
  description?: string;
}

interface ScrapeEngineResult {
  institution_title: string;
  start_url: string;
  pages_crawled: number;
  career_hubs_discovered: string[];
  openings: ScrapedRawOpening[];
}

function mapToDesignation(title: string): DesignationType {
  const t = title.toLowerCase();
  if (t.includes('dean') || t.includes('director') || t.includes('vc') || t.includes('vice chancellor')) {
    return 'Dean / Director / Head of School';
  }
  if (t.includes('senior professor') || t.includes('level 15')) {
    return 'Senior Professor (Level 15 - 7th CPC)';
  }
  if (t.includes('professor') && !t.includes('assistant') && !t.includes('associate')) {
    return 'Professor (Level 14 - 7th CPC)';
  }
  if (t.includes('associate professor')) {
    return 'Associate Professor (Level 13A - 7th CPC)';
  }
  if (t.includes('senior assistant professor') || t.includes('level 11') || t.includes('level 12')) {
    return 'Assistant Professor (Level 11 - 7th CPC)';
  }
  if (t.includes('postdoc') || t.includes('fellow') || t.includes('research associate')) {
    return 'Postdoctoral Research Fellow';
  }
  if (t.includes('practice')) {
    return 'Professor of Practice (Industry Track)';
  }
  return 'Assistant Professor (Level 10 - 7th CPC)';
}

function mapToPayScale(designation: DesignationType, rawPay: string | null) {
  if (designation === 'Professor (Level 14 - 7th CPC)') {
    return {
      cpcBand: 'Level 14 (₹1,44,200 - ₹2,18,200)',
      entryPay: '₹1,44,200',
      grossMonthlyEstimated: '₹2,68,000/mo (with 50% DA + HRA)',
      allowances: ['Dearness Allowance (50%)', 'House Rent Allowance (27%)', 'Transport Allowance', 'Research Contingency Grant (₹3,00,000/yr)'],
    };
  }
  if (designation === 'Associate Professor (Level 13A - 7th CPC)') {
    return {
      cpcBand: 'Level 13A (₹1,31,400 - ₹2,17,100)',
      entryPay: '₹1,31,400',
      grossMonthlyEstimated: '₹2,45,000/mo (with 50% DA + HRA)',
      allowances: ['Dearness Allowance (50%)', 'House Rent Allowance (27%)', 'Transport Allowance', 'CPDA Grant'],
    };
  }
  if (designation === 'Dean / Director / Head of School') {
    return {
      cpcBand: 'Level 14 / 15 (₹1,44,200 - ₹2,24,100)',
      entryPay: '₹1,44,200',
      grossMonthlyEstimated: '₹2,85,000/mo + Special Dean Allowance',
      allowances: ['Special Administrative Allowance', 'Official Vehicle', 'Executive Quarters', 'Dean Contingency Fund'],
    };
  }
  // Default: Assistant Professor Level 10
  return {
    cpcBand: rawPay && rawPay.toLowerCase().includes('aicte') ? 'Level 10 / Revised AICTE Pay Scale' : 'Level 10 (₹57,700 - ₹1,82,400)',
    entryPay: '₹57,700',
    grossMonthlyEstimated: '₹1,08,000/mo (with 50% DA + HRA)',
    allowances: ['Dearness Allowance (50%)', 'House Rent Allowance (27%)', 'Transport Allowance', 'Cumulative Professional Development Allowance (CPDA)'],
  };
}

function transformRawToJob(raw: ScrapedRawOpening, index: number, institutionName: string, domain: string): Job {
  const designation = mapToDesignation(raw.position);
  const payScale = mapToPayScale(designation, raw.pay_scale);
  const dept = raw.department && raw.department !== 'General / Multi-Department' 
    ? raw.department 
    : 'School of Computing & Engineering';

  const isProf = designation.includes('Professor') && !designation.includes('Assistant');
  const isAssoc = designation.includes('Associate');

  // Extract years of experience
  const expMatch = (raw.experience || '').match(/(\d+)\s*(?:years?|yrs?)/i);
  const minExp = expMatch ? parseInt(expMatch[1], 10) : (isProf ? 10 : isAssoc ? 6 : 0);

  const cleanInstName = institutionName && institutionName.length > 3 ? institutionName : 'Autonomous Engineering College / University';
  const shortName = cleanInstName.split(',')[0].replace(/^(The\s+)/i, '').trim();

  // Specialization tags
  const tags: string[] = [];
  if (dept.toLowerCase().includes('computing') || dept.toLowerCase().includes('computer')) {
    tags.push('Computer Science', 'Artificial Intelligence', 'Data Science', 'Machine Learning');
  } else if (dept.toLowerCase().includes('electronics') || dept.toLowerCase().includes('communication')) {
    tags.push('VLSI Design', 'Embedded Systems', 'Signal Processing', '5G / IoT');
  } else if (dept.toLowerCase().includes('electrical')) {
    tags.push('Power Systems', 'Smart Grids', 'Renewable Energy', 'Control Systems');
  } else if (dept.toLowerCase().includes('management')) {
    tags.push('Organizational Behavior', 'Fintech', 'Operations', 'Business Analytics');
  } else {
    tags.push('Engineering', 'Applied Sciences', 'Interdisciplinary Research');
  }

  // Application deadline
  let deadline = '2026-12-31';
  if (raw.deadline && raw.deadline.includes('/')) {
    const parts = raw.deadline.split('/');
    if (parts.length === 3) {
      deadline = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }

  return {
    id: `scraped-${domain.replace(/[^a-zA-Z0-9]/g, '')}-${index + 1}-${Date.now() % 100000}`,
    instituteId: `inst-${domain.replace(/[^a-zA-Z0-9]/g, '')}`,
    instituteName: cleanInstName,
    instituteShortName: shortName,
    instituteLogo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80',
    instituteType: 'Autonomous Engineering College' as InstitutionType,
    title: raw.position,
    designation,
    department: dept,
    specializationTags: tags,
    advertisementNumber: `RECRUIT-${domain.toUpperCase().slice(0, 6)}-2026/${index + 1}`,
    location: {
      city: 'Institutional Campus',
      state: 'All India',
    },
    payScale,
    requiredQualifications: {
      minDegree: raw.qualification && raw.qualification.toLowerCase().includes('m.tech') 
        ? 'Ph.D. with First Class Master' 
        : 'Ph.D. Mandatory',
      netSletMandatory: !raw.qualification?.toLowerCase().includes('ph.d'),
      phdNorms: 'UGC 2009/2016 Compliant',
      minExperienceYears: minExp,
      minUgcCarePubs: isProf ? 10 : isAssoc ? 7 : 3,
      ugcRegulationsYear: 'AICTE 2019/2023 Gazette',
      specializationRequirements: [
        raw.qualification || 'Doctoral degree with first-class academic trajectory from IITs / NITs / Premier Institutions',
      ],
    },
    reservationCategory: 'Open to All Categories' as ReservationCategory,
    applicationDeadline: deadline,
    status: 'published',
    isClaimedByInstitute: false,
    screeningQuestions: [
      'Have you completed your Ph.D. in accordance with UGC Regulations 2009/2016?',
      'Do you have minimum required indexed journal publications (SCI/Scopus/UGC-CARE)?',
    ],
    selectionProcess: [
      'Document Screening & API Validation',
      'Departmental Research Seminar & Chalk Talk',
      'Selection Committee Colloquium Interview',
    ],
    description: `Official faculty position for ${raw.position} in the ${dept} at ${cleanInstName}. Extracted via the universal deep scraper from official institutional career notifications. Source: ${raw.source_url}`,
    responsibilities: [
      'Undergraduate and Postgraduate curriculum instruction and laboratory supervision.',
      'Active research, peer-reviewed publications, sponsored research projects, and doctoral guidance.',
      'Institutional accreditation, NBA/NAAC self-study reporting, and academic committee work.',
    ],
    benefits: [
      '7th CPC / Revised AICTE Pay Matrix with full allowances.',
      'Cumulative Professional Development Allowance (CPDA) for national and international conferences.',
      'Campus housing or standard 27% HRA.',
    ],
    postedAt: new Date().toISOString().split('T')[0],
    applicantCount: 0,
    featured: index < 3,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetUrl = (body.url || '').trim();

    if (!targetUrl) {
      return NextResponse.json(
        { success: false, error: 'University URL is required.' },
        { status: 400 }
      );
    }

    // Basic URL validation
    let validUrl: URL;
    try {
      validUrl = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL provided.' },
        { status: 400 }
      );
    }

    const scriptPath = path.join(process.cwd(), 'scraper.py');

    // Run python scraper with --json-only flag
    const pythonProcess = spawn('python', [scriptPath, validUrl.toString(), '--json-only'], {
      cwd: process.cwd(),
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    let stdoutData = '';
    let stderrData = '';

    const runPromise = new Promise<{ code: number | null; stdout: string; stderr: string }>(
      (resolve) => {
        pythonProcess.stdout.on('data', (chunk) => {
          stdoutData += chunk.toString('utf-8');
        });

        pythonProcess.stderr.on('data', (chunk) => {
          stderrData += chunk.toString('utf-8');
        });

        pythonProcess.on('close', (code) => {
          resolve({ code, stdout: stdoutData, stderr: stderrData });
        });

        pythonProcess.on('error', (err) => {
          resolve({ code: -1, stdout: stdoutData, stderr: err.message });
        });

        // 60-second execution timeout
        setTimeout(() => {
          pythonProcess.kill();
          resolve({ code: -2, stdout: stdoutData, stderr: 'Execution timed out after 60 seconds.' });
        }, 60000);
      }
    );

    const { code, stdout, stderr } = await runPromise;

    if (code !== 0) {
      console.error('[Scraper API] Python execution failed:', stderr);
      return NextResponse.json(
        {
          success: false,
          error: `Scraping failed: ${stderr || 'Process returned non-zero code.'}`,
        },
        { status: 500 }
      );
    }

    // Find JSON block in stdout
    let parsed: ScrapeEngineResult;
    try {
      // Find where JSON begins
      const jsonStart = stdout.indexOf('{');
      const jsonEnd = stdout.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON output found in scraper response.');
      }
      const rawJson = stdout.slice(jsonStart, jsonEnd + 1);
      parsed = JSON.parse(rawJson);
    } catch (parseError: any) {
      console.error('[Scraper API] JSON parse error:', parseError, stdout);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse JSON from Python scraper engine.',
          rawOutput: stdout,
        },
        { status: 500 }
      );
    }

    const domain = validUrl.hostname.replace('www.', '');
    const mappedJobs = (parsed.openings || []).map((opening, idx) =>
      transformRawToJob(opening, idx, parsed.institution_title, domain)
    );

    return NextResponse.json({
      success: true,
      telemetry: {
        institutionTitle: parsed.institution_title,
        seedUrl: parsed.start_url,
        pagesCrawled: parsed.pages_crawled,
        careerHubsDiscovered: parsed.career_hubs_discovered || [],
        totalFacultyFound: mappedJobs.length,
      },
      openings: parsed.openings,
      jobs: mappedJobs,
    });
  } catch (err: any) {
    console.error('[Scraper API Route] Internal error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
