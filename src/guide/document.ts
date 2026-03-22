import fs from 'node:fs';
import path from 'node:path';

import { buildGuideDocument, type GuideDocument } from './markdown';

/** Stores the repository README path used as a local fallback guide source. */
const REPOSITORY_README_PATH = path.resolve(process.cwd(), 'README.md');

/** Stores the upstream README URL used as the primary guide source. */
const REMOTE_README_URL = 'https://raw.githubusercontent.com/takitsu21/rustatio/refs/heads/main/README.md';

/** Provides a final fallback guide document when no richer source is available. */
const EMERGENCY_GUIDE_DOCUMENT: GuideDocument = {
  title: 'Get Started',
  intro: 'Guide content is unavailable in this workspace, so only a minimal placeholder can be rendered.',
  html: '<h2 id="getting-started">Getting Started</h2><p>The source guide is unavailable in this checkout.</p>',
  sections: [{ depth: 2, text: 'Getting Started', slug: 'getting-started' }],
};

/** Attempts to build the guide document from a local repository README fallback. */
async function readGuideDocumentFromLocalReadme(): Promise<GuideDocument | null> {
  if (!fs.existsSync(REPOSITORY_README_PATH)) {
    return null;
  }

  const readme = fs.readFileSync(REPOSITORY_README_PATH, 'utf8');
  return buildGuideDocument(readme);
}

/** Attempts to build the guide document from the upstream repository README. */
async function readGuideDocumentFromRemoteReadme(): Promise<GuideDocument | null> {
  try {
    const response = await fetch(REMOTE_README_URL, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      return null;
    }

    const readme = await response.text();
    return buildGuideDocument(readme);
  } catch {
    return null;
  }
}

/** Loads the guide document using the best static source available in the workspace. */
export async function loadGuideDocument(): Promise<GuideDocument> {
  return (await readGuideDocumentFromRemoteReadme()) || (await readGuideDocumentFromLocalReadme()) || EMERGENCY_GUIDE_DOCUMENT;
}
