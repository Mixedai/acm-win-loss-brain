import Link from "next/link";
import { MapPin, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { humaniseCategory } from "@/components/companies/category";
import type { CompanyRow, GroupedTraits } from "@/components/companies/types";

type CompanyCardProps = {
  company: CompanyRow;
  traits: GroupedTraits;
};

function pluralise(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function CompanyCard({ company, traits }: CompanyCardProps) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/companies/${company.slug}`}
          className="text-base font-semibold text-slate-900 hover:underline"
        >
          {company.name}
        </Link>
        {company.is_own_company ? <Badge tone="blue">Ours</Badge> : null}
      </div>
      <div className="mt-2">
        <Badge>{humaniseCategory(company.category)}</Badge>
      </div>
      {company.tagline ? (
        <p className="mt-3 line-clamp-2 text-sm text-slate-600">{company.tagline}</p>
      ) : null}
      <dl className="mt-4 space-y-1.5 text-xs text-slate-500">
        {company.headquarters ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Headquarters</dt>
            <dd>{company.headquarters}</dd>
          </div>
        ) : null}
        {company.pricing_model ? (
          <div className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Pricing model</dt>
            <dd>{company.pricing_model}</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-auto pt-4 text-xs font-medium text-slate-500">
        <span className="text-emerald-700">{pluralise(traits.strengths.length, "strength")}</span>
        <span className="mx-1.5 text-slate-300">·</span>
        <span className="text-red-700">{pluralise(traits.weaknesses.length, "weakness")}</span>
      </p>
    </Card>
  );
}
