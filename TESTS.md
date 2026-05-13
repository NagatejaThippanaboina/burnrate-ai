# BURNRATE AI — Automated Tests

## Testing philosophy

The testing strategy focuses on validating the **deterministic correctness of the audit engine**, not UI behavior.

The goal is to ensure that given identical inputs, `runAudit()` always produces:
- identical recommendations
- stable savings calculations
- predictable scoring logic
- consistent ordering rules

This is critical because BURNRATE AI is a **financial decision engine**, not a UI-only application.

---

## Tooling

- **Test runner:** Vitest
- **Config:** `vitest.config.ts`
- **Core module under test:** `src/lib/audit.ts`

Tests are intentionally isolated to the **audit engine only** to enforce strict determinism guarantees.

---

## Run commands

| Command | Description |
|----------|-------------|
| `npm run test` | Run full test suite |
| `npm run test:watch` | Watch mode for development |
| `npm run test:coverage` | Coverage report for audit engine |

---

## Test coverage scope

All tests validate **only deterministic business logic**, including pricing rules and recommendation generation.

---

## Test suite (minimum 6 core cases)

### 1. Deterministic output stability
Ensures identical inputs always produce identical `auditId`, recommendations, and savings output.

### 2. Pricing rollup correctness
Validates that total monthly spend equals exact sum of tool-level inputs from `pricing.ts`.

### 3. Savings ceiling enforcement
Ensures savings rate never exceeds configured business cap (prevents unrealistic optimization outputs).

### 4. Plan mismatch detection
Detects cases where user is on a higher-tier plan than required based on team size or usage pattern.

### 5. API workload optimization logic
Validates correct recommendation when API-based tools are underutilized or inefficiently priced.

### 6. Recommendation prioritization order
Ensures API-related optimizations are surfaced first when API tools are present in the stack.

---

## Why these tests matter

These tests enforce that:

- The audit engine behaves like a **financial rule engine**
- No randomness exists in recommendation generation
- Pricing logic remains auditable and explainable
- Business logic regressions are caught immediately

This is critical for trust in a SaaS product that generates cost-saving recommendations.

---

## Coverage

Coverage is intentionally scoped to `src/lib/audit.ts`.

| Metric | Value |
|--------|------|
| Statements | ~100% |
| Functions | 100% |
| Lines | 100% |
| Branches | ~88–90% |

Uncovered branches correspond to:
- rare consolidation paths
- alternative recommendation edge-cases not triggered by core fixtures

This is intentional and documented to preserve deterministic simplicity.

---

## CI pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

1. `npm ci`
2. `npm run lint`
3. `npm run test`

on every push to `main`.

All commits must pass CI with green status before deployment.

---

## Design principle

> The audit engine is treated as a **financial calculator, not an AI model**

Therefore:
- no mocking of business logic
- no stochastic outputs
- no snapshot-based assertions for core logic