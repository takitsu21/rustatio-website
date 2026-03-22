'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';

import {
  brandIconPath,
  downloadCards,
  faq,
  heroPreview,
  heroPreviewLight,
  heroStats,
  links,
  proofCards,
  safeguards,
  showcase,
  steps,
  useCases,
  type ReleaseTarget,
} from '../content';
import { ThemeToggle } from './theme-toggle';
import { buildReleaseLinks, fetchLatestRelease, getReleaseLabel } from '../release';

/** Stores the fallback label shown before the latest release request resolves. */
const DEFAULT_RELEASE_LABEL = 'Latest release';

/** Stores the footer copy rendered on the homepage. */
const FOOTER_COPY = 'Built with Rust, Tauri, and a shared Svelte UI.';

/** Renders the fully static homepage as a small client component for hydration features. */
export function HomePage(): JSX.Element {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [releaseLabel, setReleaseLabel] = useState(DEFAULT_RELEASE_LABEL);
  const [releaseLinks, setReleaseLinks] = useState<Partial<Record<ReleaseTarget, string>>>({});

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const release = await fetchLatestRelease();
      if (!release || cancelled) {
        return;
      }

      setReleaseLabel(getReleaseLabel(release.tag));
      setReleaseLinks(buildReleaseLinks(release.tag));
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Rustatio home">
          <img className="brand-mark" src={brandIconPath} alt="" width={32} height={32} />
          <span className="brand-name">Rustatio</span>
        </a>
        <button
          className={`nav-toggle${isNavOpen ? ' is-open' : ''}`}
          type="button"
          aria-expanded={isNavOpen}
          aria-controls="home-nav"
          aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => {
            setIsNavOpen(open => !open);
          }}
        >
          <span className="nav-toggle-bar"></span>
          <span className="nav-toggle-bar"></span>
        </button>
        <nav className={`topnav${isNavOpen ? ' is-open' : ''}`} id="home-nav" aria-label="Primary">
          <div className="topnav-links">
            <a href="#features" onClick={() => setIsNavOpen(false)}>
              Features
            </a>
            <a href="#live-demo" onClick={() => setIsNavOpen(false)}>
              Live demo
            </a>
            <a href={links.guide} onClick={() => setIsNavOpen(false)}>
              Docs
            </a>
            <a href={links.repo} target="_blank" rel="noreferrer" onClick={() => setIsNavOpen(false)}>
              GitHub
            </a>
          </div>
          <div className="topnav-actions">
            <a className="btn btn-nav" href="#download" onClick={() => setIsNavOpen(false)}>
              Download
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-frame">
          <div className="hero-grid">
            <div className="hero-copy reveal reveal-1">
              <div className="eyebrow-row">
                <span className="eyebrow-pill">Rust-powered</span>
                <span className="eyebrow-pill muted">{releaseLabel}</span>
              </div>
              <h1 className="hero-wordmark" aria-label="Rustatio">
                <img className="hero-wordmark-mark" src={brandIconPath} alt="" width={96} height={96} />
                <span>Rustatio</span>
              </h1>
              <p className="hero-lead">
                Rustatio emulates popular torrent clients, shapes realistic transfer behavior, and keeps live session telemetry in one deliberate interface across desktop, Docker, and the web.
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href={links.guide}>
                  Get started
                </a>
                <a className="btn btn-download" href="#download">
                  Download
                </a>
                <a className="btn btn-secondary" href={links.docker} target="_blank" rel="noreferrer">
                  Run with Docker
                </a>
                <a className="text-link" href={links.repo} target="_blank" rel="noreferrer">
                  View on GitHub
                </a>
              </div>
              <div className="platform-strip">
                <span>Windows</span>
                <span>macOS</span>
                <span>Linux</span>
                <span>Docker</span>
                <span>Web UI</span>
              </div>
              <p className="hero-note">For educational use. Tracker rules and account risk still apply.</p>
            </div>

            <div className="hero-highlights reveal reveal-2">
              <div className="stats-grid">
                {heroStats.map(stat => (
                  <article className={`stat-card stat-card-${stat.tone}`} key={stat.value}>
                    <span className="stat-eyebrow">{stat.eyebrow}</span>
                    <strong>{stat.value}</strong>
                    <p>{stat.detail}</p>
                    <div className="stat-tags" aria-label={`${stat.eyebrow} details`}>
                      {stat.items.map(item => (
                        <span className="stat-tag" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-preview reveal reveal-2" aria-hidden="true">
            <div className="hero-visual">
              <div className="hero-shot">
                <img
                  src={heroPreview}
                  alt="Rustatio interface preview"
                  data-theme-shot
                  data-dark-src={heroPreview}
                  data-light-src={heroPreviewLight}
                />
              </div>
            </div>
            <div className="telemetry-stack">
              <article className="telemetry-card compact">
                <span className="chip chip-good">live stats</span>
                <strong>Ratio, rates, peers</strong>
                <p>Track upload, download, ratio movement, and peer activity while the session is running.</p>
              </article>
              <article className="telemetry-card compact">
                <span className="chip chip-accent">self-hosted</span>
                <strong>Docker, auth, watch folders</strong>
                <p>Run on a server or NAS with AUTH_TOKEN protection, optional watch folders, and VPN-friendly deployment.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="section-heading reveal reveal-1">
            <span className="section-label">Capability signals</span>
            <h2>Purpose-built for session control and visibility.</h2>
            <p>Rustatio stays direct: shape the session, run it, and see what is happening without digging through tabs.</p>
          </div>
          <div className="card-grid proof-grid">
            {proofCards.map(card => (
              <article className="feature-card reveal reveal-2" key={card.title}>
                <div className="feature-accent"></div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="screenshots" className="section showcase-section">
          <div className="section-heading reveal reveal-1">
            <span className="section-label">Screenshots</span>
            <h2>The product, shown as it actually runs.</h2>
            <p>Every view shown here comes straight from the product: the main workspace, live metrics, grid workflows, watch folders, remote auth, and the light theme.</p>
          </div>
          <div className="showcase-collage reveal reveal-2">
            <div className="showcase-stage">
              {showcase.map((item, index) => (
                <figure className={`showcase-pane showcase-pane-${index + 1} showcase-${item.tone}`} key={item.title}>
                  <img src={item.image} alt={item.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                </figure>
              ))}
            </div>
            <div className="showcase-notes">
              {showcase.map(item => (
                <article className={`showcase-note showcase-${item.tone}`} key={item.label}>
                  <span className="showcase-label">{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading reveal reveal-1">
            <span className="section-label">How it flows</span>
            <h2>From import to live session.</h2>
          </div>
          <div className="steps-grid">
            {steps.map(step => (
              <article className="step-card reveal reveal-2" key={step.id}>
                <span className="step-id">{step.id}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="live-demo" className="section">
          <div className="section-heading reveal reveal-1">
            <span className="section-label">Live demo</span>
            <h2>Open the browser build that is already running.</h2>
            <p>Try the public WebAssembly version on GitHub Pages, see the UI in action, and decide whether you want the desktop app, Docker deployment, or the hosted demo.</p>
          </div>
          <div className="cta-row reveal reveal-2">
            <a className="btn btn-primary" href={links.liveDemo} target="_blank" rel="noreferrer">
              Open live demo
            </a>
          </div>
        </section>

        <section id="download" className="section download-section">
          <div className="section-heading reveal reveal-1">
            <span className="section-label">Download</span>
            <h2>Pick the build that matches your setup.</h2>
            <p>{releaseLabel}</p>
          </div>
          <div className="download-grid">
            {downloadCards.map(card => (
              <article className="download-card reveal reveal-2" key={card.title}>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
                <small>{card.meta}</small>
                <div className="button-row">
                  {card.actions.map(action => {
                    if (action.kind === 'release') {
                      return (
                        <a
                          className="btn btn-download"
                          key={`${card.title}-${action.target}`}
                          href={releaseLinks[action.target] || links.releases}
                        >
                          {action.label}
                        </a>
                      );
                    }

                    return (
                      <a className="btn btn-ghost" key={`${card.title}-${action.label}`} href={action.href} target="_blank" rel="noreferrer">
                        {action.label}
                      </a>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section utility-section">
          <div className="utility-grid">
            <div>
              <div className="section-heading reveal reveal-1 left-tight">
                <span className="section-label">Where it fits</span>
                <h2>Choose the delivery mode that matches the way you work.</h2>
              </div>
              <div className="stack-grid">
                {useCases.map(item => (
                  <article className="stack-card reveal reveal-2" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <div className="section-heading reveal reveal-1 left-tight">
                <span className="section-label">Guardrails</span>
                <h2>Built for power users, with the warnings still visible.</h2>
              </div>
              <div className="stack-grid">
                {safeguards.map(item => (
                  <article className="stack-card safeguard-card reveal reveal-2" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section faq-section">
          <div className="section-heading reveal reveal-1">
            <span className="section-label">FAQ</span>
            <h2>Short answers before you jump in.</h2>
          </div>
          <div className="faq-grid">
            {faq.map(item => (
              <details className="faq-item reveal reveal-2" key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section final-cta reveal reveal-1">
          <div>
            <span className="section-label">Ready to start</span>
            <h2>Download or try the demo.</h2>
            <p>Cross-platform delivery, self-hosted options, and live session visibility from the same Rust-powered core.</p>
          </div>
          <div className="cta-row">
            <a className="btn btn-primary" href={links.guide}>
              Open docs
            </a>
            <a className="btn btn-secondary" href={links.liveDemo} target="_blank" rel="noreferrer">
              Open live demo
            </a>
            <a className="text-link" href={links.releases} target="_blank" rel="noreferrer">
              GitHub releases
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-links">
          <a href={links.guide}>Docs</a>
          <a href={links.liveDemo} target="_blank" rel="noreferrer">
            Live demo
          </a>
          <a href={links.docker} target="_blank" rel="noreferrer">
            Docker
          </a>
          <a href={links.repo} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={links.webGuide} target="_blank" rel="noreferrer">
            Web setup
          </a>
        </div>
        <span className="footer-copy">
          {FOOTER_COPY} <span aria-label={`Current year ${currentYear}`}>{currentYear}</span>
        </span>
      </footer>
    </div>
  );
}
