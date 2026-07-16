# Missing Evidence & Asset Register
**Required by:** Codex Master Prompt v3 — *"Create a written Missing Evidence and Asset Register before implementation."*
**Audit date:** 2026-07-16
**Sources audited:** Master Brief v3 (2,850 lines, complete) · Codex Master Prompt v3 (complete) · `Ahmed_Hamdy_Business_Growth_Operations_CV_Final_Approved.docx` (complete, text-extracted) · `صورتي.png` (viewed) · repository (`D:\portfolio` — source documents only, not a git repo)

**Governing rule:** *A smaller verified result is stronger than a larger unsupported result.* Missing proof produces a safe statement, never a fabricated metric.

---

## A. Priority 1 — blocks a credible launch

| # | Item | Status | Consequence if not supplied |
|---|---|---|---|
| A1 | **Formula4You live production URL** | ❌ **Not supplied anywhere** | The flagship's single strongest claim is *"live platform."* Cannot be published as live without the URL. Blocks brief §09 required evidence, the proof strip, and both PDFs. **Highest-priority blocker.** |
| A2 | **Formula4You screenshots** (home, supplier/store profile, product/listing discovery, onboarding/subscription, safe admin/governance) — min. 4 real screens with captions | ❌ Not supplied | Case study runs on diagrams only. **Fake historical interfaces are forbidden** — will not be created. Evidence slots ship visibly empty rather than filled with invention. |
| A3 | **Formula4You logo** (SVG or transparent PNG) | ❌ Not supplied | Case-study header + PDF covers use a text treatment. |
| A4 | **Portrait approval** — `صورتي.png` | ⚠️ **Supplied, NOT approved** | Brief §15 P1: *"Current generated portrait can be used only after Ahmed confirms it accurately represents him."* §21.3 repeats this. **I will not publish this image until you explicitly confirm it accurately represents you.** Used in About/Contact only. |
| A5 | **GitHub account/username + repo name + chosen `github.io` URL** | ❌ Not supplied | Determines user-site vs project-site base path and the canonical URL. Blocks deployment config (Phase 2). Architecture supports both, but the value must be set before Gate 2. |
| A6 | **Alpha Capital — Employee of the Month proof** (certificate, announcement, or manager confirmation) | ❌ Not supplied | Claim is `EVIDENCE REQUIRED`. Without proof it is **omitted**, not softened. |
| A7 | **Alpha Capital — Trustpilot/review evidence for 300+ five-star reviews** | ❌ Not supplied | Without proof, mandated fallback: **"hundreds of five-star reviews"** (no number, no metric card). |
| A8 | **Alpha Capital — actual formal job title** | ❌ Not supplied | See conflict **C1**. Blocks the case study and both PDFs. |

---

## B. Metrics — evidence required before publication

Every item below is `EVIDENCE REQUIRED`. Each needs **source + baseline + date range + calculation**, or the approved fallback is used verbatim.

| Claim | Publish only with | Approved fallback if not evidenced |
|---|---|---|
| **300+ verified five-star reviews** | Trustpilot profile/screenshot or equivalent | "hundreds of five-star reviews" |
| **Employee of the Month** | Certificate / announcement / manager confirmation | Omit |
| **Thousands of completed orders** | Defensible aggregate + explanation + role + whether collective | *"Supported high-volume retail initiatives by improving offer structure, purchase journeys, campaign-to-page consistency, and order handling before acquisition spend was scaled."* |
| **Improved conversion** | Baseline + period + source | *"Simplified the journey and strengthened conversion drivers."* |
| **Reduced cost or time** | Explicit calculation | Describe the eliminated step / standardized process |
| **Formula4You scale** (suppliers, listings, sign-ups, traffic, transactions, revenue, engagement) | Documentation | **Omit entirely.** Describe designed user groups + current platform capability; do not imply active scale for every group. |
| **Client company names** | Written permission | Sector + business type only ("Multi-Product Retail Websites", "apparel and consumer-product brands") |
| **Testimonials** | Real wording + permission | **Omit.** Testimonial copy will never be generated. |
| **Exact conversion lift / CPO / revenue / ROAS / abandonment reduction** | — | **Never used without proof.** |

---

## C. Conflicts found between sources — need your decision

### C1 — Alpha Capital job title *(highest-impact conflict)*
- **CV says:** *"Business Operations & Customer Experience Improvement Contributions | Remote, United Kingdom"*
- **Brief §11 says:** *"Operational and customer-experience contribution, **not a claim that Business Operations was the formal job title**."*
- **Prompt says:** *"Do not imply Business Operations was Ahmed's formal title if it was not."*

The approved CV's own heading reads as a title line. The brief forbids the site from implying it. **What was the actual formal title?** The site will use contribution framing regardless; I need the real title on record so the site and the downloadable CV don't contradict each other in front of the same recruiter.

### C2 — "Thousands of completed orders" appears unqualified in the approved CV
- **CV, Selected Business Impact:** *"Contributed to retail and e-commerce initiatives that collectively generated thousands of completed orders…"*
- **Brief §14:** `EVIDENCE REQUIRED` — use only with a defensible aggregate; otherwise the safe fallback.

