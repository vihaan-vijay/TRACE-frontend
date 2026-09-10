/**
 * Evidence Storage Utility for Evidentia Frontend
 * Handles LocalStorage persistence of evidence items across cases.
 */

export interface EvidenceItem {
  id: string;
  name?: string;
  fileName: string;
  size?: number;
  fileSize: number;
  type?: string;
  fileType: string;
  progress?: number;
  status: 'uploading' | 'complete' | 'error' | 'Verified' | 'Pending' | 'Mismatched' | string;
  evidenceTitle: string;
  evidenceType: string;
  source: string;
  collectionMethod: string;
  capturedDate: string;
  collectedBy: string;
  description: string;
  confidentiality: string;
  tags: string;
  hash?: string;
  caseId: string;
  caseTitle?: string;
  verificationStatus?: 'Verified' | 'Pending' | 'Mismatched' | string;
  lastVerifiedDate?: string;
  uploadedAt?: string;
}

const STORAGE_KEY = 'evidentia_evidence';

/**
 * Generates statutory forensic file name format:
 * IN-[STATE]-[DISTRICT]-[PS_CODE]-[YEAR]-[FIR_OR_CASE_ID]-[DOC_TYPE]-[ITEM_SEQ]-[INTEGRITY_SALT].[EXT]
 */
export function formatForensicFileName({
  state = 'DL',
  district = 'CND',
  psCode = 'PS04',
  year = new Date().getFullYear().toString(),
  caseIdOrFir = 'CSD0001',
  docType = 'EVD',
  itemSeq = 1,
  originalFileName = 'evidence.bin',
  salt,
}: {
  state?: string;
  district?: string;
  psCode?: string;
  year?: string | number;
  caseIdOrFir?: string;
  docType?: string;
  itemSeq?: number | string;
  originalFileName?: string;
  salt?: string;
}): string {
  const ext = originalFileName.includes('.') ? originalFileName.split('.').pop() || 'bin' : 'bin';
  const cleanState = (state || 'DL').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const cleanDistrict = (district || 'CND').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const cleanPsCode = (psCode || 'PS04').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
  const cleanYear = String(year || new Date().getFullYear());
  const cleanCaseId = (caseIdOrFir || 'CSD0001').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const cleanDocType = (docType || 'EVD').toUpperCase();
  const cleanSeq = String(itemSeq).padStart(3, '0');
  const cleanSalt = (salt || Math.random().toString(16).slice(2, 6)).toUpperCase().slice(0, 4);

  return `IN-${cleanState}-${cleanDistrict}-${cleanPsCode}-${cleanYear}-${cleanCaseId}-${cleanDocType}-${cleanSeq}-${cleanSalt}.${ext}`;
}

