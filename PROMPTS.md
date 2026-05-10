# LLM prompting — personalized summaries

## Production reality today

The shipped product **does not call an LLM** to personalize audit outputs. Recommendation copy is assembled by **deterministic template strings** in `src/lib/audit.ts` (for example via `makeReasoning()` and conditional branches on plan / spend / consolidation rules).

Pros of this baseline:

1. Explainable audits for judges and skeptical buyers (“show me the rule”).  
2. Zero hallucination budget on headline savings numbers—they come from deterministic math aligned to `pricingCatalog`.  
3. No token cost or outage surface on audit completion.

Trade-off recorded in ARCHITECTURE.md: prose is less bespoke than frontier LLM rewriting.

---

## Planned / hypothetical LLM layer (design only — not wired in codebase)

Because no LLM is invoked in-repo, sections below capture **experiment documentation** placeholders so future work—or portfolio reviewers—know what was consciously skipped.

### Intention (if shipped)

Compose a secondary **“Operator summary”** paragraph that stitches together:

| Field | Already produced deterministically |
|-------|------------------------------------|
| `totalMonthlySavings`, `totalAnnualSavings`, `savingsRate` | `AuditResult` |
| Highest-impact recommendation | Highest sort order in recommendations array |
| Team size | `teamSize` |
| Declared workload | `useCase` |

The model should **never** invent new numeric savings—those must mirror JSON inputs.

### Example system prompt skeleton (pseudo)

```
You summarize pre-computed SaaS audit JSON for CFOs.

Rules:
- Never change or invent monetary amounts; cite only numbers present in FIELD names.
- 5 sentences maximum, executive tone.
- Call out governance or consolidation ONLY if flagged in RECOMMENDATION entries.
REFUSAL: If JSON missing totals, refuse narrative and ask for rerun.
INPUT_JSON: <<< paste AuditResult excerpt >>>
```

### Example user prompt skeleton (pseudo)

```
Write the operator walkthrough referencing teamSize and useCase.
Prefer concrete next step from top recommendation.reasoning verbatim paraphrase.
```

### Fallback handling strategy (future)

| Failure mode | Fallback |
|--------------|----------|
| API timeout / quota | Omit LLM banner; deterministic UI already visible |
| JSON schema drift guardrail trip | Omit LLM banner + log correlation ID |

### Prompting experiments (documented—not production)

Attempts not merged because ROI low for Credex-scope timeline:

| Attempt idea | Failure reason |
|--------------|----------------|
| Fully free-form “rewrite every recommendation prose” without JSON guardrails | Risk of numeric hallucination violating trust bar |
| One mega-prompt emitting JSON + prose | Parsing fragility outweighs deterministic split already in codebase |
