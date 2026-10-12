-- Migration 9: market catalog of AI SaaS companies with strengths and weaknesses,
-- links from clients/competitors to the catalog, and first-user-becomes-admin bootstrap.

create type public.trait_kind as enum ('strength', 'weakness');

create type public.company_category as enum (
  'llm_platform',
  'ai_agents',
  'coding_assistant',
  'customer_support_ai',
  'sales_marketing_ai',
  'content_generation',
  'voice_speech',
  'vision_video',
  'data_analytics_ai',
  'search_knowledge',
  'ai_infrastructure',
  'security_governance',
  'vertical_ai',
  'win_loss_intelligence'
);

-- Every AI SaaS company we know about. ACM (us) is also a row, flagged is_own_company.
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category public.company_category not null,
  tagline text,
  description text,
  website text,
  headquarters text,
  founded_year integer,
  employee_range text,                   -- e.g. '51-200'
  pricing_model text,                    -- e.g. 'per seat', 'usage based'
  is_own_company boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint companies_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint companies_founded_year_range check (founded_year is null or founded_year between 1990 and 2100)
);

create unique index companies_single_own_company_idx on public.companies (is_own_company) where is_own_company;
create index companies_category_idx on public.companies (category);

-- Strengths and weaknesses of a company, each with a provenance label.
create table public.company_traits (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  kind public.trait_kind not null,
  title text not null,
  description text,
  provenance public.provenance_type not null default 'third_party',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index company_traits_company_kind_idx on public.company_traits (company_id, kind, sort_order);

-- Clients and competitors may point at their catalog entry.
alter table public.clients
  add column company_id uuid references public.companies (id) on delete set null;
alter table public.competitors
  add column company_id uuid references public.companies (id) on delete set null;

create index clients_company_idx on public.clients (company_id);
create index competitors_company_idx on public.competitors (company_id);

create trigger set_updated_at before update on public.companies
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.company_traits
  for each row execute function public.set_updated_at();

-- Catalog is readable by everyone signed in; admins and analysts maintain it.
alter table public.companies enable row level security;
alter table public.company_traits enable row level security;

create policy "companies: read" on public.companies
  for select to authenticated using (true);
create policy "companies: editor insert" on public.companies
  for insert to authenticated with check (public.current_user_role() in ('admin', 'analyst'));
create policy "companies: editor update" on public.companies
  for update to authenticated
  using (public.current_user_role() in ('admin', 'analyst'))
  with check (public.current_user_role() in ('admin', 'analyst'));
create policy "companies: admin delete" on public.companies
  for delete to authenticated using (public.is_admin());

create policy "company_traits: read" on public.company_traits
  for select to authenticated using (true);
create policy "company_traits: editor insert" on public.company_traits
  for insert to authenticated with check (public.current_user_role() in ('admin', 'analyst'));
create policy "company_traits: editor update" on public.company_traits
  for update to authenticated
  using (public.current_user_role() in ('admin', 'analyst'))
  with check (public.current_user_role() in ('admin', 'analyst'));
create policy "company_traits: admin delete" on public.company_traits
  for delete to authenticated using (public.is_admin());

-- Bootstrap: the very first user to sign up becomes admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    case when exists (select 1 from public.profiles) then 'analyst'::public.user_role
         else 'admin'::public.user_role end
  );
  return new;
end;
$$;
