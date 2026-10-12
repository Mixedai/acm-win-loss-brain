-- Migration 2: tenancy (the 5 AI SaaS client companies we analyse), internal users,
-- per-client access, competitors, and shared helper functions.

-- Generic updated_at maintenance, attached to every table that has the column.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Calendar quarter label, e.g. '2026-Q3'. Immutable so it can back a generated column.
create or replace function public.fiscal_quarter(d date)
returns text
language sql
immutable
as $$
  select case
    when d is null then null
    else extract(year from d)::int::text || '-Q' || extract(quarter from d)::int::text
  end;
$$;

-- The AI SaaS companies we do win/loss analysis for. One row per client company.
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  website text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on table public.clients is
  'AI SaaS companies we run win/loss intelligence for. Every client-scoped table carries client_id.';

-- Internal users (analysts at our company). Mirrors auth.users.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'analyst',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Which analysts may see which client company. Admins see everything.
create table public.client_access (
  user_id uuid not null references public.profiles (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, client_id)
);

-- Competitors of a client ("Competitor X"). Scoped per client because each
-- client company has its own competitive set.
create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  slug text not null,
  website text,
  description text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, slug),
  constraint competitors_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index competitors_client_id_idx on public.competitors (client_id);
