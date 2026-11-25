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

test('extractGuideMarkdown keeps the full README body after the title', () => {
  const markdown = extractGuideMarkdown(sampleReadme);

  assert.match(markdown, /Features/);
  assert.match(markdown, /Getting Started/);
  assert.match(markdown, /How It Works/);
  assert.match(markdown, /Contributing/);
  assert.doesNotMatch(markdown, /^# Rustatio/m);
});

test('extractGuideMarkdown drops the README logo and title header', () => {
  const readme = `<div align="center"><img src="logo.png" /></div>\n\n# 🚀 Rustatio\n\nIntro paragraph.\n\n## Features\n\n- Fast`;
  const markdown = extractGuideMarkdown(readme);

  assert.doesNotMatch(markdown, /logo\.png/);
  assert.match(markdown, /^Intro paragraph\./);
});

test('extractGuideMarkdown keeps plain README headings', () => {
  const readme = `
# Rustatio

## Features

- Fast

## Getting Started

Rustatio runs as a desktop app or a self-hosted server.

## Usage

Pick a client.

## Contributing

Later
`;

  const markdown = extractGuideMarkdown(readme);
  assert.match(markdown, /Features/);
  assert.match(markdown, /Getting Started/);
  assert.match(markdown, /Usage/);
  assert.match(markdown, /Contributing/);
});

test('collectSections builds clean section metadata', () => {
  const sections = collectSections(extractGuideMarkdown(sampleReadme));

  assert.deepEqual(sections, [
    { depth: 2, text: 'Features', slug: 'features' },
    { depth: 2, text: 'Getting Started', slug: 'getting-started' },
    { depth: 3, text: 'Desktop App Installation', slug: 'desktop-app-installation' },
    { depth: 2, text: 'How It Works', slug: 'how-it-works' },
    { depth: 2, text: 'Contributing', slug: 'contributing' },
  ]);
});

test('link and image rewriting target site-safe locations', () => {
  assert.equal(rewriteHref('WEB_VERSION.md'), 'https://github.com/takitsu21/rustatio/blob/main/WEB_VERSION.md');
  assert.equal(rewriteImageSrc('screenshots/dark-theme.png'), '/screenshots/dark-theme.png');
});

test('slugifyHeading removes emoji and punctuation', () => {
  assert.equal(slugifyHeading('🚀 Getting Started'), 'getting-started');
});

test('buildGuideDocument injects heading ids and rewritten links', async () => {
  const guide = await buildGuideDocument(sampleReadme);

  assert.match(guide.html, /<h2 id="getting-started">/);
  assert.match(guide.html, /href="https:\/\/github.com\/takitsu21\/rustatio\/blob\/main\/WEB_VERSION.md"/);
  assert.match(guide.html, /src="\/screenshots\/dark-theme.png"/);
});

test('buildGuideDocument uses the README intro after the title', async () => {
  const guide = await buildGuideDocument(`
<div align="center"><img src="logo.png" /></div>

# 🚀 Rustatio

A modern BitTorrent ratio management tool.

## Features

- Fast
`);

  assert.equal(guide.intro, 'A modern BitTorrent ratio management tool.');
  assert.doesNotMatch(guide.html, /A modern BitTorrent ratio management tool\./);
});

test('buildGuideDocument labels GitHub alerts and embeds demo videos', async () => {
  const guide = await buildGuideDocument(`
# Rustatio

> [!IMPORTANT]
> Keep it safe.

[Demo](https://github.com/user-attachments/assets/example)

## Features

- Fast
`);

  assert.match(guide.html, /class="guide-alert guide-alert-important"/);
  assert.match(guide.html, /data-alert="IMPORTANT"/);
  assert.doesNotMatch(guide.html, /\[!IMPORTANT\]/);
  assert.match(guide.html, /class="guide-demo-video"/);
  assert.match(guide.html, /poster="\/screenshots\/demo-poster\.jpg"/);
  assert.match(guide.html, /src="\/media\/rustatio-demo\.mp4"/);
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

  assert.match(
    guide.html,
    /<pre class="guide-code-block language-bash" data-lang="bash"><code class="hljs language-bash">docker compose up -d\n<\/code><\/pre>/,
  );
});
