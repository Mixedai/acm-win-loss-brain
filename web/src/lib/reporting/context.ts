import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Db = SupabaseClient<Database>;

export type ReportRequest = {
  clientId: string;
  competitorId: string;
  fiscalQuarter: string;
};

export type ReportContext = {
  client: { id: string; name: string };
  competitor: { id: string; name: string };
  fiscal_quarter: string;
  totals: {
    lost_deals: number;
    lost_acv: number;
    lost_deals_all_quarters: number;
    lost_acv_all_quarters: number;
    won_deals_vs_competitor: number;
  };
  lost_deals: Array<{
    id: string;
    name: string;
    segment: string | null;
    acv: number | null;
    close_date: string | null;
    crm_reason: string | null;
    seller_reason: string | null;
    seller_quote: string | null;
    customer_reason: string | null;
    customer_quote: string | null;
    verdict: string | null;
    final_reason: string | null;
  }>;
  root_causes: Array<{
    name: string;
    deal_count: number;
    lost_acv: number;
    best_coverage: string | null;
    on_roadmap: boolean | null;
    earliest_target_quarter: string | null;
    estimated_cost: number | null;
    expected_annual_uplift: number | null;
    payback_months: number | null;
  }>;
  competitor_claims: Array<{
    claim: string;
    claim_type: string;
    verification: string;
    notes: string | null;
  }>;
  competitor_traits: Array<{ kind: string; title: string }>;
  previous_battlecard: { version: number; summary: string | null } | null;
};

function fail(step: string, message: string): never {
  throw new Error(`Report context failed (${step}): ${message}`);
}

