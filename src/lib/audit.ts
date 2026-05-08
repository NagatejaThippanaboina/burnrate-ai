import { pricingCatalog } from "@/data/pricing";
import { AuditInput, AuditRecommendation, AuditResult, Plan, Tool, UserSelection } from "@/types/audit";

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

const expectedPlanCost = (plan: Plan, teamSize: number): number =>
  roundMoney(plan.seatBased ? plan.monthlyPrice * teamSize : plan.monthlyPrice);

const findTool = (toolId: string): Tool | undefined => pricingCatalog.find((tool) => tool.id === toolId);

const isEnterpriseLike = (planName: string): boolean => {
  const normalized = planName.toLowerCase();
  return normalized.includes("enterprise") || normalized.includes("scale");
};

const isTeamBusinessLike = (planName: string): boolean => {
  const normalized = planName.toLowerCase();
  return normalized.includes("team") || normalized.includes("business") || normalized.includes("growth");
};

const isFreePlan = (planName: string): boolean => planName.toLowerCase() === "free";

const conservativeSavings = (baseline: number, optimized: number): number => {
  const raw = Math.max(0, roundMoney(baseline - optimized));
  const capped = roundMoney(baseline * 0.65);
  return Math.min(raw, capped);
};

const pickCheapestSuitablePlan = (tool: Tool, teamSize: number, currentPlan?: Plan): Plan => {
  const candidates = tool.plans.filter((plan) => {
    if (plan.minTeamSize && teamSize < plan.minTeamSize) return false;
    if (teamSize > 3 && isFreePlan(plan.name)) return false;
    if (currentPlan && isEnterpriseLike(currentPlan.name) && !isEnterpriseLike(plan.name) && !isTeamBusinessLike(plan.name)) {
      return false;
    }
    return true;
  });
  const fallback = currentPlan ?? tool.plans[0];
  if (!candidates.length) return fallback;
  return candidates.reduce((cheapest, current) => (current.monthlyPrice < cheapest.monthlyPrice ? current : cheapest));
};

const makeReasoning = (summary: string, detail: string): string => `${summary} ${detail}`;

