import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

        <section className="mt-16 grid gap-3">
          {[
            "Is this deterministic? Yes, all pricing is hardcoded and rule-based.",
            "Do you gate results? No, value is shown before lead capture.",
            "Can I share my report? Yes, every result has a copyable share URL.",
          ].map((faq) => (
            <Card key={faq} className="border-white/10 bg-zinc-900/40">
              <CardContent className="p-4 text-sm text-zinc-300">{faq}</CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 rounded-2xl border border-violet-300/25 bg-violet-900/15 p-8 text-center">
          <p className="text-zinc-300">Ready to cut AI burnrate with explainable recommendations?</p>
          <Button asChild className="mt-4 bg-violet-500 text-white hover:bg-violet-400">
            <Link href="/audit">Start Free Audit</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
