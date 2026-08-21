-- Correction to 0018.
--
-- 0018 removed anonymous read access to reports to stop anyone listing every
-- prospect's report through the public API. That is the right end state, but
-- it requires reads to go through the service role, and
-- SUPABASE_SERVICE_ROLE_KEY is not currently configured — so it broke both
-- anonymous report creation (INSERT ... RETURNING needs SELECT) and the
-- shared report link, which is the product's main funnel.
--
-- Restoring anonymous SELECT so nothing is broken, while KEEPING the part of
-- 0018 that needs no configuration: anonymous reports can no longer be
-- edited or deleted by anyone who finds them.
--
-- Still open, deliberately: anyone with the public anon key can list
-- anonymous reports. Closing that needs the service key set — see
-- 0020_reports_lock_anonymous_read.sql, which is intentionally NOT applied.

create policy "reports_select_anonymous" on public.reports
  for select using (profile_id is null);

create policy "report_recs_select_anonymous" on public.report_recommendations
  for select using (
    report_id in (select id from public.reports where profile_id is null)
  );
