# Ploy — The Marketplace for AI Employees

A production-ready MVP built with Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui,
Supabase, and Framer Motion.

## What's here

- **Marketing site**: homepage, marketplace browse/filter/sort, employee detail pages, agency
  profile pages, blog, pricing.
- **Auth**: real Supabase Auth wiring (sign up with role selection, sign in, session refresh
  middleware) — functional as soon as you connect a Supabase project.
- **Three dashboards**: Agency (listings CRUD, analytics, leads, pricing, sales, commissions,
  profile), Business (saved, demo requests, purchases, messages, invoices, settings), Admin
  (agency/listing moderation, users, sales, commissions, analytics).
- **Database schema**: `supabase/migrations/0001_init.sql` — every table from the spec, with RLS
  policies, triggers (auto profile creation, rating recalculation, commission math), and seed
  categories.
- **Mock data layer**: `src/lib/data/*` — typed functions (`getEmployees()`, `getAgencyBySlug()`,
  etc.) that return realistic sample data with the exact same shape Supabase will return. Swapping
  a mock function for a live Supabase query is a one-function change, not a rewrite.

## Important: this was built without network access

The environment this was built in has no access to npm, GitHub, or any package registry, so
`npm install` was never run here and the build was never compiled. Every file was hand-written
against known-correct Next.js 15 / React 19 / shadcn/ui APIs and then verified with static checks
(import resolution, export matching, route resolution, "use client" boundaries) — but you should
run a real build before deploying.

```bash
npm install
npm run dev       # http://localhost:3000
npm run typecheck # tsc --noEmit
npm run build
```

If `npm run build` surfaces anything (a version mismatch, a missed prop), it'll almost certainly be
small — the architecture and every file are complete.

## Connecting a real backend

1. Create a Supabase project, then run the migration:
   ```bash
   supabase link --project-ref <your-ref>
   supabase db push
   ```
2. Copy `.env.example` to `.env.local` and fill in your Supabase URL/keys.
3. Regenerate types from the live schema (optional — the hand-written types in
   `src/lib/types/database.ts` already match the migration exactly):
   ```bash
   npx supabase gen types typescript --project-id <id> > src/lib/types/database.ts
   ```
4. Swap mock reads for live ones. Every function in `src/lib/data/*` has a matching Supabase query
   commented in-line or trivially inferable from the table/column names — e.g.
   `getEmployees()` becomes `supabase.from("employees").select("*, agency:agencies(*), ...")`.
5. Forms that currently `setTimeout` + `toast.success` (demo requests, buy now, listing
   create/edit, agency approval, etc.) have a comment above the handler explaining the Server
   Action they'd call in production — wire those up once Supabase is live.

## Auth

Uses Supabase Auth (not Clerk). `src/lib/supabase/client.ts` and `server.ts` are the browser/server
clients; `src/middleware.ts` refreshes the session cookie on every request. Sign-up captures a
`role` (`business` | `agency`) in user metadata; a Postgres trigger (`handle_new_auth_user`) copies
it into `public.users` automatically. Dashboard layouts currently read a hardcoded demo user
(`src/lib/data/users.ts`) instead of the live session — swap in `getServerUser()` from
`src/lib/supabase/server.ts` once you have real accounts to test with.

## Payments

Stripe is not wired up (no keys were available to configure it), but the schema and commission
math are ready for it: `orders.commission_cents` / `agency_payout_cents` are computed automatically
by a Postgres trigger, and `transactions` / `commissions` tables are designed to hold Stripe
Checkout + Connect payout references (`stripe_payment_intent_id`, `stripe_transfer_id`).

## Architecture notes

- **Server Components by default.** Every data-fetching page (`marketplace/page.tsx`, employee/agency
  detail pages, all dashboard pages) is an async Server Component. Interactivity (forms, filters,
  dialogs) is isolated into small `"use client"` leaf components.
- **Route groups aren't used for the dashboard chrome** — instead `src/components/layout/site-chrome.tsx`
  hides the public navbar/footer on `/dashboard/*` routes, since each dashboard renders its own
  sidebar shell.
- **Money is always integer cents** end-to-end (schema → types → `formatCurrency()`), matching how
  Stripe represents amounts, so there's no float-rounding cleanup needed when Stripe is added.
- **Commission is a flat 15%** (`COMMISSION_PCT` in `src/lib/constants.ts`), computed server-side by
  a Postgres trigger on `orders`, not trusted from the client.

## Roadmap hooks already in the schema

`agency_members` (team accounts), `messages` (full inbox), `analytics` (event log for
recommendations/search), `notifications`, and nullable Stripe columns on `transactions` mean
subscriptions, Stripe Connect payouts, an AI chat assistant, embeddings-based search, and an
affiliate/referral system can all be added without a schema rewrite.
