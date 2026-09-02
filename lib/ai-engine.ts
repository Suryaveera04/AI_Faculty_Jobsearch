import { CandidateProfile, PublicationItem } from '@/types';
import { calculateUgcApiScore } from './scoring';

export interface ParsedResumeResult {
  candidateProfile: Partial<CandidateProfile>;
  confidenceScore: number;
  extractedSections: {
    educationFound: number;
    experienceFound: number;
    publicationsFound: number;
    netSletDetected: boolean;
    phdDetected: boolean;
  };
  ugcComplianceInsights: string[];
}

export const SAMPLE_ACADEMIC_CVS = {
  ai_postdoc: {
    label: 'Dr. Aarav Sundaram — Postdoc in Generative AI & Edge Systems (IITB Ph.D., IISc Postdoc)',
    rawText: `CURRICULUM VITAE
Dr. Aarav Sundaram, Ph.D.
Email: aarav.sundaram@iitb-alumni.org | Phone: +91-98401-23456 | Location: Bengaluru, Karnataka
ORCID: 0000-0002-1823-9941 | Google Scholar: aarav_sundaram_demo

EXECUTIVE SUMMARY
Ph.D. in Computer Science & Engineering from IIT Bombay with specialization in Edge AI and Quantized LLMs. Currently Postdoctoral Fellow at Department of Computational and Data Sciences, IISc Bangalore. UGC-NET JRF qualified with 4 high-impact peer-reviewed publications in IEEE TPAMI, NeurIPS, and ACM TECS.

EDUCATION
1. Ph.D. in Computer Science (2020 - 2024)
   Indian Institute of Technology Bombay (IIT Bombay)
   Thesis: Energy-Efficient Deep Learning Accelerators and Generative Reasoning for Low-Resource Edge Devices
   Supervisor: Prof. S. R. Ramakrishnan
   CGPA: 9.4/10 (Institute Best Dissertation Award) | UGC 2009/2016 Regulation Compliant.

2. M.Tech in Computer Science and Engineering (2018 - 2020)
   National Institute of Technology Karnataka (NITK) Surathkal
   Percentage: 88.5% (Gold Medalist, 1st Rank in Department)

3. B.Tech in Information Technology (2014 - 2018)
   College of Engineering Guindy, Anna University, Chennai
   Percentage: 86.2% (First Class with Distinction)

NATIONAL ELIGIBILITY & CERTIFICATIONS
• UGC-NET with Junior Research Fellowship (JRF) in Computer Science & Applications (Roll No: KA02004812, Year: 2021)
• GATE Computer Science (Rank: All India Rank 142)

ACADEMIC & RESEARCH EXPERIENCE
• Postdoctoral Research Fellow (July 2024 - Present)
  Indian Institute of Science (IISc Bangalore) - Dept. of Computational & Data Sciences
  Researching edge-deployable multimodal language models for Indian agricultural applications.
• Graduate Teaching Assistant (Jan 2021 - May 2024)
  IIT Bombay - CS305 Operating Systems & CS725 Machine Learning
  Conducted lab tutorials and code reviews for 200+ students.

PEER-REVIEWED PUBLICATIONS (UGC-CARE & SCOPUS/SCI INDEXED)
1. "Scalable Quantization for Large Language Models on Heterogeneous Edge Architectures", IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI), 2025. DOI: 10.1109/TPAMI.2025.3289124 (SCI, IF: 24.3)
2. "Sub-Watt Generative Vision Transformers: Architectural Optimizations for Ultra-Low Power RISC-V Chips", ACM Transactions on Embedded Computing Systems (TECS), 2024. DOI: 10.1145/3642189 (SCI, IF: 4.8)
3. "Real-time Multimodal Reasoning on Distributed Micro-Clusters", Proceedings of NeurIPS 2024.
4. "Low-Resource Indic Speech Synthesis Using Parameter-Efficient Adapter Transformers", Sadhana - Academy Proceedings in Engineering Sciences (Springer/Indian Academy of Sciences), 2023. DOI: 10.1007/s12046-023-02104-x (UGC-CARE Group I)

RESEARCH INTERESTS
Generative AI, Large Language Models, Edge Computing, Hardware-Software Co-Design, Indic NLP.`,
  },

  vlsi_assoc_prof: {
    label: 'Dr. Meenakshi Raman — Senior Faculty in VLSI & Hardware Security (12 yrs exp, 14 UGC Pubs)',
    rawText: `ACADEMIC DOSSIER & CURRICULUM VITAE
Dr. Meenakshi Raman, Ph.D.
Email: m.raman@nitc.ac.in | Phone: +91-94470-11223 | Kozhikode, Kerala
Scopus Author ID: 56192841000 | ORCID: 0000-0001-9452-7718

PROFILE
Associate Professor in Electronics & Communication Engineering with 12+ years of university teaching and funded research experience. Successfully graduated 3 Ph.D. scholars and published 14 UGC-CARE/SCI papers in IEEE TCAS, TVLSI, and Microelectronics Journal.

EDUCATION
• Ph.D. in VLSI Systems (2014) - National Institute of Technology Calicut (UGC 2009 Compliant)
• M.E. in Applied Electronics (2009) - PSG College of Technology, Coimbatore (84.0%)
• B.E. in ECE (2006) - Government College of Technology, Coimbatore (82.5%)

NATIONAL QUALIFICATIONS
• CSIR-NET in Engineering Sciences (Qualified 2010)

RESEARCH PUBLICATIONS
1. "Hardware Trojan Detection using On-Chip Deep Anomaly Detectors in 7nm FinFET", IEEE Transactions on Very Large Scale Integration Systems, 2024.
2. "Energy Harvesting Sensor Interfaces for Biomedical Wearables", Microelectronics Journal (Elsevier), 2023.
3. "Post-Quantum Cryptographic Accelerators on RISC-V SoC", IEEE Transactions on Circuits and Systems I, 2022.
4. 11 additional papers in UGC-CARE and Scopus indexed conferences/journals.

SPONSORED RESEARCH PROJECTS
• DST-SERB Core Research Grant (₹48.5 Lakhs) - PI: "Fault-Resilient Neuromorphic Architectures" (2022-2025).`,
  },
};

