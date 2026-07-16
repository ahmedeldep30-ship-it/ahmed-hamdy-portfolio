import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ============================================================================
   CLAIM & EVIDENCE MODEL
   Internal status governs validation. Public label governs what a visitor sees.
   These are deliberately different vocabularies:
   "user_asserted" is a governance state, not something a visitor should read.
   ============================================================================ */

export const CLAIM_STATUS = [
  'verified',            // source + baseline + period + calculation, all explainable
  'user_asserted',       // Ahmed's own statement, approved wording, no external proof
  'illustrative',        // hypothetical — can never be read as a client result
  'proposed',            // future-state design, not shipped
  'public_observation',  // observed from public info on a stated date
  'confidential',        // real but not publishable; anonymize or omit
] as const;

export type ClaimStatus = (typeof CLAIM_STATUS)[number];

/** Visitor-facing editorial labels (Gate 1 §10). "User-asserted" is never shown. */
export const PUBLIC_LABEL: Record<ClaimStatus, string> = {
  verified: 'Verified Evidence',
  user_asserted: 'Founder-Led Work',
  illustrative: 'Illustrative Scenario',
  proposed: 'Illustrative Scenario',
  public_observation: 'Independent Analysis',
  confidential: 'Client-Confidential',
};

export const PUBLIC_LABEL_VARIANT: Record<ClaimStatus, string> = {
  verified: 'verified',
  user_asserted: 'founder',
  illustrative: 'illustrative',
  proposed: 'illustrative',
  public_observation: 'independent',
  confidential: 'confidential',
};

/** Only these may appear in a prominent metric card. Enforced in MetricCard.astro. */
export const METRIC_ELIGIBLE: readonly ClaimStatus[] = ['verified'];

const claim = z.object({
  text: z.string(),
  status: z.enum(CLAIM_STATUS),
  source: z.string().optional(),
  dateRange: z.string().optional(),
  calculation: z.string().optional(),
  fallback: z.string().optional(),
}).superRefine((c, ctx) => {
  // A verified claim without a source is not verified — it is an assertion.
  if (c.status === 'verified' && !c.source) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Claim "${c.text}" is marked verified but has no source. ` +
        `Verified requires source + baseline/period + calculation, or downgrade it.`,
    });
  }
});

const evidenceAsset = z.object({
  src: z.string(),
  alt: z.string().min(20, 'Alt text must describe the screen, not label it.'),
  caption: z.string(),
  /** The decision this screen proves. Forces every screenshot to earn its place. */
  proves: z.string(),
  status: z.enum(CLAIM_STATUS).default('verified'),
  capturedOn: z.string().optional(),
});

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    /** The business question the page opens with — never a project title. */
    question: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    tier: z.enum(['founder_led', 'verified_real', 'anonymized_real']),
    role: z.string(),
    period: z.string(),
    market: z.string().optional(),
    liveUrl: z.string().url().optional(),
    capabilities: z.array(z.string()).min(3),
    summary: z.string(),
    claims: z.array(claim).default([]),
    evidence: z.array(evidenceAsset).default([]),
    rail: z.object({
      realAsset: z.string(),
      ownership: z.string(),
      decision: z.string(),
      implementation: z.string(),
      metricStatus: z.string(),
      confidentiality: z.string(),
    }),
  }),
});

export const collections = { work };
