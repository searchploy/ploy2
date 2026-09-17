-- Legal acceptance records and marketplace listing reports.
--
-- Two authorization-bearing additions:
--
--   1. legal_acceptances — an append-only record of which legal document
--      version a user accepted and when. Never written from the client: the
--      only path in is record_legal_acceptance(), which takes the acting user
--      from auth.uid() and the timestamp from the database, so neither can be
--      forged by a crafted REST call.
--
--   2. listing_reports — visitor reports about a marketplace listing. Readable
--      only by the reporter and admins, because a report names a business and
--      says something adverse about it.
--
-- The provider-terms requirement is enforced in the employees RLS policies at
-- the bottom of this file rather than in the form, so submitting a listing
-- without accepting the Marketplace Provider Terms fails at the database.

-- ---------------------------------------------------------------------------
-- Legal acceptances
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.legal_document_type as enum (
    'terms',
    'privacy',
    'marketplace_provider_terms',
    'ai_report_disclaimer'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.legal_acceptances (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references public.profiles(id) on delete cascade,
  document_type    public.legal_document_type not null,
  document_version text not null,
  accepted_at      timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

-- One row per user per document version. Accepting the same version twice is a
-- no-op; accepting a NEW version adds a row and leaves the old one intact, so
-- the history of what someone agreed to is never overwritten.
create unique index if not exists legal_acceptances_unique_version
  on public.legal_acceptances (profile_id, document_type, document_version);

create index if not exists legal_acceptances_profile_idx
  on public.legal_acceptances (profile_id, document_type);

alter table public.legal_acceptances enable row level security;

-- Read your own; admins read all. No insert/update/delete policy exists, so
-- the only way a row is created is the SECURITY DEFINER function below and the
-- only way one changes is not at all.
drop policy if exists "legal_acceptances_select" on public.legal_acceptances;
create policy "legal_acceptances_select" on public.legal_acceptances
  for select to authenticated
  using (profile_id = auth.uid() or public.is_admin());

revoke all on public.legal_acceptances from anon;
revoke insert, update, delete, truncate on public.legal_acceptances from authenticated;
grant select on public.legal_acceptances to authenticated;

create or replace function public.record_legal_acceptance(
  p_document_type public.legal_document_type,
  p_document_version text
)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if p_document_version is null or length(trim(p_document_version)) = 0
     or length(p_document_version) > 40 then
    raise exception 'invalid document version' using errcode = '22023';
  end if;

  -- profile_id and accepted_at come from the session and the database clock,
  -- never from the caller, so neither who accepted nor when can be spoofed.
  insert into public.legal_acceptances (profile_id, document_type, document_version)
  values (auth.uid(), p_document_type, trim(p_document_version))
  on conflict (profile_id, document_type, document_version) do nothing;
end;
$$;

revoke all on function public.record_legal_acceptance(public.legal_document_type, text) from public, anon;
grant execute on function public.record_legal_acceptance(public.legal_document_type, text) to authenticated;

/**
 * Whether the current user has accepted any version of the Marketplace
 * Provider Terms. Deliberately version-agnostic: tightening this to "the
 * current version" would silently block every existing provider from editing
 * their listing the moment the document is revised. Re-acceptance of a new
 * version is prompted in the UI instead.
 */
create or replace function public.has_accepted_provider_terms()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.legal_acceptances
     where profile_id = auth.uid()
       and document_type = 'marketplace_provider_terms'
  );
$$;

revoke all on function public.has_accepted_provider_terms() from public, anon;
grant execute on function public.has_accepted_provider_terms() to authenticated;

-- ---------------------------------------------------------------------------
-- Marketplace listing reports
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.listing_report_reason as enum (
    'misleading',
    'fraud',
    'does_not_exist',
    'pricing',
    'misrepresentation',
    'security',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_report_status as enum (
    'open',
    'under_review',
    'resolved',
    'dismissed'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.listing_reports (
  id            uuid primary key default gen_random_uuid(),
  employee_id   uuid not null references public.employees(id) on delete cascade,
  -- Null for a signed-out reporter. A scam listing is worth hearing about
  -- whether or not the person reporting it has an account.
  reporter_id   uuid references public.profiles(id) on delete set null,
  reason        public.listing_report_reason not null,
  detail        text,
  status        public.listing_report_status not null default 'open',
  -- Admin-only working notes. Never exposed to the reporter or the provider.
  admin_notes   text,
  reviewed_by   uuid references public.profiles(id) on delete set null,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists listing_reports_employee_idx
  on public.listing_reports (employee_id, created_at desc);
create index if not exists listing_reports_status_idx
  on public.listing_reports (status, created_at desc);

alter table public.listing_reports enable row level security;

-- A report says something adverse about a named business, so it is visible to
-- the reporter and admins only — never to other users, and never to the
-- provider being reported.
drop policy if exists "listing_reports_select" on public.listing_reports;
create policy "listing_reports_select" on public.listing_reports
  for select to authenticated
  using ((reporter_id is not null and reporter_id = auth.uid()) or public.is_admin());

-- Only admins may change a report's status or notes. Reporters cannot edit a
-- report after filing, and providers cannot touch reports about themselves.
drop policy if exists "listing_reports_update_admin" on public.listing_reports;
create policy "listing_reports_update_admin" on public.listing_reports
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "listing_reports_delete_admin" on public.listing_reports;
create policy "listing_reports_delete_admin" on public.listing_reports
  for delete to authenticated
  using (public.is_admin());

revoke all on public.listing_reports from anon;
revoke insert, update, delete, truncate on public.listing_reports from authenticated;
grant select on public.listing_reports to authenticated;
grant update (status, admin_notes, reviewed_by, reviewed_at, updated_at)
  on public.listing_reports to authenticated;

/**
 * Files a report about a listing. Rate-limited per caller so the table cannot
 * be flooded, and the listing must actually be published — reporting an id
 * that is not on the marketplace tells the caller nothing either way.
 */
create or replace function public.submit_listing_report(
  p_employee_id uuid,
  p_reason public.listing_report_reason,
  p_detail text default null
)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_exists boolean;
begin
  select exists (
    select 1 from public.employees
     where id = p_employee_id and status = 'published'
  ) into v_exists;

  if not v_exists then
    raise exception 'listing not found' using errcode = '22023';
  end if;

  if p_detail is not null and length(p_detail) > 2000 then
    raise exception 'detail too long' using errcode = '22023';
  end if;

  if not public.check_rate_limit(
       coalesce('listing_report:' || auth.uid()::text, 'listing_report:anonymous'),
       10, 3600
     ) then
    raise exception 'too many reports' using errcode = '53400';
  end if;

  insert into public.listing_reports (employee_id, reporter_id, reason, detail)
  values (p_employee_id, auth.uid(), p_reason, nullif(trim(coalesce(p_detail, '')), ''));
end;
$$;

revoke all on function public.submit_listing_report(uuid, public.listing_report_reason, text) from public;
grant execute on function public.submit_listing_report(uuid, public.listing_report_reason, text)
  to anon, authenticated;

create or replace function public.touch_listing_report()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listing_reports_touch on public.listing_reports;
create trigger listing_reports_touch
  before update on public.listing_reports
  for each row execute function public.touch_listing_report();

-- ---------------------------------------------------------------------------
-- Provider terms gate on listing submission
-- ---------------------------------------------------------------------------
--
-- Replaces the owner insert/update policies from migration 0015 with the same
-- rules plus the provider-terms requirement. The admin policies are untouched:
-- an admin creating or moderating a listing is not the party making the
-- representations the Provider Terms cover.
--
-- Everything else about 0015 is preserved — an owner still may only write
-- their own row, and still only ever with status = 'pending_review', so
-- self-approval remains impossible.

drop policy if exists "employees_insert_own" on public.employees;
create policy "employees_insert_own" on public.employees
  for insert to authenticated with check (
    profile_id = auth.uid()
    and status = 'pending_review'
    and public.has_accepted_provider_terms()
  );

drop policy if exists "employees_update_own" on public.employees;
create policy "employees_update_own" on public.employees
  for update to authenticated
  using (profile_id = auth.uid())
  with check (
    profile_id = auth.uid()
    and status = 'pending_review'
    and public.has_accepted_provider_terms()
  );

comment on table public.legal_acceptances is
  'Append-only record of accepted legal document versions. Written only via record_legal_acceptance(); never updated or deleted.';
comment on table public.listing_reports is
  'Visitor reports about marketplace listings. Visible to the reporter and admins only. A report is an allegation, not a finding.';
