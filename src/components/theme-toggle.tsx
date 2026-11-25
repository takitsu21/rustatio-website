'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { applyThemeState, getBrowserTheme, getThemeState, normalizeTheme, THEME_KEY, type Theme } from '../theme';

/** Resolves the theme currently applied to the document, falling back to the system value. */
function resolveDocumentTheme(): Theme {
  return normalizeTheme(document.documentElement.dataset.theme) || getBrowserTheme();
}

/** Renders the shared theme toggle used across the homepage and guide page. */
export function ThemeToggle(): JSX.Element {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    let frameId = 0;

    const syncTheme = (nextTheme: Theme) => {
      applyThemeState(nextTheme);
      setTheme((currentTheme) => (currentTheme === nextTheme ? currentTheme : nextTheme));
    };

    frameId = window.requestAnimationFrame(() => {
      syncTheme(resolveDocumentTheme());
    });

    const handleChange = (event: MediaQueryListEvent) => {
      if (!window.localStorage.getItem(THEME_KEY)) {
        syncTheme(event.matches ? 'dark' : 'light');
      }
    };

    media.addEventListener('change', handleChange);
    return () => {
      window.cancelAnimationFrame(frameId);
      media.removeEventListener('change', handleChange);
    };
  }, []);

  const state = getThemeState(theme);

  return (
    <button
      className="theme-toggle"
      type="button"
      data-theme-toggle
      aria-label={theme ? state.ariaLabel : 'Toggle color theme'}
      title={theme ? state.ariaLabel : 'Toggle color theme'}
      aria-pressed={theme ? theme === 'light' : undefined}
      onClick={() => {
        const currentTheme = theme ?? resolveDocumentTheme();
        const nextTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
        window.localStorage.setItem(THEME_KEY, nextTheme);
        applyThemeState(nextTheme);
        setTheme(nextTheme);
      }}
    >
      <span className="theme-toggle-icon" aria-hidden="true"></span>
      <span data-theme-label>{theme ? state.currentLabel : 'Theme'}</span>
    </button>
  );
}
