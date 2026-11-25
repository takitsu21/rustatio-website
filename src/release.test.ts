import assert from 'node:assert/strict';
import test from 'node:test';

import { buildReleaseLinks, getReleaseLabel, normalizeTag } from './release';

test('normalizeTag strips leading v', () => {
  assert.equal(normalizeTag('v1.2.3'), '1.2.3');
  assert.equal(normalizeTag('1.2.3'), '1.2.3');
});

test('buildReleaseLinks matches release asset names', () => {
  const links = buildReleaseLinks('v1.2.3');

  assert.equal(
    links['windows-exe'],
    'https://github.com/takitsu21/rustatio/releases/download/v1.2.3/Rustatio_1.2.3_x64-setup.exe',
  );
  assert.equal(
    links['macos-dmg'],
    'https://github.com/takitsu21/rustatio/releases/download/v1.2.3/Rustatio_1.2.3_universal.dmg',
  );
  assert.equal(
    links['linux-deb'],
    'https://github.com/takitsu21/rustatio/releases/download/v1.2.3/Rustatio_1.2.3_amd64.deb',
  );
  assert.equal(
    links['linux-rpm'],
    'https://github.com/takitsu21/rustatio/releases/download/v1.2.3/Rustatio-1.2.3-1.x86_64.rpm',
  );
  assert.equal(
    links['linux-appimage'],
    'https://github.com/takitsu21/rustatio/releases/download/v1.2.3/Rustatio_1.2.3_amd64.AppImage',
  );
});

test('getReleaseLabel returns user-facing version copy', () => {
  assert.equal(getReleaseLabel('v1.2.3'), 'Latest release v1.2.3');
});
