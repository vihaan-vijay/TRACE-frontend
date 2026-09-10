'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCases, CaseItem, updateCase, deleteCase } from '@/lib/casesStorage';
import { getEvidenceByCase, EvidenceItem } from '@/lib/evidenceStorage';
import EvidenceIntakeWorkflow from '@/components/evidence/EvidenceIntakeWorkflow';
import {
  ArrowLeft, Edit, Upload, Users, FileText,
  ShieldCheck, CheckCircle2, Package, FolderOpen,
  Plus, Activity, MessageSquare, Image, Video, Music, Archive, File,
  Clock, Shield, Building2, Mail, Phone, Calendar, Download, Eye,
  MoreVertical, Trash2, Check, AlertTriangle, X
} from 'lucide-react';

type TabKey = 'overview' | 'evidence' | 'timeline' | 'people' | 'notes' | 'reports';

const fileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image size={20} color="var(--accent-green)" />;
  if (type.startsWith('video/')) return <Video size={20} color="var(--accent-blue)" />;
  if (type.startsWith('audio/')) return <Music size={20} color="var(--accent-orange)" />;
  if (type.includes('pdf')) return <FileText size={20} color="var(--accent-red)" />;
  if (type.includes('zip') || type.includes('rar')) return <Archive size={20} color="var(--accent-gold)" />;
  return <File size={20} color="var(--text-tertiary)" />;
};

const formatBytes = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

interface CaseNote {
  id: string;
  author: string;
  role: string;
  date: string;
  category: string;
  text: string;
}

