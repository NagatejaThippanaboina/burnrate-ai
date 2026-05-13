import { openai } from "@/lib/openai";

type SummaryInputTool = {
  toolId?: string;
  toolName?: string;
  vendor?: string;
  planId?: string;
  planName?: string;
};

export type DynamicSummaryInput = {
  tools: SummaryInputTool[];
  monthlySpend: number;
  savings: number;
  recommendations: string[];
  teamSize?: number;
  useCase?: string;
  auditId?: string;
};

const money = (value: number): string =>
  `$${Math.round(value).toLocaleString()}`;

const toTitle = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const uniqueVendors = (tools: SummaryInputTool[]): string[] => {
  const set = new Set<string>();
  for (const tool of tools) {
    const vendor = (tool.vendor ?? "").trim();
    if (vendor) set.add(vendor);
  }
  return [...set];
};

const hasEnterpriseOverprovision = (
  tools: SummaryInputTool[],
  teamSize: number
): boolean => {
  if (teamSize >= 10) return false;
  return tools.some((tool) => {
    const plan = `${tool.planName ?? ""} ${tool.planId ?? ""}`.toLowerCase();
    return (
      plan.includes("enterprise") ||
      plan.includes("business") ||
      plan.includes("team")
    );
  });
};

const hasCodingOverlap = (tools: SummaryInputTool[]): boolean => {
  const codingSignals = ["copilot", "cursor", "windsurf", "replit"];
  const matched = tools.filter((tool) => {
    const text = `${tool.toolName ?? ""} ${tool.toolId ?? ""}`.toLowerCase();
    return codingSignals.some((signal) => text.includes(signal));
  });
  return matched.length >= 2;
};

const selectTopRecommendations = (recommendations: string[]): string[] =>
  recommendations.map((r) => r.trim()).filter(Boolean).slice(0, 3);

const computeInputSignature = (input: DynamicSummaryInput): number => {
  const seed = JSON.stringify(input);
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
};

const wordCount = (text: string): number =>
  text.trim().split(/\s+/).filter(Boolean).length;

const formatUseCase = (useCase: string): string => {
  const n = (useCase || "").toLowerCase();

  if (n === "api") return "API";
  if (n === "dev") return "Engineering";
  if (n === "engineering") return "Engineering";
  if (n === "writing") return "Content";
  if (n === "mixed") return "Mixed";

  return toTitle(n);
};

/**
 * 🔥 FIXED: NO REPORT LANGUAGE, PURE PRODUCT NARRATIVE
 */
function generateDeterministicSummary(input: DynamicSummaryInput): string {
  if (!input.tools || input.tools.length === 0) {
    return "Tooling data is not yet available, so no meaningful insight can be generated yet.";
  }

  const monthlySpend = Math.max(0, input.monthlySpend);
  const monthlySavings = Math.max(0, input.savings);
  const annualSpend = monthlySpend * 12;

  const teamSize = Math.max(1, input.teamSize ?? 1);
  const useCase = input.useCase ?? "mixed";
  const tools = input.tools ?? [];

  const signature = computeInputSignature(input);

  // ---------------- PURE PRODUCT OPENING ----------------
  const introOptions = [
    `The AI stack runs at ${money(monthlySpend)} monthly (${money(annualSpend)} annualized) across ${tools.length} tools.`,
    `Monthly AI spend is ${money(monthlySpend)}, spread across the current tool ecosystem.`,
    `AI tooling operates at ${money(monthlySpend)} per month with distributed usage across teams.`,
  ];

  const intro = introOptions[signature % introOptions.length];

  // ---------------- INSIGHT (NO FINANCE WORDING) ----------------
  const insightOptions = [
    "Usage patterns show overlapping capabilities across tools solving similar problems.",
    "The system reflects duplicated functionality rather than excessive spending.",
    "Tool selection shows multiple solutions covering the same workflow areas.",
  ];

  const insight = insightOptions[(signature + 1) % insightOptions.length];

  // ---------------- VALUE MOMENT (SOFT SAVINGS) ----------------
  const savings =
    monthlySavings > 0
      ? `There is ${money(monthlySavings)} monthly recoverable spend (${
          money(monthlySavings * 12)
        } annualized) tied to duplicate usage patterns.`
      : "Spend is already relatively tight with minimal immediate recovery surface.";

  // ---------------- SIGNAL ----------------
  const signal =
    tools.length > 2
      ? "The tool ecosystem has noticeable overlap across vendors."
      : "The stack is relatively lean with limited duplication.";

  // ---------------- STRATEGY (NO CORPORATE WORDING) ----------------
  const strategyOptions = [
    "Reducing overlap between tools would simplify the stack.",
    "Aligning tools to single workflows would naturally reduce redundancy.",
    "Consolidating similar tools would streamline usage.",
  ];

  const strategy = strategyOptions[(signature + 2) % strategyOptions.length];

  // ---------------- USE CASE ----------------
  const useCaseSentence = `For ${formatUseCase(
    useCase
  )} workflows, the system should prioritize speed and simplicity over tool diversity.`;

  return [
    intro,
    insight,
    savings,
    signal,
    strategy,
    useCaseSentence,
  ].join(" ");
}

export async function generateDynamicSummary(
  input: DynamicSummaryInput
): Promise<string> {
  const deterministicSummary = generateDeterministicSummary(input);

  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "system",
          content: `
You write YC-level SaaS product insights.

STYLE:
- Stripe / Linear / Vercel narrative tone
- ONE flowing paragraph only
- no “report”, “analysis”, “optimization” phrasing
- no repetitive sentence patterns
- no structured thinking or listing
- human executive product language

RULES:
- preserve ALL numbers exactly
- never sound academic or audit-like
- avoid repeating keywords like "cost", "optimization", "savings"
- make it feel like a product insight, not a financial report
          `.trim(),
        },
        {
          role: "user",
          content: deterministicSummary,
        },
      ],
      temperature: 0.5,
      max_tokens: 180,
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      deterministicSummary
    );
  } catch (error) {
    console.error("OpenAI summary failed:", error);
    return deterministicSummary;
  }
}