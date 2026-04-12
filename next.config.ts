import type { NextConfig } from 'next';

/** Detects whether the current build is running in CI (GitHub Actions or Forgejo Actions). */
const isCIPagesBuild = process.env.GITHUB_ACTIONS === 'true';

/** Stores the repository name used for subpath deployments (GitHub Pages / Codeberg Pages). */
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'rustatio-website';

/** Stores the base path applied to Pages deployments (both GitHub and Codeberg). */
const basePath = isCIPagesBuild ? `/${repositoryName}` : '';

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
