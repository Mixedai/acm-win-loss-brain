# Win/Loss Intelligence Brain – Database

Supabase (Postgres) schema for answering "Why are we losing to Competitor X this quarter?"
across the AI SaaS client companies we analyse.

## Built by

- [Mustafa Kurtulus (@Mixedai)](https://github.com/Mixedai)
- [@RuntimeSquad](https://github.com/RuntimeSquad)
- [@8of12](https://github.com/8of12)

Developed with Claude Code as a pair programmer.

## Layout

```
supabase/
  config.toml
  seed.sql                      shared loss-reason taxonomy (8 categories, 28 reasons)
  migrations/
    ..._extensions_and_enums    enum types incl. provenance_type (the hook)
    ..._tenancy_and_access      clients, profiles, client_access, competitors
    ..._crm_deals               loss_reasons taxonomy, deals, deal_competitors
    ..._sources_and_extraction  sources, extracted_reasons, competitor_claims,
                                claim_evidence, deal_reconciliations
    ..._root_causes_and_planning root_causes, deal_root_causes, roadmap_items,
                                root_cause_roadmap_links, investment_cases,
                                action_plans, action_plan_items
    ..._battlecards_and_runs    analysis_runs, battlecards, battlecard_sections,
                                battlecard_statements, battlecard_statement_evidence
    ..._views                   analysis views (see below)
    ..._rls_policies            RLS helpers and policies on every table
    ..._companies_catalog       companies (ACM + market catalog), company_traits
                                (strengths/weaknesses), first user becomes admin
  seeds/companies.sql           ACM + 50 fictional AI SaaS companies with traits
```

## How the pipeline maps to tables

| Step | Tables |
|------|--------|
| Structured inputs (CRM) | `deals`, `deal_competitors`, `loss_reasons` |
| Unstructured inputs | `sources` (transcripts, calls, press releases, battlecards) |
| Reconcile seller vs customer | `extracted_reasons` (perspective + provenance), `deal_reconciliations` |
| Competitor claims vs reality | `competitor_claims`, `claim_evidence` |
| Root cause | `root_causes`, `root_cause_loss_reasons`, `deal_root_causes` (weighted) |
| Prioritisation | view `v_root_cause_priority` (deal count, lost ACV per quarter and competitor) |
| Addressability | `roadmap_items`, `root_cause_roadmap_links`, view `v_root_cause_addressability` |
| Investment case | `investment_cases`, view `v_gap_closure_overview` |
| Plan | `action_plans`, `action_plan_items` |
| Company catalog | `companies` (ACM flagged `is_own_company`), `company_traits` (strength / weakness with provenance) |
| Agent output | `analysis_runs`, `battlecards`, `battlecard_sections`, `battlecard_statements` |

Every battlecard statement, extracted reason and root-cause attribution carries a
`provenance_type`: `crm_outcome`, `customer_stated`, `seller_stated`, `competitor_claim`,
`third_party` or `internal_hypothesis`. `v_battlecard_provenance_mix` shows how much of a
battlecard rests on deal evidence versus competitor marketing.

## Views

- `v_competitor_losses_by_quarter` – lost deals and ACV per competitor, quarter, segment
- `v_reason_reconciliation` – CRM reason, seller quote, customer quote and verdict per lost deal
- `v_root_cause_priority` – root causes ranked by deal count and (weighted) lost ACV
- `v_root_cause_addressability` – roadmap coverage per root cause
- `v_gap_closure_overview` – losses, latest investment case and plan status per root cause
- `v_competitor_claim_scorecard` – supported / contradicted / unverified claims per competitor
- `v_battlecard_provenance_mix` – statements per provenance type per battlecard

## Access model

- `profiles.role`: `admin` (all clients, manages taxonomy and access), `analyst`
  (read/write on assigned clients), `viewer` (read-only on assigned clients).
- Assign clients to users through `client_access`. Admins need no rows there.
- A profile is created automatically on sign-up. Only admins can change roles.

## Applying

Local (needs Docker):

```sh
supabase start
supabase db reset
```

Hosted project:

```sh
supabase login
supabase link --project-ref <ref>
supabase db push
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
supabase gen types typescript --linked > src/types/database.ts
```

## Reporting agent

`/reports` runs the Win/Loss Intelligence Brain for one client, competitor and quarter.
The agent (`web/src/lib/reporting/`) gathers deals, reconciliation verdicts, root causes,
roadmap coverage, investment cases and competitor claims from Supabase, asks Claude
(`claude-opus-5-5`, structured output validated with zod) for a report, and saves the
result as an `analysis_runs` row plus a new battlecard version with provenance-labelled
statements and deal evidence links.

Requires `ANTHROPIC_API_KEY` (server-only) and write access to `analysis_runs`,
`battlecards`, `battlecard_sections`, `battlecard_statements`, `battlecard_statement_evidence`.
