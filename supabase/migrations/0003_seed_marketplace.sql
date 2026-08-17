-- Problem-oriented categories ("shop by problem, not by technology").
insert into public.categories (name, slug, description, icon, sort_order) values
  ('Generate More Leads', 'generate-more-leads', 'AI employees that find, qualify, and book meetings with new leads.', 'TrendingUp', 1),
  ('Improve Customer Support', 'improve-customer-support', '24/7 support that resolves tickets instantly across chat, email, and voice.', 'Headset', 2),
  ('Automate Admin Work', 'automate-admin-work', 'Bookkeeping, data entry, and back-office execution on autopilot.', 'Settings2', 3),
  ('Create Marketing Content', 'create-marketing-content', 'On-brand content, campaigns, and social media without the manual grind.', 'Megaphone', 4),
  ('Improve Recruiting', 'improve-recruiting', 'Sourcing, screening, and scheduling candidates faster.', 'UserSearch', 5),
  ('Increase Revenue', 'increase-revenue', 'Full-cycle sales and growth automation that closes more deals.', 'DollarSign', 6);

-- Seed agencies (matching the HTML mockup sample content). Unclaimed (no
-- profile_id) until a real owner signs up and claims the listing.
insert into public.agencies (name, slug, description, specialties, verified, avg_rating, total_reviews, total_installs, total_savings_generated) values
  ('Fieldstone Labs', 'fieldstone-labs', 'Specialists in sales and revenue automation AI employees for B2B companies.', array['Sales', 'Revenue Operations'], true, 4.9, 212, 340, 2100000),
  ('Northbeam AI', 'northbeam-ai', 'Full-stack AI workforce solutions for operations, support, and finance teams.', array['Operations', 'Support', 'Finance'], true, 4.8, 457, 820, 4700000);

-- Seed AI Employees across the problem categories.
insert into public.employees (agency_id, category_id, name, slug, role, tagline, description, business_problems, outcomes, industries, integrations, setup_time, price_monthly, price_type, status, featured, avg_rating, total_reviews, total_purchases, avg_roi_percent, expected_monthly_savings, agency_name)
select
  a.id, c.id, e.name, e.slug, e.role, e.tagline, e.description, e.business_problems, e.outcomes, e.industries, e.integrations, e.setup_time, e.price_monthly, 'monthly', 'published', e.featured, e.avg_rating, e.total_reviews, e.total_purchases, e.avg_roi_percent, e.expected_monthly_savings, a.name
