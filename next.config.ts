import type { NextConfig } from 'next';

/** Detects whether the current build is running for GitHub Pages deployment. */
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';

/** Stores the repository name used for GitHub Pages subpath deployments. */
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'rustatio-website';

/** Stores the base path applied to GitHub Pages deployments. */
const basePath = isGitHubPagesBuild ? `/${repositoryName}` : '';

/** Defines the static Next.js configuration for the exported site. */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
