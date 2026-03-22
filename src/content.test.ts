import assert from 'node:assert/strict';
import test from 'node:test';

import { downloadCards, faq, proofCards, showcase, steps } from './content';

test('homepage content exposes core sections', () => {
  assert.equal(proofCards.length, 3);
  assert.equal(showcase.length, 6);
  assert.equal(steps.length, 4);
  assert.equal(downloadCards.length, 5);
  assert.ok(faq.length >= 4);
});

test('download card titles are unique', () => {
  const titles = downloadCards.map(card => card.title);
  assert.equal(new Set(titles).size, titles.length);
});
