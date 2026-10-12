-- Migration 3: structured CRM inputs. Deal outcomes, sizes, segments, stated
-- loss reasons, and the shared loss-reason taxonomy.

-- Shared (cross-client) loss reason taxonomy so results compare across the 5 clients.
create table public.loss_reason_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.loss_reasons (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.loss_reason_categories (id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index loss_reasons_category_id_idx on public.loss_reasons (category_id);

-- One row per CRM opportunity. This is the "what deal outcomes actually show" layer.
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  crm_system text,                       -- e.g. 'hubspot', 'salesforce'
  crm_external_id text,                  -- opportunity id in the client's CRM
  name text not null,
  account_name text,
  account_industry text,
  region text,
  segment public.deal_segment,
  acv numeric(14, 2),                    -- annual contract value
  currency char(3) not null default 'USD',
  outcome public.deal_outcome not null default 'open',
  close_stage text,                      -- raw CRM stage label
  close_date date,
  fiscal_quarter text generated always as (public.fiscal_quarter(close_date)) stored,
  incumbent_competitor_id uuid references public.competitors (id) on delete set null,
  winning_competitor_id uuid references public.competitors (id) on delete set null,
  crm_loss_reason_id uuid references public.loss_reasons (id) on delete set null,
  crm_loss_reason_raw text,              -- CRM "Reason for Close" as typed by the seller
  seller_name text,
  seller_email text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deals_acv_non_negative check (acv is null or acv >= 0),
  constraint deals_currency_upper check (currency = upper(currency)),
  constraint deals_won_has_no_winner check (outcome <> 'won' or winning_competitor_id is null),
  unique (client_id, crm_system, crm_external_id)
);

comment on column public.deals.crm_loss_reason_raw is
  'Seller-stated reason for close, verbatim from the CRM. Provenance: seller_stated.';

create index deals_client_outcome_close_idx on public.deals (client_id, outcome, close_date desc);
create index deals_client_quarter_idx on public.deals (client_id, fiscal_quarter);
create index deals_winning_competitor_idx on public.deals (winning_competitor_id);
create index deals_incumbent_competitor_idx on public.deals (incumbent_competitor_id);
create index deals_crm_loss_reason_idx on public.deals (crm_loss_reason_id);

-- Every competitor involved in a deal and the role it played.
create table public.deal_competitors (
  deal_id uuid not null references public.deals (id) on delete cascade,
  competitor_id uuid not null references public.competitors (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  role public.competitor_role not null,
  notes text,
  created_at timestamptz not null default now(),
  primary key (deal_id, competitor_id, role)
);

create index deal_competitors_competitor_idx on public.deal_competitors (competitor_id, role);
create index deal_competitors_client_idx on public.deal_competitors (client_id);
