import type { APIRoute } from 'astro';
import { site, absoluteUrl } from '@config/site';

/**
 * Until Gate 4 approves the canonical host, the site asks not to be indexed.
 *
 * The github.io address is explicitly provisional. Letting it get indexed now
 * would establish a temporary URL as the canonical identity and make the later
 * domain migration start from a worse position. Flip site.canonicalApproved.
 */
export const GET: APIRoute = () => {
  const body = site.canonicalApproved
    ? [
        'User-agent: *',
        'Allow: /',
        'Disallow: /portfolio-print',
        '',
        `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
        '',
      ].join('\n')
    : [
        '# Pre-launch. The canonical host is not approved yet (Gate 4).',
        '# Indexing is intentionally disabled so this temporary address does not',
        '# become the established canonical identity in search.',
        'User-agent: *',
        'Disallow: /',
        '',
      ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
