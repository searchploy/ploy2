-- The free AI Report tier works without an account (per spec: "Free report,
-- no credit card"). Allow anonymous (profile_id null) reports to be created
-- and read back by anyone with the link, while authenticated users' own
-- reports remain scoped to profile_id = auth.uid() via the existing policy.
alter table public.reports alter column profile_id drop not null;

create policy "Anonymous reports are publicly accessible" on public.reports
  for all using (profile_id is null) with check (profile_id is null);

-- report_recommendations previously had no insert policy at all (only a
-- select policy scoped to the report owner), which would have blocked even
-- authenticated users from writing their own report's recommendations.
create policy "Recommendations follow their report's access" on public.report_recommendations
  for all
  using (report_id in (select id from public.reports where profile_id = (select auth.uid()) or profile_id is null))
  with check (report_id in (select id from public.reports where profile_id = (select auth.uid()) or profile_id is null));

drop policy "Users can view own report recommendations" on public.report_recommendations;
