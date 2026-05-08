"use client";

import Link from "next/link";
import { useMemo } from "react";

import { ResultView } from "@/components/results/result-view";
import { AuditResult } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const REPORTS_KEY = "burnrate-ai-reports-v1";

export function ResultHydrator({ id }: { id: string }) {
  const result = useMemo<AuditResult | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(REPORTS_KEY);
    if (!raw) return null;

    try {
      const reports = JSON.parse(raw) as Record<string, AuditResult>;
      return reports[id] ?? null;
    } catch {
      return null;
    }
  }, [id]);

  if (typeof window === "undefined") {
    return <div className="h-40 animate-pulse rounded-2xl bg-zinc-900" />;
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
          <Button asChild className="bg-violet-500 text-white hover:bg-violet-400">
            <Link href="/audit">Start Free Audit</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <ResultView result={result} />;
}
