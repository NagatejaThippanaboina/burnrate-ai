# BURNRATE AI
AI infrastructure costs are exploding across startups using Cursor, Claude, ChatGPT, Copilot, and API-based workflows.

BURNRATE AI helps teams benchmark their AI tooling spend, detect unnecessary upgrades, compare cheaper alternatives, and estimate monthly + annual savings instantly.

Deterministic SaaS funnel for benchmarking **multi-vendor AI tool spend**. Teams walk a four-step audit, trigger the rules engine backed by curated pricing catalogs, inspect explainable optimization cards, optionally share `/result/[id]` links without accounts, and register leads through Supabase-backed API routes deployed on **Vercel**.

## Core features

- AI tooling spend audit engine
- Multi-vendor pricing comparison
- Shareable public audit URLs
- Personalized savings recommendations
- Supabase-backed lead capture
- Persistent audit state across reloads
- High-savings Credex consultation funnel
- Deterministic finance-readable optimization logic
- Optional AI-generated executive summary layer (post-deterministic rendering only, does not affect calculations)

### Email System

- Transactional emails are handled using **Resend**
- Used for lead confirmations and future optimization notifications
- Requires `RESEND_API_KEY` in production environment

## Screenshots 

| Area | Filename placeholder |
|------|-----------------------|
| Landing hero | `docs/screenshots/landing-hero.png` |
| Wizard step 4 | `docs/screenshots/audit-wizard-step4.png` |
| Results dashboard | `docs/screenshots/result-overview.png` |
| Lead capture footer | `docs/screenshots/lead-capture-share.png` |


## Target users

- Startup founders
- Engineering managers
- AI-heavy product teams
- Agencies managing multi-seat AI subscriptions
- Teams using multiple LLM/API vendors simultaneously

## Deployment

| Env | URL |
|-----|-----|
| **Production** | `https://burnrate-ai-ruby.vercel.app` |

> Keep your live URL synchronized with Credex reviewers—prefer pinning the canonical production hostname you control via Vercel dashboard.

 ### Environment variables _(Supabase + Services)_

Set in **Vercel → Project Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`

Ensure Supabase tables **`audits`** and **`leads`** exist with proper RLS policies enabled.
---

## Tech stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Vercel
- Vitest
- Resend (planned transactional email flow)

## Quickstart

```bash
git clone https://github.com/NagatejaThippanaboina/burnrate-ai.git
cd burnrate-ai
npm ci
npm run dev           # Next.js Dev Server → http://localhost:3000
```

Other scripts:

```bash
npm run lint          # ESLint (Next preset)
npm run test          # Vitest — audit engine regressions
npm run test:coverage # Vitest coverage for src/lib/audit.ts
npm run build         # Production Next build preview
```

---

## Suggested Demo Inputs

Use these reviewer-friendly scenarios in `/audit` (or click the in-app **Try Demo Scenarios** buttons) to quickly validate output quality.

### Scenario 1 — High Savings

- **Team Size:** 10
- **Use Case:** Mixed
- **Tools + Spend:**
  - Cursor Enterprise — `$180/month`
  - Gemini Pro — `$260/month`
- **Expected behavior:** strong optimization recommendations, vendor consolidation insights, and high savings percentage.

### Scenario 2 — Already Optimized

- **Team Size:** 2
- **Use Case:** Writing
- **Tools + Spend:**
  - ChatGPT Free — `$0/month`
- **Expected behavior:** minimal savings, efficient stack narrative, and limited optimization headroom.

### Scenario 3 — API Heavy

- **Team Size:** 15
- **Use Case:** API
- **Tools + Spend:**
  - OpenAI API Growth — `$600/month`
  - Claude Team — `$240/month`
- **Expected behavior:** API efficiency recommendations, spend governance insights, and infrastructure optimization narrative.

---

## Architecture at a glance

| Layer | Path / artifact |
|-------|----------------|
| Routes | `src/app/` `(page.tsx / audit/page.tsx / result/[id]/...)` |
| Audit engine | `src/lib/audit.ts` |
| Canonical pricing | `src/data/pricing.ts` |
| Supabase gateways | `src/app/api/audits/route.ts`, `src/app/api/leads/route.ts` |
| Client persistence | Wizard + results hydrate `localStorage` keys prefixed `burnrate-ai-*` |
| Persistence client | Root `lib/supabase.ts` with typed wrappers |

Detailed diagram lives in **`ARCHITECTURE.md`**.
> All financial outputs are fully deterministic and reproducible from src/lib/audit.ts using static pricing catalogs. AI is strictly optional and used only for narrative presentation.

---

## Automated quality gates

Continuous integration (`.github/workflows/ci.yml`): **lint + Vitest `npm run test`** on every **`push`** to **`main`**.

Explain test intent and coverage knobs in **`TESTS.md`**.

---

## Five decisions & deliberate trade-offs

| # | Decision | Why | Trade-off accepted |
|---|----------|-----|---------------------|
| 1 | **Deterministic engine** (`runAudit`) | Audits stay explainable; judges can reconstruct math from catalog + selections | Narrative personalization requires future LLM layer (see PROMPTS.md) |
| 2 | **Client-first persisted results (`localStorage`)** | Ships shareable audits without auth scaffolding | Opening same URL on unrelated device misses prior saves until optional server blobs exist |
| 3 | **Supabase via anon key in Route Handlers** | Simplest Credex-aligned integration path vs DIY backend | Policies must tightly scope insert paths (document in Supabase console) |
| 4 | **Vitest narrowly targets engine** (`audit.test.ts`) | Fast regressions guarding economic logic | Does not presently snapshot React UI regressions intentionally |
| 5 | **shadcn + Tailwind primitives** | Accelerates cohesive premium SaaS skins | Opinionated markup locked to radix slot merge semantics |

Companion narrative + honest reflection sits in **`REFLECTION.md`**; business framing in **`ECONOMICS.md`**, **`GTM.md`**, **`METRICS.md`**.

Credex-required documentation index:

- **`ARCHITECTURE.md`**
- **`REFLECTION.md`**
- **`TESTS.md`**
- **`PRICING_DATA.md`** / **`LANDING_COPY.md`**
- **`PROMPTS.md`**
- **`GTM.md`**
- **`ECONOMICS.md`**
- **`USER_INTERVIEWS.md`** 
- **`DEVLOG.md`** _(daily Credex format)_

---

## Production Status

Fully deployed and production-ready SaaS demonstrating deterministic AI cost intelligence for modern AI tool stacks.
