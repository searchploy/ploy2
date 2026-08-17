-- Consultant Clients
create table if not exists public.consultant_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  industry text,
  contact_name text,
  email text,
  phone text,
  status text default 'Lead',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Consultant Reports
create table if not exists public.consultant_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.consultant_clients(id) on delete set null,
  report_id uuid references public.reports(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Consultant Progress
create table if not exists public.consultant_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module integer not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, module)
);

-- Enable RLS
alter table public.consultant_clients enable row level security;
alter table public.consultant_reports enable row level security;
alter table public.consultant_progress enable row level security;

-- RLS Policies for consultant_clients
create policy "Users can view their own clients"
  on public.consultant_clients
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own clients"
  on public.consultant_clients
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own clients"
  on public.consultant_clients
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own clients"
  on public.consultant_clients
  for delete
  using (auth.uid() = user_id);

-- RLS Policies for consultant_reports
create policy "Users can view their own reports"
  on public.consultant_reports
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reports"
  on public.consultant_reports
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own reports"
  on public.consultant_reports
  for delete
  using (auth.uid() = user_id);

-- RLS Policies for consultant_progress
create policy "Users can view their own progress"
  on public.consultant_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.consultant_progress
  for update
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.consultant_progress
  for insert
  with check (auth.uid() = user_id);

-- Create indexes for performance
create index if not exists consultant_clients_user_id_idx on public.consultant_clients(user_id);
create index if not exists consultant_reports_user_id_idx on public.consultant_reports(user_id);
create index if not exists consultant_progress_user_id_idx on public.consultant_progress(user_id);
