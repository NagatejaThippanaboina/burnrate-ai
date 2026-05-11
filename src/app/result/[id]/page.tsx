import { Suspense } from "react";

import { ResultHydrator } from "./result-hydrator";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="flex-1 bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-zinc-900" />
              <div className="h-56 animate-pulse rounded-2xl border border-white/10 bg-zinc-900" />
            </div>
          }
        >
          <ResultHydrator id={id} />
        </Suspense>
      </div>
    </main>
  );
}
