/**
 * Case Storage Utility for Evidentia Frontend
 * Handles LocalStorage persistence with realistic seed data fallback.
 */

export interface CaseItem {
  id: string;
  caseTitle: string;
  firNumber: string;
  caseType?: string;
  classification?: string;
  priority?: string;
  status?: string;
  stage?: string;
  district?: string;
  policeStation?: string;
  court?: string;
  jurisdiction?: string;
  incidentDate?: string;
  caseOpenedDate?: string;
  description?: string;
  leadInvestigator?: string;
  supervisingOfficer?: string;
  additionalTeam?: string;
  legalReviewer?: string;
  confidentiality?: string;
  tags?: string;
  lastActivity?: string;
  nextDeadline?: string;
  evidenceCount?: number;
  complainantName?: string;
  complainantNearby?: string;
  complainantRoles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'evidentia_cases';

const INITIAL_CASES: CaseItem[] = [
  {
    id: 'CSD-2026-0001',
    caseTitle: 'Armed Robbery at Connaught Place Metro Gate 3',
    firNumber: 'FIR-2026-CP-0891',
    caseType: 'Criminal',
    classification: 'Confidential',
    priority: 'High',
    status: 'Active',
    stage: 'Analysis',
    district: 'Central Delhi',
    policeStation: 'Connaught Place PS',
    court: 'Patiala House District Court',
    jurisdiction: 'Central District, New Delhi',
    incidentDate: '2024-08-15',
    caseOpenedDate: '2024-08-15',
    description:
      'Armed snatching of laptop bag containing financial records near Metro Gate 3. Suspect fled in Silver Swift car DL-3C-AB-1234.',
    leadInvestigator: 'Inspector Rajesh Kumar',
    supervisingOfficer: 'ACP Vikramaditya',
    additionalTeam: 'SI Amit Sharma, Constable Priya',
    legalReviewer: 'Advocate R. S. Verma',
    confidentiality: 'Confidential',
    tags: 'robbery, cctv, swift, arms',
    lastActivity: '2 hours ago',
    nextDeadline: '2026-09-05',
    evidenceCount: 4,
    createdAt: '2024-08-15T20:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'CSD-2026-0042',
    caseTitle: 'Classified Cross-Border Financial Cyber Espionage',
    firNumber: 'FIR-2026-CYB-0042',
    caseType: 'Cyber Crime',
    classification: 'Top Secret',
    priority: 'Critical',
    status: 'Under Review',
    stage: 'Verification',
    district: 'Special Cell',
    policeStation: 'Cyber Warfare Division',
    court: 'High Court of Delhi',
    jurisdiction: 'National Capital Territory',
    incidentDate: '2024-08-20',
    caseOpenedDate: '2024-08-20',
    description:
      'High-level financial malware and phishing operation targeting critical infrastructure endpoints. Requires Top Secret clearance.',
    leadInvestigator: 'Dr. Neha Verma (Cyber Analyst)',
    supervisingOfficer: 'DCP Cyber Cell',
    additionalTeam: 'Cert-In Cyber Forensics Team',
    legalReviewer: 'Special Prosecutor',
    confidentiality: 'Top Secret',
    tags: 'cyber, phishing, malware, banking',
    lastActivity: '1 day ago',
    nextDeadline: '2026-09-10',
    evidenceCount: 8,
    createdAt: '2024-08-20T12:00:00Z',
    updatedAt: '2026-08-28T12:00:00Z',
  },
  {
    id: 'CSD-2026-0108',
    caseTitle: 'High Court Asset Forfeiture & Counterfeit Currency',
    firNumber: 'FIR-2026-HC-0108',
    caseType: 'Financial Fraud',
    classification: 'Secret',
    priority: 'Medium',
    status: 'Active',
    stage: 'Review',
    district: 'South Delhi',
    policeStation: 'Hauz Khas PS',
    court: 'High Court of Delhi',
    jurisdiction: 'South District, New Delhi',
    incidentDate: '2024-08-10',
    caseOpenedDate: '2024-08-11',
    description:
      'Seizure of counterfeit currency notes and suspicious banking ledgers during routine checkpoint inspection.',
    leadInvestigator: 'Inspector S. K. Singh',
    supervisingOfficer: 'ACP Financial Intelligence',
    additionalTeam: 'Sub-Inspector Malhotra',
    legalReviewer: 'Advocate Mehra',
    confidentiality: 'Secret',
    tags: 'counterfeit, currency, banking',
    lastActivity: '3 days ago',
    nextDeadline: '2026-09-15',
    evidenceCount: 3,
    createdAt: '2024-08-11T09:00:00Z',
    updatedAt: '2026-08-27T15:00:00Z',
  },
];

export function getCases(): CaseItem[] {
  if (typeof window === 'undefined') return INITIAL_CASES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASES));
      return INITIAL_CASES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CASES;
  } catch (err) {
    console.error('Error reading cases from localStorage:', err);
    return INITIAL_CASES;
  }
}