from (values
  ('northbeam-ai', 'increase-revenue', 'Close', 'close', 'Sales Representative', 'Runs full-cycle sales conversations from first touch to close',
   'Close engages inbound leads in real time, qualifies them against your ICP, answers product questions using your docs, and hands off booked meetings straight to your closers'' calendars.',
   array['I need someone to qualify leads and book meetings for my sales team — without adding headcount.'],
   array['Books 30-50 qualified meetings per month on autopilot', 'Qualifies inbound leads against your ICP 24/7', 'Syncs to Salesforce and HubSpot automatically'],
   array['SaaS', 'Ecommerce', 'Financial Services'], array['Salesforce', 'HubSpot', 'Slack'], 'Same day', 149, true, 4.9, 212, 118, 420, 8200),
  ('northbeam-ai', 'improve-customer-support', 'Hearth', 'hearth', 'Customer Support Agent', 'Resolves 80% of tier-1 tickets without human involvement',
   'Hearth provides 24/7 customer support that resolves tier-1 tickets automatically, escalates complex issues with full conversation context, and works across live chat, email, and voice.',
   array['I need 24/7 customer support but I can''t afford a full-time team.'],
   array['Resolves 80% of tier-1 tickets without human involvement', 'Escalates complex issues with full conversation context', 'Works across live chat, email, and voice'],
   array['Ecommerce', 'SaaS', 'Retail'], array['Zendesk', 'Slack'], 'Same day', 129, true, 4.9, 301, 267, 380, 6100),
  ('northbeam-ai', 'automate-admin-work', 'Ledger', 'ledger', 'Bookkeeper', 'Reconciles invoices and flags anomalies before month-end',
   'Ledger is a bookkeeper who never makes mistakes and doesn''t take vacations — reconciling invoices, flagging anomalies, and connecting directly to QuickBooks and Xero.',
   array['I need a bookkeeper who never makes mistakes and doesn''t take vacations.'],
   array['Reconciles invoices and flags anomalies before month-end', 'Connects directly to QuickBooks and Xero', 'Saves an average of 15 hours per week'],
   array['Retail', 'Professional Services', 'Construction'], array['QuickBooks', 'Xero'], 'Under 1 week', 99, false, 4.8, 156, 203, 290, 4400),
  ('northbeam-ai', 'create-marketing-content', 'Signal', 'signal', 'Marketing Manager', 'Writes and schedules on-brand social content daily',
   'Signal runs your social media and content without you thinking about it — writing and scheduling on-brand content, tracking engagement, and integrating with Shopify and your CRM.',
   array['I need someone to run my social media and content without me thinking about it.'],
   array['Writes and schedules on-brand social content daily', 'Tracks engagement and reports on what drives pipeline', 'Integrates with Shopify and your CRM'],
   array['Ecommerce', 'Retail', 'Hospitality'], array['Shopify'], 'Under 1 week', 89, false, 4.7, 64, 51, 240, 2900),
  ('fieldstone-labs', 'improve-recruiting', 'Roster', 'roster', 'Recruiter', 'Screens and ranks applicants against your job description',
   'Roster helps you hire faster without spending your whole day screening resumes — screening and ranking applicants, scheduling interviews, and integrating with Greenhouse and Lever.',
   array['I need to hire faster without spending my whole day screening resumes.'],
   array['Screens and ranks applicants against your job description', 'Schedules interviews and sends candidate updates automatically', 'Integrates with Greenhouse and Lever'],
   array['Professional Services', 'Healthcare', 'Construction'], array['Greenhouse', 'Lever'], 'Same day', 119, false, 4.6, 88, 63, 310, 3600),
  ('fieldstone-labs', 'increase-revenue', 'Pathfinder', 'pathfinder', 'SDR', 'Prospects, personalizes, and sends outbound sequences at scale',
   'Pathfinder builds targeted lead lists, writes personalized multi-touch sequences, and handles replies automatically — booking qualified meetings without a human touching a single email.',
   array['I need to fill my pipeline with qualified outbound meetings without hiring an SDR team.'],
   array['Builds and enriches targeted prospect lists automatically', 'Writes and sends personalized multi-touch sequences', 'Books meetings straight onto reps'' calendars'],
   array['SaaS', 'Professional Services'], array['Salesloft', 'HubSpot', 'LinkedIn Sales Navigator'], 'Under 1 week', 179, true, 4.6, 31, 94, 350, 5400),
  ('fieldstone-labs', 'automate-admin-work', 'Relay', 'relay', 'Executive Assistant', 'Manages inboxes, scheduling, and follow-ups automatically',
   'Relay triages your inbox, schedules meetings across time zones, and drafts follow-ups so nothing falls through the cracks.',
   array['I''m overwhelmed with emails and scheduling and need it off my plate.'],
   array['Triages and drafts responses for your inbox daily', 'Schedules meetings across time zones without back-and-forth', 'Sends automatic follow-ups on stalled threads'],
   array['Professional Services', 'Real Estate', 'SaaS'], array['Google Calendar', 'Slack'], 'Same day', 79, false, 4.7, 45, 38, 260, 2200),
  ('northbeam-ai', 'improve-customer-support', 'Anchor', 'anchor', 'Onboarding Specialist', 'Guides new customers to their first value milestone',
   'Anchor walks new customers through setup, answers onboarding questions instantly, and flags accounts at risk of churning before it happens.',
   array['New customers churn before they ever see value from our product.'],
   array['Guides new users to their first value milestone', 'Answers onboarding questions instantly, 24/7', 'Flags at-risk accounts before they churn'],
   array['SaaS'], array['Intercom', 'Slack'], 'Under 1 week', 139, false, 4.8, 52, 40, 300, 3100),
  ('fieldstone-labs', 'generate-more-leads', 'Beacon', 'beacon', 'Lead Qualifier', 'Qualifies inbound leads against your ICP 24/7',
   'Beacon instantly engages every inbound lead, scores them against your ideal customer profile, and routes the hot ones straight to sales.',
   array['We get plenty of inbound leads but no one qualifies them fast enough.'],
   array['Engages every inbound lead within seconds', 'Scores leads against your ICP automatically', 'Routes qualified leads straight to the right rep'],
   array['SaaS', 'Ecommerce', 'Financial Services'], array['HubSpot', 'Salesforce', 'Slack'], 'Same day', 99, true, 4.7, 73, 81, 330, 3800),
  ('northbeam-ai', 'create-marketing-content', 'Draft', 'draft', 'Content Writer', 'Produces on-brand blog and email content weekly',
   'Draft researches, writes, and edits on-brand blog posts and email campaigns every week, keeping your content calendar full without a writer on payroll.',
   array['Our content output is inconsistent because no one owns it full-time.'],
   array['Publishes on-brand blog posts on a weekly cadence', 'Writes and A/B tests email campaign copy', 'Keeps a rolling content calendar always full'],
   array['SaaS', 'Ecommerce', 'Professional Services'], array['WordPress', 'Mailchimp'], 'Under 1 week', 69, false, 4.5, 28, 22, 210, 1800)
) as e(agency_slug, category_slug, name, slug, role, tagline, description, business_problems, outcomes, industries, integrations, setup_time, price_monthly, featured, avg_rating, total_reviews, total_purchases, avg_roi_percent, expected_monthly_savings)
join public.agencies a on a.slug = e.agency_slug
join public.categories c on c.slug = e.category_slug;

-- The spec calls for "shop by problem, not by technology" — remove any
-- earlier department-style categories (Sales, Marketing, Finance, etc.) so
-- there's one coherent problem-oriented taxonomy. No-op if none exist.
delete from public.categories
where slug in ('sales', 'customer-support', 'marketing', 'finance', 'recruiting', 'operations', 'executive-assistant', 'research-analytics')
  and not exists (select 1 from public.employees e where e.category_id = categories.id);
