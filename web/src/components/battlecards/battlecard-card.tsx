import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BattlecardStatusBadge, type BattlecardStatus } from "@/components/battlecards/status-badge";
import { ProvenanceMixBar, type ProvenanceCounts } from "@/components/battlecards/provenance-mix-bar";
import { formatDate } from "@/components/battlecards/format";

export type BattlecardCardProps = {
  id: string;
  title: string;
  competitorName: string;
  version: number;
  status: BattlecardStatus;
  publishedAt: string | null;
  provenanceCounts: ProvenanceCounts;
};

export function BattlecardCard({
  id,
  title,
  competitorName,
  version,
  status,
  publishedAt,
  provenanceCounts,
}: BattlecardCardProps) {
  return (
    <Link href={`/battlecards/${id}`} className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <Card className="flex h-full flex-col px-5 py-4 transition hover:border-slate-300 hover:shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">vs. {competitorName}</p>
          </div>
          <BattlecardStatusBadge status={status} />
        </div>
        <dl className="mt-3 flex gap-4 text-xs text-slate-500">
          <div>
            <dt className="sr-only">Version</dt>
            <dd>v{version}</dd>
          </div>
          <div>
            <dt className="sr-only">Published</dt>
            <dd>{publishedAt ? `Published ${formatDate(publishedAt)}` : "Not published"}</dd>
          </div>
        </dl>
        <div className="mt-4">
          <ProvenanceMixBar counts={provenanceCounts} />
        </div>
      </Card>
    </Link>
  );
}
