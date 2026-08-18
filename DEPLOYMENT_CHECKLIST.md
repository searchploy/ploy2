# Authorization Restructuring - Deployment Checklist

## Pre-Deployment Tasks

### Environment Variables (Vercel)
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Verify `STRIPE_SECRET_KEY` is set
- [ ] Verify `STRIPE_WEBHOOK_SECRET` is set
- [ ] Verify `STRIPE_PRICE_ID_BUSINESS_MONTHLY` is set (Ploy Pro price)
- [ ] Verify `STRIPE_PRICE_ID_CONSULTANT_MONTHLY` is set (Consulting Pro price)
- [ ] Verify `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_APP_URL` is set

### Supabase Verification
- [ ] Confirm migration 0009_authorization_restructure.sql was applied to production database
- [ ] Run: `SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles'`
  - [ ] Verify `email_verified` column exists (boolean)
  - [ ] Verify `email_verified_at` column exists (timestamp)
  - [ ] Verify `subscription_type` enum contains only ('pro', 'consulting')
- [ ] Verify RLS policies are enabled on profiles and subscriptions tables
- [ ] Verify `verify_email()` and `handle_new_user()` functions exist

### Stripe Configuration
- [ ] Verify Stripe webhook endpoint is configured:
  - URL: `https://yourdomain.com/api/stripe/webhook`
  - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Signature Secret: Set in STRIPE_WEBHOOK_SECRET env var
- [ ] Verify 2 products exist in Stripe:
  - [ ] "Ploy Pro" (for businesses/agencies)
  - [ ] "Consulting Pro" (for consultants)
- [ ] Verify prices are configured:
  - [ ] STRIPE_PRICE_ID_BUSINESS_MONTHLY points to Ploy Pro monthly price
  - [ ] STRIPE_PRICE_ID_CONSULTANT_MONTHLY points to Consulting Pro monthly price
- [ ] Test webhook delivery (Stripe dashboard → Webhooks → test_mode)

### Code Review Checklist
- [ ] All 12 access scenarios are documented in AUTHORIZATION_TEST_REPORT.md
- [ ] No hardcoded admin emails outside of `src/lib/auth/admin.ts`
- [ ] No client-side only authorization checks
- [ ] All dashboard routes require server-side authorization
- [ ] Email verification is gated before checkout
- [ ] Email verification is gated before dashboard access

### Database Backup
- [ ] Create backup of production Supabase database
- [ ] Export existing user accounts and subscriptions
- [ ] Verify backup can be restored

---

## Staging Deployment

### 1. Deploy to Staging
```bash
git push origin main  # Assume CI/CD deploys to staging
```

### 2. Run Staging Tests (AUTHORIZATION_TEST_REPORT.md)
- [ ] Scenario 1: Non-verified email, no subscription → blocked
- [ ] Scenario 2: Non-verified email, has Stripe sub → blocked
- [ ] Scenario 3: Verified email, no subscription → pricing
- [ ] Scenario 4: Verified pro, access /pro → works
- [ ] Scenario 5: Verified pro, try /consultant → redirected
- [ ] Scenario 6: Verified consulting, access /consultant → works
- [ ] Scenario 7: Verified consulting, try /pro → redirected
- [ ] Scenario 8: Cancel subscription → loses access
- [ ] Scenario 9: Admin, no email verification → works
- [ ] Scenario 10: Admin, no subscription → works
- [ ] Scenario 11: URL bypass attempt → blocked server-side
- [ ] Scenario 12: Webhook updates access immediately

### 3. Email Verification Flow
- [ ] Sign up with new account
- [ ] Receive OTP email (Supabase auth email)
- [ ] Enter OTP at /verify-email
- [ ] Profile.email_verified marked true
- [ ] Redirect to /pricing or dashboard

### 4. Stripe Integration
- [ ] Complete test checkout in Stripe test mode
- [ ] Webhook fires and updates database
- [ ] User gains dashboard access immediately
- [ ] Cancel subscription in Stripe
- [ ] User loses access immediately

### 5. Admin Access
- [ ] Create test account with email: admin@searchploy.com
- [ ] DO NOT verify email
- [ ] Access /dashboard/pro → should work
- [ ] Access /dashboard/consultant → should work
- [ ] Access /dashboard/admin → should work

### 6. Smoke Tests
- [ ] Homepage loads
- [ ] Pricing pages load
- [ ] Report wizard works
- [ ] Marketplace works
- [ ] Profile page works (both verified and unverified users)

### 7. Performance Tests
- [ ] Dashboard page load time < 2s
- [ ] Sign-in redirect < 1s
- [ ] No N+1 queries in dashboard layouts
- [ ] No console errors

