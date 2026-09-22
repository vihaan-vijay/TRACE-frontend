'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCases, CaseItem } from '@/lib/casesStorage';
import {
  FileText, Plus, Download, Eye, Search, Filter,
  Calendar, FolderOpen, CheckCircle2, Clock, X
} from 'lucide-react';

const REPORT_TYPES = [
  'Case Summary Report', 'Evidence Inventory Manifest', 'Chain of Custody Log',
  'Integrity Verification Report', 'Investigator Workload Audit', 'Court Submission Bundle'
];

interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  caseId: string;
  generatedBy: string;
  date: string;
  confidentiality: string;
  status: 'Ready';
}

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportType, setReportType] = useState('Case Summary Report');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [casesList, setCasesList] = useState<CaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confidentiality, setConfidentiality] = useState('Restricted');
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: 'REP-2026-001',
      title: 'Case Summary - CSD-2026-0001',
      type: 'Case Summary Report',
      caseId: 'CSD-2026-0001',
      generatedBy: 'Inspector Determination',
      date: new Date().toLocaleDateString(),
      confidentiality: 'Restricted',
      status: 'Ready',
    },
  ]);

  useEffect(() => {
    setMounted(true);
    const loadedCases = getCases();
    setCasesList(loadedCases);
    if (loadedCases.length > 0) {
      setSelectedCaseId(loadedCases[0].id);
    }
  }, []);

  if (!mounted) return null;

  const handleGenerateReport = () => {
    if (!reportType) return;
    const newReport: GeneratedReport = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      title: `${reportType} - ${selectedCaseId || 'All Cases'}`,
      type: reportType,
      caseId: selectedCaseId || 'General',
      generatedBy: 'Inspector Determination',
      date: new Date().toLocaleDateString(),
      confidentiality: confidentiality,
      status: 'Ready',
    };
    setGeneratedReports(prev => [newReport, ...prev]);
    setShowGenerateModal(false);
  };

  const filteredReports = generatedReports.filter(r =>
    !searchQuery ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Reports" subtitle="Generate, download, and manage forensic reports">
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Actions */}
        <div className="animate-fade-in" style={{
          display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap',
        }}>
          <div style={{
            flex: '1 1 300px', display: 'flex', alignItems: 'center',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-input)',
            borderRadius: 'var(--radius-md)', padding: '0 0.75rem',
          }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input style={{
              border: 'none', background: 'transparent', padding: '0.625rem',
              fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none', width: '100%',
              fontFamily: 'var(--font-sans)',
            }} placeholder="Search generated reports by case ID or title..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="ev-btn ev-btn-primary" onClick={() => setShowGenerateModal(true)}>
            <Plus size={16} /> Generate New Report
          </button>
        </div>

        {/* Report type cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '0.875rem', marginBottom: '1.5rem',
        }}>
          {REPORT_TYPES.map((type, i) => (
            <div key={type} className="ev-card ev-card-interactive animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms`, opacity: 0, animationFillMode: 'forwards', cursor: 'pointer' }}
              onClick={() => { setReportType(type); setShowGenerateModal(true); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-navy)',
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {type}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Click to generate
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Generated reports list */}
        <div className="ev-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Generated Reports ({filteredReports.length})
            </h3>
          </div>
          {filteredReports.length === 0 ? (
            <div className="ev-empty" style={{ padding: '2.5rem' }}>
              <FileText size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                No reports found matching query
              </h4>
            </div>
          ) : (
            <table className="ev-table">
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>Case ID</th>
                  <th>Type</th>
                  <th>Generated By</th>
                  <th>Date</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{r.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>ID: {r.id}</div>
                    </td>
                    <td>
                      <span className="ev-badge ev-badge-navy">{r.caseId}</span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{r.type}</td>
                    <td style={{ fontSize: '0.8125rem' }}>{r.generatedBy}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{r.date}</td>
                    <td>
                      <span className="ev-badge ev-badge-gold">{r.confidentiality}</span>
                    </td>
                    <td>
                      <span className="ev-badge ev-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={12} /> {r.status}
                      </span>
                    </td>
                    <td>
                      <button className="ev-btn ev-btn-secondary ev-btn-sm" onClick={() => alert(`Downloading ${r.title}...`)}>
                        <Download size={14} /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Generate modal */}
        {showGenerateModal && (
          <div className="ev-modal-overlay" onClick={() => setShowGenerateModal(false)}>
            <div className="ev-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <div className="ev-modal-header" style={{ padding: '0.875rem 1.125rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Generate New Report
                </h3>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                  }}
                  title="Close"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="ev-modal-body" style={{ padding: '1rem 1.125rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Report Type</label>
                    <select className="ev-input ev-select" value={reportType}
                      onChange={e => setReportType(e.target.value)}
                      style={{ fontSize: '0.8125rem', padding: '0.5rem 0.625rem' }}>
                      {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Select Case</label>
                    <select className="ev-input ev-select" value={selectedCaseId}
                      onChange={e => setSelectedCaseId(e.target.value)}
                      style={{ fontSize: '0.8125rem', padding: '0.5rem 0.625rem' }}>
                      {casesList.map(c => (
                        <option key={c.id} value={c.id}>{c.id} - {c.caseTitle}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Confidentiality Level</label>
                    <select className="ev-input ev-select" value={confidentiality}
                      onChange={e => setConfidentiality(e.target.value)}
                      style={{ fontSize: '0.8125rem', padding: '0.5rem 0.625rem' }}>
                      <option>Restricted</option><option>Confidential</option>
                      <option>Secret</option><option>Top Secret</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="ev-modal-footer" style={{ padding: '0.75rem 1.125rem' }}>
                <button className="ev-btn ev-btn-secondary ev-btn-sm" onClick={() => setShowGenerateModal(false)}>Cancel</button>
                <button className="ev-btn ev-btn-primary ev-btn-sm" onClick={handleGenerateReport}>
                  <FileText size={15} /> Generate & Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
