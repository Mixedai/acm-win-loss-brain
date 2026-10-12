-- Migration 4: unstructured inputs and what we extract from them.
-- Sources (transcripts, call recordings, press releases, battlecards) ->
-- extracted reasons (seller vs customer voice) -> competitor claims ->
-- per-deal reconciliation of seller view vs customer view.

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete set null,
  competitor_id uuid references public.competitors (id) on delete set null,
  source_type public.source_type not null,
  title text not null,
  source_date date,
  participants text[] not null default '{}',
  raw_content text,                      -- transcript / notes / release body
  storage_path text,                     -- Supabase Storage object path (audio, pdf)
  url text,                              -- public URL for press releases etc.
  language text not null default 'en',
  metadata jsonb not null default '{}'::jsonb,
  ingestion_status public.ingestion_status not null default 'pending',
  ingestion_error text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sources_has_content check (
    raw_content is not null or storage_path is not null or url is not null
  )
);

create index sources_client_type_idx on public.sources (client_id, source_type);
create index sources_deal_idx on public.sources (deal_id);
create index sources_competitor_idx on public.sources (competitor_id);
create index sources_status_idx on public.sources (ingestion_status) where ingestion_status <> 'processed';

-- A reason-for-decision pulled out of a source, tagged with whose voice it is.
-- Seller notes -> perspective 'seller'. Calls and customer interviews -> 'customer'.
create table public.extracted_reasons (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete set null,
  perspective public.perspective not null,
  provenance public.provenance_type not null,
  loss_reason_id uuid references public.loss_reasons (id) on delete set null,
  verbatim_quote text not null,
  summary text,
  evidence_locator text,                 -- timestamp, page, or line reference inside the source
  confidence public.confidence_level not null default 'medium',
  extracted_by public.author_type not null default 'agent',
  model_name text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index extracted_reasons_deal_perspective_idx on public.extracted_reasons (deal_id, perspective);
create index extracted_reasons_source_idx on public.extracted_reasons (source_id);
create index extracted_reasons_client_reason_idx on public.extracted_reasons (client_id, loss_reason_id);

-- What a competitor says about itself (press releases, their battlecards, website).
-- Always provenance 'competitor_claim' until verified against deals.
create table public.competitor_claims (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  competitor_id uuid not null references public.competitors (id) on delete cascade,
  source_id uuid references public.sources (id) on delete set null,
  claim_type public.claim_type not null default 'other',
  claim_text text not null,
  provenance public.provenance_type not null default 'competitor_claim',
  claimed_at date,
  verification public.claim_verification not null default 'unverified',
  verification_notes text,
  verified_by uuid references public.profiles (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index competitor_claims_competitor_idx on public.competitor_claims (competitor_id, verification);
create index competitor_claims_client_idx on public.competitor_claims (client_id);

-- Deal evidence for or against a competitor claim.
create table public.claim_evidence (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  claim_id uuid not null references public.competitor_claims (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete cascade,
  extracted_reason_id uuid references public.extracted_reasons (id) on delete cascade,
  supports boolean not null,             -- true = supports the claim, false = contradicts it
  notes text,
  created_at timestamptz not null default now(),
  constraint claim_evidence_has_target check (deal_id is not null or extracted_reason_id is not null)
);

create index claim_evidence_claim_idx on public.claim_evidence (claim_id);

-- Reconcile the seller's stated reason with what the customer said. One row per deal.
create table public.deal_reconciliations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  deal_id uuid not null unique references public.deals (id) on delete cascade,
  seller_reason_id uuid references public.loss_reasons (id) on delete set null,
  seller_extracted_reason_id uuid references public.extracted_reasons (id) on delete set null,
  customer_reason_id uuid references public.loss_reasons (id) on delete set null,
  customer_extracted_reason_id uuid references public.extracted_reasons (id) on delete set null,
  verdict public.reconciliation_verdict not null,
  final_reason_id uuid references public.loss_reasons (id) on delete set null,
  rationale text,
  reconciled_by public.author_type not null default 'agent',
  reviewed_by uuid references public.profiles (id) on delete set null,
  reconciled_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index deal_reconciliations_client_verdict_idx on public.deal_reconciliations (client_id, verdict);
create index deal_reconciliations_final_reason_idx on public.deal_reconciliations (final_reason_id);
