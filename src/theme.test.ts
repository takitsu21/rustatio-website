import assert from 'node:assert/strict';
import test from 'node:test';

import { applyThemeState, getThemeState, resolveTheme, toggleTheme } from './theme';

interface MockToggleElement {
  attrs: Record<string, string>;
}

test('resolveTheme prefers explicit storage and falls back to system', () => {
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme(null, true), 'dark');
  assert.equal(resolveTheme(null, false), 'light');
});

test('toggleTheme swaps light and dark', () => {
  assert.equal(toggleTheme('dark'), 'light');
  assert.equal(toggleTheme('light'), 'dark');
});

test('getThemeState exposes current and next labels', () => {
  assert.deepEqual(getThemeState('light'), {
    current: 'light',
    currentLabel: 'Light',
    next: 'dark',
    nextLabel: 'Dark',
    ariaLabel: 'Switch to dark theme',
  });
});

test('applyThemeState updates document attributes and themed screenshots', () => {
  const root = {
    dataset: {},
    style: {
      colorScheme: '',
    },
  } as unknown as HTMLElement;
  const meta = {
    content: '',
    setAttribute(name: string, value: string) {
      Reflect.set(this, name, value);
    },
  } as unknown as HTMLMetaElement;
  const toggle = {
    attrs: {} as Record<string, string>,
    setAttribute(name: string, value: string) {
      this.attrs[name] = value;
    },
  } as unknown as HTMLElement;
  const label = { textContent: '' } as unknown as HTMLElement;
  const next = { textContent: '' } as unknown as HTMLElement;
  const shot = {
    dataset: {
      darkSrc: './dark.png',
      lightSrc: './light.png',
    },
    src: '',
    setAttribute(name: string, value: string) {
      Reflect.set(this, name, value);
    },
  } as unknown as HTMLImageElement;
  const doc = {
    querySelector(selector: string) {
      return selector === 'meta[name="theme-color"]' ? meta : null;
    },
    querySelectorAll(selector: string) {
      if (selector === '[data-theme-toggle]') {
        return [toggle];
      }
      if (selector === '[data-theme-label]') {
        return [label];
      }
      if (selector === '[data-theme-next]') {
        return [next];
      }
      if (selector === '[data-theme-shot]') {
        return [shot];
      }
      return [];
    },
  } as unknown as Document;

  const theme = applyThemeState('light', root, doc);

  assert.equal(theme, 'light');
  assert.equal(root.dataset.theme, 'light');
  assert.equal(root.style.colorScheme, 'light');
  assert.equal(meta.content, '#eff1f5');
  assert.equal((toggle as unknown as MockToggleElement).attrs['aria-label'], 'Switch to dark theme');
  assert.equal((toggle as unknown as MockToggleElement).attrs['aria-pressed'], 'true');
  assert.equal(label.textContent, 'Light');
  assert.equal(next.textContent, 'Dark');
  assert.equal(shot.src, './light.png');
});
