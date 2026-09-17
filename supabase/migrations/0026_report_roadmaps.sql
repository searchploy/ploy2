-- Saved Ploy Pro implementation roadmaps, one per report.
--
-- The roadmap is a paid feature, so this table is authorization-bearing:
--   * Read: only the report owner while they hold an active Ploy Pro
--     subscription, or an admin. A lapsed subscription hides it again.
--   * Write: never directly. save_report_roadmap() re-checks ownership and
--     entitlement server-side, so neither a crafted REST call nor a
--     client-side isPro flag can create or overwrite a roadmap.

create table if not exists public.report_roadmaps (
  report_id uuid primary key references public.reports(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  engine_version integer not null,
  source_fingerprint text not null,
  roadmap jsonb not null,
  generated_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.report_roadmaps enable row level security;

-- Same rule as getEntitlements() and pro_boosted_employee_ids(): Ploy Pro is
-- an active subscriptions row of type 'pro'. Consulting Pro does not qualify.
create or replace function public.has_active_ploy_pro()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.subscriptions
     where profile_id = auth.uid()
       and status = 'active'
       and plan = 'pro'
       and type = 'pro'
  );
$$;

revoke all on function public.has_active_ploy_pro() from public, anon;
grant execute on function public.has_active_ploy_pro() to authenticated;

drop policy if exists "report_roadmaps_select" on public.report_roadmaps;
create policy "report_roadmaps_select" on public.report_roadmaps
  for select to authenticated
  using ((profile_id = auth.uid() and public.has_active_ploy_pro()) or public.is_admin());

revoke all on public.report_roadmaps from anon;
revoke insert, update, delete, truncate on public.report_roadmaps from authenticated;
grant select on public.report_roadmaps to authenticated;

create or replace function public.save_report_roadmap(
  p_report_id uuid,
  p_engine_version integer,
  p_source_fingerprint text,
  p_roadmap jsonb
)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_owner uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select profile_id into v_owner from public.reports where id = p_report_id;
  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  if not (public.has_active_ploy_pro() or public.is_admin()) then
    raise exception 'ploy pro required' using errcode = '42501';
  end if;

  if jsonb_typeof(p_roadmap) <> 'object' or pg_column_size(p_roadmap) > 262144 then
    raise exception 'invalid roadmap' using errcode = '22023';
  end if;

  insert into public.report_roadmaps (report_id, profile_id, engine_version, source_fingerprint, roadmap)
  values (p_report_id, v_owner, p_engine_version, p_source_fingerprint, p_roadmap)
  on conflict (report_id) do update
    set engine_version = excluded.engine_version,
        source_fingerprint = excluded.source_fingerprint,
        roadmap = excluded.roadmap,
        generated_at = now(),
        updated_at = now();
end;
$$;

revoke all on function public.save_report_roadmap(uuid, integer, text, jsonb) from public, anon;
grant execute on function public.save_report_roadmap(uuid, integer, text, jsonb) to authenticated;
