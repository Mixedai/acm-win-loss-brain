import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { humaniseCategory } from "@/components/companies/category";
import { TraitList } from "@/components/companies/trait-list";
import type { CompanyRow, GroupedTraits } from "@/components/companies/types";

type OwnCompanyCardProps = {
  company: CompanyRow;
  traits: GroupedTraits;
};

export function OwnCompanyCard({ company, traits }: OwnCompanyCardProps) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={`/companies/${company.slug}`}
              className="text-lg font-semibold tracking-tight text-slate-900 hover:underline"
            >
              {company.name}
            </Link>
            <Badge tone="blue">Our company</Badge>
            <Badge>{humaniseCategory(company.category)}</Badge>
          </div>
          {company.tagline ? <p className="mt-1 text-sm text-slate-600">{company.tagline}</p> : null}
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TraitList title="Strengths" kind="strength" traits={traits.strengths} compact />
        <TraitList title="Weaknesses" kind="weakness" traits={traits.weaknesses} compact />
      </div>
    </div>
  );
}
