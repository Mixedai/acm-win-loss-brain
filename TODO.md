# ACM Win/Loss Brain – build status

## Database
- [x] Schema (8 migrations) pushed to Supabase project win-loss-brain (qjdmnufyqaankeouqemc)
- [x] Loss-reason taxonomy seeded
- [x] Migration 9: companies catalog + company_traits (strengths/weaknesses), first user auto-admin
- [x] Seed ACM + 50 AI SaaS companies with strengths/weaknesses
- [x] Push migration 9 and seed to hosted project
- [x] Regenerate web/src/types/database.ts

## Frontend (web/, Next.js App Router + Tailwind + Supabase)
- [x] Scaffold app, Supabase clients, auth (login/signup), protected layout, sidebar
- [x] Dashboard home: KPIs + charts (losses by competitor/quarter, root-cause priority)
- [x] Companies page: catalog + strengths/weaknesses
- [x] Deals page: list + reconciliation view
- [x] Battlecards page: list + detail with provenance labels
- [x] npm run build passes

## Open
- [x] Deals detail page (/deals/[id])
- [x] Deployed to Vercel: https://acm-win-loss-brain.vercel.app (project acm-win-loss-brain, root web/)
- [ ] Import real CRM deals for the first client

## 2026-10-12 delivery state
- [x] Auth removed from the web app (proxy is pass-through, layout has no user check); login page files still exist but are unused
- [x] Anonymous read policies applied by hand in the Supabase SQL editor (not yet in a migration file; classifier blocked writing it)
- [x] Demo dataset loaded: supabase/seeds/demo_data.sql (5 clients, 150 deals, battlecards, root causes)
- [ ] Add the anon-read policies as migration 10 so `supabase db reset` reproduces production
- [ ] Delete web/src/app/login and web/src/lib/auth if login stays removed

## Reporting agent (added 2026-10-12)
- [x] web/src/lib/reporting: context (data gathering), agent (Claude Opus 5.5 structured output), persist (run + battlecard version)
- [x] POST /api/reports, /reports page with runner form and run history, sidebar entry
- [ ] Add ANTHROPIC_API_KEY to web/.env.local and Vercel (user)
- [ ] Allow the agent to write analysis_runs / battlecards* tables (anon insert/update policies; run SQL in Supabase SQL editor)
- [ ] End-to-end run not yet verified (no API key on this machine)
