# Admin Account Setup - Paywall Bypass

## Quick Summary
You now have an admin account (`admin@searchploy.com`) that can bypass all three paywalls (Business, Consultant, Agency) without paying.

## Credentials
- **Email**: `admin@searchploy.com`
- **Password**: `UP8V9+2%TC*hhsg`

---

## Step 1: Create the Admin Account in Supabase

### Via Supabase Dashboard:
1. Go to https://supabase.com and login to your project
2. Navigate to **Authentication → Users**
3. Click **+ Create a new user**
4. Fill in:
   - Email: `admin@searchploy.com`
   - Password: `UP8V9+2%TC*hhsg`
5. Enable **Auto confirm user** (toggle on)
6. Click **Create user**

### Via Supabase CLI:
```bash
supabase auth admin create-user \
  --email admin@searchploy.com \
  --password "UP8V9+2%TC*hhsg" \
  --confirm
```

---

## Step 2: Verify the Profile Was Created

Run this SQL in the **SQL Editor**:
```sql
SELECT id, email, role, subscription_type 
FROM profiles 
WHERE email = 'admin@searchploy.com';
```

**If no rows returned**, manually create the profile:
```sql
INSERT INTO profiles (id, email, role, subscription_type, full_name, created_at, updated_at)
SELECT 
  id, 
  'admin@searchploy.com', 
  'admin'::user_role,
  'premium'::subscription_type,
  'Admin',
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@searchploy.com'
ON CONFLICT (id) DO NOTHING;
```

---

## Step 3: Test Admin Access

1. **Sign out** of any existing account
2. Go to `http://localhost:3000/sign-in`
3. Login with admin credentials
4. You should now have access to all dashboards:
   - ✅ **Business Dashboard** (`/dashboard/business/*`)
   - ✅ **Consultant Dashboard** (`/dashboard/consultant/*`)
   - ✅ **Agency Dashboard** (`/dashboard/agency/*`)
   - ✅ **Admin Dashboard** (`/dashboard/admin/*`)

---

## How It Works

### Code Architecture
The admin bypass is implemented via:

1. **Admin Check Function** (`src/lib/auth/admin.ts`):
   ```typescript
   export async function isAdminUser(): Promise<boolean> {
     const user = await getServerUser();
     return user?.email === ADMIN_EMAIL;
   }
   ```

2. **Dashboard Layout Updates**:
   - **Business**: Allows access if `isAdmin || role === "business"`
   - **Consultant**: Allows access if `isAdmin || role === "consultant"`
   - **Agency**: Allows access if `isAdmin || role === "agency"`
   - **Admin**: Requires `isAdmin` check

3. **Subscription Bypass**:
   - Admin users bypass subscription tier checks
   - Free users still have limited feature access (unless admin)
   - Non-admin paid users get features based on their subscription tier

### Files Modified
- `src/lib/auth/admin.ts` - New admin utility
- `src/app/dashboard/business/layout.tsx` - Added admin bypass
- `src/app/dashboard/consultant/layout.tsx` - Added admin bypass
- `src/app/dashboard/agency/layout.tsx` - Added admin bypass

---

## Feature Access by Account Type

| Feature | Free User | Business Pro | Consultant | Agency | Admin |
|---------|-----------|--------------|-----------|--------|-------|
| Marketplace | ✅ | ✅ | ✅ | ✅ | ✅ |
| AI Report (1x) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Business Dashboard | ❌ | ✅ | ❌ | ❌ | ✅ |
| Consultant Dashboard | ❌ | ❌ | ✅ | ❌ | ✅ |
| Agency Dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin Dashboard | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Troubleshooting

### Problem: Still seeing paywall after login
**Solution**: 
- Clear browser cookies: press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
- Sign out and sign in again
- Verify email is exactly `admin@searchploy.com` (case-sensitive)

### Problem: Can't log in
**Solution**:
- Double-check the password: `UP8V9+2%TC*hhsg`
- Go to Supabase → Auth → Users → find the user → click Reset password
- Re-enter the password: `UP8V9+2%TC*hhsg`

### Problem: Profile not found after creating user
**Solution**:
- The profile should auto-create via Supabase's trigger
- If not, manually run the SQL INSERT query above
- Verify the user exists in `auth.users` table first

---

## Resetting the Admin Password

1. Go to **Supabase Dashboard → Authentication → Users**
2. Find `admin@searchploy.com`
3. Click the three dots → **Reset password**
4. Set new password (or use: `UP8V9+2%TC*hhsg`)

---

## Security Notes

- ✅ Admin account is identified by email only (email-based access control)
- ✅ No hardcoded is_admin flag in profiles (future migration can add this)
- ✅ Password is strong (`UP8V9+2%TC*hhsg`)
- ⚠️ Share these credentials only with trusted admins
- ⚠️ In production, consider adding 2FA to the admin account

---

## API Endpoints for Admin Features

Future features can check admin status:
```typescript
import { isAdminUser } from "@/lib/auth/admin";

// In Server Components or Route Handlers
if (await isAdminUser()) {
  // Allow admin-only actions
}
```

---

## What's Next?

- Test all three dashboards with the admin account
- Configure Stripe checkout (when ready)
- Monitor admin account usage for security

For more details, see `ADMIN_SETUP.md`.
