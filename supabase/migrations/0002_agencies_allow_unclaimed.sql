-- Agencies can exist unclaimed (seeded/demo listings, or listings imported
-- before an owner signs up) — profile_id is set once an owner claims/creates
-- the account, matching how employees.agency_id is already nullable.
alter table public.agencies alter column profile_id drop not null;
