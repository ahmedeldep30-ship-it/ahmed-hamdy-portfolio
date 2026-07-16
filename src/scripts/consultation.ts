/**
 * Consultation submission — adapter boundary.
 *
 * V1 has no backend (static host). These adapters build a structured message and
 * hand it to the visitor's own WhatsApp or mail client. Nothing is stored,
 * transmitted, or logged by this site.
 *
 * To add a real backend later, implement `ConsultationAdapter` with an HTTP
 * POST and register it in `adapterFor`. The form, the review step, and the
 * message format do not change.
 */
import { contact } from '@config/site';

export interface Payload {
  name: string;
  company: string;
  email: string;
  url: string;
  visitor: string;
  challenge: string;
  stage: string;
  urgency: string;
  outcome: string;
  context: string;
}

export interface ConsultationAdapter {
  label: string;
  href(p: Payload, message: string): string;
}

/**
 * Builds the message Ahmed actually receives. Ordered the way he reads a brief:
 * who, what is wrong, what good looks like, then context.
 */
export function buildMessage(p: Payload): string {
  const line = (k: string, v: string) => (v ? `${k}: ${v}` : null);

  const who = [
    line('Name', p.name),
    line('Company / brand', p.company),
    line('Email', p.email),
    line('Link', p.url),
    line('Role', p.visitor),
  ].filter(Boolean);

  const problem = [
    line('Blocker', p.challenge),
    line('Stage', p.stage),
    line('Timing', p.urgency),
  ].filter(Boolean);

  const parts = [
    'Business Diagnostic request',
    '',
    '— WHO —',
    ...who,
    '',
    '— THE PROBLEM —',
    ...problem,
  ];

  if (p.outcome) parts.push('', '— A GOOD OUTCOME WOULD BE —', p.outcome);
  if (p.context) parts.push('', '— CONTEXT —', p.context);

  parts.push('', 'Sent from ahmedhamdy portfolio — consultation builder.');

  return parts.join('\n');
}

const whatsappAdapter: ConsultationAdapter = {
  label: 'Open WhatsApp →',
  href: (_p, message) => `${contact.whatsapp}?text=${encodeURIComponent(message)}`,
};

const emailAdapter: ConsultationAdapter = {
  label: 'Open email →',
  href: (p, message) => {
    const subject = `Business Diagnostic request — ${p.name}${p.company ? ` (${p.company})` : ''}`;
    return `${contact.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  },
};

export function adapterFor(channel: 'whatsapp' | 'email'): ConsultationAdapter {
  return channel === 'email' ? emailAdapter : whatsappAdapter;
}
