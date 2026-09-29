-- Listing write guards.
--
-- The employees RLS policies constrained three things about an owner's write —
-- profile_id, status and provider-terms acceptance — and nothing else. Every
-- other column was grantable to `authenticated`, so a provider submitting a
-- listing could set, in the same insert the form makes:
--
--   featured        -> the homepage featured rail and the gold "Featured" rim
--   avg_rating      -> marketplace ranking, sort order and AI report ordering
--   total_reviews   -> the review count shown beside the stars
--   total_purchases -> social proof
--   reviewed_by/at  -> a forged moderation audit trail
--
-- None of those are reset when an admin approves the listing (approveListing
-- writes only status, is_published, rejection_reason, reviewed_at and
-- reviewed_by), so the forged values went live on approval.
--
-- Column grants cannot fix this: admin moderation runs through the user's own
-- session and therefore also as the `authenticated` role, so revoking the
-- columns from that role would break the approval flow too. The split has to
-- be on who the caller is, not which role they connect as — hence a trigger
-- that reasserts the privileged columns for everyone except an admin.

create or replace function public.employees_guard_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Admins moderate; the values they write are the authoritative ones.
  if public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.featured         := false;
    new.is_published     := false;
    new.avg_rating       := 0;
    new.total_reviews    := 0;
    new.total_purchases  := 0;
    new.avg_roi_percent  := null;
    new.reviewed_by      := null;
    new.reviewed_at      := null;
    new.rejection_reason := null;
  else
    -- Carried over rather than cleared: these describe the listing's standing
    -- and its last review, neither of which an owner edit is evidence about.
    new.featured         := old.featured;
    new.avg_rating       := old.avg_rating;
    new.total_reviews    := old.total_reviews;
    new.total_purchases  := old.total_purchases;
    new.avg_roi_percent  := old.avg_roi_percent;
    new.reviewed_by      := old.reviewed_by;
    new.reviewed_at      := old.reviewed_at;
    -- An owner edit always re-enters review (enforced by employees_update_own),
    -- so the listing comes off the marketplace and the stale rejection note
    -- goes with it. This matches what the form already sends.
    new.is_published     := false;
    new.rejection_reason := null;
  end if;

  return new;
end;
$$;

drop trigger if exists employees_guard_privileged_columns on public.employees;
create trigger employees_guard_privileged_columns
  before insert or update on public.employees
  for each row execute function public.employees_guard_privileged_columns();

-- ---------------------------------------------------------------------------
-- Listing allowance
-- ---------------------------------------------------------------------------
--
-- Migration 0029 dropped the unique index that held one listing per profile
-- and left the 1-free / 5-Pro rule to "application-level validation". That
-- validation is a branch in the create page that renders a different component
-- — it never runs on the write, because the insert goes straight from the
-- browser to PostgREST. Anyone able to open devtools could mint unlimited
-- listings on a free account, which is also the thing Ploy Pro sells.
--
-- The allowance matches getEntitlements(): has_active_ploy_pro() is the same
-- subscriptions predicate the app reads.

create or replace function public.employees_enforce_listing_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing integer;
  allowed  integer;
begin
  -- Seeded and agency-owned listings carry no profile and are admin-created.
  if new.profile_id is null or public.is_admin() then
    return new;
  end if;

  select count(*) into existing
    from public.employees
   where profile_id = new.profile_id;

  allowed := case when public.has_active_ploy_pro() then 5 else 1 end;

  if existing >= allowed then
    raise exception 'listing limit reached'
      using errcode = '53400',
            hint = 'Free accounts may list 1 AI tool; Ploy Pro accounts may list up to 5.';
  end if;

  return new;
end;
$$;

drop trigger if exists employees_enforce_listing_limit on public.employees;
create trigger employees_enforce_listing_limit
  before insert on public.employees
  for each row execute function public.employees_enforce_listing_limit();

-- ---------------------------------------------------------------------------
-- Anonymous sessions may not own listings
-- ---------------------------------------------------------------------------
--
-- `to authenticated` does not exclude anonymous sign-ins: Supabase issues
-- those a normal JWT carrying role=authenticated and is_anonymous=true, and
-- handle_new_user() gives them a profiles row like any other signup. If
-- anonymous sign-ins are ever enabled on the project, everything the owner
-- policies ask for could be satisfied without an email address ever existing.
--
-- No anonymous users exist today and nothing in the app calls
-- signInAnonymously(); this closes the door before it can be opened from the
-- project settings.

drop policy if exists "employees_insert_own" on public.employees;
create policy "employees_insert_own" on public.employees
  for insert to authenticated with check (
    profile_id = auth.uid()
    and status = 'pending_review'
    and public.has_accepted_provider_terms()
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "employees_update_own" on public.employees;
create policy "employees_update_own" on public.employees
  for update to authenticated
  using (profile_id = auth.uid())
  with check (
    profile_id = auth.uid()
    and status = 'pending_review'
    and public.has_accepted_provider_terms()
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

comment on function public.employees_guard_privileged_columns() is
  'Reasserts ranking, rating and moderation columns on every non-admin write. RLS decides which row an owner may write; this decides which columns.';
comment on function public.employees_enforce_listing_limit() is
  'Database-side listing allowance: 1 for free accounts, 5 with an active Ploy Pro subscription. The create page check is a courtesy; this is the enforcement.';
