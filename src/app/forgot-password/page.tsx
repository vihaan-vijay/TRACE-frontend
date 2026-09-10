'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Mail, ArrowLeft, Sun, Moon, CheckCircle2, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setSubmitting(false);
  };

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

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'var(--accent-navy)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.75rem',
          }}>
            <Shield size={26} color="#FFFFFF" strokeWidth={1.5} />
          </div>
        </div>

        <div className="ev-card" style={{ padding: '2rem' }}>
          {sent ? (
            <div className="animate-scale-in" style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(26, 122, 76, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <CheckCircle2 size={32} color="var(--accent-green)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Check Your Email
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                If an account with <strong style={{ color: 'var(--text-primary)' }}>{email}</strong> exists,
                you&apos;ll receive a password reset link shortly.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1.5rem' }}>
                The reset link will expire in 15 minutes and can only be used once.
              </p>
              <a href="/login" className="ev-btn ev-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <ArrowLeft size={16} /> Return to Sign In
              </a>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'rgba(200, 90, 36, 0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <KeyRound size={26} color="var(--accent-orange)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                  Reset Your Password
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Enter your registered email and we&apos;ll send you a secure reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="ev-label">Registered Email</label>
                  <div className="ev-input-group">
                    <Mail className="ev-input-icon" size={18} />
                    <input className="ev-input" type="email" placeholder="your.email@gov.in"
                      value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className="ev-btn ev-btn-primary ev-btn-lg"
                  disabled={submitting || !email.trim()}
                  style={{ width: '100%', height: '46px', fontWeight: 600 }}>
                  {submitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.6s linear infinite',
                        display: 'inline-block' }} />
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <a href="/login" style={{
            color: 'var(--accent-navy)', fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
          }}>
            <ArrowLeft size={14} /> Back to Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
