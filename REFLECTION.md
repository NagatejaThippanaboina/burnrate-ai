# REFLECTION.md — BURNRATE AI (Credex Round 1)
1. The hardest bug you hit this week, and how you debugged it

The hardest bug I faced was a hydration mismatch combined with incorrect “result not found” flashes on the /result/[id] page. The issue only appeared intermittently, which made it harder to reproduce consistently. At first, I assumed it was a routing issue in Next.js App Router because the dynamic route sometimes rendered before localStorage hydration completed.

My first hypothesis was that the audit data wasn’t being passed correctly through route params. I added console logs inside useEffect and confirmed that the route ID was valid, which ruled out routing failure. Next, I suspected Supabase latency, but the bug occurred even when no API call was made.

The actual root cause was client-side hydration timing. The component was rendering a “not found” fallback before the localStorage hydration layer finished restoring the audit state. This created a brief incorrect UI state before React reconciled it.

To debug it, I:

Added staged logging for render vs hydration lifecycle
Temporarily disabled conditional rendering logic
Simulated slow localStorage reads to reproduce timing issues
Tested behavior in production build instead of dev mode (which changed timing significantly)

The fix was restructuring the rendering flow so that the page explicitly enters a “loading / initializing state” before any “not found” UI is allowed. I introduced a dedicated hydration flag and separated three states: loading, exists, and not found.

This made the UI stable and removed the flash entirely. It also reinforced how misleading Next.js dev mode can be for SSR + client hydration issues.

2. A decision you reversed mid-week, and what made you reverse it

Initially, I designed the audit result system to rely heavily on client-side persistence using localStorage as the primary source of truth. My reasoning was that it would reduce backend complexity and make shareable links feel instant without authentication.

However, mid-week I realized this approach had a serious flaw: share URLs like /result/[id] were not truly portable. They worked only if the original browser had stored the data locally. This broke the “shareable SaaS product” requirement in a fundamental way.

I reversed the decision and introduced a hybrid model:

localStorage for instant UX and caching
Supabase persistence for durable audit storage

The trigger for this change was testing the share URL on a clean browser session. The result page failed silently, which made it clear that the architecture was not production-safe.

This reversal improved reliability significantly and aligned the product with real SaaS expectations where URLs must be independently resolvable.

3. What you would build in week 2 if you had it

If I had a second week, I would focus on three major improvements.

First, I would move the audit engine fully server-side with optional edge execution. This would allow caching by input hash and make results consistent across devices without relying on client state.

Second, I would build a proper multi-tenant dashboard layer. Right now the product is single-session oriented, but in a real SaaS environment, users would expect history, comparisons across audits, and team-based visibility.

Third, I would add a lightweight benchmarking layer that compares a user’s AI spend against anonymized aggregates (e.g., “similar teams spend 32% less”). This would significantly improve perceived value and increase conversion to Credex consultations.

Overall, week 2 would shift the product from “working MVP” to “distribution-ready SaaS with retention hooks.”

4. How you used AI tools

I used AI tools primarily as a development accelerator rather than a decision maker.

Cursor was used for scaffolding UI components, refactoring TypeScript structures, and generating boilerplate for API routes. ChatGPT was used for debugging guidance, especially around Next.js App Router behavior and hydration issues. I also used it to sanity-check architecture decisions and validate trade-offs.

However, I did NOT trust AI for core business logic. The audit engine (runAudit) was fully deterministic and manually implemented because financial recommendation logic must be predictable and testable.

One specific case where AI was wrong was during early Supabase integration. It suggested a direct client-side write pattern for audit persistence, but this conflicted with RLS constraints and exposed a security risk. I caught this during implementation and corrected it by moving all writes into secured API routes.

This reinforced the importance of treating AI as an assistant for speed, not authority for system design.

A key pattern I observed was that AI suggestions were often optimized for implementation simplicity rather than production-grade correctness, so I consistently validated them against system constraints before adoption.

5. Self-rating (1–10)

Discipline: 8/10
I maintained consistent daily progress across the project timeline and followed a structured build process without skipping core milestones.

Code quality: 7.5/10
The architecture is clean and modular, but there are still areas where abstraction boundaries could be improved, especially around state hydration.

Design sense: 8/10
The UI follows a consistent SaaS pattern with clear hierarchy, though some edge-case responsiveness could still be refined.

Problem solving: 8.5/10
Most issues were debugged systematically using hypothesis-driven debugging rather than guesswork, especially hydration and routing issues.

Entrepreneurial thinking: 8/10
The product is positioned clearly as a lead-gen SaaS tool with real economic value, and decisions consistently favored usability and conversion over unnecessary complexity.

Overall, this project reinforced that building SaaS systems is less about feature completeness and more about controlling system trust boundaries between deterministic computation, persistence, and presentation layers. Most of the engineering decisions were made to preserve reproducibility and prevent hidden behavior in financial outputs.