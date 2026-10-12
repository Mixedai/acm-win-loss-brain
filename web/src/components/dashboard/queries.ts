import type { Database } from "@/types/database";
import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

type CompetitorLossRow = Database["public"]["Views"]["v_competitor_losses_by_quarter"]["Row"];
type RootCausePriorityRow = Database["public"]["Views"]["v_root_cause_priority"]["Row"];
type ProvenanceMixRow = Database["public"]["Views"]["v_battlecard_provenance_mix"]["Row"];
type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type TraitKind = Database["public"]["Enums"]["trait_kind"];
type Provenance = Database["public"]["Enums"]["provenance_type"];

export type KpiSummary = {
  clients: number;
  companies: number;
  lostDeals: number;
  lostAcv: number;
  battlecards: number;
};

export type NamedValue = {
  label: string;
  value: number;
};

export type RootCauseSummary = {
  rootCauseName: string;
  dealCount: number;
  lostAcv: number;
};

export type ProvenanceCount = {
  provenance: Provenance;
  count: number;
};

export type RecentCompany = Pick<CompanyRow, "id" | "name" | "category" | "tagline">;

export type CatalogSnapshot = {
  traitCounts: Record<TraitKind, number>;
  recentCompanies: RecentCompany[];
};

function fail(context: string, message: string): never {
  throw new Error(`Dashboard query failed (${context}): ${message}`);
}

async function countRows(
  supabase: Supabase,
  table: "clients" | "companies" | "battlecards",
): Promise<number> {
  const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true });
  if (error) fail(`count ${table}`, error.message);
  return count ?? 0;
}

export async function fetchKpiSummary(supabase: Supabase): Promise<KpiSummary> {
  const [clients, companies, battlecards, lostDealsResult] = await Promise.all([
    countRows(supabase, "clients"),
    countRows(supabase, "companies"),
    countRows(supabase, "battlecards"),
    supabase.from("deals").select("acv").eq("outcome", "lost"),
  ]);

  if (lostDealsResult.error) fail("lost deals", lostDealsResult.error.message);

  const lostAcv = lostDealsResult.data.reduce((sum, deal) => sum + (deal.acv ?? 0), 0);

  return {
    clients,
    companies,
    lostDeals: lostDealsResult.data.length,
    lostAcv,
    battlecards,
  };
}

// Sums a numeric field per label and returns the groups sorted by value desc.
function sumByLabel<T>(
  rows: T[],
  getLabel: (row: T) => string | null,
  getValue: (row: T) => number | null,
): NamedValue[] {
  const totals = new Map<string, number>();
  for (const row of rows) {
    const label = getLabel(row);
    if (!label) continue;
    totals.set(label, (totals.get(label) ?? 0) + (getValue(row) ?? 0));
  }
  return Array.from(totals, ([label, value]) => ({ label, value })).sort(
    (a, b) => b.value - a.value,
  );
}

export type CompetitorLossSummary = {
  acvByCompetitor: NamedValue[];
  dealsByQuarter: NamedValue[];
};

export async function fetchCompetitorLosses(supabase: Supabase): Promise<CompetitorLossSummary> {
  const { data, error } = await supabase
    .from("v_competitor_losses_by_quarter")
    .select("competitor_name, fiscal_quarter, lost_acv, lost_deal_count");
  if (error) fail("v_competitor_losses_by_quarter", error.message);

  const rows: Pick<
    CompetitorLossRow,
    "competitor_name" | "fiscal_quarter" | "lost_acv" | "lost_deal_count"
  >[] = data;

  const acvByCompetitor = sumByLabel(
    rows,
    (row) => row.competitor_name,
    (row) => row.lost_acv,
  );
  // Quarters read left to right chronologically, so sort by label instead of value.
  const dealsByQuarter = sumByLabel(
    rows,
    (row) => row.fiscal_quarter,
    (row) => row.lost_deal_count,
  ).sort((a, b) => a.label.localeCompare(b.label));

  return { acvByCompetitor, dealsByQuarter };
}

export async function fetchTopRootCauses(supabase: Supabase): Promise<RootCauseSummary[]> {
  const { data, error } = await supabase
    .from("v_root_cause_priority")
    .select("root_cause_name, deal_count, lost_acv");
  if (error) fail("v_root_cause_priority", error.message);

  const rows: Pick<RootCausePriorityRow, "root_cause_name" | "deal_count" | "lost_acv">[] = data;
  const totals = new Map<string, RootCauseSummary>();
  for (const row of rows) {
    if (!row.root_cause_name) continue;
    const current = totals.get(row.root_cause_name) ?? {
      rootCauseName: row.root_cause_name,
      dealCount: 0,
      lostAcv: 0,
    };
    current.dealCount += row.deal_count ?? 0;
    current.lostAcv += row.lost_acv ?? 0;
    totals.set(row.root_cause_name, current);
  }

  return Array.from(totals.values())
    .sort((a, b) => b.lostAcv - a.lostAcv)
    .slice(0, 10);
}

export async function fetchProvenanceMix(supabase: Supabase): Promise<ProvenanceCount[]> {
  const { data, error } = await supabase
    .from("v_battlecard_provenance_mix")
    .select("provenance, statement_count");
  if (error) fail("v_battlecard_provenance_mix", error.message);

  const rows: Pick<ProvenanceMixRow, "provenance" | "statement_count">[] = data;
  const totals = new Map<Provenance, number>();
  for (const row of rows) {
    if (!row.provenance) continue;
    totals.set(row.provenance, (totals.get(row.provenance) ?? 0) + (row.statement_count ?? 0));
  }

  return Array.from(totals, ([provenance, count]) => ({ provenance, count })).sort(
    (a, b) => b.count - a.count,
  );
}

export async function fetchCatalogSnapshot(supabase: Supabase): Promise<CatalogSnapshot> {
  const [traitsResult, companiesResult] = await Promise.all([
    supabase.from("company_traits").select("kind"),
    supabase
      .from("companies")
      .select("id, name, category, tagline")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (traitsResult.error) fail("company_traits", traitsResult.error.message);
  if (companiesResult.error) fail("companies", companiesResult.error.message);

  const traitCounts: Record<TraitKind, number> = { strength: 0, weakness: 0 };
  for (const trait of traitsResult.data) {
    traitCounts[trait.kind] += 1;
  }

  return { traitCounts, recentCompanies: companiesResult.data };
}
