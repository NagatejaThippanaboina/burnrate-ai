"use client";

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
  const [lead, setLead] = useState<LeadCapture>({ email: "", companyName: "", role: "" });
  const [submitted, setSubmitted] = useState(false);

  const totalSavingsLabel = useMemo(
    () => ({
      monthly: Math.round(result.totalMonthlySavings),
      yearly: Math.round(result.totalYearlySavings),
    }),
    [result.totalMonthlySavings, result.totalYearlySavings],
  );

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
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
      <Card className="border-violet-400/30 bg-gradient-to-br from-zinc-950 to-violet-950/35">
        <CardHeader>
          <Badge className="w-fit bg-violet-500/20 text-violet-100">BURNRATE AI Audit Result</Badge>
          <CardTitle className="text-3xl text-white md:text-4xl">
            {result.isOptimized ? "Your stack is already optimized" : "You have measurable savings unlocked"}
          </CardTitle>
          <CardDescription>
            Deterministic analysis from your submitted tool, plan, and spend data.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-zinc-400">Monthly savings</p>
            <p className="text-3xl font-semibold text-emerald-300">
              <SavingsCounter amount={totalSavingsLabel.monthly} />
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-zinc-400">Yearly savings</p>
            <p className="text-3xl font-semibold text-emerald-300">
              <SavingsCounter amount={totalSavingsLabel.yearly} />
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-zinc-400">Overspending insight</p>
            <p className="text-3xl font-semibold text-violet-200">{result.overspendPercentage}%</p>
            <p className="text-xs text-zinc-500">You are overspending by {result.overspendPercentage}%</p>
          </div>
        </CardContent>
      </Card>

      {result.totalMonthlySavings > 500 && (
        <Card className="border-emerald-400/40 bg-emerald-900/10">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm text-emerald-100">
              High impact opportunity detected. Talk to Credex and unlock discounted credits.
            </p>
            <div className="flex gap-2">
              <Button className="bg-emerald-500 text-black hover:bg-emerald-400">Talk to Credex</Button>
              <Button variant="outline" className="border-emerald-400/50">
                Book Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {result.recommendations.map((item) => (
          <Card key={item.toolId} className="border-white/10 bg-zinc-950/65">
            <CardHeader>
              <CardTitle className="text-lg text-white">{item.toolName}</CardTitle>
              <CardDescription>
                {item.currentPlan} → {item.recommendedPlan}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-zinc-300">{item.explanation}</p>
              <p className="text-zinc-400">Monthly savings: ${item.monthlySavings.toFixed(2)}</p>
              <p className="text-zinc-400">Yearly savings: ${item.yearlySavings.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-zinc-950/65">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-300">Share this report with your team.</p>
            <Button onClick={copyLink} variant="outline" className="border-white/20">
              {copied ? "Copied" : "Copy Share Link"}
            </Button>
          </div>
          <div className="h-px bg-white/10" />
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
