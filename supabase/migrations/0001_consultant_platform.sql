-- Extend role/tier enums so consultants get a first-class identity and
-- automatically inherit Pro entitlements (tier IN ('premium','consultant')).
alter type user_role add value if not exists 'consultant';
alter type subscription_tier add value if not exists 'consultant';

-- CRM primitives for the consultant dashboard: contacts (clients/prospects),
-- tasks, notes, and an append-only activity log the dashboard stat tiles
-- (Businesses Contacted, Meetings Booked, Deals Closed) count over.
create type contact_type as enum ('prospect', 'client');
create type contact_stage as enum ('new', 'contacted', 'meeting_booked', 'proposal_sent', 'won', 'lost');
create type contact_activity_type as enum ('contacted', 'meeting_booked', 'proposal_sent', 'deal_closed');

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = public;

create table public.consultant_contacts (
  id uuid primary key default extensions.uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type contact_type not null default 'prospect',
  business_name text not null,
  contact_name text,
  email text,
  phone text,
  stage contact_stage not null default 'new',
  deal_value_cents integer,
  source text,
  report_id uuid references public.reports(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consultant_tasks (
  id uuid primary key default extensions.uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  contact_id uuid references public.consultant_contacts(id) on delete cascade,
  title text not null,
  due_date date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.consultant_notes (
  id uuid primary key default extensions.uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  contact_id uuid not null references public.consultant_contacts(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.consultant_activities (
  id uuid primary key default extensions.uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  contact_id uuid references public.consultant_contacts(id) on delete set null,
  type contact_activity_type not null,
  notes text,
  created_at timestamptz not null default now()
);

create index consultant_contacts_profile_id_idx on public.consultant_contacts(profile_id);
create index consultant_contacts_report_id_idx on public.consultant_contacts(report_id);
create index consultant_tasks_profile_id_idx on public.consultant_tasks(profile_id);
create index consultant_tasks_contact_id_idx on public.consultant_tasks(contact_id);
create index consultant_notes_contact_id_idx on public.consultant_notes(contact_id);
create index consultant_notes_profile_id_idx on public.consultant_notes(profile_id);
create index consultant_activities_profile_id_idx on public.consultant_activities(profile_id);
create index consultant_activities_contact_id_idx on public.consultant_activities(contact_id);

alter table public.consultant_contacts enable row level security;
alter table public.consultant_tasks enable row level security;
alter table public.consultant_notes enable row level security;
alter table public.consultant_activities enable row level security;

create policy "Consultants manage their own contacts" on public.consultant_contacts
  for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create policy "Consultants manage their own tasks" on public.consultant_tasks
  for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create policy "Consultants manage their own notes" on public.consultant_notes
  for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create policy "Consultants manage their own activities" on public.consultant_activities
  for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create trigger set_consultant_contacts_updated_at
  before update on public.consultant_contacts
  for each row execute function public.set_updated_at();
