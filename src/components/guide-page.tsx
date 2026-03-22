'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';

import { brandIconPath, links } from '../content';
import type { GuideDocument } from '../guide/markdown';
import { ThemeToggle } from './theme-toggle';

/** Renders the guide page and wires up client-side copy buttons for code blocks. */
export function GuidePage({ guide }: Readonly<{ guide: GuideDocument }>): JSX.Element {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) {
      return;
    }

    const cleanups: Array<() => void> = [];

    article.querySelectorAll('pre').forEach((block, index) => {
      if (block.querySelector('.guide-copy-btn')) {
        return;
      }

      const code = block.querySelector('code');
      if (!code) {
        return;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'guide-copy-btn';
      button.setAttribute('aria-label', 'Copy code block');
      button.setAttribute('data-copy-state', 'idle');
      button.setAttribute('data-copy-index', String(index));
      button.textContent = 'Copy';

      let resetTimer: number | null = null;

      const handleClick = async () => {
        const text = code.textContent || '';

        try {
          await navigator.clipboard.writeText(text);
          button.textContent = 'Copied';
          button.setAttribute('data-copy-state', 'done');
        } catch {
          button.textContent = 'Failed';
          button.setAttribute('data-copy-state', 'error');
        }

        if (resetTimer !== null) {
          window.clearTimeout(resetTimer);
        }

        resetTimer = window.setTimeout(() => {
          button.textContent = 'Copy';
          button.setAttribute('data-copy-state', 'idle');
        }, 1800);
      };

      button.addEventListener('click', handleClick);
      block.append(button);

      cleanups.push(() => {
        button.removeEventListener('click', handleClick);
        if (resetTimer !== null) {
          window.clearTimeout(resetTimer);
        }
        button.remove();
      });
    });

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [guide.html]);

  const primarySections = useMemo(() => guide.sections.filter(section => section.depth === 2), [guide.sections]);

  return (
    <div className="guide-shell">
      <header className="guide-topbar">
        <Link className="guide-brand" href="/" aria-label="Rustatio home">
          <img className="guide-brand-mark" src={brandIconPath} alt="" width={32} height={32} />
          <span>Rustatio</span>
        </Link>
        <button
          className={`guide-nav-toggle${isNavOpen ? ' is-open' : ''}`}
          type="button"
          aria-expanded={isNavOpen}
          aria-controls="guide-nav"
          aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => {
            setIsNavOpen(open => !open);
          }}
        >
          <span className="guide-nav-toggle-bar"></span>
          <span className="guide-nav-toggle-bar"></span>
        </button>
        <nav className={`guide-topnav${isNavOpen ? ' is-open' : ''}`} id="guide-nav" aria-label="Guide navigation">
          <div className="guide-topnav-links">
            <Link href="/" onClick={() => setIsNavOpen(false)}>
              Home
            </Link>
            <Link href={links.guide} onClick={() => setIsNavOpen(false)}>
              Docs
            </Link>
            <a href={links.liveDemo} target="_blank" rel="noreferrer" onClick={() => setIsNavOpen(false)}>
              Live demo
            </a>
            <a href={links.repo} target="_blank" rel="noreferrer" onClick={() => setIsNavOpen(false)}>
              GitHub
            </a>
          </div>
          <div className="guide-topnav-actions">
            <Link className="guide-btn guide-topbar-btn" href="/#download" onClick={() => setIsNavOpen(false)}>
              Download
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <div className="guide-layout">
        <aside className="guide-sidebar">
          <p className="guide-sidebar-label">Guide</p>
          <nav className="guide-sidebar-nav" aria-label="Guide sections">
            {primarySections.map(section => (
              <a href={`#${section.slug}`} key={section.slug}>
                {section.text}
              </a>
            ))}
          </nav>
        </aside>

        <main className="guide-main">
          <section className="guide-hero">
            <span className="guide-kicker">Generated from README.md</span>
            <h1>{guide.title}</h1>
            <p>{guide.intro}</p>
            <div className="guide-hero-actions">
              <a className="guide-btn guide-btn-primary" href="#getting-started">
                Open the docs
              </a>
              <Link className="guide-btn guide-btn-secondary" href="/#download">
                Download Rustatio
              </Link>
              <a className="guide-link" href={links.sourceReadme} target="_blank" rel="noreferrer">
                View source README
              </a>
            </div>
          </section>

          <article className="guide-article" ref={articleRef} dangerouslySetInnerHTML={{ __html: guide.html }}></article>
        </main>

        <aside className="guide-toc">
          <p className="guide-sidebar-label">On this page</p>
          <nav className="guide-sidebar-nav guide-sidebar-nav-compact" aria-label="Table of contents">
            {guide.sections.map(section => (
              <a className={`depth-${section.depth}`} href={`#${section.slug}`} key={section.slug}>
                {section.text}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
