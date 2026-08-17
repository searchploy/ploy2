-- Replace the single subscription_tier ('free'/'premium'/'consultant') with
-- a two-dimensional model: which product a subscription is for
-- (subscription_type) and what plan level it's at (subscription_plan).
-- This lets a consultant's Pro plan grant every Business Pro feature
-- automatically without needing a second "business" subscription — entitlement
-- checks just look at subscription_plan = 'pro', and subscription_type
-- distinguishes which paid product actually funded it.
create type subscription_type as enum ('business', 'consultant', 'agency');
create type subscription_plan as enum ('free', 'pro');

alter table public.profiles
  add column subscription_type subscription_type,
  add column subscription_plan subscription_plan not null default 'free';

update public.profiles set subscription_type = case
  when role = 'agency' then 'agency'::subscription_type
  when role = 'consultant' then 'consultant'::subscription_type
  else 'business'::subscription_type
end;

alter table public.profiles
  alter column subscription_type set not null,
  alter column subscription_type set default 'business';

alter table public.subscriptions
  add column type subscription_type,
  add column plan subscription_plan not null default 'free';

update public.subscriptions set type = 'business'::subscription_type where type is null;

alter table public.subscriptions
  alter column type set not null;

alter table public.profiles drop column subscription_tier;
alter table public.subscriptions drop column tier;
drop type subscription_tier;

-- New profiles default subscription_type from their signup role.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  requested_role text := new.raw_user_meta_data->>'role';
  resolved_role user_role := case
    when requested_role in ('business', 'agency', 'admin', 'consultant')
      then requested_role::user_role
    else 'business'::user_role
  end;
begin
  insert into profiles (id, email, full_name, avatar_url, role, subscription_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    resolved_role,
    case
      when resolved_role = 'agency' then 'agency'::subscription_type
      when resolved_role = 'consultant' then 'consultant'::subscription_type
      else 'business'::subscription_type
    end
  );
  return new;
end;
$$ language plpgsql
security definer
set search_path = public;
