"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { pricingCatalog } from "@/data/pricing";
import { runAudit } from "@/lib/audit";
import { AuditInput, UseCase, UserSelection } from "@/types/audit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type DraftState = {
  selectedToolIds: string[];
  plans: Record<string, string>;
  spends: Record<string, number>;
  teamSize: number;
  useCase: UseCase;
};

const initialDraft: DraftState = {
  selectedToolIds: [],
  plans: {},
  spends: {},
  teamSize: 5,
  useCase: "coding",
};

const DRAFT_KEY = "burnrate-ai-audit-draft-v1";
const REPORTS_KEY = "burnrate-ai-reports-v1";
const LAST_REPORT_KEY = "burnrate-ai-last-report-id";

const demoScenarios = {
  highSavings: {
    label: "High Savings",
    teamSize: 10,
    useCase: "mixed" as UseCase,
    tools: [
      { toolId: "cursor", planId: "enterprise", monthlySpend: 180 },
      { toolId: "gemini", planId: "pro", monthlySpend: 260 },
    ],
  },
  alreadyOptimized: {
    label: "Already Optimized",
    teamSize: 2,
    useCase: "writing" as UseCase,
    tools: [{ toolId: "chatgpt", planId: "free", monthlySpend: 0 }],
  },
  apiHeavy: {
    label: "API Heavy",
    teamSize: 15,
    useCase: "api" as UseCase,
    tools: [
      { toolId: "openai-api", planId: "growth", monthlySpend: 600 },
      { toolId: "claude", planId: "team", monthlySpend: 240 },
    ],
  },
};

