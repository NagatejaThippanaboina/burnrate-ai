import { ToolPricing } from "@/types/audit";

export const PRICING_LAST_UPDATED = "2026-05-08";

export const pricingCatalog: ToolPricing[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "core",
    plans: [
      { id: "free", name: "Free", monthlyPricePerSeat: 0 },
      { id: "plus", name: "Plus", monthlyPricePerSeat: 20 },
      { id: "team", name: "Team", monthlyPricePerSeat: 30 },
      { id: "enterprise", name: "Enterprise", monthlyPricePerSeat: 60 },
      { id: "api", name: "API", monthlyPricePerSeat: 35, supportsApiUsage: true },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    category: "core",
    plans: [
      { id: "free", name: "Free", monthlyPricePerSeat: 0 },
      { id: "pro", name: "Pro", monthlyPricePerSeat: 20 },
      { id: "max", name: "Max", monthlyPricePerSeat: 40 },
      { id: "team", name: "Team", monthlyPricePerSeat: 30 },
      { id: "enterprise", name: "Enterprise", monthlyPricePerSeat: 65 },
      { id: "api", name: "API", monthlyPricePerSeat: 32, supportsApiUsage: true },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    category: "core",
    plans: [
      { id: "pro", name: "Pro", monthlyPricePerSeat: 20 },
      { id: "ultra", name: "Ultra", monthlyPricePerSeat: 35 },
      { id: "api", name: "API", monthlyPricePerSeat: 28, supportsApiUsage: true },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    vendor: "Perplexity",
    category: "core",
    plans: [
      { id: "free", name: "Free", monthlyPricePerSeat: 0 },
      { id: "pro", name: "Pro", monthlyPricePerSeat: 20 },
      { id: "enterprise", name: "Enterprise", monthlyPricePerSeat: 45 },
    ],
  },
  {
    id: "microsoft-copilot",
    name: "Microsoft Copilot",
    vendor: "Microsoft",
    category: "core",
    plans: [
      { id: "individual", name: "Individual", monthlyPricePerSeat: 20 },
      { id: "business", name: "Business", monthlyPricePerSeat: 30 },
      { id: "enterprise", name: "Enterprise", monthlyPricePerSeat: 45 },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub",
    category: "core",
    plans: [
      { id: "individual", name: "Individual", monthlyPricePerSeat: 10 },
      { id: "business", name: "Business", monthlyPricePerSeat: 19 },
      { id: "enterprise", name: "Enterprise", monthlyPricePerSeat: 39 },
    ],
  },
  {
    id: "cursor",
    name: "Cursor AI",
    vendor: "Cursor",
    category: "core",
    plans: [
      { id: "hobby", name: "Hobby", monthlyPricePerSeat: 0 },
      { id: "pro", name: "Pro", monthlyPricePerSeat: 20 },
      { id: "business", name: "Business", monthlyPricePerSeat: 40 },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium",
    category: "core",
    plans: [
      { id: "individual", name: "Individual", monthlyPricePerSeat: 15 },
      { id: "teams", name: "Teams", monthlyPricePerSeat: 30 },
    ],
  },
  {
    id: "v0",
    name: "v0 (Vercel AI)",
    vendor: "Vercel",
    category: "core",
    plans: [
      { id: "starter", name: "Starter", monthlyPricePerSeat: 20 },
      { id: "pro", name: "Pro", monthlyPricePerSeat: 40 },
      { id: "team", name: "Team", monthlyPricePerSeat: 80 },
    ],
  },
  {
    id: "replit-ai",
    name: "Replit AI",
    vendor: "Replit",
    category: "core",
    plans: [
      { id: "core", name: "Core", monthlyPricePerSeat: 20 },
      { id: "teams", name: "Teams", monthlyPricePerSeat: 35 },
      { id: "enterprise", name: "Enterprise", monthlyPricePerSeat: 60 },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    vendor: "OpenAI",
    category: "api",
    plans: [
      { id: "gpt-4o-tier", name: "GPT-4o Tier", monthlyPricePerSeat: 120, supportsApiUsage: true },
      { id: "gpt-4.1-tier", name: "GPT-4.1 Tier", monthlyPricePerSeat: 180, supportsApiUsage: true },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    vendor: "Anthropic",
    category: "api",
    plans: [
      { id: "sonnet-tier", name: "Sonnet Tier", monthlyPricePerSeat: 110, supportsApiUsage: true },
      { id: "opus-tier", name: "Opus Tier", monthlyPricePerSeat: 210, supportsApiUsage: true },
    ],
  },
  {
    id: "gemini-api",
    name: "Google Gemini API",
    vendor: "Google",
    category: "api",
    plans: [
      { id: "flash-tier", name: "Flash Tier", monthlyPricePerSeat: 95, supportsApiUsage: true },
      { id: "pro-tier", name: "Pro Tier", monthlyPricePerSeat: 160, supportsApiUsage: true },
    ],
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    vendor: "Notion",
    category: "advanced",
    plans: [
      { id: "addon", name: "AI Add-on", monthlyPricePerSeat: 10 },
      { id: "business", name: "Business + AI", monthlyPricePerSeat: 24 },
    ],
  },
  {
    id: "jasper",
    name: "Jasper AI",
    vendor: "Jasper",
    category: "advanced",
    plans: [
      { id: "creator", name: "Creator", monthlyPricePerSeat: 49 },
      { id: "pro", name: "Pro", monthlyPricePerSeat: 69 },
      { id: "business", name: "Business", monthlyPricePerSeat: 99 },
    ],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    vendor: "Midjourney",
    category: "advanced",
    plans: [
      { id: "basic", name: "Basic", monthlyPricePerSeat: 10 },
      { id: "standard", name: "Standard", monthlyPricePerSeat: 30 },
      { id: "pro", name: "Pro", monthlyPricePerSeat: 60 },
    ],
  },
];
