-- Fields the marketplace listing MVP needs that have no existing home.
-- Everything else reuses existing columns:
--   AI Employee Name -> name          Tagline      -> tagline
--   Category         -> category_id   Description  -> description
--   Best For         -> industries[]  Logo         -> thumbnail_url
--   Agency Name      -> agency_name   Status       -> status / is_published

alter table public.employees
  -- Where Ploy refers interested businesses. Ploy does not process the sale.
  add column if not exists website_url text,
  -- "Primary Tasks" — what the AI employee actually does (max 5, enforced in UI).
  add column if not exists primary_tasks text[],
  -- Optional free-text expansion on the "Best For" selections.
  add column if not exists best_for_description text;
