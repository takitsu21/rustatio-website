/** Defines the supported release asset keys used on the download actions. */
export type ReleaseTarget = 'windows-exe' | 'macos-dmg' | 'linux-deb' | 'linux-rpm' | 'linux-appimage';

export interface LinkMap {
  guide: string;
  repo: string;
  releases: string;
  sourceReadme: string;
  docker: string;
  liveDemo: string;
  packages: string;
  aur: string;
  profile: string;
  license: string;
}

export interface ScreenshotMap {
  darkTheme: string;
  lightTheme: string;
  metrics: string;
  lightMetrics: string;
  grid: string;
  lightGrid: string;
  watch: string;
  lightWatch: string;
  auth: string;
  lightAuth: string;
  themes: string;
}

export interface ScreenshotPair {
  dark: string;
  light: string;
  alt: string;
}

export interface SpecItem {
  label: string;
  value: string;
}

/** Defines the icon keys used by the supported client list. */
export type ClientIconName = 'utorrent' | 'qbittorrent' | 'transmission' | 'deluge' | 'bittorrent' | 'rtorrent';

export interface Client {
  name: string;
  version: string;
  icon: ClientIconName;
}

export interface DemoContent {
  title: string;
  body: string;
  video: string;
  poster: string;
  chapters: string[];
}

export interface Feature {
  id: string;
  label: string;
  title: string;
  body: string;
  points: string[];
  image: ScreenshotPair;
  caption: string;
  mediaSide: 'left' | 'right';
}

export interface Step {
  id: string;
  title: string;
  body: string;
}

export interface ReleaseDownloadAction {
  label: string;
  kind: 'release';
  target: ReleaseTarget;
}

export interface LinkDownloadAction {
  label: string;
  kind: 'link';
  href: string;
}

export type DownloadAction = ReleaseDownloadAction | LinkDownloadAction;

export interface DownloadCard {
  title: string;
  body: string;
  meta: string;
  actions: DownloadAction[];
}

export interface ContentCard {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Stores the optional GitHub Pages base path for client-side asset and route links. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefixes a path with the configured deployment base path when needed. */
function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}

/** Stores the shared brand icon path used across the site shell. */
export const brandIconPath = withBasePath('/android-chrome-192x192.png');

/** Stores the GitHub-hosted author avatar used in the site footer. */
export const avatarUrl = 'https://github.com/takitsu21.png?size=64';

/** Stores the sample screenshots used throughout the homepage. */
export const screenshots: ScreenshotMap = {
  darkTheme: withBasePath('/screenshots/dark-theme.png'),
  lightTheme: withBasePath('/screenshots/light-theme.png'),
  metrics: withBasePath('/screenshots/dark-metrics.png'),
  lightMetrics: withBasePath('/screenshots/light-metrics.png'),
  grid: withBasePath('/screenshots/grid-view.png'),
  lightGrid: withBasePath('/screenshots/light-grid-view.png'),
  watch: withBasePath('/screenshots/watch-folder.png'),
  lightWatch: withBasePath('/screenshots/light-watch-folder.png'),
  auth: withBasePath('/screenshots/dark-authentication.png'),
  lightAuth: withBasePath('/screenshots/light-authentication.png'),
  themes: withBasePath('/screenshots/themes.png'),
};

/** Stores the shared destination links used across the site. */
export const links: LinkMap = {
  guide: withBasePath('/guide/'),
  repo: 'https://github.com/takitsu21/rustatio',
  releases: 'https://github.com/takitsu21/rustatio/releases/latest',
  sourceReadme: 'https://github.com/takitsu21/rustatio#readme',
  docker: 'https://github.com/takitsu21/rustatio#docker-self-hosted',
  liveDemo: 'https://takitsu21.github.io/rustatio/',
  packages: 'https://github.com/takitsu21/rustatio/pkgs/container/rustatio',
  aur: 'https://aur.archlinux.org/packages/rustatio-bin',
  profile: 'https://github.com/takitsu21',
  license: 'https://github.com/takitsu21/rustatio/blob/main/LICENSE',
};

/** Stores the headline and supporting copy used in the hero. */
export const heroCopy = {
  title: 'Your whole fleet, quietly seeding.',
  lede: 'Rustatio emulates the clients trackers expect, shapes transfer rates that look human, and keeps every session in one dense, legible window.',
  note: 'Desktop, Docker, and web. Same interface, same session data.',
  readout: ['5 instances', '5 seeding', 'self-hosted', 'sample data'],
};

