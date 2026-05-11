"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AuditResult, LeadCapture } from "@/types/audit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LeadState = {
  isLoading: boolean;
  success: string | null;
  error: string | null;
};

const recommendationHeadline = (item: AuditResult["recommendations"][number]): string => {
  if (item.currentPlan !== item.recommendedPlan) {
    return `${item.currentPlan} → ${item.recommendedPlan}`;
  }

  if (item.recommendationType === "rightsize") {
    const reasoning = item.reasoning.toLowerCase();
    if (reasoning.includes("seat") || reasoning.includes("license")) return "Seat Optimization";
    if (reasoning.includes("usage") || reasoning.includes("api")) return "Usage Right-Sizing";
    return "License Cleanup";
  }

  if (item.recommendationType === "consolidate") return "License Cleanup";
  if (item.recommendationType === "optimized") return "Current Plan Well Aligned";
  return "Cost Alignment Action";
};

const recommendationSubcopy = (item: AuditResult["recommendations"][number]): string | null => {
  if (item.currentPlan !== item.recommendedPlan) return null;
  return `Current plan: ${item.currentPlan}`;
};

function SavingsCounter({ amount }: { amount: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const end = Math.floor(amount);
    const durationMs = 700;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      setDisplay(Math.floor(end * progress));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [amount]);

  return <span>${display.toLocaleString()}</span>;
}

