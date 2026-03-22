import type { JSX } from 'react';

import { HomePage } from '../src/components/home-page';

/** Forces the homepage to stay fully static during Next.js export. */
export const dynamic = 'error';

/** Renders the exported homepage route. */
export default function Page(): JSX.Element {
  return <HomePage />;
}
