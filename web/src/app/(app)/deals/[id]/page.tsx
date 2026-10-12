import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OutcomeBadge } from "@/components/deals/outcome-badge";
import { ReconciliationCard, type ReconciliationRow } from "@/components/deals/reconciliation-card";
import { ExtractedReasonsList, type ExtractedReasonRow } from "@/components/deals/extracted-reasons-list";
import { RootCausesList, type DealRootCauseRow } from "@/components/deals/root-causes-list";
import { SEGMENT_LABEL, formatCurrency, formatDate, isUuid } from "@/components/deals/format";

type DealDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params;
  if (!isUuid(id)) {
    notFound();
  }

  const supabase = await createClient();

  const [dealResult, reconciliationResult, reasonsResult, rootCausesResult] = await Promise.all([
    supabase
      .from("deals")
      .select(
        "id, name, account_name, account_industry, region, segment, acv, currency, outcome, close_stage, close_date, fiscal_quarter, seller_name, crm_loss_reason_raw, winning_competitor:competitors!deals_winning_competitor_id_fkey(name), incumbent_competitor:competitors!deals_incumbent_competitor_id_fkey(name), crm_loss_reason:loss_reasons!deals_crm_loss_reason_id_fkey(name)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("v_reason_reconciliation")
      .select(
        "crm_stated_reason, crm_loss_reason_raw, seller_reason, seller_quote, customer_reason, customer_quote, verdict, final_reason, rationale",
      )
      .eq("deal_id", id)
      .maybeSingle(),
    supabase
      .from("extracted_reasons")
      .select(
        "id, perspective, provenance, verbatim_quote, summary, confidence, loss_reason:loss_reasons!extracted_reasons_loss_reason_id_fkey(name)",
      )
      .eq("deal_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("deal_root_causes")
      .select(
        "root_cause_id, weight, provenance, notes, root_cause:root_causes!deal_root_causes_root_cause_id_fkey(name, description)",
      )
      .eq("deal_id", id)
      .order("weight", { ascending: false }),
  ]);

  if (dealResult.error) {
    throw new Error(`Failed to load deal: ${dealResult.error.message}`);
  }
  if (reconciliationResult.error) {
    throw new Error(`Failed to load reason reconciliation: ${reconciliationResult.error.message}`);
  }
  if (reasonsResult.error) {
    throw new Error(`Failed to load extracted reasons: ${reasonsResult.error.message}`);
  }
  if (rootCausesResult.error) {
    throw new Error(`Failed to load root causes: ${rootCausesResult.error.message}`);
  }

  const deal = dealResult.data;
  if (!deal) {
    notFound();
  }

  const reconciliation: ReconciliationRow | null = reconciliationResult.data;
  const reasons: ExtractedReasonRow[] = reasonsResult.data;
  const rootCauses: DealRootCauseRow[] = rootCausesResult.data;

  const facts: Array<{ label: string; value: string }> = [
    { label: "ACV", value: formatCurrency(deal.acv, deal.currency) },
    { label: "Close date", value: formatDate(deal.close_date) },
    { label: "Fiscal quarter", value: deal.fiscal_quarter ?? "—" },
    { label: "Segment", value: deal.segment ? SEGMENT_LABEL[deal.segment] : "—" },
    { label: "Close stage", value: deal.close_stage ?? "—" },
    { label: "Seller", value: deal.seller_name ?? "—" },
    { label: "Winning competitor", value: deal.winning_competitor?.name ?? "—" },
    { label: "Incumbent", value: deal.incumbent_competitor?.name ?? "—" },
    { label: "CRM loss reason", value: deal.crm_loss_reason?.name ?? deal.crm_loss_reason_raw ?? "—" },
  ];

  return (
    <>
      <Link
        href="/deals"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to deals
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{deal.name}</h1>
            <OutcomeBadge outcome={deal.outcome} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {deal.account_name ?? "No account"}
            {deal.account_industry ? ` · ${deal.account_industry}` : ""}
            {deal.region ? ` · ${deal.region}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">ACV</p>
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            {formatCurrency(deal.acv, deal.currency)}
          </p>
          <p className="text-xs text-slate-500">Closed {formatDate(deal.close_date)}</p>
        </div>
      </div>

      <dl className="mb-6 grid gap-x-6 gap-y-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{fact.label}</dt>
            <dd className="mt-0.5 text-sm text-slate-900">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-6">
        <ReconciliationCard reconciliation={reconciliation} />
        <ExtractedReasonsList reasons={reasons} />
        <RootCausesList rootCauses={rootCauses} />
      </div>
    </>
  );
}
