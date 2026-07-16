import { visit } from 'unist-util-visit';

/**
 * Rewrites root-relative links in MDX/Markdown through the configured base path.
 *
 * Markdown links cannot call withBase(), so `[text](/#sab)` would 404 on a
 * project-site deployment. Rather than trusting authors to remember, this makes
 * every root-relative href base-aware at build time — which keeps the
 * project-site → user-site → custom-domain move a config change.
 *
 * Absolute URLs, anchors, mailto:, and tel: are left alone.
 */
export function rehypeBasePath({ base = '/' } = {}) {
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;

  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string') return;
      if (!href.startsWith('/')) return;          // anchors, mailto:, tel:, absolute URLs
      if (prefix && href.startsWith(prefix + '/')) return; // already prefixed
      node.properties.href = `${prefix}${href}`;
    });
  };
}