const buildToolRecommendation = (
  selection: UserSelection,
  teamSize: number,
  useCase: AuditInput["useCase"],
): AuditRecommendation | null => {
  const tool = findTool(selection.toolId);
  if (!tool) return null;

  const currentPlan = tool.plans.find((plan) => plan.id === selection.planId);
  if (!currentPlan) return null;

  const currentSpend = roundMoney(selection.monthlySpend);
  const currentExpected = expectedPlanCost(currentPlan, teamSize);
  const baseline = Math.max(currentSpend, currentExpected);
  const cheapestPlan = pickCheapestSuitablePlan(tool, teamSize, currentPlan);
  const cheapestPlanCost = expectedPlanCost(cheapestPlan, teamSize);

  if (currentPlan.minTeamSize && teamSize < currentPlan.minTeamSize && cheapestPlan.id !== currentPlan.id) {
    const monthlySavings = conservativeSavings(baseline, cheapestPlanCost);
    return {
      key: `${tool.id}-downgrade`,
      toolId: tool.id,
      toolName: tool.name,
      currentPlan: currentPlan.name,
      recommendedPlan: cheapestPlan.name,
      currentMonthlySpend: baseline,
      optimizedMonthlySpend: cheapestPlanCost,
      monthlySavings,
      annualSavings: roundMoney(monthlySavings * 12),
      recommendationType: "downgrade",
      category: "Plan Optimization",
      confidence: "High confidence",
      reasoning: makeReasoning(
        `Team size is ${teamSize}, below ${currentPlan.minTeamSize} seats required for ${currentPlan.name}.`,
        `Downgrading to ${cheapestPlan.name} keeps core functionality with lower seat cost.`,
      ),
      badge: "Team-Size Mismatch",
    };
  }

  if (tool.category === "api" && currentPlan.includedMonthlyUsageUsd && currentSpend < currentPlan.includedMonthlyUsageUsd * 0.6) {
    const cheaperApiPlan = tool.plans
      .filter((plan) => {
        if (plan.monthlyPrice >= currentPlan.monthlyPrice) return false;
        if (teamSize > 3 && isFreePlan(plan.name)) return false;
        return true;
      })
      .sort((a, b) => a.monthlyPrice - b.monthlyPrice)[0];
    if (cheaperApiPlan) {
      const cheaperPlanCost = expectedPlanCost(cheaperApiPlan, teamSize);
      const monthlySavings = conservativeSavings(baseline, cheaperPlanCost);
      if (monthlySavings > 0) {
        return {
          key: `${tool.id}-api-rightsize`,
          toolId: tool.id,
          toolName: tool.name,
          currentPlan: currentPlan.name,
          recommendedPlan: cheaperApiPlan.name,
          currentMonthlySpend: baseline,
          optimizedMonthlySpend: cheaperPlanCost,
          monthlySavings,
          annualSavings: roundMoney(monthlySavings * 12),
          recommendationType: "rightsize",
          category: "API Efficiency",
          confidence: "High confidence",
          reasoning: makeReasoning(
            `Current API spend ($${currentSpend.toFixed(2)}) is materially below ${currentPlan.name} usage envelope.`,
            `Move to ${cheaperApiPlan.name} to match observed demand and reduce fixed API burn.`,
          ),
          badge: "API Right-Sizing",
        };
      }
    }
  }

  if (cheapestPlan.id !== currentPlan.id) {
    const monthlySavings = conservativeSavings(baseline, cheapestPlanCost);
    if (monthlySavings > 0) {
      return {
        key: `${tool.id}-plan`,
        toolId: tool.id,
        toolName: tool.name,
        currentPlan: currentPlan.name,
        recommendedPlan: cheapestPlan.name,
        currentMonthlySpend: baseline,
        optimizedMonthlySpend: cheapestPlanCost,
        monthlySavings,
        annualSavings: roundMoney(monthlySavings * 12),
        recommendationType: "downgrade",
        category: "Plan Optimization",
        confidence: "High confidence",
        reasoning: makeReasoning(
          `${currentPlan.name} is priced above the lowest suitable plan for a ${teamSize}-person team.`,
          `Switching to ${cheapestPlan.name} lowers recurring spend without changing tool vendor.`,
        ),
        badge: "Plan Optimization",
      };
    }
  }

  const alternativeCategory = tool.category === "api" || useCase === "mixed" ? "api" : useCase === "coding" ? "coding" : tool.category;
  const alternative = pricingCatalog
    .filter(
      (candidate) =>
        candidate.id !== tool.id &&
        candidate.category === alternativeCategory &&
        (candidate.bestUseCase === useCase || candidate.bestUseCase === "mixed"),
    )
    .map((candidate) => ({ tool: candidate, plan: pickCheapestSuitablePlan(candidate, teamSize) }))
    .sort((a, b) => expectedPlanCost(a.plan, teamSize) - expectedPlanCost(b.plan, teamSize))[0];

  if (alternative) {
    const alternativeCost = expectedPlanCost(alternative.plan, teamSize);
    const monthlySavings = conservativeSavings(baseline, alternativeCost);
    if (monthlySavings >= 25) {
      return {
        key: `${tool.id}-alternative`,
        toolId: tool.id,
        toolName: tool.name,
        currentPlan: currentPlan.name,
        recommendedPlan: `${alternative.tool.name} ${alternative.plan.name}`,
        currentMonthlySpend: baseline,
        optimizedMonthlySpend: alternativeCost,
        monthlySavings,
        annualSavings: roundMoney(monthlySavings * 12),
        recommendationType: "alternative",
        category: tool.category === "api" ? "API Efficiency" : "Usage Fit",
        confidence: "Moderate confidence",
        reasoning: makeReasoning(
          `${alternative.tool.name} is a lower-cost option for ${useCase} workflows in the same category.`,
          `Migrating from ${tool.name} to ${alternative.tool.name} cuts spend while preserving use-case fit.`,
        ),
        badge: "Lower-Cost Alternative",
      };
    }
  }

  return {
    key: `${tool.id}-optimized`,
    toolId: tool.id,
    toolName: tool.name,
    currentPlan: currentPlan.name,
    recommendedPlan: currentPlan.name,
    currentMonthlySpend: baseline,
    optimizedMonthlySpend: baseline,
    monthlySavings: 0,
    annualSavings: 0,
    recommendationType: "optimized",
    category: "Usage Fit",
    confidence: "High confidence",
    reasoning: "Current plan and spend are already aligned with team size and use pattern.",
    badge: "Already Optimized",
  };
};

