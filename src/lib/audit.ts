import { pricingCatalog } from "@/data/pricing";
import { AuditInput, AuditResult, ToolPlan, ToolPricing, ToolRecommendation } from "@/types/audit";

const useCaseVendors = {
  coding: ["Cursor", "GitHub", "OpenAI", "Anthropic"],
  writing: ["Anthropic", "OpenAI", "Notion", "Jasper"],
  research: ["Perplexity", "Google", "Anthropic", "OpenAI"],
  mixed: ["OpenAI", "Anthropic", "Google", "Microsoft"],
} as const;

const monthlyCostFor = (plan: ToolPlan, teamSize: number): number =>
  Math.round(plan.monthlyPricePerSeat * teamSize * 100) / 100;

const findTool = (toolId: string): ToolPricing | undefined =>
  pricingCatalog.find((tool) => tool.id === toolId);

const findCheapestPlan = (tool: ToolPricing): ToolPlan =>
  tool.plans.reduce((lowest, current) =>
    current.monthlyPricePerSeat < lowest.monthlyPricePerSeat ? current : lowest,
  );

const findPreferredVendorAlternative = (tool: ToolPricing, vendors: readonly string[]): ToolPricing | undefined =>
  pricingCatalog.find(
    (candidate) => candidate.id !== tool.id && candidate.category === tool.category && vendors.includes(candidate.vendor),
  );

const toRecommendation = (
  input: AuditInput,
  tool: ToolPricing,
  currentPlan: ToolPlan,
  currentSpend: number,
): ToolRecommendation => {
  const cheapestSameVendorPlan = findCheapestPlan(tool);
  const preferredAlternative = findPreferredVendorAlternative(tool, useCaseVendors[input.useCase]);

  const currentVendorExpected = monthlyCostFor(currentPlan, input.teamSize);
  const currentBaseline = Math.min(currentVendorExpected, currentSpend);

  let recommendedPlan = cheapestSameVendorPlan;
  let recommendationType: ToolRecommendation["recommendationType"] = "plan";

  if (preferredAlternative) {
    const altPlan = findCheapestPlan(preferredAlternative);
    const altCost = monthlyCostFor(altPlan, input.teamSize);
    const sameVendorCost = monthlyCostFor(cheapestSameVendorPlan, input.teamSize);
    if (altCost < sameVendorCost) {
      recommendedPlan = { ...altPlan, name: `${preferredAlternative.name} ${altPlan.name}` };
      recommendationType = "vendor";
    }
  }

  const optimizedMonthlyCost = monthlyCostFor(recommendedPlan, input.teamSize);
  const monthlySavings = Math.max(0, Math.round((currentBaseline - optimizedMonthlyCost) * 100) / 100);
  const yearlySavings = Math.round(monthlySavings * 12 * 100) / 100;
  const overspendPercentage =
    currentBaseline > 0 ? Math.round((monthlySavings / currentBaseline) * 10000) / 100 : 0;

  if (monthlySavings <= 0) {
    return {
      toolId: tool.id,
      toolName: tool.name,
      currentPlan: currentPlan.name,
      recommendedPlan: currentPlan.name,
      currentMonthlySpend: currentSpend,
      expectedMonthlyCost: currentBaseline,
      monthlySavings: 0,
      yearlySavings: 0,
      overspendPercentage: 0,
      explanation: "You are already optimized on this tool based on current plan and team usage.",
      recommendationType: "optimized",
    };
  }

  const explanation =
    recommendationType === "vendor"
      ? `Switching to ${recommendedPlan.name} aligns better with ${input.useCase} usage and reduces recurring seat cost.`
      : `Your current spend is above the lowest suitable plan for this tool and team size. Downgrading preserves capability while reducing cost.`;

  return {
    toolId: tool.id,
    toolName: tool.name,
    currentPlan: currentPlan.name,
    recommendedPlan: recommendedPlan.name,
    currentMonthlySpend: currentSpend,
    expectedMonthlyCost: optimizedMonthlyCost,
    monthlySavings,
    yearlySavings,
    overspendPercentage,
    explanation,
    recommendationType,
  };
};

export const runAudit = (input: AuditInput): AuditResult => {
  const recommendations: ToolRecommendation[] = [];

  for (const toolInput of input.tools) {
    const tool = findTool(toolInput.toolId);
    if (!tool) continue;

    const plan = tool.plans.find((candidatePlan) => candidatePlan.id === toolInput.planId);
    if (!plan) continue;

    recommendations.push(toRecommendation(input, tool, plan, toolInput.monthlySpend));
  }

  const totalMonthlySpend = Math.round(
    recommendations.reduce((sum, recommendation) => sum + recommendation.currentMonthlySpend, 0) * 100,
  ) / 100;

  const totalMonthlySavings = Math.round(
    recommendations.reduce((sum, recommendation) => sum + recommendation.monthlySavings, 0) * 100,
  ) / 100;

  const totalYearlySavings = Math.round(totalMonthlySavings * 12 * 100) / 100;
  const optimizedMonthlySpend = Math.max(0, Math.round((totalMonthlySpend - totalMonthlySavings) * 100) / 100);
  const overspendPercentage =
    totalMonthlySpend > 0 ? Math.round((totalMonthlySavings / totalMonthlySpend) * 10000) / 100 : 0;

  return {
    id: crypto.randomUUID(),
    input,
    recommendations,
    totalMonthlySpend,
    optimizedMonthlySpend,
    totalMonthlySavings,
    totalYearlySavings,
    overspendPercentage,
    isOptimized: totalMonthlySavings <= 0,
    createdAt: new Date().toISOString(),
  };
};
