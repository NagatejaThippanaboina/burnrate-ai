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

const money = (value: number): string => `$${Math.round(value).toLocaleString()}`;

const toTitle = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const uniqueVendors = (tools: SummaryInputTool[]): string[] => {
  const set = new Set<string>();
  for (const tool of tools) {
    const vendor = (tool.vendor ?? "").trim();
    if (vendor) set.add(vendor);
  }
  return [...set];
};

const hasEnterpriseOverprovision = (tools: SummaryInputTool[], teamSize: number): boolean => {
  if (teamSize >= 10) return false;
  return tools.some((tool) => {
    const plan = `${tool.planName ?? ""} ${tool.planId ?? ""}`.toLowerCase();
    return plan.includes("enterprise") || plan.includes("business") || plan.includes("team");
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

const hasApiStack = (tools: SummaryInputTool[], recommendations: string[]): boolean => {
  if (tools.some((tool) => `${tool.toolName ?? ""} ${tool.planName ?? ""}`.toLowerCase().includes("api"))) return true;
  return recommendations.some((item) => item.toLowerCase().includes("api"));
};

const selectTopRecommendations = (recommendations: string[]): string[] => {
  return recommendations
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
};

const recommendationThemes = (recommendations: string[]) => {
  const joined = recommendations.join(" ").toLowerCase();
  return {
    consolidation: joined.includes("consolidat") || joined.includes("duplicate") || joined.includes("overlap"),
    planRightsize:
      joined.includes("downgrade") || joined.includes("plan optimization") || joined.includes("right-size"),
    apiEfficiency: joined.includes("api") || joined.includes("tier"),
    vendorShift: joined.includes("alternative") || joined.includes("migrat") || joined.includes("vendor"),
    seatControl: joined.includes("seat") || joined.includes("license"),
  };
};

const computeInputSignature = (input: DynamicSummaryInput): number => {
  const seed = JSON.stringify({
    tools: input.tools,
    monthlySpend: input.monthlySpend,
    savings: input.savings,
    recommendations: input.recommendations,
    teamSize: input.teamSize ?? null,
    useCase: input.useCase ?? "mixed",
    auditId: input.auditId ?? "",
  });
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const chooseVariant = <T,>(choices: T[], signature: number): T => choices[signature % choices.length];

const wordCount = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

const normalizeSentence = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

const formatUseCase = (useCase: string): string => {
  if (useCase === "api") return "API-led";
  return `${toTitle(useCase)}-led`;
};

export function generateDynamicSummary(input: DynamicSummaryInput): string {
  const monthlySpend = Math.max(0, input.monthlySpend);
  const monthlySavings = Math.max(0, input.savings);
  const annualSpend = monthlySpend * 12;
  const annualSavings = monthlySavings * 12;
  const savingsRate = monthlySpend > 0 ? (monthlySavings / monthlySpend) * 100 : 0;
  const teamSize = Math.max(1, input.teamSize ?? 1);
  const useCase = input.useCase ?? "mixed";
  const tools = input.tools ?? [];
  const recommendationHighlights = selectTopRecommendations(input.recommendations ?? []);
  const themes = recommendationThemes(recommendationHighlights);
  const vendors = uniqueVendors(tools);
  const overlappingVendors = vendors.length >= 3;
  const codingOverlap = hasCodingOverlap(tools);
  const apiHeavy = hasApiStack(tools, input.recommendations);
  const enterpriseOverprovision = hasEnterpriseOverprovision(tools, teamSize);
  const signature = computeInputSignature(input);

  const introHigh = [
    `Current infrastructure spending patterns indicate avoidable cost drag, with ${money(monthlySpend)} in monthly burn (${money(annualSpend)} annualized) across ${tools.length} tools for ${teamSize} seats.`,
    `AI tooling costs are elevated at ${money(monthlySpend)} per month (${money(annualSpend)} annualized) for ${teamSize} seats, creating clear room for disciplined cost correction.`,
    `The present spend profile sits at ${money(monthlySpend)} monthly (${money(annualSpend)} annualized) across ${tools.length} tools and reflects material overprovisioning risk.`,
  ];
  const introModerate = [
    `AI spend is ${money(monthlySpend)} per month (${money(annualSpend)} annualized) across ${tools.length} tools for ${teamSize} seats, with moderate headroom for improvement.`,
    `Current AI costs total ${money(monthlySpend)} monthly (${money(annualSpend)} annualized), and the portfolio appears stable but still improvable.`,
    `The current tooling footprint runs at ${money(monthlySpend)} per month (${money(annualSpend)} annualized) and shows measured opportunities for tighter spend control.`,
  ];
  const introLean = [
    `The AI stack is running at ${money(monthlySpend)} per month (${money(annualSpend)} annualized) for ${teamSize} seats and appears comparatively lean.`,
    `Current AI spend of ${money(monthlySpend)} monthly (${money(annualSpend)} annualized) suggests a generally well-governed tooling baseline.`,
    `At ${money(monthlySpend)} per month (${money(annualSpend)} annualized), the present AI footprint is relatively disciplined for ${teamSize} seats.`,
  ];

  const intro = normalizeSentence(
    chooseVariant(
      monthlySavings <= 0 ? introLean : savingsRate >= 25 ? introHigh : introModerate,
      signature + 3,
    ),
  );

  const transition = normalizeSentence(
    chooseVariant(
      [
        "From a finance-and-operations perspective, the next gains come from tighter procurement discipline without disrupting delivery.",
        "In practical terms, the strongest savings quality comes from matching contracts to observed usage instead of broad reductions.",
        "Given the team’s workflow mix, the clearest path is to simplify commitments while preserving output reliability.",
      ],
      signature + 5,
    ),
  );

  const savingsNarrative = normalizeSentence(
    chooseVariant(
      monthlySavings <= 0
        ? [
            "Immediate savings headroom is limited, so the right strategy is governance cadence and periodic plan calibration.",
            "Near-term savings are modest, indicating that the stack is close to an efficient baseline today.",
          ]
        : savingsRate >= 25
          ? [
              `Executing the identified actions can recover roughly ${money(monthlySavings)} monthly (${money(annualSavings)} annually), representing a high-impact margin opportunity.`,
              `The savings opportunity is substantial at about ${money(monthlySavings)} per month and ${money(annualSavings)} per year, primarily through contract and stack restructuring.`,
            ]
          : [
              `Savings potential is moderate at approximately ${money(monthlySavings)} monthly (${money(annualSavings)} annually), with gains concentrated in targeted plan corrections.`,
              `The projected upside is meaningful but measured at around ${money(monthlySavings)} per month (${money(annualSavings)} per year) through selective contract adjustments.`,
            ],
      signature + 11,
    ),
  );

  const signalStatements: string[] = [];

  if (codingOverlap) {
    signalStatements.push(
      normalizeSentence(
        chooseVariant(
        [
          "Multiple coding copilots are running in parallel, indicating duplicate spend that can be consolidated without reducing engineering throughput",
          "Parallel investment in overlapping coding assistants suggests unnecessary tool redundancy and a strong case for consolidation",
        ],
        signature + 17,
      ),
      ),
    );
  }

  if (apiHeavy) {
    signalStatements.push(
      normalizeSentence(
        chooseVariant(
        [
          "API-heavy usage patterns indicate infrastructure savings from tighter tier governance, workload routing, and consumption controls",
          "The current API footprint is large enough that rightsizing tiers and enforcing usage guardrails should be treated as first-order levers",
        ],
        signature + 19,
      ),
      ),
    );
  }

  if (enterpriseOverprovision) {
    signalStatements.push(
      normalizeSentence(
        chooseVariant(
        [
          "Enterprise-oriented plans appear oversized for the current seat count, a classic indicator of licensing overprovisioning",
          "Current team scale does not fully justify enterprise-level allocations, which points to avoidable licensing drag",
        ],
        signature + 23,
      ),
      ),
    );
  }

  if (overlappingVendors) {
    signalStatements.push(
      normalizeSentence(
        chooseVariant(
        [
          "Vendor overlap is increasing operational redundancy across core workflows, and can be reduced through tighter platform standards",
          "The portfolio spans multiple vendors, which increases coordination overhead and creates room for a simpler architecture",
        ],
        signature + 29,
      ),
      ),
    );
  }

  if (signalStatements.length === 0) {
    signalStatements.push(
      normalizeSentence(
        chooseVariant(
        [
          "Tooling concentration is relatively coherent, so the next step is tighter seat discipline and a consistent plan governance cadence",
          "Since overlap remains contained, incremental gains should come from periodic plan and usage calibration",
        ],
        signature + 31,
      ),
      ),
    );
  }

  const recommendationSummaryOptions: string[] = [];
  if (themes.consolidation) {
    recommendationSummaryOptions.push("consolidating overlapping copilots and redundant vendor contracts");
  }
  if (themes.planRightsize) {
    recommendationSummaryOptions.push("right-sizing plan tiers to observed utilization");
  }
  if (themes.apiEfficiency) {
    recommendationSummaryOptions.push("tightening API tier governance and usage controls");
  }
  if (themes.seatControl) {
    recommendationSummaryOptions.push("enforcing seat hygiene and inactive-license cleanup");
  }
  if (themes.vendorShift) {
    recommendationSummaryOptions.push("sequencing selective vendor migrations where ROI is clear");
  }

  const recommendationSentence = normalizeSentence(
    chooseVariant(
      recommendationSummaryOptions.length > 0
        ? [
            `The largest savings opportunities come from ${recommendationSummaryOptions.slice(0, 2).join(" and ")}.`,
            `Execution should prioritize ${recommendationSummaryOptions.slice(0, 2).join(" and ")}.`,
            `Near-term value is most likely to come from ${recommendationSummaryOptions.slice(0, 2).join(" and ")}.`,
          ]
        : [
            "The largest savings opportunities come from disciplined contract governance, seat control, and recurring usage calibration.",
            "Priority actions should focus on contract governance, seat discipline, and recurring usage calibration.",
          ],
      signature + 33,
    ),
  );

  const useCaseSentence = normalizeSentence(
    chooseVariant(
      [
        `For ${formatUseCase(useCase)} workflows, spend controls should stay aligned with delivery reliability and team adoption`,
        `Given the team’s ${toTitle(useCase)} focus, cost controls should be phased to protect throughput and output quality`,
        `Because ${toTitle(useCase)} is the primary workflow anchor, changes should preserve execution stability while lowering recurring spend`,
      ],
      signature + 37,
    ),
  );

  const sentenceOrder = chooseVariant(
    [
      [intro, transition, savingsNarrative, ...signalStatements.slice(0, 1), recommendationSentence, useCaseSentence],
      [intro, savingsNarrative, transition, ...signalStatements.slice(0, 2), recommendationSentence, useCaseSentence],
      [intro, transition, ...signalStatements.slice(0, 2), savingsNarrative, recommendationSentence, useCaseSentence],
    ],
    signature + 41,
  );

  const optionalCloser = normalizeSentence(
    chooseVariant(
      [
        "Overall, this profile supports disciplined cost control without creating delivery risk.",
        "Taken together, the profile supports cost reduction while preserving operating continuity.",
        "Net result: measurable savings can be captured with controlled execution and minimal disruption.",
      ],
      signature + 43,
    ),
  );

  let summary = sentenceOrder.join(" ");
  if (wordCount(summary) < 95) {
    summary = `${summary} ${optionalCloser}`;
  }
  if (wordCount(summary) > 105) {
    // Deterministically trim non-essential full sentences only.
    summary = summary.replace(` ${transition}`, "");
    if (wordCount(summary) > 105) {
      summary = summary.replace(` ${optionalCloser}`, "");
    }
  }

  return summary;
}

