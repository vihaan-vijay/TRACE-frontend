'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Users, Search, Filter, Plus, User, Mail, Phone,
  Building2, FolderOpen, ShieldCheck, Clock, CheckCircle2, Award
} from 'lucide-react';

const ROLES = ['All', 'Police', 'Forensic', 'Supervisor', 'Attorney'];
const STATUSES = ['All', 'Active', 'On Duty'];

interface Personnel {
  id: string;
  name: string;
  role: string;
  badgeNumber: string;
  department: string;
  email: string;
  phone: string;
  activeCases: number;
  status: 'Active' | 'On Duty';
  avatarColor: string;
}

const INITIAL_PERSONNEL: Personnel[] = [
  {
    id: 'p-1',
    name: 'Inspector Determination',
    role: 'Police',
    badgeNumber: 'POL-8842',
    department: 'Cyber Crime Cell, District HQ',
    email: 'inspector.det@police.gov.in',
    phone: '+91 98765 43210',
    activeCases: 4,
    status: 'Active',
    avatarColor: 'var(--accent-navy)',
  },
  {
    id: 'p-2',
    name: 'Dr. Neha Verma',
    role: 'Forensic',
    badgeNumber: 'FSL-2201',
    department: 'Digital Forensic Laboratory',
    email: 'n.verma@fsl.gov.in',
    phone: '+91 98123 76543',
    activeCases: 6,
    status: 'Active',
    avatarColor: 'var(--accent-green)',
  },
  {
    id: 'p-3',
    name: 'ACP Rajesh Kumar',
    role: 'Supervisor',
    badgeNumber: 'ACP-1004',
    department: 'Crime Branch Headquarters',
    email: 'acp.rajesh@police.gov.in',
    phone: '+91 99887 11223',
    activeCases: 8,
    status: 'Active',
    avatarColor: 'var(--accent-gold)',
  },
  {
    id: 'p-4',
    name: 'Dr. Vikram Rao',
    role: 'Forensic',
    badgeNumber: 'FSL-1994',
    department: 'Cyber Forensics Unit',
    email: 'v.rao@fsl.gov.in',
    phone: '+91 97112 33445',
    activeCases: 3,
    status: 'On Duty',
    avatarColor: 'var(--accent-navy)',
  },
  {
    id: 'p-5',
    name: 'Advocate Priya Sundaram',
    role: 'Attorney',
    badgeNumber: 'BAR-4491',
    department: 'Prosecution Directorate',
    email: 'priya.legal@prosecution.gov.in',
    phone: '+91 98334 55667',
    activeCases: 5,
    status: 'Active',
    avatarColor: 'var(--accent-blue)',
  },
];

export default function InvestigatorsPage() {
  const [personnelList, setPersonnelList] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const filteredPersonnel = personnelList.filter(p => {
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' || p.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <DashboardLayout title="Officer Roles" subtitle="Directory of registered officers and access permissions">
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
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
            }} placeholder="Search by name, badge ID, email, or department..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="ev-input ev-select" style={{ width: 'auto', minWidth: '140px' }}
            value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="ev-input ev-select" style={{ width: 'auto', minWidth: '140px' }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="ev-btn ev-btn-primary"><Plus size={16} /> Add Personnel</button>
        </div>

        {/* Personnel Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem',
        }}>
          {filteredPersonnel.length === 0 ? (
            <div className="ev-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
              <Users size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                No personnel found matching &quot;{searchQuery}&quot;
              </h3>
            </div>
          ) : (
            filteredPersonnel.map(p => (
              <div key={p.id} className="ev-card animate-fade-in-up" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: p.avatarColor, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem',
                  }}>
                    {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.2rem' }}>
                      <span className="ev-badge ev-badge-navy">{p.badgeNumber}</span>
                      <span className="ev-badge ev-badge-gold">{p.role}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', borderTop: '1px solid var(--border-primary)', paddingTop: '0.875rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Building2 size={14} color="var(--text-tertiary)" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.department}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Mail size={14} color="var(--text-tertiary)" />
                    <span>{p.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Phone size={14} color="var(--text-tertiary)" />
                    <span>{p.phone}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)', fontSize: '0.75rem',
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Active Cases: <strong style={{ color: 'var(--text-primary)' }}>{p.activeCases}</strong></span>
                  <span className="ev-badge ev-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={12} /> {p.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