const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-001',
    name: 'IN-DL-CND-PS04-2026-CSD0001-EVD-001-9F2A.mp4',
    fileName: 'IN-DL-CND-PS04-2026-CSD0001-EVD-001-9F2A.mp4',
    size: 45200000,
    fileSize: 45200000,
    type: 'video/mp4',
    fileType: 'video/mp4',
    progress: 100,
    status: 'Verified',
    evidenceTitle: 'Connaught Place CCTV Gate 3 Footage',
    evidenceType: 'video',
    source: 'CCTV HikVision DS-2CD2143G0',
    collectionMethod: 'Physical Memory Dump',
    capturedDate: '2024-08-15T18:30:00Z',
    collectedBy: 'Inspector Rajesh Kumar',
    description: 'Surveillance footage capturing suspect fleeing in silver sedan DL-3C-AB-1234.',
    confidentiality: 'Confidential',
    tags: 'cctv, robbery, video',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    caseId: 'CSD-2026-0001',
    caseTitle: 'Armed Robbery at Connaught Place Metro Gate 3',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-08-28T14:20:00Z',
    uploadedAt: '2024-08-15T20:00:00Z',
  },
  {
    id: 'EVD-002',
    name: 'IN-DL-CND-PS04-2026-CSD0001-EVD-002-8B1C.pdf',
    fileName: 'IN-DL-CND-PS04-2026-CSD0001-EVD-002-8B1C.pdf',
    size: 2450000,
    fileSize: 2450000,
    type: 'application/pdf',
    fileType: 'application/pdf',
    progress: 100,
    status: 'Verified',
    evidenceTitle: 'Official First Information Report (FIR)',
    evidenceType: 'document',
    source: 'Station House Officer Records',
    collectionMethod: 'Digital Filing System Export',
    capturedDate: '2024-08-15T21:00:00Z',
    collectedBy: 'Inspector Rajesh Kumar',
    description: 'Signed electronic copy of FIR 0891/2024 under Sections 304, 392, 34 BNS.',
    confidentiality: 'Restricted',
    tags: 'fir, pdf, official',
    hash: '8f4e2c1b9a8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f',
    caseId: 'CSD-2026-0001',
    caseTitle: 'Armed Robbery at Connaught Place Metro Gate 3',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-08-28T14:20:00Z',
    uploadedAt: '2024-08-15T21:15:00Z',
  },
  {
    id: 'EVD-003',
    name: 'IN-DL-CTD-PS02-2026-CSD0042-EVD-001-C74D.bin',
    fileName: 'IN-DL-CTD-PS02-2026-CSD0042-EVD-001-C74D.bin',
    size: 128000000,
    fileSize: 128000000,
    type: 'application/octet-stream',
    fileType: 'application/octet-stream',
    progress: 100,
    status: 'Verified',
    evidenceTitle: 'Phishing Endpoint Binary Image & Memory Dump',
    evidenceType: 'disk_image',
    source: 'Commercial Bank Endpoint Host-09',
    collectionMethod: 'FTK Imager Raw Disk Copy',
    capturedDate: '2024-08-20T10:00:00Z',
    collectedBy: 'Dr. Neha Verma (Cyber Analyst)',
    description: 'Bit-stream disk image containing reverse shell payload and C2 IP logs.',
    confidentiality: 'Top Secret',
    tags: 'malware, memory_dump, cyber',
    hash: '7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b',
    caseId: 'CSD-2026-0042',
    caseTitle: 'Classified Cross-Border Financial Cyber Espionage',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-08-28T10:00:00Z',
    uploadedAt: '2024-08-20T12:30:00Z',
  },
];

export function getAllEvidence(): EvidenceItem[] {
  if (typeof window === 'undefined') return INITIAL_EVIDENCE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVIDENCE));
      return INITIAL_EVIDENCE;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.map(normalizeEvidence)
      : INITIAL_EVIDENCE;
  } catch (err) {
    console.error('Error reading evidence from localStorage:', err);
    return INITIAL_EVIDENCE;
  }
}

function normalizeEvidence(item: Partial<EvidenceItem>): EvidenceItem {
  const fname = item.fileName || item.name || 'IN-DL-CND-PS01-2026-CSD0001-EVD-001-ABCD.bin';
  const fsize = item.fileSize ?? item.size ?? 0;
  const ftype = item.fileType || item.type || 'application/octet-stream';

  return {
    id: item.id || `EVD-${Math.floor(Math.random() * 900) + 100}`,
    name: fname,
    fileName: fname,
    size: fsize,
    fileSize: fsize,
    type: ftype,
    fileType: ftype,
    progress: item.progress ?? 100,
    status: item.status || 'Verified',
    evidenceTitle: item.evidenceTitle || 'Digital Evidence File',
    evidenceType: item.evidenceType || 'document',
    source: item.source || 'Investigation Unit',
    collectionMethod: item.collectionMethod || 'Digital Extraction',
    capturedDate: item.capturedDate || new Date().toISOString(),
    collectedBy: item.collectedBy || 'Investigating Officer',
    description: item.description || '',
    confidentiality: item.confidentiality || 'Restricted',
    tags: item.tags || 'evidence',
    hash: item.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    caseId: item.caseId || 'CSD-2026-0001',
    caseTitle: item.caseTitle || 'Investigation Case',
    verificationStatus: item.verificationStatus || 'Verified',
    lastVerifiedDate: item.lastVerifiedDate || new Date().toISOString(),
    uploadedAt: item.uploadedAt || new Date().toISOString(),
  };
}

export function saveAllEvidence(items: EvidenceItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const normalized = items.map(normalizeEvidence);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.error('Error saving evidence to localStorage:', err);
  }
}

export function addEvidenceItems(newItems: Partial<EvidenceItem>[]): void {
  const current = getAllEvidence();
  const normalizedNew = newItems.map(normalizeEvidence);
  const updated = [...normalizedNew, ...current];
  saveAllEvidence(updated);
}

export function getEvidenceByCase(caseId: string): EvidenceItem[] {
  const all = getAllEvidence();
  return all.filter((item) => item.caseId === caseId);
}

export function getEvidenceById(id: string): EvidenceItem | undefined {
  const all = getAllEvidence();
  return all.find((item) => item.id === id);
}
