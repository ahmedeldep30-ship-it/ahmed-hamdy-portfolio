# Ahmed Hamdy — Portfolio

Business Growth & Operations Specialist. Enterprise portfolio and business-opportunity system.

**Status:** Phase 2–3 complete, awaiting **Gate 2** review. Not published.
**Stack:** Astro 5 · strict TypeScript · MDX content collections · hand-authored CSS · zero UI framework.

---

## Quick start

```bash
npm install
npm run assets       # source-assets/ (private) → src/assets/ (optimized, committed)
npm run dev          # http://localhost:4321/ahmed-hamdy-portfolio/
npm run build        # astro check && astro build
npm run preview      # serve dist/
```

## Verification

Nothing ships on assertion. Every claim below is produced by a script you can re-run.

```bash
npm run verify           # breakpoints, overflow, console, links, images, reduced motion, no-JS, base path
npm run verify:contact   # drives the consultation builder end-to-end, asserts the generated message
npm run verify:a11y      # axe-core WCAG 2.2 AA at desktop + mobile, plus keyboard operation
npm run verify:lh        # Lighthouse: performance, a11y, best practices, SEO
npm run shots            # section screenshots for design review
npm run check:links      # CI gate: no hard-coded hosts, base paths, or contact details
```

Requires a preview server on `:4330` — `npm run preview -- --port 4330`.

### Current results

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home (desktop / mobile) | 100 / 100 | 100 / 100 | 100 / 100 | 100* | 0.4s / 1.4s | 0 | 0ms |
| Formula4You | 100 / 100 | 100 / 100 | 100 / 100 | 100* | 0.3s / 1.2s | 0 | 0ms |
| Contact | 100 / 100 | 100 / 100 | 100 / 100 | 100* | 0.3s / 1.2s | 0 | 0ms |

\* SEO measures 100 with indexing enabled. **Pre-launch it measures 63–66 by design** — see “Indexing” below.

axe-core: **0 violations** across 5 routes × 2 viewports.

---

## Architecture

```
src/
  config/site.ts        ← THE single source of deployment identity + contact.
  content.config.ts     ← Zod claim/evidence schema + public label mapping.
  content/work/*.mdx    ← Case studies. Frontmatter is schema-validated at build.
  styles/
    tokens.css          ← Design tokens. Every colour carries its measured contrast ratio.
    base.css            ← Reset, type, layout, components, zones, utilities (@layer).
  components/
    nav/                ← Header (5 links + audience switch + CTA), Footer
    home/               ← The 12 home sections
    case/               ← EvidenceRail, Shot, Decision
  scripts/              ← audience switch, consultation adapters
scripts/                ← asset pipeline, verification harnesses, CI gates
source-assets/          ← GITIGNORED. Originals: screenshots, portrait master, briefs, CV.
```

### Layer order is load-bearing

`@layer reset, base, layout, components, zones, utilities`

`zones` **must** come after `components`. The light-stone zone re-points text and accent
tokens to their accessible light-surface variants; if it lost the cascade, dark-surface
colours would render on stone at failing contrast. This was a real bug caught by
`verify:a11y`. Do not reorder without re-running it.

---

## Claims and evidence

The credibility rule is enforced by the type system, not by memory.

**Internal status** (governance) → **public label** (what a visitor reads):

| `claim_status` | Public label |
|---|---|
| `verified` | Verified Evidence |
| `user_asserted` | Founder-Led Work |
| `illustrative` / `proposed` | Illustrative Scenario |
| `public_observation` | Independent Analysis |
| `confidential` | Client-Confidential |

“User-asserted” is **never** shown to a visitor. It is a validation state.

Build-time enforcement:
- A claim marked `verified` **without a `source` fails the build** (`content.config.ts`).
- Only `verified` may enter a prominent metric card.
- `alt` text under 20 characters fails verification.
- Every `<Shot>` requires a `proves` prop — a screenshot that cannot answer
  *“what decision does this prove?”* cannot be published.

When evidence is missing, the approved **safe fallback wording** is used verbatim. Held-back
claims are listed publicly in the case study’s “Evidence status” section, with the fallback
that replaced them. See `docs/02-EVIDENCE-REGISTER.md`.

---

## Deployment

GitHub Pages via Actions (`.github/workflows/deploy.yml`). Zero cost, no paid plan.

### First push

```bash
git remote add origin https://github.com/ahmedeldep30-ship-it/ahmed-hamdy-portfolio.git
git branch -M main
git push -u origin main
```

Then: **Settings → Pages → Build and deployment → Source: GitHub Actions.**

Deploys to `https://ahmedeldep30-ship-it.github.io/ahmed-hamdy-portfolio/`

### Indexing

The site is **noindex site-wide until Gate 4**, controlled by one flag:

```ts
// src/config/site.ts
canonicalApproved: false,   // → <meta name="robots" content="noindex"> + robots.txt Disallow
```

This is deliberate. The github.io address is provisional. If it gets indexed now, that
temporary URL becomes the established canonical identity and the later domain migration
starts from a worse position. Flip to `true` only when the canonical host is final.

### Custom domain later (no rebuild)

1. `echo "ahmedhamdy.com" > public/CNAME`
2. In `.github/workflows/deploy.yml`: `SITE_URL=https://ahmedhamdy.com`, `BASE_PATH=/`
3. DNS: `A` records to GitHub Pages IPs, or `CNAME` → `ahmedeldep30-ship-it.github.io`
4. Settings → Pages → Custom domain → enforce HTTPS
5. Set `canonicalApproved: true`

**Route paths do not change**, so search equity is preserved. Nothing else needs editing —
`npm run check:links` fails the build if any file hard-codes a host, base path, or contact
detail outside `config/site.ts`.

### User site instead of project site

`SITE_URL=https://<user>.github.io`, `BASE_PATH=/`. Nothing else changes.

---

## Assets

Originals live in `source-assets/` and are **gitignored — never committed**. Only optimized,
approved copies enter the repository.

```bash
npm run assets
```

- Never upscales (a screenshot enlarged past source resolution turns text artificial).
- WebP q82/effort6 — high enough to keep 12px Arabic interface glyphs legible.
- Portrait: 900px max, q86.

Naming: `formula4you-<what>.webp`, `ahmed-hamdy-portrait-approved.webp`.

Before publishing any screenshot: crop private data, write real alt text, write a caption,
and answer `proves`. Never infer scale, revenue, or traffic from an interface screenshot.

---

## Content editing

Add a case study: create `src/content/work/<slug>.mdx`. Frontmatter is validated against
`content.config.ts` — a missing `rail`, fewer than 3 `capabilities`, or a `verified` claim
without a source will fail the build. Route generates automatically at `/work/<slug>`.

Root-relative Markdown links are rewritten through the base path at build time
(`scripts/rehype-base-path.mjs`), because Markdown cannot call `withBase()`.

---

## Deliberately not built yet

Supporting case studies · full playbooks · Insights publishing system · public audits ·
both PDFs · `/for-businesses` · `/for-employers` · `/about` page. These are Phase 4+ and
gated behind Gate 2 approval. Nav links point at home-page previews so nothing 404s and
nothing is faked.
