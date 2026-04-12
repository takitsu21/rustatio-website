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

/** Marks the start of the guide slice inside the upstream README. */
const GUIDE_START = '## 🚀 Getting Started';

/** Marks the end of the guide slice inside the upstream README. */
const GUIDE_END = '## 🤝 Contributing';

/** Stores the repository source URL prefix for rewritten markdown links. */
const REPO_BLOB_BASE = 'https://codeberg.org/takitsu21/rustatio/src/branch/main/';

/** Stores the repository raw URL prefix for rewritten markdown images. */
const REPO_RAW_BASE = 'https://codeberg.org/takitsu21/rustatio/raw/branch/main/';

/** Stores the optional base path for rewritten local guide assets. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Builds a compatible slugger for guide headings. */
function createSlugger(): GithubSlugger {
  return new GithubSlugger();
}

/** Extracts only the guide portion from the repository README content. */
export function extractGuideMarkdown(readme: string): string {
  const start = readme.indexOf(GUIDE_START);
  if (start === -1) {
    return readme.trim();
  }

  const end = readme.indexOf(GUIDE_END, start);
  return readme.slice(start, end === -1 ? undefined : end).trim();
}

/** Removes markdown formatting so headings can be normalized for navigation labels. */
export function normalizeHeadingText(text: string): string {
  return text.replace(/^[^\p{Letter}\p{Number}]+/u, '').replace(/\s+/g, ' ').trim();
}

/** Converts a normalized heading into a URL slug. */
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
  const markdown = extractGuideMarkdown(readme);
  const sections = collectSections(markdown);
  const rendered = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHeadingIds)
    .use(rehypeRewriteAssets)
    .use(rehypeHighlight, { detect: false, ignoreMissing: true })
    .use(rehypeGuideCodeBlocks)
    .use(rehypeStringify)
    .process(markdown);

  return {
    title: 'Get Started',
    intro: 'Installation, Docker deployment, web usage, and configuration notes generated directly from `README.md`.',
    html: String(rendered),
    sections,
  };
}
