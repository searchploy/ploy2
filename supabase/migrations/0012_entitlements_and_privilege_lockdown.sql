-- A user can own BOTH products. profiles.subscription_type holds only one
-- value, so a second purchase overwrote the first and revoked access to the
-- other dashboard. Entitlements now come from the subscriptions table, which
-- already supports one row per product.
--
-- That makes these two tables authorization-bearing, so they must not be
-- writable by the user they describe. Both were:
--   * subscriptions: FOR ALL with no WITH CHECK -> a user could insert their
--     own active 'pro' row and self-grant a paid subscription.
--   * profiles: unrestricted UPDATE -> a user could set subscription_plan
--     to 'pro' or role to 'admin' on their own row.
-- Writes to these fields belong to the Stripe webhook (service role, which
-- bypasses RLS entirely).

-- 1. subscriptions: read-only for end users.
drop policy if exists "Users manage own subscription" on public.subscriptions;
-- ("Users can view their own subscription" SELECT policy is kept as-is.)

revoke insert, update, delete on public.subscriptions from authenticated, anon;

-- 2. profiles: users may edit their own display fields, nothing else.
-- RLS decides which row; column grants decide which columns.
revoke update on public.profiles from authenticated, anon;
grant update (full_name, avatar_url, updated_at, stripe_customer_id)
  on public.profiles to authenticated;
