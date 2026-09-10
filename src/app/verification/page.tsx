'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getAllEvidence, saveAllEvidence, EvidenceItem } from '@/lib/evidenceStorage';
import {
  ShieldCheck, Search, Filter, CheckCircle, XCircle,
  AlertTriangle, Clock, Eye, Check, FileText, Image, Video, Music, Archive, File
} from 'lucide-react';

const STATUSES = ['All', 'Verified', 'Pending', 'Mismatched'];

const fileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image size={18} color="var(--accent-green)" />;
  if (type.startsWith('video/')) return <Video size={18} color="var(--accent-blue)" />;
  if (type.startsWith('audio/')) return <Music size={18} color="var(--accent-orange)" />;
  if (type.includes('pdf')) return <FileText size={18} color="var(--accent-red)" />;
  if (type.includes('zip') || type.includes('rar')) return <Archive size={18} color="var(--accent-gold)" />;
  return <File size={18} color="var(--text-tertiary)" />;
};

const formatBytes = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function VerificationPage() {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const items = getAllEvidence();
    setEvidenceItems(items);
  }, []);

  if (!mounted) return null;

  const handleVerify = (id: string) => {
    const updated = evidenceItems.map(item =>
      item.id === id ? { ...item, status: 'Verified' as const } : item
    );
    setEvidenceItems(updated);
    saveAllEvidence(updated);
  };

  const filteredItems = evidenceItems.filter(item => {
    const matchesSearch = !searchQuery ||
      item.evidenceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caseId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const verifiedCount = evidenceItems.filter(e => e.status === 'Verified').length;
  const pendingCount = evidenceItems.filter(e => e.status === 'Pending').length;
  const mismatchedCount = evidenceItems.filter(e => e.status === 'Mismatched').length;

  return (
    <DashboardLayout title="Verification Queue" subtitle="Review and verify evidence integrity">
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem', marginBottom: '1.25rem',
        }}>
          {[
            { label: 'Total In Queue', value: evidenceItems.length, icon: <ShieldCheck size={20} />, color: 'navy' },
            { label: 'Verified', value: verifiedCount, icon: <CheckCircle size={20} />, color: 'green' },
            { label: 'Pending Verification', value: pendingCount, icon: <Clock size={20} />, color: 'orange' },
            { label: 'Integrity Mismatches', value: mismatchedCount, icon: <XCircle size={20} />, color: 'red' },
          ].map((s, i) => (
            <div key={s.label} className={`ev-stat-card ${s.color} animate-fade-in-up`}
              style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}>
              <div style={{ color: `var(--accent-${s.color})`, marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
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
            }} placeholder="Search by Case ID, evidence title, or filename..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="ev-input ev-select" style={{ width: 'auto', minWidth: '160px' }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Queue Table */}
        {filteredItems.length === 0 ? (
          <div className="ev-card animate-fade-in-up">
            <div className="ev-empty" style={{ padding: '3rem' }}>
              <ShieldCheck size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                No evidence items match your filter
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
                Upload evidence through the Evidence Intake section to populate this verification queue.
              </p>
            </div>
          </div>
        ) : (
          <div className="ev-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="ev-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Evidence Item</th>
                  <th>File Details</th>
                  <th>Source Device</th>
                  <th>Seizure Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => (
                  <tr key={item.id ? `${item.id}-${idx}` : `ev-${idx}`}>
                    <td>
                      <a href={`/cases/${item.caseId}`} className="ev-badge ev-badge-navy" style={{ fontWeight: 700 }}>
                        {item.caseId}
                      </a>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {fileIcon(item.fileType)}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.evidenceTitle}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.description || 'Digital File'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '0.8125rem' }}>{item.fileName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{formatBytes(item.fileSize)}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{item.source}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      {item.capturedDate ? new Date(item.capturedDate).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>
                      <span className={`ev-badge ${item.status === 'Verified' ? 'ev-badge-green' : item.status === 'Pending' ? 'ev-badge-gold' : 'ev-badge-red'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        {item.status === 'Verified' && <CheckCircle size={12} />}
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status !== 'Verified' ? (
                        <button className="ev-btn ev-btn-primary ev-btn-sm" onClick={() => handleVerify(item.id)}>
                          <Check size={14} /> Verify Integrity
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                          Verified & Sealed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
