"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OUTCOME_META, type DealOutcome } from "./format";

export type DealFilters = {
  outcome: DealOutcome | null;
  quarter: string | null;
  competitor: string | null;
};

export type CompetitorOption = { id: string; name: string };

type DealsFilterBarProps = {
  filters: DealFilters;
  quarters: string[];
  competitors: CompetitorOption[];
};

const SELECT_CLASS =
  "rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none";

export function DealsFilterBar({ filters, quarters, competitors }: DealsFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const hasFilters = filters.outcome !== null || filters.quarter !== null || filters.competitor !== null;

  function update(key: keyof DealFilters, value: string) {
    const params = new URLSearchParams();
    const next: DealFilters = { ...filters, [key]: value === "" ? null : value };
    if (next.outcome) params.set("outcome", next.outcome);
    if (next.quarter) params.set("quarter", next.quarter);
    if (next.competitor) params.set("competitor", next.competitor);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form
      className="mb-6 flex flex-wrap items-center gap-3"
      onSubmit={(event) => event.preventDefault()}
      aria-label="Filter deals"
    >
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <span>Outcome</span>
        <select
          name="outcome"
          value={filters.outcome ?? ""}
          onChange={(event) => update("outcome", event.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">All</option>
          {(Object.keys(OUTCOME_META) as DealOutcome[]).map((outcome) => (
            <option key={outcome} value={outcome}>
              {OUTCOME_META[outcome].label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <span>Quarter</span>
        <select
          name="quarter"
          value={filters.quarter ?? ""}
          onChange={(event) => update("quarter", event.target.value)}
          className={SELECT_CLASS}
          disabled={quarters.length === 0}
        >
          <option value="">All</option>
          {quarters.map((quarter) => (
            <option key={quarter} value={quarter}>
              {quarter}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <span>Winning competitor</span>
        <select
          name="competitor"
          value={filters.competitor ?? ""}
          onChange={(event) => update("competitor", event.target.value)}
          className={SELECT_CLASS}
          disabled={competitors.length === 0}
        >
          <option value="">All</option>
          {competitors.map((competitor) => (
            <option key={competitor.id} value={competitor.id}>
              {competitor.name}
            </option>
          ))}
        </select>
      </label>

      {hasFilters ? (
        <Link href={pathname} className="text-sm font-medium text-slate-600 underline-offset-2 hover:underline">
          Clear filters
        </Link>
      ) : null}
    </form>
  );
}
