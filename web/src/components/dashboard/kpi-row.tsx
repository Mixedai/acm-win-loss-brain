import { StatCard } from "@/components/ui/stat-card";
import { formatCompactCurrency, formatCount } from "@/components/dashboard/format";
import type { KpiSummary } from "@/components/dashboard/queries";

type KpiRowProps = {
  summary: KpiSummary;
};

export function KpiRow({ summary }: KpiRowProps) {
  const noLostDeals = summary.lostDeals === 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Clients" value={formatCount(summary.clients)} />
      <StatCard label="Companies in catalog" value={formatCount(summary.companies)} />
      <StatCard
        label="Lost deals"
        value={formatCount(summary.lostDeals)}
        hint={noLostDeals ? "No CRM deals imported yet" : undefined}
      />
      <StatCard
        label="Lost ACV"
        value={formatCompactCurrency(summary.lostAcv)}
        hint={noLostDeals ? "Sum of ACV across lost deals" : undefined}
      />
      <StatCard label="Battlecards" value={formatCount(summary.battlecards)} />
    </div>
  );
}
