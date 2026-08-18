-- Root cause: profiles.email_verified was only written by the /verify-email screen
-- and the Stripe webhook. Users who verified via the signup modal kept a stale
-- `false`, so dashboard layouts bounced them back to /verify-email on every login.
-- auth.users.email_confirmed_at is the real source of truth; mirror it.

-- 1. Backfill existing rows from Supabase Auth
update public.profiles p
set email_verified = true,
    email_verified_at = coalesce(p.email_verified_at, u.email_confirmed_at)
from auth.users u
where u.id = p.id
  and u.email_confirmed_at is not null
  and p.email_verified is distinct from true;

-- 2. Keep it in sync going forward: whenever Auth confirms an email, mirror it.
create or replace function public.sync_email_verified()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and (old.email_confirmed_at is null or old.email_confirmed_at is distinct from new.email_confirmed_at)
  then
    update public.profiles
    set email_verified = true,
        email_verified_at = coalesce(email_verified_at, new.email_confirmed_at)
    where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_confirmed on auth.users;
create trigger on_auth_user_email_confirmed
  after update of email_confirmed_at on auth.users
  for each row
  execute function public.sync_email_verified();
