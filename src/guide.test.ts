import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildGuideDocument,
  collectSections,
  extractGuideMarkdown,
  rewriteHref,
  rewriteImageSrc,
  slugifyHeading,
} from './guide/markdown';

/** Provides a small markdown fixture for guide parser tests. */
const sampleReadme = `
# Rustatio

## ✨ Features

- Fast

## 🚀 Getting Started

### Desktop App Installation

Grab [WEB_VERSION.md](WEB_VERSION.md) and ![Shot](screenshots/dark-theme.png)

## 🔧 How It Works

Stuff

## 🤝 Contributing

Later
`;

test('extractGuideMarkdown keeps guide content only', () => {
  const markdown = extractGuideMarkdown(sampleReadme);

  assert.match(markdown, /Getting Started/);
  assert.match(markdown, /How It Works/);
  assert.doesNotMatch(markdown, /Features/);
  assert.doesNotMatch(markdown, /Contributing/);
});

test('collectSections builds clean section metadata', () => {
  const sections = collectSections(extractGuideMarkdown(sampleReadme));

  assert.deepEqual(sections, [
    { depth: 2, text: 'Getting Started', slug: 'getting-started' },
    { depth: 3, text: 'Desktop App Installation', slug: 'desktop-app-installation' },
    { depth: 2, text: 'How It Works', slug: 'how-it-works' },
  ]);
});

test('link and image rewriting target site-safe locations', () => {
  assert.equal(rewriteHref('WEB_VERSION.md'), 'https://codeberg.org/takitsu21/rustatio/src/branch/main/WEB_VERSION.md');
  assert.equal(rewriteImageSrc('screenshots/dark-theme.png'), '/screenshots/dark-theme.png');
});

test('slugifyHeading removes emoji and punctuation', () => {
  assert.equal(slugifyHeading('🚀 Getting Started'), 'getting-started');
});

test('buildGuideDocument injects heading ids and rewritten links', async () => {
  const guide = await buildGuideDocument(sampleReadme);

  assert.match(guide.html, /<h2 id="getting-started">/);
  assert.match(guide.html, /href="https:\/\/codeberg.org\/takitsu21\/rustatio\/src\/branch\/main\/WEB_VERSION.md"/);
  assert.match(guide.html, /src="\/screenshots\/dark-theme.png"/);
});

test('buildGuideDocument highlights yaml fences', async () => {
  const fence = '```';
  const guide = await buildGuideDocument(`
# Rustatio

## 🚀 Getting Started

${fence}yaml
services:
  rustatio:
    image: ghcr.io/takitsu21/rustatio:latest # release image
    ports:
      - "8080:8080"
${fence}
`);

  assert.match(guide.html, /class="guide-code-block language-yaml" data-lang="yaml"/);
  assert.match(guide.html, /class="hljs-attr"/);
  assert.match(guide.html, /class="hljs-string"/);
  assert.match(guide.html, /class="hljs-comment"/);
});

test('buildGuideDocument keeps raw code text available for copy actions', async () => {
  const fence = '```';
  const guide = await buildGuideDocument(`
# Rustatio

## 🚀 Getting Started

${fence}bash
docker compose up -d
${fence}
`);

  assert.match(guide.html, /<pre class="guide-code-block language-bash" data-lang="bash"><code class="hljs language-bash">docker compose up -d\n<\/code><\/pre>/);
});
