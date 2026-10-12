import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";
import { isCompanyCategory, type CompanyCategory } from "@/components/companies/category";
import { CompanyCard } from "@/components/companies/company-card";
import { CompanyFilters } from "@/components/companies/company-filters";
import { OwnCompanyCard } from "@/components/companies/own-company-card";
import {
  EMPTY_TRAITS,
  groupTraitsByCompany,
  type CompanyRow,
  type CompanyTrait,
} from "@/components/companies/types";

export const dynamic = "force-dynamic";

const COMPANY_COLUMNS =
  "id, name, slug, category, tagline, description, website, headquarters, founded_year, employee_range, pricing_model, is_own_company, created_at, updated_at";

const TRAIT_COLUMNS = "id, company_id, kind, title, description, provenance, sort_order";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

// PostgREST `or()` filters use commas, dots and parentheses as syntax, so the value
// is double-quoted and quote/backslash characters are stripped from user input.
function quoteFilterValue(value: string): string {
  return `"%${value.replace(/["\\]/g, "")}%"`;
}

export default async function CompaniesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = firstParam(params.q).trim();
  const rawCategory = firstParam(params.category);
  const category: CompanyCategory | null = isCompanyCategory(rawCategory) ? rawCategory : null;

  const supabase = await createClient();

  let companiesQuery = supabase.from("companies").select(COMPANY_COLUMNS).order("name");
  if (category) {
    companiesQuery = companiesQuery.eq("category", category);
  }
  if (query) {
    const pattern = quoteFilterValue(query);
    companiesQuery = companiesQuery.or(`name.ilike.${pattern},tagline.ilike.${pattern}`);
  }

  const [companiesResult, ownCompanyResult] = await Promise.all([
    companiesQuery,
    supabase.from("companies").select(COMPANY_COLUMNS).eq("is_own_company", true).maybeSingle(),
  ]);

  if (companiesResult.error) {
    throw new Error(`Failed to load companies: ${companiesResult.error.message}`);
  }
  if (ownCompanyResult.error) {
    throw new Error(`Failed to load own company: ${ownCompanyResult.error.message}`);
  }

  const companies: CompanyRow[] = companiesResult.data;
  const ownCompany: CompanyRow | null = ownCompanyResult.data;

  const traitCompanyIds = new Set(companies.map((company) => company.id));
  if (ownCompany) traitCompanyIds.add(ownCompany.id);

  let traits: CompanyTrait[] = [];
  if (traitCompanyIds.size > 0) {
    const traitsResult = await supabase
      .from("company_traits")
      .select(TRAIT_COLUMNS)
      .in("company_id", Array.from(traitCompanyIds))
      .order("sort_order");
    if (traitsResult.error) {
      throw new Error(`Failed to load company traits: ${traitsResult.error.message}`);
    }
    traits = traitsResult.data;
  }

  const traitsByCompany = groupTraitsByCompany(traits);
  const hasFilters = query.length > 0 || category !== null;

  return (
    <div>
      <PageHeader
        title="Companies"
        description="AI SaaS market catalog with strengths and weaknesses."
      />

      {ownCompany ? (
        <div className="mb-8">
          <OwnCompanyCard
            company={ownCompany}
            traits={traitsByCompany.get(ownCompany.id) ?? EMPTY_TRAITS}
          />
        </div>
      ) : null}

      <div className="mb-5">
        <CompanyFilters query={query} category={category} />
      </div>

      <p className="mb-4 text-xs text-slate-500">
        {companies.length} {companies.length === 1 ? "company" : "companies"}
        {hasFilters ? " match your filters" : " in the catalog"}
      </p>

      {companies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-900">No companies found</p>
          <p className="mt-1 text-sm text-slate-500">
            {hasFilters
              ? "Try a different search term or clear the category filter."
              : "The catalog is empty."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              traits={traitsByCompany.get(company.id) ?? EMPTY_TRAITS}
            />
          ))}
        </div>
      )}
    </div>
  );
}
