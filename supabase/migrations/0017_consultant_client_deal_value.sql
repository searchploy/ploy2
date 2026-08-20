-- What a consultant earned from a closed client, captured when the status is
-- set to Closed. Stored in cents to avoid float rounding on money, matching
-- consultant_contacts.deal_value_cents.
alter table public.consultant_clients
  add column if not exists deal_value_cents integer;

comment on column public.consultant_clients.deal_value_cents is
  'Deal value in cents. Set when status becomes Closed; drives Est. Revenue on the consultant dashboard.';
