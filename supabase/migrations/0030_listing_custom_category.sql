-- Lets a provider name their own category when none of the seeded ones fit.
-- category_id stays null in that case, so this is the only place the name lives.

alter table public.employees
add column if not exists custom_category text;