/** Stores the at-a-glance specification band below the hero. */
export const specSheet: SpecItem[] = [
  {
    label: 'Delivery',
    value: 'Desktop, Docker, Web',
  },
  {
    label: 'Core',
    value: 'Rust + Tauri',
  },
  {
    label: 'Interface',
    value: 'Svelte 5, shared everywhere',
  },
];

/** Stores the supported client profiles and their emulated versions. */
export const clients: Client[] = [
  { name: 'uTorrent', version: '3.6.0', icon: 'utorrent' },
  { name: 'qBittorrent', version: '5.3.1', icon: 'qbittorrent' },
  { name: 'Transmission', version: '4.1.4', icon: 'transmission' },
  { name: 'Deluge', version: '2.2.0', icon: 'deluge' },
  { name: 'BitTorrent', version: '7.11.0', icon: 'bittorrent' },
  { name: 'rTorrent', version: '0.16.28', icon: 'rtorrent' },
];

/** Stores the product walkthrough link and its chapter summary. */
export const demo: DemoContent = {
  title: 'See the whole session move.',
  body: 'A walkthrough of the fleet grid, session details, performance charts, Watch folder intake, and theme switching. Every frame uses sample data.',
  video: withBasePath('/media/rustatio-demo.mp4'),
  poster: withBasePath('/screenshots/demo-poster.jpg'),
  chapters: ['Fleet', 'Details', 'Charts', 'Watch + themes'],
};

/** Defines the three product features rendered as editorial rows. */
export const features: Feature[] = [
  {
    id: 'fleet',
    label: 'Fleet',
    title: 'Six clients. One window. No tab archaeology.',
    body: 'Keep every session in a single table. Ratios, rates, peers, progress, and state stay in view, whether you run one instance or twenty.',
    points: ['Tracker-aware client profiles', 'Live ratio, rate, and peer columns', 'Bulk start, stop, and edit'],
    image: {
      dark: screenshots.grid,
      light: screenshots.lightGrid,
      alt: 'Rustatio grid view with five sample sessions',
    },
    caption: 'Grid view, five sample sessions.',
    mediaSide: 'right',
  },
  {
    id: 'automation',
    label: 'Automation',
    title: 'Drop a torrent. It is already in the queue.',
    body: 'Point Rustatio at a folder and new .torrent files arrive as pending. Expand the tree, review the intake, and start the sessions that matter.',
    points: ['Watch folders with pending state', 'Per-instance rate and stop rules', 'Token-gated remote access'],
    image: {
      dark: screenshots.watch,
      light: screenshots.lightWatch,
      alt: 'Rustatio watch explorer with sample torrent folders',
    },
    caption: 'Watch explorer, sample intake.',
    mediaSide: 'left',
  },
  {
    id: 'metrics',
    label: 'Metrics',
    title: 'The numbers you need before the ratio moves.',
    body: 'Session stats, total stats, transfer history, and peer counts sit beside the controls. You can see the shape of a session without leaving it.',
    points: ['Upload and download history', 'Peer and tracker scrape counts', 'Stop conditions that respect the plan'],
    image: {
      dark: screenshots.metrics,
      light: screenshots.lightMetrics,
      alt: 'Rustatio session and total statistics',
    },
    caption: 'Session and total stats.',
    mediaSide: 'right',
  },
];

/** Lists the palettes available inside the app. */
export const themeNames = ['Dark', 'Light', 'Catppuccin', 'Tokyo Night', 'Dracula', 'Gruvbox'];

/** Stores the appearance section copy and theme contact sheet. */
export const themePreview = {
  title: 'Dark by default. Every room after that.',
  body: 'The same dense layout, controls, and hierarchy across six palettes. Switch the site theme and the product screenshots follow; the app itself carries the full set.',
  image: screenshots.themes,
  alt: 'Rustatio interface shown in light, dark, Catppuccin, Tokyo Night, Dracula, and Gruvbox themes',
  caption: 'Six palettes, one interface. All sample data.',
};

/** Stores the self-hosted section copy and authentication preview. */
export const selfHosted = {
  title: 'Open it from the LAN. Close it with a token.',
  body: 'Run Rustatio on a server or NAS, put it behind your network, and require an API token before the UI or API answers.',
  points: [
    'Token auth for UI and API',
    'Docker image with a persistent volume',
    'Watch folders, proxies, and VPN-friendly setup',
  ],
  image: {
    dark: screenshots.auth,
    light: screenshots.lightAuth,
    alt: 'Rustatio authentication screen',
  },
  caption: 'Token gate, self-hosted mode.',
};

