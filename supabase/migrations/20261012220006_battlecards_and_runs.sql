-- Migration 6: agent analysis runs and the battlecard output, where every
-- statement carries a provenance label and links back to its evidence.

-- One run of the brain, e.g. "Why are we losing to Competitor X this quarter?"
create table public.analysis_runs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  competitor_id uuid references public.competitors (id) on delete set null,
  question text not null,
  period_start date,
  period_end date,
  fiscal_quarter text,
  status public.analysis_run_status not null default 'queued',
  model_name text,
  input_summary jsonb not null default '{}'::jsonb,   -- counts of deals/sources used
  output_summary jsonb not null default '{}'::jsonb,  -- headline findings
  error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint analysis_runs_period_order check (
    period_start is null or period_end is null or period_start <= period_end
  )
);

create index analysis_runs_client_status_idx on public.analysis_runs (client_id, status, created_at desc);
create index analysis_runs_competitor_idx on public.analysis_runs (competitor_id);

-- Versioned battlecard per client x competitor.
create table public.battlecards (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  competitor_id uuid not null references public.competitors (id) on delete cascade,
  analysis_run_id uuid references public.analysis_runs (id) on delete set null,
  version integer not null default 1,
  title text not null,
  summary text,
  status public.battlecard_status not null default 'draft',
  author_type public.author_type not null default 'agent',
  created_by uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, competitor_id, version),
  constraint battlecards_version_positive check (version > 0),
  constraint battlecards_published_has_date check (status <> 'published' or published_at is not null)
);

create index battlecards_competitor_status_idx on public.battlecards (competitor_id, status);

-- A run can point at the battlecard it produced.
alter table public.analysis_runs
  add column output_battlecard_id uuid references public.battlecards (id) on delete set null;

create table public.battlecard_sections (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  battlecard_id uuid not null references public.battlecards (id) on delete cascade,
  section_type public.battlecard_section_type not null,
  heading text not null,
  body text,                             -- markdown narrative for the section
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (battlecard_id, section_type)
);

create index battlecard_sections_battlecard_idx on public.battlecard_sections (battlecard_id, sort_order);

-- Individual statements inside a section. Provenance is mandatory: this is what
-- keeps "they claim 10x faster" apart from "we lost 7 deals on price".
create table public.battlecard_statements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  section_id uuid not null references public.battlecard_sections (id) on delete cascade,
  statement text not null,
  provenance public.provenance_type not null,
  confidence public.confidence_level not null default 'medium',
  deal_count integer,                    -- deals backing this statement, when crm_outcome
  acv_total numeric(14, 2),              -- ACV backing this statement, when crm_outcome
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index battlecard_statements_section_idx on public.battlecard_statements (section_id, sort_order);
create index battlecard_statements_provenance_idx on public.battlecard_statements (client_id, provenance);

-- Evidence trail from a statement back to the deal, quote, claim or source.
create table public.battlecard_statement_evidence (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  statement_id uuid not null references public.battlecard_statements (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete cascade,
  extracted_reason_id uuid references public.extracted_reasons (id) on delete cascade,
  competitor_claim_id uuid references public.competitor_claims (id) on delete cascade,
  source_id uuid references public.sources (id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  constraint battlecard_statement_evidence_has_target check (
    deal_id is not null
    or extracted_reason_id is not null
    or competitor_claim_id is not null
    or source_id is not null
  )
);

create index battlecard_statement_evidence_statement_idx on public.battlecard_statement_evidence (statement_id);

-- Attach the updated_at trigger to every public table that has the column.
do $$
declare
  t record;
begin
  for t in
    select c.table_name
    from information_schema.columns c
    join information_schema.tables tb
      on tb.table_schema = c.table_schema and tb.table_name = c.table_name
    where c.table_schema = 'public'
      and c.column_name = 'updated_at'
      and tb.table_type = 'BASE TABLE'
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t.table_name
    );
  end loop;
end;
$$;
