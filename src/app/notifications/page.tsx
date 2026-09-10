'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Bell, Check, CheckCheck, FolderOpen, ShieldCheck,
  AlertTriangle, Clock, Users, Package, FileText,
  Settings, X, Eye, ChevronRight
} from 'lucide-react';

const TABS = ['All', 'Unread', 'Priority'];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <DashboardLayout title="Notifications" subtitle="Stay updated on important events">
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        {/* Tab bar */}
        <div className="animate-fade-in" style={{
          display: 'flex', gap: '0.5rem', marginBottom: '1.25rem',
          alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {TABS.map(tab => (
              <button key={tab}
                className={`ev-btn ${activeTab === tab ? 'ev-btn-primary' : 'ev-btn-secondary'} ev-btn-sm`}
                onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="ev-btn ev-btn-ghost ev-btn-sm">
              <CheckCheck size={16} /> Mark all read
            </button>
            <a href="/settings" className="ev-btn ev-btn-ghost ev-btn-sm">
              <Settings size={16} /> Preferences
            </a>
          </div>
        </div>

        {/* Empty state */}
        <div className="ev-card animate-fade-in-up">
          <div className="ev-empty" style={{ padding: '3rem' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Bell size={32} color="var(--text-tertiary)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No notifications
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
              You&apos;re all caught up! Notifications for case assignments, evidence verification, deadlines, and security alerts will appear here.
            </p>
          </div>
        </div>

        {/* Notification types reference */}
        <div className="ev-card animate-fade-in-up delay-200" style={{
          animationFillMode: 'forwards', opacity: 0, marginTop: '1.25rem',
        }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Notification Types
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }} className="form-grid">
            {[
              { icon: <FolderOpen size={16} />, label: 'Case assignments', color: 'var(--accent-navy)' },
              { icon: <ShieldCheck size={16} />, label: 'Verification updates', color: 'var(--accent-green)' },
              { icon: <AlertTriangle size={16} />, label: 'Integrity alerts', color: 'var(--accent-red)' },
              { icon: <Clock size={16} />, label: 'Deadline reminders', color: 'var(--accent-orange)' },
              { icon: <Package size={16} />, label: 'Court package status', color: 'var(--accent-maroon)' },
              { icon: <Users size={16} />, label: 'Access changes', color: 'var(--accent-gold)' },
            ].map(n => (
              <div key={n.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem', color: 'var(--text-secondary)',
              }}>
                <span style={{ color: n.color }}>{n.icon}</span>
                {n.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}
