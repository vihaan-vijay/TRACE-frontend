'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Building2, Search, CheckCircle2, ShieldAlert, MapPin, ChevronDown, Lock } from 'lucide-react';
import { STATES_LIST, getDistrictsForState } from '@/data/details/statesAndDistricts';
import {
  getPoliceStationsForDistrict,
  MasterPoliceStation,
  MASTER_POLICE_STATIONS,
  OFFICIAL_DISTRICTS_MASTER
} from '@/data/details/policeStationsMaster';

export interface StateOption {
  code: string;
  name: string;
  type: 'STATE' | 'UNION_TERRITORY';
}

export interface DistrictOption {
  code: string;
  name: string;
  stateCode: string;
}

export interface PoliceStationOption {
  id: string;
  name: string;
  districtCode: string;
  stateCode: string;
  stationType: string;
  govtCode?: string | null;
  address?: string | null;
  pincode?: string | null;
  verificationStatus: string;
}

export const OFFICIAL_STATES: StateOption[] = STATES_LIST.map(st => ({
  code: st.slice(0, 2).toUpperCase(),
  name: st,
  type: ['Delhi', 'Chandigarh', 'Puducherry', 'Ladakh', 'Lakshadweep', 'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu', 'Jammu and Kashmir'].includes(st) ? 'UNION_TERRITORY' : 'STATE'
}));

export const OFFICIAL_DISTRICTS: DistrictOption[] = OFFICIAL_DISTRICTS_MASTER.map(d => ({
  code: d.district_code,
  name: d.district_name,
  stateCode: d.state_code
}));

export const OFFICIAL_STATIONS: PoliceStationOption[] = MASTER_POLICE_STATIONS.map(s => ({
  id: s.id,
  name: s.name,
  districtCode: s.districtCode,
  stateCode: s.stateCode,
  stationType: s.stationType,
  govtCode: s.govtCode,
  address: s.address,
  pincode: s.pincode,
  verificationStatus: 'VERIFIED_OFFICIAL'
}));

interface PoliceStationSelectorProps {
  selectedState: string;
  selectedDistrict: string;
  selectedStation: string;
  onStateChange: (stateName: string, stateCode: string) => void;
  onDistrictChange: (districtName: string, districtCode: string) => void;
  onStationChange: (stationName: string, stationId: string, fullJurisdiction: string) => void;
}

