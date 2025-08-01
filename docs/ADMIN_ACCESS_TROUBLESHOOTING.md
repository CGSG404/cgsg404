# 🔧 Admin Access Troubleshooting Guide - CGSG404

## 🚨 **PROBLEM DESCRIPTION**

**Symptom:** User is logged in with admin role but gets redirected to login page when accessing `/admin`

**Root Cause:** User account exists in `auth.users` but is not registered in `admin_users` table

## 🔍 **DIAGNOSIS STEPS**

### **1. Quick Check - Use Fix Tool**
Visit: `https://gurusingapore.com/fix-admin`
- Auto-diagnoses the issue
- Provides one-click fix
- Shows detailed status

### **2. Manual Diagnosis**

#### **Check Session**
```sql
-- In Supabase SQL Editor
SELECT 
  auth.uid() as current_user_id,
  u.email,
  u.created_at
FROM auth.users u 
WHERE u.id = auth.uid();
```

#### **Check Admin Registration**
```sql
-- Check if user is in admin_users table
SELECT * FROM public.admin_users 
WHERE user_id = auth.uid();
```

#### **Test RPC Functions**
```sql
-- Test is_admin function
SELECT public.is_admin();

-- Test admin info function
SELECT * FROM public.get_current_user_admin_info();
```

## 🔧 **SOLUTION METHODS**

### **Method 1: Use Fix Tool (Recommended)**
1. Go to `https://gurusingapore.com/fix-admin`
2. Click "Run Diagnosis" to see the issue
3. Click "Fix Admin Access" to register as super admin
4. Page will auto-refresh after fix

### **Method 2: Manual SQL Fix**
```sql
-- Replace 'your-email@example.com' with actual email
DO $$
DECLARE
  user_email TEXT := 'your-email@example.com';
  user_uuid UUID;
BEGIN
  -- Get user ID
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not found: %', user_email;
  END IF;
  
  -- Insert admin record
  INSERT INTO public.admin_users (
    user_id, 
    email, 
    role, 
    is_active,
    created_at,
    updated_at
  ) VALUES (
    user_uuid,
    user_email,
    'super_admin',
    true,
    now(),
    now()
  ) ON CONFLICT (user_id) DO UPDATE SET
    role = 'super_admin',
    is_active = true,
    updated_at = now();
    
  -- Grant all permissions
  INSERT INTO public.admin_role_permissions (admin_user_id, permission_id, granted_by)
  SELECT 
    au.id,
    ap.id,
    user_uuid
  FROM public.admin_users au
  CROSS JOIN public.admin_permissions ap
  WHERE au.user_id = user_uuid
  ON CONFLICT (admin_user_id, permission_id) DO NOTHING;
  
  RAISE NOTICE 'Admin setup completed for: %', user_email;
END $$;
```

### **Method 3: Use RPC Function**
```sql
-- Use built-in setup function
SELECT public.setup_admin_user('your-email@example.com', 'super_admin');
```

### **Method 4: TypeScript API**
```typescript
import { databaseApi } from '@/src/lib/database-api';

// Setup current user as admin
const result = await databaseApi.setupAdminUser(userEmail, 'super_admin');
console.log(result);
```

## 🔄 **VERIFICATION STEPS**

After applying any fix:

1. **Clear browser cache/cookies**
2. **Sign out and sign in again**
3. **Test admin access:**
   ```sql
   SELECT public.is_admin(); -- Should return true
   ```
4. **Visit admin dashboard:** `https://gurusingapore.com/admin`

## 🛡️ **PREVENTION**

### **Auto-Setup for Development**
Add to your development workflow:

```typescript
// In development, auto-setup first user as admin
if (process.env.NODE_ENV === 'development') {
  const setupFirstAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await databaseApi.setupAdminUser(user.email, 'super_admin');
      } catch (error) {
        console.log('Admin already setup or error:', error);
      }
    }
  };
  setupFirstAdmin();
}
```

### **Production Setup**
For production, manually run:
```sql
SELECT public.setup_admin_user('admin@yourcompany.com', 'super_admin');
```

## 🚨 **COMMON ISSUES**

### **Issue 1: RPC Function Not Found**
```
Error: function public.is_admin() does not exist
```
**Solution:** Run migrations to create admin functions
```bash
# Apply migrations
supabase db push
```

### **Issue 2: Permission Denied**
```
Error: permission denied for function is_admin
```
**Solution:** Grant execute permissions
```sql
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
```

### **Issue 3: RLS Policy Blocking**
```
Error: new row violates row-level security policy
```
**Solution:** Temporarily disable RLS or use SECURITY DEFINER functions

### **Issue 4: Session Not Persisting**
**Solution:** Clear all browser data and sign in again

## 📞 **SUPPORT**

If issues persist:

1. **Check browser console** for detailed error messages
2. **Use debug page:** `https://gurusingapore.com/debug-admin`
3. **Check Supabase logs** in dashboard
4. **Verify environment variables** are set correctly

## 🔗 **USEFUL LINKS**

- **Fix Tool:** `https://gurusingapore.com/fix-admin`
- **Debug Page:** `https://gurusingapore.com/debug-admin`
- **Admin Dashboard:** `https://gurusingapore.com/admin`
- **Supabase Dashboard:** Your Supabase project dashboard
