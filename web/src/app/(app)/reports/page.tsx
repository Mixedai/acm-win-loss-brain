import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { ReportRunner, type ReportOption } from "@/components/reports/report-runner";

export const dynamic = "force-dynamic";

const STATUS_TONE = {
  queued: "neutral",
  running: "amber",
  completed: "green",
  failed: "red",
} as const;

export default async function ReportsPage() {
  const db = await createClient();
  const [clientsRes, competitorsRes, quartersRes, runsRes] = await Promise.all([
    db.from("clients").select("id, name").eq("is_active", true).order("name"),
    db.from("competitors").select("id, name, client_id").order("is_primary", { ascending: false }).order("name"),
    db.from("deals").select("fiscal_quarter").eq("outcome", "lost").not("fiscal_quarter", "is", null),
    db
      .from("analysis_runs")
      .select("id, question, fiscal_quarter, status, model_name, completed_at, output_battlecard_id, output_summary, clients(name)")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  if (clientsRes.error) throw new Error(`Failed to load clients: ${clientsRes.error.message}`);
  if (competitorsRes.error) throw new Error(`Failed to load competitors: ${competitorsRes.error.message}`);
  if (quartersRes.error) throw new Error(`Failed to load quarters: ${quartersRes.error.message}`);
  if (runsRes.error) throw new Error(`Failed to load analysis runs: ${runsRes.error.message}`);

  const clients: ReportOption[] = clientsRes.data.map((c) => ({ id: c.id, name: c.name }));
  const competitors: ReportOption[] = competitorsRes.data.map((c) => ({ id: c.id, name: c.name, clientId: c.client_id }));
  const quarters = [...new Set(quartersRes.data.map((d) => d.fiscal_quarter).filter((q): q is string => q !== null))].sort().reverse();

  return (
    <>
      <PageHeader
        title="Reports"
        description="Ask the reporting agent why a client is losing to a competitor. It reconciles seller and customer reasons, ranks root causes and writes a new battlecard version."
      />
      <ReportRunner clients={clients} competitors={competitors} quarters={quarters} />

      <Card className="mt-8">
        <CardHeader title="Recent analysis runs" description="Every run is recorded with its model, status and output battlecard." />
        <CardContent>
          {runsRes.data.length === 0 ? (
            <p className="text-sm text-slate-500">No runs yet. Start one above.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {runsRes.data.map((run) => {
                const headline =
                  typeof run.output_summary === "object" && run.output_summary !== null && "headline" in run.output_summary
                    ? String((run.output_summary as Record<string, unknown>).headline ?? "")
                    : "";
                return (
                  <li key={run.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {run.clients?.name ? `${run.clients.name}: ` : ""}
                        {run.question}
                      </p>
                      <p className="text-xs text-slate-500">
                        {run.fiscal_quarter ?? "—"} · {run.model_name ?? "—"}
                        {run.completed_at ? ` · ${new Date(run.completed_at).toLocaleString("en-US")}` : ""}
                      </p>
                      {headline ? <p className="mt-1 text-sm text-slate-600">{headline}</p> : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone={STATUS_TONE[run.status]}>{run.status}</Badge>
                      {run.output_battlecard_id ? (
                        <Link href={`/battlecards/${run.output_battlecard_id}`} className="text-sm font-medium text-slate-900 underline-offset-2 hover:underline">
                          Battlecard
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
