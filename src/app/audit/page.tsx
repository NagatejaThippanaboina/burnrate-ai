import { AuditWizard } from "@/components/audit/audit-wizard";

export default function AuditPage() {
  return (
    <main className="flex-1 bg-zinc-950 px-6 py-14 text-zinc-100">
      <div className="mx-auto max-w-4xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Start your BURNRATE AI audit</h1>
        <p className="text-zinc-300">
          Complete this 4-step flow to benchmark tool spend and generate deterministic cost recommendations.
        </p>
        <AuditWizard />
      </div>
    </main>
  );
}
