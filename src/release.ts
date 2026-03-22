import { links, type ReleaseTarget } from './content';

export interface ReleaseInfo {
  tag: string;
  url: string;
}

interface GitHubReleaseResponse {
  tag_name?: string;
  html_url?: string;
}

/** Stores the GitHub API endpoint used to hydrate the latest release links. */
const RELEASE_API_URL = 'https://api.github.com/repos/takitsu21/rustatio/releases/latest';

/** Removes the leading version prefix from a release tag when needed. */
export function normalizeTag(tag: string): string {
  return tag.startsWith('v') ? tag.slice(1) : tag;
}

/** Builds the platform-specific asset URLs for a given release tag. */
export function buildReleaseLinks(tag: string): Record<ReleaseTarget, string> {
  const version = normalizeTag(tag);

  return {
    'windows-exe': `${links.repo}/releases/download/${tag}/Rustatio_${version}_x64-setup.exe`,
    'macos-dmg': `${links.repo}/releases/download/${tag}/Rustatio_${version}_x64.dmg`,
    'linux-deb': `${links.repo}/releases/download/${tag}/Rustatio_${version}_amd64.deb`,
    'linux-rpm': `${links.repo}/releases/download/${tag}/Rustatio_${version}_x86_64.rpm`,
    'linux-appimage': `${links.repo}/releases/download/${tag}/Rustatio_${version}_amd64.AppImage`,
  };
}

/** Builds the user-facing release label displayed on the homepage. */
export function getReleaseLabel(tag: string): string {
  return `Latest release ${tag}`;
}

/** Fetches the latest release metadata from GitHub for client-side hydration. */
export async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const response = await fetch(RELEASE_API_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GitHubReleaseResponse;
    if (!data.tag_name) {
      return null;
    }

    return {
      tag: data.tag_name,
      url: data.html_url || links.releases,
    };
  } catch {
    return null;
  }
}
