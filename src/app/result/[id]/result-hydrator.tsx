"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ResultView } from "@/components/results/result-view";
import { AuditResult } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const REPORTS_KEY = "burnrate-ai-reports-v1";
const LAST_REPORT_KEY = "burnrate-ai-last-report-id";

export function ResultHydrator({ id }: { id: string }) {
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [lastReportId, setLastReportId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const raw = window.localStorage.getItem(REPORTS_KEY);
      const reports = raw ? (JSON.parse(raw) as Record<string, AuditResult>) : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(reports ? reports[id] ?? null : null);
    } catch {
      setResult(null);
    }

    try {
      setLastReportId(window.localStorage.getItem(LAST_REPORT_KEY));
    } catch {
      setLastReportId(null);
    }
  }, [id, mounted]);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-zinc-900" />
        <div className="h-56 animate-pulse rounded-2xl border border-white/10 bg-zinc-900" />
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
