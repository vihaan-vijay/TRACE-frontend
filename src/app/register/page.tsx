'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Shield, Eye, EyeOff, Lock, Mail, User, BadgeCheck,
  Building2, ArrowLeft, Sun, Moon, ChevronRight, CheckCircle2
} from 'lucide-react';

const ROLES: { value: UserRole; label: string; desc: string }[] = [
  { value: 'POLICE', label: 'Police Officer', desc: 'Investigator / Inspector' },
  { value: 'FORENSIC', label: 'Forensic Analyst', desc: 'Digital forensics expert' },
  { value: 'JUDGE', label: 'Judicial Officer', desc: 'Magistrate / Judge' },
  { value: 'ADMIN', label: 'Administrator', desc: 'System administrator' },
];

export default function RegisterPage() {
  const { register, isAuthenticated, error, clearError } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '', email: '', badgeNumber: '',
    password: '', confirmPassword: '',
    role: '' as UserRole | '', department: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (isAuthenticated && success) router.replace('/dashboard');
  }, [isAuthenticated, success, router]);

  const passwordStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][strength];
  const strengthColor = ['', 'var(--accent-red)', 'var(--accent-orange)', 'var(--accent-gold)', 'var(--accent-green)', 'var(--accent-green)'][strength];

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    if (!form.role) {
      setLocalError('Please select a role');
      return;
    }
    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        badgeNumber: form.badgeNumber,
        password: form.password,
        role: form.role as UserRole,
        department: form.department,
      });
      setSuccess(true);
    } catch {
      // handled by context
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg-primary)',
        padding: '2rem',
      }}>
        <div className="animate-scale-in" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(26, 122, 76, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <CheckCircle2 size={36} color="var(--accent-green)" />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Registration Successful
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Your account has been created. Redirecting to dashboard...
          </p>
          <div style={{
            width: '32px', height: '32px',
            border: '2px solid var(--border-primary)',
            borderTopColor: 'var(--accent-green)',
            borderRadius: '50%', margin: '0 auto',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      </div>
    );
  }

  const displayError = localError || error;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '2rem',
    }}>
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem',
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-secondary)', zIndex: 10,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '480px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'var(--accent-navy)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.75rem',
          }}>
            <Shield size={26} color="#FFFFFF" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Create Your Account
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Register to access the secure evidence portal
          </p>
        </div>

        {/* Form card */}
        <div className="ev-card" style={{ padding: '1.5rem' }}>
          {displayError && (
            <div className="animate-fade-in-down" style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
              background: 'rgba(192, 57, 43, 0.08)', border: '1px solid rgba(192, 57, 43, 0.2)',
              color: 'var(--accent-red)', fontSize: '0.8125rem', marginBottom: '1rem',
            }}>
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {/* Full Name */}
            <div>
              <label className="ev-label">Full Name</label>
              <div className="ev-input-group">
                <User className="ev-input-icon" size={18} />
                <input className="ev-input" type="text" placeholder="Enter your full name"
                  value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="ev-label">Official Email</label>
              <div className="ev-input-group">
                <Mail className="ev-input-icon" size={18} />
                <input className="ev-input" type="email" placeholder="your.email@gov.in"
                  value={form.email} onChange={e => handleChange('email', e.target.value)} required />
              </div>
            </div>

            {/* Badge Number */}
            <div>
              <label className="ev-label">Badge / Employee ID</label>
              <div className="ev-input-group">
                <BadgeCheck className="ev-input-icon" size={18} />
                <input className="ev-input" type="text" placeholder="e.g. POL-1234"
                  value={form.badgeNumber} onChange={e => handleChange('badgeNumber', e.target.value)} required />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="ev-label">Department / Organization</label>
              <div className="ev-input-group">
                <Building2 className="ev-input-icon" size={18} />
                <input className="ev-input" type="text" placeholder="e.g. Central Crime Branch"
                  value={form.department} onChange={e => handleChange('department', e.target.value)} required />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="ev-label">Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => handleChange('role', r.value)}
                    style={{
                      padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${form.role === r.value ? 'var(--accent-navy)' : 'var(--border-input)'}`,
                      background: form.role === r.value ? 'rgba(27, 42, 74, 0.05)' : 'var(--bg-input)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s',
                    }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="ev-label">Password</label>
              <div className="ev-input-group" style={{ position: 'relative' }}>
                <Lock className="ev-input-icon" size={18} />
                <input className="ev-input" type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password" style={{ paddingRight: '2.75rem' }}
                  value={form.password} onChange={e => handleChange('password', e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex',
                }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: '0.375rem' }}>
                  <div style={{
                    display: 'flex', gap: '3px', marginBottom: '0.25rem',
                  }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: i <= strength ? strengthColor : 'var(--border-primary)',
                        transition: 'all 0.2s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: strengthColor, fontWeight: 500 }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="ev-label">Confirm Password</label>
              <div className="ev-input-group">
                <Lock className="ev-input-icon" size={18} />
                <input className="ev-input" type="password" placeholder="Confirm your password"
                  value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="ev-btn ev-btn-primary ev-btn-lg"
              disabled={submitting} style={{ width: '100%', marginTop: '0.375rem', height: '48px', fontWeight: 600 }}>
              {submitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.6s linear infinite',
                    display: 'inline-block' }} />
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <a href="/login" style={{
            color: 'var(--accent-navy)', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: '0.125rem',
          }}>
            <ArrowLeft size={14} /> Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
