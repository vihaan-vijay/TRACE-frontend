'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bell, ChevronDown, LogOut, Settings, User
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ID';

  return (
    <header className="ev-header" style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #D9E1EA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.25rem',
      height: '90px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 50,
    }}>
      {/* LEFT AREA: Emblem + Organization Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        {/* Emblem */}
        <img
          src="/img/Emblem.png"
          alt="Indian Emblem"
          className="header-emblem"
          style={{ height: '60px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* Title */}
        <div>
          <div className="header-title-main" style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#003B73',
            lineHeight: 1.1,
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-sans)',
          }}>
            TRACE
          </div>
          <div className="header-title-sub" style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#003B73',
            lineHeight: 1.25,
            letterSpacing: '0.01em',
            fontFamily: 'var(--font-sans)',
            marginTop: '1px',
          }}>
            Trusted Record & Chain of Evidence
          </div>
          <div className="header-dept" style={{
            fontSize: '0.6875rem',
            color: '#4B5563',
            marginTop: '2px',
            fontWeight: 500,
          }}>
            Digital Evidence Management Platform
          </div>
        </div>
      </div>

      {/* CENTER: Bilingual motto (hidden on screens < 1024px to prevent mobile clutter) */}
      <div className="header-motto" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 1.25rem',
        borderLeft: '1px solid #D9E1EA',
        borderRight: '1px solid #D9E1EA',
        margin: '0 1.25rem',
        flex: 1,
      }}>
        <div style={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: '#003B73',
          lineHeight: 1.3,
        }}>
          Secure Investigation, Trusted Evidence
        </div>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#003B73',
          lineHeight: 1.3,
          marginTop: '1px',
        }}>
          सुरक्षित जाँच, विश्वसनीय प्रमाण
        </div>
        {/* Continuous Smooth Tricolour Line */}
        <div style={{
          width: '180px',
          height: '4px',
          borderRadius: '2px',
          background: 'linear-gradient(90deg, #FF7700 0%, #FF9933 35%, #FFFFFF 48%, #FFFFFF 52%, #169447 65%, #138808 100%)',
          marginTop: '6px',
        }} />
      </div>

      {/* RIGHT: Notifications + User Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
        {/* Notifications */}
        <a href="/notifications" style={{
          width: '32px', height: '32px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#4B5563', position: 'relative',
          border: '1px solid #D9E1EA',
          background: '#FFFFFF',
        }}>
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: '1px', right: '1px',
            width: '13px', height: '13px', borderRadius: '50%',
            background: '#D93025', color: '#FFFFFF',
            fontSize: '0.5625rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            2
          </span>
        </a>

        {/* Separator */}
        <div className="header-sep" style={{
          width: '1px', height: '26px',
          background: '#D9E1EA',
        }} />

        {/* User Badge */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '0.2rem',
              borderRadius: '4px',
            }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#003B73',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div className="header-user-info" style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '0.8125rem', fontWeight: 600,
                color: '#172033', lineHeight: 1.2,
              }}>
                {user?.fullName || 'Inspector Determination'}
              </div>
              <div style={{
                fontSize: '0.6875rem', color: '#697386',
              }}>
                {user?.role || 'Supervisor'}
              </div>
            </div>
            <ChevronDown size={14} color="#697386" className="header-chevron" />
          </button>

          {showDropdown && (
            <div className="ev-dropdown animate-fade-in-down" style={{
              position: 'absolute', top: '100%', right: 0,
              marginTop: '0.375rem', minWidth: '170px', zIndex: 60,
            }}>
              <a href="/settings" className="ev-dropdown-item" onClick={() => setShowDropdown(false)}>
                <User size={14} /> Profile
              </a>
              <a href="/settings" className="ev-dropdown-item" onClick={() => setShowDropdown(false)}>
                <Settings size={14} /> Settings
              </a>
              <div style={{ height: '1px', background: '#D9E1EA', margin: '0.25rem 0' }} />
              <button className="ev-dropdown-item" onClick={logout}
                style={{ color: '#D93025' }}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .header-motto {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .ev-header {
            height: 68px !important;
            padding: 0 0.875rem !important;
          }
          .header-emblem {
            height: 44px !important;
          }
          .header-title-main,
          .header-title-sub {
            font-size: 0.9375rem !important;
          }
          .header-dept {
            font-size: 0.625rem !important;
            display: none !important;
          }
          .header-user-info,
          .header-chevron,
          .header-sep {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
