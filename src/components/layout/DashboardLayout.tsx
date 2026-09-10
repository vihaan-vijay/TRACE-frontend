'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronUp, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { zoomIn, zoomOut, resetZoom, zoomPercent, canZoomIn, canZoomOut } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';
  const [sidebarOpen, setSidebarOpen] = useState(isDashboard);
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sidebarWidth = '240px';

  useEffect(() => { setMounted(true); }, []);

  // Ensure sidebar starts closed on non-dashboard sections and closes when navigating to new sections
  useEffect(() => {
    if (pathname !== '/dashboard') {
      setSidebarOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  // Scroll to top listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#F7F9FC',
      }} />
    );
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#F7F9FC',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36,
            border: '3px solid #D9E1EA',
            borderTopColor: '#003B73',
            borderRadius: '50%', margin: '0 auto 1rem',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#697386', fontSize: '0.8125rem' }}>
            Loading IDEU Portal...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: '#F7F9FC',
      width: '100%', maxWidth: '100vw',
      overflowX: 'hidden',
    }}>

      {/* 1 & 2. FIXED TOP CONTAINER (Utility Bar + Header pinned at top: 0) */}
      <div className="ev-top-container" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        width: '100%',
        background: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        transition: 'box-shadow 0.2s ease',
      }}>
        {/* 1. GOVERNMENT UTILITY BAR */}
        <div className="ev-utility-bar" style={{
          background: '#002B5C',
          color: '#FFFFFF',
          fontSize: '0.8125rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          height: '42px',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src="/img/india.jpeg"
              alt="India Flag"
              style={{ height: '16px', width: 'auto', borderRadius: '2px', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span style={{ fontWeight: 600, fontSize: '0.8125rem', letterSpacing: '0.01em' }}>भारत सरकार</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 1px' }}>|</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Govt. of India</span>
          </div>

          {/* Right */}
          <div className="utility-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem' }}>
            <a href="#main-content" style={{ color: '#FFFFFF', textDecoration: 'none', opacity: 0.9 }}>Skip to Main Content</a>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
            <span style={{ cursor: 'pointer', opacity: 0.9 }}>Screen Reader Access</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'rgba(0,0,0,0.2)', padding: '2px 4px', borderRadius: '4px' }}>
              {/* A- zoom out */}
              <button
                onClick={zoomOut}
                disabled={!canZoomOut}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: canZoomOut ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                  cursor: canZoomOut ? 'pointer' : 'not-allowed',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s ease',
                  lineHeight: 1.2,
                  userSelect: 'none',
                }}
                title="Zoom Out (A-)"
                aria-label="Zoom Out"
              >
                A-
              </button>
              {/* Standard text size 'A' — click to reset to normal (100%) */}
              <button
                onClick={resetZoom}
                style={{
                  background: zoomPercent === 100 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s ease',
                  lineHeight: 1.2,
                  textAlign: 'center',
                  userSelect: 'none',
                }}
                title={zoomPercent === 100 ? 'Default Text Size (A)' : `Reset Text Size to Normal (A) - current ${zoomPercent}%`}
                aria-label="Default Text Size (A)"
              >
                A
              </button>
              {/* A+ zoom in */}
              <button
                onClick={zoomIn}
                disabled={!canZoomIn}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: canZoomIn ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                  cursor: canZoomIn ? 'pointer' : 'not-allowed',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s ease',
                  lineHeight: 1.2,
                  userSelect: 'none',
                }}
                title="Zoom In (A+)"
                aria-label="Zoom In"
              >
                A+
              </button>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
            <span style={{ cursor: 'pointer', fontWeight: 600, opacity: 0.95 }}>हिंदी</span>
          </div>
        </div>

        {/* 2. GOVERNMENT IDENTITY HEADER */}
        <Header
          title={title}
          subtitle={subtitle}
        />
      </div>

      {/* 3. MIDDLE AREA: Sidebar + Main Content */}
      <div className="ev-middle-area" style={{
        display: 'flex',
        flex: 1,
        position: 'relative',
        paddingTop: '132px',
        minHeight: 'calc(100vh - 132px)',
        boxSizing: 'border-box',
        width: '100%',
      }}>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Wrapper */}
        <div className="main-layout-wrapper" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 132px)',
          width: '100%',
          maxWidth: '100vw',
          marginLeft: sidebarOpen ? sidebarWidth : '0px',
          transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}>
          {/* Bar below header: Left-aligned Hamburger Icon & Page Title (Rendered on ALL pages including Dashboard) */}
          <div style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #D9E1EA',
            padding: '0.625rem 1.25rem',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => setSidebarOpen(prev => !prev)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '5px',
                    border: '1px solid #D9E1EA',
                    background: sidebarOpen ? 'rgba(0, 59, 115, 0.08)' : '#FFFFFF',
                    color: '#003B73',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                  title={sidebarOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
                  aria-label="Toggle Sidebar Menu"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <h1 style={{
                    fontSize: '0.9375rem', fontWeight: 600,
                    color: '#003B73', lineHeight: 1.3,
                    margin: 0,
                  }}>
                    {title || (isDashboard ? 'Dashboard' : 'Portal Workspace')}
                  </h1>
                  {(subtitle || isDashboard) && (
                    <p style={{
                      fontSize: '0.6875rem', color: '#697386',
                      marginTop: '1px', lineHeight: 1.3,
                      margin: 0,
                    }}>
                      {subtitle || 'National Digital Forensics & Evidence Management Overview'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Body */}
          <main id="main-content" style={{
            flex: 1,
            padding: isDashboard ? '1.25rem 1.5rem 2rem' : '1.25rem 1.5rem 2rem',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }} className="dashboard-main-content animate-dashboard-enter">
            {children}
          </main>
        </div>
      </div>

      {/* 4. END-OF-PAGE GOVERNMENT FOOTER */}
      <footer style={{
        background: '#FFFFFF',
        borderTop: '1px solid #D9E1EA',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.75rem',
        color: '#697386',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 50,
      }}>
        {/* Left: Emblem + IDEU copyright info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/img/Emblem.png"
            alt="Emblem"
            style={{ height: '32px', width: 'auto', opacity: 0.85, objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div>
            <div style={{ fontWeight: 600, color: '#172033', fontSize: '0.8125rem' }}>
              © 2026 Indian Digital Evidence Unit
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#697386' }}>
              Ministry of Home Affairs, Government of India
            </div>
          </div>
        </div>

        {/* Center: Legal Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: '#0645A5', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 500 }}>Terms of Use</a>
          <a href="#" style={{ color: '#0645A5', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 500 }}>Privacy Policy</a>
          <a href="#" style={{ color: '#0645A5', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 500 }}>Accessibility</a>
          <a href="#" style={{ color: '#0645A5', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 500 }}>Contact Us</a>
        </div>

        {/* Right: Digital India Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src="/img/Digital_india.png"
            alt="Digital India"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </footer>

      {/* Government Portal Floating 'Scroll to Top' Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Scroll to Top / शीर्ष पर जाएँ"
          aria-label="Scroll to Top"
          className="animate-fade-in-up"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '48px',
            width: '44px',
            height: '44px',
            borderRadius: '6px',
            background: '#002B5C',
            color: '#FFFFFF',
            border: '1px solid #003B73',
            boxShadow: '0 4px 16px rgba(0, 43, 92, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <ChevronUp size={22} />
        </button>
      )}

      <style jsx>{`
        .sidebar-edge-open-btn:hover {
          background: #003B73 !important;
          padding-left: 9px !important;
          box-shadow: 3px 6px 18px rgba(0, 43, 92, 0.4) !important;
        }
        @media (max-width: 1024px) {
          .ev-middle-area {
            padding-top: 104px !important;
          }
          .main-layout-wrapper {
            margin-left: 0 !important;
          }
          .dashboard-main-content {
            padding: 1rem 0.875rem 2rem !important;
          }
        }

        @media (max-width: 768px) {
          .ev-utility-bar {
            height: 36px !important;
            padding: 0 0.875rem !important;
          }
          .utility-bar-right {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
