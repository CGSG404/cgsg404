# 🔧 Admin System Troubleshooting Guide - CGSG404

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **1. 🔒 "Access Denied" - User Cannot Access Admin Features**

**Symptoms:**
- `isAdmin` returns `false`
- Admin dashboard shows "Access Denied"
- User exists but cannot access admin features

**Diagnosis:**
```sql
-- Check if user exists in admin_users table
SELECT * FROM public.admin_users WHERE email = 'user@example.com';

-- Check if user is active
SELECT email, is_active, role FROM public.admin_users WHERE email = 'user@example.com';

-- Check current auth user
SELECT auth.uid(), auth.email();
```

**Solutions:**
1. **Add user to admin_users table:**
```sql
-- Method 1: Use setup function
SELECT public.setup_admin_user('user@example.com', 'admin');

-- Method 2: Manual insert
INSERT INTO public.admin_users (user_id, email, role, is_active)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'user@example.com'),
  'user@example.com',
  'admin',
  true
);
```

2. **Activate existing user:**
```sql
UPDATE public.admin_users 
SET is_active = true 
WHERE email = 'user@example.com';
```

---

### **2. 🔑 "Permission Denied" - Specific Actions Blocked**

**Symptoms:**
- `hasPermission('16')` returns `false`
- User is admin but cannot perform specific actions
- Some features work, others don't

**Diagnosis:**
```sql
-- Check user's permissions
SELECT 
  au.email,
  au.role,
  arp.permission_id,
  ap.name as permission_name
FROM admin_users au
LEFT JOIN admin_role_permissions arp ON au.id = arp.admin_user_id
LEFT JOIN admin_permissions ap ON arp.permission_id = ap.id
WHERE au.email = 'user@example.com';

-- Test specific permission
SELECT public.has_permission('16');
```

**Solutions:**
1. **Assign missing permissions:**
```sql
-- Get user ID
SELECT id FROM admin_users WHERE email = 'user@example.com';

-- Assign permission (replace USER_ID and PERMISSION_ID)
INSERT INTO admin_role_permissions (admin_user_id, permission_id)
VALUES ('USER_ID', PERMISSION_ID);
```

2. **Bulk assign permissions for role:**
```sql
-- Assign all casino permissions (16-20) to user
INSERT INTO admin_role_permissions (admin_user_id, permission_id)
SELECT 
  (SELECT id FROM admin_users WHERE email = 'user@example.com'),
  generate_series(16, 20);
```

---

### **3. 🔄 "Function Not Found" - Database Functions Missing**

**Symptoms:**
- Error: `function public.is_admin() does not exist`
- Error: `function public.has_permission(text) does not exist`
- Database API calls fail

**Diagnosis:**
```sql
-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('is_admin', 'has_permission', 'get_current_user_admin_info');
```

**Solutions:**
1. **Recreate functions:**
```sql
-- Run the function creation scripts
-- (Copy from the original function creation queries)

-- Test functions
SELECT public.is_admin();
SELECT public.has_permission('16');
SELECT * FROM public.get_current_user_admin_info();
```

---

### **4. 🔐 "RLS Policy Blocking" - Row Level Security Issues**

**Symptoms:**
- Cannot read admin tables
- Empty results from admin queries
- Permission functions work but data access fails

**Diagnosis:**
```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'admin_%';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename LIKE 'admin_%';
```

**Solutions:**
1. **Verify RLS policies use correct functions:**
```sql
-- Example: Update policy to use our functions
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users" ON public.admin_users 
FOR SELECT USING (public.is_admin());
```

---

### **5. 🔄 "Context Not Updating" - Frontend State Issues**

**Symptoms:**
- Admin status doesn't update after login
- Permission changes don't reflect in UI
- Stale admin information

**Diagnosis:**
```typescript
// Add debug logging
const { adminInfo, isAdmin } = useAdmin();
console.log('Admin Info:', adminInfo);
console.log('Is Admin:', isAdmin);
```

**Solutions:**
1. **Force refresh admin info:**
```typescript
const { refreshAdminInfo } = useAdmin();
await refreshAdminInfo();
```

2. **Check auth state:**
```typescript
import { useAuth } from '@/contexts/AuthContext';
const { user } = useAuth();
console.log('Auth User:', user);
```

