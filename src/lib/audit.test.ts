import { describe, expect, it } from "vitest";

import { runAudit } from "@/lib/audit";
import type { AuditInput } from "@/types/audit";

describe("runAudit — deterministic audit engine", () => {
  it("assigns the same audit id given the same canonical input", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", planId: "pro", monthlySpend: 100 },
        { toolId: "chatgpt", planId: "plus", monthlySpend: 20 },
      ],
      teamSize: 10,
      useCase: "coding",
    };

    expect(runAudit(input).id).toBe(runAudit(input).id);
  });

  it("caps aggregated savingsRate at 65%", () => {
    const inputs: AuditInput[] = [
      {
        tools: [{ toolId: "openai-api", planId: "scale", monthlySpend: 5000 }],
        teamSize: 5,
        useCase: "mixed",
      },
      {
        tools: [
          { toolId: "github-copilot", planId: "enterprise", monthlySpend: 2000 },
          { toolId: "cursor", planId: "business", monthlySpend: 200 },
        ],
        teamSize: 20,
        useCase: "coding",
      },
    ];

    for (const input of inputs) {
      const result = runAudit(input);
      expect(result.savingsRate).toBeLessThanOrEqual(65);
    }
  });

  it("sums totalCurrentMonthlySpend from submitted monthlySpend values", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "gemini", planId: "pro", monthlySpend: 100 },
        { toolId: "claude", planId: "pro", monthlySpend: 40.505 },
      ],
      teamSize: 8,
      useCase: "research",
    };

    const result = runAudit(input);
    expect(result.totalCurrentMonthlySpend).toBeCloseTo(140.51, 2);
  });

  it("recommends downgrade when team is below seat minimum on a plan", () => {
    const input: AuditInput = {
      tools: [{ toolId: "cursor", planId: "business", monthlySpend: 500 }],
      teamSize: 2,
      useCase: "coding",
    };

    const result = runAudit(input);
    const cursorRec = result.recommendations.find((r) => r.toolId === "cursor");

    expect(cursorRec).toBeDefined();
    expect(cursorRec!.badge).toBe("Team-Size Mismatch");
    expect(cursorRec!.recommendationType).toBe("downgrade");
  });

  it("suggests API plan right-sizing when measured spend sits below usage envelope threshold", () => {
    const input: AuditInput = {
      tools: [{ toolId: "openai-api", planId: "growth", monthlySpend: 80 }],
      teamSize: 5,
      useCase: "mixed",
    };

    const result = runAudit(input);
    const apiRec = result.recommendations.find((r) => r.toolId === "openai-api");

    expect(apiRec).toBeDefined();
    expect(apiRec!.badge).toBe("API Right-Sizing");
    expect(apiRec!.recommendationType).toBe("rightsize");
    expect(apiRec!.category).toBe("API Efficiency");
  });

  it("prioritizes API efficiency recommendations in the sort order when an API tool is in the stack", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "openai-api", planId: "growth", monthlySpend: 80 },
        { toolId: "chatgpt", planId: "plus", monthlySpend: 500 },
      ],
      teamSize: 5,
      useCase: "mixed",
    };

    const result = runAudit(input);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].category).toBe("API Efficiency");
    expect(result.recommendations[0].toolId).toBe("openai-api");
  });
});
