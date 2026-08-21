-- The report_recommendations INSERT policy sub-selected from reports. Once
-- 0023 removed anon's table-level read on reports, that subquery returned
-- nothing under RLS and anonymous report creation failed — the recommendations
-- could not be attached.
--
-- The ownership test moves into a SECURITY DEFINER helper so the policy can
-- evaluate it without the caller needing to read reports directly. It answers
-- one yes/no question about a single id and exposes no report content.
create or replace function public.can_attach_to_report(p_report_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.reports
     where id = p_report_id and (profile_id = auth.uid() or profile_id is null)
  );
$$;

revoke all on function public.can_attach_to_report(uuid) from public;
grant execute on function public.can_attach_to_report(uuid) to anon, authenticated;

drop policy if exists "report_recs_insert" on public.report_recommendations;
create policy "report_recs_insert" on public.report_recommendations
  for insert with check (public.can_attach_to_report(report_id));
