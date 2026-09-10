'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { addCase, CaseItem } from '@/lib/casesStorage';
import { searchCaseTypes } from '@/data/details/caseTypes';
import { STATES_LIST, getDistrictsForState } from '@/data/details/statesAndDistricts';
import { getPoliceStationsForDistrict, MasterPoliceStation } from '@/data/details/policeStationsMaster';
import {
  ArrowLeft, Save, Send, Calendar,
  Users, FileText, Globe, AlertCircle, Plus, Trash2, ChevronDown, Lock, CheckCircle2
} from 'lucide-react';
import PoliceStationSelector from '@/components/ui/PoliceStationSelector';

const CASE_TYPES = ['Criminal', 'Civil', 'Cyber Crime', 'Financial Fraud', 'Narcotics', 'Terrorism', 'Domestic Violence', 'Corruption', 'Environmental', 'Other'];
const CLASSIFICATIONS = ['Unclassified', 'Restricted', 'Confidential', 'Secret', 'Top Secret'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical', 'Urgent'];

interface PersonEntry {
  name: string;
  roles: string[];
}

const Field = ({
  label,
  required,
  error,
  children
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="ev-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.375rem' }}>
      <span>{label}</span>
      {required && <span style={{ color: '#EF4444', fontWeight: 'bold' }}>*</span>}
    </label>
    {children}
    {error && (
      <div style={{
        color: '#EF4444',
        fontSize: '0.75rem',
        marginTop: '0.375rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        fontWeight: 600,
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        padding: '0.25rem 0.5rem',
        borderRadius: '6px',
      }}>
        <AlertCircle size={13} color="#EF4444" /> {error}
      </div>
    )}
  </div>
);

export default function NewCasePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isCustomCaseType, setIsCustomCaseType] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const caseTypeContainerRef = useRef<HTMLDivElement>(null);

  const [persons, setPersons] = useState<PersonEntry[]>([
    { name: '', roles: ['Victim', 'Complainant'] }
  ]);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const addPerson = () => {
    setPersons(prev => [...prev, { name: '', roles: ['Complainant'] }]);
  };

  const removePerson = (index: number) => {
    setPersons(prev => prev.filter((_, i) => i !== index));
  };

  const updatePersonName = (index: number, name: string) => {
    setPersons(prev => prev.map((p, i) => i === index ? { ...p, name } : p));
  };

  const togglePersonRole = (index: number, role: string) => {
    setPersons(prev => prev.map((p, i) => {
      if (i !== index) return p;
      const exists = p.roles.includes(role);
      return {
        ...p,
        roles: exists ? p.roles.filter(r => r !== role) : [...p.roles, role]
      };
    }));
  };

  const [form, setForm] = useState({
    caseTitle: '',
    firNumber: '',
    caseType: '',
    complainantName: '',
    complainantNearby: '',
    complainantRoles: ['Victim', 'Complainant'] as string[],
    classification: 'Restricted',
    priority: 'Medium',
    status: 'Draft',
    organization: '',
    country: 'India',
    state: '',
    district: '',
    policeStation: '',
    court: '',
    jurisdiction: '',
    incidentDate: '',
    incidentTime: '',
    caseOpenedDate: new Date().toISOString().split('T')[0],
    incidentLocation: '',
    offenceCategory: '',
    legalSections: '',
    description: '',
    leadInvestigator: user?.fullName || '',
    supervisingOfficer: '',
    additionalTeam: '',
    legalReviewer: '',
    nextDeadline: '',
    confidentiality: 'Restricted',
    tags: '',
  });

  useEffect(() => {
    setMounted(true);
    setCaseId(`CSD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (caseTypeContainerRef.current && !caseTypeContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setShowPresetDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return null;

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setForm(prev => {
      const exists = prev.complainantRoles.includes(role);
      return {
        ...prev,
        complainantRoles: exists
          ? prev.complainantRoles.filter(r => r !== role)
          : [...prev.complainantRoles, role]
      };
    });
  };

  const handleBlur = (key: string) => {
    setTouched(prev => ({ ...prev, [key]: true }));
  };

  const getFieldError = (key: string): string | undefined => {
    if (!touched[key]) return undefined;
    if (key === 'caseTitle' && !form.caseTitle.trim()) return 'Case Title is required';
    if (key === 'firNumber' && !form.firNumber.trim()) return 'FIR / Reference Number is required';
    if (key === 'caseType' && !form.caseType.trim()) return 'Case Type is required';
    if (key === 'jurisdiction' && !form.jurisdiction.trim()) return 'Jurisdiction is required';
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();

    if (!isDraft) {
      // Mark all required fields as touched to display all red alerts
      setTouched({
        caseTitle: true,
        firNumber: true,
        caseType: true,
        jurisdiction: true,
      });

      // Find the first unfilled required field in document order
      let firstMissingId = '';
      if (!form.caseTitle.trim()) firstMissingId = 'input-caseTitle';
      else if (!form.firNumber.trim()) firstMissingId = 'input-firNumber';
      else if (!form.caseType.trim()) firstMissingId = 'input-caseType';
      else if (!form.jurisdiction.trim()) firstMissingId = 'input-jurisdiction';

      if (firstMissingId) {
        setTimeout(() => {
          const el = document.getElementById(firstMissingId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus();
          }
        }, 50);
        return;
      }
    }

    setSubmitting(true);

    const newCaseItem: CaseItem = {
      id: caseId || `CSD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      caseTitle: form.caseTitle.trim() || (isDraft ? 'Untitled Draft Case' : 'New Investigation Case'),
      firNumber: form.firNumber.trim() || (isDraft ? 'DRAFT-REF' : 'FIR-PENDING'),
      caseType: form.caseType.trim() || 'Criminal',
      complainantName: persons.map(p => p.name).filter(Boolean).join(', ') || form.complainantName.trim(),
      complainantNearby: form.complainantNearby.trim(),
      complainantRoles: Array.from(new Set(persons.flatMap(p => p.roles))),
      classification: form.classification || 'Restricted',
      jurisdiction: form.jurisdiction.trim() || form.district.trim() || form.state.trim() || 'General Jurisdiction',
      leadInvestigator: form.leadInvestigator.trim() || user?.fullName || 'Investigator',
      evidenceCount: 0,
      lastActivity: 'Just now',
      nextDeadline: form.nextDeadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      stage: 'Intake',
      status: isDraft ? 'Draft' : 'Active',
      description: form.description,
    };

    addCase(newCaseItem);

    await new Promise(r => setTimeout(r, 400));
    setSubmitting(false);

    if (isDraft) {
      router.push('/cases');
    } else {
      router.push(`/evidence/intake?caseId=${newCaseItem.id}`);
    }
  };

  return (
    <DashboardLayout title="New Case" subtitle="Create a new investigation case">
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div className="animate-fade-in" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          marginBottom: '1.25rem', flexWrap: 'wrap',
        }}>
          <button onClick={() => router.back()} className="ev-btn ev-btn-ghost ev-btn-icon">
            <ArrowLeft size={18} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="ev-badge ev-badge-navy" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                {caseId}
              </span>
              <span className="ev-badge ev-badge-gold">Draft</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="ev-btn ev-btn-secondary" onClick={e => handleSubmit(e as React.FormEvent, true)}
              disabled={submitting}>
              <Save size={16} /> Save Draft
            </button>
          </div>
        </div>

        <form noValidate onSubmit={e => handleSubmit(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Basic Information Section */}
          <div className="ev-card animate-fade-in-up">
            <h3 style={{
              fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)',
              marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)',
            }}>
              <FileText size={18} color="var(--accent-navy)" /> Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }} className="form-grid">
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Case Title" required error={getFieldError('caseTitle')}>
                  <input
                    id="input-caseTitle"
                    className="ev-input"
                    placeholder="Enter a descriptive case title"
                    value={form.caseTitle}
                    onChange={e => handleChange('caseTitle', e.target.value)}
                    onBlur={() => handleBlur('caseTitle')}
                    style={{
                      borderColor: getFieldError('caseTitle') ? '#EF4444' : undefined,
                      boxShadow: getFieldError('caseTitle') ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : undefined
                    }}
                  />
                </Field>
              </div>
              <Field label="FIR / Reference Number" required error={getFieldError('firNumber')}>
                <input
                  id="input-firNumber"
                  className="ev-input"
                  placeholder="e.g. FIR-2026-CYB-0001"
                  value={form.firNumber}
                  onChange={e => handleChange('firNumber', e.target.value)}
                  onBlur={() => handleBlur('firNumber')}
                  style={{
                    borderColor: getFieldError('firNumber') ? '#EF4444' : undefined,
                    boxShadow: getFieldError('firNumber') ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : undefined
                  }}
                />
              </Field>

              {/* Case Type with Other -> Inline text input & Live Suggestions support */}
              <Field label="Case Type" required error={getFieldError('caseType')}>
                {isCustomCaseType ? (
                  <div ref={caseTypeContainerRef} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                      <input
                        id="input-caseType"
                        className="ev-input"
                        placeholder="Type or search case type (e.g. Cyber, Murder, Fraud...)"
                        value={form.caseType}
                        autoFocus
                        onFocus={() => setShowSuggestions(true)}
                        onChange={e => {
                          handleChange('caseType', e.target.value);
                          setShowSuggestions(true);
                        }}
                        onBlur={() => handleBlur('caseType')}
                        style={{
                          borderColor: getFieldError('caseType') ? '#EF4444' : undefined,
                          boxShadow: getFieldError('caseType') ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : undefined,
                          flex: 1,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCaseType(false);
                          setShowSuggestions(false);
                          handleChange('caseType', '');
                        }}
                        className="ev-btn ev-btn-secondary ev-btn-sm"
                        style={{ padding: '0.5rem 0.625rem', fontSize: '0.6875rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                        title="Switch back to main categories list"
                      >
                        Choose Preset
                      </button>
                    </div>

                    {/* Live Autocomplete Suggestions Popover */}
                    {showSuggestions && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        background: 'var(--bg-primary, #FFFFFF)',
                        border: '1px solid var(--border-primary, #CBD5E1)',
                        borderRadius: '8px',
                        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.18)',
                        maxHeight: '230px',
                        overflowY: 'auto',
                        padding: '0.375rem',
                      }}>
                        {(() => {
                          const suggestions = searchCaseTypes(form.caseType, 12);
                          if (suggestions.length > 0) {
                            return (
                              <div>
                                {suggestions.map((item, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleChange('caseType', item);
                                      setShowSuggestions(false);
                                    }}
                                    style={{
                                      width: '100%',
                                      textAlign: 'left',
                                      padding: '0.5rem 0.625rem',
                                      fontSize: '0.8125rem',
                                      fontWeight: 500,
                                      borderRadius: '5px',
                                      background: form.caseType.toLowerCase() === item.toLowerCase() ? 'rgba(0, 59, 115, 0.1)' : 'transparent',
                                      color: 'var(--text-primary, #0F172A)',
                                      border: 'none',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={e => {
                                      (e.currentTarget as HTMLElement).style.background = 'rgba(0, 59, 115, 0.08)';
                                    }}
                                    onMouseLeave={e => {
                                      (e.currentTarget as HTMLElement).style.background =
                                        form.caseType.toLowerCase() === item.toLowerCase() ? 'rgba(0, 59, 115, 0.1)' : 'transparent';
                                    }}
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <div style={{ padding: '0.75rem 0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary, #475569)', textAlign: 'center' }}>
                              No results found{form.caseType.trim() ? <> for <strong>"{form.caseType}"</strong></> : null}. You can keep typing custom type.
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div ref={caseTypeContainerRef} style={{ position: 'relative' }}>
                    <button
                      id="input-caseType"
                      type="button"
                      onClick={() => setShowPresetDropdown(prev => !prev)}
                      className="ev-input ev-select"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: 'var(--bg-primary, #FFFFFF)',
                        borderColor: getFieldError('caseType') ? '#EF4444' : undefined,
                        boxShadow: getFieldError('caseType') ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : undefined
                      }}
                    >
                      <span style={{ color: form.caseType ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                        {form.caseType || 'Select case type'}
                      </span>
                      <ChevronDown size={16} color="var(--text-tertiary)" style={{ transition: 'transform 0.2s', transform: showPresetDropdown ? 'rotate(180deg)' : 'none' }} />
                    </button>

                    {showPresetDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        background: 'var(--bg-primary, #FFFFFF)',
                        border: '1px solid var(--border-primary, #CBD5E1)',
                        borderRadius: '8px',
                        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.18)',
                        maxHeight: '260px',
                        overflowY: 'auto',
                        padding: '0.375rem',
                      }}>
                        {CASE_TYPES.map(t => (
                          <button
                            key={t}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              if (t === 'Other') {
                                setIsCustomCaseType(true);
                                setShowSuggestions(true);
                                setShowPresetDropdown(false);
                                handleChange('caseType', '');
                              } else {
                                handleChange('caseType', t);
                                setShowPresetDropdown(false);
                              }
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '0.5rem 0.625rem',
                              fontSize: '0.8125rem',
                              fontWeight: form.caseType === t ? 600 : 400,
                              borderRadius: '5px',
                              background: form.caseType === t ? 'rgba(0, 59, 115, 0.1)' : 'transparent',
                              color: form.caseType === t ? '#003B73' : 'var(--text-primary, #0F172A)',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={e => {
                              if (form.caseType !== t) (e.currentTarget as HTMLElement).style.background = 'rgba(0, 59, 115, 0.05)';
                            }}
                            onMouseLeave={e => {
                              if (form.caseType !== t) (e.currentTarget as HTMLElement).style.background = 'transparent';
                            }}
                          >
                            <span>{t}</span>
                            {t === 'Other' && (
                              <span style={{ fontSize: '0.6875rem', color: '#003B73', opacity: 0.8, fontWeight: 600 }}>Custom...</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Field>

              <Field label="Classification">
                <select className="ev-input ev-select" value={form.classification}
                  onChange={e => handleChange('classification', e.target.value)}>
                  {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Priority">
                <select className="ev-input ev-select" value={form.priority}
                  onChange={e => handleChange('priority', e.target.value)}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>

              {/* Nearby Location Field */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Nearby Location / Police Station Area">
                  <input
                    id="input-complainantNearby"
                    className="ev-input"
                    placeholder="e.g. Near Rajiv Chowk Gate 2 / Sector 18 PS Area"
                    value={form.complainantNearby}
                    onChange={e => handleChange('complainantNearby', e.target.value)}
                  />
                </Field>
              </div>

              {/* Dynamic Associated Persons Section */}
              <div style={{
                gridColumn: '1 / -1',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                marginTop: '0.25rem',
              }}>
                {persons.map((person, pIndex) => (
                  <div key={pIndex} style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-input)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#003B73' }}>
                        {pIndex === 0 ? 'Name of Person / Complainant' : `Person #${pIndex + 1}`}
                      </span>
                      {persons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePerson(pIndex)}
                          style={{
                            color: '#EF4444',
                            fontSize: '0.75rem',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Trash2 size={14} /> Remove Person
                        </button>
                      )}
                    </div>

                    <Field label="Name of Person who Complained / Related Person">
                      <input
                        className="ev-input"
                        placeholder="e.g. Rahul Sharma / Anonymous / Informant"
                        value={person.name}
                        onChange={e => updatePersonName(pIndex, e.target.value)}
                      />
                    </Field>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.5rem 0.75rem',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-input)',
                      borderRadius: '6px',
                      flexWrap: 'wrap',
                    }}>
                      <span className="ev-label" style={{
                        margin: 0,
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)',
                      }}>
                        Person Category / Role:
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {[
                          { id: 'Victim', label: 'Victim (पीड़ित)' },
                          { id: 'Witness', label: 'Witness (गवाह)' },
                          { id: 'Suspect', label: 'Suspect (संदिग्ध)' },
                          { id: 'Accused', label: 'Accused (आरोपी)' },
                          { id: 'Complainant', label: 'Complainant (शिकायतकर्ता)' },
                        ].map(role => {
                          const isChecked = person.roles.includes(role.id);
                          return (
                            <label
                              key={role.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                fontSize: '0.8125rem',
                                fontWeight: isChecked ? 600 : 500,
                                color: isChecked ? '#003B73' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                userSelect: 'none',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                background: isChecked ? 'rgba(0, 59, 115, 0.08)' : '#FFFFFF',
                                border: isChecked ? '1px solid rgba(0, 59, 115, 0.3)' : '1px solid var(--border-input)',
                                transition: 'all 0.15s ease',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePersonRole(pIndex, role.id)}
                                style={{ cursor: 'pointer', accentColor: '#003B73', width: '14px', height: '14px' }}
                              />
                              <span>{role.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPerson}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 0.875rem',
                    background: 'rgba(0, 59, 115, 0.06)',
                    border: '1.5px dashed #003B73',
                    borderRadius: '6px',
                    color: '#003B73',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Plus size={16} /> Add Another Person
                </button>
              </div>
            </div>
          </div>

          {/* Jurisdiction & Location Section */}
          <div className="ev-card animate-fade-in-up">
            <h3 style={{
              fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)',
              marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)',
            }}>
              <Globe size={18} color="var(--accent-green)" /> Jurisdiction & Location
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }} className="form-grid">
              {/* State Dropdown (A-Z) */}
              <Field label="State / Union Territory">
                <select
                  id="input-state"
                  className="ev-input ev-select"
                  value={form.state}
                  onChange={e => {
                    const selectedState = e.target.value;
                    handleChange('state', selectedState);
                    handleChange('district', '');
                    handleChange('policeStation', '');
                    if (selectedState) {
                      handleChange('jurisdiction', `${selectedState}`);
                    }
                  }}
                >
                  <option value="" disabled hidden style={{ display: 'none' }}>Select State / UT</option>
                  {STATES_LIST.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </Field>

              {/* District Dropdown (Dependent on State, A-Z) */}
              <Field label="District">
                <select
                  id="input-district"
                  className="ev-input ev-select"
                  value={form.district}
                  disabled={!form.state}
                  onChange={e => {
                    const selectedDist = e.target.value;
                    handleChange('district', selectedDist);
                    handleChange('policeStation', '');
                    if (selectedDist && form.state) {
                      handleChange('jurisdiction', `${selectedDist}, ${form.state}`);
                    }
                  }}
                  style={{
                    opacity: !form.state ? 0.6 : 1,
                    cursor: !form.state ? 'not-allowed' : 'pointer',
                  }}
                >
                  <option value="" disabled hidden style={{ display: 'none' }}>{form.state ? 'Select District' : 'Select State first'}</option>
                  {getDistrictsForState(form.state).map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </Field>

              {/* Police Station Dropdown (Strictly Dependent on District Selection) */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Police Station / Agency (Select District First)">
                  {!form.district ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--bg-secondary, #F8FAFC)',
                      border: '1px dashed var(--border-input, #CBD5E1)',
                      borderRadius: '6px',
                      color: 'var(--text-muted, #64748B)',
                      fontSize: '0.8125rem',
                    }}>
                      <Lock size={14} color="#64748B" />
                      <span>Please select <strong>District</strong> above to view & choose respective Police Stations.</span>
                    </div>
                  ) : (
                    <div>
                      {(() => {
                        const stations = getPoliceStationsForDistrict(form.state, form.district);
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            <select
                              id="input-policeStation"
                              className="ev-input ev-select"
                              value={form.policeStation}
                              onChange={e => {
                                const selectedPsName = e.target.value;
                                handleChange('policeStation', selectedPsName);
                                if (selectedPsName) {
                                  handleChange('jurisdiction', `${selectedPsName}, ${form.district}, ${form.state}`);
                                } else {
                                  handleChange('jurisdiction', `${form.district}, ${form.state}`);
                                }
                              }}
                            >
                              <option value="">Select Police Station for {form.district}</option>
                              {stations.map(st => (
                                <option key={st.id} value={st.name}>
                                  {st.name} {st.govtCode ? `(${st.govtCode})` : ''} [{st.stationType}]
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </Field>
              </div>

              <Field label="Court">
                <input className="ev-input" placeholder="e.g. District & Sessions Court"
                  value={form.court} onChange={e => handleChange('court', e.target.value)} />
              </Field>
              <Field label="Jurisdiction" required error={getFieldError('jurisdiction')}>
                <input
                  id="input-jurisdiction"
                  className="ev-input"
                  placeholder="e.g. Central District, New Delhi"
                  value={form.jurisdiction}
                  onChange={e => handleChange('jurisdiction', e.target.value)}
                  onBlur={() => handleBlur('jurisdiction')}
                  style={{
                    borderColor: getFieldError('jurisdiction') ? '#EF4444' : undefined,
                    boxShadow: getFieldError('jurisdiction') ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : undefined
                  }}
                />
              </Field>
            </div>
          </div>

          {/* Incident Details Section */}
          <div className="ev-card animate-fade-in-up">
            <h3 style={{
              fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)',
              marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)',
            }}>
              <Calendar size={18} color="var(--accent-orange)" /> Incident Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }} className="form-grid">
              <Field label="Incident Date">
                <input className="ev-input" type="date" value={form.incidentDate}
                  onChange={e => handleChange('incidentDate', e.target.value)} />
              </Field>
              <Field label="Incident Time">
                <input className="ev-input" type="time" value={form.incidentTime}
                  onChange={e => handleChange('incidentTime', e.target.value)} />
              </Field>
              <Field label="Case Opened Date">
                <input className="ev-input" type="date" value={form.caseOpenedDate}
                  onChange={e => handleChange('caseOpenedDate', e.target.value)} />
              </Field>
              <Field label="Incident Location">
                <input className="ev-input" placeholder="Full address or description"
                  value={form.incidentLocation} onChange={e => handleChange('incidentLocation', e.target.value)} />
              </Field>
              <Field label="Offence Category">
                <input className="ev-input" placeholder="e.g. IPC Section 420 - Cheating"
                  value={form.offenceCategory} onChange={e => handleChange('offenceCategory', e.target.value)} />
              </Field>
              <Field label="Applicable Legal Sections">
                <input className="ev-input" placeholder="e.g. IPC 302, IT Act Section 66"
                  value={form.legalSections} onChange={e => handleChange('legalSections', e.target.value)} />
              </Field>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Detailed Description">
                  <textarea
                    ref={descriptionRef}
                    className="ev-input"
                    placeholder="Provide a detailed case description..."
                    value={form.description}
                    onChange={e => {
                      handleChange('description', e.target.value);
                      if (e.target) {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.max(110, e.target.scrollHeight)}px`;
                      }
                    }}
                    style={{
                      resize: 'none',
                      overflowY: 'hidden',
                      minHeight: '110px',
                      lineHeight: '1.5',
                      padding: '0.75rem',
                    }}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Team Assignment Section */}
          <div className="ev-card animate-fade-in-up">
            <h3 style={{
              fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)',
              marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-primary)',
            }}>
              <Users size={18} color="var(--accent-maroon)" /> Team & Deadlines
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }} className="form-grid">
              <Field label="Lead Investigator">
                <input className="ev-input" value={form.leadInvestigator}
                  onChange={e => handleChange('leadInvestigator', e.target.value)} />
              </Field>
              <Field label="Supervising Officer">
                <input className="ev-input" placeholder="Name of supervising officer"
                  value={form.supervisingOfficer} onChange={e => handleChange('supervisingOfficer', e.target.value)} />
              </Field>
              <Field label="Legal Reviewer">
                <input className="ev-input" placeholder="Assigned legal reviewer"
                  value={form.legalReviewer} onChange={e => handleChange('legalReviewer', e.target.value)} />
              </Field>
              <Field label="Next Deadline">
                <input className="ev-input" type="date" value={form.nextDeadline}
                  onChange={e => handleChange('nextDeadline', e.target.value)} />
              </Field>
              <Field label="Tags">
                <input className="ev-input" placeholder="Comma-separated tags"
                  value={form.tags} onChange={e => handleChange('tags', e.target.value)} />
              </Field>
              <Field label="Confidentiality Level">
                <select className="ev-input ev-select" value={form.confidentiality}
                  onChange={e => handleChange('confidentiality', e.target.value)}>
                  {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Bottom Submit Bar: ONLY Create Case */}
          <div style={{
            display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
            padding: '0.5rem 0',
          }}>
            <button type="button" className="ev-btn ev-btn-secondary" onClick={() => router.back()}>
              Cancel
            </button>
            <button type="submit" className="ev-btn ev-btn-primary"
              disabled={submitting}>
              <Send size={16} /> {submitting ? 'Creating...' : 'Create Case'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
