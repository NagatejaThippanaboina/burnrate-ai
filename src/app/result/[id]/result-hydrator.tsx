"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "../../../../lib/supabase";
import { ResultView } from "@/components/results/result-view";
import { FALLBACK_AUDIT_SUMMARY } from "@/lib/audit-summary-fallback";
import { pricingCatalog } from "@/data/pricing";
import { AuditRecommendation, AuditResult, UserSelection } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Json } from "@/types/supabase";

const REPORTS_KEY = "burnrate-ai-reports-v1";
const LAST_REPORT_KEY = "burnrate-ai-last-report-id";
const DEBUG_FLOW = process.env.NEXT_PUBLIC_DEBUG_FLOW === "1";

type SupabaseAuditRow = {
  id: string;
  selected_tools: Json;
  plans: Json;
  monthly_spend: number;
  annual_savings: number;
  recommendations: Json;
  team_size: number;
  use_case: string;
  created_at: string;
  ai_summary: string | null;
};

const toNumber = (value: unknown): number => (typeof value === "number" && Number.isFinite(value) ? value : 0);

const safeStringArray = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item) => typeof item === "string") : []);

const safeRecordString = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== "object") return {};
  const record = value as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(record)) {
    if (typeof val === "string") out[key] = val;
  }
  return out;
};

const buildSelectionsFromRow = (row: SupabaseAuditRow): UserSelection[] => {
  const selectedTools = safeStringArray(row.selected_tools);
  const plans = safeRecordString(row.plans);
  return selectedTools.map((toolId) => ({ toolId, planId: plans[toolId] ?? "unknown", monthlySpend: 0 }));
};

const buildToolsForSummary = (row: SupabaseAuditRow): Array<{
  toolId: string;
  toolName: string;
  vendor: string;
  planId: string;
  planName: string;
}> => {
  const selectedTools = safeStringArray(row.selected_tools);
  const plans = safeRecordString(row.plans);

  return selectedTools.map((toolId) => {
    const tool = pricingCatalog.find((item) => item.id === toolId);
    const planId = plans[toolId] ?? "unknown";
    const planName = tool?.plans.find((plan) => plan.id === planId)?.name ?? planId;
    return {
      toolId,
      toolName: tool?.name ?? toolId,
      vendor: tool?.vendor ?? "unknown",
      planId,
      planName,
    };
  });
};

const fromSupabaseRow = (row: SupabaseAuditRow): AuditResult => {
  const monthlySpend = toNumber(row.monthly_spend);
  const annualSavings = toNumber(row.annual_savings);
  const monthlySavings = annualSavings > 0 ? annualSavings / 12 : 0;
  const optimizedMonthly = Math.max(0, monthlySpend - monthlySavings);
  const savingsRate = monthlySpend > 0 ? Math.min(65, Math.round((monthlySavings / monthlySpend) * 10000) / 100) : 0;

  const recommendations = Array.isArray(row.recommendations) ? (row.recommendations as unknown as AuditRecommendation[]) : [];

  return {
    id: row.id,
    supabaseAuditId: row.id,
    aiSummary: row.ai_summary ?? undefined,
    selections: buildSelectionsFromRow(row),
    teamSize: toNumber(row.team_size),
    useCase: (row.use_case as AuditResult["useCase"]) ?? "mixed",
    recommendations,
    totalCurrentMonthlySpend: monthlySpend,
    totalOptimizedMonthlySpend: optimizedMonthly,
    totalMonthlySavings: monthlySavings,
    totalAnnualSavings: annualSavings,
    savingsRate,
    isOptimized: monthlySavings < 1,
    createdAt: row.created_at,
  };
};