export default function CaseWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [mounted, setMounted] = useState(false);

  const [currentCase, setCurrentCase] = useState<CaseItem | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [intakeMode, setIntakeMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<CaseItem>>({});
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (caseId) {
      const allCases = getCases();
      const found = allCases.find(c => c.id.toLowerCase() === caseId.toLowerCase());
      if (found) {
        setCurrentCase(found);
      } else {
        setCurrentCase({
          id: caseId,
          caseTitle: `Investigation Case ${caseId}`,
          firNumber: 'FIR-2026-CYB-0891',
          classification: 'Restricted',
          jurisdiction: 'Central Division Police Station',
          leadInvestigator: 'Inspector Determination',
          evidenceCount: 2,
          lastActivity: 'Active',
          nextDeadline: '2026-09-15',
          stage: 'Intake',
          status: 'Active',
          description: 'Official law enforcement investigation case file for digital forensic analysis and chain of custody tracking.',
        });
      }

      const caseEvidences = getEvidenceByCase(caseId);
      setEvidenceList(caseEvidences);

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('addEvidence') === 'true' || params.get('intake') === 'true') {
          setIntakeMode(true);
        }
      }
    }
  }, [caseId]);

  if (!mounted) return null;

  if (intakeMode) {
    return (
      <DashboardLayout title={`Evidence Intake - Case ${caseId}`} subtitle="Securely upload and catalog digital evidence for case file">
        <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
          <div className="animate-fade-in" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem',
            paddingBottom: '1rem', borderBottom: '1px solid var(--border-primary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => setIntakeMode(false)} className="ev-btn ev-btn-ghost ev-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <ArrowLeft size={16} /> Back to Case Form / Details
              </button>
              <span className="ev-badge ev-badge-navy" style={{ fontWeight: 700 }}>{caseId}</span>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {currentCase?.caseTitle}
              </h2>
            </div>
          </div>

          <EvidenceIntakeWorkflow
            caseId={caseId}
            onCancel={() => setIntakeMode(false)}
            onSuccess={() => {
              const updatedEvidences = getEvidenceByCase(caseId);
              setEvidenceList(updatedEvidences);
              const allCases = getCases();
              const found = allCases.find(c => c.id.toLowerCase() === caseId.toLowerCase());
              if (found) setCurrentCase(found);
              setIntakeMode(false);
              setActiveTab('evidence');
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  const handleOpenEdit = () => {
    if (!currentCase) return;
    setEditFormData({
      caseTitle: currentCase.caseTitle,
      firNumber: currentCase.firNumber,
      status: currentCase.status || 'Active',
      stage: currentCase.stage || 'Intake',
      priority: currentCase.priority || 'Medium',
      classification: currentCase.classification || 'Restricted',
      jurisdiction: currentCase.jurisdiction || '',
      leadInvestigator: currentCase.leadInvestigator || '',
      incidentDate: currentCase.incidentDate || '',
      description: currentCase.description || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCase) return;
    const updated = updateCase(currentCase.id, editFormData);
    if (updated) {
      setCurrentCase(updated);
      setShowEditModal(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!currentCase) return;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('evidentia_undo_case', JSON.stringify(currentCase));
      } catch (e) {
        console.error('Error storing undo case:', e);
      }
    }
    deleteCase(currentCase.id);
    router.push('/cases');
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <FolderOpen size={16} /> },
    { key: 'evidence', label: `Evidence (${evidenceList.length})`, icon: <ShieldCheck size={16} /> },
    { key: 'timeline', label: 'Timeline', icon: <Activity size={16} /> },
    { key: 'people', label: 'People', icon: <Users size={16} /> },
    { key: 'notes', label: 'Notes', icon: <MessageSquare size={16} /> },
    { key: 'reports', label: 'Reports', icon: <FileText size={16} /> },
  ];

  const stages = ['Intake', 'Verification', 'Review', 'Analysis', 'Production', 'Closed'];
  const currentStage = currentCase?.stage ? stages.indexOf(currentCase.stage) : 0;

  return (
    <DashboardLayout title={`Case ${caseId}`} subtitle={currentCase?.caseTitle || 'Case workspace'}>
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        {/* Header with back + actions */}
        <div className="animate-fade-in" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          marginBottom: '1rem', flexWrap: 'wrap',
          position: 'relative', zIndex: 100,
        }}>
          <button onClick={() => router.push('/cases')} className="ev-btn ev-btn-ghost ev-btn-icon">
            <ArrowLeft size={18} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <span className="ev-badge ev-badge-navy" style={{ fontWeight: 700 }}>{caseId}</span>
              {currentCase?.firNumber && <span className="ev-badge ev-badge-gold">{currentCase.firNumber}</span>}
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {currentCase?.caseTitle}
              </h2>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => setIntakeMode(true)} className="ev-btn ev-btn-primary ev-btn-sm">
              <Plus size={14} /> Add Evidence
            </button>
            <a href={`/court-packages?caseId=${caseId}`} className="ev-btn ev-btn-primary ev-btn-sm"><Package size={14} /> Court Package</a>
            
            {/* More Options Dropdown */}
            <div style={{ position: 'relative', zIndex: 101 }}>
              <button
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                className="ev-btn ev-btn-ghost ev-btn-icon"
                title="More Actions"
              >
                <MoreVertical size={16} />
              </button>
              {showActionsDropdown && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                    onClick={() => setShowActionsDropdown(false)}
                  />
                  <div className="ev-dropdown animate-fade-in-down" style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    minWidth: '160px', zIndex: 9999,
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.2)',
                    padding: '6px 0',
                  }}>
                    <button
                      className="ev-dropdown-item"
                      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.8125rem', color: '#172033', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => { setShowActionsDropdown(false); handleOpenEdit(); }}
                    >
                      <Edit size={14} color="#0645A5" /> Edit Case
                    </button>
                    <div style={{ height: '1px', background: '#D9E1EA', margin: '4px 0' }} />
                    <button
                      className="ev-dropdown-item"
                      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.8125rem', color: '#D93025', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => { setShowActionsDropdown(false); setShowDeleteModal(true); }}
                    >
                      <Trash2 size={14} color="#D93025" /> Delete Case
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Case progress stepper */}
        <div className="ev-card animate-fade-in-up" style={{ marginBottom: '1rem', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Investigation Stage Progress
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-navy)' }}>
              Current Stage: <span className="ev-badge ev-badge-navy">{currentCase?.stage || 'Intake'}</span>
            </div>
          </div>
          <div className="ev-stepper" style={{ justifyContent: 'space-between', flexWrap: 'nowrap', overflowX: 'auto' }}>
            {stages.map((stage, i) => {
              const isCompleted = i < (currentStage < 0 ? 0 : currentStage);
              const isActive = i === (currentStage < 0 ? 0 : currentStage);
              return (
                <React.Fragment key={stage}>
                  <div
                    className={`ev-step ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (!currentCase) return;
                      const newStatus = stage === 'Closed' ? 'Closed' : currentCase.status === 'Closed' ? 'Active' : currentCase.status;
                      const updated = updateCase(currentCase.id, { stage, status: newStatus });
                      if (updated) {
                        setCurrentCase(updated);
                      } else {
                        setCurrentCase(prev => prev ? { ...prev, stage, status: newStatus } : null);
                      }
                    }}
                    style={{ cursor: 'pointer', opacity: isCompleted || isActive ? 1 : 0.75 }}
                    title={`Click to set case stage to "${stage}"`}
                  >
                    <div className="ev-step-circle">
                      {isCompleted ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    <span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', fontWeight: isActive ? 700 : 500 }}>
                      {stage}
                    </span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className={`ev-step-line ${isCompleted ? 'completed' : ''}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="ev-tabs" style={{ marginBottom: '1.25rem' }}>
          {tabs.map(tab => (
            <button key={tab.key}
              className={`ev-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'overview' && <OverviewTab currentCase={currentCase} evidenceList={evidenceList} />}
          {activeTab === 'evidence' && <EvidenceTab caseId={caseId} evidenceList={evidenceList} onAddEvidenceClick={() => setIntakeMode(true)} />}
          {activeTab === 'timeline' && <TimelineTab caseId={caseId} />}
          {activeTab === 'people' && <PeopleTab currentCase={currentCase} />}
          {activeTab === 'notes' && <NotesTab caseId={caseId} />}
          {activeTab === 'reports' && <ReportsTab currentCase={currentCase} evidenceList={evidenceList} />}
        </div>

        {/* EDIT CASE MODAL */}
        {showEditModal && currentCase && (
          <div className="ev-modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="ev-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
              <div className="ev-modal-header" style={{ padding: '0.875rem 1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Edit Investigation Case
                  </h3>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                    Case ID: <strong>{currentCase.id}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', padding: '4px', display: 'flex',
                  }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div className="ev-modal-body" style={{ padding: '1rem 1.25rem', maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div>
                      <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Case Title *</label>
                      <input
                        className="ev-input"
                        type="text"
                        required
                        value={editFormData.caseTitle || ''}
                        onChange={e => setEditFormData({ ...editFormData, caseTitle: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>FIR / Reference Number</label>
                        <input
                          className="ev-input"
                          type="text"
                          value={editFormData.firNumber || ''}
                          onChange={e => setEditFormData({ ...editFormData, firNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Priority</label>
                        <select
                          className="ev-input ev-select"
                          value={editFormData.priority || 'Medium'}
                          onChange={e => setEditFormData({ ...editFormData, priority: e.target.value })}
                        >
                          <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Status</label>
                        <select
                          className="ev-input ev-select"
                          value={editFormData.status || 'Active'}
                          onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                        >
                          <option>Active</option><option>Under Review</option><option>Closed</option><option>Archived</option><option>Draft</option>
                        </select>
                      </div>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Investigation Stage</label>
                        <select
                          className="ev-input ev-select"
                          value={editFormData.stage || 'Intake'}
                          onChange={e => setEditFormData({ ...editFormData, stage: e.target.value })}
                        >
                          {stages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Jurisdiction / District</label>
                        <input
                          className="ev-input"
                          type="text"
                          value={editFormData.jurisdiction || ''}
                          onChange={e => setEditFormData({ ...editFormData, jurisdiction: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Lead Investigator</label>
                        <input
                          className="ev-input"
                          type="text"
                          value={editFormData.leadInvestigator || ''}
                          onChange={e => setEditFormData({ ...editFormData, leadInvestigator: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Case Description / Notes</label>
                      <textarea
                        className="ev-input"
                        rows={3}
                        value={editFormData.description || ''}
                        onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="ev-modal-footer" style={{ padding: '0.75rem 1.25rem' }}>
                  <button type="button" className="ev-btn ev-btn-secondary ev-btn-sm" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="ev-btn ev-btn-primary ev-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && currentCase && (
          <div className="ev-modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="ev-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <div className="ev-modal-header" style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #FEE2E2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={16} color="#D93025" />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#D93025', margin: 0 }}>
                    Delete Investigation Case
                  </h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', padding: '4px', display: 'flex',
                  }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="ev-modal-body" style={{ padding: '1rem 1.25rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                  Are you sure you want to permanently delete case <strong style={{ color: '#003B73' }}>{currentCase.id}</strong>?
                </p>
                <div style={{
                  marginTop: '0.75rem', padding: '0.75rem', borderRadius: '6px',
                  background: 'var(--bg-tertiary)', fontSize: '0.8125rem', color: 'var(--text-secondary)',
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentCase.caseTitle}</div>
                  <div style={{ marginTop: '2px', fontSize: '0.75rem' }}>FIR: {currentCase.firNumber} | Stage: {currentCase.stage}</div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#D93025', marginTop: '0.75rem', marginBottom: 0 }}>
                  ⚠️ This action cannot be undone and will remove the case and all its files from the active registry.
                </p>
              </div>

              <div className="ev-modal-footer" style={{ padding: '0.75rem 1.25rem' }}>
                <button className="ev-btn ev-btn-secondary ev-btn-sm" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button
                  className="ev-btn ev-btn-sm"
                  style={{ background: '#D93025', color: '#FFFFFF', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  onClick={handleConfirmDelete}
                >
                  <Trash2 size={14} /> Yes, Delete Case
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab({ currentCase, evidenceList }: { currentCase: CaseItem | null; evidenceList: EvidenceItem[] }) {
  const verifiedCount = evidenceList.filter(e => e.status === 'Verified').length;
  const pendingCount = evidenceList.filter(e => e.status === 'Pending').length;
  const mismatchedCount = evidenceList.filter(e => e.status === 'Mismatched').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }} className="detail-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Case details */}
        <div className="ev-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Case Information & Legal Attributes
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Case Title</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{currentCase?.caseTitle || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>FIR / Reference Number</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{currentCase?.firNumber || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Jurisdiction / Station</div>
              <div style={{ fontWeight: 500, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{currentCase?.jurisdiction || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Lead Investigator</div>
              <div style={{ fontWeight: 500, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{currentCase?.leadInvestigator || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Case Type</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{currentCase?.caseType || 'General Investigation'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Classification</div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className="ev-badge ev-badge-navy">{currentCase?.classification || 'Restricted'}</span>
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Investigation Status</div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`ev-badge ${currentCase?.status === 'Active' ? 'ev-badge-green' : 'ev-badge-gold'}`}>
                  {currentCase?.status || 'Active'}
                </span>
              </div>
            </div>
            {currentCase?.complainantName && (
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Complainant / Person who filed</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{currentCase.complainantName}</div>
              </div>
            )}
            {currentCase?.complainantNearby && (
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Nearby Location / PS Area</div>
                <div style={{ fontWeight: 500, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{currentCase.complainantNearby}</div>
              </div>
            )}
            {currentCase?.complainantRoles && currentCase.complainantRoles.length > 0 && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Person Role(s) in Case</div>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {currentCase.complainantRoles.map(role => (
                    <span key={role} className="ev-badge ev-badge-gold" style={{ fontSize: '0.75rem' }}>
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.375rem' }}>Detailed Description & Legal Summary</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {currentCase?.description || 'Official law enforcement case file opened for forensic evidence collection, digital integrity verification, and court bundle assembly.'}
            </div>
          </div>
        </div>

        {/* Evidence summary */}
        <div className="ev-card">
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Evidence Catalog Summary ({evidenceList.length} files)
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }} className="stat-grid">
            {[
              { label: 'Total Files', value: evidenceList.length, color: 'var(--accent-navy)' },
              { label: 'Verified', value: verifiedCount, color: 'var(--accent-green)' },
              { label: 'Pending', value: pendingCount, color: 'var(--accent-orange)' },
              { label: 'Mismatched', value: mismatchedCount, color: 'var(--accent-red)' },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: 'center', padding: '0.75rem',
                borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Evidence preview list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {evidenceList.map((item, idx) => (
              <div key={item.id ? `${item.id}-${idx}` : `ev-prev-${idx}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 0.875rem', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {fileIcon(item.fileType)}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{item.evidenceTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.fileName} • {formatBytes(item.fileSize)}</div>
                  </div>
                </div>
                <span className="ev-badge ev-badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={12} /> {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="ev-card">
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Case Metadata & Deadlines
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Stage:</span>
              <span className="ev-badge ev-badge-navy">{currentCase?.stage || 'Intake'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Last Activity:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentCase?.lastActivity || 'Just now'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Next Court Deadline:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentCase?.nextDeadline || '2026-09-15'}</span>
            </div>
          </div>
        </div>

        <div className="ev-card">
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Primary Investigators
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                {currentCase?.leadInvestigator ? currentCase.leadInvestigator[0] : 'I'}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentCase?.leadInvestigator || 'Inspector Determination'}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Lead Officer</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                NV
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Dr. Neha Verma</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Forensic Examiner</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── EVIDENCE TAB ─── */
function EvidenceTab({ caseId, evidenceList, onAddEvidenceClick }: { caseId: string; evidenceList: EvidenceItem[]; onAddEvidenceClick?: () => void }) {
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);

  return (
    <div className="ev-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Case Evidence Catalog ({evidenceList.length} items)
        </h3>
        <button onClick={onAddEvidenceClick} className="ev-btn ev-btn-primary ev-btn-sm">
          <Plus size={14} /> Add Evidence
        </button>
      </div>
      <table className="ev-table">
        <thead>
          <tr>
            <th>Evidence Title</th>
            <th>File Name & Size</th>
            <th>Source / Device</th>
            <th>Seizure Date</th>
            <th>Officer</th>
            <th>Level</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {evidenceList.map((item, idx) => (
            <tr key={item.id ? `${item.id}-${idx}` : `ev-tab-${idx}`}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setPreviewItem(item)}>
                  {fileIcon(item.fileType)}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0645A5', textDecoration: 'underline' }}>{item.evidenceTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.description || 'Digital Evidence File'}</div>
                  </div>
                </div>
              </td>
              <td>
                <div
                  style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0645A5', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setPreviewItem(item)}
                >
                  {item.fileName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{formatBytes(item.fileSize)}</div>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                <div>{item.source}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.collectionMethod}</div>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                {item.capturedDate ? new Date(item.capturedDate).toLocaleDateString() : 'Recent'}
              </td>
              <td style={{ fontSize: '0.8125rem' }}>{item.collectedBy}</td>
              <td>
                <span className="ev-badge ev-badge-navy">{item.confidentiality}</span>
              </td>
              <td>
                <span className="ev-badge ev-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }} onClick={() => setPreviewItem(item)}>
                  <CheckCircle2 size={12} /> {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* POPUP PREVIEW MODAL */}
      {previewItem && (
        <div className="ev-modal-overlay" onClick={() => setPreviewItem(null)} style={{ zIndex: 1000 }}>
          <div className="ev-modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', width: '92%' }}>
            <div className="ev-modal-header" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
                {fileIcon(previewItem.fileType)}
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {previewItem.evidenceTitle}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {previewItem.fileName} • {formatBytes(previewItem.fileSize)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                style={{
                  background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
                  width: '28px', height: '28px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-primary)', transition: 'all 0.15s ease',
                }}
                title="Close Preview"
              >
                <X size={16} />
              </button>
            </div>

            <div className="ev-modal-body" style={{ padding: '1.25rem', background: 'var(--bg-tertiary, #F8FAFC)', borderRadius: '0 0 8px 8px' }}>
              <div style={{
                padding: '1.25rem',
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Evidence Category:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{previewItem.evidenceType || 'Digital Document'}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Source Device:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{previewItem.source || 'Digital Intake'}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Seizure Timestamp:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{previewItem.capturedDate || 'Recent'}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Collected By:</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{previewItem.collectedBy || 'Officer'}</div>
                  </div>
                </div>

                {previewItem.description && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Description & Notes:</span>
                    <div style={{ color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                      {previewItem.description}
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem', background: 'rgba(22, 163, 74, 0.08)',
                  border: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: '6px',
                  fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <CheckCircle2 size={14} /> SHA-256 Checksum Verified
                  </div>
                  <span className="ev-badge ev-badge-green">Lock Record Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── TIMELINE TAB ─── */
function TimelineTab({ caseId }: { caseId: string }) {
  const events = [
    { title: 'Case Formally Registered', time: '10:00 AM', date: '2026-08-25', officer: 'Inspector Determination', category: 'Registration', desc: 'Case file opened and initial reference assigned.' },
    { title: 'Physical Evidence Seized & Cataloged', time: '02:30 PM', date: '2026-08-25', officer: 'Inspector Determination', category: 'Seizure', desc: 'Target devices and logs seized per lawful warrant.' },
    { title: 'Digital Forensic Image Created', time: '04:15 PM', date: '2026-08-26', officer: 'Dr. Neha Verma', category: 'Forensics', desc: 'Bit-stream image created with dual-checksum verification.' },
    { title: 'Integrity Verification Passed', time: '09:00 AM', date: '2026-08-27', officer: 'Dr. Vikram Rao', category: 'Verification', desc: 'All digital files verified against storage ledger with 100% integrity.' },
  ];

  return (
    <div className="ev-card">
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
        Chronological Investigation Timeline - {caseId}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid var(--border-primary)', paddingLeft: '1.25rem', marginLeft: '0.5rem' }}>
        {events.map((e, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '-1.7rem', top: '2px',
              width: '12px', height: '12px', borderRadius: '50%',
              background: 'var(--accent-navy)', border: '2px solid var(--bg-primary)',
            }} />
            <div style={{ background: 'var(--bg-secondary)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{e.title}</span>
                <span className="ev-badge ev-badge-navy">{e.category}</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>{e.desc}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', gap: '1rem' }}>
                <span>📅 {e.date} at {e.time}</span>
                <span>👮 {e.officer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PEOPLE TAB ─── */
function PeopleTab({ currentCase }: { currentCase: CaseItem | null }) {
  const team = [
    { name: currentCase?.leadInvestigator || 'Inspector Determination', role: 'Lead Investigator', dept: 'Cyber Crime Cell', badge: 'POL-8842' },
    { name: 'Dr. Neha Verma', role: 'Forensic Specialist', dept: 'Digital Forensic Laboratory', badge: 'FSL-2201' },
    { name: 'ACP Rajesh Kumar', role: 'Supervising Officer', dept: 'Crime Branch Headquarters', badge: 'ACP-1004' },
    { name: 'Advocate Priya Sundaram', role: 'Legal Counsel / Prosecutor', dept: 'Prosecution Directorate', badge: 'BAR-4491' },
  ];

  return (
    <div className="ev-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Assigned Case Investigation Team</h3>
        <button className="ev-btn ev-btn-primary ev-btn-sm"><Plus size={14} /> Assign Personnel</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {team.map((member, i) => (
          <div key={i} style={{
            padding: '1rem', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--accent-navy)', color: '#fff', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem'
              }}>
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{member.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{member.role}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{member.dept}</span>
              <span className="ev-badge ev-badge-navy">{member.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── NOTES TAB ─── */
function NotesTab({ caseId }: { caseId: string }) {
  const [notes, setNotes] = useState<CaseNote[]>([
    {
      id: 'n-1',
      author: 'Inspector Determination',
      role: 'Lead Investigator',
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      category: 'Seizure Protocol',
      text: 'Seizure conducted in compliance with statutory protocols. Devices sealed in anti-static tamper-evident bags.'
    },
    {
      id: 'n-2',
      author: 'Dr. Neha Verma',
      role: 'Forensic Examiner',
      date: new Date().toLocaleDateString(),
      category: 'Forensic Imaging',
      text: 'Forensic image verification completed. Zero checksum mismatches detected during secondary audit.'
    }
  ]);
  const [noteText, setNoteText] = useState('');

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote: CaseNote = {
      id: `n-${Date.now()}`,
      author: 'Inspector Determination',
      role: 'Lead Officer',
      date: new Date().toLocaleDateString(),
      category: 'General',
      text: noteText.trim()
    };
    setNotes([newNote, ...notes]);
    setNoteText('');
  };

  return (
    <div className="ev-card">
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
        Case Investigation Notes - {caseId}
      </h3>
      <div style={{ marginBottom: '1.25rem' }}>
        <textarea className="ev-input" rows={3} placeholder="Add a formal investigation note or chain update..."
          value={noteText} onChange={e => setNoteText(e.target.value)}
          style={{ resize: 'none', minHeight: '80px', marginBottom: '0.5rem' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button className="ev-btn ev-btn-primary ev-btn-sm" onClick={handleAddNote} disabled={!noteText.trim()}>
            <Plus size={14} /> Add Note
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notes.map(n => (
          <div key={n.id} style={{
            padding: '1rem', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{n.author} ({n.role})</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{n.date}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── REPORTS TAB ─── */
function ReportsTab({ currentCase, evidenceList }: { currentCase: CaseItem | null; evidenceList: EvidenceItem[] }) {
  const caseId = currentCase?.id || 'Case';
  const reports = [
    { title: `Case Summary Report - ${caseId}`, type: 'Summary', date: new Date().toLocaleDateString(), status: 'Ready' },
    { title: `Evidence Manifest (${evidenceList.length} items)`, type: 'Evidence Inventory', date: new Date().toLocaleDateString(), status: 'Ready' },
    { title: `Chain of Custody Certificate`, type: 'Custody Log', date: new Date().toLocaleDateString(), status: 'Ready' },
  ];

  return (
    <div className="ev-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Case Reports & Certificates</h3>
        <a href="/reports" className="ev-btn ev-btn-primary ev-btn-sm"><Plus size={14} /> Generate Custom Report</a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {reports.map((r, idx) => (
          <div key={idx} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={20} color="var(--accent-navy)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{r.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{r.type} • Generated {r.date}</div>
              </div>
            </div>
            <button className="ev-btn ev-btn-secondary ev-btn-sm" onClick={() => alert(`Downloading ${r.title}...`)}>
              <Download size={14} /> Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
