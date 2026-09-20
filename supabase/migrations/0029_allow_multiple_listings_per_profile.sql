-- Allow multiple listings per profile for Ploy Pro users (up to 5 listings)
-- Free users limited to 1 listing via application-level validation

drop index if exists public.idx_employees_one_per_profile;

-- Create a new index for performance, without uniqueness constraint
create index if not exists idx_employees_profile_id_listing
on public.employees(profile_id)
where profile_id is not null;
