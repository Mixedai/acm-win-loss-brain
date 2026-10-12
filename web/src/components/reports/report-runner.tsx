"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { ReportSchema, type Report } from "@/lib/reporting/schema";
import { ReportView } from "@/components/reports/report-view";

export type ReportOption = { id: string; name: string; clientId?: string };

type ReportRunnerProps = {
  clients: ReportOption[];
  competitors: ReportOption[];
  quarters: string[];
};

type RunState =
  | { status: "idle" }
  | { status: "running"; startedAt: number }
  | { status: "done"; report: Report; battlecardId: string | null; seconds: number }
  | { status: "error"; message: string };

function parseResponse(payload: unknown): { report: Report; battlecardId: string | null } {
  if (typeof payload !== "object" || payload === null) throw new Error("Unexpected response from the agent.");
  const record = payload as Record<string, unknown>;
  if (typeof record.error === "string") throw new Error(record.error);
  const report = ReportSchema.parse(record.report);
  const saved = record.saved;
  const battlecardId =
    typeof saved === "object" && saved !== null && typeof (saved as Record<string, unknown>).battlecardId === "string"
      ? ((saved as Record<string, unknown>).battlecardId as string)
      : null;
  return { report, battlecardId };
}

export function ReportRunner({ clients, competitors, quarters }: ReportRunnerProps) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const visibleCompetitors = competitors.filter((c) => c.clientId === clientId);
  const [competitorId, setCompetitorId] = useState(visibleCompetitors[0]?.id ?? "");
  const [quarter, setQuarter] = useState(quarters[0] ?? "");
  const [state, setState] = useState<RunState>({ status: "idle" });

  const effectiveCompetitorId = visibleCompetitors.some((c) => c.id === competitorId)
    ? competitorId
    : (visibleCompetitors[0]?.id ?? "");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const startedAt = Date.now();
    setState({ status: "running", startedAt });
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, competitorId: effectiveCompetitorId, fiscalQuarter: quarter }),
      });
      const payload: unknown = await response.json();
      const { report, battlecardId } = parseResponse(payload);
      setState({ status: "done", report, battlecardId, seconds: Math.round((Date.now() - startedAt) / 1000) });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  const running = state.status === "running";
  const selectClass =
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none";

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Client
          <select className={selectClass} value={clientId} onChange={(e) => setClientId(e.target.value)} disabled={running}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Competitor
          <select
            className={selectClass}
            value={effectiveCompetitorId}
            onChange={(e) => setCompetitorId(e.target.value)}
            disabled={running || visibleCompetitors.length === 0}
          >
            {visibleCompetitors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Quarter
          <select className={selectClass} value={quarter} onChange={(e) => setQuarter(e.target.value)} disabled={running}>
            {quarters.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={running || !clientId || !effectiveCompetitorId || !quarter}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
          {running ? "Analysing…" : "Run analysis"}
        </button>
      </form>

      {state.status === "running" ? (
        <p className="text-sm text-slate-500">
          The agent is reading deals, interviews and claims, then writing the report and a new battlecard version. This usually takes one to three minutes.
        </p>
      ) : null}
      {state.status === "error" ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{state.message}</div>
      ) : null}
      {state.status === "done" ? (
        <>
          <p className="text-xs text-slate-500">Generated in {state.seconds}s and saved as a new battlecard version.</p>
          <ReportView report={state.report} battlecardHref={state.battlecardId ? `/battlecards/${state.battlecardId}` : null} />
        </>
      ) : null}
    </div>
  );
}
