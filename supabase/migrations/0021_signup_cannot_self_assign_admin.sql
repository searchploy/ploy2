-- C1: signup could grant admin.
--
-- handle_new_user() read the role out of raw_user_meta_data, which is set by
-- the browser at signUp(), and accepted 'admin'. Since is_admin() is
-- profiles.role = 'admin', anyone could call the public signup endpoint with
-- {"role":"admin"} and gain database-level admin: read every report, and
-- approve, reject or delete any listing.
--
-- business / agency / consultant stay selectable — they are product choices
-- with no privilege attached. 'admin' is removed from the accepted set, so it
-- can only ever be granted deliberately by an operator with service-role
-- access. Anything unrecognised still falls back to 'business'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  requested_role text := new.raw_user_meta_data->>'role';
  resolved_role user_role := case
    -- Deliberately excludes 'admin': this value comes from the client.
    when requested_role in ('business', 'agency', 'consultant')
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
    new.id, new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    resolved_role, resolved_subscription_type, false
  );
  return new;
end;
$function$;

revoke all on function public.handle_new_user() from anon, authenticated, public;