export default function PoliceStationSelector({
  selectedState,
  selectedDistrict,
  selectedStation,
  onStateChange,
  onDistrictChange,
  onStationChange,
}: PoliceStationSelectorProps) {
  const [activeState, setActiveState] = useState<string>(selectedState || '');
  const [activeDistrict, setActiveDistrict] = useState<string>(selectedDistrict || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Sync state with props
  useEffect(() => {
    if (selectedState !== undefined) setActiveState(selectedState);
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict !== undefined) setActiveDistrict(selectedDistrict);
  }, [selectedDistrict]);

  // Available districts for chosen state
  const availableDistricts = useMemo(() => {
    if (!activeState) return [];
    return getDistrictsForState(activeState);
  }, [activeState]);

  // Available stations ONLY for chosen district (100% accurate mapping from raw dataset)
  const districtStations = useMemo(() => {
    if (!activeDistrict) return [];
    return getPoliceStationsForDistrict(activeState, activeDistrict);
  }, [activeState, activeDistrict]);

  // Filtered list based on search query inside the district
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return districtStations;
    const q = searchQuery.toLowerCase();
    return districtStations.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.govtCode && s.govtCode.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q))
    );
  }, [districtStations, searchQuery]);

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const st = e.target.value;
    setActiveState(st);
    setActiveDistrict('');
    onStateChange(st, st.slice(0, 2).toUpperCase());
    onDistrictChange('', '');
    onStationChange('', '', '');
    setSearchQuery('');
  };

  const handleDistrictSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dist = e.target.value;
    setActiveDistrict(dist);
    onDistrictChange(dist, dist.slice(0, 4).toUpperCase());
    onStationChange('', '', '');
    setSearchQuery('');
  };

  const handleStationPick = (station: MasterPoliceStation) => {
    const fullJurisdiction = `${station.name}, ${activeDistrict || ''}, ${activeState || ''}`;
    onStationChange(station.name, station.id, fullJurisdiction);
    setSearchQuery(station.name);
    setIsDropdownOpen(false);
  };

  return (
    <div style={{
      background: 'rgba(0, 59, 115, 0.02)',
      border: '1px solid rgba(0, 59, 115, 0.15)',
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.875rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 59, 115, 0.1)', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#003B73' }}>
          <Building2 size={16} color="#003B73" />
          <span>Official Police Station Master Selector</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
          <CheckCircle2 size={13} /> Source-Verified Master Data ({MASTER_POLICE_STATIONS.length} Stations)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {/* State Selector */}
        <div>
          <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>
            1. State / Union Territory <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <select
            className="ev-input ev-select"
            value={activeState}
            onChange={handleStateSelect}
            style={{ fontSize: '0.8125rem' }}
          >
            <option value="">Select State / UT</option>
            {STATES_LIST.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* District Selector */}
        <div>
          <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>
            2. District / Unit <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <select
            className="ev-input ev-select"
            value={activeDistrict}
            onChange={handleDistrictSelect}
            style={{
              fontSize: '0.8125rem',
              opacity: !activeState ? 0.6 : 1,
              cursor: !activeState ? 'not-allowed' : 'pointer'
            }}
            disabled={!activeState}
          >
            <option value="">{activeState ? 'Select District' : 'Select State first'}</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Police Station Dropdown & Search (Strictly Dependent on District) */}
      <div style={{ position: 'relative' }}>
        <label className="ev-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>
          <span>3. Police Station (Appears after District selection) <span style={{ color: '#EF4444' }}>*</span></span>
        </label>

        {!activeDistrict ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 0.875rem',
            background: 'var(--bg-secondary, #F8FAFC)',
            border: '1px dashed var(--border-input, #CBD5E1)',
            borderRadius: '6px',
            color: 'var(--text-muted, #64748B)',
            fontSize: '0.8125rem'
          }}>
            <Lock size={14} color="#64748B" />
            <span>Please select a <strong>District</strong> above to unlock police station dropdown.</span>
          </div>
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              className="ev-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem', cursor: 'pointer' }}
              placeholder={`Search or select ${activeDistrict} police stations...`}
              value={searchQuery || selectedStation}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
            <ChevronDown size={16} color="var(--text-tertiary)" style={{ position: 'absolute', right: '0.75rem', pointerEvents: 'none' }} />
          </div>
        )}

        {/* Dropdown Options List */}
        {activeDistrict && isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            marginTop: '4px',
            background: '#FFFFFF',
            border: '1px solid var(--border-primary, #CBD5E1)',
            borderRadius: '6px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.18)',
            maxHeight: '230px',
            overflowY: 'auto',
          }}>
            {filteredStations.length === 0 ? (
              <div style={{ padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No police stations found matching "{searchQuery}". You can type manual station name above.
              </div>
            ) : (
              filteredStations.map((station) => (
                <div
                  key={station.id}
                  onClick={() => handleStationPick(station)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderBottom: '1px solid #F1F5F9',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <MapPin size={13} color="#003B73" />
                      <span>{station.name}</span>
                      {station.govtCode && (
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', background: '#F1F5F9', padding: '1px 5px', borderRadius: '3px' }}>
                          {station.govtCode}
                        </span>
                      )}
                    </div>
                    {station.address && (
                      <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px', paddingLeft: '1.125rem' }}>
                        {station.address} {station.pincode ? `• PIN: ${station.pincode}` : ''}
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: station.stationType === 'CYBER' ? '#EFF6FF' : station.stationType === 'WOMEN' ? '#FDF2F8' : '#F0FDF4',
                    color: station.stationType === 'CYBER' ? '#1D4ED8' : station.stationType === 'WOMEN' ? '#BE185D' : '#15803D',
                  }}>
                    {station.stationType}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
