# METRICS.md — Product Metrics Strategy (BURNRATE AI)

## North Star Metric

### Activated audits per week

Definition:

> Number of completed audits that successfully generate a deterministic result page and shareable report URL.

An “activated audit” means a user:

- completed the audit flow
- submitted tooling + spend inputs
- reached `/result/[id]`
- received actionable optimization recommendations

This is the most important metric because BURNRATE AI is fundamentally a:

> high-intent B2B operational audit tool.

Raw traffic is less meaningful than whether technical operators complete the audit and engage with the results.

The product is not designed for daily engagement like a social platform. It is designed to trigger operational conversations around AI tooling spend.

---

## Input metrics driving the North Star

### 1. Landing page → audit start rate

Event:
`audit_started`

Measures whether positioning and messaging are compelling enough for visitors to begin the workflow.

This validates:
- landing page clarity
- perceived relevance
- initial trust

Target early-stage benchmark:
> 20–35%

---

### 2. Audit completion rate

Event:
`audit_completed`

Measures how many users finish the full audit after starting.

This is critical because long or confusing workflows reduce trust and lead quality.

Strong signal:
> users are willing to provide operational tooling data in exchange for recommendations.

Target benchmark:
> 60%+ completion from started audits

---

### 3. Share rate of result pages

Event:
`report_shared`

Measures whether users forward reports internally.

This is one of the strongest indicators that the product creates real operational value.

A forwarded report suggests:
- recommendations are understandable
- outputs feel trustworthy
- the audit is useful beyond the original user

Target benchmark:
> 15–25% of completed audits generating shared links

---

## What I would instrument first

Initial instrumentation priorities:

| Event | Purpose |
|---|---|
| `page_view_home` | Measure acquisition traffic |
| `audit_started` | Measure landing-page effectiveness |
| `audit_completed` | Core activation metric |
| `report_shared` | Measure virality and internal distribution |
| `lead_submit_success` | Track consultation intent |
| `audit_persist_success` | Validate persistence reliability |
| `result_view_return` | Measure repeat engagement |

Primary tooling would likely include:
- PostHog
- Vercel Analytics
- Supabase event persistence

---

## Metrics intentionally avoided

Metrics intentionally NOT prioritized early:

- Daily Active Users (DAU)
- session duration
- generic page views
- vanity traffic metrics

BURNRATE AI solves an operational budgeting problem, not a high-frequency engagement problem.

A successful user may only run audits:
- monthly
- quarterly
- during budgeting cycles
- after tooling expansion

Because of that, engagement quality matters more than usage frequency.

---

## Pivot trigger thresholds

Several metrics would trigger a product or positioning rethink.

### Pivot condition 1

If:
> audit completion rate falls below 35%

it likely means:
- workflow friction is too high
- trust messaging is weak
- users do not perceive enough value

---

### Pivot condition 2

If:
> fewer than 10% of audits generate shared reports

it suggests:
- recommendations are not compelling
- outputs are not trusted internally
- summaries are not finance-readable

---

### Pivot condition 3

If:
> completed audits are high but consultation conversions remain near zero

it suggests the product may function better as:
- a self-serve utility
rather than:
- a lead-generation funnel for Credex

That would require reconsidering monetization and positioning strategy.

---

## Core metrics philosophy

The most important signal is not traffic.

The strongest signal is:

> whether technical operators trust audit outputs enough to use them in real budgeting and tooling conversations.