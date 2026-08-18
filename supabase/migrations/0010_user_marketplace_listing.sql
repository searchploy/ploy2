-- Add profile_id to employees table to support user-created marketplace listings
-- One listing per user is enforced via unique constraint

alter table public.employees
add column if not exists profile_id uuid references public.profiles(id) on delete cascade,
add column if not exists is_published boolean default false;

-- Create unique constraint: one listing per profile (profile_id can be null for legacy/agency listings)
create unique index if not exists idx_employees_one_per_profile
on public.employees(profile_id)
where profile_id is not null;

-- Create index for performance when querying user's listing
create index if not exists idx_employees_profile_id on public.employees(profile_id);

-- Enable RLS if not already enabled
alter table public.employees enable row level security;

-- RLS policy: Users can view their own listing or published listings
drop policy if exists "Users can view their own listing" on public.employees;
create policy "Users can view their own listing"
  on public.employees
  for select
  using (auth.uid() = profile_id OR is_published = true);

-- RLS policy: Users can insert their own listing
drop policy if exists "Users can create their own listing" on public.employees;
create policy "Users can create their own listing"
  on public.employees
  for insert
  with check (auth.uid() = profile_id);

-- RLS policy: Users can update their own listing
drop policy if exists "Users can update their own listing" on public.employees;
create policy "Users can update their own listing"
  on public.employees
  for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- RLS policy: Users can delete their own listing
drop policy if exists "Users can delete their own listing" on public.employees;
create policy "Users can delete their own listing"
  on public.employees
  for delete
  using (auth.uid() = profile_id);

-- RLS policy: Admin can view all listings
drop policy if exists "Admin can view all listings" on public.employees;
create policy "Admin can view all listings"
  on public.employees
  for select
  using (
    auth.jwt() ->> 'email' = 'admin@searchploy.com'
  );

-- RLS policy: Admin can update any listing
drop policy if exists "Admin can update any listing" on public.employees;
create policy "Admin can update any listing"
  on public.employees
  for update
  using (
    auth.jwt() ->> 'email' = 'admin@searchploy.com'
  )
  with check (
    auth.jwt() ->> 'email' = 'admin@searchploy.com'
  );

-- RLS policy: Admin can delete any listing
drop policy if exists "Admin can delete any listing" on public.employees;
create policy "Admin can delete any listing"
  on public.employees
  for delete
  using (
    auth.jwt() ->> 'email' = 'admin@searchploy.com'
  );
