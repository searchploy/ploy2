-- Security hardening pass.

-- 1. verify_email(user_id) was SECURITY DEFINER and executable by anon via
--    /rest/v1/rpc/verify_email. It sets email_verified = true for ANY id, so
--    anyone could mark any account verified without access to its inbox —
--    email verification gates dashboard access. Nothing in the app calls it
--    (real verification runs through the sync_email_verified trigger on
--    auth.users). Revoked rather than dropped so a service-role caller still
--    works if one exists.
revoke all on function public.verify_email(uuid) from anon, authenticated, public;

-- 2. Trigger functions were also reachable as RPC. Triggers fire regardless of
--    the invoking role's EXECUTE grant, so revoking is safe.
revoke all on function public.handle_new_user() from anon, authenticated, public;
revoke all on function public.sync_email_verified() from anon, authenticated, public;

-- 3. agencies carried the same wide-open policy employees had:
--    FOR ALL TO public USING (true) WITH CHECK (true) — any caller could
--    create, alter or delete any agency, including seeded ones.
drop policy if exists "Admin can manage all agencies" on public.agencies;

drop policy if exists "agencies_delete" on public.agencies;
create policy "agencies_delete" on public.agencies
  for delete using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "agencies_admin_write" on public.agencies;
create policy "agencies_admin_write" on public.agencies
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "agencies_admin_insert" on public.agencies;
create policy "agencies_admin_insert" on public.agencies
  for insert with check (public.is_admin());

-- 4. reports / report_recommendations allowed FOR ALL on profile_id IS NULL,
--    so anyone could edit or delete any anonymous report.
drop policy if exists "Anonymous reports are publicly accessible" on public.reports;
drop policy if exists "Users can manage own reports" on public.reports;

create policy "reports_insert" on public.reports
  for insert with check (profile_id = auth.uid() or profile_id is null);
create policy "reports_select_own" on public.reports
  for select using (profile_id = auth.uid() or public.is_admin());
create policy "reports_update_own" on public.reports
  for update using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());
create policy "reports_delete_own" on public.reports
  for delete using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "Recommendations follow their report's access" on public.report_recommendations;

create policy "report_recs_insert" on public.report_recommendations
  for insert with check (
    report_id in (select id from public.reports
                   where profile_id = auth.uid() or profile_id is null)
  );
create policy "report_recs_select" on public.report_recommendations
  for select using (
    report_id in (select id from public.reports where profile_id = auth.uid())
    or public.is_admin()
  );
create policy "report_recs_modify" on public.report_recommendations
  for delete using (
    report_id in (select id from public.reports where profile_id = auth.uid())
    or public.is_admin()
  );

-- 5. The public logo bucket accepted SVG. An SVG can carry script, and files
--    in a public bucket are directly navigable, so it executes on the storage
--    origin if opened. Raster formats only.
update storage.buckets
   set allowed_mime_types = array['image/png','image/jpeg','image/webp']
 where id = 'listing-logos';
