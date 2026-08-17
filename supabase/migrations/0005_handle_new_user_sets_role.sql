-- The signup form has always let users pick a role (business/agency, and
-- now consultant), but this trigger never read it from auth metadata — every
-- new profile silently defaulted to 'business' regardless of what was
-- selected. Cast defensively so an unrecognized/missing role still falls
-- back to 'business' instead of failing the signup.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  requested_role text := new.raw_user_meta_data->>'role';
begin
  insert into profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    case
      when requested_role in ('business', 'agency', 'admin', 'consultant')
        then requested_role::user_role
      else 'business'::user_role
    end
  );
  return new;
end;
$$ language plpgsql
security definer
set search_path = public;

alter function public.update_employee_rating() set search_path = public;
