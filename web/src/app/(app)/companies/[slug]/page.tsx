import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, CreditCard, ExternalLink, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { humaniseCategory } from "@/components/companies/category";
import { TraitList } from "@/components/companies/trait-list";
import { groupTraitsByCompany, type CompanyRow } from "@/components/companies/types";

export const dynamic = "force-dynamic";

const COMPANY_COLUMNS =
  "id, name, slug, category, tagline, description, website, headquarters, founded_year, employee_range, pricing_model, is_own_company, created_at, updated_at";

const TRAIT_COLUMNS = "id, company_id, kind, title, description, provenance, sort_order";

type Params = Promise<{ slug: string }>;

function formatWebsite(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default async function CompanyDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const companyResult = await supabase
    .from("companies")
    .select(COMPANY_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (companyResult.error) {
    throw new Error(`Failed to load company "${slug}": ${companyResult.error.message}`);
  }

  const company: CompanyRow | null = companyResult.data;
  if (!company) {
    notFound();
  }

  const traitsResult = await supabase
    .from("company_traits")
    .select(TRAIT_COLUMNS)
    .eq("company_id", company.id)
    .order("sort_order");

  if (traitsResult.error) {
    throw new Error(`Failed to load traits for "${slug}": ${traitsResult.error.message}`);
  }

  const traits = groupTraitsByCompany(traitsResult.data).get(company.id) ?? {
    strengths: [],
    weaknesses: [],
  };

  const facts = [
    company.headquarters
      ? { icon: MapPin, label: "Headquarters", value: company.headquarters }
      : null,
    company.founded_year
      ? { icon: Calendar, label: "Founded", value: String(company.founded_year) }
      : null,
    company.employee_range
      ? { icon: Users, label: "Employees", value: company.employee_range }
      : null,
    company.pricing_model
      ? { icon: CreditCard, label: "Pricing", value: company.pricing_model }
      : null,
  ].filter((fact) => fact !== null);

  return (
    <div>
      <Link
        href="/companies"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to companies
      </Link>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{company.name}</h1>
          <Badge>{humaniseCategory(company.category)}</Badge>
          {company.is_own_company ? <Badge tone="blue">Our company</Badge> : null}
        </div>
        {company.tagline ? <p className="mt-2 text-base text-slate-600">{company.tagline}</p> : null}
        {company.description ? (
          <p className="mt-3 max-w-3xl text-sm text-slate-600">{company.description}</p>
        ) : null}

        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          {company.website ? (
            <div className="flex items-center gap-1.5">
              <ExternalLink className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <dt className="sr-only">Website</dt>
              <dd>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  {formatWebsite(company.website)}
                </a>
              </dd>
            </div>
          ) : null}
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-center gap-1.5">
              <fact.icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <dt className="sr-only">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TraitList title="Strengths" kind="strength" traits={traits.strengths} />
        <TraitList title="Weaknesses" kind="weakness" traits={traits.weaknesses} />
      </div>
    </div>
  );
}
