'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ScrollText, Search, Filter, Download, Shield, Eye, CheckCircle2, User, Activity, Clock
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'AUD-9021',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    user: 'Inspector Determination',
    action: 'Create',
    module: 'Cases',
    details: 'Registered new investigation case file',
    ipAddress: '10.240.12.89',
    riskLevel: 'Low',
  },
  {
    id: 'AUD-9020',
    timestamp: '09:21 AM',
    user: 'Inspector Determination',
    action: 'Upload',
    module: 'Evidence',
    details: 'Cataloged digital evidence files for Case CSD-2026-0001',
    ipAddress: '10.240.12.89',
    riskLevel: 'Low',
  },
  {
    id: 'AUD-9019',
    timestamp: '08:47 AM',
    user: 'Dr. Neha Verma',
    action: 'Verify',
    module: 'Verification',
    details: 'Verified digital genesis record for Forensic_Phone_Image.raw',
    ipAddress: '10.240.14.102',
    riskLevel: 'Low',
  },
  {
    id: 'AUD-9018',
    timestamp: '08:15 AM',
    user: 'ACP Rajesh Kumar',
    action: 'Export',
    module: 'Court Packages',
    details: 'Compiled legal court bundle PKG-CSD-2026-0001',
    ipAddress: '10.240.10.45',
    riskLevel: 'Medium',
  },
  {
    id: 'AUD-9017',
    timestamp: '07:55 AM',
    user: 'Inspector Determination',
    action: 'Login',
    module: 'Authentication',
    details: 'User authenticated via security badge credentials',
    ipAddress: '10.240.12.89',
    riskLevel: 'Low',
  },
];

const ACTION_TYPES = ['All', 'Login', 'Create', 'Upload', 'Verify', 'Export'];
const MODULES = ['All', 'Authentication', 'Cases', 'Evidence', 'Verification', 'Court Packages'];

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    return matchesSearch && matchesAction && matchesModule;
  });

  return (
    <DashboardLayout title="Audit Trail" subtitle="Immutable forensic activity & access history">
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Info banner */}
        <div className="animate-fade-in" style={{
          padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)',
          background: 'rgba(27, 42, 74, 0.06)', border: '1px solid rgba(27, 42, 74, 0.12)',
          marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem',
        }}>
          <Shield size={18} color="var(--accent-navy)" />
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Audit events are cryptographically chained and cannot be edited or deleted through the application.
          </span>
        </div>

        {/* Search & Filters */}
        <div style={{
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
            }} placeholder="Search by user, action, audit ID..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="ev-input ev-select" style={{ width: 'auto', minWidth: '140px' }}
            value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
            {ACTION_TYPES.map(a => <option key={a} value={a}>{a === 'All' ? 'All Actions' : a}</option>)}
          </select>
          <select className="ev-input ev-select" style={{ width: 'auto', minWidth: '140px' }}
            value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
            {MODULES.map(m => <option key={m} value={m}>{m === 'All' ? 'All Modules' : m}</option>)}
          </select>
          <button className="ev-btn ev-btn-secondary" onClick={() => alert('Exporting audit log...')}>
            <Download size={16} /> Export Audit Log
          </button>
        </div>

        {/* Audit table */}
        <div className="ev-card" style={{ padding: 0, overflow: 'hidden' }}>
          {filteredLogs.length === 0 ? (
            <div className="ev-empty" style={{ padding: '3rem' }}>
              <ScrollText size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                No audit events match your filter
              </h3>
            </div>
          ) : (
            <table className="ev-table">
              <thead>
                <tr>
                  <th>Time & Log ID</th>
                  <th>User / Officer</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Details</th>
                  <th>IP Address</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{log.timestamp}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{log.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{log.user}</div>
                    </td>
                    <td>
                      <span className="ev-badge ev-badge-navy">{log.action}</span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{log.module}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>{log.details}</td>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>{log.ipAddress}</td>
                    <td>
                      <span className={`ev-badge ${log.riskLevel === 'Low' ? 'ev-badge-green' : log.riskLevel === 'Medium' ? 'ev-badge-gold' : 'ev-badge-red'}`}>
                        {log.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
