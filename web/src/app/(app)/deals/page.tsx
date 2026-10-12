import { Handshake, Trophy, XCircle, Banknote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DealsFilterBar, type CompetitorOption, type DealFilters } from "@/components/deals/deals-filter-bar";
import { DealsTable, type DealListRow } from "@/components/deals/deals-table";
import { formatCurrency, isDealOutcome, isUuid } from "@/components/deals/format";

type SearchParams = Record<string, string | string[] | undefined>;

type DealsPageProps = {
  searchParams: Promise<SearchParams>;
};

const EMPTY_MESSAGE = "No deals yet. Import CRM deals to start the win/loss analysis.";

function firstParam(value: string | string[] | undefined): string | null {
  const single = Array.isArray(value) ? value[0] : value;
  return single && single.length > 0 ? single : null;
}

function parseFilters(params: SearchParams): DealFilters {
  const outcome = firstParam(params.outcome);
  const competitor = firstParam(params.competitor);
  return {
    outcome: outcome && isDealOutcome(outcome) ? outcome : null,
    quarter: firstParam(params.quarter),
    competitor: competitor && isUuid(competitor) ? competitor : null,
  };
}

function applyFilters(deals: DealListRow[], filters: DealFilters): DealListRow[] {
  return deals.filter((deal) => {
    if (filters.outcome && deal.outcome !== filters.outcome) return false;
    if (filters.quarter && deal.fiscal_quarter !== filters.quarter) return false;
    if (filters.competitor && deal.winning_competitor_id !== filters.competitor) return false;
    return true;
  });
}

// Sums lost ACV and reports the currency when every lost deal shares one,
// so mixed-currency totals are never presented as a single currency.
function summarizeLostAcv(deals: DealListRow[]): { value: string; hint: string | undefined } {
  const lost = deals.filter((deal) => deal.outcome === "lost" && deal.acv !== null);
  if (lost.length === 0) return { value: "—", hint: undefined };
  const total = lost.reduce((sum, deal) => sum + (deal.acv ?? 0), 0);
  const currencies = new Set(lost.map((deal) => deal.currency));
  if (currencies.size === 1) {
    return { value: formatCurrency(total, lost[0].currency), hint: undefined };
  }
  return {
    value: total.toLocaleString("en-US", { maximumFractionDigits: 0 }),
    hint: `Mixed currencies: ${[...currencies].join(", ")}`,
  };
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const filters = parseFilters(await searchParams);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("deals")
    .select(
      "id, name, account_name, segment, acv, currency, outcome, close_date, fiscal_quarter, crm_loss_reason_raw, winning_competitor_id, winning_competitor:competitors!deals_winning_competitor_id_fkey(name), crm_loss_reason:loss_reasons!deals_crm_loss_reason_id_fkey(name)",
    )
    .order("close_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load deals: ${error.message}`);
  }

  const allDeals: DealListRow[] = data;
  const deals = applyFilters(allDeals, filters);

  const quarters = [...new Set(allDeals.flatMap((deal) => (deal.fiscal_quarter ? [deal.fiscal_quarter] : [])))]
    .sort()
    .reverse();

  const competitorMap = new Map<string, string>();
  for (const deal of allDeals) {
    if (deal.winning_competitor_id && deal.winning_competitor) {
      competitorMap.set(deal.winning_competitor_id, deal.winning_competitor.name);
    }
  }
  const competitors: CompetitorOption[] = [...competitorMap.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const wonCount = deals.filter((deal) => deal.outcome === "won").length;
  const lostCount = deals.filter((deal) => deal.outcome === "lost").length;
  const lostAcv = summarizeLostAcv(deals);

  const hasFilters = filters.outcome !== null || filters.quarter !== null || filters.competitor !== null;
  const emptyMessage =
    allDeals.length === 0
      ? EMPTY_MESSAGE
      : hasFilters
        ? "No deals match the current filters."
        : EMPTY_MESSAGE;

  return (
    <>
      <PageHeader title="Deals" description="CRM outcomes and the reasons behind them." />

      <DealsFilterBar filters={filters} quarters={quarters} competitors={competitors} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total deals" value={deals.length} icon={<Handshake className="h-4 w-4" aria-hidden="true" />} />
        <StatCard label="Won" value={wonCount} icon={<Trophy className="h-4 w-4" aria-hidden="true" />} />
        <StatCard label="Lost" value={lostCount} icon={<XCircle className="h-4 w-4" aria-hidden="true" />} />
        <StatCard
          label="Lost ACV"
          value={lostAcv.value}
          hint={lostAcv.hint}
          icon={<Banknote className="h-4 w-4" aria-hidden="true" />}
        />
      </div>

      <DealsTable deals={deals} emptyMessage={emptyMessage} />
    </>
  );
}
