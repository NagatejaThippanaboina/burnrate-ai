import { NextResponse } from "next/server";

import { FALLBACK_AUDIT_SUMMARY } from "@/lib/audit-summary-fallback";
import { generateDynamicSummary } from "@/lib/generate-summary";
import { getSupabaseServerClient } from "../../../../lib/supabase";

const DEBUG_AI_SUMMARY = process.env.DEBUG_AI_SUMMARY === "1";

type SummaryBody = {
  tools: unknown[];
  monthlySpend: number;
  savings: number;
  recommendations: string[];
  teamSize?: number;
  useCase?: string;
  /** Supabase `audits.id` (UUID) when available so `ai_summary` can be persisted. */
  auditRowId?: string;
};

type SummaryTool = {
  toolId?: string;
  toolName?: string;
  vendor?: string;
  planId?: string;
  planName?: string;
};

const isValidBody = (value: unknown): value is SummaryBody => {
  if (!value || typeof value !== "object") return false;
  const body = value as Record<string, unknown>;
  return (
    Array.isArray(body.tools) &&
    typeof body.monthlySpend === "number" &&
    Number.isFinite(body.monthlySpend) &&
    typeof body.savings === "number" &&
    Number.isFinite(body.savings) &&
    Array.isArray(body.recommendations) &&
    body.recommendations.every((item) => typeof item === "string")
  );
};

const toSummaryTools = (value: unknown[]): SummaryTool[] => {
  const tools: SummaryTool[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const tool = item as Record<string, unknown>;
    tools.push({
      toolId: typeof tool.toolId === "string" ? tool.toolId : undefined,
      toolName: typeof tool.toolName === "string" ? tool.toolName : undefined,
      vendor: typeof tool.vendor === "string" ? tool.vendor : undefined,
      planId: typeof tool.planId === "string" ? tool.planId : undefined,
      planName: typeof tool.planName === "string" ? tool.planName : undefined,
    });
  }
  return tools;
};

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
} as const;

async function persistAiSummary(auditRowId: string, summary: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("audits").update({ ai_summary: summary }).eq("id", auditRowId);
  if (error) {
    console.error("[api/summary] Supabase update failed:", error.message);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ summary: FALLBACK_AUDIT_SUMMARY }, { headers: noStoreHeaders });
  }

  if (!isValidBody(body)) {
    return NextResponse.json({ summary: FALLBACK_AUDIT_SUMMARY }, { headers: noStoreHeaders });
  }

  const auditRowId = typeof body.auditRowId === "string" && body.auditRowId.length > 0 ? body.auditRowId : undefined;
  try {
    const summaryInput = {
      tools: toSummaryTools(body.tools),
      monthlySpend: body.monthlySpend,
      savings: body.savings,
      recommendations: body.recommendations,
      teamSize: typeof body.teamSize === "number" && Number.isFinite(body.teamSize) ? body.teamSize : undefined,
      useCase: typeof body.useCase === "string" && body.useCase.length > 0 ? body.useCase : undefined,
      auditId: auditRowId,
    };

    // Temporary debug logs (required by task)
    console.log("SUMMARY INPUT:", summaryInput);
    if (DEBUG_AI_SUMMARY) {
      console.log("AUDIT ID:", auditRowId ?? "unknown");
    }

    const summary = await generateDynamicSummary(summaryInput);

    // Temporary debug logs (required by task)
    console.log("SUMMARY OUTPUT:", summary);

    if (auditRowId) {
      try {
        await persistAiSummary(auditRowId, summary);
      } catch (error) {
        console.error("[api/summary] Persistence skipped:", error);
      }
    }

    return NextResponse.json({ summary }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("[api/summary] Deterministic summary generation failed:", error);
    const summary = FALLBACK_AUDIT_SUMMARY;
    if (auditRowId) {
      try {
        await persistAiSummary(auditRowId, summary);
      } catch (persistError) {
        console.error("[api/summary] Persistence skipped:", persistError);
      }
    }
    console.log("SUMMARY OUTPUT:", summary);
    return NextResponse.json({ summary }, { headers: noStoreHeaders });
  }
}
