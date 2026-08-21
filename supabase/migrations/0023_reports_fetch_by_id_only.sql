-- H3: anonymous reports could be listed in bulk.
--
-- The anon key ships in the browser, so anyone could call
--   GET /rest/v1/reports?profile_id=is.null&select=*
-- and dump every anonymous report — business name, revenue range, pain points
-- and goals of real prospects. RLS cannot express "only when filtered by id",
-- so a row-level policy alone cannot fix it.
--
-- An earlier plan routed reads through the service role, but
-- SUPABASE_SERVICE_ROLE_KEY is not configured and making the main funnel
-- depend on it is fragile. Instead the table-level read for anonymous reports
-- is removed and replaced with functions that take an id and return exactly
-- one report. There is no argument that returns a list, so enumeration is
-- impossible by construction, and no secret is required.

drop policy if exists "reports_select_anonymous" on public.reports;
drop policy if exists "report_recs_select_anonymous" on public.report_recommendations;

create or replace function public.get_public_report(p_report_id uuid)
returns setof public.reports
language sql stable security definer set search_path = public
as $$
  -- Anonymous reports only. An owned report is never returned here; the owner
  -- reads it through their own session under reports_select_own.
  select * from public.reports where id = p_report_id and profile_id is null;
$$;

create or replace function public.get_public_report_recommendations(p_report_id uuid)
returns setof public.report_recommendations
language sql stable security definer set search_path = public
as $$
  select r.* from public.report_recommendations r
    join public.reports rep on rep.id = r.report_id
   where r.report_id = p_report_id and rep.profile_id is null;
$$;

revoke all on function public.get_public_report(uuid) from public;
revoke all on function public.get_public_report_recommendations(uuid) from public;
grant execute on function public.get_public_report(uuid) to anon, authenticated;
grant execute on function public.get_public_report_recommendations(uuid) to anon, authenticated;
