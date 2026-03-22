import type { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';

import './base.css';
import '../src/app.css';
import '../src/guide-page.css';

import { buildThemeScript } from '../src/theme';

/** Stores the optional GitHub Pages base path for static metadata assets. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Defines the shared metadata for the exported site. */
export const metadata: Metadata = {
  title: 'Rustatio - BitTorrent Ratio Management, Built for Speed',
  description:
    'Rustatio is a fast cross-platform BitTorrent ratio management tool with desktop downloads, Docker deployment, and a shared web UI.',
  manifest: `${BASE_PATH}/site.webmanifest`,
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon.ico`, type: 'image/x-icon' },
      { url: `${BASE_PATH}/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${BASE_PATH}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: `${BASE_PATH}/apple-touch-icon.png`, sizes: '180x180' }],
  },
};

/** Defines the shared viewport metadata for the exported site. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e1e2e',
};

/** Renders the shared document shell for the static Next.js export. */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <script dangerouslySetInnerHTML={{ __html: buildThemeScript() }} />
        {children}
      </body>
    </html>
  );
}
