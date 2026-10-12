import { ProvenanceBadge } from "@/components/ui/badge";
import type { CompanyTrait } from "@/components/companies/types";

type TraitListProps = {
  title: string;
  kind: "strength" | "weakness";
  traits: CompanyTrait[];
  compact?: boolean;
};

const ACCENT = {
  strength: {
    heading: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  weakness: {
    heading: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
} as const;

export function TraitList({ title, kind, traits, compact = false }: TraitListProps) {
  const accent = ACCENT[kind];

  return (
    <section className={`rounded-xl border bg-white shadow-sm ${accent.border}`}>
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
        <span className={`h-2 w-2 rounded-full ${accent.dot}`} aria-hidden="true" />
        <h3 className={`text-sm font-semibold ${accent.heading}`}>{title}</h3>
        <span className="ml-auto text-xs text-slate-400">{traits.length}</span>
      </div>
      {traits.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-500">No {title.toLowerCase()} recorded.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {traits.map((trait) => (
            <li key={trait.id} className={compact ? "px-5 py-2.5" : "px-5 py-4"}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">{trait.title}</p>
                <ProvenanceBadge provenance={trait.provenance} className="shrink-0" />
              </div>
              {!compact && trait.description ? (
                <p className="mt-1 text-sm text-slate-600">{trait.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
