import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PROVENANCE_META } from "@/components/ui/badge";
import {
  PROVENANCE_FILL,
  PROVENANCE_ORDER,
  ProvenanceMixBar,
  type ProvenanceCounts,
} from "@/components/battlecards/provenance-mix-bar";

export function EvidenceMixCard({ counts }: { counts: ProvenanceCounts }) {
  const total = PROVENANCE_ORDER.reduce((sum, provenance) => sum + (counts[provenance] ?? 0), 0);

  return (
    <Card className="sticky top-6">
      <CardHeader title="Evidence mix" description={`${total} statements in this battlecard`} />
      <CardContent>
        <ProvenanceMixBar counts={counts} showLegend={false} />
        <ul className="mt-4 space-y-2">
          {PROVENANCE_ORDER.map((provenance) => {
            const count = counts[provenance] ?? 0;
            const share = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <li key={provenance} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-slate-700">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${PROVENANCE_FILL[provenance]}`}
                    aria-hidden="true"
                  />
                  {PROVENANCE_META[provenance].label}
                </span>
                <span className="tabular-nums text-slate-500">
                  {count}
                  <span className="ml-1 text-xs text-slate-400">({share}%)</span>
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
