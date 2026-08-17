-- Add stripe_payment_methods table for managing customer payment methods

create table stripe_payment_methods (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  stripe_payment_method_id text not null unique,
  type text not null, -- 'card' | 'bank_account'
  brand text, -- 'visa', 'mastercard', 'amex', etc (card only)
  last_4_digits text,
  exp_month integer, -- card only
  exp_year integer, -- card only
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for fast lookups
create index idx_stripe_payment_methods_profile_id on stripe_payment_methods(profile_id);
create index idx_stripe_payment_methods_stripe_id on stripe_payment_methods(stripe_payment_method_id);

-- RLS Policy: Users can only see their own payment methods
alter table stripe_payment_methods enable row level security;

create policy "Users can view their own payment methods"
  on stripe_payment_methods for select
  using (profile_id = auth.uid());

create policy "Users can insert their own payment methods"
  on stripe_payment_methods for insert
  with check (profile_id = auth.uid());

create policy "Users can update their own payment methods"
  on stripe_payment_methods for update
  using (profile_id = auth.uid());

create policy "Users can delete their own payment methods"
  on stripe_payment_methods for delete
  using (profile_id = auth.uid());
