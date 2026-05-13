# PROMPTS.md — LLM Prompting Strategy

## Production reality

BURNRATE AI does **not** rely on live LLM inference for core audit generation.

All financial outputs, savings calculations, recommendations, and optimization logic are generated through a **fully deterministic rule engine** implemented in:

```text
src/lib/audit.ts
```

This includes:

* savings calculations
* recommendation prioritization
* pricing comparisons
* consolidation logic
* audit summaries

The current production system intentionally avoids using LLMs for financial reasoning.

---

## Why deterministic generation was chosen

The product generates operational and financial recommendations. Because of this, audit outputs must be:

* reproducible
* explainable
* testable
* traceable to pricing data
* stable across identical inputs

Using deterministic logic ensures:

* no hallucinated savings numbers
* no inconsistent recommendations
* no hidden scoring behavior
* no dependency on external AI APIs
* zero token cost during audit execution

This design decision prioritizes trust and auditability over highly dynamic prose generation.

---

## Where AI assistance was considered

LLMs were explored only as an optional presentation layer for:

* executive-style summaries
* operator walkthroughs
* narrative explanation formatting

The intent was to improve readability without affecting underlying calculations.

Importantly:

> LLMs were never intended to generate financial calculations or pricing decisions.

### AI summary layer (presentation only)

In the current implementation, an LLM-based summary layer is used only after deterministic audit generation.

It receives fully computed structured outputs from the rule engine and converts them into a single natural-language executive insight.

This layer does not influence or modify any financial computation.

Its sole purpose is improving readability of deterministic results in a product-style narrative format (Stripe / Linear style).

---

## Planned LLM summary architecture (not production-enabled)

If implemented in a future version, the LLM layer would consume only precomputed deterministic outputs.

| Deterministic field   | Source                      |
| --------------------- | --------------------------- |
| `totalMonthlySavings` | `AuditResult`               |
| `totalAnnualSavings`  | `AuditResult`               |
| `savingsRate`         | `AuditResult`               |
| `topRecommendations`  | sorted recommendation array |
| `teamSize`            | audit input                 |
| `useCase`             | audit input                 |

The LLM would act only as a formatting/narrative layer.

---

## Example system prompt (prototype)

```text
You summarize precomputed SaaS audit results for operators and finance stakeholders.

Rules:
- Never invent or modify monetary values
- Only reference numeric values present in the provided JSON
- Maintain an executive SaaS tone
- Maximum 5 sentences
- Mention consolidation only if recommendation data explicitly includes it
- If required fields are missing, refuse summary generation

INPUT_JSON:
<<< AuditResult excerpt >>>
```

---

## Example user prompt (prototype)

```text
Write an operator-facing audit summary using the provided JSON.

Focus on:
- largest optimization opportunities
- spend consolidation
- team-level operational efficiency
- actionable next steps

Do not introduce numbers not present in the input.
```

---

## Prompting approaches that did NOT work

### 1. Fully free-form recommendation generation

**Attempt:**

* Let the LLM generate all recommendation text dynamically

**Problem:**

* Introduced risk of hallucinated savings claims
* Reduced explainability
* Made outputs inconsistent across runs

Rejected because deterministic trust was more important than prose variety.

---

### 2. Single mega-prompt returning JSON + narrative

**Attempt:**

* Have one prompt generate both structured output and summary prose

**Problem:**

* Parsing reliability became fragile
* Harder to validate outputs with tests
* Increased debugging complexity

Rejected in favor of:

* deterministic computation
* optional future narrative layer

---

## Failure handling strategy (future architecture)

If an optional LLM layer is added later:

| Failure mode                  | Fallback behavior               |
| ----------------------------- | ------------------------------- |
| API timeout                   | Render deterministic audit only |
| Invalid response schema       | Discard LLM output              |
| Hallucinated numeric mismatch | Reject summary                  |
| Provider outage               | Continue normal audit flow      |

The deterministic audit engine always remains the source of truth.

---

## Design principle

> AI should improve readability, not determine financial truth.

BURNRATE AI treats LLMs as optional presentation tooling, while keeping all pricing intelligence deterministic, testable, and reproducible.
