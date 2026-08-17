-- Business pay-per-report pricing model
-- Businesses pay $39 per AI report instead of subscription

create table report_purchases (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  stripe_charge_id text unique,
  stripe_payment_intent_id text unique,
  amount_cents integer not null default 3900, -- $39.00
  currency text default 'usd',
  status text not null default 'pending', -- 'pending' | 'succeeded' | 'failed' | 'refunded'
  paid_at timestamptz,
  refunded_at timestamptz,
  refund_reason text,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for fast lookups
create index idx_report_purchases_report_id on report_purchases(report_id);
create index idx_report_purchases_profile_id on report_purchases(profile_id);
create index idx_report_purchases_stripe_charge_id on report_purchases(stripe_charge_id);
create index idx_report_purchases_status on report_purchases(status);
create index idx_report_purchases_created_at on report_purchases(created_at desc);

-- RLS Policy: Users can only see their own purchases
alter table report_purchases enable row level security;

create policy "Users can view their own report purchases"
  on report_purchases for select
  using (profile_id = auth.uid());

create policy "Service can insert report purchases"
  on report_purchases for insert
  with check (true);

create policy "Service can update report purchases"
  on report_purchases for update
  using (true);

-- Update reports table to track if it's been paid for
alter table reports add column is_paid boolean default false;
alter table reports add column purchased_at timestamptz;

create index idx_reports_is_paid on reports(is_paid);
create index idx_reports_purchased_at on reports(purchased_at);
