-- Security logging. Admin approvals, rejections, deletions and refused
-- attempts left no trace, so an incident could not be reconstructed.
--
-- Deliberately records who, what, which object and the outcome — never
-- passwords, tokens, session data or payment details.
create table if not exists public.security_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  actor_id    uuid references public.profiles(id) on delete set null,
  actor_email text,
  action      text not null,
  outcome     text not null default 'success',  -- success | denied | error
  target_type text,
  target_id   text,
  detail      jsonb
);

create index if not exists security_events_created_at_idx
  on public.security_events (created_at desc);
create index if not exists security_events_actor_idx
  on public.security_events (actor_id, created_at desc);

alter table public.security_events enable row level security;

-- Readable by admins only. No INSERT policy: writes go through the function
-- below, so a refused attempt can still be recorded by a non-admin caller.
drop policy if exists "security_events_admin_read" on public.security_events;
create policy "security_events_admin_read" on public.security_events
  for select using (public.is_admin());

create or replace function public.log_security_event(
  p_action text, p_outcome text default 'success',
  p_target_type text default null, p_target_id text default null,
  p_detail jsonb default null
)
returns void
language plpgsql security definer set search_path = public
as $$
declare uid uuid := auth.uid();
begin
  insert into public.security_events (actor_id, actor_email, action, outcome, target_type, target_id, detail)
  values (uid, (select email from public.profiles where id = uid),
          p_action, coalesce(p_outcome,'success'), p_target_type, p_target_id, p_detail);
end;
$$;

revoke all on function public.log_security_event(text, text, text, text, jsonb) from public;
grant execute on function public.log_security_event(text, text, text, text, jsonb) to anon, authenticated;
