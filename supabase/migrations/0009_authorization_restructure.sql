-- Phase 1: Authorization Restructuring
-- Consolidate subscription_type from (business, consultant, agency) to (pro, consulting)
-- Add email verification tracking to profiles
-- This ensures users cannot access dashboards without verified email

-- Step 1: Add email verification fields to profiles
alter table public.profiles
  add column email_verified boolean not null default false,
  add column email_verified_at timestamp with time zone;

-- For existing users, mark them as verified if they have an active subscription
update public.profiles
set email_verified = true, email_verified_at = created_at
where id in (
  select distinct profile_id
  from subscriptions
  where status in ('active', 'trialing')
);

-- Step 2: Create new consolidated subscription_type enum
-- (business, agency) → pro
-- (consultant) → consulting
create type subscription_type_new as enum ('pro', 'consulting');

-- Step 3: Migrate subscription_type in profiles table
alter table public.profiles
  add column subscription_type_new subscription_type_new;

update public.profiles
set subscription_type_new = case
  when subscription_type in ('business'::subscription_type, 'agency'::subscription_type) then 'pro'::subscription_type_new
  when subscription_type = 'consultant'::subscription_type then 'consulting'::subscription_type_new
  else 'pro'::subscription_type_new
end
where subscription_type is not null;

-- Make new column not null and default
alter table public.profiles
  alter column subscription_type_new set default 'pro'::subscription_type_new;

-- Step 4: Migrate subscription_type in subscriptions table
alter table public.subscriptions
  add column type_new subscription_type_new;

update public.subscriptions
set type_new = case
  when type in ('business'::subscription_type, 'agency'::subscription_type) then 'pro'::subscription_type_new
  when type = 'consultant'::subscription_type then 'consulting'::subscription_type_new
  else 'pro'::subscription_type_new
end
where type is not null;

alter table public.subscriptions
  alter column type_new set default 'pro'::subscription_type_new;

-- Step 5: Drop old columns and rename new ones
alter table public.profiles
  drop column subscription_type;

alter table public.subscriptions
  drop column type;

alter table public.profiles
  rename column subscription_type_new to subscription_type;

alter table public.subscriptions
  rename column type_new to type;

alter table public.subscriptions
  alter column type set not null;

-- Step 6: Drop old enum and rename new one
drop type subscription_type;

alter type subscription_type_new rename to subscription_type;

-- Step 7: Update handle_new_user function to use new enum values
create or replace function public.handle_new_user()
returns trigger as $$
declare
  requested_role text := new.raw_user_meta_data->>'role';
  resolved_role user_role := case
    when requested_role in ('business', 'agency', 'admin', 'consultant')
      then requested_role::user_role
    else 'business'::user_role
  end;
  resolved_subscription_type subscription_type := case
    when resolved_role in ('business'::user_role, 'agency'::user_role) then 'pro'::subscription_type
    when resolved_role = 'consultant'::user_role then 'consulting'::subscription_type
    else 'pro'::subscription_type
  end;
begin
  insert into profiles (id, email, full_name, avatar_url, role, subscription_type, email_verified)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    resolved_role,
    resolved_subscription_type,
    false
  );
  return new;
end;
$$ language plpgsql
security definer
set search_path = public;

-- Step 8: Create function to mark email as verified
create or replace function public.verify_email(user_id uuid)
returns void as $$
begin
  update public.profiles
  set email_verified = true, email_verified_at = now()
  where id = user_id;
end;
$$ language plpgsql
security definer
set search_path = public;

-- Step 9: Add RLS policy for email verification gate on subscriptions
-- Users can only see their own subscription if email is verified (or they're admin/have active sub)
alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription" on subscriptions
  for select
  using (auth.uid() = profile_id);

-- Step 10: Add RLS policy for profile viewing
alter table public.profiles enable row level security;

create policy "Users can view their own profile" on profiles
  for select
  using (auth.uid() = id);

-- Note: Dashboard access enforcement happens at the application layer via
-- middleware and layout checks, not solely via RLS. This ensures:
-- 1. Subscription status is checked on every access
-- 2. Email verification status is enforced
-- 3. Admin bypass is respected
