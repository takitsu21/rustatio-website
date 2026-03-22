import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

/** Stores the shared ignore patterns for generated and dependency files. */
const ignoredPaths = ['dist/**', 'node_modules/**', '.next/**', 'out/**', 'next-env.d.ts'];

/** Exports the shared ESLint rules for the site. */
const eslintConfig = [
  {
    ignores: ignoredPaths,
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
