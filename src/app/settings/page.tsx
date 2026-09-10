'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  User, Mail, Badge, Building2, Shield, Key, Smartphone,
  Monitor, Globe, Clock, Bell, Lock, Eye, EyeOff,
  Save, LogOut, Sun, Moon, CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [mounted, setMounted] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const sections = [
    { key: 'profile', label: 'Profile', icon: <User size={18} /> },
    { key: 'security', label: 'Security', icon: <Shield size={18} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { key: 'preferences', label: 'Preferences', icon: <Globe size={18} /> },
    { key: 'sessions', label: 'Sessions', icon: <Monitor size={18} /> },
  ];

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.25rem' }} className="settings-grid">
          {/* Sidebar nav */}
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
            {activeSection === 'profile' && (
              <div className="ev-card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem',
                  paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>
                  Profile Information
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: 'var(--accent-maroon)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF',
                  }}>
                    {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.fullName}</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{user?.role} • {user?.department}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }} className="form-grid">
                  <div>
                    <label className="ev-label">Full Name</label>
                    <input className="ev-input" defaultValue={user?.fullName || ''} />
                  </div>
                  <div>
                    <label className="ev-label">Email</label>
                    <input className="ev-input" defaultValue={user?.email || ''} type="email" />
                  </div>
                  <div>
                    <label className="ev-label">Badge / Employee ID</label>
                    <input className="ev-input" defaultValue={user?.badgeNumber || ''} readOnly
                      style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label className="ev-label">Role</label>
                    <input className="ev-input" defaultValue={user?.role || ''} readOnly
                      style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label className="ev-label">Department</label>
                    <input className="ev-input" defaultValue={user?.department || ''} />
                  </div>
                  <div>
                    <label className="ev-label">Security Clearance</label>
                    <input className="ev-input" defaultValue={`Level ${user?.securityClearance || 1}`} readOnly
                      style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                  <button className="ev-btn ev-btn-primary"><Save size={16} /> Save Changes</button>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="ev-card">
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem',
                    paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>
                    Change Password
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '400px' }}>
                    <div>
                      <label className="ev-label">Current Password</label>
                      <div style={{ position: 'relative' }}>
                        <input className="ev-input" type={showCurrentPw ? 'text' : 'password'}
                          placeholder="Enter current password" style={{ paddingRight: '2.5rem' }} />
                        <button onClick={() => setShowCurrentPw(!showCurrentPw)} style={{
                          position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)',
                          display: 'flex',
                        }}>
                          {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="ev-label">New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input className="ev-input" type={showNewPw ? 'text' : 'password'}
                          placeholder="Enter new password" style={{ paddingRight: '2.5rem' }} />
                        <button onClick={() => setShowNewPw(!showNewPw)} style={{
                          position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)',
                          display: 'flex',
                        }}>
                          {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="ev-label">Confirm New Password</label>
                      <input className="ev-input" type="password" placeholder="Confirm new password" />
                    </div>
                    <button className="ev-btn ev-btn-primary" style={{ alignSelf: 'flex-start' }}>
                      <Key size={16} /> Update Password
                    </button>
                  </div>
                </div>

                <div className="ev-card">
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    Multi-Factor Authentication
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        Two-Factor Authentication
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="ev-switch" />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="ev-card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem',
                  paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>
                  Notification Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Case assignments', 'Evidence verification updates', 'Hash mismatch alerts',
                    'Deadline reminders', 'Court package status', 'Security alerts',
                    'Report generation', 'Access permission changes',
                  ].map(pref => (
                    <div key={pref} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.625rem 0', borderBottom: '1px solid var(--border-primary)',
                    }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{pref}</span>
                      <button className="ev-switch active" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div className="ev-card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem',
                  paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>
                  Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>Dark Mode</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Switch between light and dark theme</p>
                    </div>
                    <button className={`ev-switch ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme} />
                  </div>
                  <div>
                    <label className="ev-label">Time Zone</label>
                    <select className="ev-input ev-select" style={{ maxWidth: '300px' }}>
                      <option>Asia/Kolkata (IST, UTC+5:30)</option>
                      <option>UTC</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="ev-label">Date Format</label>
                    <select className="ev-input ev-select" style={{ maxWidth: '300px' }}>
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="ev-label">Language</label>
                    <select className="ev-input ev-select" style={{ maxWidth: '300px' }}>
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'sessions' && (
              <div className="ev-card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  Active Sessions
                </h3>
                <div style={{
                  padding: '1rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--accent-green)', background: 'rgba(26,122,76,0.04)',
                  display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem',
                }}>
                  <Monitor size={20} color="var(--accent-green)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Current Session</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>This device • Active now</div>
                  </div>
                  <span className="ev-badge ev-badge-green">Active</span>
                </div>
                <button className="ev-btn ev-btn-danger ev-btn-sm" onClick={logout}>
                  <LogOut size={16} /> Sign Out All Other Sessions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
