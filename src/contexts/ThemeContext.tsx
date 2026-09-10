'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

// Zoom levels in percentage steps — 80% to 130%
const ZOOM_STEPS = [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130];
const DEFAULT_ZOOM_INDEX = 4; // 100%

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  zoomIndex: number;
  zoomPercent: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [zoomIndex, setZoomIndex] = useState<number>(DEFAULT_ZOOM_INDEX);
  const [mounted, setMounted] = useState(false);

  const applyZoom = (index: number) => {
    if (typeof document === 'undefined') return;
    const pct = ZOOM_STEPS[index];
    const px = (pct / 100) * 16; // base 16px
    document.documentElement.style.fontSize = `${px}px`;
    document.documentElement.setAttribute('data-zoom', String(pct));
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('ev-theme') as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const storedZoom = localStorage.getItem('ev-zoom-index');
    const parsedZoom = storedZoom !== null ? parseInt(storedZoom, 10) : NaN;
    const safeIndex = !isNaN(parsedZoom) && parsedZoom >= 0 && parsedZoom < ZOOM_STEPS.length
      ? parsedZoom
      : DEFAULT_ZOOM_INDEX;
    setZoomIndex(safeIndex);
    applyZoom(safeIndex);

    setMounted(true);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('ev-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const zoomIn = () => {
    setZoomIndex(prev => {
      const next = Math.min(prev + 1, ZOOM_STEPS.length - 1);
      localStorage.setItem('ev-zoom-index', String(next));
      applyZoom(next);
      return next;
    });
  };

  const zoomOut = () => {
    setZoomIndex(prev => {
      const next = Math.max(prev - 1, 0);
      localStorage.setItem('ev-zoom-index', String(next));
      applyZoom(next);
      return next;
    });
  };

  const resetZoom = () => {
    setZoomIndex(DEFAULT_ZOOM_INDEX);
    localStorage.setItem('ev-zoom-index', String(DEFAULT_ZOOM_INDEX));
    applyZoom(DEFAULT_ZOOM_INDEX);
  };

  return (
    <ThemeContext.Provider value={{
      theme, toggleTheme, setTheme,
      zoomIndex,
      zoomPercent: ZOOM_STEPS[zoomIndex],
      zoomIn,
      zoomOut,
      resetZoom,
      canZoomIn: zoomIndex < ZOOM_STEPS.length - 1,
      canZoomOut: zoomIndex > 0,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
      zoomIndex: DEFAULT_ZOOM_INDEX,
      zoomPercent: 100,
      zoomIn: () => {},
      zoomOut: () => {},
      resetZoom: () => {},
      canZoomIn: true,
      canZoomOut: true,
    };
  }
  return ctx;
}
