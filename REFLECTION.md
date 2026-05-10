# BURNRATE AI — Reflection (Credex Round 1)

## What shipped well

- **Deterministic core:** Buyers and reviewers can inspect *why* a number appears (`src/lib/audit.ts` + typed `AuditResult`).
- **Low friction funnel:** Audit → outcome → share link without accounts fits intern-scope velocity while still demonstrating production patterns (typed APIs, persistence, UX polish).
- **Separation of concerns:** Pricing catalog, engine, wizard UI, Supabase gateways are cleanly split for future pricing updates and tests.

## What I would improve next week

1. **Row Level Security proofs:** Publish exact Supabase policies in-repo (or screenshots) proving inserts are locked down appropriately for anon/server keys.
2. **Server truth for audits:** Persist full deterministic payloads server-side keyed by audit ID so “share link” works on a cold device without `localStorage`.
3. **Broader regression tests:** Extend Vitest to pricing invariants (`pricingCatalog` completeness) once pricing is pulled from editable CMS or scraped snapshot.

## Hardest lesson

Hydration / client-only persistence was the easy path for an MVP share URL, but it creates a predictable gap: receivers on new browsers need a replay path—documented openly in ARCHITECTURE.md so stakeholders know the deliberate trade-off.
