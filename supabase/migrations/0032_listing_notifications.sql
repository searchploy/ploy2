-- One row per (listing, notification kind) that has been sent or is being
-- sent. The primary key is the duplicate guard: the approval action inserts
-- the row before calling Resend, so a second Approve click, a retried request
-- or a concurrent approval hits the key and skips the send. A failed send
-- deletes its row so a later approval can try again.
--
-- The listing's own status stays the source of truth for approval; this table
-- only records outbound email.
--
-- Kept off employees deliberately: owners can update their own employees row,
-- and a column there would let them clear or forge the sent marker.

create table if not exists public.listing_notifications (
  employee_id uuid not null references public.employees(id) on delete cascade,
  kind        text not null check (kind in ('listing_approved')),
  claimed_at  timestamptz not null default now(),
  sent_at     timestamptz,
  resend_id   text,
  primary key (employee_id, kind)
);

-- RLS on with no policies: only the service role (server-side approval
-- action) can read or write it.
alter table public.listing_notifications enable row level security;
revoke all on public.listing_notifications from anon, authenticated;

comment on table public.listing_notifications is
  'Outbound listing emails (e.g. approval). The primary key prevents duplicate sends; written only by the service role.';
