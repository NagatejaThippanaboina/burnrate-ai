import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "BURNRATE AI — AI Spend Audit Platform",
  description:
    "Audit AI tool spending, reduce SaaS burn, and discover optimization opportunities across ChatGPT, Claude, Cursor, Copilot, Gemini, and more.",
  openGraph: {
    title: "BURNRATE AI",
    description:
      "Stop leaking budget across AI tools. Audit your burn in minutes.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BURNRATE AI",
    description:
      "Stop leaking budget across AI tools. Audit your burn in minutes.",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.16),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.18),transparent_36%)]" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24">
        <section className="space-y-8 text-center md:text-left">
          <Badge className="bg-violet-500/20 text-violet-100">BURNRATE AI</Badge>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-6xl">
            Stop leaking budget across AI tools. Audit your burn in minutes.
          </h1>
          <p className="max-w-2xl text-zinc-300">
            BURNRATE AI analyzes your current stack, benchmarks plan efficiency, and shows deterministic monthly and
            yearly savings opportunities with explainable recommendations.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="w-full bg-violet-500 text-white hover:bg-violet-400 sm:w-auto">
              <Link href="/audit">Start Free Audit</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-white/20 bg-transparent sm:w-auto">
              <a href="#features">See product highlights</a>
            </Button>
          </div>
        </section>

        <section id="features" className="mt-16 grid gap-4 md:grid-cols-3 scroll-mt-20">
          {["YC founders", "Seed to Series B teams", "AI-first product orgs"].map((item) => (
            <Card key={item} className="border-white/10 bg-zinc-900/40">
              <CardContent className="p-5 text-sm text-zinc-300">{item}</CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            "Multi-vendor AI spend tracking",
            "Deterministic optimization engine",
            "Shareable investor-ready reports",
          ].map((feature) => (
            <Card key={feature} className="border-white/10 bg-zinc-900/40">
              <CardContent className="p-5">
                <p className="font-medium text-white">{feature}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            ["1", "Select tools and plans"],
            ["2", "Enter monthly spend and team profile"],
            ["3", "Get savings map and share link"],
          ].map(([id, text]) => (
            <Card key={id} className="border-white/10 bg-zinc-900/40">
              <CardContent className="p-5">
                <p className="text-sm text-violet-300">Step {id}</p>
                <p className="mt-1 font-medium text-white">{text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-2">
          <Card className="border-emerald-300/20 bg-emerald-900/10">
            <CardContent className="p-5">
              <p className="text-sm text-zinc-300">Savings example A</p>
              <p className="text-3xl font-semibold text-emerald-300">$1,240/month</p>
              <p className="text-xs text-zinc-400">Consolidated coding stack + API tier right-sizing</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-300/20 bg-emerald-900/10">
            <CardContent className="p-5">
              <p className="text-sm text-zinc-300">Savings example B</p>
              <p className="text-3xl font-semibold text-emerald-300">$780/month</p>
              <p className="text-xs text-zinc-400">Plan downgrade without capability loss</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Transparent by design",
              description:
                "Every recommendation is generated from deterministic pricing and optimization rules — no black-box scoring.",
            },
            {
              title: "Instant value, no signup wall",
              description:
                "Teams can complete audits and review savings opportunities before submitting contact details.",
            },
            {
              title: "Built for collaboration",
              description:
                "Every audit generates a shareable report URL for founders, operators, and finance stakeholders.",
            },
            {
              title: "Finance-readable recommendations",
              description:
                "Optimization insights are designed to be understandable by engineering leaders, founders, and finance teams alike.",
            },
            {
              title: "Modern AI vendor coverage",
              description:
                "Benchmark spend across copilots, LLM subscriptions, builder tools, and API infrastructure from leading AI vendors.",
            },
            {
              title: "Designed for operational speed",
              description:
                "Run a complete AI infrastructure audit in minutes with deterministic outputs and actionable optimization guidance.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="h-full border-white/10 bg-zinc-900/40 transition-colors hover:border-white/20 hover:bg-zinc-900/70"
            >
              <CardContent className="flex h-full flex-col gap-2 p-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-sm leading-6 text-zinc-300">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 rounded-2xl border border-violet-300/25 bg-violet-900/15 p-8 text-center">
          <p className="text-zinc-300">  Ready to reduce AI spend without sacrificing productivity?</p>
          <Button asChild className="mt-4 bg-violet-500 text-white hover:bg-violet-400">
            <Link href="/audit">Start Free Audit</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
