import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatCount } from "@/components/dashboard/format";
import type { CatalogSnapshot } from "@/components/dashboard/queries";

type CatalogSnapshotCardProps = {
  snapshot: CatalogSnapshot;
};

// Turns an enum value like "coding_assistant" into "Coding assistant".
function formatCategory(category: string): string {
  const words = category.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function CatalogSnapshotCard({ snapshot }: CatalogSnapshotCardProps) {
  const { traitCounts, recentCompanies } = snapshot;

  return (
    <Card>
      <CardHeader
        title="Catalog snapshot"
        description="Documented traits and the latest additions to the company catalog."
      />
      <CardContent className="space-y-5">
        <dl className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Strengths</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
              {formatCount(traitCounts.strength)}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Weaknesses</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
              {formatCount(traitCounts.weakness)}
            </dd>
          </div>
        </dl>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Recently added companies
          </p>
          {recentCompanies.length === 0 ? (
            <EmptyState message="No companies in the catalog yet." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentCompanies.map((company) => (
                <li key={company.id} className="flex items-start justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{company.name}</p>
                    {company.tagline ? (
                      <p className="truncate text-xs text-slate-500">{company.tagline}</p>
                    ) : null}
                  </div>
                  <Badge className="shrink-0">{formatCategory(company.category)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
