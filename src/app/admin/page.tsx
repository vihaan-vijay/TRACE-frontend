'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Settings, Users, Shield, Building2, FileText, Upload,
  Clock, Plus, Search, Edit, Trash2, UserPlus, Mail,
  Key, Database, Tag, Hash, ChevronDown, Save, Check
} from 'lucide-react';

type AdminSection = 'overview' | 'users' | 'policies' | 'config' | 'storage';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const sections: { key: AdminSection; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Settings size={18} /> },
    { key: 'users', label: 'User Management', icon: <Users size={18} /> },
    { key: 'policies', label: 'Policies', icon: <Shield size={18} /> },
    { key: 'config', label: 'Configuration', icon: <Hash size={18} /> },
    { key: 'storage', label: 'Storage', icon: <Database size={18} /> },
  ];

  return (
    <DashboardLayout title="Administration" subtitle="Organization management & system configuration">
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Admin info */}
        <div className="animate-fade-in" style={{
          padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)',
          background: 'rgba(200, 90, 36, 0.06)', border: '1px solid rgba(200, 90, 36, 0.15)',
          marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem',
        }}>
          <Shield size={18} color="var(--accent-orange)" />
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Administrative actions are logged and audited. Only authorized administrators can access this section.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.25rem' }} className="admin-grid">
          {/* Sidebar */}
          <div className="animate-fade-in">
            <div className="ev-card" style={{ padding: '0.5rem' }}>
              {sections.map(s => (
                <button key={s.key} onClick={() => setActiveSection(s.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                    border: 'none', cursor: 'pointer', width: '100%',
                    textAlign: 'left', fontSize: '0.875rem',
                    fontFamily: 'var(--font-sans)',
                    background: activeSection === s.key ? 'var(--bg-hover)' : 'transparent',
                    color: activeSection === s.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: activeSection === s.key ? 600 : 400,
                    transition: 'all 0.15s',
                  }}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="animate-fade-in-up" key={activeSection}>
            {activeSection === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem' }} className="stat-grid">
                {[
                  { label: 'Total Users', value: '0', icon: <Users size={20} />, color: 'navy' },
                  { label: 'Active Cases', value: '0', icon: <FileText size={20} />, color: 'green' },
                  { label: 'Evidence Files', value: '0', icon: <Upload size={20} />, color: 'orange' },
                  { label: 'Pending Reviews', value: '0', icon: <Clock size={20} />, color: 'gold' },
                  { label: 'Storage Used', value: '0 MB', icon: <Database size={20} />, color: 'blue' },
                  { label: 'Audit Events', value: '0', icon: <Shield size={20} />, color: 'maroon' },
                ].map(s => (
                  <div key={s.label} className={`ev-stat-card ${s.color}`}>
                    <div style={{ color: `var(--accent-${s.color})`, marginBottom: '0.5rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'users' && (
              <div className="ev-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>User Management</h3>
                  <button className="ev-btn ev-btn-primary ev-btn-sm"><UserPlus size={14} /> Invite User</button>
                </div>
                <div className="ev-empty" style={{ padding: '2.5rem' }}>
                  <Users size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Users will appear here once registered. Invite users with the button above.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'policies' && (
              <div className="ev-card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem',
                  paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>
                  Evidence & Retention Policies
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }} className="form-grid">
                    <div>
                      <label className="ev-label">Maximum File Size (MB)</label>
                      <input className="ev-input" type="number" defaultValue={100} />
                    </div>
                    <div>
                      <label className="ev-label">Evidence Retention (days)</label>
                      <input className="ev-input" type="number" defaultValue={3650} />
                    </div>
                    <div>
                      <label className="ev-label">Allowed File Types</label>
                      <input className="ev-input" defaultValue="jpg, png, pdf, mp4, mp3, docx, xlsx, zip" />
                    </div>
                    <div>
                      <label className="ev-label">Case Retention (days)</label>
                      <input className="ev-input" type="number" defaultValue={7300} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="ev-btn ev-btn-primary"><Save size={16} /> Save Policies</button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'config' && (
              <div className="ev-card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem',
                  paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>
                  ID Format Configuration
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }} className="form-grid">
                  <div>
                    <label className="ev-label">Case ID Format</label>
                    <input className="ev-input" defaultValue="CSD-{YEAR}-{SEQ}" />
                  </div>
                  <div>
                    <label className="ev-label">Evidence ID Format</label>
                    <input className="ev-input" defaultValue="EVD-{SEQ}" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="ev-label">Statutory Forensic File Naming Format</label>
                    <input className="ev-input" defaultValue="IN-[STATE]-[DISTRICT]-[PS_CODE]-[YEAR]-[FIR_OR_CASE_ID]-[DOC_TYPE]-[ITEM_SEQ]-[INTEGRITY_SALT].[EXT]" readOnly style={{ background: 'var(--bg-tertiary)', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem' }} />
                  </div>
                  <div>
                    <label className="ev-label">Report ID Format</label>
                    <input className="ev-input" defaultValue="RPT-{YEAR}-{SEQ}" />
                  </div>
                  <div>
                    <label className="ev-label">Package ID Format</label>
                    <input className="ev-input" defaultValue="PKG-{YEAR}-{SEQ}" />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button className="ev-btn ev-btn-primary"><Save size={16} /> Save Configuration</button>
                </div>
              </div>
            )}

            {activeSection === 'storage' && (
              <div className="ev-card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  Storage Overview
                </h3>
                <div style={{
                  padding: '1.25rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)', marginBottom: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Used</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>0 MB / Unlimited</span>
                  </div>
                  <div className="ev-progress">
                    <div className="ev-progress-bar" style={{ width: '0%' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }} className="stat-grid">
                  {[
                    { label: 'Evidence Files', value: '0 MB' },
                    { label: 'Reports', value: '0 MB' },
                    { label: 'Court Packages', value: '0 MB' },
                  ].map(s => (
                    <div key={s.label} style={{
                      padding: '0.75rem', borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .admin-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}
