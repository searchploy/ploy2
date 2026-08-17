-- Add stripe_invoices table for tracking invoices from Stripe

create table stripe_invoices (
  id uuid primary key default gen_random_uuid(),
  stripe_invoice_id text not null unique,
  profile_id uuid not null references profiles(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete set null,
  amount_cents integer not null,
  amount_paid_cents integer default 0,
  currency text default 'usd',
  status text not null, -- 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
  invoice_date timestamptz,
  due_date timestamptz,
  paid_at timestamptz,
  pdf_url text,
  hosted_invoice_url text,
  description text,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for fast lookups
create index idx_stripe_invoices_profile_id on stripe_invoices(profile_id);
create index idx_stripe_invoices_stripe_id on stripe_invoices(stripe_invoice_id);
create index idx_stripe_invoices_subscription_id on stripe_invoices(subscription_id);
create index idx_stripe_invoices_status on stripe_invoices(status);
create index idx_stripe_invoices_created_at on stripe_invoices(created_at desc);

-- RLS Policy: Users can only see their own invoices
alter table stripe_invoices enable row level security;

create policy "Users can view their own invoices"
  on stripe_invoices for select
  using (profile_id = auth.uid());

create policy "Service can insert invoices for users"
  on stripe_invoices for insert
  with check (true);

create policy "Service can update invoices"
  on stripe_invoices for update
  using (true);