---

## Production Deployment

### Pre-Flight Checks
- [ ] All staging tests passed
- [ ] No critical bugs found
- [ ] Rollback plan documented
- [ ] On-call engineer available
- [ ] Monitoring and alerting configured

### Deployment Steps
1. [ ] Merge to `main` branch (if not already)
2. [ ] Trigger production deployment via CI/CD
3. [ ] Monitor deployment progress
4. [ ] Verify environment variables are set
5. [ ] Run database health check
6. [ ] Test Stripe webhook connectivity

### Post-Deployment Verification
- [ ] [ ] Run all 12 scenario tests on production
- [ ] [ ] Test email verification with real email
- [ ] [ ] Test Stripe with test card in production
- [ ] [ ] Monitor error logs for next 1 hour
- [ ] [ ] Check dashboard performance metrics
- [ ] [ ] Verify no spike in 5xx errors
- [ ] [ ] Confirm webhook events are processing

### Rollback Plan (If Issues Found)
1. [ ] Have previous commit hash ready: `69e175c`
2. [ ] Revert to previous version: `git revert HEAD`
3. [ ] Redeploy previous version
4. [ ] Verify old flow still works
5. [ ] Document issue for post-mortem

---

## Post-Deployment Tasks

### Monitoring (First 24 Hours)
- [ ] Monitor error rates in Sentry/NewRelic
- [ ] Monitor Stripe webhook success rate (should be > 99%)
- [ ] Monitor email delivery rate (Supabase sends auth emails)
- [ ] Monitor dashboard access requests
- [ ] Check Supabase logs for RLS policy violations

### User Communication
- [ ] Update help docs about email verification requirement
- [ ] Add FAQ about "Why verify my email?"
- [ ] Monitor support tickets for new issues
- [ ] Update change log / release notes

### Database Maintenance
- [ ] Monitor email_verified status update:
  ```sql
  SELECT COUNT(*), email_verified FROM profiles GROUP BY email_verified
  ```
- [ ] Monitor subscription_type consolidation:
  ```sql
  SELECT COUNT(*), subscription_type FROM profiles GROUP BY subscription_type
  ```
- [ ] Verify no orphaned subscriptions:
  ```sql
  SELECT s.* FROM subscriptions s 
  LEFT JOIN profiles p ON s.profile_id = p.id 
  WHERE p.id IS NULL
  ```

### Performance Analysis (Week 1)
- [ ] Analyze dashboard page load times
- [ ] Check auth flow completion rate
- [ ] Verify Stripe webhook latency
- [ ] Review email verification completion rate

---

## Issues & Troubleshooting

### Common Issues

#### Issue: Users redirected to /verify-email but don't receive email
**Root Cause**: Supabase auth emails not configured  
**Fix**:
1. Ensure NEXT_PUBLIC_SUPABASE_URL and keys are correct
2. Check Supabase email settings (may need to configure SendGrid/Mailgun)
3. Check spam folder for auth emails

#### Issue: User has unverified email but still sees dashboard
**Root Cause**: Session not refreshed, stale profile data  
**Fix**:
1. Check middleware.ts is running (should refresh session on every request)
2. Clear browser cookies and sign out/in again
3. Verify Supabase RLS policies are enabled

#### Issue: Stripe webhook doesn't update dashboard access
**Root Cause**: Webhook not processing or database not updated  
**Fix**:
1. Check webhook delivery in Stripe Dashboard (Developers → Webhooks)
2. Check webhook signature verification (STRIPE_WEBHOOK_SECRET)
3. Check Supabase logs for update errors
4. Manually update subscription_plan in database for testing

#### Issue: Admin account can't bypass email verification
**Root Cause**: ADMIN_EMAIL doesn't match  
**Fix**:
1. Check src/lib/auth/admin.ts - ADMIN_EMAIL constant
2. Ensure user account email EXACTLY matches ADMIN_EMAIL
3. Check for trailing spaces or case differences

---

## Rollback Decision Tree

```
Is the issue blocking user access?
├─ YES → Rollback immediately
│       1. Revert to 69e175c
│       2. Redeploy
│       3. Verify old flow works
│       4. Investigate in non-prod
└─ NO → Monitor & fix in place
        1. If fix is < 15 min: Deploy hotfix
        2. Otherwise: Schedule maintenance window
```

---

## Sign-Off

**Deployment Manager**: _________________ Date: _______

**QA Lead**: _________________ Date: _______

**On-Call Engineer**: _________________ Date: _______

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-18 | 1.0 | Initial deployment checklist |

