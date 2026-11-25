import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import type { Root as HastRoot, Element as HastElement, Properties } from 'hast';
import type { Root as MdastRoot } from 'mdast';

export interface GuideSection {
  depth: number;
  text: string;
  slug: string;
}

export interface GuideDocument {
  title: string;
  intro: string;
  html: string;
  sections: GuideSection[];
}

/** Matches the first README title so the page chrome can provide the title instead. */
const README_TITLE_PATTERN = /^#\s+.*Rustatio\s*$/m;

/** Provides a fallback intro when the README has no paragraph after its first heading. */
const DEFAULT_GUIDE_INTRO = 'Installation, Docker deployment, web usage, and configuration notes generated directly from the repository README.';

/** Matches GitHub-style blockquote alert markers such as [!IMPORTANT]. */
const GITHUB_ALERT_PATTERN = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/;

/** Identifies GitHub user attachment links used for README demo videos. */
const GITHUB_ATTACHMENT_PREFIX = 'https://github.com/user-attachments/assets/';

/** Stores the repository blob URL prefix for rewritten markdown links. */
const REPO_BLOB_BASE = 'https://github.com/takitsu21/rustatio/blob/main/';

/** Stores the repository raw URL prefix for rewritten markdown images. */
const REPO_RAW_BASE = 'https://raw.githubusercontent.com/takitsu21/rustatio/main/';

/** Stores the optional GitHub Pages base path for rewritten local guide assets. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Stores the local walkthrough video used by the guide. */
const DEMO_VIDEO_SRC = `${BASE_PATH}/media/rustatio-demo.mp4`;

/** Stores the poster frame used before the guide walkthrough plays. */
const DEMO_POSTER_SRC = `${BASE_PATH}/screenshots/demo-poster.jpg`;

/** Builds a GitHub-compatible slugger for guide headings. */
function createSlugger(): GithubSlugger {
  return new GithubSlugger();
}

/** Removes the README logo and title, keeping the full docs body and every section. */
export function extractGuideMarkdown(readme: string): string {
  const title = readme.match(README_TITLE_PATTERN);
  if (!title || title.index === undefined) {
    return readme.trim();
  }

  return readme.slice(title.index + title[0].length).trim();
}

/** Removes the README intro paragraph after promoting it into the page hero. */
function removeIntroParagraph(markdown: string): string {
  const tree = unified().use(remarkParse).parse(markdown) as MdastRoot;
  const firstHeadingIndex = tree.children.findIndex(node => node.type === 'heading');
  const firstParagraphIndex = tree.children.findIndex(node => node.type === 'paragraph');

  if (firstParagraphIndex !== 0 || firstHeadingIndex <= 0) {
    return markdown;
  }

  const paragraph = tree.children[firstParagraphIndex];
  const start = paragraph.position?.start.offset;
  const end = paragraph.position?.end.offset;
  if (start === undefined || end === undefined) {
    return markdown;
  }

  return `${markdown.slice(0, start)}${markdown.slice(end)}`.trim();
}

/** Reads the first README paragraph after the title for the page intro. */
function getGuideIntro(markdown: string): string {
  const tree = unified().use(remarkParse).parse(markdown) as MdastRoot;
  const paragraph = tree.children.find(node => node.type === 'paragraph');
  return paragraph ? toString(paragraph) : DEFAULT_GUIDE_INTRO;
}

/** Removes markdown formatting so headings can be normalized for navigation labels. */
export function normalizeHeadingText(text: string): string {
  return text.replace(/^[^\p{Letter}\p{Number}]+/u, '').replace(/\s+/g, ' ').trim();
}

/** Converts a normalized heading into a GitHub-style URL slug. */
export function slugifyHeading(text: string): string {
  const slugger = createSlugger();
  return slugger.slug(normalizeHeadingText(text));
}

/** Collects second- and third-level headings from the guide markdown. */
export function collectSections(markdown: string): GuideSection[] {
  const slugger = createSlugger();
  const tree = unified().use(remarkParse).parse(markdown) as MdastRoot;
  const sections: GuideSection[] = [];

  visit(tree, 'heading', node => {
    if (node.depth !== 2 && node.depth !== 3) {
      return;
    }

    const text = normalizeHeadingText(toString(node));
    sections.push({
      depth: node.depth,
      text,
      slug: slugger.slug(text),
    });
  });

  return sections;
}

/** Rewrites markdown links so they remain valid in the exported site. */
export function rewriteHref(href: string): string {
  if (!href || href.startsWith('#') || href.startsWith('mailto:')) {
    return href;
  }

  if (/^(?:https?:)?\/\//.test(href)) {
    return href;
  }

  return `${REPO_BLOB_BASE}${href}`;
}

/** Rewrites markdown image URLs to static-site-friendly locations. */
export function rewriteImageSrc(src: string): string {
  if (!src) {
    return src;
  }

  if (/^(?:https?:)?\/\//.test(src)) {
    return src;
  }

  if (src.startsWith('screenshots/')) {
    return `${BASE_PATH}/${src}`;
  }

  if (src.startsWith('rustatio-desktop/icons/')) {
    return `${BASE_PATH}/android-chrome-512x512.png`;
  }

  return `${REPO_RAW_BASE}${src}`;
}

