-- What a consultant has actually set up for a client: which AI employee, from
-- which vendor, what the vendor charges, and what the consultant charges on
-- top. The consultant buys the subscription on the vendor's own site — Ploy
-- does not broker it — so this table is a record of that arrangement, not a
-- billing integration.
--
-- Three money columns, kept separate on purpose:
--   vendor_cost_cents  what the vendor bills each month (pass-through)
--   setup_fee_cents    one-time, what the consultant charged to implement
--   monthly_fee_cents  recurring, what the consultant charges to manage it
-- Margin is monthly_fee_cents, not monthly_fee_cents - vendor_cost_cents:
-- whether the client or the consultant pays the vendor is up to them, so the
-- dashboard reports the two totals side by side rather than netting them.
create table if not exists public.consultant_client_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.consultant_clients(id) on delete cascade,
  employee_name text not null,
  vendor_name text,
  vendor_url text,
  vendor_cost_cents integer,
  setup_fee_cents integer,
  monthly_fee_cents integer,
  status text default 'Active',
  notes text,
  started_on date,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.consultant_client_subscriptions enable row level security;

-- Same shape as consultant_clients: a consultant sees only their own rows.
-- client_id is additionally constrained on write so a row cannot be attached
-- to someone else's client by passing a foreign id.
create policy "Users can view their own client subscriptions"
  on public.consultant_client_subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own client subscriptions"
  on public.consultant_client_subscriptions
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.consultant_clients c
      where c.id = client_id and c.user_id = auth.uid()
    )
  );

create policy "Users can update their own client subscriptions"
  on public.consultant_client_subscriptions
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.consultant_clients c
      where c.id = client_id and c.user_id = auth.uid()
    )
  );

create policy "Users can delete their own client subscriptions"
  on public.consultant_client_subscriptions
  for delete
  using (auth.uid() = user_id);

create index if not exists consultant_client_subscriptions_user_id_idx
  on public.consultant_client_subscriptions(user_id);
create index if not exists consultant_client_subscriptions_client_id_idx
  on public.consultant_client_subscriptions(client_id);

comment on table public.consultant_client_subscriptions is
  'AI employee subscriptions a consultant has set up for a client. A record of an arrangement made on the vendor''s own site — Ploy does not process these payments.';
comment on column public.consultant_client_subscriptions.vendor_cost_cents is
  'What the AI employee vendor bills per month, in cents. Pass-through cost, not consultant revenue.';
comment on column public.consultant_client_subscriptions.monthly_fee_cents is
  'What the consultant bills the client per month to manage this subscription, in cents. Drives Monthly Recurring on the consultant dashboard.';
