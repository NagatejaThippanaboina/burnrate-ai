# Economics — Credex-scope working model

> Not financial advice—these ranges structure **pricing experiments** assuming BURNRATE AI ships as SaaS—not current revenue claims.

## Assumed unit buckets

| SKU | Intended buyer | Rough ARPA anchor (hypothesis) |
|-----|----------------|-------------------------------|
| **Self-serve audits** | Team lead / CFO shadow | Usage-based audits + export |
| **Assisted Credex audits** | Outbound Credex interns | Credits / rev-share with partner—not modeled here |

## Cost stack (engineering view)

| Line item | Scale note |
|-----------|------------|
| **Vercel** | Hobby / Pro tiers until traffic exceeds preview limits |
| **Supabase** | Free tier dev; production rows grow with audits + leads |
| **Outbound email** (Resend / SendGrid — future) | Deferred—lead capture persists first |

## Contribution margin heuristic

If ARPA hypothetical → **\$199/mo**:

- infra + Supabase negligible until ~10–50k monthly active audits  
- **gross margin** stays high absent human review labor on every audit  

## Model risks

| Risk | Mitigation path |
|------|----------------|
| Prospect fatigue (“another audit tool”) | Tight Credex wedge + deterministic explainability narrative |
| Low willingness to pay absent SSO / seats | Monetize richer workspace features post intern scope |
