# USER_INTERVIEWS.md — User Research Notes (BURNRATE AI)

## Interview 1

| Field | Details |
|---|---|
| Name / Initials | s. udayasree |
| Role | Freelance full-stack developer |
| Company stage | Solo / contractor |
| Duration | ~15 minutes |

### Direct quotes

> “I’m paying for Cursor, ChatGPT, and Claude at the same time because each one is better at different things.”

> “Honestly, I stopped tracking AI tool spending after the second month.”

> “GitHub Copilot is company-paid, but I still personally pay for Cursor.”

> “The problem isn’t one expensive tool — it’s five smaller subscriptions stacking together.”

### Most surprising thing they said

The most surprising insight was that AI tooling decisions were happening completely independently from budgeting decisions. They mentioned that tools are often purchased impulsively during development crunch periods and rarely reviewed later.

I originally assumed small teams intentionally optimized their stack early, but the conversation suggested the opposite: teams prioritize shipping speed first and only think about optimization after costs accumulate noticeably.

### What this changed about the product

This interview pushed me to make recommendations more finance-readable rather than purely technical.

Initially, recommendations focused heavily on tooling overlap. After this conversation, I added clearer savings summaries and operational explanations so non-engineering stakeholders could understand why a recommendation exists.

It also reinforced the importance of deterministic outputs because the participant specifically said they would not trust “AI-generated financial guesses.”

---

## Interview 2

| Field | Details |
|---|---|
| Name / Initials | t. gopikrishna |
| Role | Startup engineering intern |
| Company stage | Early-stage SaaS startup (~20 employees) |
| Duration | ~10 minutes |

### Direct quotes

> “We adopted AI tools so quickly that nobody really knows what we’re actively using anymore.”

> “Different engineers prefer different copilots, so we just expense all of them.”

> “The API bill only becomes visible when finance asks about it.”

> “A shareable report would actually help because founders always ask for summaries.”

### Most surprising thing they said

The most unexpected insight was that tooling duplication was often tolerated intentionally because engineering teams optimized for individual productivity preferences rather than centralized cost efficiency.

I initially assumed teams would standardize quickly around one preferred AI tool, but this interview showed that multiple overlapping subscriptions are common even in relatively small engineering teams.

### What this changed about the product

This conversation directly influenced the decision to improve report-sharing functionality and executive summaries.

I realized the output could not only target developers — it also needed to work as an internal communication artifact between engineering, founders, and finance teams.

This led to improving:

- deterministic summary generation
- clearer recommendation ordering
- shareable audit URLs
- investor-demo style presentation quality

---

## Interview 3

| Field | Details |
|---|---|
| Name / Initials | v. dixita |
| Role | Computer science student building AI side projects |
| Company stage | Pre-startup / indie builder |
| Duration | ~12 minutes |

### Direct quotes

> “I subscribed to tools one by one without realizing the total monthly cost.”

> “OpenAI API costs feel unpredictable compared to subscriptions.”

> “I’d trust recommendations more if I could clearly see how savings were calculated.”

> “Most AI dashboards feel too enterprise-heavy for smaller teams.”

### Most surprising thing they said

The strongest insight from this conversation was that transparency mattered more than automation.

The participant repeatedly emphasized wanting to understand how recommendations were generated instead of simply receiving “optimized” outputs.

That validated the deterministic architecture direction for BURNRATE AI.

### What this changed about the product

Before this interview, I considered making recommendation summaries more aggressively AI-generated.

After the conversation, I intentionally leaned further into explainability and deterministic pricing logic.

This interview also influenced:
- pricing traceability documentation
- recommendation reasoning visibility
- audit explainability messaging
- trust-focused landing-page copy

It reinforced the idea that operational trust is a competitive advantage in AI infrastructure tooling.

---

## Common patterns across interviews

Across all conversations, several patterns appeared consistently:

- teams adopt AI tools faster than they review spending
- multiple overlapping subscriptions are common
- API costs are poorly understood until invoices increase
- founders want finance-readable summaries
- users trust explainable recommendations more than opaque AI-generated scoring systems

The interviews validated that AI tooling sprawl is becoming a real operational problem even for relatively small technical teams.