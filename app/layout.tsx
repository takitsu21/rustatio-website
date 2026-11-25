import type { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import './base.css';
import '../src/app.css';
import '../src/guide-page.css';

import { buildThemeScript } from '../src/theme';

/** Loads the self-hosted display and body typeface used across the site. */
const schibsted = localFont({
  src: [
    { path: '../public/fonts/schibsted-grotesk-400.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/schibsted-grotesk-500.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/schibsted-grotesk-600.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/schibsted-grotesk-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-schibsted',
  display: 'swap',
});

/** Loads the self-hosted monospace typeface used for labels and data. */
const fragment = localFont({
  src: '../public/fonts/fragment-mono-400.woff2',
  variable: '--font-fragment',
  display: 'swap',
});

/** Stores the optional GitHub Pages base path for static metadata assets. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Defines the shared metadata for the exported site. */
export const metadata: Metadata = {
  title: 'Rustatio - BitTorrent Ratio Management for Your Whole Fleet',
  description:
    'Rustatio emulates five torrent clients, shapes realistic transfer rates, and keeps every session in one dense, self-hosted interface.',
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
  themeColor: '#f4f5f1',
};

/** Renders the shared document shell for the static Next.js export. */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${schibsted.variable} ${fragment.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: buildThemeScript() }} />
        {children}
      </body>
    </html>
  );
}
