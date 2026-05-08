"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AuditResult, LeadCapture } from "@/types/audit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const LEADS_KEY = "burnrate-ai-leads-v1";

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
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [lead, setLead] = useState<LeadCapture>({ email: "", companyName: "", role: "" });
  const [submitted, setSubmitted] = useState(false);

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

  const jumpToContact = () => {
    document.getElementById("share-and-contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitLead = () => {
    if (!lead.email) return;
    const existing = window.localStorage.getItem(LEADS_KEY);
    const leads = existing ? (JSON.parse(existing) as LeadCapture[]) : [];
    leads.push(lead);
    window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    setSubmitted(true);
  };

  return (
    <div className="space-y-8">
      <Card className="border-violet-300/30 bg-gradient-to-br from-zinc-950 via-violet-950/40 to-indigo-950/40 shadow-[0_30px_80px_-45px_rgba(139,92,246,0.9)]">
        <CardHeader>
          <Badge className="w-fit border border-violet-300/30 bg-violet-500/20 text-violet-100">BURNRATE AI Audit Result</Badge>
          <CardTitle className="text-3xl text-white md:text-4xl">
            {result.isOptimized ? "Your stack is already optimized" : "You have measurable savings unlocked"}
          </CardTitle>
          <CardDescription>
            Deterministic analysis from your submitted tool, plan, and spend data.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/10 to-black/20 p-4">
            <p className="text-sm text-zinc-400">Monthly savings</p>
            <p className="text-3xl font-semibold text-emerald-300">
              <SavingsCounter amount={totalSavingsLabel.monthly} />
            </p>
          </div>
          <div className="rounded-xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/10 to-black/20 p-4">
            <p className="text-sm text-zinc-400">Yearly savings</p>
            <p className="text-3xl font-semibold text-emerald-300">
              <SavingsCounter amount={totalSavingsLabel.yearly} />
            </p>
          </div>
          <div className="rounded-xl border border-violet-300/20 bg-gradient-to-br from-violet-500/10 to-black/20 p-4">
            <p className="text-sm text-zinc-400">Savings rate</p>
            <p className="text-3xl font-semibold text-violet-200">{result.savingsRate}%</p>
            <p className="text-xs text-zinc-500">Current: ${result.totalCurrentMonthlySpend.toFixed(2)} / month</p>
          </div>
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
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm text-emerald-100">
              High impact opportunity detected. Talk to Credex and unlock discounted credits.
            </p>
            <div className="flex gap-2">
              <Button asChild className="bg-emerald-500 text-black hover:bg-emerald-400">
                <a href="mailto:hello@credex.ai?subject=BURNRATE%20AI%20Savings%20Discussion">Talk to Credex</a>
              </Button>
              <Button onClick={jumpToContact} variant="outline" className="border-emerald-400/50">
                Book consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {result.recommendations.map((item) => (
          <Card key={item.key} className="border-white/10 bg-gradient-to-b from-zinc-950/80 to-zinc-900/60">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg text-white">{item.toolName}</CardTitle>
                <Badge className="border border-white/20 bg-white/5 text-zinc-200">{item.badge}</Badge>
              </div>
              <CardDescription>
                {item.currentPlan} → {item.recommendedPlan}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-zinc-300">{item.reasoning}</p>
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

      <Card id="share-and-contact" className="border-white/10 bg-zinc-950/65">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-300">Share this report with your team.</p>
            <div className="flex items-center gap-2">
              <Button onClick={copyLink} disabled={isSharing} variant="outline" className="border-white/20">
                {copied ? "Copied" : isSharing ? "Copying..." : "Copy Share Link"}
              </Button>
              <Button asChild variant="outline" className="border-white/20">
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
          <div className="h-px bg-white/10" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-300">Want an operator walkthrough of this report?</p>
            <Button asChild className="bg-violet-500 text-white hover:bg-violet-400">
              <a href="mailto:hello@burnrate.ai?subject=Walkthrough%20my%20BURNRATE%20AI%20audit">Request walkthrough</a>
            </Button>
          </div>
          {submitted ? (
            <p className="text-sm text-emerald-300">Thanks, we will follow up with your full report.</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-3">
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
              <div className="flex gap-2">
                <Input
                  placeholder="Role (optional)"
                  value={lead.role}
                  onChange={(event) => setLead((current) => ({ ...current, role: event.target.value }))}
                />
                <Button onClick={submitLead} disabled={!lead.email}>
                  Get full report via email
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