export async function parseAcademicResume(textOrFileContent: string): Promise<ParsedResumeResult> {
  // Simulate intelligent LLM academic parser extraction delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  const text = textOrFileContent.toLowerCase();
  
  // Intelligent heuristic extraction simulating 2026 LLM structured JSON output
  const hasPhd = text.includes('ph.d') || text.includes('phd') || text.includes('doctor of philosophy');
  const hasNet = text.includes('net') || text.includes('jrf') || text.includes('csir') || text.includes('slet') || text.includes('gate');
  const isUgcCompliant = text.includes('2009') || text.includes('2016') || text.includes('ugc') || hasPhd;
  
  // Extract publications count
  const pubLines = text.split('\n').filter(line => 
    line.includes('ieee') || line.includes('acm') || line.includes('springer') || 
    line.includes('transactions') || line.includes('journal') || line.includes('proceedings') ||
    line.includes('doi:')
  );
  
  const estimatedPubCount = Math.max(pubLines.length, text.includes('publications') ? 4 : 2);

  const mockPublications: PublicationItem[] = [
    {
      id: `parsed-pub-1`,
      title: 'Scalable Quantization for Large Language Models on Heterogeneous Edge Architectures',
      journalOrConference: 'IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)',
      year: 2025,
      doi: '10.1109/TPAMI.2025.3289124',
      ugcCareListed: true,
      scopusIndexed: true,
      sciScieIndexed: true,
      impactFactor: 24.3,
      authors: 'A. Sundaram et al.',
      citationsCount: 42,
      type: 'Journal',
    },
    {
      id: `parsed-pub-2`,
      title: 'Sub-Watt Generative Vision Transformers: Architectural Optimizations for Ultra-Low Power RISC-V Chips',
      journalOrConference: 'ACM Transactions on Embedded Computing Systems (TECS)',
      year: 2024,
      doi: '10.1145/3642189',
      ugcCareListed: true,
      scopusIndexed: true,
      sciScieIndexed: true,
      impactFactor: 4.8,
      authors: 'A. Sundaram, P. Deshmukh',
      citationsCount: 29,
      type: 'Journal',
    },
    {
      id: `parsed-pub-3`,
      title: 'Real-time Multimodal Reasoning on Distributed Micro-Clusters',
      journalOrConference: 'Proceedings of NeurIPS 2024',
      year: 2024,
      doi: '10.5555/neurips.2024.1982',
      ugcCareListed: true,
      scopusIndexed: true,
      sciScieIndexed: true,
      authors: 'A. Sundaram, K. Banerjee',
      citationsCount: 68,
      type: 'Conference',
    },
    {
      id: `parsed-pub-4`,
      title: 'Low-Resource Indic Speech Synthesis Using Parameter-Efficient Adapter Transformers',
      journalOrConference: 'Sadhana - Academy Proceedings in Engineering Sciences (Springer/Indian Academy of Sciences)',
      year: 2023,
      doi: '10.1007/s12046-023-02104-x',
      ugcCareListed: true,
      scopusIndexed: true,
      sciScieIndexed: true,
      impactFactor: 1.6,
      authors: 'A. Sundaram, M. Krishnamurthy',
      citationsCount: 18,
      type: 'Journal',
    },
  ];

  const parsedProfile: Partial<CandidateProfile> = {
    name: text.includes('meenakshi') ? 'Dr. Meenakshi Raman' : 'Dr. Aarav Sundaram',
    email: text.includes('meenakshi') ? 'm.raman@nitc.ac.in' : 'aarav.sundaram@iitb-alumni.org',
    phone: text.includes('meenakshi') ? '+91-94470-11223' : '+91-98401-23456',
    highestDegree: hasPhd ? 'Ph.D. in Computer Science / Electronics' : 'M.Tech / M.Sc.',
    currentDesignation: text.includes('postdoc') ? 'Postdoctoral Research Fellow' : text.includes('associate') ? 'Associate Professor' : 'Assistant Professor',
    currentInstitute: text.includes('iisc') ? 'IISc Bangalore' : text.includes('nitc') ? 'NIT Calicut' : 'IIT Bombay',
    location: {
      city: text.includes('bengaluru') ? 'Bengaluru' : text.includes('kozhikode') ? 'Kozhikode' : 'Mumbai',
      state: text.includes('karnataka') ? 'Karnataka' : text.includes('kerala') ? 'Kerala' : 'Maharashtra',
    },
    netSletStatus: {
      isQualified: hasNet,
      examType: text.includes('jrf') ? 'UGC-NET (JRF)' : 'CSIR-NET (LS)',
      qualifiedYear: 2021,
      subject: 'Computer Science and Applications',
      rollNumber: 'KA02004812',
    },
    phdStatus: {
      isCompleted: hasPhd,
      institute: text.includes('nit') ? 'NIT Calicut' : 'IIT Bombay',
      thesisTitle: 'Energy-Efficient Deep Learning Accelerators and Generative Reasoning for Low-Resource Edge Devices',
      graduationYear: 2024,
      isUgc2009_2016Compliant: isUgcCompliant,
    },
    publications: mockPublications,
    researchInterests: [
      'Generative AI & LLMs',
      'Edge Machine Learning',
      'Hardware-Software Co-Design',
      'Indic Multimodal Systems',
    ],
    skills: ['PyTorch', 'CUDA', 'C++', 'RISC-V', 'LLM Fine-Tuning', 'LaTeX', 'Distributed Training'],
    scholarLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=aarav_sundaram_demo',
      orcid: '0000-0002-1823-9941',
      scopusId: '57219842100',
    },
  };

  parsedProfile.apiScore = calculateUgcApiScore(parsedProfile);
  parsedProfile.profileCompleteness = 92;

  const ugcInsights: string[] = [
    'Ph.D. degree detected and validated for UGC 2009/2016 Minimum Standards compliance.',
    'UGC-NET JRF credential recognized: qualifies for mandatory recruitment criteria under 7th CPC Level 10.',
    `Extracted ${mockPublications.length} publications with automated UGC-CARE Group I and Scopus indexing lookup.`,
    `Computed API Score: ${parsedProfile.apiScore}/100 based on UGC Regulations 2018 Table 3A norms.`,
  ];

  return {
    candidateProfile: parsedProfile,
    confidenceScore: 96,
    extractedSections: {
      educationFound: 3,
      experienceFound: 2,
      publicationsFound: estimatedPubCount,
      netSletDetected: hasNet,
      phdDetected: hasPhd,
    },
    ugcComplianceInsights: ugcInsights,
  };
}

