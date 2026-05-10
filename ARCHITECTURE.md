# BURNRATE AI — Architecture

## Product shape

Browser-first SaaS UX: prospects run a deterministic spend audit locally, view shareable results, and submit structured leads. No login is required for the core audit loop.

## High-level diagram

```text
[ Landing /audit ] → [ audit-wizard (client) ]
        │                    │
        │              runAudit() in src/lib/audit.ts
        │                    │
        │              localStorage (draft + reports)
        │                    │
        └──────────── /result/[id] (client hydrate from localStorage)
                             │
        ┌────────────────────┴────────────────────┐
        ▼                                         ▼
 POST /api/audits                          POST /api/leads
        │                                         │
        └──────────────┬────────────────────────┘
                       ▼
              Supabase (audits, leads tables)
```

## Runtime surfaces

| Surface | Role |
|--------|------|
| **Next.js App Router** (`src/app/`) | Pages, layouts, route segments |
| **Client components** | Wizard, results, modals sharing browser state |
| **Route handlers** | `POST /api/audits`, `POST /api/leads` — server-side Supabase writes |
| **Supabase** | Persistence for audits and CRM-style leads |

## Audit engine (`src/lib/audit.ts`)

- **Input:** Structured selections (tool ID, plan ID, monthly spend) + team size + primary use case.
- **Pricing truth:** Canonical catalog `src/data/pricing.ts`.
- **Output:** `AuditResult` with per-tool recommendations (plan moves, consolidation, alternatives, optimized), aggregates, deterministic ID (`audit-*` hash of canonical input).

The engine is **fully deterministic**: same inputs ⇒ same recommendation set and IDs (timestamps notwithstanding for `createdAt` only on persistence paths).

## Data flow — persistence

- **Client-first results:** Completed audits are keyed by result ID and stored under `burnrate-ai-reports-v1` in `localStorage` so share URLs work immediately without waiting on network.
- **Server backup / CRM:** Successful completion posts summary columns to Supabase via `/api/audits`. Lead CTAs POST to `/api/leads`.

## Secrets & deployment

| Variable | Consumed where | Purpose |
|----------|----------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, API routes (via helper) | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same | Anonymous key used by Route Handlers (Row Level Security must gate writes appropriately in Supabase dashboard) |

## Testing

Automated regression tests live in `src/lib/audit.test.ts` (Vitest) and target deterministic behavior of `runAudit` only (see **TESTS.md**).

## Extension points (future, not shipped)

- Server-side authored reports (persist full JSON blobs, not only summaries).
- Auth + workspaces for multi-seat teams.
- LLM overlays for prose narrative atop deterministic facts (currently recommendations are template strings).