// Gathers every fact the agent is allowed to reason over. Numbers are computed
// here so the model never has to invent them.
export async function buildReportContext(db: Db, req: ReportRequest): Promise<ReportContext> {
  const [clientRes, competitorRes] = await Promise.all([
    db.from("clients").select("id, name").eq("id", req.clientId).maybeSingle(),
    db
      .from("competitors")
      .select("id, name, company_id")
      .eq("id", req.competitorId)
      .maybeSingle(),
  ]);
  if (clientRes.error) fail("client", clientRes.error.message);
  if (competitorRes.error) fail("competitor", competitorRes.error.message);
  if (!clientRes.data) fail("client", `No client with id ${req.clientId}`);
  if (!competitorRes.data) fail("competitor", `No competitor with id ${req.competitorId}`);
  const client = clientRes.data;
  const competitor = competitorRes.data;

  const [recRes, allLostRes, wonRes, priorityRes, addrRes, gapRes, claimsRes, traitsRes, bcRes] =
    await Promise.all([
      db
        .from("v_reason_reconciliation")
        .select("*")
        .eq("client_id", client.id)
        .eq("winning_competitor_id", competitor.id)
        .eq("fiscal_quarter", req.fiscalQuarter),
      db
        .from("deals")
        .select("acv")
        .eq("client_id", client.id)
        .eq("winning_competitor_id", competitor.id)
        .eq("outcome", "lost"),
      db
        .from("deal_competitors")
        .select("deal_id, deals!inner(outcome)")
        .eq("competitor_id", competitor.id)
        .eq("deals.outcome", "won"),
      db
        .from("v_root_cause_priority")
        .select("*")
        .eq("client_id", client.id)
        .eq("competitor_id", competitor.id),
      db.from("v_root_cause_addressability").select("*").eq("client_id", client.id),
      db.from("v_gap_closure_overview").select("*").eq("client_id", client.id),
      db
        .from("competitor_claims")
        .select("claim_text, claim_type, verification, verification_notes")
        .eq("competitor_id", competitor.id),
      competitor.company_id
        ? db
            .from("company_traits")
            .select("kind, title")
            .eq("company_id", competitor.company_id)
            .order("kind")
            .order("sort_order")
        : Promise.resolve({ data: [], error: null }),
      db
        .from("battlecards")
        .select("version, summary")
        .eq("client_id", client.id)
        .eq("competitor_id", competitor.id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (recRes.error) fail("reconciliation", recRes.error.message);
  if (allLostRes.error) fail("all lost deals", allLostRes.error.message);
  if (wonRes.error) fail("won deals", wonRes.error.message);
  if (priorityRes.error) fail("root cause priority", priorityRes.error.message);
  if (addrRes.error) fail("addressability", addrRes.error.message);
  if (gapRes.error) fail("gap closure", gapRes.error.message);
  if (claimsRes.error) fail("competitor claims", claimsRes.error.message);
  if (traitsRes.error) fail("competitor traits", traitsRes.error.message);
  if (bcRes.error) fail("previous battlecard", bcRes.error.message);

  const lostDeals = (recRes.data ?? []).map((r) => ({
    id: r.deal_id ?? "",
    name: r.deal_name ?? "",
    segment: r.segment,
    acv: r.acv,
    close_date: null,
    crm_reason: r.crm_stated_reason,
    seller_reason: r.seller_reason,
    seller_quote: r.seller_quote,
    customer_reason: r.customer_reason,
    customer_quote: r.customer_quote,
    verdict: r.verdict,
    final_reason: r.final_reason,
  }));

  const priorityByCause = new Map<string, { name: string; deal_count: number; lost_acv: number }>();
  for (const row of priorityRes.data ?? []) {
    if (!row.root_cause_id || !row.root_cause_name) continue;
    const current = priorityByCause.get(row.root_cause_id) ?? {
      name: row.root_cause_name,
      deal_count: 0,
      lost_acv: 0,
    };
    current.deal_count += row.deal_count ?? 0;
    current.lost_acv += Number(row.lost_acv ?? 0);
    priorityByCause.set(row.root_cause_id, current);
  }
  const addrById = new Map((addrRes.data ?? []).map((a) => [a.root_cause_id ?? "", a]));
  const gapById = new Map((gapRes.data ?? []).map((g) => [g.root_cause_id ?? "", g]));

  const rootCauses = [...priorityByCause.entries()]
    .map(([id, p]) => {
      const addr = addrById.get(id);
      const gap = gapById.get(id);
      return {
        name: p.name,
        deal_count: p.deal_count,
        lost_acv: p.lost_acv,
        best_coverage: addr?.best_coverage ?? null,
        on_roadmap: addr?.on_roadmap ?? null,
        earliest_target_quarter: addr?.earliest_target_quarter ?? null,
        estimated_cost: gap?.estimated_cost === null || gap?.estimated_cost === undefined ? null : Number(gap.estimated_cost),
        expected_annual_uplift:
          gap?.expected_annual_uplift === null || gap?.expected_annual_uplift === undefined
            ? null
            : Number(gap.expected_annual_uplift),
        payback_months:
          gap?.payback_months === null || gap?.payback_months === undefined ? null : Number(gap.payback_months),
      };
    })
    .sort((a, b) => b.lost_acv - a.lost_acv);

  return {
    client: { id: client.id, name: client.name },
    competitor: { id: competitor.id, name: competitor.name },
    fiscal_quarter: req.fiscalQuarter,
    totals: {
      lost_deals: lostDeals.length,
      lost_acv: lostDeals.reduce((s, d) => s + Number(d.acv ?? 0), 0),
      lost_deals_all_quarters: (allLostRes.data ?? []).length,
      lost_acv_all_quarters: (allLostRes.data ?? []).reduce((s, d) => s + Number(d.acv ?? 0), 0),
      won_deals_vs_competitor: (wonRes.data ?? []).length,
    },
    lost_deals: lostDeals,
    root_causes: rootCauses,
    competitor_claims: (claimsRes.data ?? []).map((c) => ({
      claim: c.claim_text,
      claim_type: c.claim_type,
      verification: c.verification,
      notes: c.verification_notes,
    })),
    competitor_traits: (traitsRes.data ?? []).map((t) => ({ kind: t.kind, title: t.title })),
    previous_battlecard: bcRes.data ? { version: bcRes.data.version, summary: bcRes.data.summary } : null,
  };
}
