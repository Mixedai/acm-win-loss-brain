import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProvenanceBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatCount } from "@/components/dashboard/format";
import type { ProvenanceCount } from "@/components/dashboard/queries";

type EvidenceMixCardProps = {
  mix: ProvenanceCount[];
};

export function EvidenceMixCard({ mix }: EvidenceMixCardProps) {
  return (
    <Card>
      <CardHeader
        title="Battlecard evidence mix"
        description="Where battlecard statements come from, across all battlecards."
      />
      <CardContent>
        {mix.length === 0 ? (
          <EmptyState message="No battlecard statements yet. Generate a battlecard to see its evidence mix." />
        ) : (
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {mix.map((entry) => (
              <li key={entry.provenance} className="flex items-center gap-2">
                <ProvenanceBadge provenance={entry.provenance} />
                <span className="text-sm font-medium tabular-nums text-slate-900">
                  {formatCount(entry.count)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