export function ResultHydrator({ id }: { id: string }) {
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastReportId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(LAST_REPORT_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const load = async () => {
      setIsLoading(true);
      // 1) Prefer Supabase for share links and persistence.
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.from("audits").select("*").eq("id", id).single();
        if (!error && data) {
          const row = data as unknown as SupabaseAuditRow;
          const audit = fromSupabaseRow(row);
          setResult(audit);

          // Mirror to localStorage cache for instant subsequent loads.
          try {
            const raw = window.localStorage.getItem(REPORTS_KEY);
            const reports = raw ? (JSON.parse(raw) as Record<string, AuditResult>) : {};
            reports[id] = audit;
            window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
          } catch {
            /* ignore */
          }

          // If ai_summary is missing, generate it and persist back to Supabase.
          if (!audit.aiSummary?.trim()) {
            try {
              const toolsForSummary = buildToolsForSummary(row);
              const summaryInput = {
                tools: toolsForSummary,
                monthlySpend: audit.totalCurrentMonthlySpend,
                savings: audit.totalMonthlySavings,
                recommendations: audit.recommendations.map(
                  (item) => `${item.toolName}: ${item.currentPlan} → ${item.recommendedPlan}. ${item.reasoning}`,
                ),
                teamSize: audit.teamSize,
                useCase: audit.useCase,
                auditRowId: audit.supabaseAuditId,
              };

              if (DEBUG_FLOW) {
                console.log("AUDIT ID:", audit.supabaseAuditId);
                console.log("SUMMARY INPUT:", summaryInput);
              }

              const response = await fetch("/api/summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(summaryInput),
              });

              const payload = (await response.json()) as { summary?: unknown };
              const summary =
                typeof payload.summary === "string" && payload.summary.trim().length > 0
                  ? payload.summary.trim()
                  : FALLBACK_AUDIT_SUMMARY;

              if (DEBUG_FLOW) {
                console.log("SUMMARY OUTPUT:", summary);
              }

              await supabase.from("audits").update({ ai_summary: summary }).eq("id", id);

              const updated: AuditResult = { ...audit, aiSummary: summary };
              setResult(updated);

              try {
                const raw = window.localStorage.getItem(REPORTS_KEY);
                const reports = raw ? (JSON.parse(raw) as Record<string, AuditResult>) : {};
                reports[id] = updated;
                window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
              } catch {
                /* ignore */
              }
            } catch {
              const updated: AuditResult = { ...audit, aiSummary: FALLBACK_AUDIT_SUMMARY };
              setResult(updated);
            }
          }

          return;
        }
      } catch {
        // ignore and fall back to local storage
      }

      // 2) Fall back to localStorage (legacy).
      try {
        const raw = window.localStorage.getItem(REPORTS_KEY);
        const reports = raw ? (JSON.parse(raw) as Record<string, AuditResult>) : null;
        setResult(reports ? reports[id] ?? null : null);
      } catch {
        setResult(null);
      }

      setIsLoading(false);
    };

    void load().finally(() => {
      setIsLoading(false);
    });

  }, [id, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
          <p className="text-sm font-medium text-zinc-200">Generating your optimization report...</p>
          <p className="mt-1 text-xs text-zinc-400">
            Analyzing tooling spend, vendor overlap, and savings opportunities.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-xl border border-white/10 bg-zinc-900" />
          <div className="h-28 animate-pulse rounded-xl border border-white/10 bg-zinc-900" />
          <div className="h-28 animate-pulse rounded-xl border border-white/10 bg-zinc-900 md:block" />
        </div>
        <div className="h-36 animate-pulse rounded-2xl border border-white/10 bg-zinc-900" />
        <div className="h-52 animate-pulse rounded-2xl border border-white/10 bg-zinc-900" />
      </div>
    );
  }

  if (!result) {
    return (
      <Card className="border-white/10 bg-zinc-950/70">
        <CardHeader>
          <CardTitle className="text-white">Result not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-400">
            This share link has no saved local report yet. Run a fresh BURNRATE AI audit first.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-violet-500 text-white hover:bg-violet-400">
              <Link href="/audit">Start Free Audit</Link>
            </Button>
            {lastReportId ? (
              <Button asChild variant="outline" className="border-white/20">
                <Link href={`/result/${lastReportId}`}>Open Last Saved Result</Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  }

  return <ResultView result={result} />;
}
