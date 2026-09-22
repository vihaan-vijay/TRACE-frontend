'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield, Eye, EyeOff, Lock, User, ArrowRight,
  Fingerprint, Scale, Link2
} from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, error, clearError, isLoading } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('determination');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authStage, setAuthStage] = useState(0);
  const [authMessage, setAuthMessage] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (isAuthenticated && !submitting) {
      setIsLeaving(true);
      const timer = setTimeout(() => {
        router.replace('/dashboard');
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, submitting, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;
    
    setSubmitting(true);
    setAuthStage(1);
    setAuthMessage('Verifying Officer Credentials...');

    setTimeout(() => {
      setAuthStage(2);
      setAuthMessage('Establishing Encrypted Session (Section 65B Certified)...');
    }, 380);

    setTimeout(async () => {
      setAuthStage(3);
      setAuthMessage('Access Granted • Opening IDEU Portal...');
      try {
        await login(identifier.trim(), password);
        setIsLeaving(true);
        setTimeout(() => {
          router.replace('/dashboard');
        }, 250);
      } catch {
        setSubmitting(false);
        setAuthStage(0);
      }
    }, 780);
  };

  if (!mounted) return null;

  return (
    <div className={isLeaving ? 'ev-page-exit' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F7F9FC', transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}>

      {/* Government Utility Bar (ONLY Government of India branding on login page) */}
      <div style={{
        background: '#002B5C',
        color: '#FFFFFF',
        fontSize: '0.8125rem',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        height: '38px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src="/img/india.jpeg"
            alt="India Flag"
            style={{ height: '16px', width: 'auto', borderRadius: '2px', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span style={{ fontWeight: 600, fontSize: '0.8125rem', letterSpacing: '0.01em' }}>भारत सरकार</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 2px' }}>|</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Government of India</span>
        </div>
      </div>

      {/* Government Header */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #D9E1EA',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
      }}>
        <img
          src="/img/Emblem.png"
          alt="Indian Emblem"
          style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#003B73', lineHeight: 1.15, letterSpacing: '0.03em' }}>
            TRACE
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#003B73', marginTop: '1px' }}>
            Trusted Record & Chain of Evidence
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#4B5563', marginTop: '1px' }}>
            Digital Evidence Management Platform
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <img
            src="/img/Digital_india.png"
            alt="Digital India"
            style={{ height: '36px', width: 'auto' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
      }}>

        {/* LEFT HERO PANEL (Deep Blue Gradient with Animated Pulsing Waves matching reference image) */}
        <div className="login-hero" style={{
          flex: '1 1 55%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 30%, #003B73 0%, #002B5C 65%, #001D3D 100%)',
        }}>


          {/* Hero Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px', textAlign: 'center' }}>
            {/* Center Logo Image (No Outer Circle) */}
            <div style={{
              margin: '0 auto 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src="/img/logo.png"
                alt="Evidentia Logo"
                style={{
                  height: '107px',
                  width: '107px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.45))',
                }}
              />
            </div>

            {/* Bilingual Motto */}
            <h1 style={{
              fontSize: '1.625rem', fontWeight: 700,
              color: '#FFFFFF', marginBottom: '0.375rem',
              lineHeight: 1.2,
              letterSpacing: '0.01em',
            }}>
              Secure Investigation, Trusted Evidence
            </h1>
            <p style={{ fontSize: '1rem', color: '#FFFFFF', opacity: 0.9, marginBottom: '0.75rem', fontWeight: 500 }}>
              सुरक्षित जाँच, विश्वसनीय प्रमाण
            </p>

            {/* Continuous Smooth Tricolour Line */}
            <div style={{
              width: '60px',
              height: '4px',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, #FF7700 0%, #FF9933 35%, #FFFFFF 48%, #FFFFFF 52%, #169447 65%, #138808 100%)',
              margin: '0.5rem auto 1.5rem',
            }} />

            {/* Government Official Motto Section */}
            <div style={{
              marginTop: '3.5rem',
              padding: '0.5rem 0',
              textAlign: 'center',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                color: '#FFFFFF',
                alignItems: 'center',
              }}>
                {/* First 2 phrases straight on one line */}
                <div style={{
                  fontSize: '0.8125rem',
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                  <span>
                    <span style={{ color: '#FF7700', fontWeight: 700 }}>PRESERVING</span> EVERY TRUTH
                  </span>
                  <span style={{ opacity: 0.4 }}>•</span>
                  <span>PROTECTING <span style={{ color: '#337effff', fontWeight: 700 }}>EVERY</span> CASE</span>
                </div>

                {/* Subtle Divider Line */}
                <div style={{
                  width: '36px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                  margin: '0.125rem 0',
                }} />

                {/* Last phrase below in the middle */}
                <div style={{
                  fontSize: '0.8125rem',
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                }}>
                  STRENGTHENING <span style={{ color: '#2ad06aff', fontWeight: 700 }}>JUSTICE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div style={{
          flex: '1 1 45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          background: '#F7F9FC',
        }}>
          <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '380px' }}>
            {/* Mobile logo */}
            <div className="mobile-logo" style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'none' }}>
              <img
                src="/img/logo.png"
                alt="Logo"
                style={{
                  height: '80px',
                  width: '80px',
                  objectFit: 'contain',
                  margin: '0 auto 0.75rem',
                  filter: 'drop-shadow(0 4px 12px rgba(0, 59, 115, 0.25))'
                }}
              />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#003B73' }}>IDEU Portal</h2>
            </div>

            <h2 style={{
              fontSize: '1.375rem', fontWeight: 700,
              color: '#003B73', marginBottom: '0.25rem',
            }}>
              Secure Login
            </h2>
            <p style={{
              fontSize: '0.8125rem', color: '#4B5563',
              marginBottom: '1.5rem',
            }}>
              Sign in to access the Digital Evidence Portal
            </p>

            {error && (
              <div className="animate-fade-in-down" style={{
                padding: '0.625rem 0.875rem', borderRadius: '4px',
                background: 'rgba(217, 48, 37, 0.06)',
                border: '1px solid rgba(217, 48, 37, 0.2)',
                color: '#D93025',
                fontSize: '0.75rem', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {error}
                <button onClick={clearError} style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'inherit', padding: '2px',
                }}>✕</button>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="ev-label">Username / Officer ID</label>
                <div className="ev-input-group">
                  <User className="ev-input-icon" size={16} />
                  <input
                    className="ev-input"
                    type="text"
                    placeholder="Enter username or officer ID"
                    value={identifier}
                    onChange={e => { setIdentifier(e.target.value); clearError(); }}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="ev-label">Password</label>
                <div className="ev-input-group" style={{ position: 'relative' }}>
                  <Lock className="ev-input-icon" size={16} />
                  <input
                    className="ev-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearError(); }}
                    autoComplete="current-password"
                    required
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '0.625rem', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#697386', padding: '2px', display: 'flex',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`ev-btn ev-btn-primary ev-btn-lg ${submitting ? 'ev-btn-submitting' : ''}`}
                disabled={submitting || isLoading || !identifier.trim() || !password.trim()}
                style={{
                  width: '100%', marginTop: '0.25rem',
                  fontSize: '0.875rem', fontWeight: 600,
                  height: '44px',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {submitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{
                      width: '16px', height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#FFFFFF',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                      display: 'inline-block',
                    }} />
                    Authenticating & Navigating...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', width: '100%' }}>
                    Sign In Securely
                    <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                  </span>
                )}
              </button>
            </form>

            <p style={{
              fontSize: '0.6875rem', color: '#697386',
              textAlign: 'center', marginTop: '1.25rem', lineHeight: 1.5,
            }}>
              This is a Government of India secure portal. Unauthorized access is prohibited and may be subject to legal action under the IT Act, 2000.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#FFFFFF',
        borderTop: '1px solid #D9E1EA',
        padding: '0.625rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.625rem',
        color: '#697386',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <span>© 2026 Indian Digital Evidence Unit | Ministry of Home Affairs</span>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href="#" style={{ color: '#0645A5', textDecoration: 'none' }}>Terms of Use</a>
          <a href="#" style={{ color: '#0645A5', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#0645A5', textDecoration: 'none' }}>Contact</a>
        </div>
      </div>

      {/* OFFICIAL GOVT AUTHENTICATION MODAL OVERLAY */}
      {submitting && (
        <div className="ev-modal-overlay animate-fade-in" style={{ zIndex: 9999, background: 'rgba(0, 43, 92, 0.85)', backdropFilter: 'blur(6px)' }}>
          <div className="ev-modal animate-scale-in" style={{ maxWidth: '440px', width: '90%', textAlign: 'center', padding: '2rem 1.5rem', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <img
              src="/img/Emblem.png"
              alt="Govt Emblem"
              style={{ height: '64px', width: 'auto', margin: '0 auto 0.875rem', objectFit: 'contain' }}
            />
            <span className="ev-badge ev-badge-navy" style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              GOVERNMENT OF INDIA • MHA PORTAL
            </span>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#003B73', marginTop: '0.25rem', marginBottom: '0.25rem' }}>
              Authenticating Secure Session
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#4B5563', marginBottom: '1.25rem' }}>
              Verifying digital credentials & establishing encrypted tunnel...
            </p>

            {/* Official Loading Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #FF7700, #003B73, #169447)',
                width: authStage === 1 ? '35%' : authStage === 2 ? '75%' : '100%',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#003B73' }}>
              <div style={{
                width: 14, height: 14,
                border: '2px solid #003B73',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }} />
              <span>{authMessage}</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.12;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.12);
            opacity: 0.25;
          }
        }
        @media (max-width: 1024px) {
          .login-hero {
            display: none !important;
          }
          .mobile-logo {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