export function AuditWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftState>(() => {
    if (typeof window === "undefined") return initialDraft;
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return initialDraft;
    try {
      return JSON.parse(raw) as DraftState;
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
      return initialDraft;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  const selectedTools = useMemo(
    () => pricingCatalog.filter((tool) => draft.selectedToolIds.includes(tool.id)),
    [draft.selectedToolIds],
  );

  const canContinue = useMemo(() => {
    if (step === 1) return draft.selectedToolIds.length > 0;
    if (step === 2) return selectedTools.every((tool) => Boolean(draft.plans[tool.id]));
    if (step === 3) return selectedTools.every((tool) => (draft.spends[tool.id] ?? 0) >= 0);
    if (step === 4) return draft.teamSize > 0;
    return false;
  }, [draft, selectedTools, step]);

  const toggleTool = (toolId: string) => {
    setDraft((current) => {
      const exists = current.selectedToolIds.includes(toolId);
      const selectedToolIds = exists
        ? current.selectedToolIds.filter((id) => id !== toolId)
        : [...current.selectedToolIds, toolId];
      return { ...current, selectedToolIds };
    });
  };

  const applyDemoScenario = (scenario: (typeof demoScenarios)[keyof typeof demoScenarios]) => {
    const selectedToolIds = scenario.tools.map((item) => item.toolId);
    const plans: Record<string, string> = {};
    const spends: Record<string, number> = {};
    for (const entry of scenario.tools) {
      plans[entry.toolId] = entry.planId;
      spends[entry.toolId] = entry.monthlySpend;
    }

    setDraft({
      selectedToolIds,
      plans,
      spends,
      teamSize: scenario.teamSize,
      useCase: scenario.useCase,
    });
    setStep(1);
    setSubmitError(null);
  };

  const submitAudit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    const tools: UserSelection[] = selectedTools.map((tool) => ({
      toolId: tool.id,
      planId: draft.plans[tool.id],
      monthlySpend: Number(draft.spends[tool.id] ?? 0),
    }));

    const auditInput: AuditInput = {
      tools,
      teamSize: draft.teamSize,
      useCase: draft.useCase,
    };

    try {
      const result = runAudit(auditInput);
      const existingReports = window.localStorage.getItem(REPORTS_KEY);
      const reports = existingReports ? (JSON.parse(existingReports) as Record<string, unknown>) : {};
      reports[result.id] = result;
      window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
      window.localStorage.setItem(LAST_REPORT_KEY, result.id);
      window.localStorage.removeItem(DRAFT_KEY);

      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedTools: draft.selectedToolIds,
          plans: draft.plans,
          monthlySpend: result.totalCurrentMonthlySpend,
          annualSavings: result.totalAnnualSavings,
          recommendations: result.recommendations,
          teamSize: draft.teamSize,
          useCase: draft.useCase,
          createdAt: result.createdAt,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to save audit to database.");
      }

      const auditResponse = (await response.json()) as { id?: string | null };
      const supabaseId = typeof auditResponse.id === "string" && auditResponse.id.length > 0 ? auditResponse.id : null;

      if (supabaseId) {
        // Store this audit under the Supabase row id so share URLs work on cold devices.
        const refreshed = window.localStorage.getItem(REPORTS_KEY);
        const mergedReports = refreshed ? (JSON.parse(refreshed) as Record<string, unknown>) : {};
        const resultForShare = { ...result, id: supabaseId, supabaseAuditId: supabaseId };
        mergedReports[supabaseId] = resultForShare;
        window.localStorage.setItem(REPORTS_KEY, JSON.stringify(mergedReports));
        window.localStorage.setItem(LAST_REPORT_KEY, supabaseId);
        router.push(`/result/${supabaseId}`);
        return;
      }

      // If the server did not return an id, fall back to local-only share.
      router.push(`/result/${result.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save audit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden border-white/10 bg-zinc-950/70">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl text-white">BURNRATE AI Audit</CardTitle>
            <CardDescription>Deterministic spend review in 4 guided steps.</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-violet-500/20 text-violet-200">
            Step {step} / 4
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <p className="text-sm font-medium text-white">Try Demo Scenarios</p>
          <p className="mt-1 text-xs text-zinc-400">Auto-fill realistic reviewer inputs. You can edit everything afterward.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {Object.values(demoScenarios).map((scenario) => (
              <Button
                key={scenario.label}
                variant="outline"
                className="h-auto min-h-10 justify-start border-white/20 bg-zinc-900/60 px-3 py-2 text-left text-zinc-200 hover:bg-zinc-800"
                onClick={() => applyDemoScenario(scenario)}
              >
                {scenario.label}
              </Button>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pricingCatalog.map((tool) => {
              const selected = draft.selectedToolIds.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.id)}
                  className={`min-w-0 rounded-xl border p-3 text-left transition ${
                    selected
                      ? "border-violet-400 bg-violet-500/10 shadow-[0_0_30px_-14px_rgba(139,92,246,0.9)]"
                      : "border-white/10 bg-zinc-900/70 hover:border-white/30"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="break-words text-sm font-medium text-white sm:text-base">{tool.name}</p>
                    <Badge variant="secondary" className="border-white/20 bg-white/5 text-[10px] uppercase tracking-wide text-zinc-300">
                      {tool.category}
                    </Badge>
                  </div>
                  <p className="break-words text-xs text-zinc-400">{tool.vendor}</p>
                  <p className="text-xs text-zinc-500">Best for: {tool.bestUseCase}</p>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {selectedTools.map((tool) => (
              <label key={tool.id} className="block space-y-2">
                <span className="text-sm text-zinc-300">{tool.name}</span>
                <select
                  value={draft.plans[tool.id] ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      plans: { ...current.plans, [tool.id]: event.target.value },
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-white/15 bg-zinc-900 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Select plan</option>
                  {tool.plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.monthlyPrice}
                      {plan.seatBased ? "/seat" : "/month"}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Enter actual monthly spend from invoices. The engine compares this against plan benchmarks.
            </p>
            {selectedTools.map((tool) => (
              <label key={tool.id} className="block space-y-2">
                <span className="text-sm text-zinc-300">{tool.name} monthly spend</span>
                <Input
                  min={0}
                  type="number"
                  value={draft.spends[tool.id] ?? 0}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      spends: { ...current.spends, [tool.id]: Number(event.target.value) },
                    }))
                  }
                  className="h-11 border-white/15 bg-zinc-900 text-white"
                />
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Team size</span>
              <Input
                min={1}
                type="number"
                value={draft.teamSize}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, teamSize: Math.max(1, Number(event.target.value)) }))
                }
                className="h-11 border-white/15 bg-zinc-900 text-white"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Primary use case</span>
              <select
                value={draft.useCase}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    useCase: event.target.value as UseCase,
                  }))
                }
                className="h-11 w-full rounded-lg border border-white/15 bg-zinc-900 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
                <option value="api">API</option>
              </select>
            </label>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" asChild className="w-full border-white/20 bg-transparent text-zinc-200 sm:w-auto">
            <Link href="/">Back to landing</Link>
          </Button>
          {!selectedTools.length && step > 1 && (
            <p className="text-xs text-amber-300">No tools selected. Go back to Step 1 and choose at least one tool.</p>
          )}
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
            {step > 1 && (
              <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setStep((current) => current - 1)}>
                Previous
              </Button>
            )}
            {step < 4 ? (
              <Button
                onClick={() => setStep((current) => current + 1)}
                disabled={!canContinue}
                className="w-full bg-violet-500 text-white hover:bg-violet-400 sm:w-auto"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={submitAudit}
                disabled={!canContinue || isSubmitting}
                className="w-full bg-violet-500 text-white hover:bg-violet-400 sm:w-auto"
              >
                {isSubmitting ? "Calculating..." : "Generate Audit"}
              </Button>
            )}
          </div>
        </div>
        {submitError ? <p className="text-sm text-red-300">{submitError}</p> : null}
      </CardContent>
    </Card>
  );
}
