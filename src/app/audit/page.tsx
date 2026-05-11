import { AuditWizard } from "@/components/audit/audit-wizard";

export default function AuditPage() {
  return (
    <main className="flex-1 bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl space-y-5">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">Start your BURNRATE AI audit</h1>
        <p className="text-zinc-300">
          Complete this 4-step flow to benchmark tool spend and generate deterministic cost recommendations.
        </p>
        <AuditWizard />
      </div>
    </main>
  );
}
