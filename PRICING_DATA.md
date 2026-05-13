# BURNRATE AI — Pricing data & official sources

> **Disclaimer:** SaaS/API pricing changes frequently. All values below are referenced from official vendor pricing pages. The in-repo `src/data/pricing.ts` is a deterministic snapshot used for audit calculations, not a live scraper.

---

## Chat & assistants

ChatGPT - Plus: $20/month — https://openai.com/chatgpt/pricing/ — verified 2026-05-13  
ChatGPT - Team: $25/user/month — https://openai.com/chatgpt/pricing/ — verified 2026-05-13  
ChatGPT - Enterprise: custom pricing — https://openai.com/chatgpt/pricing/ — verified 2026-05-13  

Claude - Pro: $20/month — https://www.anthropic.com/pricing — verified 2026-05-13  
Claude - Team: $30/user/month — https://www.anthropic.com/pricing — verified 2026-05-13  
Claude - Enterprise: custom pricing — https://www.anthropic.com/pricing — verified 2026-05-13  

Gemini - Pro: $19.99/month — https://ai.google.dev/pricing — verified 2026-05-13  
Gemini - Ultra: varies by region — https://ai.google.dev/pricing — verified 2026-05-13  

---

## Coding copilots & builders

GitHub Copilot - Individual: $10/month — https://github.com/features/copilot/plans — verified 2026-05-13  
GitHub Copilot - Business: $19/user/month — https://github.com/features/copilot/plans — verified 2026-05-13  
GitHub Copilot - Enterprise: $39/user/month — https://github.com/features/copilot/plans — verified 2026-05-13  

Cursor - Hobby: $0/month — https://www.cursor.com/pricing — verified 2026-05-13  
Cursor - Pro: $20/month — https://www.cursor.com/pricing — verified 2026-05-13  
Cursor - Business: $40/user/month — https://www.cursor.com/pricing — verified 2026-05-13  

Windsurf - Pro: $15/month — https://windsurf.com/pricing — verified 2026-05-13  
Windsurf - Teams: $30/user/month — https://windsurf.com/pricing — verified 2026-05-13  

v0 by Vercel - Pro: $20/month — https://vercel.com/docs/v0/overview — verified 2026-05-13  

---

## Usage-based APIs

OpenAI API - usage-based pricing (varies by model) — https://openai.com/api/pricing/ — verified 2026-05-13  
Anthropic API - usage-based pricing (varies by model) — https://docs.anthropic.com/ — verified 2026-05-13  

---

## Operational rules

When updating `src/data/pricing.ts`:

1. Treat each line above as a deterministic pricing source  
2. Do NOT infer pricing outside official references  
3. Ensure audit engine mapping matches plan labels exactly  
4. Update `PRICING_LAST_UPDATED` when modifying catalog  
5. Run `npm run test` before committing changes  

---

## Key principle

> Audit correctness depends on pricing traceability, not estimation.

All recommendations in BURNRATE AI must be reproducible from this dataset.