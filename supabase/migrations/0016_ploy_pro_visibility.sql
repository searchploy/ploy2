-- Ploy Pro listing visibility.
--
-- The marketplace needs to know which approved listings belong to an active
-- Ploy Pro subscriber. Reading `subscriptions` directly is not an option: RLS
-- restricts it to the owner (correctly — billing state is private), and doing
-- it per listing would be an N+1.
--
-- This SECURITY DEFINER function answers exactly one question in one query:
-- which employee ids are boosted. It exposes no billing data — only the fact
-- a listing is boosted, which the gold badge already makes public.
create or replace function public.pro_boosted_employee_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select e.id
  from public.employees e
  join public.subscriptions s on s.profile_id = e.profile_id
  where e.status = 'published'
    and e.profile_id is not null
    and s.status = 'active'
    and s.plan = 'pro'
    and s.type = 'pro';
$$;

revoke all on function public.pro_boosted_employee_ids() from public;
grant execute on function public.pro_boosted_employee_ids() to anon, authenticated;

comment on function public.pro_boosted_employee_ids() is
  'Approved listings owned by an active Ploy Pro subscriber. Source of truth for the marketplace ranking boost, AI report weighting and gold badge. Subscription state is never exposed — only the resulting employee ids.';
