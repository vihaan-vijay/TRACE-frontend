'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FolderOpen, Upload, ShieldCheck, Users,
  FileText, ScrollText, Bell, Settings,
  X, Gavel, HelpCircle, ChevronRight, ChevronLeft
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  hasChevron?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/cases', label: 'Case Files', icon: <FolderOpen size={18} />, hasChevron: true },
  { href: '/verification', label: 'Evidence Check', icon: <ShieldCheck size={18} /> },
  { href: '/reports', label: 'Reports', icon: <FileText size={18} />, hasChevron: true },
  { href: '/court-packages', label: 'Court Bundles', icon: <Gavel size={18} />, hasChevron: true },
  { href: '/audit', label: 'Audit Trail', icon: <ScrollText size={18} /> },
  { href: '/notifications', label: 'Alerts', icon: <Bell size={18} /> },
  { href: '/investigators', label: 'Officer Roles', icon: <Users size={18} /> },
  { href: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  { href: '/settings', label: 'Help & Support', icon: <HelpCircle size={18} /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  isNavExpanded?: boolean;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, label: string) => {
    if (label === 'Dashboard') return pathname === '/dashboard';
    if (label === 'Audit Trail' || label === 'Audit Logs' || label === 'Chain of Custody Logs') return pathname.startsWith('/audit');
    return pathname.startsWith(href);
  };

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      <aside
        className={`ev-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '240px',
          background: '#FFFFFF',
          borderRight: '1px solid #D9E1EA',
          height: 'calc(100vh - 132px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: '132px',
          left: 0,
          zIndex: 48,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          paddingTop: 0,
          boxShadow: isOpen ? '2px 0 12px rgba(0, 43, 92, 0.08)' : 'none',
        }}
      >
        {/* Sidebar Header with Left Arrow Close Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 0.875rem',
          borderBottom: '1px solid #E5E7EB',
          background: '#F8FAFC',
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#003B73',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            IDEU Navigation
          </span>
          <button
            onClick={onClose}
            style={{
              background: '#FFFFFF',
              border: '1px solid #D9E1EA',
              color: '#003B73',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
          >
            <ChevronLeft size={16} />
            <span style={{ fontSize: '0.6875rem' }}>Close</span>
          </button>
        </div>

        {/* Navigation Items (scrollable list) */}
        <nav style={{ flex: 1, padding: '0.5rem 0', overflowY: 'auto', minHeight: 0 }}>
          {NAV_ITEMS.map((item, idx) => {
            const active = isActive(item.href, item.label);
            return (
              <Link key={`${item.href}-${idx}`} href={item.href} onClick={handleNavClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.55rem 1rem',
                  margin: '2px 0.625rem',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#FFFFFF' : '#172033',
                  background: active ? '#002B5C' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  lineHeight: '1.4',
                }}
              >
                <span style={{ color: active ? '#FFFFFF' : '#4B5563', flexShrink: 0, display: 'flex' }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.hasChevron && !active && (
                  <ChevronRight size={14} style={{ color: '#697386', flexShrink: 0 }} />
                )}
              </Link>
            );
          })}

          {/* System Status Card (placed directly below Help & Support) */}
          <div style={{
            margin: '0.875rem 0.625rem 1rem',
            padding: '0.75rem 0.875rem',
            borderRadius: '8px',
            background: '#F7F9FC',
            border: '1px solid #E5E7EB',
            fontSize: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, color: '#172033' }}>System Status</span>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#169447', display: 'inline-block',
              }} />
            </div>
            <div style={{ color: '#169447', fontWeight: 500, fontSize: '0.6875rem' }}>
              All Systems Operational
            </div>
            <div style={{ color: '#697386', fontSize: '0.625rem', marginTop: '0.375rem' }}>
              Last Updated
            </div>
            <div style={{ color: '#4B5563', fontSize: '0.625rem', fontWeight: 500 }}>
              29 Aug 2026 &nbsp;|&nbsp; 12:35 PM
            </div>
          </div>
        </nav>
      </aside>

      <style jsx>{`
        @media (max-width: 1024px) {
          .desktop-edge-hover-trigger {
            display: none !important;
          }
          .sidebar-mobile-header {
            display: flex !important;
          }
          .ev-sidebar {
            top: 0 !important;
            height: 100vh !important;
            z-index: 1000 !important;
            transform: translateX(-100%) !important;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15) !important;
          }
          .ev-sidebar.open {
            transform: translateX(0) !important;
          }
        }

        /* Nav item hover effect */
        nav a:hover {
          background: #EEF4FC !important;
        }
        nav a[style*="background: rgb(0, 43, 92)"]:hover,
        nav a[style*="background: #002B5C"]:hover {
          background: #002B5C !important;
        }
      `}</style>
    </>
  );
}