/** Ensures links and images point to the right static or upstream location. */
function rehypeRewriteAssets() {
  return (tree: HastRoot) => {
    visit(tree, 'element', node => {
      if (node.tagName === 'a') {
        const href = getStringProperty(node.properties, 'href');
        if (!href) {
          return;
        }

        const finalHref = rewriteHref(href);
        node.properties.href = finalHref;

        if (finalHref.startsWith(GITHUB_ATTACHMENT_PREFIX)) {
          node.tagName = 'video';
          node.properties = {
            className: ['guide-demo-video'],
            controls: true,
            playsInline: true,
            preload: 'metadata',
            poster: DEMO_POSTER_SRC,
          };
          node.children = [
            {
              type: 'element',
              tagName: 'source',
              properties: {
                src: DEMO_VIDEO_SRC,
                type: 'video/mp4',
              },
              children: [],
            },
            {
              type: 'text',
              value: 'Your browser does not support the video tag.',
            },
          ];
          return;
        }

        if (/^(?:https?:)?\/\//.test(finalHref)) {
          node.properties.target = '_blank';
          node.properties.rel = 'noreferrer';
        }
      }

      if (node.tagName === 'img') {
        const src = getStringProperty(node.properties, 'src');
        if (src) {
          node.properties.src = rewriteImageSrc(src);
        }
      }
    });
  };
}

/** Converts GitHub blockquote alerts into labelled callouts. */
function rehypeGitHubAlerts() {
  return (tree: HastRoot) => {
    visit(tree, 'element', node => {
      if (node.tagName !== 'blockquote') {
        return;
      }

      const firstParagraph = node.children.find(child => child.type === 'element' && child.tagName === 'p');
      if (!firstParagraph || firstParagraph.type !== 'element') {
        return;
      }

      const firstChild = firstParagraph.children[0];
      if (firstChild?.type !== 'text') {
        return;
      }

      const alert = firstChild.value.match(GITHUB_ALERT_PATTERN);
      if (!alert) {
        return;
      }

      firstChild.value = firstChild.value.slice(alert[0].length).replace(/^\n/, '');
      node.properties.className = mergeClassNames(node.properties.className, [
        'guide-alert',
        `guide-alert-${alert[1].toLowerCase()}`,
      ]);
      node.properties['data-alert'] = alert[1];
    });
  };
}

/** Adds stable ids to guide headings for sidebar and TOC navigation. */
function rehypeHeadingIds() {
  const slugger = createSlugger();

  return (tree: HastRoot) => {
    visit(tree, 'element', node => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') {
        return;
      }

      const text = normalizeHeadingText(getNodeText(node));
      node.properties.id = slugger.slug(text);
    });
  };
}

/** Adds the guide-specific code block classes and language labels. */
function rehypeGuideCodeBlocks() {
  return (tree: HastRoot) => {
    visit(tree, 'element', node => {
      if (node.tagName !== 'pre') {
        return;
      }

      const codeElement = node.children.find(child => child.type === 'element' && child.tagName === 'code');
      if (!codeElement || codeElement.type !== 'element') {
        return;
      }

      const language = getCodeLanguage(codeElement.properties);
      node.properties.className = mergeClassNames(node.properties.className, ['guide-code-block', `language-${language}`]);
      node.properties['data-lang'] = language;
      codeElement.properties.className = mergeClassNames(codeElement.properties.className, [`language-${language}`]);
    });
  };
}

/** Reads a string property from an HTML element property bag. */
function getStringProperty(properties: Properties, key: string): string {
  const value = properties[key];
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.join(' ');
  }

  return '';
}

/** Normalizes code block language information from HAST properties. */
function getCodeLanguage(properties: Properties): string {
  const classes = normalizeClassNames(properties.className);
  const languageClass = classes.find(className => className.startsWith('language-'));
  if (!languageClass) {
    return 'text';
  }

  const language = languageClass.slice('language-'.length).toLowerCase();
  return language === 'yml' ? 'yaml' : language || 'text';
}

/** Normalizes HAST class values into a string array. */
function normalizeClassNames(value: Properties['className']): string[] {
  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap(item => String(item).split(/\s+/)).filter(Boolean);
  }

  return [];
}

/** Merges class names without duplicating existing values. */
function mergeClassNames(existing: Properties['className'], incoming: string[]): string[] {
  return Array.from(new Set([...normalizeClassNames(existing), ...incoming]));
}

/** Collects the text content from a HAST element subtree. */
function getNodeText(node: HastElement): string {
  return node.children
    .map(child => {
      if (child.type === 'text') {
        return child.value;
      }

      if (child.type === 'element') {
        return getNodeText(child);
      }

      return '';
    })
    .join('');
}

/** Builds the final guide payload consumed by the Next.js guide page. */
export async function buildGuideDocument(readme: string): Promise<GuideDocument> {
  const body = extractGuideMarkdown(readme);
  const intro = getGuideIntro(body);
  const markdown = removeIntroParagraph(body);
  const sections = collectSections(body);
  const rendered = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeGitHubAlerts)
    .use(rehypeHeadingIds)
    .use(rehypeRewriteAssets)
    .use(rehypeHighlight, { detect: false, ignoreMissing: true })
    .use(rehypeGuideCodeBlocks)
    .use(rehypeStringify)
    .process(markdown);

  return {
    title: 'Rustatio docs',
    intro,
    html: String(rendered),
    sections,
  };
}
