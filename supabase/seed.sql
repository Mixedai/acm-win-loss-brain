-- Seed: shared loss-reason taxonomy used across all client companies.
-- Client companies, competitors and deals are real data and are loaded
-- through the app or CRM import, not seeded here.

insert into public.loss_reason_categories (slug, name, description, sort_order) values
  ('product_gap',        'Product gap',          'Missing or weaker capability versus the competitor.', 10),
  ('pricing_commercial', 'Pricing & commercial', 'Price level, pricing model or contract terms.', 20),
  ('trust_risk',         'Trust & risk',         'Security, compliance, vendor viability, brand.', 30),
  ('sales_execution',    'Sales execution',      'How the deal was run by our client''s sales team.', 40),
  ('timing_budget',      'Timing & budget',      'Budget, priorities or timing on the buyer side.', 50),
  ('incumbent_lock_in',  'Incumbent lock-in',    'Switching cost or existing relationship with the incumbent.', 60),
  ('services_support',   'Services & support',   'Implementation, onboarding and customer success.', 70),
  ('no_decision',        'No decision',          'Buyer stayed with the status quo.', 80)
on conflict (slug) do nothing;

insert into public.loss_reasons (category_id, slug, name, description)
select c.id, r.slug, r.name, r.description
from (values
  ('product_gap',        'missing_feature',          'Missing feature',            'A required capability does not exist in the product.'),
  ('product_gap',        'ai_model_quality',         'AI model quality',           'Output quality, accuracy or hallucination concerns.'),
  ('product_gap',        'usability',                'Usability',                  'Harder to use or adopt than the competitor.'),
  ('product_gap',        'performance_scale',        'Performance & scale',        'Latency, throughput or scale limits.'),
  ('product_gap',        'integration_gap',          'Integration gap',            'Missing integration with the buyer''s stack.'),
  ('product_gap',        'platform_breadth',         'Platform breadth',           'Competitor offers a broader suite or platform.'),
  ('pricing_commercial', 'price_too_high',           'Price too high',             'Total cost exceeded what the buyer would pay.'),
  ('pricing_commercial', 'pricing_model_mismatch',   'Pricing model mismatch',     'Seat, usage or token pricing did not fit the buyer.'),
  ('pricing_commercial', 'contract_terms',           'Contract terms',             'Term length, commitments or legal terms.'),
  ('pricing_commercial', 'competitor_discount',      'Competitor discount',        'Competitor won on an aggressive discount or bundle.'),
  ('trust_risk',         'security_compliance',      'Security & compliance',      'SOC 2, data residency, model training on customer data.'),
  ('trust_risk',         'vendor_viability',         'Vendor viability',           'Concerns about company size, funding or longevity.'),
  ('trust_risk',         'brand_awareness',          'Brand awareness',            'Buyer had not heard of us or preferred a known brand.'),
  ('trust_risk',         'references_proof',         'References & proof',         'Lack of case studies or references in the buyer''s segment.'),
  ('sales_execution',    'poor_discovery',           'Poor discovery',             'Needs were not understood or qualified.'),
  ('sales_execution',    'slow_response',            'Slow response',              'Follow-up and responsiveness lagged the competitor.'),
  ('sales_execution',    'wrong_champion',           'Wrong champion',             'No access to the economic buyer or decision maker.'),
  ('sales_execution',    'poc_execution',            'POC execution',              'Pilot or proof of concept did not land.'),
  ('sales_execution',    'relationship',             'Relationship',               'Competitor had a stronger relationship with the buyer.'),
  ('timing_budget',      'no_budget',                'No budget',                  'Budget was cut or never existed.'),
  ('timing_budget',      'project_deprioritized',    'Project deprioritised',      'Initiative lost priority inside the buyer.'),
  ('timing_budget',      'timing',                   'Timing',                     'Wrong moment in the buyer''s planning cycle.'),
  ('incumbent_lock_in',  'switching_cost',           'Switching cost',             'Migration effort or data lock-in was too high.'),
  ('incumbent_lock_in',  'existing_relationship',    'Existing relationship',      'Incumbent vendor relationship was kept.'),
  ('incumbent_lock_in',  'bundled_deal',             'Bundled deal',               'Incumbent bundled the capability into a wider contract.'),
  ('services_support',   'implementation_support',   'Implementation support',     'Concerns about rollout help and professional services.'),
  ('services_support',   'customer_success',         'Customer success',           'Ongoing support and success model fell short.'),
  ('no_decision',        'status_quo',               'Status quo',                 'Buyer made no change at all.')
) as r (category_slug, slug, name, description)
join public.loss_reason_categories c on c.slug = r.category_slug
on conflict (slug) do nothing;
