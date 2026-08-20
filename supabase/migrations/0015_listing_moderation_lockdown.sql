-- Listing moderation: lock down who may change a listing's status.
--
-- Before this migration the policy "Admin can manage all employees" was
-- FOR ALL TO public USING (true) WITH CHECK (true), which let any caller
-- update or delete any listing — including setting their own to 'published'.

alter table public.employees
  add column if not exists rejection_reason text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references public.profiles(id);

-- SECURITY DEFINER so the lookup isn't itself subject to profiles RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Drop every existing employees policy so the rules below are the whole story.
drop policy if exists "Admin can manage all employees" on public.employees;
drop policy if exists "Admin can view all listings" on public.employees;
drop policy if exists "Admin can update any listing" on public.employees;
drop policy if exists "Admin can delete any listing" on public.employees;
drop policy if exists "Published employees are public" on public.employees;
drop policy if exists "Users can view their own listing" on public.employees;
drop policy if exists "Users can create their own listing" on public.employees;
drop policy if exists "Users can update their own listing" on public.employees;
drop policy if exists "Users can delete their own listing" on public.employees;
drop policy if exists "Agency can manage own employees" on public.employees;

-- READ ---------------------------------------------------------------
-- Public sees approved listings only. Owners additionally see their own
-- (pending or rejected). Admins see everything.
create policy "employees_select" on public.employees
  for select using (
    status = 'published'
    or profile_id = auth.uid()
    or agency_id in (select id from public.agencies where profile_id = auth.uid())
    or public.is_admin()
  );

-- CREATE -------------------------------------------------------------
-- A user may only create their own listing, and only as pending_review.
create policy "employees_insert_own" on public.employees
  for insert with check (
    profile_id = auth.uid() and status = 'pending_review'
  );

create policy "employees_insert_admin" on public.employees
  for insert with check (public.is_admin());

-- UPDATE -------------------------------------------------------------
-- An owner editing their listing always lands back in pending_review:
-- that covers "edit approved -> re-review" and "resubmit rejected", and
-- makes self-approval impossible at the database level.
create policy "employees_update_own" on public.employees
  for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid() and status = 'pending_review');

create policy "employees_update_admin" on public.employees
  for update using (public.is_admin()) with check (public.is_admin());

-- DELETE -------------------------------------------------------------
create policy "employees_delete_own" on public.employees
  for delete using (profile_id = auth.uid());

create policy "employees_delete_admin" on public.employees
  for delete using (public.is_admin());

-- Any listing whose moderation state is unknown is treated as unreviewed,
-- never as approved.
update public.employees set status = 'pending_review' where status is null;
