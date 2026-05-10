# BURNRATE AI — Automated tests

## Tooling

- **Runner:** [Vitest](https://vitest.dev/) (`vitest`)
- **Config:** `vitest.config.ts`
- **Test file:** `src/lib/audit.test.ts`

Tests focus strictly on **`runAudit`** in `src/lib/audit.ts` (deterministic recommendation engine).

## Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run all Vitest suites once |
| `npm run test:watch` | Interactive watch mode during development |
| `npm run test:coverage` | Same as above + V8 coverage for `audit.ts` only |

Coverage is scoped to **`src/lib/audit.ts`** so reports reflect the audited module (not unrelated UI glue).

## What the suite asserts (6 cases)

1. **Stable IDs** — Canonical inputs produce identical `audit-*` identifiers across calls.
2. **Savings rate cap** — `savingsRate` never exceeds **65%** (matches conservative engine rules).
3. **Spend rollup** — `totalCurrentMonthlySpend` equals the arithmetic sum of user-entered spends (rounding aligned with engine rounding).
4. **Seat-policy mismatch** — Lower team size vs plan `minTeamSize` emits a **Team-Size Mismatch / downgrade**.
5. **API right-sizing** — Low metered usage vs bundled envelope emits **API Right-Sizing**.
6. **Recommendation ordering with API workloads** — When an API SKU is selected, sorting surfaces **API Efficiency** first—validates prioritized sort ordering.

*(Each case uses real selections against `pricingCatalog`; no mocks inside the black box.)*

## Latest coverage snapshot (`npm run test:coverage`)

Collected with Vitest `@vitest/coverage-v8`, **include filter:** `src/lib/audit.ts`.

| Metric (audit.ts only) | Value |
|------------------------|-------|
| Statements | ~100% |
| Branches | ~88–89% |
| Functions | ~100% |
| Lines | ~100% |

Branch gaps correspond to seldom-hit consolidation / alternative branches not exercised by the fixtures above (`Uncovered Line #s` echoes this in CLI output).

## CI

Workflow **`.github/workflows/ci.yml`** runs `npm ci`, `npm run lint`, then `npm run test` on every push to `main`.
