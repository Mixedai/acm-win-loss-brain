import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";
import { KpiRow } from "@/components/dashboard/kpi-row";
import { LossCharts } from "@/components/dashboard/loss-charts";
import { RootCausesTable } from "@/components/dashboard/root-causes-table";
import { EvidenceMixCard } from "@/components/dashboard/evidence-mix-card";
import { CatalogSnapshotCard } from "@/components/dashboard/catalog-snapshot-card";
import {
  fetchCatalogSnapshot,
  fetchCompetitorLosses,
  fetchKpiSummary,
  fetchProvenanceMix,
  fetchTopRootCauses,
} from "@/components/dashboard/queries";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [summary, losses, rootCauses, provenanceMix, catalog] = await Promise.all([
    fetchKpiSummary(supabase),
    fetchCompetitorLosses(supabase),
    fetchTopRootCauses(supabase),
    fetchProvenanceMix(supabase),
    fetchCatalogSnapshot(supabase),
  ]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Why are we losing, to whom, and what it costs."
      />
      <div className="space-y-6">
        <KpiRow summary={summary} />
        <LossCharts losses={losses} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RootCausesTable rootCauses={rootCauses} />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <EvidenceMixCard mix={provenanceMix} />
            <CatalogSnapshotCard snapshot={catalog} />
          </div>
        </div>
      </div>
    </div>
  );
}