---

### **6. 🌐 "API Route Protection Failing" - Server-Side Issues**

**Symptoms:**
- API routes allow unauthorized access
- Server-side permission checks fail
- Inconsistent behavior between client and server

**Diagnosis:**
```typescript
// Add logging to API route
console.log('Auth header:', req.headers.authorization);
console.log('User ID:', await supabase.auth.getUser());
```

**Solutions:**
1. **Ensure proper auth in API routes:**
```typescript
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Check admin status
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
}
```

---

## 🔍 **DIAGNOSTIC TOOLS**

### **1. Admin Status Checker**
```typescript
// Add this component to any page for debugging
function AdminDebugger() {
  const { adminInfo, isAdmin } = useAdmin();
  const { user } = useAuth();
  
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, background: 'white', padding: '10px', border: '1px solid black' }}>
      <h4>Admin Debug Info</h4>
      <p>Auth User: {user?.email || 'Not logged in'}</p>
      <p>Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
      <p>Role: {adminInfo?.role || 'None'}</p>
      <p>Email: {adminInfo?.email || 'None'}</p>
      <p>Permissions: {adminInfo?.total_permissions || 0}</p>
    </div>
  );
}
```

### **2. Permission Tester**
```typescript
function PermissionTester() {
  const [results, setResults] = useState({});
  
  const testPermissions = async () => {
    const permissions = ['16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
    const newResults = {};
    
    for (const permission of permissions) {
      try {
        newResults[permission] = await databaseApi.hasPermission(permission);
      } catch (error) {
        newResults[permission] = `Error: ${error.message}`;
      }
    }
    
    setResults(newResults);
  };
  
  return (
    <div>
      <button onClick={testPermissions}>Test All Permissions</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
```

### **3. Database Connection Tester**
```sql
-- Run in Supabase SQL Editor
SELECT 
  'Database Connection' as test,
  current_user as db_user,
  current_database() as db_name,
  now() as current_time;

SELECT 
  'Auth Status' as test,
  auth.uid() as user_id,
  auth.email() as user_email;

SELECT 
  'Admin Functions' as test,
  public.is_admin() as is_admin_result;
```

## 🚀 **PERFORMANCE TROUBLESHOOTING**

### **Slow Permission Checks**
1. **Use sync checks for UI rendering:**
```typescript
// Fast for UI
const { hasPermission } = useAdmin();

// Slow for UI, use for critical actions only
const canDelete = await checkPermissionAsync('19');
```

2. **Cache admin info:**
```typescript
// Admin info is cached in context, refresh only when needed
const { refreshAdminInfo } = useAdmin();
```

## 📞 **ESCALATION PROCESS**

### **Level 1: Self-Diagnosis**
1. Check browser console for errors
2. Test database functions directly in Supabase
3. Verify user authentication status
4. Use diagnostic tools above

### **Level 2: Database Investigation**
1. Check admin_users table
2. Verify admin_role_permissions assignments
3. Test RLS policies
4. Check function definitions

### **Level 3: System-Wide Issues**
1. Check Supabase service status
2. Verify environment variables
3. Check deployment status
4. Review recent changes

## 📋 **QUICK FIXES CHECKLIST**

- [ ] User logged in with correct email?
- [ ] User exists in `admin_users` table?
- [ ] User is active (`is_active = true`)?
- [ ] Required permissions assigned?
- [ ] Database functions exist and working?
- [ ] RLS policies using correct functions?
- [ ] Frontend context refreshed?
- [ ] API routes properly protected?
- [ ] Environment variables correct?
- [ ] No browser cache issues?

## 🔄 **Recovery Procedures**

### **Reset User Admin Status**
```sql
-- Remove and re-add user
DELETE FROM admin_role_permissions WHERE admin_user_id = (SELECT id FROM admin_users WHERE email = 'user@example.com');
DELETE FROM admin_users WHERE email = 'user@example.com';

-- Re-setup user
SELECT public.setup_admin_user('user@example.com', 'super_admin');
```

### **Reset All Permissions**
```sql
-- Backup first!
-- Then re-run permission assignment scripts
```

### **Emergency Admin Access**
```sql
-- Create emergency super admin (use carefully!)
SELECT public.setup_admin_user('emergency@example.com', 'super_admin');
```
