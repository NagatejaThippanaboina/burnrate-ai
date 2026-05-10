# Metrics — Credex-scope definitions

Instrumentation not fully wired beyond Supabase inserts—below are canonical **names / definitions** intended for eventual PostHog or Vercel Analytics.

## North-star (candidate)

**NSM:** Activated audits/week  
Definition: share of anonymized landing sessions completing the wizard and landing on `/result/[id]` with a generated report keyed by deterministic `audit-*` id (`localStorage` today).


Secondary: `% audits with ≥1 outbound lead POST /api/leads`.

## Acquisition funnel stages

| Stage | Event name (proposal) | Source of truth |
|-------|-----------------------|----------------|
| Landing view | `page_view_home` | Web analytics SDK |
| Audit start | `audit_step_1_view` | Client event after wizard mount |
| Audit complete | `audit_submit_success` | After `runAudit` + navigation |
| Lead capture | `lead_submit_success` | POST `/api/leads` 200 |
| Audit persistence | `audit_persist_success` | POST `/api/audits` 200 |

## Quality / trust metrics

| Metric | Why it matters |
|--------|----------------|
| **Deterministic replay rate** | Same inputs → same savings headline (support debug) |
| **API error rate** | Supabase insert failures / 5xx on route handlers |

## Guardrails against vanity growth

Avoid optimizing raw traffic if completion rate crater—pair `audit_submit_success ÷ landing_session` explicitly in weekly review.
