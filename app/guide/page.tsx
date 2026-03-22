import type { JSX } from 'react';
import type { Metadata } from 'next';

import { GuidePage } from '../../src/components/guide-page';
import { loadGuideDocument } from '../../src/guide/document';

/** Forces the guide route to stay fully static during Next.js export. */
export const dynamic = 'error';

/** Defines the guide-specific metadata for the exported guide page. */
export const metadata: Metadata = {
  title: 'Rustatio Docs',
  description: 'Rustatio docs generated from the repository README with install, Docker, web setup, and getting started instructions.',
};

/** Renders the exported guide route using the best static source available. */
export default async function Page(): Promise<JSX.Element> {
  return <GuidePage guide={await loadGuideDocument()} />;
}
