/** Defines the supported release asset keys used on the download cards. */
export type ReleaseTarget =
  | 'windows-exe'
  | 'macos-dmg'
  | 'linux-deb'
  | 'linux-rpm'
  | 'linux-appimage';

export interface LinkMap {
  guide: string;
  repo: string;
  releases: string;
  sourceReadme: string;
  docker: string;
  liveDemo: string;
  webGuide: string;
  packages: string;
}

export interface HeroStat {
  eyebrow: string;
  value: string;
  detail: string;
  items: string[];
  tone: 'accent' | 'good' | 'warning';
}

export interface ProofCard {
  title: string;
  body: string;
}

export type ShowcaseTone = 'primary' | 'secondary' | 'warning' | 'neutral';

export interface ShowcaseItem {
  label: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  tone: ShowcaseTone;
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

/** Stores the shared destination links used across the site. */
export const links: LinkMap = {
  guide: withBasePath('/guide/'),
  repo: 'https://github.com/takitsu21/rustatio',
  releases: 'https://github.com/takitsu21/rustatio/releases/latest',
  sourceReadme: 'https://github.com/takitsu21/rustatio#readme',
  docker: 'https://github.com/takitsu21/rustatio#docker-self-hosted',
  liveDemo: 'https://takitsu21.github.io/rustatio/',
  webGuide: 'https://github.com/takitsu21/rustatio/blob/main/WEB_VERSION.md',
  packages: 'https://github.com/takitsu21/rustatio/pkgs/container/rustatio',
};

/** Lists the hero metrics shown near the top of the homepage. */
export const heroStats: HeroStat[] = [
  {
    eyebrow: 'Built with',
    value: 'Rust + Tauri',
    detail: 'Desktop-native delivery with a fast Rust core and a polished shell.',
    items: ['Rust core', 'Native windowing'],
    tone: 'accent',
  },
  {
    eyebrow: 'Supports',
    value: '5 client profiles',
    detail: 'Ready-to-use presets for the most common tracker-facing clients.',
    items: ['uTorrent', 'BitTorrent', 'qBittorrent', 'Transmission', 'Deluge'],
    tone: 'good',
  },
  {
    eyebrow: 'Deploy as',
    value: 'Desktop, Docker, Web',
    detail: 'Choose the setup that fits your local machine, server, or browser flow.',
    items: ['Desktop', 'Docker', 'Web'],
    tone: 'warning',
  },
];

/** Describes the proof cards shown in the feature grid. */
export const proofCards: ProofCard[] = [
  {
    title: 'Client emulation',
    body: 'Switch between popular client fingerprints with tracker-aware peer IDs, headers, and announce behavior.',
  },
  {
    title: 'Session control',
    body: 'Tune rates, variance, stop conditions, and progressive behavior so sessions look intentional instead of mechanical.',
  },
  {
    title: 'Live analytics',
    body: 'Watch upload, download, ratio, peer activity, and logs in a single interface while a session is running.',
  },
];

/** Defines the screenshot showcase content rendered on the homepage. */
export const showcase: ShowcaseItem[] = [
  {
    label: 'Main workspace',
    title: 'Configuration cockpit',
    body: 'Start with the main workspace: load a torrent, pick a client profile, and shape the session from one dense control panel.',
    image: withBasePath('/screenshots/dark-theme.png'),
    alt: 'Rustatio desktop interface in dark mode',
    tone: 'primary',
  },
  {
    label: 'Live telemetry',
    title: 'Real-time metrics',
    body: 'Watch ratio movement, transfer history, and peer distribution while the session evolves.',
    image: withBasePath('/screenshots/dark-metrics.png'),
    alt: 'Rustatio metrics and performance charts',
    tone: 'secondary',
  },
  {
    label: 'Multi-session view',
    title: 'Grid workflows',
    body: 'Scan several active sessions at once with a denser grid layout when you need to compare state quickly.',
    image: withBasePath('/screenshots/grid-view.png'),
    alt: 'Rustatio grid view for multiple sessions',
    tone: 'secondary',
  },
  {
    label: 'Automation',
    title: 'Watch folder intake',
    body: 'Point Rustatio at a directory and let incoming torrents appear automatically for faster recurring workflows.',
    image: withBasePath('/screenshots/watch-folder.png'),
    alt: 'Rustatio watch folder configuration screen',
    tone: 'primary',
  },
  {
    label: 'Remote access',
    title: 'Self-hosted access',
    body: 'Protect remote deployments with token-based authentication when your server is exposed beyond localhost.',
    image: withBasePath('/screenshots/dark-authentication.png'),
    alt: 'Rustatio authentication screen',
    tone: 'warning',
  },
  {
    label: 'Alternate theme',
    title: 'Light theme clarity',
    body: 'Switch to a bright theme without losing the same dense layout, controls, and visual hierarchy.',
    image: withBasePath('/screenshots/light-theme.png'),
    alt: 'Rustatio interface in light theme',
    tone: 'neutral',
  },
];

/** Stores the default hero screenshot used for dark theme rendering. */
export const heroPreview = withBasePath('/screenshots/dark-theme.png');

/** Stores the alternate hero screenshot used for light theme rendering. */
export const heroPreviewLight = withBasePath('/screenshots/light-theme.png');

/** Defines the workflow steps rendered in the process section. */
export const steps: Step[] = [
  {
    id: '01',
    title: 'Load a torrent',
    body: 'Import a file, let Rustatio read the tracker metadata, and start from a real session baseline.',
  },
  {
    id: '02',
    title: 'Choose a profile',
    body: 'Select the client identity and version that matches the behavior you want to emulate.',
  },
  {
    id: '03',
    title: 'Shape the session',
    body: 'Set upload and download targets, randomness, stop conditions, and any networking constraints.',
  },
  {
    id: '04',
    title: 'Run and monitor',
    body: 'Start the session and watch ratio, charts, logs, and peer flow update in real time.',
  },
];

/** Defines the download cards and their associated actions. */
export const downloadCards: DownloadCard[] = [
  {
    title: 'Windows',
    body: 'Install the desktop app with a native setup executable and keep the full feature set outside the browser.',
    meta: 'Best for local sessions with no CORS limitations.',
    actions: [
      { label: 'Download installer', kind: 'release', target: 'windows-exe' },
      { label: 'All releases', href: links.releases, kind: 'link' },
    ],
  },
  {
    title: 'macOS',
    body: 'Grab the desktop DMG and run Rustatio with a native interface built for repeatable workflows.',
    meta: 'Ideal if you want the desktop UI without extra browser setup.',
    actions: [
      { label: 'Download DMG', kind: 'release', target: 'macos-dmg' },
      { label: 'Release notes', href: links.releases, kind: 'link' },
    ],
  },
  {
    title: 'Linux',
    body: 'Choose the package that fits your distribution or go with AppImage for a portable desktop install.',
    meta: 'DEB, RPM, and AppImage are all available from the latest release.',
    actions: [
      { label: 'DEB', kind: 'release', target: 'linux-deb' },
      { label: 'RPM', kind: 'release', target: 'linux-rpm' },
      { label: 'AppImage', kind: 'release', target: 'linux-appimage' },
    ],
  },
  {
    title: 'Docker',
    body: 'Run Rustatio on a server, NAS, or homelab machine and access the shared web UI from anywhere on your network.',
    meta: 'Good fit when you want persistent self-hosted control.',
    actions: [
      { label: 'Docker quick start', href: links.docker, kind: 'link' },
      { label: 'Container package', href: links.packages, kind: 'link' },
    ],
  },
  {
    title: 'Web app',
    body: 'Launch the browser build when you need a quick session from any device and can provide a CORS proxy.',
    meta: 'The same shared UI, delivered through WebAssembly.',
    actions: [
      { label: 'Launch live demo', href: links.liveDemo, kind: 'link' },
      { label: 'CORS setup guide', href: links.webGuide, kind: 'link' },
    ],
  },
];

/** Describes the deployment modes presented in the utility section. */
export const useCases: ContentCard[] = [
  {
    title: 'Desktop sessions',
    body: 'Stay local, avoid browser restrictions, and work with the most direct install path on Windows, macOS, or Linux.',
  },
  {
    title: 'Home server or NAS',
    body: 'Use Docker to keep Rustatio online in a persistent environment with optional authentication and watch folders.',
  },
  {
    title: 'Remote web access',
    body: 'Expose the shared UI to another device, secure it with a token, and keep operational visibility from anywhere.',
  },
];

/** Defines the safeguard messaging shown beside the deployment modes. */
export const safeguards: ContentCard[] = [
  {
    title: 'Operational controls',
    body: 'Use AUTH_TOKEN for gated access, run behind a VPN, and follow forwarded port changes when your environment needs it.',
  },
  {
    title: 'Educational-use notice',
    body: 'Tracker rules still apply. Rustatio is provided for educational use, and users remain responsible for how they deploy it.',
  },
];

/** Stores the frequently asked questions rendered near the footer. */
export const faq: FaqItem[] = [
  {
    question: 'What versions are available?',
    answer: 'Rustatio ships as a desktop app, a Docker-hosted server, and a browser-based web build.',
  },
  {
    question: 'Which torrent clients can Rustatio emulate?',
    answer: 'The current presets include uTorrent, BitTorrent, qBittorrent, Transmission, and Deluge.',
  },
  {
    question: 'Can I run it on a server or NAS?',
    answer: 'Yes. The Docker image is designed for self-hosted deployments and works well on servers, homelabs, and NAS devices.',
  },
  {
    question: 'Does the web UI support authentication?',
    answer: 'Yes. Self-hosted deployments can require an AUTH_TOKEN for UI and API access.',
  },
  {
    question: 'Is the browser build enough on its own?',
    answer: 'It works, but most trackers block browser requests, so a CORS proxy is usually required for the web build.',
  },
  {
    question: 'Where should I start?',
    answer: 'Use the desktop app if you want the quickest path, or Docker if you want a persistent instance with remote access.',
  },
];
