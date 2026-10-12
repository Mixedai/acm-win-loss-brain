import { PROVENANCE_META, type Provenance } from "@/components/ui/badge";

export const PROVENANCE_ORDER: Provenance[] = [
  "crm_outcome",
  "customer_stated",
  "seller_stated",
  "third_party",
  "internal_hypothesis",
  "competitor_claim",
];

// Solid fill colours matching the ProvenanceBadge tones.
export const PROVENANCE_FILL: Record<Provenance, string> = {
  crm_outcome: "bg-slate-800",
  customer_stated: "bg-emerald-500",
  seller_stated: "bg-blue-500",
  competitor_claim: "bg-red-500",
  third_party: "bg-violet-500",
  internal_hypothesis: "bg-amber-400",
};

export type ProvenanceCounts = Partial<Record<Provenance, number>>;

type ProvenanceMixBarProps = {
  counts: ProvenanceCounts;
  showLegend?: boolean;
};

export function ProvenanceMixBar({ counts, showLegend = true }: ProvenanceMixBarProps) {
  const entries = PROVENANCE_ORDER.map((provenance) => ({
    provenance,
    count: counts[provenance] ?? 0,
  })).filter((entry) => entry.count > 0);
  const total = entries.reduce((sum, entry) => sum + entry.count, 0);

  if (total === 0) {
    return (
      <div>
        <div className="h-2 w-full rounded-full bg-slate-100" />
        <p className="mt-1.5 text-xs text-slate-400">No statements yet</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100"
        role="img"
        aria-label={`${total} statements by provenance`}
      >
        {entries.map(({ provenance, count }) => (
          <div
            key={provenance}
            className={PROVENANCE_FILL[provenance]}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${PROVENANCE_META[provenance].label}: ${count}`}
          />
        ))}
      </div>
      {showLegend ? (
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {entries.map(({ provenance, count }) => (
            <li key={provenance} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span
                className={`inline-block h-2 w-2 rounded-full ${PROVENANCE_FILL[provenance]}`}
                aria-hidden="true"
              />
              {PROVENANCE_META[provenance].label}
              <span className="text-slate-400">{count}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