/** Defines the workflow steps rendered in the process section. */
export const steps: Step[] = [
  {
    id: '01',
    title: 'Add a torrent',
    body: 'Import a .torrent file or drop it into a watched folder. Rustatio reads the metadata and waits for your call.',
  },
  {
    id: '02',
    title: 'Pick the client',
    body: 'Choose the client profile and version the tracker expects, with the matching peer ID and announce behavior.',
  },
  {
    id: '03',
    title: 'Shape the session',
    body: 'Set upload and download targets, variance, stop conditions, and the update interval.',
  },
  {
    id: '04',
    title: 'Watch it settle',
    body: 'Start the session and follow ratio, peers, and transfer history in the same window.',
  },
];

/** Defines the download rows and their associated actions. */
export const downloadCards: DownloadCard[] = [
  {
    title: 'Windows',
    body: 'Native installer for Windows 10 and 11. The desktop build keeps the full feature set outside the browser.',
    meta: 'Installer, x64',
    actions: [
      { label: 'Download installer', kind: 'release', target: 'windows-exe' },
      { label: 'All releases', href: links.releases, kind: 'link' },
    ],
  },
  {
    title: 'macOS',
    body: 'Desktop DMG for Apple silicon and Intel Macs. No browser CORS layer in the way.',
    meta: 'DMG, universal',
    actions: [
      { label: 'Download DMG', kind: 'release', target: 'macos-dmg' },
      { label: 'Release notes', href: links.releases, kind: 'link' },
    ],
  },
  {
    title: 'Linux',
    body: 'DEB, RPM, AppImage, or the Arch AUR package. Pick the path that matches your distribution.',
    meta: 'DEB, RPM, AppImage, AUR',
    actions: [
      { label: 'DEB', kind: 'release', target: 'linux-deb' },
      { label: 'RPM', kind: 'release', target: 'linux-rpm' },
      { label: 'AppImage', kind: 'release', target: 'linux-appimage' },
      { label: 'AUR', href: links.aur, kind: 'link' },
    ],
  },
  {
    title: 'Docker',
    body: 'Run it on a server, NAS, or homelab box. Keep state in a volume and reach the shared UI from your network.',
    meta: 'ghcr.io/takitsu21/rustatio',
    actions: [
      { label: 'Docker quick start', href: links.docker, kind: 'link' },
      { label: 'Container package', href: links.packages, kind: 'link' },
    ],
  },
  {
    title: 'Web app',
    body: 'Open the WebAssembly build in a browser. Most trackers need a CORS proxy for this mode.',
    meta: 'WASM, CORS proxy required',
    actions: [{ label: 'Launch live demo', href: links.liveDemo, kind: 'link' }],
  },
];

/** Describes the deployment modes presented in the guardrails section. */
export const useCases: ContentCard[] = [
  {
    title: 'Desktop sessions',
    body: 'Local install, native window, and the most direct path to a running session.',
  },
  {
    title: 'Home server or NAS',
    body: 'Docker keeps Rustatio online with a persistent volume, auth token, and watch folders.',
  },
  {
    title: 'Remote web access',
    body: 'Reach the shared UI from another device without installing the desktop app.',
  },
];

/** Defines the safeguard messaging shown beside the deployment modes. */
export const safeguards: ContentCard[] = [
  {
    title: 'Operational controls',
    body: 'Use AUTH_TOKEN for gated access, run behind a VPN, and keep forwarded ports under review.',
  },
  {
    title: 'Educational use',
    body: 'Tracker rules still apply. Rustatio is provided for educational use, and you remain responsible for how you deploy it.',
  },
];

/** Stores the frequently asked questions rendered near the footer. */
export const faq: FaqItem[] = [
  {
    question: 'What can Rustatio emulate?',
    answer:
      'Six client profiles: uTorrent, qBittorrent, Transmission, Deluge, BitTorrent, and rTorrent, with matching versions and announce behavior.',
  },
  {
    question: 'Can I run it on a server?',
    answer: 'Yes. The Docker image is built for self-hosted deployments on servers, homelabs, and NAS devices.',
  },
  {
    question: 'Does the web build need a proxy?',
    answer: 'Usually. Most trackers block browser requests, so the web build needs a CORS proxy for announces.',
  },
  {
    question: 'Is remote access protected?',
    answer: 'Self-hosted deployments can require an AUTH_TOKEN for both the UI and the API.',
  },
  {
    question: 'Which desktop platforms are supported?',
    answer: 'Windows, macOS, and Linux, with an installer or package for each.',
  },
  {
    question: 'Where should I start?',
    answer:
      'Use the desktop app for the shortest path, or Docker if you want a persistent instance with remote access.',
  },
];
