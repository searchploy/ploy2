-- AI tools can now be reached through a website, the Apple App Store, Google
-- Play, or any combination. The access "type" is not stored separately: it is
-- exactly which of the three URL columns are set, so it can never disagree
-- with the links themselves.
--
-- Listings are written straight from the browser to PostgREST, so the form's
-- URL checks are a courtesy. These constraints are the enforcement, for owners
-- and admins alike:
--   * website_url must be http(s) — no javascript:, data: or other schemes
--   * store URLs must be https on Apple's / Google's store hosts; the path is
--     left open so every legitimate store link format passes
--   * every listing keeps at least one way to reach the tool
--
-- Every existing row has an http(s) website_url, so the constraints validate
-- immediately and website-only listings are unaffected.

alter table public.employees
  add column if not exists app_store_url text,
  add column if not exists google_play_url text;

alter table public.employees
  add constraint employees_website_url_safe
    check (website_url is null or website_url ~* '^https?://[^[:space:]]+$'),
  add constraint employees_app_store_url_valid
    check (app_store_url is null or app_store_url ~* '^https://(apps|itunes)\.apple\.com/[^[:space:]]*$'),
  add constraint employees_google_play_url_valid
    check (google_play_url is null or google_play_url ~* '^https://play\.google\.com/[^[:space:]]*$'),
  add constraint employees_has_access_method
    check (coalesce(website_url, app_store_url, google_play_url) is not null);

comment on column public.employees.app_store_url is
  'Apple App Store link for the AI tool (https://apps.apple.com/...). Null when not offered there.';
comment on column public.employees.google_play_url is
  'Google Play link for the AI tool (https://play.google.com/...). Null when not offered there.';
