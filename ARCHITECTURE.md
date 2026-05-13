# BURNRATE AI — Architecture

## Executive Summary

BURNRATE AI is a deterministic SaaS system that analyzes AI tool spend and generates explainable cost optimization insights. It uses a client-side audit engine for instant results, with Supabase-backed persistence for shareable reports. The architecture prioritizes reproducibility, auditability, and pricing transparency over probabilistic AI reasoning. LLMs are optional and strictly used for narrative presentation only. The system is designed to scale to 10k+ audits/day with server-side execution and caching.

## Product shape

Browser-first SaaS UX: users run a deterministic AI spend audit, view shareable optimization results, and optionally submit leads. No authentication is required for the core audit experience.

The system prioritizes speed, transparency, and explainability over black-box AI behavior.

---

## High-level architecture diagram

```text
[ Landing /audit ]
        │
        ▼
[ Audit Wizard (Client - React/Next.js) ]
        │
        │ runs deterministic engine
        │ src/lib/audit.ts
        ▼
[ Audit Engine (Pure Functions) ]
        │
        │ uses pricing catalog
        ▼
[ src/data/pricing.ts ]
        │
        ▼
[ Result Object (Deterministic Output) ]
        │
        ├──────────────► Stored in localStorage (instant UX + share support)
        │
        └──────────────► POST /api/audits
                             │
                             ▼
                      Supabase (audits table)

User optionally submits lead:
        │
        ▼
POST /api/leads → Supabase (leads table)
Runtime surfaces

Next.js App Router (src/app/) → Routing, pages, result views
Client Components → Wizard UI, forms, result dashboard
Audit Engine (src/lib/audit.ts) → Deterministic cost analysis logic
Pricing Catalog (src/data/pricing.ts) → Single source of truth for tool pricing
API Routes (/api/audits, /api/leads) → Server-side persistence layer
Supabase → Database + CRM-style lead storage
localStorage → Instant persistence for shareable UX

Audit engine design (src/lib/audit.ts)
Inputs
Selected AI tools (Cursor, Claude, ChatGPT, Copilot, etc.)
Plan tiers per tool
Monthly spend per tool
Number of seats
Team size
Primary use case (coding / writing / research / mixed)
Processing logic
Plan overuse detection
Cheaper plan eligibility checks
Cross-vendor alternative suggestions
Consolidation opportunities
Outputs
Monthly savings
Annual savings
Per-tool recommendations
Deterministic audit result object

No randomness or external inference is used.

Data flow (end-to-end)
User opens /audit
Inputs tool stack + spend details
Client runs runAudit() locally
Result rendered instantly
Stored in localStorage
Optional persistence:
POST /api/audits → Supabase
POST /api/leads → CRM capture
Shareable URL /result/[id] loads deterministic result
Why this stack was chosen
Next.js 15 (App Router)
Full-stack single codebase
SEO-friendly landing pages
API routes + frontend unified
Ideal for SaaS funnel + shareable results
TypeScript
Prevents pricing logic errors
Ensures deterministic audit correctness
Strong API contract safety
Tailwind + shadcn/ui
Fast SaaS-grade UI development
Consistent design system
Minimal design overhead with high polish
Supabase
Postgres + API in one backend
Fast setup for MVP → production scaling
Simple lead + audit persistence
localStorage
Instant UX without login
Enables shareable result pages
Reduces backend dependency
Vercel
Zero-config deployment
CI/CD integration
Edge-ready hosting for Next.js
Security & secrets
Variable	Purpose
NEXT_PUBLIC_SUPABASE_URL	Supabase endpoint
NEXT_PUBLIC_SUPABASE_ANON_KEY	Client-safe access (protected via RLS)

No sensitive secrets are exposed in frontend code.

Scalability plan (10k audits/day)
Move runAudit() to server-side execution (API/edge)
Add caching layer (Redis / Upstash) for repeated inputs
Optimize Supabase tables with indexing + partitioning
Queue audit writes asynchronously (decouple API latency)
CDN cache /result/[id] pages for fast sharing + OG previews
Testing strategy
Vitest unit tests
File: src/lib/audit.test.ts
Scope: deterministic audit engine only

Ensures:

pricing correctness
regression safety
stable financial outputs
Extension points (future)
Multi-tenant organization support
Full audit history dashboard
LLM-generated narrative layer
Real-time AI spend benchmarking
Embedded widget for external sites
Referral system for growth
Key principle

Deterministic financial correctness > AI-generated creativity

This ensures:

reproducible outputs
auditability
trust in recommendations
enterprise usability
Summary

BURNRATE AI is a deterministic SaaS platform that converts AI tool usage data into structured financial optimization insights using:

client-side computation for speed
server-side persistence for reliability
deterministic rule engine for trust