import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { ReportContext } from "@/lib/reporting/context";
import type { ReportRun } from "@/lib/reporting/agent";

type Db = SupabaseClient<Database>;

export type PersistedReport = { runId: string; battlecardId: string; version: number };

function fail(step: string, message: string): never {
  throw new Error(`Saving the report failed (${step}): ${message}`);
}

// Records the analysis run and writes the battlecard as a new version with
// sections, provenance-labelled statements and deal evidence links.
export async function persistReport(
  db: Db,
  context: ReportContext,
  run: ReportRun,
  startedAt: string,
): Promise<PersistedReport> {
  const clientId = context.client.id;
  const runRes = await db
    .from("analysis_runs")
    .insert({
      client_id: clientId,
      competitor_id: context.competitor.id,
      question: `Why are we losing to ${context.competitor.name} in ${context.fiscal_quarter}?`,
      fiscal_quarter: context.fiscal_quarter,
      status: "completed",
      model_name: run.model,
      input_summary: {
        lost_deals_in_quarter: context.totals.lost_deals,
        lost_deals_all_quarters: context.totals.lost_deals_all_quarters,
        root_causes: context.root_causes.length,
        competitor_claims: context.competitor_claims.length,
      },
      output_summary: {
        headline: run.report.headline,
        usage: run.usage,
      },
      started_at: startedAt,
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (runRes.error) fail("analysis run", runRes.error.message);

  const version = (context.previous_battlecard?.version ?? 0) + 1;
  const bcRes = await db
    .from("battlecards")
    .insert({
      client_id: clientId,
      competitor_id: context.competitor.id,
      analysis_run_id: runRes.data.id,
      version,
      title: run.report.battlecard.title,
      summary: run.report.battlecard.summary,
      status: "in_review",
      author_type: "agent",
    })
    .select("id")
    .single();
  if (bcRes.error) fail("battlecard", bcRes.error.message);

  const linkRes = await db
    .from("analysis_runs")
    .update({ output_battlecard_id: bcRes.data.id })
    .eq("id", runRes.data.id);
  if (linkRes.error) fail("linking run to battlecard", linkRes.error.message);

  const knownDealIds = new Set(context.lost_deals.map((d) => d.id));

  for (const [sectionIndex, section] of run.report.battlecard.sections.entries()) {
    const secRes = await db
      .from("battlecard_sections")
      .insert({
        client_id: clientId,
        battlecard_id: bcRes.data.id,
        section_type: section.section_type,
        heading: section.heading,
        body: section.body,
        sort_order: sectionIndex,
      })
      .select("id")
      .single();
    if (secRes.error) fail(`section ${section.section_type}`, secRes.error.message);

    if (section.statements.length === 0) continue;
    const stRes = await db
      .from("battlecard_statements")
      .insert(
        section.statements.map((s, i) => {
          const dealIds = s.evidence_deal_ids.filter((id) => knownDealIds.has(id));
          const acv = context.lost_deals
            .filter((d) => dealIds.includes(d.id))
            .reduce((sum, d) => sum + Number(d.acv ?? 0), 0);
          return {
            client_id: clientId,
            section_id: secRes.data.id,
            statement: s.statement,
            provenance: s.provenance,
            confidence: s.confidence,
            deal_count: dealIds.length > 0 ? dealIds.length : null,
            acv_total: dealIds.length > 0 ? acv : null,
            sort_order: i,
          };
        }),
      )
      .select("id");
    if (stRes.error) fail(`statements of ${section.section_type}`, stRes.error.message);

    const evidence = section.statements.flatMap((s, i) =>
      s.evidence_deal_ids
        .filter((id) => knownDealIds.has(id))
        .map((dealId) => ({
          client_id: clientId,
          statement_id: stRes.data[i].id,
          deal_id: dealId,
          note: "Linked by the reporting agent.",
        })),
    );
    if (evidence.length > 0) {
      const evRes = await db.from("battlecard_statement_evidence").insert(evidence);
      if (evRes.error) fail(`evidence of ${section.section_type}`, evRes.error.message);
    }
  }

  return { runId: runRes.data.id, battlecardId: bcRes.data.id, version };
}
