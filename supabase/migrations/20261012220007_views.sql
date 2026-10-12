-- Migration 7: analysis views. All use security_invoker so RLS on the
-- underlying tables applies to whoever queries the view.

-- "Why are we losing to Competitor X this quarter?" starts here.
create view public.v_competitor_losses_by_quarter
with (security_invoker = true) as
select
  d.client_id,
  d.winning_competitor_id as competitor_id,
  c.name as competitor_name,
  d.fiscal_quarter,
  d.segment,
  count(*)::integer as lost_deal_count,
  coalesce(sum(d.acv), 0)::numeric(14, 2) as lost_acv,
  avg(d.acv)::numeric(14, 2) as avg_lost_acv
from public.deals d
join public.competitors c on c.id = d.winning_competitor_id
where d.outcome = 'lost'
group by d.client_id, d.winning_competitor_id, c.name, d.fiscal_quarter, d.segment;

-- Seller view vs customer view, side by side, for every lost deal.
create view public.v_reason_reconciliation
with (security_invoker = true) as
select
  d.id as deal_id,
  d.client_id,
  d.name as deal_name,
  d.account_name,
  d.segment,
  d.acv,
  d.currency,
  d.fiscal_quarter,
  d.winning_competitor_id,
  wc.name as winning_competitor_name,
  crm_lr.name as crm_stated_reason,
  d.crm_loss_reason_raw,
  seller_lr.name as seller_reason,
  ser.verbatim_quote as seller_quote,
  cust_lr.name as customer_reason,
  cer.verbatim_quote as customer_quote,
  r.verdict,
  final_lr.name as final_reason,
  r.rationale
from public.deals d
left join public.competitors wc on wc.id = d.winning_competitor_id
left join public.loss_reasons crm_lr on crm_lr.id = d.crm_loss_reason_id
left join public.deal_reconciliations r on r.deal_id = d.id
left join public.loss_reasons seller_lr on seller_lr.id = r.seller_reason_id
left join public.extracted_reasons ser on ser.id = r.seller_extracted_reason_id
left join public.loss_reasons cust_lr on cust_lr.id = r.customer_reason_id
left join public.extracted_reasons cer on cer.id = r.customer_extracted_reason_id
left join public.loss_reasons final_lr on final_lr.id = r.final_reason_id
where d.outcome = 'lost';

-- Prioritisation: which root causes cost the most deals and the most ACV,
-- broken down by quarter and by the competitor that won.
create view public.v_root_cause_priority
with (security_invoker = true) as
select
  rc.client_id,
  rc.id as root_cause_id,
  rc.name as root_cause_name,
  d.fiscal_quarter,
  d.winning_competitor_id as competitor_id,
  wc.name as competitor_name,
  count(distinct d.id)::integer as deal_count,
  coalesce(sum(d.acv), 0)::numeric(14, 2) as lost_acv,
  coalesce(sum(d.acv * drc.weight), 0)::numeric(14, 2) as weighted_lost_acv
from public.root_causes rc
join public.deal_root_causes drc on drc.root_cause_id = rc.id
join public.deals d on d.id = drc.deal_id and d.outcome = 'lost'
left join public.competitors wc on wc.id = d.winning_competitor_id
where rc.is_active
group by rc.client_id, rc.id, rc.name, d.fiscal_quarter, d.winning_competitor_id, wc.name;

-- Addressability: is each root cause covered by something already on the roadmap?
create view public.v_root_cause_addressability
with (security_invoker = true) as
select
  rc.client_id,
  rc.id as root_cause_id,
  rc.name as root_cause_name,
  count(l.id)::integer as linked_roadmap_items,
  max(l.coverage) as best_coverage,
  coalesce(bool_or(ri.status in ('planned', 'in_progress', 'shipped')), false) as on_roadmap,
  min(ri.target_quarter) filter (where ri.status in ('planned', 'in_progress')) as earliest_target_quarter,
  string_agg(distinct l.recommendation::text, ', ') as recommendations
from public.root_causes rc
left join public.root_cause_roadmap_links l on l.root_cause_id = rc.id
left join public.roadmap_items ri on ri.id = l.roadmap_item_id
where rc.is_active
group by rc.client_id, rc.id, rc.name;

-- Investment case and plan, next to the loss evidence they are meant to fix.
create view public.v_gap_closure_overview
with (security_invoker = true) as
with losses as (
  select
    drc.root_cause_id,
    count(distinct d.id)::integer as deal_count,
    coalesce(sum(d.acv * drc.weight), 0)::numeric(14, 2) as weighted_lost_acv
  from public.deal_root_causes drc
  join public.deals d on d.id = drc.deal_id and d.outcome = 'lost'
  group by drc.root_cause_id
),
latest_case as (
  select distinct on (ic.root_cause_id)
    ic.root_cause_id, ic.id, ic.title, ic.estimated_cost, ic.expected_annual_uplift,
    ic.payback_months, ic.confidence, ic.status
  from public.investment_cases ic
  order by ic.root_cause_id, ic.created_at desc
),
plans as (
  select
    ap.root_cause_id,
    count(*)::integer as plan_count,
    count(*) filter (where ap.status in ('approved', 'in_progress'))::integer as active_plan_count,
    count(*) filter (where ap.status = 'done')::integer as done_plan_count
  from public.action_plans ap
  group by ap.root_cause_id
)
select
  rc.client_id,
  rc.id as root_cause_id,
  rc.name as root_cause_name,
  coalesce(lo.deal_count, 0) as lost_deal_count,
  coalesce(lo.weighted_lost_acv, 0) as weighted_lost_acv,
  lc.id as investment_case_id,
  lc.title as investment_case_title,
  lc.estimated_cost,
  lc.expected_annual_uplift,
  lc.payback_months,
  lc.confidence as investment_confidence,
  lc.status as investment_status,
  coalesce(p.plan_count, 0) as plan_count,
  coalesce(p.active_plan_count, 0) as active_plan_count,
  coalesce(p.done_plan_count, 0) as done_plan_count
from public.root_causes rc
left join losses lo on lo.root_cause_id = rc.id
left join latest_case lc on lc.root_cause_id = rc.id
left join plans p on p.root_cause_id = rc.id
where rc.is_active;

-- How competitor marketing holds up against deal evidence.
create view public.v_competitor_claim_scorecard
with (security_invoker = true) as
select
  cc.client_id,
  cc.competitor_id,
  c.name as competitor_name,
  cc.claim_type,
  count(*)::integer as total_claims,
  count(*) filter (where cc.verification = 'supported')::integer as supported,
  count(*) filter (where cc.verification = 'contradicted')::integer as contradicted,
  count(*) filter (where cc.verification = 'mixed')::integer as mixed,
  count(*) filter (where cc.verification = 'unverified')::integer as unverified
from public.competitor_claims cc
join public.competitors c on c.id = cc.competitor_id
group by cc.client_id, cc.competitor_id, c.name, cc.claim_type;

-- Provenance mix of a battlecard: how much is hard deal evidence vs competitor claims.
create view public.v_battlecard_provenance_mix
with (security_invoker = true) as
select
  b.client_id,
  b.id as battlecard_id,
  b.competitor_id,
  b.version,
  b.status,
  s.provenance,
  count(*)::integer as statement_count
from public.battlecards b
join public.battlecard_sections bs on bs.battlecard_id = b.id
join public.battlecard_statements s on s.section_id = bs.id
group by b.client_id, b.id, b.competitor_id, b.version, b.status, s.provenance;
