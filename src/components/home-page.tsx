'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import {
  brandIconPath,
  clients,
  demo,
  downloadCards,
  faq,
  features,
  heroCopy,
  links,
  safeguards,
  screenshots,
  selfHosted,
  specSheet,
  steps,
  themeNames,
  themePreview,
  useCases,
  type ReleaseTarget,
  type ScreenshotPair,
} from '../content';
import { ClientIcon } from './client-icon';
import { GitHubIcon } from './github-icon';
import { SiteCredit } from './site-credit';
import { ThemeToggle } from './theme-toggle';
import { buildReleaseLinks, fetchLatestRelease, getReleaseLabel } from '../release';

/** Stores the fallback label shown before the latest release request resolves. */
const DEFAULT_RELEASE_LABEL = 'Latest release';

/** Stores the footer copy rendered on the homepage. */
const FOOTER_COPY = 'A modern BitTorrent ratio faker.';

/** Renders a dark and light screenshot pair; CSS shows the active theme. */
function ThemeScreenshot({
  pair,
  priority = false,
  eager = false,
}: Readonly<{ pair: ScreenshotPair; priority?: boolean; eager?: boolean }>): JSX.Element {
  const loading = priority || eager ? 'eager' : 'lazy';

  return (
    <>
      <img
        className="theme-shot theme-shot-dark"
        src={pair.dark}
        alt={pair.alt}
        loading={loading}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
      <img className="theme-shot theme-shot-light" src={pair.light} alt={pair.alt} loading={loading} decoding="async" />
    </>
  );
}

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

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="Rustatio home">
            <img className="brand-mark" src={brandIconPath} alt="" width={28} height={28} />
            <span className="brand-name">Rustatio</span>
          </a>
          <button
            className={`nav-toggle${isNavOpen ? ' is-open' : ''}`}
            type="button"
            aria-expanded={isNavOpen}
            aria-controls="home-nav"
            aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => {
              setIsNavOpen((open) => !open);
            }}
          >
            <span className="nav-toggle-bar"></span>
            <span className="nav-toggle-bar"></span>
          </button>
          <nav className={`site-nav${isNavOpen ? ' is-open' : ''}`} id="home-nav" aria-label="Primary">
            <div className="nav-links">
              <a href="#demo" onClick={() => setIsNavOpen(false)}>
                Demo
              </a>
              <a href="#fleet" onClick={() => setIsNavOpen(false)}>
                Fleet
              </a>
              <a href="#automation" onClick={() => setIsNavOpen(false)}>
                Automation
              </a>
              <a href="#metrics" onClick={() => setIsNavOpen(false)}>
                Metrics
              </a>
              <a href="#download" onClick={() => setIsNavOpen(false)}>
                Install
              </a>
              <a href={links.guide} onClick={() => setIsNavOpen(false)}>
                Docs
              </a>
              <a
                className="github-link"
                href={links.repo}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsNavOpen(false)}
              >
                <GitHubIcon />
                GitHub
              </a>
            </div>
            <div className="nav-actions">
              <ThemeToggle />
              <a className="btn btn-primary btn-small" href="#download" onClick={() => setIsNavOpen(false)}>
                Download
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero shell">
          <div className="hero-copy">
            <p className="hero-kicker">
              <span className="live-dot" aria-hidden="true"></span>
              <span>{releaseLabel}</span>
              <span className="kicker-sep">/</span>
              <span>sample data</span>
            </p>
            <h1>{heroCopy.title}</h1>
            <p className="hero-lede">{heroCopy.lede}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#download">
                Download Rustatio
              </a>
              <a className="btn btn-secondary" href={links.liveDemo} target="_blank" rel="noreferrer">
                Open live demo
              </a>
            </div>
            <p className="hero-note">{heroCopy.note}</p>
          </div>

          <figure className="hero-frame">
            <div className="frame-bar">
              <span className="frame-title">
                Rustatio <span className="frame-slash">/</span> fleet
              </span>
              <span className="frame-badge">sample data</span>
            </div>
            <div className="frame-screen">
              <ThemeScreenshot
                pair={{
                  dark: screenshots.darkTheme,
                  light: screenshots.lightTheme,
                  alt: 'Rustatio grid view with five sample sessions',
                }}
                priority
              />
            </div>
            <figcaption className="frame-readout">
              {heroCopy.readout.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </figcaption>
          </figure>
        </section>

        <section className="spec-band shell" aria-label="Rustatio at a glance">
          <dl>
            {specSheet.map((item) => (
              <div className="spec-item" key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="client-band shell" aria-label="Supported clients">
          <div className="client-band-head">
            <p className="client-band-title">Trackers see a familiar client.</p>
            <p className="client-band-note">Six profiles, each with the version string trackers expect.</p>
          </div>
          <ul className="client-list">
            {clients.map((client) => (
              <li className="client-item" key={client.name}>
                <span className="client-mark">
                  <ClientIcon name={client.icon} className="client-icon" />
                </span>
                <span className="client-copy">
                  <span className="client-name">{client.name}</span>
                  <span className="client-version">{client.version}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="section shell" id="demo">
          <aside className="section-rail">
            <p className="rail-label">Demo</p>
          </aside>
          <div className="section-body">
            <div className="demo-heading">
              <h2>{demo.title}</h2>
              <p>{demo.body}</p>
            </div>
            <figure className="demo-frame">
              <div className="frame-bar">
                <span className="frame-title">
                  Rustatio <span className="frame-slash">/</span> walkthrough
                </span>
              </div>
              <div className="demo-screen">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={demo.poster}
                  aria-label="Rustatio product walkthrough"
                >
                  <source src={demo.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <figcaption className="frame-readout">
                {demo.chapters.map((chapter) => (
                  <span key={chapter}>{chapter}</span>
                ))}
              </figcaption>
            </figure>
          </div>
        </section>

        {features.map((feature) => (
          <section className="section shell" id={feature.id} key={feature.id}>
            <aside className="section-rail">
              <p className="rail-label">{feature.label}</p>
            </aside>
            <div className="section-body">
              <article className={`feature-row${feature.mediaSide === 'left' ? ' media-left' : ''}`}>
                <div className="feature-copy">
                  <h2>{feature.title}</h2>
                  <p>{feature.body}</p>
                  <ul className="feature-points">
                    {feature.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <figure className="feature-media">
                  <ThemeScreenshot pair={feature.image} />
                  <figcaption>{feature.caption}</figcaption>
                </figure>
              </article>
            </div>
          </section>
        ))}

        <section className="section shell" id="themes">
          <aside className="section-rail">
            <p className="rail-label">Appearance</p>
          </aside>
          <div className="section-body">
            <div className="theme-block">
              <div className="theme-copy">
                <h2>{themePreview.title}</h2>
                <p>{themePreview.body}</p>
                <ul className="theme-list" aria-label="Available app themes">
                  {themeNames.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
              <figure className="theme-sheet">
                <img
                  src={themePreview.image}
                  alt={themePreview.alt}
                  width={2000}
                  height={634}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{themePreview.caption}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="section shell" id="self-hosted">
          <aside className="section-rail">
            <p className="rail-label">Self-hosted</p>
          </aside>
          <div className="section-body">
            <div className="split-block split-media-left">
              <figure className="split-media split-media-narrow">
                <ThemeScreenshot pair={selfHosted.image} eager />
                <figcaption>{selfHosted.caption}</figcaption>
              </figure>
              <div className="split-copy">
                <h2>{selfHosted.title}</h2>
                <p>{selfHosted.body}</p>
                <ul className="feature-points">
                  {selfHosted.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <a className="text-link" href={links.docker} target="_blank" rel="noreferrer">
                  Read the Docker guide
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section shell" id="workflow">
          <aside className="section-rail">
            <p className="rail-label">Workflow</p>
          </aside>
          <div className="section-body">
            <h2>From a file on disk to a session in motion.</h2>
            <ol className="step-list">
              {steps.map((step) => (
                <li className="step-row" key={step.id}>
                  <span className="step-number">{step.id}</span>
                  <div className="step-copy">
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section shell" id="download">
          <aside className="section-rail">
            <p className="rail-label">Install</p>
            <p className="rail-meta">{releaseLabel}</p>
          </aside>
          <div className="section-body">
            <div className="section-heading-row">
              <h2>Pick the build that matches the machine.</h2>
              <p>Desktop packages, a Docker image, and a browser build share the same interface.</p>
            </div>
            <div className="install-table">
              {downloadCards.map((card) => (
                <div className="install-row" key={card.title}>
                  <div className="install-name">
                    <h3>{card.title}</h3>
                    <p className="install-meta">{card.meta}</p>
                  </div>
                  <p className="install-body">{card.body}</p>
                  <div className="install-actions">
                    {card.actions.map((action) => {
                      if (action.kind === 'release') {
                        return (
                          <a
                            className="btn btn-primary btn-small"
                            key={`${card.title}-${action.target}`}
                            href={releaseLinks[action.target] || links.releases}
                          >
                            {action.label}
                          </a>
                        );
                      }

                      return (
                        <a
                          className="btn btn-secondary btn-small"
                          key={`${card.title}-${action.label}`}
                          href={action.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {action.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell" id="guardrails">
          <aside className="section-rail">
            <p className="rail-label">Guardrails</p>
          </aside>
          <div className="section-body">
            <h2>Built for power users. Warnings stay visible.</h2>
            <div className="guardrail-grid">
              <div className="guardrail-column">
                <h3>Where it fits</h3>
                <ul className="plain-list">
                  {useCases.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong>
                      <span>{item.body}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="guardrail-column">
                <h3>What to know</h3>
                <ul className="plain-list">
                  {safeguards.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong>
                      <span>{item.body}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section shell" id="questions">
          <aside className="section-rail">
            <p className="rail-label">Questions</p>
          </aside>
          <div className="section-body">
            <h2>Short answers before you commit.</h2>
            <div className="faq-list">
              {faq.map((item) => (
                <details className="faq-row" key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="closing shell">
          <div className="closing-copy">
            <h2>Take the wheel.</h2>
            <p>Install the desktop app, run it from Docker, or open the web build and start with a sample session.</p>
          </div>
          <div className="closing-actions">
            <a className="btn btn-primary" href="#download">
              Download Rustatio
            </a>
            <a className="btn btn-secondary" href={links.guide}>
              Read the docs
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div className="footer-brand">
            <img className="footer-mark" src={brandIconPath} alt="" width={24} height={24} />
            <div>
              <span className="footer-name">Rustatio</span>
              <p>{FOOTER_COPY}</p>
            </div>
          </div>
          <div className="footer-links">
            <a href={links.guide}>Docs</a>
            <a href={links.liveDemo} target="_blank" rel="noreferrer">
              Live demo
            </a>
            <a href={links.docker} target="_blank" rel="noreferrer">
              Docker
            </a>
            <a className="github-link" href={links.repo} target="_blank" rel="noreferrer">
              <GitHubIcon />
              GitHub
            </a>
          </div>
          <div className="footer-copy">
            <SiteCredit />
          </div>
        </div>
      </footer>
    </div>
  );
}