The CV is downloadable **from** the site. If the site uses the safe fallback while the linked CV states the claim outright, a recruiter reads both. Three options:
1. Supply the evidence → both use the claim. *(Best.)*
2. Accept the split: CV is Ahmed's own asserted document; site holds the stricter line. *(Defensible but visibly inconsistent.)*
3. Revise the CV to the fallback wording. *(Requires re-approving a "Final Approved" document.)*
**Recommendation: 1, else 2.** Your call.

### C3 — Same pattern, smaller: `300+ reviews` and `Employee of the Month` are stated in the CV but gated on the site.
Resolved automatically by supplying A6/A7. Otherwise same three options as C2.

### C4 — Public email vs account email
Brief locks the public contact as **`ahmedeldep30@gmail.com`**. This session's account email is `ahmedmagdymohamedy@gmail.com`. The brief's locked value will be used. **Confirm `ahmedeldep30@gmail.com` is the address you want published** — it goes into the site, both PDFs, and the JSON-LD.

### C5 — `/audits` has nothing publishable at launch
Locked route + locked homepage section, zero eligible content (Amouage is research-concept-only and must stay noindex). See Plan **D-1**.

### C6 — Capability 10 ("AI-aware business and product decision-making") has no proof surface in the brief
You named it a core capability. The brief carries it only as an Insights *category* and a tools line in the CV. See Plan §2 — proposal uses existing approved material and invents nothing.

---

## D. Priority 2 — strengthens case studies (not launch-blocking)

| Item | Status | Use |
|---|---|---|
| Formula4You market map / framing notes | ❌ | Market-gap artifact (§09 required evidence) |
| Formula4You roadmap, feature priorities, user stories, acceptance criteria | ❌ | Product-strategy proof (capability 6) — **the single best evidence for the product-thinking gap** |
| Formula4You QA plan / SEO-GEO plan | ❌ | Cross-functional execution proof (capability 9) |
| Anonymized e-commerce before/after screens | ❌ | Journey map + annotated interface |
| Checkout/ordering flow showing removed steps | ❌ | Before/after process morph |
| Behavior-trigger offer logic diagram | ❌ | The exit-intent/margin-guardrail CRO artifact |
| Paid-campaign + completed-order evidence with date range | ❌ | Would resolve C2 |
| Anonymized customer objection / issue patterns | ❌ | Alpha Capital issue taxonomy |
| Recommendations from a manager, founder, developer, or designer | ❌ | Only permissible route to a testimonial |
| **Which playbook scenarios are real vs experience-based composite vs illustrative** | ❌ **Decision needed** | Brief §21.9. Default: **all illustrative**, visibly labelled. |
| Verified real support case to replace/supplement the 1,000→100 scenario | ❌ | Until then it stays **visibly labelled illustrative** |
| Fresh audit research (sources, observation dates, screenshots, market evidence) | ❌ | Nothing publishable in `/audits` |

---

## E. Confirmed available

| Asset | Status |
|---|---|
| Master Brief v3 | ✅ Read complete (2,850 lines) |
| Codex Master Prompt v3 | ✅ Read complete |
| Approved CV (`.docx` + `.pdf`) | ✅ Read complete → ships to `/assets/ahmed-hamdy-cv.pdf` |
| Portrait `صورتي.png` | ⚠️ Present, **approval pending** (A4) |
| WhatsApp `https://wa.me/201040020093` | ✅ Approved |
| Phone `+20 104 002 0093` | ✅ Approved |
| Email `ahmedeldep30@gmail.com` | ✅ Approved (confirm C4) |
| LinkedIn `.../in/ahmed-hamdy-growth-operations` | ✅ Approved (unverified as live) |
| Facebook `.../brocopra/` | ✅ Approved (unverified as live) |
| Formula4You founder + live status | ✅ LOCKED as publishable claim — **but see A1** |
| Career narrative, positioning, all copy | ✅ Supplied in brief |
| All four case studies, four playbooks | ✅ Structure + content supplied |
| Excluded from V1 | ✅ ORion, Konfirmly — not built |

---

## F. What I will do when evidence is missing

1. **Use the exact approved fallback wording** from the brief. Never a softened invention.
2. **Ship the evidence slot visibly empty** rather than fill it. No fake screens, dashboards, logos, testimonials, or historical interfaces.
3. **Label every illustrative scenario unmistakably** — it can never be mistaken for a client result.
4. **Omit rather than imply.** No metric card without `claim_status: verified`.
5. **Register every gap here** and surface it at the relevant gate, not at launch.

---

## G. Answers needed to proceed past Gate 1

**Blocking:**
1. Formula4You live URL *(A1)*
2. GitHub username + repo name *(A5)*
3. Alpha Capital formal job title *(C1)*
4. Portrait approval — yes/no on `صورتي.png` *(A4)*

**Needed before Gate 2:**
5. Formula4You screenshots + logo *(A2, A3)*
6. Employee of the Month + Trustpilot evidence, or accept fallbacks *(A6, A7)*
7. C2 resolution — evidence, split, or CV revision
8. D-1 — `/audits` treatment
9. Confirm `ahmedeldep30@gmail.com` *(C4)*
10. Playbook scenarios: real / composite / illustrative
