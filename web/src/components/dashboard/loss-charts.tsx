import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DashboardBarChart } from "@/components/dashboard/bar-chart";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { CompetitorLossSummary } from "@/components/dashboard/queries";

type LossChartsProps = {
  losses: CompetitorLossSummary;
};

const EMPTY_MESSAGE = "No lost deals yet. Import CRM deals to see this.";

export function LossCharts({ losses }: LossChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader
          title="Lost ACV by competitor"
          description="Total ACV of lost deals, grouped by the competitor that won."
        />
        <CardContent>
          {losses.acvByCompetitor.length === 0 ? (
            <EmptyState message={EMPTY_MESSAGE} />
          ) : (
            <DashboardBarChart
              data={losses.acvByCompetitor}
              valueKind="currency"
              valueLabel="Lost ACV"
              orientation="horizontal"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Lost deals by quarter"
          description="Number of deals lost to a competitor per fiscal quarter."
        />
        <CardContent>
          {losses.dealsByQuarter.length === 0 ? (
            <EmptyState message={EMPTY_MESSAGE} />
          ) : (
            <DashboardBarChart
              data={losses.dealsByQuarter}
              valueKind="count"
              valueLabel="Lost deals"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
