'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getCases, CaseItem } from '@/lib/casesStorage';
import { getAllEvidence, EvidenceItem } from '@/lib/evidenceStorage';
import {
  Upload, ShieldCheck, FileText, ChevronRight, ChevronLeft as ChevronLeftIcon,
  Plus, Scale, Gavel, FolderOpen, ScrollText,
  CheckCircle2, Shield, Clock, AlertTriangle,
  BookOpen, ExternalLink, Megaphone, ArrowRight
} from 'lucide-react';

/* ─── HERO CAROUSEL ─── */
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = [
    {
      image: '/img/hero1.png',
      objectPosition: 'left center',
      hindi: 'डिजिटल प्रमाण, सुरक्षित भविष्य',
      hindiSub: 'हर जाँच में पारदर्शिता, हर प्रमाण में विश्वास।',
      english: 'Digital Evidence, Secure Future',
      englishSub: 'Transparency in every investigation,\nTrust in every proof.',
    },
    {
      image: '/img/hero2_lab.jpg',
      objectPosition: 'center 35%',
      hindi: 'सुरक्षित जाँच, विश्वसनीय प्रमाण',
      hindiSub: 'कानून प्रवर्तन के लिए विश्वसनीय डिजिटल प्रमाण।',
      english: 'Secure Investigation, Trusted Evidence',
      englishSub: 'Reliable digital evidence\nfor law enforcement.',
    },
    {
      image: '/img/hero1.png',
      objectPosition: 'left center',
      hindi: 'संग्रह से न्यायालय तक अखंडता',
      hindiSub: 'हर चरण में प्रमाण की अखंडता सुनिश्चित।',
      english: 'Integrity from Collection to Court',
      englishSub: 'Ensuring evidence integrity\nat every stage.',
    },
    {
      image: '/img/hero2_lab.jpg',
      objectPosition: 'center 35%',
      hindi: 'डिजिटल भारत, सुरक्षित भारत',
      hindiSub: 'प्रौद्योगिकी द्वारा न्याय सुनिश्चित।',
      english: 'Digital India, Secure India',
      englishSub: 'Justice ensured through\ntechnology and transparency.',
    },
  ];

  const next = useCallback(() => setCurrent(p => (p + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '250px',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '1rem',
        boxShadow: '0 4px 12px rgba(0, 43, 92, 0.1)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Horizontal Sliding Track */}
      <div
        style={{
          display: 'flex',
          width: `${slides.length * 100}%`,
          height: '100%',
          transform: `translateX(-${(current * 100) / slides.length}%)`,
          transition: 'transform 0.75s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              width: `${100 / slides.length}%`,
              height: '100%',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {/* Background image */}
            <img
              src={slide.image}
              alt="IDEU Banner"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: slide.objectPosition || 'center center',
                position: 'absolute',
                inset: 0,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/img/hero1.png';
              }}
            />

            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(0,43,92,0.3) 0%, rgba(0,43,92,0.55) 40%, rgba(0,43,92,0.88) 70%, rgba(0,43,92,0.95) 100%)',
              }}
            />

            {/* Emblem on left */}
            <div
              style={{
                position: 'absolute',
                left: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.5,
                pointerEvents: 'none',
              }}
            >
              <img
                src="/img/Emblem.png"
                alt="Emblem"
                style={{ height: '120px', width: 'auto', filter: 'brightness(2)' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            {/* Slide content on right */}
            <div
              style={{
                position: 'absolute',
                right: '40px',
                top: '50%',
                transform: 'translateY(-50%)',
                textAlign: 'right',
                color: '#FFFFFF',
                maxWidth: '440px',
              }}
            >
              <div style={{ fontSize: '1.375rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '4px' }}>
                {slide.english}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.4, marginBottom: '8px', whiteSpace: 'pre-line' }}>
                {slide.englishSub}
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.3, marginBottom: '4px' }}>
                {slide.hindi}
              </div>
              <div style={{ fontSize: '0.8125rem', opacity: 0.85, lineHeight: 1.4 }}>
                {slide.hindiSub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.4)',
          color: '#FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'background 0.2s',
        }}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon size={18} />
      </button>
      <button
        onClick={next}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.4)',
          color: '#FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'background 0.2s',
        }}
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Pagination dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── SERVICES CAROUSEL ─── */
function ServicesCarousel() {
  const [scroll, setScroll] = useState(0);
  const services = [
    { name: 'Cyber Crime Portal', icon: <Shield size={22} color="#003B73" /> },
    { name: 'National Cyber Crime Reporting Portal', icon: <AlertTriangle size={22} color="#003B73" />, subtitle: 'NCRP' },
    { name: 'CERT-In', icon: <ShieldCheck size={22} color="#003B73" /> },
    { name: 'IT Act, 2000\nBare Act', icon: <Scale size={22} color="#003B73" /> },
    { name: 'Sec 65B\nCompliance Guide', icon: <BookOpen size={22} color="#003B73" /> },
    { name: 'Digital Evidence\nHandbook', icon: <FileText size={22} color="#003B73" /> },
    { name: 'Judicial Academy\nResources', icon: <Gavel size={22} color="#003B73" /> },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setScroll(p => Math.max(0, p - 1))} style={{
        position: 'absolute', left: '-4px', top: '50%', transform: 'translateY(-50%)',
        width: '28px', height: '28px', borderRadius: '50%',
        background: '#FFFFFF', border: '1px solid #D9E1EA',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2, color: '#003B73',
      }}><ChevronLeftIcon size={16} /></button>

      <div style={{
        display: 'flex', gap: '0.75rem', overflowX: 'auto',
        padding: '0.25rem 1.5rem',
        scrollBehavior: 'smooth',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        {services.map((s, i) => (
          <div key={i} style={{
            flexShrink: 0,
            width: '130px',
            padding: '0.75rem',
            background: '#FFFFFF',
            border: '1px solid #D9E1EA',
            borderRadius: '4px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}>
            <div style={{ marginBottom: '0.375rem', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
            <div style={{ fontSize: '0.6875rem', color: '#172033', fontWeight: 500, lineHeight: 1.3, whiteSpace: 'pre-line' }}>
              {s.name}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setScroll(p => p + 1)} style={{
        position: 'absolute', right: '-4px', top: '50%', transform: 'translateY(-50%)',
        width: '28px', height: '28px', borderRadius: '50%',
        background: '#FFFFFF', border: '1px solid #D9E1EA',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2, color: '#003B73',
      }}><ChevronRight size={16} /></button>
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [casesList, setCasesList] = useState<CaseItem[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [hoveredQuick, setHoveredQuick] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setCasesList(getCases());
    setEvidenceList(getAllEvidence());
  }, []);

  if (!mounted) return null;

  const verifiedCount = evidenceList.filter(e => e.status === 'Verified').length;
  const pendingCount = evidenceList.filter(e => e.status === 'Pending').length;
  const mismatchedCount = evidenceList.filter(e => e.status === 'Mismatched').length;
  const verifiedPct = evidenceList.length > 0 ? Math.round((verifiedCount / evidenceList.length) * 100) : 100;
  const dashOffset = 238.7 - (238.7 * verifiedPct / 100);

  return (
    <DashboardLayout>
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>

        {/* 1. HERO IMAGE CAROUSEL */}
        <HeroCarousel />

        {/* 2. PORTAL INTRODUCTION */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          background: '#F2F6FC',
          borderLeft: '4px solid #FF9933',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.8125rem',
          color: '#4B5563',
          lineHeight: 1.5,
        }}>
          Indian Digital Evidence Unit (IDEU) is a centralised platform for secure collection, verification, analysis and management of digital evidence. It ensures compliance with Sec 65B, IT Act and strengthens judicial and law enforcement processes through technology, traceability and transparency.
        </div>

        {/* 3. DASHBOARD SUMMARY METRICS */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #D9E1EA',
          borderRadius: '6px',
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
        }} className="metrics-strip">
          {[
            { icon: <FolderOpen size={22} color="#003B73" />, value: casesList.length, label: 'Active Cases', sub: 'View all →', subHref: '/cases', iconBg: 'rgba(0,59,115,0.06)' },
            { icon: <Shield size={22} color="#003B73" />, value: evidenceList.length, label: 'Evidence Blobs', sub: 'Total Uploaded', iconBg: 'rgba(0,59,115,0.06)' },
            { icon: <Clock size={22} color="#D97706" />, value: pendingCount, label: 'Pending Review', sub: 'Require Attention', iconBg: 'rgba(245,158,11,0.06)' },
            { icon: <CheckCircle2 size={22} color="#169447" />, value: mismatchedCount, label: 'Integrity Mismatches', sub: 'Verified Today', iconBg: 'rgba(22,148,71,0.06)' },
            { icon: <ShieldCheck size={22} color="#003B73" />, value: verifiedCount, label: 'Sec 65B Certified', sub: 'This Month', iconBg: 'rgba(0,59,115,0.06)' },
          ].map((m, i) => (
            <div key={i} style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0 1rem',
              borderLeft: i > 0 ? '1px solid #D9E1EA' : 'none',
            }} className="metric-item">
              <div style={{
                width: '40px', height: '40px', borderRadius: '6px',
                background: m.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {m.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#172033', lineHeight: 1 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#4B5563', marginTop: '2px' }}>
                  {m.label}
                </div>
                {m.subHref ? (
                  <Link href={m.subHref} style={{ fontSize: '0.6875rem', color: '#0645A5', textDecoration: 'none' }}>
                    {m.sub}
                  </Link>
                ) : (
                  <div style={{ fontSize: '0.6875rem', color: '#697386' }}>{m.sub}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 4. QUICK ACCESS ACTIONS */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #D9E1EA',
          borderRadius: '6px',
          padding: '1rem 1.125rem',
          marginBottom: '1rem',
        }}>
          <h3 style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#003B73',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            marginBottom: '0.75rem',
            paddingBottom: '0.375rem',
            borderBottom: '1px solid #D9E1EA',
          }}>
            Quick Access Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '0.75rem',
          }} className="quick-access-bar">
            {[
              { label: 'New Case', desc: 'Register case file', icon: <Plus size={20} />, href: '/cases/new' },
              { label: 'Upload Evidence', desc: 'Ingest digital files', icon: <Upload size={20} />, href: '/evidence/intake' },
              { label: 'Verify Evidence', desc: 'Sec 65B integrity', icon: <ShieldCheck size={20} />, href: '/verification' },
              { label: 'Court Package', desc: 'Export legal bundle', icon: <Gavel size={20} />, href: '/court-packages' },
              { label: 'Generate Report', desc: 'Audit & summary pdf', icon: <FileText size={20} />, href: '/reports' },
              { label: 'Audit Log', desc: 'Immutable trail', icon: <ScrollText size={20} />, href: '/audit' },
            ].map((a, i) => {
              const isHovered = hoveredQuick === i;
              return (
                <Link
                  key={i}
                  href={a.href}
                  onMouseEnter={() => setHoveredQuick(i)}
                  onMouseLeave={() => setHoveredQuick(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.75rem 0.875rem',
                    background: isHovered ? '#FFFDF9' : '#FFFFFF',
                    border: isHovered ? '1.5px solid #FF8800' : '1px solid #003B73',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease-in-out',
                    boxShadow: 'none',
                    transform: isHovered ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    background: isHovered ? '#FFF3E0' : '#FFFFFF',
                    border: isHovered ? '1px solid #FF8800' : '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease-in-out',
                  }}>
                    {React.cloneElement(a.icon, { color: isHovered ? '#E65100' : '#003B73' })}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: isHovered ? '#E65100' : '#172033',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      transition: 'color 0.15s ease',
                    }}>
                      {a.label}
                    </div>
                    <div style={{
                      fontSize: '0.625rem',
                      color: isHovered ? '#F57C00' : '#697386',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      marginTop: '1px',
                      transition: 'color 0.15s ease',
                    }}>
                      {a.desc}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 5. ACTIVE CASE REGISTER (FULL WIDTH ALIGNED BELOW QUICK ACCESS) */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #D9E1EA',
          borderRadius: '6px',
          padding: '1rem 1.125rem',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <h3 style={{
                fontSize: '0.75rem', fontWeight: 700, color: '#003B73',
                textTransform: 'uppercase', letterSpacing: '0.03em',
              }}>
                Active Case Register
              </h3>
              <p style={{ fontSize: '0.6875rem', color: '#697386', marginTop: '1px' }}>
                Official Law Enforcement Case Log
              </p>
            </div>
            <Link href="/cases" style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#0645A5', textDecoration: 'none' }}>
              View Directory →
            </Link>
          </div>

          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #D9E1EA', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem', fontSize: '0.625rem', fontWeight: 600, color: '#697386', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Case ID</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.625rem', fontWeight: 600, color: '#697386', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Case Title</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.625rem', fontWeight: 600, color: '#697386', textTransform: 'uppercase', letterSpacing: '0.04em' }}>FIR Ref</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.625rem', fontWeight: 600, color: '#697386', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lead Officer</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.625rem', fontWeight: 600, color: '#697386', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.625rem', fontWeight: 600, color: '#697386', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Priority</th>
                  <th style={{ width: '20px' }}></th>
                </tr>
              </thead>
              <tbody>
                {casesList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '1.5rem', textAlign: 'center', color: '#697386', fontSize: '0.75rem' }}>
                      No registered cases found. Click &quot;New Case&quot; to register your first case.
                    </td>
                  </tr>
                ) : (
                  casesList.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #D9E1EA' }}>
                      <td style={{ padding: '0.625rem 0.5rem', fontWeight: 600, color: '#003B73', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        <Link href={`/cases/${row.id}`} style={{ color: '#003B73', textDecoration: 'none' }}>
                          {row.id}
                        </Link>
                      </td>
                      <td style={{ padding: '0.625rem 0.5rem', fontWeight: 500, color: '#172033' }}>
                        <Link href={`/cases/${row.id}`} style={{ color: '#172033', textDecoration: 'none' }}>
                          <div>{row.caseTitle}</div>
                        </Link>
                      </td>
                      <td style={{ padding: '0.625rem 0.5rem', color: '#4B5563', fontSize: '0.75rem' }}>{row.firNumber}</td>
                      <td style={{ padding: '0.625rem 0.5rem', color: '#172033', fontWeight: 500 }}>{row.leadInvestigator}</td>
                      <td style={{ padding: '0.625rem 0.5rem' }}>
                        <span className="ev-badge ev-badge-navy">{row.stage || 'Intake'}</span>
                      </td>
                      <td style={{ padding: '0.625rem 0.5rem' }}>
                        <span className="ev-badge ev-badge-orange">{row.classification || 'Restricted'}</span>
                      </td>
                      <td style={{ padding: '0.625rem 0.5rem', textAlign: 'right' }}>
                        <Link href={`/cases/${row.id}`} style={{ color: '#697386' }}>
                          <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .quick-access-bar {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .metrics-strip {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          .metric-item {
            border-left: none !important;
            padding: 0.625rem 0.75rem !important;
            background: #F7F9FC !important;
            border-radius: 6px !important;
            border: 1px solid #E5E7EB !important;
          }
        }
        @media (max-width: 600px) {
          .quick-access-bar {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .metrics-strip {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}