export function saveCases(cases: CaseItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (err) {
    console.error('Error saving cases to localStorage:', err);
  }
}

export function addCase(caseData: Partial<CaseItem>): CaseItem {
  const cases = getCases();
  const year = new Date().getFullYear();
  const randNum = String(Math.floor(Math.random() * 9000) + 1000);
  const newId = caseData.id || `CSD-${year}-${randNum}`;

  const newCase: CaseItem = {
    id: newId,
    caseTitle: caseData.caseTitle || 'Untitled Investigation Case',
    firNumber: caseData.firNumber || `FIR-${year}-GEN-${randNum}`,
    caseType: caseData.caseType || 'Criminal',
    classification: caseData.classification || 'Restricted',
    priority: caseData.priority || 'Medium',
    status: caseData.status || 'Active',
    stage: caseData.stage || 'Intake',
    district: caseData.district || 'Central District',
    policeStation: caseData.policeStation || 'Central PS',
    court: caseData.court || 'Sessions Court',
    jurisdiction: caseData.jurisdiction || 'NCT New Delhi',
    incidentDate: caseData.incidentDate || new Date().toISOString().split('T')[0],
    caseOpenedDate: caseData.caseOpenedDate || new Date().toISOString().split('T')[0],
    description: caseData.description || '',
    leadInvestigator: caseData.leadInvestigator || 'Inspector Rajesh Kumar',
    supervisingOfficer: caseData.supervisingOfficer || 'ACP Crime Branch',
    additionalTeam: caseData.additionalTeam || '',
    legalReviewer: caseData.legalReviewer || '',
    confidentiality: caseData.confidentiality || caseData.classification || 'Restricted',
    tags: caseData.tags || 'evidence, digital, FIR',
    lastActivity: caseData.lastActivity || 'Just now',
    nextDeadline: caseData.nextDeadline || '',
    evidenceCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedCases = [newCase, ...cases];
  saveCases(updatedCases);
  return newCase;
}

export function getCaseById(id: string): CaseItem | undefined {
  const cases = getCases();
  return cases.find((c) => c.id === id || c.firNumber === id);
}

export function updateCase(id: string, updatedData: Partial<CaseItem>): CaseItem | null {
  const cases = getCases();
  const index = cases.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const updatedCase: CaseItem = {
    ...cases[index],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  cases[index] = updatedCase;
  saveCases(cases);
  return updatedCase;
}

export function deleteCase(id: string): boolean {
  const cases = getCases();
  const filtered = cases.filter((c) => c.id !== id);
  if (filtered.length === cases.length) return false;
  saveCases(filtered);
  return true;
}

export function restoreCase(caseItem: CaseItem): boolean {
  const cases = getCases();
  if (cases.some((c) => c.id === caseItem.id)) return false;
  const updatedCases = [caseItem, ...cases];
  saveCases(updatedCases);
  return true;
}
