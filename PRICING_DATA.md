# BURNRATE AI — Pricing data & official sources

> **Disclaimer:** SaaS/API pricing moves frequently. Vendor pages below are the **authoritative** references. The in-repo catalog (`src/data/pricing.ts`) is a bounded teaching model keyed off these sources—not a guaranteed live scrape.

## Chat & assistants

| Product | Official pricing / plans reference |
|---------|--------------------------------------|
| **ChatGPT** | [ChatGPT pricing (OpenAI)](https://openai.com/chatgpt/pricing/) |
| **Claude (consumer / team tiers)** | [Claude pricing (Anthropic)](https://www.anthropic.com/pricing) |
| **Google Gemini / Google AI** | [Gemini API pricing overview (Google)](https://ai.google.dev/pricing) (see also broader Google Workspace / Gemini consumer tiers as applicable on official Google domains) |

## Coding copilots & builders

| Product | Official pricing / plans reference |
|---------|--------------------------------------|
| **GitHub Copilot** | [GitHub Copilot plans](https://github.com/features/copilot/plans) |
| **Cursor** | [Cursor pricing](https://www.cursor.com/pricing) |
| **Windsurf** | Consumer plans: **[windsurf.com/pricing](https://windsurf.com/pricing)** · Usage/account reference: **[Windsurf docs (Codeium)](https://docs.codeium.com/windsurf/accounts/usage)** |

## Usage-based APIs

| Product | Official pricing reference |
|---------|----------------------------|
| **OpenAI API** | [OpenAI Platform pricing](https://openai.com/api/pricing/) |
| **Anthropic API** | Pricing reference on **[Anthropic API / Console documentation](https://docs.anthropic.com/)** and linked console pricing |

## Builders

| Product | Official pricing reference |
|---------|----------------------------|
| **v0 by Vercel** | [Vercel v0 docs / pricing references](https://vercel.com/docs/v0/overview) |

## Operational note

When updating `pricingCatalog`:

1. Open each official URL row above  
2. Update plan names **and** headline monthly fees where materially different  
3. Bump `PRICING_LAST_UPDATED` in `src/data/pricing.ts`  
4. Re-run Vitest audit tests — they implicitly pin behavioral expectations to catalog structure
