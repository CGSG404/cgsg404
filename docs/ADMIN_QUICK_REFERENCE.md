# ⚡ Admin System Quick Reference - CGSG404

## 🔑 **ESSENTIAL FUNCTIONS**

### **Database Functions (SQL)**
```sql
-- Check admin status
SELECT public.is_admin();

-- Check permission
SELECT public.has_permission('16');

-- Get admin info
SELECT * FROM public.get_current_user_admin_info();
```

### **TypeScript API**
```typescript
import { databaseApi } from '@/lib/database-api';

// Admin status
const isAdmin = await databaseApi.isCurrentUserAdmin();

// Permission check
const canCreate = await databaseApi.hasPermission('16');

// Admin info
const adminInfo = await databaseApi.getCurrentUserAdminInfo();
```

### **React Hooks**
```typescript
import { useAdmin } from '@/contexts/AdminContext';

const { 
  isAdmin,           // boolean
  adminInfo,         // { is_admin, role, email, total_permissions }
  hasPermission,     // (id: string) => boolean (sync)
  checkPermissionAsync, // (id: string) => Promise<boolean>
  refreshAdminInfo,  // () => Promise<void>
  logActivity        // (action, type?, id?, details?) => Promise<void>
} = useAdmin();
```

## 🎯 **PERMISSION IDS**

| ID | Action | Category |
|----|--------|----------|
| **16** | Casino Create | Casino |
| **17** | Casino Read | Casino |
| **18** | Casino Update | Casino |
| **19** | Casino Delete | Casino |
| **20** | Casino Publish | Casino |
| **21** | News Create | News |
| **22** | News Read | News |
| **23** | News Update | News |
| **24** | News Delete | News |
| **25** | News Publish | News |

## 🔧 **COMMON PATTERNS**

### **Component Protection**
```typescript
// Hide component
{hasPermission('16') && <CreateButton />}

// Disable component
<button disabled={!hasPermission('19')}>Delete</button>

// Conditional rendering
const canEdit = hasPermission('18');
return canEdit ? <EditForm /> : <ReadOnlyView />;
```

### **Route Protection**
```typescript
import { withAdminAuth } from '@/contexts/AdminContext';

// Protect entire page
export default withAdminAuth(AdminPage);

// Protect with specific permission
export default withAdminAuth(CasinoManagement, '16');
```

### **API Protection**
```typescript
// In API route
const isAdmin = await databaseApi.isCurrentUserAdmin();
if (!isAdmin) return res.status(403).json({ error: 'Admin required' });

const canCreate = await databaseApi.hasPermission('16');
if (!canCreate) return res.status(403).json({ error: 'Permission denied' });
```

### **Async Validation**
```typescript
const handleCriticalAction = async () => {
  const hasAccess = await checkPermissionAsync('19');
  if (!hasAccess) {
    alert('Permission denied');
    return;
  }
  
  // Proceed with action
  await performAction();
  
  // Log activity
  await logActivity('action_performed', 'resource', 'id');
};
```

## 🚨 **TROUBLESHOOTING**

### **Quick Checks**
```sql
-- User in admin table?
SELECT * FROM admin_users WHERE email = 'user@example.com';

-- Functions exist?
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name = 'is_admin';

-- Test permission directly
SELECT public.has_permission('16');
```

### **Common Fixes**
```sql
-- Add user as admin
SELECT public.setup_admin_user('user@example.com', 'admin');

-- Activate user
UPDATE admin_users SET is_active = true WHERE email = 'user@example.com';

-- Assign permission
INSERT INTO admin_role_permissions (admin_user_id, permission_id)
VALUES ((SELECT id FROM admin_users WHERE email = 'user@example.com'), 16);
```

### **Debug Component**
```typescript
function QuickDebug() {
  const { adminInfo, isAdmin } = useAdmin();
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, background: 'yellow', padding: '5px' }}>
      Admin: {isAdmin ? '✅' : '❌'} | 
      Role: {adminInfo?.role} | 
      Perms: {adminInfo?.total_permissions}
    </div>
  );
}
```

## 🔄 **ROLE HIERARCHY**

```
Super Admin (super_admin)
├── All permissions (16-25)
├── Can manage other admins
└── Bypasses permission checks

Admin (admin)
├── Casino permissions (16-20)
├── News permissions (21-25)
└── Cannot manage admins

Moderator (moderator)
├── Limited permissions
└── Content moderation only
```

## 📝 **SETUP CHECKLIST**

### **New Admin User**
- [ ] User signed up with Google
- [ ] Added to `admin_users` table
- [ ] Role assigned (`super_admin`, `admin`, `moderator`)
- [ ] Permissions assigned in `admin_role_permissions`
- [ ] User is active (`is_active = true`)
- [ ] Test login and permissions

### **New Permission**
- [ ] Added to `admin_permissions` table
- [ ] Assigned to appropriate roles
- [ ] Updated documentation
- [ ] Added to TypeScript types
- [ ] Tested with all role levels

## 🎯 **TESTING COMMANDS**

### **SQL Tests**
```sql
-- Full admin test
SELECT 
  public.is_admin() as is_admin,
  public.has_permission('16') as can_create_casino,
  public.has_permission('25') as can_publish_news;

-- Admin info
SELECT * FROM public.get_current_user_admin_info();
```

### **TypeScript Tests**
```typescript
// Quick test function
const testAdmin = async () => {
  console.log('Is Admin:', await databaseApi.isCurrentUserAdmin());
  console.log('Admin Info:', await databaseApi.getCurrentUserAdminInfo());
  console.log('Can Create Casino:', await databaseApi.hasPermission('16'));
  console.log('Can Delete Casino:', await databaseApi.hasPermission('19'));
};
```

## 🔗 **USEFUL QUERIES**

### **User Management**
```sql
-- List all admins
SELECT email, role, is_active FROM admin_users ORDER BY role, email;

-- User permissions
SELECT 
  au.email,
  au.role,
  COUNT(arp.permission_id) as permission_count
FROM admin_users au
LEFT JOIN admin_role_permissions arp ON au.id = arp.admin_user_id
GROUP BY au.id, au.email, au.role;

-- Permission usage
SELECT 
  ap.name,
  COUNT(arp.admin_user_id) as user_count
FROM admin_permissions ap
LEFT JOIN admin_role_permissions arp ON ap.id = arp.permission_id
GROUP BY ap.id, ap.name
ORDER BY user_count DESC;
```

### **Activity Monitoring**
```sql
-- Recent admin activities
SELECT 
  au.email,
  aal.action,
  aal.resource_type,
  aal.created_at
FROM admin_activity_logs aal
JOIN admin_users au ON aal.admin_user_id = au.id
ORDER BY aal.created_at DESC
LIMIT 10;
```

## 📞 **EMERGENCY CONTACTS**

### **Database Issues**
1. Check Supabase dashboard
2. Test functions in SQL Editor
3. Verify RLS policies

### **Frontend Issues**
1. Check browser console
2. Test auth state
3. Refresh admin context

### **Permission Issues**
1. Verify user in admin_users
2. Check role assignments
3. Test with SQL directly

---

**💡 Tip:** Bookmark this page for quick reference during development!
