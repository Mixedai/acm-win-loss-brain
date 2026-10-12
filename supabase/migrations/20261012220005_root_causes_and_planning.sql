-- Migration 5: root causes (first principles behind losses), their link to deals
-- for prioritisation, roadmap addressability, investment cases and action plans.

-- A first-principles cause, per client. Several loss reasons can roll up to one.
create table public.root_causes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  category_id uuid references public.loss_reason_categories (id) on delete set null,
  provenance public.provenance_type not null default 'internal_hypothesis',
  is_active boolean not null default true,
  created_by public.author_type not null default 'agent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, slug),
  constraint root_causes_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index root_causes_client_idx on public.root_causes (client_id, is_active);

-- Which taxonomy loss reasons are symptoms of this root cause.
create table public.root_cause_loss_reasons (
  root_cause_id uuid not null references public.root_causes (id) on delete cascade,
  loss_reason_id uuid not null references public.loss_reasons (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (root_cause_id, loss_reason_id)
);

-- Attribution of a lost deal to one or more root causes. Weight lets a deal be
-- split (e.g. 0.6 pricing, 0.4 missing integration). Drives the priority view.
create table public.deal_root_causes (
  deal_id uuid not null references public.deals (id) on delete cascade,
  root_cause_id uuid not null references public.root_causes (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  weight numeric(4, 3) not null default 1.000,
  provenance public.provenance_type not null,
  extracted_reason_id uuid references public.extracted_reasons (id) on delete set null,
  notes text,
  assigned_by public.author_type not null default 'agent',
  created_at timestamptz not null default now(),
  primary key (deal_id, root_cause_id),
  constraint deal_root_causes_weight_range check (weight > 0 and weight <= 1)
);

create index deal_root_causes_root_cause_idx on public.deal_root_causes (root_cause_id);
create index deal_root_causes_client_idx on public.deal_root_causes (client_id);

-- The client's product roadmap as we know it.
create table public.roadmap_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  external_id text,                      -- id in Jira / Linear / Productboard
  title text not null,
  description text,
  area text,                             -- product area or team
  status public.roadmap_status not null default 'proposed',
  priority integer,                      -- lower = higher priority
  target_quarter text,                   -- e.g. '2026-Q4'
  owner text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index roadmap_items_client_status_idx on public.roadmap_items (client_id, status);

-- Addressability: where does a fix for the root cause sit on the roadmap?
create table public.root_cause_roadmap_links (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  root_cause_id uuid not null references public.root_causes (id) on delete cascade,
  roadmap_item_id uuid not null references public.roadmap_items (id) on delete cascade,
  coverage public.coverage_level not null,
  recommendation public.roadmap_recommendation not null default 'no_change',
  rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (root_cause_id, roadmap_item_id)
);

-- Investment case: cost of closing the gap vs expected uplift.
create table public.investment_cases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  root_cause_id uuid not null references public.root_causes (id) on delete cascade,
  title text not null,
  summary text,
  estimated_cost numeric(14, 2),
  effort_person_weeks numeric(8, 2),
  at_risk_acv numeric(14, 2),            -- lost ACV attributed to this root cause
  expected_annual_uplift numeric(14, 2), -- revenue expected once the gap is closed
  win_rate_uplift_pct numeric(5, 2),
  payback_months numeric(6, 1),
  currency char(3) not null default 'USD',
  confidence public.confidence_level not null default 'medium',
  assumptions text,
  status public.action_status not null default 'proposed',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint investment_cases_cost_non_negative check (estimated_cost is null or estimated_cost >= 0),
  constraint investment_cases_currency_upper check (currency = upper(currency))
);

create index investment_cases_client_status_idx on public.investment_cases (client_id, status);
create index investment_cases_root_cause_idx on public.investment_cases (root_cause_id);

-- Plan of action for closing a gap.
create table public.action_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  root_cause_id uuid not null references public.root_causes (id) on delete cascade,
  investment_case_id uuid references public.investment_cases (id) on delete set null,
  title text not null,
  objective text,
  owner text,
  status public.action_status not null default 'proposed',
  start_date date,
  target_date date,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index action_plans_client_status_idx on public.action_plans (client_id, status);
create index action_plans_root_cause_idx on public.action_plans (root_cause_id);

create table public.action_plan_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  action_plan_id uuid not null references public.action_plans (id) on delete cascade,
  title text not null,
  description text,
  owner text,
  due_date date,
  status public.action_status not null default 'proposed',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index action_plan_items_plan_idx on public.action_plan_items (action_plan_id, sort_order);
