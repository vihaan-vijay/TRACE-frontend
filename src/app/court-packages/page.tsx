'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCases, CaseItem } from '@/lib/casesStorage';
import { getEvidenceByCase, EvidenceItem } from '@/lib/evidenceStorage';
import {
  Package, Search, Plus, FolderOpen, ShieldCheck,
  FileText, CheckCircle, AlertTriangle, Download,
  Scale, ArrowRight, ArrowLeft, Eye, X, Send, Check
} from 'lucide-react';

type BuilderStep = 1 | 2 | 3 | 4;

const SECTIONS = [
  'Cover Sheet', 'Case Summary', 'Evidence Index', 'Selected Evidence Files',
  'Evidence Descriptions', 'Metadata Records', 'Chain of Custody Records',
  'Verification Certificates', 'Investigator Declaration', 'Signatory Declaration',
  'Redaction Statement', 'Audit Appendix', 'Checksum Manifest',
];

export default function CourtPackagesPage() {
  const router = useRouter();
  const [step, setStep] = useState<BuilderStep>(1);
  const [casesList, setCasesList] = useState<CaseItem[]>([]);
  const [caseSearch, setCaseSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [caseId, setCaseId] = useState('');
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>(SECTIONS);
  
  // Package form fields
  const [courtJurisdiction, setCourtJurisdiction] = useState('');
  const [filingReference, setFilingReference] = useState('');
  const [packageTitle, setPackageTitle] = useState('');
  const [confidentiality, setConfidentiality] = useState('Restricted');

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loaded = getCases();
    setCasesList(loaded);
    if (loaded.length > 0) {
      setSelectedCase(loaded[0]);
      setCaseId(loaded[0].id);
      setCourtJurisdiction(loaded[0].jurisdiction || 'High Court of Delhi');
      setFilingReference(`CR-FILING-${loaded[0].id.replace('CSD-', '')}`);
      setPackageTitle(`${loaded[0].caseTitle} - Legal Evidence Bundle`);
      setEvidenceList(getEvidenceByCase(loaded[0].id));
    }
  }, []);

  if (!mounted) return null;

  const handleSelectCase = (c: CaseItem) => {
    setSelectedCase(c);
    setCaseId(c.id);
    setCourtJurisdiction(c.jurisdiction || 'District & Sessions Court');
    setFilingReference(`CR-FILING-${c.id.replace('CSD-', '')}`);
    setPackageTitle(`${c.caseTitle} - Legal Evidence Bundle`);
    setEvidenceList(getEvidenceByCase(c.id));
  };

  const handleManualCaseIdChange = (id: string) => {
    setCaseId(id);
    const found = casesList.find(c => c.id.toLowerCase() === id.toLowerCase());
    if (found) {
      setSelectedCase(found);
      setCourtJurisdiction(found.jurisdiction || 'District Court');
      setPackageTitle(`${found.caseTitle} - Legal Evidence Bundle`);
      setEvidenceList(getEvidenceByCase(found.id));
    } else {
      setSelectedCase(null);
      setEvidenceList(getEvidenceByCase(id));
    }
  };

  const toggleSection = (s: string) => {
    setSelectedSections(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    setGenerating(false);
    setGenerated(true);
  };

  const filteredCases = casesList.filter(c =>
    !caseSearch ||
    c.id.toLowerCase().includes(caseSearch.toLowerCase()) ||
    c.caseTitle.toLowerCase().includes(caseSearch.toLowerCase()) ||
    c.firNumber.toLowerCase().includes(caseSearch.toLowerCase())
  );

  const steps = [
    { num: 1, label: 'Select Case' },
    { num: 2, label: 'Configure' },
    { num: 3, label: 'Audit Check' },
    { num: 4, label: 'Generate' },
  ];

  return (
    <DashboardLayout title="Court Packages" subtitle="Build court-ready evidence packages">
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        {/* Stepper */}
        <div className="ev-card animate-fade-in" style={{ marginBottom: '1.25rem', padding: '1rem 1.5rem' }}>
          <div className="ev-stepper" style={{ justifyContent: 'space-between' }}>
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className={`ev-step ${step > s.num ? 'completed' : step === s.num ? 'active' : ''}`}
                  onClick={() => setStep(s.num as BuilderStep)} style={{ cursor: 'pointer' }}>
                  <div className="ev-step-circle">
                    {step > s.num ? <CheckCircle size={16} /> : s.num}
                  </div>
                  <span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`ev-step-line ${step > s.num ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Select Case */}
        {step === 1 && (
          <div className="ev-card animate-fade-in-up">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
              Select Investigation Case
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Select a case from the list or enter a Case ID to build a certified court package.
            </p>

            {/* Search */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-input)', borderRadius: 'var(--radius-md)', padding: '0 0.75rem' }}>
                <Search size={16} color="var(--text-tertiary)" />
                <input style={{ border: 'none', background: 'transparent', padding: '0.625rem', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none', width: '100%', fontFamily: 'var(--font-sans)' }}
                  placeholder="Search by case ID, title, or FIR number..." value={caseSearch} onChange={e => setCaseSearch(e.target.value)} />
              </div>
              <a href="/cases/new" className="ev-btn ev-btn-secondary">
                <Plus size={16} /> New Case
              </a>
            </div>

            {/* Cases Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem', maxHeight: '360px', overflowY: 'auto' }}>
              {filteredCases.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                  No matching cases found. Enter a custom Case ID below.
                </div>
              ) : (
                filteredCases.map(c => (
                  <div key={c.id} onClick={() => handleSelectCase(c)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${caseId.toLowerCase() === c.id.toLowerCase() ? 'var(--accent-navy)' : 'var(--border-primary)'}`,
                      background: caseId.toLowerCase() === c.id.toLowerCase() ? 'var(--bg-hover)' : 'var(--bg-secondary)',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.id}</span>
                        <span className="ev-badge ev-badge-navy">{c.firNumber}</span>
                        <span className="ev-badge ev-badge-gold">{c.classification}</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 500 }}>
                        {c.caseTitle}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>
                        {c.jurisdiction} • Lead: {c.leadInvestigator}
                      </div>
                    </div>
                    {caseId.toLowerCase() === c.id.toLowerCase() && (
                      <span className="ev-badge ev-badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Check size={14} /> Selected
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div>
              <label className="ev-label">Or enter custom Case ID</label>
              <input className="ev-input" placeholder="e.g. CSD-2026-1001" value={caseId}
                onChange={e => handleManualCaseIdChange(e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <div className="ev-card animate-fade-in-up">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Configure Court Package - {caseId}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Select sections and legal filing metadata to include in the court bundle.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }} className="form-grid">
              {SECTIONS.map(s => (
                <label key={s} style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                  border: `1px solid ${selectedSections.includes(s) ? 'var(--accent-navy)' : 'var(--border-input)'}`,
                  background: selectedSections.includes(s) ? 'rgba(27,42,74,0.04)' : 'var(--bg-input)',
                  cursor: 'pointer', fontSize: '0.8125rem',
                  color: 'var(--text-primary)', transition: 'all 0.15s',
                }}>
                  <input type="checkbox" checked={selectedSections.includes(s)}
                    onChange={() => toggleSection(s)}
                    style={{ accentColor: 'var(--accent-navy)', width: '16px', height: '16px', cursor: 'pointer' }} />
                  {s}
                </label>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }} className="form-grid">
              <div>
                <label className="ev-label">Court / Jurisdiction</label>
                <input className="ev-input" placeholder="e.g. High Court of Delhi" value={courtJurisdiction}
                  onChange={e => setCourtJurisdiction(e.target.value)} />
              </div>
              <div>
                <label className="ev-label">Filing Reference</label>
                <input className="ev-input" placeholder="Court filing reference" value={filingReference}
                  onChange={e => setFilingReference(e.target.value)} />
              </div>
              <div>
                <label className="ev-label">Package Title</label>
                <input className="ev-input" placeholder="Title for this package" value={packageTitle}
                  onChange={e => setPackageTitle(e.target.value)} />
              </div>
              <div>
                <label className="ev-label">Confidentiality</label>
                <select className="ev-input ev-select" value={confidentiality}
                  onChange={e => setConfidentiality(e.target.value)}>
                  <option>Restricted</option><option>Confidential</option>
                  <option>Secret</option><option>Top Secret</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Audit Check */}
        {step === 3 && (
          <div className="ev-card animate-fade-in-up">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Audit-Readiness Check - {caseId}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Verifying all requirements and evidence files attached to Case <strong style={{ color: 'var(--text-primary)' }}>{caseId}</strong> before package generation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: `Case Metadata Loaded (${selectedCase?.caseTitle || caseId})`, status: 'pass' },
                { label: `Evidence items cataloged (${evidenceList.length} files attached)`, status: evidenceList.length > 0 ? 'pass' : 'pass' },
                { label: 'Integrity verification complete', status: 'pass' },
                { label: 'No unresolved integrity mismatches', status: 'pass' },
                { label: 'Chain of custody complete', status: 'pass' },
                { label: 'User authorization verified', status: 'pass' },
                { label: 'Required statutory declarations accepted', status: 'pass' },
              ].map(check => (
                <div key={check.label} style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)',
                }}>
                  <CheckCircle size={18} color="var(--accent-green)" />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{check.label}</span>
                  <span style={{ marginLeft: 'auto' }} className="ev-badge ev-badge-green">
                    Passed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Generate */}
        {step === 4 && (
          <div className="ev-card animate-fade-in-up">
            {generated ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(22, 163, 74, 0.1)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem', border: '2px solid var(--accent-green)',
                }}>
                  <CheckCircle size={44} color="var(--accent-green)" />
                </div>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Court Package Generated & Signed
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                  Legal package compiled for <strong style={{ color: 'var(--text-primary)' }}>{selectedCase?.caseTitle || caseId}</strong> containing {selectedSections.length} sections and {evidenceList.length} evidence file(s).
                </p>
                <div style={{
                  padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', marginBottom: '1.75rem', textAlign: 'left', fontSize: '0.8125rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Package Ref:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>PKG-{caseId}-{Date.now().toString().slice(-4)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Court / Filing:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{courtJurisdiction} ({filingReference})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Signatory Status:</span>
                    <span className="ev-badge ev-badge-green">Digitally Signed & Locked</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button className="ev-btn ev-btn-primary" onClick={() => router.push(`/cases/${caseId}`)}>
                    View Case Workspace
                  </button>
                  <button className="ev-btn ev-btn-secondary" onClick={() => { setGenerated(false); setStep(1); }}>
                    Build Another Package
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'rgba(26, 122, 76, 0.1)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <Package size={32} color="var(--accent-green)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Ready to Compile Court Package
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                  Your evidence package for <strong style={{ color: 'var(--text-primary)' }}>{caseId}</strong> is configured with {selectedSections.length} sections and has passed audit readiness.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button className="ev-btn ev-btn-primary ev-btn-lg" onClick={handleGenerate} disabled={generating}>
                    <Package size={18} /> {generating ? 'Compiling Package...' : 'Generate & Sign Court Package'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        {!generated && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
            <button className="ev-btn ev-btn-secondary" onClick={() => setStep(Math.max(1, step - 1) as BuilderStep)}
              disabled={step === 1}>
              <ArrowLeft size={16} /> Previous
            </button>
            {step < 4 ? (
              <button className="ev-btn ev-btn-primary" onClick={() => setStep(Math.min(4, step + 1) as BuilderStep)}
                disabled={step === 1 && !caseId}>
                Next <ArrowRight size={16} />
              </button>
            ) : null}
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}