const buildConsolidationRecommendations = (
  selections: UserSelection[],
  teamSize: number,
): AuditRecommendation[] => {
  const codingSelections = selections
    .map((selection) => {
      const tool = findTool(selection.toolId);
      if (!tool || tool.category !== "coding") return null;
      const plan = tool.plans.find((candidate) => candidate.id === selection.planId);
      if (!plan) return null;
      const currentMonthlySpend = roundMoney(Math.max(selection.monthlySpend, expectedPlanCost(plan, teamSize)));
      return { selection, tool, plan, currentMonthlySpend };
    })
    .filter(Boolean) as Array<{ selection: UserSelection; tool: Tool; plan: Plan; currentMonthlySpend: number }>;

  if (codingSelections.length < 2) return [];

  const keeper = codingSelections.sort((a, b) => expectedPlanCost(a.plan, teamSize) - expectedPlanCost(b.plan, teamSize))[0];
  return codingSelections
    .filter((item) => item.selection.toolId !== keeper.selection.toolId)
    .map((item) => ({
      key: `${item.selection.toolId}-consolidate`,
      toolId: item.selection.toolId,
      toolName: item.tool.name,
      currentPlan: item.plan.name,
      recommendedPlan: `Consolidate into ${keeper.tool.name} ${keeper.plan.name}`,
      currentMonthlySpend: item.currentMonthlySpend,
      optimizedMonthlySpend: 0,
      monthlySavings: conservativeSavings(item.currentMonthlySpend, 0),
      annualSavings: roundMoney(conservativeSavings(item.currentMonthlySpend, 0) * 12),
      recommendationType: "consolidate" as const,
      category: "Vendor Consolidation" as const,
      confidence: "Moderate confidence" as const,
      reasoning: makeReasoning(
        `Multiple coding copilots are active for the same team, creating overlap.`,
        `Keep ${keeper.tool.name} as primary and remove ${item.tool.name} to eliminate duplicate seat spend.`,
      ),
      badge: "Tool Consolidation",
    }));
};

const stableAuditId = (input: AuditInput): string => {
  const seed = JSON.stringify({
    tools: [...input.tools].sort((a, b) => a.toolId.localeCompare(b.toolId)),
    teamSize: input.teamSize,
    useCase: input.useCase,
  });
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return `audit-${Math.abs(hash)}`;
};

export const runAudit = (input: AuditInput): AuditResult => {
  const hasApiSelection = input.tools.some((selection) => findTool(selection.toolId)?.category === "api");
  const baseRecommendations = input.tools
    .map((selection) => buildToolRecommendation(selection, input.teamSize, input.useCase))
    .filter(Boolean) as AuditRecommendation[];

  const consolidation = buildConsolidationRecommendations(input.tools, input.teamSize);

  const recommendationByKey = new Map<string, AuditRecommendation>();
  for (const recommendation of [...baseRecommendations, ...consolidation]) {
    const existing = recommendationByKey.get(recommendation.toolId);
    if (!existing || recommendation.monthlySavings > existing.monthlySavings) {
      recommendationByKey.set(recommendation.toolId, recommendation);
    }
  }

  const recommendations = [...recommendationByKey.values()].sort((a, b) => {
    if (hasApiSelection) {
      const aApiScore = a.category === "API Efficiency" ? 1 : 0;
      const bApiScore = b.category === "API Efficiency" ? 1 : 0;
      if (aApiScore !== bApiScore) return bApiScore - aApiScore;
    }
    if (input.useCase === "coding") {
      const aCodingScore = findTool(a.toolId)?.category === "coding" ? 1 : 0;
      const bCodingScore = findTool(b.toolId)?.category === "coding" ? 1 : 0;
      if (aCodingScore !== bCodingScore) return bCodingScore - aCodingScore;
    }
    return b.monthlySavings - a.monthlySavings;
  });

  const totalCurrentMonthlySpend = roundMoney(
    input.tools.reduce((sum, selection) => sum + Math.max(0, selection.monthlySpend), 0),
  );
  const totalMonthlySavings = roundMoney(recommendations.reduce((sum, recommendation) => sum + recommendation.monthlySavings, 0));
  const totalOptimizedMonthlySpend = Math.max(0, roundMoney(totalCurrentMonthlySpend - totalMonthlySavings));
  const totalAnnualSavings = roundMoney(totalMonthlySavings * 12);
  const rawSavingsRate = totalCurrentMonthlySpend > 0 ? roundMoney((totalMonthlySavings / totalCurrentMonthlySpend) * 100) : 0;
  const savingsRate = Math.min(rawSavingsRate, 65);

  return {
    id: stableAuditId(input),
    selections: input.tools,
    teamSize: input.teamSize,
    useCase: input.useCase,
    recommendations,
    totalCurrentMonthlySpend,
    totalOptimizedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsRate,
    isOptimized: totalMonthlySavings < 1,
    createdAt: new Date().toISOString(),
  };
};
