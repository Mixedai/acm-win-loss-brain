import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProvenanceBadge, type Provenance } from "@/components/ui/badge";
import { formatPercent } from "./format";

export type DealRootCauseRow = {
  root_cause_id: string;
  weight: number;
  provenance: Provenance;
  notes: string | null;
  root_cause: { name: string; description: string | null } | null;
};

type RootCausesListProps = {
  rootCauses: DealRootCauseRow[];
};

export function RootCausesList({ rootCauses }: RootCausesListProps) {
  return (
    <Card>
      <CardHeader
        title="Attributed root causes"
        description="Root causes this deal contributes to, weighted by how much they explain the outcome."
      />
      <CardContent>
        {rootCauses.length === 0 ? (
          <p className="text-sm text-slate-500">
            No root causes attributed yet. Run the analysis once reasons have been extracted.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {rootCauses.map((item) => (
              <li key={item.root_cause_id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {item.root_cause?.name ?? "Unknown root cause"}
                  </p>
                  {item.root_cause?.description ? (
                    <p className="mt-0.5 text-xs text-slate-500">{item.root_cause.description}</p>
                  ) : null}
                  {item.notes ? <p className="mt-1 text-sm text-slate-600">{item.notes}</p> : null}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <ProvenanceBadge provenance={item.provenance} />
                  <span className="text-sm font-semibold tabular-nums text-slate-900">
                    {formatPercent(item.weight)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
