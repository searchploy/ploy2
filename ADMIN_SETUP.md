# Admin Account Setup Guide

## Overview
The admin account (`admin@searchploy.com`) can bypass all paywalls without needing a paid subscription.

## Setup Instructions

### 1. Create Admin User in Supabase

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication → Users**
3. Click **+ Create a new user**
4. Enter the following credentials:
   - **Email**: `admin@searchploy.com`
   - **Password**: `UP8V9+2%TC*hhsg`
5. Make sure the user is **Auto confirm user** (checked)
6. Click **Create user**

#### Option B: Using Supabase CLI
```bash
supabase auth admin create-user --email admin@searchploy.com --password "UP8V9+2%TC*hhsg"
```

### 2. Verify Admin Profile in Database

After creating the user, verify that a profile was created in the `profiles` table:

1. Go to **SQL Editor** in Supabase
2. Run this query to verify the admin profile exists:
```sql
SELECT id, email, role, subscription_type FROM profiles 
WHERE email = 'admin@searchploy.com';
```

3. If no profile exists, create one:
```sql
INSERT INTO profiles (id, email, role, subscription_type, full_name)
SELECT 
  id, 
  'admin@searchploy.com', 
  'admin'::user_role,
  'premium'::subscription_type,
  'Admin'
FROM auth.users 
WHERE email = 'admin@searchploy.com'
AND id NOT IN (SELECT id FROM profiles WHERE email = 'admin@searchploy.com');
```

### 3. Testing Admin Access

1. Sign out of any existing account
2. Go to `http://localhost:3000/sign-in`
3. Login with:
   - Email: `admin@searchploy.com`
   - Password: `UP8V9+2%TC*hhsg`
4. You should now have access to:
   - **Business Dashboard** (`/dashboard/business/*`) - with all Pro features unlocked
   - **Consultant Dashboard** (`/dashboard/consultant/*`) - with all Pro features unlocked
   - **Agency Dashboard** (`/dashboard/agency/*`) - with all Pro features unlocked
   - **Admin Dashboard** (`/dashboard/admin/*`)

## How Paywall Bypass Works

### Architecture
The admin bypass is handled by the `isAdminUser()` function in `/src/lib/auth/admin.ts`:

- When a user logs in with `admin@searchploy.com`, the system identifies them as admin
- The `hasPaywallAccess()` function checks if the user is admin first
- If admin, all paywalls are bypassed regardless of subscription status
- Non-admin users go through normal subscription checks

### Protected Routes
The following routes are protected by paywalls and are accessible to the admin account:

1. **Business Dashboard** (`/dashboard/business/*`)
   - Requires: `subscription_type = 'premium'` OR `subscription_type = 'business'` OR admin
   - Features: Saved reports, Purchases, Invoices, etc.

2. **Consultant Dashboard** (`/dashboard/consultant/*`)
   - Requires: `subscription_type = 'premium'` OR `subscription_type = 'consultant'` OR admin
   - Features: Client CRM, Pipeline, Tasks, Revenue tracking

3. **Agency Dashboard** (`/dashboard/agency/*`)
   - Requires: `subscription_type = 'premium'` OR `subscription_type = 'agency'` OR admin
   - Features: Sales analytics, Team management, Commission tracking

4. **Admin Dashboard** (`/dashboard/admin/*`)
   - Requires: Admin account only
   - Features: Listings management, User management, Analytics

## Resetting Admin Password

If you need to reset the admin password:

1. Go to Supabase Dashboard → **Authentication → Users**
2. Find `admin@searchploy.com`
3. Click the user and select **Reset password**
4. Update to new password: `UP8V9+2%TC*hhsg`

## Environment Variables

Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Troubleshooting

### Admin account still blocked by paywall
- Verify the user email is exactly `admin@searchploy.com` (case-sensitive)
- Check that the profile exists in the database
- Clear browser cache and cookies, then log in again

### Profile not created automatically
- Manually create the profile using the SQL query above
- Ensure the user exists in `auth.users` first

### Can't log in
- Verify the credentials are correct: `admin@searchploy.com` / `UP8V9+2%TC*hhsg`
- Check that the user is **not** auto-confirmed
- Reset the password in Supabase dashboard
