import assert from 'node:assert/strict';
import test from 'node:test';

import { clients, demo, downloadCards, faq, features, screenshots, steps } from './content';

test('homepage content exposes core sections', () => {
  assert.equal(features.length, 3);
  assert.equal(steps.length, 4);
  assert.equal(downloadCards.length, 5);
  assert.ok(faq.length >= 4);
});

test('screenshot map covers both themes and the theme sheet', () => {
  const paths = Object.values(screenshots);

  assert.equal(paths.length, 11);
  assert.equal(new Set(paths).size, paths.length);
  assert.ok(paths.every(path => path.startsWith('/screenshots/')));
  assert.match(screenshots.lightGrid, /light-grid-view\.png$/);
  assert.match(screenshots.lightMetrics, /light-metrics\.png$/);
  assert.match(screenshots.lightWatch, /light-watch-folder\.png$/);
  assert.match(screenshots.lightAuth, /light-authentication\.png$/);
  assert.match(screenshots.themes, /themes\.png$/);
});

test('demo points at the local walkthrough video', () => {
  assert.match(demo.video, /\/media\/rustatio-demo\.mp4$/);
  assert.match(demo.poster, /\/screenshots\/demo-poster\.jpg$/);
  assert.equal(demo.chapters.length, 4);
});

test('client band lists six distinct profiles', () => {
  assert.equal(clients.length, 6);
  assert.equal(new Set(clients.map(client => client.name)).size, clients.length);
  assert.ok(clients.every(client => client.version.length > 0));
});

test('download card titles are unique', () => {
  const titles = downloadCards.map(card => card.title);
  assert.equal(new Set(titles).size, titles.length);
});
