-- Win/Loss Intelligence Brain
-- Migration 1: extensions and enum types shared by every later migration.

create extension if not exists "pgcrypto" with schema extensions;

-- Who a person is inside the tool (internal analysts at our company).
create type public.user_role as enum ('admin', 'analyst', 'viewer');

-- Where a client company sells. Mirrors the CRM "segment" field.
create type public.deal_segment as enum ('smb', 'mid_market', 'enterprise');

-- CRM close stage / outcome.
create type public.deal_outcome as enum ('open', 'won', 'lost', 'no_decision');

-- Role a competitor played in a specific deal.
create type public.competitor_role as enum ('incumbent', 'evaluated', 'winner');

-- Unstructured and structured input types that feed the brain.
create type public.source_type as enum (
  'crm_export',
  'seller_notes',
  'seller_interview',
  'sales_call_recording',
  'customer_interview',
  'win_loss_interview',
  'competitor_press_release',
  'competitor_battlecard',
  'competitor_website',
  'analyst_report',
  'other'
);

create type public.ingestion_status as enum ('pending', 'processed', 'failed');

-- Whose voice a statement represents.
create type public.perspective as enum ('seller', 'customer', 'competitor', 'analyst', 'internal');

-- THE HOOK: provenance labels. Every claim, reason and battlecard line carries one,
-- so competitor marketing never gets mixed up with what deal outcomes actually show.
create type public.provenance_type as enum (
  'crm_outcome',          -- derived from closed deal data (hard evidence)
  'customer_stated',      -- the prospect/customer said it (interview, call)
  'seller_stated',        -- our client's seller said it (notes, CRM reason)
  'competitor_claim',     -- competitor press release / battlecard / website
  'third_party',          -- analyst report, review site
  'internal_hypothesis'   -- analyst or agent inference, not yet evidenced
);

-- Did seller view and customer view of a lost deal agree?
create type public.reconciliation_verdict as enum (
  'aligned',
  'partially_aligned',
  'conflicting',
  'insufficient_data'
);

-- Verification of a competitor claim against deal outcomes.
create type public.claim_verification as enum ('unverified', 'supported', 'contradicted', 'mixed');

create type public.claim_type as enum (
  'feature',
  'pricing',
  'performance',
  'customer_logo',
  'integration',
  'security_compliance',
  'partnership',
  'funding',
  'other'
);

create type public.roadmap_status as enum (
  'not_planned',
  'proposed',
  'planned',
  'in_progress',
  'shipped',
  'cancelled'
);

-- How much of a root cause an existing roadmap item addresses.
create type public.coverage_level as enum ('none', 'partial', 'full');

create type public.roadmap_recommendation as enum ('no_change', 'reprioritize', 'add', 'descope');

create type public.confidence_level as enum ('low', 'medium', 'high');

create type public.action_status as enum ('proposed', 'approved', 'in_progress', 'done', 'dropped');

create type public.battlecard_status as enum ('draft', 'in_review', 'published', 'archived');

create type public.battlecard_section_type as enum (
  'overview',
  'competitor_claims',
  'what_deals_show',
  'why_we_win',
  'why_we_lose',
  'root_causes',
  'objection_handling',
  'landmines',
  'pricing_positioning',
  'recommended_plays'
);

create type public.analysis_run_status as enum ('queued', 'running', 'completed', 'failed');

create type public.author_type as enum ('human', 'agent');
