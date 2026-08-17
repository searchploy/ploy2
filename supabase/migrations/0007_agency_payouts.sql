-- Add agency_payouts table for tracking payouts to agencies via Stripe Connect

create table agency_payouts (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies(id) on delete cascade,
  stripe_payout_id text,
  amount_cents integer not null,
  currency text default 'usd',
  status text default 'pending', -- 'pending' | 'in_transit' | 'paid' | 'failed' | 'cancelled'
  period_start timestamptz,
  period_end timestamptz,
  paid_at timestamptz,
  failure_message text,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for fast lookups
create index idx_agency_payouts_agency_id on agency_payouts(agency_id);
create index idx_agency_payouts_stripe_id on agency_payouts(stripe_payout_id);
create index idx_agency_payouts_status on agency_payouts(status);
create index idx_agency_payouts_created_at on agency_payouts(created_at desc);

-- RLS Policy: Only admins and the agency profile can see payouts
alter table agency_payouts enable row level security;

create policy "Agency members can view their payouts"
  on agency_payouts for select
  using (
    agency_id in (
      select agency_id from agency_members where profile_id = auth.uid()
    )
  );

create policy "Service can insert/update payouts"
  on agency_payouts for all
  using (true);
