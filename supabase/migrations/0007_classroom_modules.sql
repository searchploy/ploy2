-- Create classroom_modules table
create table if not exists public.classroom_modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  content text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.classroom_modules enable row level security;

-- Policy: Everyone can read classroom modules
create policy "Anyone can read classroom modules"
  on public.classroom_modules
  for select
  using (true);

-- Policy: Only admins can insert/update/delete
create policy "Only admins can modify classroom modules"
  on public.classroom_modules
  for all
  using (auth.jwt() ->> 'user_role' = 'admin')
  with check (auth.jwt() ->> 'user_role' = 'admin');

-- Insert sample classroom modules
insert into public.classroom_modules (title, description, content, sort_order) values
  (
    'Getting Started as a Consultant',
    'Learn the fundamentals of becoming a successful consultant on the Ploy platform.',
    'This module introduces you to the consultant platform and explains how to get started. As a consultant, you''ll be matching businesses with AI employees, guiding them through implementation, and building long-term relationships.

Key topics:
- Understanding the consultant role
- Platform navigation and tools
- Your first client interaction
- Building your consultant profile',
    1
  ),
  (
    'Finding and Qualifying Leads',
    'Master the process of discovering and qualifying potential clients.',
    'Not all prospects are right for your services. This module teaches you how to identify high-quality leads and quickly qualify them to save time and focus on the best opportunities.

Key skills:
- Lead research and discovery
- Qualification frameworks
- Initial outreach strategies
- Follow-up best practices',
    2
  ),
  (
    'Presenting AI Solutions',
    'Learn how to present AI employees to clients in a way that resonates.',
    'Presenting the right AI solution to a client requires understanding their unique pain points. This module shows you how to customize your pitch, demonstrate ROI, and overcome objections.

Key techniques:
- Needs assessment
- Solution matching
- ROI calculation
- Handling objections',
    3
  ),
  (
    'Closing Deals and Implementation',
    'Turn prospects into customers and ensure successful implementation.',
    'Closing a deal is just the beginning. This module covers finalizing agreements, managing the implementation timeline, and ensuring your client gets value from day one.

Key elements:
- Negotiation and closing techniques
- Implementation planning
- Timeline management
- Client onboarding',
    4
  ),
  (
    'Managing Client Relationships',
    'Build lasting relationships that lead to repeat business and referrals.',
    'Long-term success comes from strong client relationships. Learn how to maintain regular contact, measure success, identify expansion opportunities, and handle challenges.

Key focus areas:
- Regular check-ins and reporting
- Success metrics and tracking
- Upsell and expansion opportunities
- Handling dissatisfaction',
    5
  );
