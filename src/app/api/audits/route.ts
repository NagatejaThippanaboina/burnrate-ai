import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../../lib/supabase";
import { AuditRecommendation, UseCase } from "@/types/audit";
import { Json } from "@/types/supabase";

type AuditPayload = {
  selectedTools: string[];
  plans: Record<string, string>;
  monthlySpend: number;
  annualSavings: number;
  recommendations: AuditRecommendation[];
  teamSize: number;
  useCase: UseCase;
  createdAt: string;
};

const isUseCase = (value: unknown): value is UseCase =>
  value === "coding" || value === "writing" || value === "research" || value === "mixed" || value === "api";

const isValidAuditPayload = (payload: unknown): payload is AuditPayload => {
  if (!payload || typeof payload !== "object") return false;
  const body = payload as Partial<AuditPayload>;
  return (
    Array.isArray(body.selectedTools) &&
    typeof body.plans === "object" &&
    body.plans !== null &&
    typeof body.monthlySpend === "number" &&
    typeof body.annualSavings === "number" &&
    Array.isArray(body.recommendations) &&
    typeof body.teamSize === "number" &&
    isUseCase(body.useCase) &&
    typeof body.createdAt === "string"
  );
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;
    if (!isValidAuditPayload(payload)) {
      return NextResponse.json({ error: "Invalid audit payload." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("audits")
      .insert([
        {
          selected_tools: payload.selectedTools,
          plans: payload.plans,
          monthly_spend: payload.monthlySpend,
          annual_savings: payload.annualSavings,
          recommendations: payload.recommendations as unknown as Json,
          team_size: payload.teamSize,
          use_case: payload.useCase,
          created_at: payload.createdAt,
        },
      ])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch {
    return NextResponse.json({ error: "Failed to save audit." }, { status: 500 });
  }
}
