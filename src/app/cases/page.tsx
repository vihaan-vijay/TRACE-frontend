'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCases, CaseItem, updateCase, deleteCase, restoreCase } from '@/lib/casesStorage';
import {
  Search, Filter, Plus, FolderOpen, ChevronDown,
  Calendar, MapPin, User, ArrowUpDown, X, MoreVertical,
  Eye, Edit, Archive, Download, Trash2, Check, AlertTriangle, RotateCcw
} from 'lucide-react';

const STATUSES = ['All', 'Active', 'Under Review', 'Closed', 'Archived', 'Draft'];
const STAGES = ['All', 'Intake', 'Verification', 'Review', 'Analysis', 'Production', 'Closed'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const CLASSIFICATIONS = ['Restricted', 'Confidential', 'Secret', 'Top Secret'];

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Actions dropdown & modals
  const [activeMenuCaseId, setActiveMenuCaseId] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<CaseItem | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<CaseItem>>({});
  const [deletingCase, setDeletingCase] = useState<CaseItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 5-Second Undo State
  const [undoCase, setUndoCase] = useState<CaseItem | null>(null);
  const [undoSecondsLeft, setUndoSecondsLeft] = useState<number>(5);

  useEffect(() => {
    setMounted(true);
    setCases(getCases());

    // Check if a case was recently deleted from the case details workspace
    if (typeof window !== 'undefined') {
      try {
        const storedUndo = sessionStorage.getItem('evidentia_undo_case');
        if (storedUndo) {
          const parsed = JSON.parse(storedUndo);
          sessionStorage.removeItem('evidentia_undo_case');
          setUndoCase(parsed);
          setUndoSecondsLeft(5);
        }
      } catch (e) {
        console.error('Error reading undo case:', e);
      }
    }
  }, []);

  // 5-second countdown timer for undo
  useEffect(() => {
    if (!undoCase) return;

    setUndoSecondsLeft(5);
    const interval = setInterval(() => {
      setUndoSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setUndoCase(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [undoCase]);

  // Close 3-dot dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuCaseId(null);
    };
    if (activeMenuCaseId) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [activeMenuCaseId]);

  // Auto-dismiss standard toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!mounted) return null;

  const filteredCases = cases.filter(c => {
    const matchSearch = !searchQuery ||
      c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchStage = stageFilter === 'All' || c.stage === stageFilter;
    return matchSearch && matchStatus && matchStage;
  });

  const handleOpenEdit = (c: CaseItem) => {
    setEditingCase(c);
    setEditFormData({
      caseTitle: c.caseTitle,
      firNumber: c.firNumber,
      status: c.status || 'Active',
      stage: c.stage || 'Intake',
      priority: c.priority || 'Medium',
      classification: c.classification || 'Restricted',
      jurisdiction: c.jurisdiction || '',
      leadInvestigator: c.leadInvestigator || '',
      incidentDate: c.incidentDate || '',
      description: c.description || '',
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;
    if (!editFormData.caseTitle?.trim()) {
      alert('Please enter a case title');
      return;
    }

    const updated = updateCase(editingCase.id, editFormData);
    if (updated) {
      setCases(getCases());
      setEditingCase(null);
      setToastMessage(`Case ${editingCase.id} updated successfully.`);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingCase) return;
    const caseToRestore = { ...deletingCase };
    const success = deleteCase(deletingCase.id);
    if (success) {
      setCases(getCases());
      setDeletingCase(null);
      setUndoCase(caseToRestore);
      setUndoSecondsLeft(5);
    }
  };

  const handleUndoDelete = () => {
    if (!undoCase) return;
    const success = restoreCase(undoCase);
    if (success) {
      setCases(getCases());
      const restoredId = undoCase.id;
      setUndoCase(null);
      setToastMessage(`Case ${restoredId} restored successfully.`);
    }
  };

  return (
    <DashboardLayout title="Cases" subtitle="Manage investigation cases">
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        {/* 5-Second Undo Banner */}
        {undoCase && (
          <div
            className="animate-fade-in-down"
            style={{
              position: 'fixed',
              bottom: '28px',
              right: '28px',
              zIndex: 1150,
              background: '#002B5C',
              color: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0, 43, 92, 0.4), 0 2px 6px rgba(0,0,0,0.15)',
              border: '1px solid rgba(255,255,255,0.15)',
              overflow: 'hidden',
              minWidth: '340px',
              maxWidth: '440px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              gap: '0.875rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'rgba(217, 48, 37, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Trash2 size={15} color="#FF6B6B" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>
                    Case deleted
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    {undoCase.id} - {undoCase.caseTitle}
                  </div>
                </div>
              </div>

              {/* Undo Action Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={handleUndoDelete}
                  style={{
                    background: '#FF9933',
                    color: '#002B5C',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Undo case deletion"
                >
                  <RotateCcw size={13} />
                  Undo ({undoSecondsLeft}s)
                </button>
                <button
                  onClick={() => setUndoCase(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                  }}
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Countdown Progress Bar */}
            <div style={{
              height: '3px',
              width: '100%',
              background: 'rgba(255,255,255,0.15)',
              position: 'relative',
            }}>
              <div style={{
                height: '100%',
                background: '#FF9933',
                width: `${(undoSecondsLeft / 5) * 100}%`,
                transition: 'width 1s linear',
              }} />
            </div>
          </div>
        )}

        {/* Standard Toast Notification */}
        {toastMessage && (
          <div className="animate-fade-in-down" style={{
            position: 'fixed',
            top: '140px',
            right: '24px',
            zIndex: 1100,
            background: '#002B5C',
            color: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0, 43, 92, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}>
            <Check size={16} color="#48BB78" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Action bar */}
        <div className="animate-fade-in" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          marginBottom: '1.25rem', flexWrap: 'wrap',
        }}>
          {/* Search */}
          <div style={{
            flex: '1 1 300px', display: 'flex', alignItems: 'center',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-input)',
            borderRadius: 'var(--radius-md)', padding: '0 0.75rem',
          }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input
              style={{
                border: 'none', background: 'transparent',
                padding: '0.625rem 0.625rem', fontSize: '0.875rem',
                color: 'var(--text-primary)', outline: 'none', width: '100%',
                fontFamily: 'var(--font-sans)',
              }}
              placeholder="Search by case ID, title, FIR number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-tertiary)', padding: '2px', display: 'flex',
              }}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ev-btn ev-btn-secondary"
            style={{
              borderColor: showFilters ? 'var(--accent-navy)' : undefined,
              color: showFilters ? 'var(--accent-navy)' : undefined,
            }}
          >
            <Filter size={16} />
            Filters
            {(statusFilter !== 'All' || stageFilter !== 'All') && (
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: 'var(--accent-orange)',
              }} />
            )}
          </button>

          {/* New Case button */}
          <a href="/cases/new" className="ev-btn ev-btn-primary">
            <Plus size={16} />
            New Case
          </a>
        </div>

        {/* Filter bar */}
        {showFilters && (
          <div className="animate-fade-in-down ev-card" style={{
            marginBottom: '1.25rem', padding: '1rem 1.25rem',
            display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end',
          }}>
            <div>
              <label className="ev-label">Status</label>
              <select className="ev-input ev-select" value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ minWidth: '150px' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="ev-label">Stage</label>
              <select className="ev-input ev-select" value={stageFilter}
                onChange={e => setStageFilter(e.target.value)}
                style={{ minWidth: '150px' }}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="ev-btn ev-btn-ghost ev-btn-sm"
              onClick={() => { setStatusFilter('All'); setStageFilter('All'); }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Empty state or case list */}
        {filteredCases.length === 0 ? (
          <div className="ev-card animate-fade-in-up" style={{ padding: '3rem' }}>
            <div className="ev-empty">
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <FolderOpen size={32} color="var(--text-tertiary)" />
              </div>
              <h3 style={{
                fontSize: '1.125rem', fontWeight: 600,
                color: 'var(--text-primary)', marginBottom: '0.5rem',
              }}>
                No cases found
              </h3>
              <p style={{
                fontSize: '0.875rem', color: 'var(--text-secondary)',
                marginBottom: '1.5rem', maxWidth: '360px', lineHeight: 1.6,
              }}>
                {searchQuery || statusFilter !== 'All' || stageFilter !== 'All'
                  ? 'No cases match your current search or filter criteria. Try adjusting your filters.'
                  : 'Get started by creating your first investigation case. All cases will appear here.'}
              </p>
              <a href="/cases/new" className="ev-btn ev-btn-primary">
                <Plus size={16} /> Create First Case
              </a>
            </div>
          </div>
        ) : (
          <div className="ev-card" style={{ padding: 0, overflow: 'visible' }}>
            <table className="ev-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>FIR / Ref</th>
                  <th>Jurisdiction</th>
                  <th>Lead</th>
                  <th>Evidence</th>
                  <th>Stage</th>
                  <th>Status</th>
                  <th style={{ width: '60px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map(c => (
                  <tr key={c.id} onClick={() => router.push(`/cases/${c.id}`)} style={{ cursor: 'pointer' }}>
                    <td><span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{c.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{c.caseTitle}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.firNumber}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.jurisdiction}</td>
                    <td>{c.leadInvestigator}</td>
                    <td style={{ textAlign: 'center' }}>{c.evidenceCount}</td>
                    <td><span className="ev-badge ev-badge-navy">{c.stage}</span></td>
                    <td>
                      <span className={`ev-badge ${c.status === 'Active' ? 'ev-badge-green' :
                        c.status === 'Closed' ? 'ev-badge-red' : 'ev-badge-gold'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()} style={{ position: 'relative', textAlign: 'center' }}>
                      <button
                        className="ev-btn ev-btn-ghost ev-btn-icon"
                        title="Case Actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuCaseId(activeMenuCaseId === c.id ? null : c.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* 3-Dot Actions Dropdown */}
                      {activeMenuCaseId === c.id && (
                        <>
                          <div
                            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                            onClick={(e) => { e.stopPropagation(); setActiveMenuCaseId(null); }}
                          />
                          <div className="ev-dropdown animate-fade-in-down" style={{
                            position: 'absolute', top: 'calc(100% - 4px)', right: '8px',
                            minWidth: '150px', zIndex: 9999,
                            background: '#FFFFFF',
                            border: '1px solid #D9E1EA',
                            borderRadius: '6px',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                            padding: '4px 0',
                            textAlign: 'left',
                          }}>
                          <button
                            className="ev-dropdown-item"
                            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.8125rem', color: '#172033', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => { setActiveMenuCaseId(null); router.push(`/cases/${c.id}`); }}
                          >
                            <Eye size={14} color="#003B73" /> Open Details
                          </button>
                          <button
                            className="ev-dropdown-item"
                            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.8125rem', color: '#172033', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => { setActiveMenuCaseId(null); handleOpenEdit(c); }}
                          >
                            <Edit size={14} color="#0645A5" /> Edit Case
                          </button>
                          <div style={{ height: '1px', background: '#D9E1EA', margin: '4px 0' }} />
                          <button
                            className="ev-dropdown-item"
                            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.8125rem', color: '#D93025', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => { setActiveMenuCaseId(null); setDeletingCase(c); }}
                          >
                            <Trash2 size={14} color="#D93025" /> Delete Case
                          </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EDIT CASE MODAL */}
        {editingCase && (
          <div className="ev-modal-overlay" onClick={() => setEditingCase(null)}>
            <div className="ev-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
              <div className="ev-modal-header" style={{ padding: '0.875rem 1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Edit Investigation Case
                  </h3>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                    Case ID: <strong>{editingCase.id}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setEditingCase(null)}
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
                    {/* Title */}
                    <div>
                      <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Case Title *</label>
                      <input
                        className="ev-input"
                        type="text"
                        required
                        value={editFormData.caseTitle || ''}
                        onChange={e => setEditFormData({ ...editFormData, caseTitle: e.target.value })}
                        placeholder="e.g. Armed Robbery at Metro Station"
                      />
                    </div>

                    {/* FIR + Priority */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>FIR / Reference Number</label>
                        <input
                          className="ev-input"
                          type="text"
                          value={editFormData.firNumber || ''}
                          onChange={e => setEditFormData({ ...editFormData, firNumber: e.target.value })}
                          placeholder="FIR-2026-..."
                        />
                      </div>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Priority</label>
                        <select
                          className="ev-input ev-select"
                          value={editFormData.priority || 'Medium'}
                          onChange={e => setEditFormData({ ...editFormData, priority: e.target.value })}
                        >
                          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Status + Stage */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Status</label>
                        <select
                          className="ev-input ev-select"
                          value={editFormData.status || 'Active'}
                          onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                        >
                          {STATUSES.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Investigation Stage</label>
                        <select
                          className="ev-input ev-select"
                          value={editFormData.stage || 'Intake'}
                          onChange={e => setEditFormData({ ...editFormData, stage: e.target.value })}
                        >
                          {STAGES.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Jurisdiction + Lead Investigator */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Jurisdiction / District</label>
                        <input
                          className="ev-input"
                          type="text"
                          value={editFormData.jurisdiction || ''}
                          onChange={e => setEditFormData({ ...editFormData, jurisdiction: e.target.value })}
                          placeholder="Central District, New Delhi"
                        />
                      </div>
                      <div>
                        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Lead Investigator</label>
                        <input
                          className="ev-input"
                          type="text"
                          value={editFormData.leadInvestigator || ''}
                          onChange={e => setEditFormData({ ...editFormData, leadInvestigator: e.target.value })}
                          placeholder="Inspector Name"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Case Description / Notes</label>
                      <textarea
                        className="ev-input"
                        rows={3}
                        value={editFormData.description || ''}
                        onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                        placeholder="Brief summary of incident, FIR details, or investigation parameters..."
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="ev-modal-footer" style={{ padding: '0.75rem 1.25rem' }}>
                  <button type="button" className="ev-btn ev-btn-secondary ev-btn-sm" onClick={() => setEditingCase(null)}>
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
        {deletingCase && (
          <div className="ev-modal-overlay" onClick={() => setDeletingCase(null)}>
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
                  onClick={() => setDeletingCase(null)}
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
                  Are you sure you want to permanently delete case <strong style={{ color: '#003B73' }}>{deletingCase.id}</strong>?
                </p>
                <div style={{
                  marginTop: '0.75rem', padding: '0.75rem', borderRadius: '6px',
                  background: 'var(--bg-tertiary)', fontSize: '0.8125rem', color: 'var(--text-secondary)',
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{deletingCase.caseTitle}</div>
                  <div style={{ marginTop: '2px', fontSize: '0.75rem' }}>FIR: {deletingCase.firNumber} | Stage: {deletingCase.stage}</div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#D93025', marginTop: '0.75rem', marginBottom: 0 }}>
                  ⚠️ This action cannot be undone and will remove the case from your active registry.
                </p>
              </div>

              <div className="ev-modal-footer" style={{ padding: '0.75rem 1.25rem' }}>
                <button className="ev-btn ev-btn-secondary ev-btn-sm" onClick={() => setDeletingCase(null)}>
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
