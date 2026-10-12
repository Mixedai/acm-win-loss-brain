import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { RootCausesTable, type RootCauseRow } from "@/components/root-causes/root-causes-table";

export const dynamic = "force-dynamic";

export default async function RootCausesPage() {
  const supabase = await createClient();

  const [priorityResult, addressabilityResult, gapClosureResult] = await Promise.all([
    supabase
      .from("v_root_cause_priority")
      .select("root_cause_id, root_cause_name, deal_count, lost_acv, weighted_lost_acv"),
    supabase
      .from("v_root_cause_addressability")
      .select(
        "root_cause_id, root_cause_name, best_coverage, on_roadmap, earliest_target_quarter, recommendations",
      ),
    supabase
      .from("v_gap_closure_overview")
      .select(
        "root_cause_id, root_cause_name, estimated_cost, expected_annual_uplift, payback_months, investment_status, plan_count, active_plan_count",
      ),
  ]);

  if (priorityResult.error) {
    throw new Error(`Failed to load root cause priority: ${priorityResult.error.message}`);
  }
  if (addressabilityResult.error) {
    throw new Error(`Failed to load root cause addressability: ${addressabilityResult.error.message}`);
  }
  if (gapClosureResult.error) {
    throw new Error(`Failed to load gap closure overview: ${gapClosureResult.error.message}`);
  }

  const rowsById = new Map<string, RootCauseRow>();

  const getOrCreate = (rootCauseId: string, name: string | null): RootCauseRow => {
    const existing = rowsById.get(rootCauseId);
    if (existing) {
      if (!existing.name && name) existing.name = name;
      return existing;
    }
    const created: RootCauseRow = {
      rootCauseId,
      name: name ?? "",
      dealCount: 0,
      lostAcv: 0,
      weightedLostAcv: 0,
      bestCoverage: null,
      onRoadmap: null,
      earliestTargetQuarter: null,
      recommendations: null,
      estimatedCost: null,
      expectedAnnualUplift: null,
      paybackMonths: null,
      investmentStatus: null,
      planCount: null,
      activePlanCount: null,
    };
    rowsById.set(rootCauseId, created);
    return created;
  };

  // Priority view is per competitor and quarter; aggregate it per root cause.
  for (const row of priorityResult.data) {
    if (!row.root_cause_id) continue;
    const target = getOrCreate(row.root_cause_id, row.root_cause_name);
    target.dealCount += row.deal_count ?? 0;
    target.lostAcv += row.lost_acv ?? 0;
    target.weightedLostAcv += row.weighted_lost_acv ?? 0;
  }

  for (const row of addressabilityResult.data) {
    if (!row.root_cause_id) continue;
    const target = getOrCreate(row.root_cause_id, row.root_cause_name);
    target.bestCoverage = row.best_coverage;
    target.onRoadmap = row.on_roadmap;
    target.earliestTargetQuarter = row.earliest_target_quarter;
    target.recommendations = row.recommendations;
  }

  for (const row of gapClosureResult.data) {
    if (!row.root_cause_id) continue;
    const target = getOrCreate(row.root_cause_id, row.root_cause_name);
    target.estimatedCost = row.estimated_cost;
    target.expectedAnnualUplift = row.expected_annual_uplift;
    target.paybackMonths = row.payback_months;
    target.investmentStatus = row.investment_status;
    target.planCount = row.plan_count;
    target.activePlanCount = row.active_plan_count;
  }

  const rows = Array.from(rowsById.values())
    .map((row) => ({ ...row, name: row.name || "Unnamed root cause" }))
    .sort((a, b) => b.weightedLostAcv - a.weightedLostAcv);

  return (
    <div>
      <PageHeader
        title="Root Causes"
        description="First principles behind lost deals, prioritised by deals and ACV, with roadmap coverage and investment cases."
      />
      <RootCausesTable rows={rows} />
    </div>
  );
}