export function ResultView({ result }: { result: AuditResult }) {
  const summaryLoading = !result.aiSummary?.trim();
  const summary = result.aiSummary?.trim() || "";
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [lead, setLead] = useState<LeadCapture>({ email: "", companyName: "", role: "" });
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false);
  const [talkLead, setTalkLead] = useState<LeadCapture>({ email: "", companyName: "", role: "" });
  const [notifyLeadState, setNotifyLeadState] = useState<LeadState>({ isLoading: false, success: null, error: null });
  const [talkLeadState, setTalkLeadState] = useState<LeadState>({ isLoading: false, success: null, error: null });
  const [walkthroughLeadState, setWalkthroughLeadState] = useState<LeadState>({
    isLoading: false,
    success: null,
    error: null,
  });

  const totalSavingsLabel = useMemo(
    () => ({
      monthly: Math.round(result.totalMonthlySavings),
      yearly: Math.round(result.totalAnnualSavings),
    }),
    [result.totalMonthlySavings, result.totalAnnualSavings],
  );

  const copyLink = async () => {
    setIsSharing(true);
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setIsSharing(false);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const submitLead = async (
    payload: LeadCapture,
    source: "talk_to_credex" | "notify_future_optimizations" | "walkthrough_request",
  ) => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        companyName: payload.companyName,
        role: payload.role,
        source,
      }),
    });

    if (!response.ok) {
      const errorResponse = (await response.json()) as { error?: string };
      throw new Error(errorResponse.error ?? "Failed to submit lead.");
    }
  };

  const submitNotifyLead = async () => {
    if (!isValidEmail(lead.email)) {
      setNotifyLeadState({ isLoading: false, success: null, error: "Please enter a valid email address." });
      return;
    }

    setNotifyLeadState({ isLoading: true, success: null, error: null });
    try {
      await submitLead(lead, "notify_future_optimizations");
      setNotifyLeadState({
        isLoading: false,
        success: "You are on the list. We will email future optimization ideas.",
        error: null,
      });
      setLead({ email: "", companyName: "", role: "" });
    } catch (error) {
      setNotifyLeadState({
        isLoading: false,
        success: null,
        error: error instanceof Error ? error.message : "Unable to submit right now.",
      });
    }
  };

  const submitWalkthroughLead = async () => {
    if (!isValidEmail(lead.email)) {
      setWalkthroughLeadState({
        isLoading: false,
        success: null,
        error: "Please enter a valid email in the fields below.",
      });
      return;
    }

    setWalkthroughLeadState({ isLoading: true, success: null, error: null });
    try {
      await submitLead(lead, "walkthrough_request");
      setWalkthroughLeadState({
        isLoading: false,
        success: "Thanks! Our team will reach out shortly.",
        error: null,
      });
    } catch (error) {
      setWalkthroughLeadState({
        isLoading: false,
        success: null,
        error: error instanceof Error ? error.message : "Unable to submit right now.",
      });
    }
  };

  const submitTalkLead = async () => {
    if (!isValidEmail(talkLead.email)) {
      setTalkLeadState({ isLoading: false, success: null, error: "Please enter a valid email address." });
      return;
    }

    setTalkLeadState({ isLoading: true, success: null, error: null });
    try {
      await submitLead(talkLead, "talk_to_credex");
      setTalkLeadState({
        isLoading: false,
        success: "Thanks. The Credex team will reach out shortly.",
        error: null,
      });
      setTalkLead({ email: "", companyName: "", role: "" });
    } catch (error) {
      setTalkLeadState({
        isLoading: false,
        success: null,
        error: error instanceof Error ? error.message : "Unable to submit right now.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-violet-300/30 bg-gradient-to-br from-zinc-950 via-violet-950/40 to-indigo-950/40 shadow-[0_30px_80px_-45px_rgba(139,92,246,0.9)]">
        <CardHeader>
          <Badge className="w-fit border border-violet-300/30 bg-violet-500/20 text-violet-100">BURNRATE AI Audit Result</Badge>
          <CardTitle className="text-2xl text-white sm:text-3xl md:text-4xl">
            {result.isOptimized ? "Your stack is already optimized" : "You have measurable savings unlocked"}
          </CardTitle>
          <CardDescription>
            Deterministic analysis from your submitted tool, plan, and spend data.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/10 to-black/20 p-4">
            <p className="text-sm text-zinc-400">Monthly savings</p>
            <p className="text-2xl font-semibold text-emerald-300 sm:text-3xl">
              <SavingsCounter amount={totalSavingsLabel.monthly} />
            </p>
          </div>
          <div className="rounded-xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/10 to-black/20 p-4">
            <p className="text-sm text-zinc-400">Yearly savings</p>
            <p className="text-2xl font-semibold text-emerald-300 sm:text-3xl">
              <SavingsCounter amount={totalSavingsLabel.yearly} />
            </p>
          </div>
          <div className="rounded-xl border border-violet-300/20 bg-gradient-to-br from-violet-500/10 to-black/20 p-4">
            <p className="text-sm text-zinc-400">Savings rate</p>
            <p className="text-2xl font-semibold text-violet-200 sm:text-3xl">{result.savingsRate}%</p>
            <p className="text-xs text-zinc-500">Current: ${result.totalCurrentMonthlySpend.toFixed(2)} / month</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-zinc-950/80">
        <CardHeader>
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">AI SUMMARY</CardTitle>
          <CardDescription>Generated by AI analysis engine</CardDescription>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <p className="text-sm text-zinc-400">Generating AI summary...</p>
          ) : (
            <p className="text-sm leading-7 text-zinc-200 sm:text-[15px]">{summary}</p>
          )}
        </CardContent>
      </Card>

      {result.totalMonthlySavings < 50 ? (
        <Card className="border-white/10 bg-zinc-950/65">
          <CardContent className="p-5">
            <p className="text-sm text-zinc-200">Your current stack is already highly efficient.</p>
            <p className="mt-1 text-sm text-zinc-400">
              We found limited immediate savings. Keep this report as a benchmark and rerun after headcount or API volume changes.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {result.totalMonthlySavings > 500 && (
        <Card className="border-emerald-400/40 bg-gradient-to-r from-emerald-900/20 to-emerald-600/5">
          <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-sm text-emerald-100">
              High impact opportunity detected. Talk to Credex and unlock discounted credits.
            </p>
            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
              <Button onClick={() => setIsTalkModalOpen(true)} className="w-full bg-emerald-500 text-black hover:bg-emerald-400 sm:w-auto">
                Talk to Credex
              </Button>
              <Button
                onClick={() => document.getElementById("lead-capture")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                variant="outline"
                className="w-full border-emerald-400/50 sm:w-auto"
              >
                Notify me about future optimizations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {result.recommendations.map((item) => (
          <Card key={item.key} className="border-white/10 bg-gradient-to-b from-zinc-950/80 to-zinc-900/60">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="break-words text-base text-white sm:text-lg">{item.toolName}</CardTitle>
                <Badge className="border border-white/20 bg-white/5 text-zinc-200">{item.badge}</Badge>
              </div>
              <CardDescription>
                <span className="break-words">{recommendationHeadline(item)}</span>
                {recommendationSubcopy(item) ? <span className="mt-1 block text-xs">{recommendationSubcopy(item)}</span> : null}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="break-words text-zinc-300">{item.reasoning}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="border border-blue-300/30 bg-blue-500/10 text-blue-200">{item.category}</Badge>
                <Badge className="border border-emerald-300/30 bg-emerald-500/10 text-emerald-200">{item.confidence}</Badge>
              </div>
              <p className="text-zinc-400">Monthly savings: ${item.monthlySavings.toFixed(2)}</p>
              <p className="text-zinc-400">Yearly savings: ${item.annualSavings.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card id="lead-capture" className="border-white/10 bg-zinc-950/65">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-300">Want an operator walkthrough of this report?</p>
            <Button
              type="button"
              className="w-full bg-violet-500 text-white hover:bg-violet-400 sm:w-auto"
              disabled={walkthroughLeadState.isLoading || Boolean(walkthroughLeadState.success)}
              onClick={submitWalkthroughLead}
            >
              {walkthroughLeadState.isLoading ? "Submitting..." : "Request walkthrough"}
            </Button>
          </div>
          {walkthroughLeadState.success ? <p className="text-sm text-emerald-300">{walkthroughLeadState.success}</p> : null}
          {walkthroughLeadState.error ? <p className="text-sm text-red-300">{walkthroughLeadState.error}</p> : null}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Input
              placeholder="Email"
              value={lead.email}
              onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))}
            />
            <Input
              placeholder="Company (optional)"
              value={lead.companyName}
              onChange={(event) => setLead((current) => ({ ...current, companyName: event.target.value }))}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Role (optional)"
                value={lead.role}
                onChange={(event) => setLead((current) => ({ ...current, role: event.target.value }))}
              />
              <Button className="w-full sm:w-auto" onClick={submitNotifyLead} disabled={notifyLeadState.isLoading || !lead.email}>
                {notifyLeadState.isLoading ? "Submitting..." : "Notify me about future optimizations"}
              </Button>
            </div>
          </div>
          {notifyLeadState.success ? <p className="text-sm text-emerald-300">{notifyLeadState.success}</p> : null}
          {notifyLeadState.error ? <p className="text-sm text-red-300">{notifyLeadState.error}</p> : null}
        </CardContent>
      </Card>

      <Card id="share-and-contact" className="border-white/10 bg-zinc-950/65">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-300">Share this report with your team.</p>
            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:items-center">
              <Button onClick={copyLink} disabled={isSharing} variant="outline" className="w-full border-white/20 sm:w-auto">
                {copied ? "Copied" : isSharing ? "Copying..." : "Copy Share Link"}
              </Button>
              <Button asChild variant="outline" className="w-full border-white/20 sm:w-auto">
                <Link href="/audit">Run new audit</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
            Screenshot-ready stat: ${result.totalMonthlySavings.toFixed(0)}/month and ${result.totalAnnualSavings.toFixed(0)}/year savings potential.
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
            <span>Generated {new Date(result.createdAt).toLocaleString()}</span>
            <span>Optimized run-rate: ${result.totalOptimizedMonthlySpend.toFixed(2)}/month</span>
          </div>
        </CardContent>
      </Card>
      {isTalkModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <Card className="w-full max-w-xl border-white/15 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-white">Talk to Credex</CardTitle>
              <CardDescription>Share your details and the team will reach out for a savings walkthrough.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Email"
                value={talkLead.email}
                onChange={(event) => setTalkLead((current) => ({ ...current, email: event.target.value }))}
              />
              <Input
                placeholder="Company name (optional)"
                value={talkLead.companyName}
                onChange={(event) => setTalkLead((current) => ({ ...current, companyName: event.target.value }))}
              />
              <Input
                placeholder="Role (optional)"
                value={talkLead.role}
                onChange={(event) => setTalkLead((current) => ({ ...current, role: event.target.value }))}
              />
              {talkLeadState.success ? <p className="text-sm text-emerald-300">{talkLeadState.success}</p> : null}
              {talkLeadState.error ? <p className="text-sm text-red-300">{talkLeadState.error}</p> : null}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="border-white/20"
                  onClick={() => {
                    setIsTalkModalOpen(false);
                    setTalkLeadState({ isLoading: false, success: null, error: null });
                  }}
                >
                  Close
                </Button>
                <Button onClick={submitTalkLead} disabled={talkLeadState.isLoading || !talkLead.email}>
                  {talkLeadState.isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
