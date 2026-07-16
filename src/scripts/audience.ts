/**
 * Audience switch.
 *
 * Curates labels and CTA emphasis ONLY. It does not hide pages, gate content,
 * duplicate content, or alter crawler access — every route renders identically
 * server-side regardless of the stored value.
 */
import { withBase, cta, type Audience } from '@config/site';

const KEY = 'ah.audience';
const EVENT = 'ah:audience';

export const CTA_COPY: Record<Audience, { label: string; href: string }> = {
  business: { label: cta.business.label, href: withBase(cta.business.href) },
  employer: { label: cta.employer.label, href: withBase(cta.employer.href) },
};

export function getAudience(): Audience {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'employer' || v === 'business') return v;
  } catch {
    /* storage blocked — fall through to the default */
  }
  return 'business';
}

export function setAudience(next: Audience): void {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* non-fatal: the switch still works for this page view */
  }
  window.dispatchEvent(new CustomEvent<Audience>(EVENT, { detail: next }));
}

export function onAudience(fn: (a: Audience) => void): void {
  window.addEventListener(EVENT, (e) => fn((e as CustomEvent<Audience>).detail));
}
