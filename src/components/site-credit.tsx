'use client';

import type { JSX } from 'react';

import { avatarUrl, links } from '../content';

/** Renders the shared copyright, license, and author credit. */
export function SiteCredit(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <span className="site-credit">
      <span className="site-credit-copyright">
        Copyright © <span aria-label={`Current year ${currentYear}`}>{currentYear}</span>{' '}
        <a className="site-credit-author" href={links.profile} target="_blank" rel="noreferrer">
          <img className="site-credit-avatar" src={avatarUrl} alt="" width={14} height={14} loading="lazy" decoding="async" />
          <span className="site-credit-name">takitsu21</span>
        </a>
      </span>
      <span className="site-credit-legal">
        Rustatio is{' '}
        <a href={links.license} target="_blank" rel="noreferrer">
          MIT licensed
        </a>
        . For educational use.
      </span>
    </span>
  );
}
