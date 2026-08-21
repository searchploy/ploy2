-- H2: the classroom write policy tested auth.jwt() ->> 'user_role', a claim
-- Supabase does not issue and no custom access-token hook sets. It therefore
-- denied everyone, including the real admin, so admin classroom editing was
-- silently broken. is_admin() is the same check the rest of the schema uses,
-- and is safe now that 0021 stops signup granting the admin role.
drop policy if exists "Only admins can modify classroom modules" on public.classroom_modules;

create policy "classroom_modules_admin_write" on public.classroom_modules
  for all using (public.is_admin()) with check (public.is_admin());

-- M3: AI report generation is unauthenticated and costs money per call, so it
-- can be looped by anyone. A counter table gives a durable limit across
-- serverless instances, which an in-process counter cannot.
create table if not exists public.rate_limits (
  key          text        not null,
  window_start timestamptz not null,
  count        integer     not null default 0,
  primary key (key, window_start)
);

alter table public.rate_limits enable row level security;
-- No policies: reachable only via the SECURITY DEFINER function below and by
-- the service role. Never queried directly from the client.

create or replace function public.check_rate_limit(
  bucket text, max_hits integer, window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  slot timestamptz := to_timestamp(floor(extract(epoch from now()) / window_seconds) * window_seconds);
  hits integer;
begin
  insert into public.rate_limits (key, window_start, count)
  values (bucket, slot, 1)
  on conflict (key, window_start) do update set count = public.rate_limits.count + 1
  returning count into hits;

  -- Opportunistic cleanup so the table cannot grow without bound.
  delete from public.rate_limits where window_start < now() - interval '1 day';

  return hits <= max_hits;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public;
grant execute on function public.check_rate_limit(text, integer, integer) to anon, authenticated;
