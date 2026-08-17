-- Add stripe_charges table for tracking one-time payments

create table stripe_charges (
  id uuid primary key default gen_random_uuid(),
  stripe_charge_id text not null unique,
  profile_id uuid not null references profiles(id) on delete cascade,
  amount_cents integer not null,
  currency text default 'usd',
  description text,
  receipt_email text,
  paid boolean default false,
  refunded boolean default false,
  refunded_amount_cents integer default 0,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for fast lookups
create index idx_stripe_charges_profile_id on stripe_charges(profile_id);
create index idx_stripe_charges_stripe_id on stripe_charges(stripe_charge_id);
create index idx_stripe_charges_paid on stripe_charges(paid);
create index idx_stripe_charges_created_at on stripe_charges(created_at desc);

-- RLS Policy: Users can only see their own charges
alter table stripe_charges enable row level security;

create policy "Users can view their own charges"
  on stripe_charges for select
  using (profile_id = auth.uid());

create policy "Service can insert charges for users"
  on stripe_charges for insert
  with check (true);

create policy "Service can update charges"
  on stripe_charges for update
  using (true);
