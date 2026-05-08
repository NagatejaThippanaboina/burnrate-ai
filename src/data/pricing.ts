import { Tool } from "@/types/audit";

export const PRICING_LAST_UPDATED = "2026-05-08";

export const pricingCatalog: Tool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "chat",
    bestUseCase: "mixed",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, seatBased: true, notes: "Personal trials and low usage." },
      { id: "plus", name: "Plus", monthlyPrice: 20, seatBased: true, notes: "Best for founders and individual operators." },
      { id: "team", name: "Team", monthlyPrice: 30, seatBased: true, minTeamSize: 2, notes: "Shared workspace controls for teams." },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 60, seatBased: true, minTeamSize: 10, notes: "Advanced admin and compliance." },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    category: "chat",
    bestUseCase: "writing",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, seatBased: true, notes: "Occasional usage." },
      { id: "pro", name: "Pro", monthlyPrice: 20, seatBased: true, notes: "Best for writing-heavy workflows." },
      { id: "max", name: "Max", monthlyPrice: 40, seatBased: true, notes: "Higher limits for power users." },
      { id: "team", name: "Team", monthlyPrice: 30, seatBased: true, minTeamSize: 2, notes: "Shared collaboration and governance." },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    category: "chat",
    bestUseCase: "research",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, seatBased: true, notes: "Basic assistant usage." },
      { id: "pro", name: "Pro", monthlyPrice: 20, seatBased: true, notes: "Productivity and analysis workflows." },
      { id: "ultra", name: "Ultra", monthlyPrice: 35, seatBased: true, notes: "Higher usage with premium capabilities." },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Cursor",
    category: "coding",
    bestUseCase: "coding",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, seatBased: true, notes: "Evaluation and light usage." },
      { id: "pro", name: "Pro", monthlyPrice: 20, seatBased: true, notes: "Most teams start here." },
      { id: "business", name: "Business", monthlyPrice: 40, seatBased: true, minTeamSize: 3, notes: "Policy, SSO, and admin controls." },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub",
    category: "coding",
    bestUseCase: "coding",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, seatBased: true, notes: "Limited usage." },
      { id: "individual", name: "Individual", monthlyPrice: 10, seatBased: true, notes: "Solo developers." },
      { id: "business", name: "Business", monthlyPrice: 19, seatBased: true, minTeamSize: 2, notes: "Org controls and seat management." },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 39, seatBased: true, minTeamSize: 10, notes: "Enterprise governance." },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium",
    category: "coding",
    bestUseCase: "coding",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, seatBased: true, notes: "Basic coding assistant." },
      { id: "pro", name: "Pro", monthlyPrice: 15, seatBased: true, notes: "Solo and small team use." },
      { id: "teams", name: "Teams", monthlyPrice: 30, seatBased: true, minTeamSize: 3, notes: "Team management and controls." },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity",
    category: "research",
    bestUseCase: "research",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, seatBased: true, notes: "Occasional web research." },
      { id: "pro", name: "Pro", monthlyPrice: 20, seatBased: true, notes: "Daily research and citation workflows." },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 45, seatBased: true, minTeamSize: 5, notes: "Enterprise security and controls." },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    vendor: "OpenAI",
    category: "api",
    bestUseCase: "mixed",
    plans: [
      { id: "starter", name: "Starter", monthlyPrice: 60, seatBased: false, includedMonthlyUsageUsd: 75, notes: "Small product experiments." },
      { id: "growth", name: "Growth", monthlyPrice: 180, seatBased: false, includedMonthlyUsageUsd: 250, notes: "Production app workloads." },
      { id: "scale", name: "Scale", monthlyPrice: 500, seatBased: false, includedMonthlyUsageUsd: 700, notes: "Large scale throughput." },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    vendor: "Anthropic",
    category: "api",
    bestUseCase: "writing",
    plans: [
      { id: "starter", name: "Starter", monthlyPrice: 55, seatBased: false, includedMonthlyUsageUsd: 70, notes: "Early integrations." },
      { id: "growth", name: "Growth", monthlyPrice: 170, seatBased: false, includedMonthlyUsageUsd: 240, notes: "Reliable production usage." },
      { id: "scale", name: "Scale", monthlyPrice: 460, seatBased: false, includedMonthlyUsageUsd: 650, notes: "High-volume enterprise usage." },
    ],
  },
  {
    id: "v0",
    name: "v0",
    vendor: "Vercel",
    category: "builder",
    bestUseCase: "coding",
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, seatBased: true, notes: "Trial UI generation." },
      { id: "premium", name: "Premium", monthlyPrice: 20, seatBased: true, notes: "Faster iteration and limits." },
      { id: "team", name: "Team", monthlyPrice: 50, seatBased: true, minTeamSize: 3, notes: "Collaboration for product teams." },
    ],
  },
  {
    id: "replit-ai",
    name: "Replit AI",
    vendor: "Replit",
    category: "builder",
    bestUseCase: "coding",
    plans: [
      { id: "core", name: "Core", monthlyPrice: 20, seatBased: true, notes: "Solo cloud development and AI tooling." },
      { id: "teams", name: "Teams", monthlyPrice: 35, seatBased: true, minTeamSize: 3, notes: "Team collaboration with governance." },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 60, seatBased: true, minTeamSize: 10, notes: "Enterprise controls and compliance." },
    ],
  },
];
