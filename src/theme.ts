export type Theme = 'dark' | 'light';

export interface ThemeState {
  current: Theme;
  currentLabel: string;
  next: Theme;
  nextLabel: string;
  ariaLabel: string;
}

/** Stores the localStorage key used to persist the selected color theme. */
export const THEME_KEY = 'rustatio-theme';

/** Maps each theme to the matching browser UI color. */
export const THEME_META: Record<Theme, string> = {
  dark: '#1e1e2e',
  light: '#eff1f5',
};

/** Normalizes arbitrary theme input into a supported theme value. */
export function normalizeTheme(value: string | null | undefined): Theme | null {
  return value === 'dark' || value === 'light' ? value : null;
}

/** Switches the current theme to its opposite mode. */
export function toggleTheme(theme: Theme): Theme {
  return theme === 'light' ? 'dark' : 'light';
}

/** Resolves the effective theme using storage first and system preference second. */
export function resolveTheme(storedTheme: string | null | undefined, prefersDark: boolean): Theme {
  return normalizeTheme(storedTheme) || (prefersDark ? 'dark' : 'light');
}

/** Reads the effective theme from browser storage and media preference. */
export function getBrowserTheme(): Theme {
  return resolveTheme(window.localStorage.getItem(THEME_KEY), window.matchMedia('(prefers-color-scheme: dark)').matches);
}

/** Builds the current and next theme labels used by the toggle button. */
export function getThemeState(theme: string | null | undefined): ThemeState {
  const current = normalizeTheme(theme) || 'dark';
  const next = toggleTheme(current);

  return {
    current,
    currentLabel: current[0].toUpperCase() + current.slice(1),
    next,
    nextLabel: next[0].toUpperCase() + next.slice(1),
    ariaLabel: `Switch to ${next} theme`,
  };
}

/** Applies the resolved theme to the document and synchronized UI hooks. */
export function applyThemeState(
  theme: string | null | undefined,
  root: HTMLElement = document.documentElement,
  doc: Document = document
): Theme {
  const state = getThemeState(theme);
  const meta = doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

  root.dataset.theme = state.current;
  root.style.colorScheme = state.current;

  if (meta) {
    meta.setAttribute('content', THEME_META[state.current]);
  }

  doc.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach(node => {
    node.setAttribute('aria-label', state.ariaLabel);
    node.setAttribute('title', state.ariaLabel);
    node.setAttribute('aria-pressed', String(state.current === 'light'));
    node.setAttribute('data-theme-current', state.current);
  });

  doc.querySelectorAll<HTMLElement>('[data-theme-label]').forEach(node => {
    node.textContent = state.currentLabel;
  });

  doc.querySelectorAll<HTMLElement>('[data-theme-next]').forEach(node => {
    node.textContent = state.nextLabel;
  });

  doc.querySelectorAll<HTMLImageElement>('[data-theme-shot]').forEach(node => {
    const src = state.current === 'light' ? node.dataset.lightSrc : node.dataset.darkSrc;
    if (src) {
      node.setAttribute('src', src);
    }
  });

  return state.current;
}

/** Builds the inline bootstrap script that sets the theme before hydration. */
export function buildThemeScript(): string {
  return `(() => {
  const key = ${JSON.stringify(THEME_KEY)};
  const metaMap = ${JSON.stringify(THEME_META)};
  const normalizeTheme = value => (value === 'dark' || value === 'light' ? value : null);
  const root = document.documentElement;
  const storedTheme = normalizeTheme(window.localStorage?.getItem?.(key));
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  const current = storedTheme || (prefersDark ? 'dark' : 'light');
  root.dataset.theme = current;
  root.style.colorScheme = current;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', metaMap[current]);
  }
})();`;
}