export function generateTeachingStatement(interests: string[], degree: string, universityTarget: string): string {
  return `TEACHING PHILOSOPHY & PEDAGOGICAL STATEMENT

As an academic with a ${degree}, my pedagogical philosophy is grounded in creating an active, inquiry-driven, and inclusive classroom environment. 

1. Foundations First, Followed by Systems Building:
In my instruction, I bridge rigorous mathematical theory with hands-on lab experiments. Students must not only understand theoretical complexity but also build and profile working systems from scratch.

2. Fostering Undergraduate & Postgraduate Research:
At ${universityTarget}, I aim to mentor students in open-ended semester projects that culminate in open-source contributions or UGC-CARE / peer-reviewed conference publications.

3. Interdisciplinary Relevance & Active Learning:
Drawing upon my research specializations in ${interests.slice(0, 3).join(', ')}, I emphasize real-world Indian socio-economic challenges, encouraging students to develop localized technological solutions.

I am committed to adopting NEP 2020 multidisciplinary pedagogical frameworks and continuous student evaluation.`;
}

export async function generateUgcJobDescription(
  title: string,
  department: string,
  instituteName: string,
  cpcBand: string,
  specializations: string
): Promise<string> {
  await new Promise(r => setTimeout(r, 400));
  return `STATUTORY FACULTY RECRUITMENT NOTIFICATION
${instituteName}
${department}

Position: ${title}
Pay Scale: 7th Central Pay Commission ${cpcBand}

1. Statutory Minimum Qualifications per UGC Regulations (2018/2023 Gazette):
   - Ph.D. Degree in ${department.replace('Department of ', '')} or closely allied discipline with First Class in preceding degrees.
   - Demonstrated high-impact research output in UGC-CARE Group I and Scopus/SCI indexed journals.
   - Specialization focus areas: ${specializations}.

2. Institutional Responsibilities & Research Ecosystem:
   - Teach undergraduate and postgraduate courses aligning with NEP 2020 frameworks.
   - Supervise doctoral researchers and initiate sponsored research projects through DST, SERB, MeitY, and industry partnerships.
   - Contribute to departmental development and institutional governance.

3. Statutory Roster & Allowances:
   - Selection process strictly governed by statutory selection committee protocols with external experts.
   - Entitled to CPDA grants, campus accommodation/HRA, DA at prevailing central rates, and faculty seed grants.`;
}

