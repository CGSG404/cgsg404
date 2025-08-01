# 👨‍💻 Admin System Developer Guide - CGSG404

## 🎯 **OVERVIEW**

Panduan lengkap untuk developer yang akan bekerja dengan sistem admin CGSG404. Sistem ini menggunakan **Supabase RLS (Row Level Security)** dengan **custom functions** untuk permission management yang aman dan scalable.

## 🏗️ **ARSITEKTUR SISTEM**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Database      │
│   (Next.js)     │    │   Client        │    │   Functions     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ AdminContext    │◄──►│ RPC Calls       │◄──►│ is_admin()      │
│ useAdmin()      │    │ Database API    │    │ has_permission()│
│ Components      │    │ Auth State      │    │ get_admin_info()│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔑 **CORE FUNCTIONS**

### **1. `is_admin()` - Check Admin Status**
```sql
-- Returns: boolean
SELECT public.is_admin();
```

**TypeScript Usage:**
```typescript
import { databaseApi } from '@/lib/database-api';

const isAdmin = await databaseApi.isCurrentUserAdmin();
// Returns: true | false
```

### **2. `has_permission(permission_id)` - Check Permission**
```sql
-- Returns: boolean
SELECT public.has_permission('16');
SELECT public.has_permission('25');
```

**TypeScript Usage:**
```typescript
const canCreateCasino = await databaseApi.hasPermission('16');
const canDeleteCasino = await databaseApi.hasPermission('25');
```

### **3. `get_current_user_admin_info()` - Get Admin Details**
```sql
-- Returns: TABLE(email text, role text, total_permissions bigint)
SELECT * FROM public.get_current_user_admin_info();
```

**TypeScript Usage:**
```typescript
const adminInfo = await databaseApi.getCurrentUserAdminInfo();
// Returns: { is_admin: boolean, role: string, email: string, total_permissions: number }
```

## 🎯 **PERMISSION IDS MAPPING**

| Permission ID | Description | Category |
|---------------|-------------|----------|
| **16** | Casino Create | Casino Management |
| **17** | Casino Read | Casino Management |
| **18** | Casino Update | Casino Management |
| **19** | Casino Delete | Casino Management |
| **20** | Casino Publish | Casino Management |
| **21** | News Create | News Management |
| **22** | News Read | News Management |
| **23** | News Update | News Management |
| **24** | News Delete | News Management |
| **25** | News Publish | News Management |

## 🔧 **DEVELOPMENT PATTERNS**

### **Pattern 1: Component-Level Protection**
```typescript
import { useAdmin } from '@/contexts/AdminContext';

function CasinoManagementButton() {
  const { hasPermission } = useAdmin();
  
  // Quick check for UI rendering
  if (!hasPermission('16')) {
    return null; // Hide button
  }
  
  return <button>Create Casino</button>;
}
```

### **Pattern 2: Async Permission Validation**
```typescript
import { useAdmin } from '@/contexts/AdminContext';

function CasinoForm() {
  const { checkPermissionAsync } = useAdmin();
  
  const handleSubmit = async (data) => {
    // Validate permission before action
    const canCreate = await checkPermissionAsync('16');
    if (!canCreate) {
      throw new Error('Insufficient permissions');
    }
    
    // Proceed with creation
    await createCasino(data);
  };
}
```

### **Pattern 3: Route Protection**
```typescript
import { withAdminAuth } from '@/contexts/AdminContext';

const CasinoManagementPage = () => {
  return <div>Casino Management Content</div>;
};

// Protect entire page
export default withAdminAuth(CasinoManagementPage);

// Protect with specific permission
export default withAdminAuth(CasinoManagementPage, '16');
```

### **Pattern 4: API Route Protection**
```typescript
// pages/api/admin/casinos.ts
import { databaseApi } from '@/lib/database-api';

export default async function handler(req, res) {
  // Check admin status
  const isAdmin = await databaseApi.isCurrentUserAdmin();
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  // Check specific permission
  if (req.method === 'POST') {
    const canCreate = await databaseApi.hasPermission('16');
    if (!canCreate) {
      return res.status(403).json({ error: 'Create permission required' });
    }
  }
  
  // Proceed with API logic
}
```

## 🧪 **TESTING GUIDELINES**

### **Unit Testing Admin Functions**
```typescript
// __tests__/admin.test.ts
import { databaseApi } from '@/lib/database-api';

describe('Admin Functions', () => {
  test('should check admin status', async () => {
    const isAdmin = await databaseApi.isCurrentUserAdmin();
    expect(typeof isAdmin).toBe('boolean');
  });
  
  test('should validate permissions', async () => {
    const hasPermission = await databaseApi.hasPermission('16');
    expect(typeof hasPermission).toBe('boolean');
  });
});
```

### **Integration Testing**
```typescript
// Use the provided test script
import { testAdminIntegration } from '@/scripts/test-admin-integration';

// Run integration tests
await testAdminIntegration();
```

## 🚨 **SECURITY BEST PRACTICES**

### **1. Always Validate on Server Side**
```typescript
// ❌ BAD - Only client-side check
const { hasPermission } = useAdmin();
if (hasPermission('16')) {
  // Client can manipulate this
}

// ✅ GOOD - Server-side validation
const canCreate = await databaseApi.hasPermission('16');
if (canCreate) {
  // Validated by database
}
```

### **2. Use Async Checks for Critical Actions**
```typescript
// ❌ BAD - Quick check for critical action
const { hasPermission } = useAdmin();
if (hasPermission('19')) {
  await deleteCasino(id); // Risky
}

// ✅ GOOD - Async validation for critical action
const { checkPermissionAsync } = useAdmin();
const canDelete = await checkPermissionAsync('19');
if (canDelete) {
  await deleteCasino(id); // Safe
}
```

### **3. Log All Admin Activities**
```typescript
import { useAdmin } from '@/contexts/AdminContext';

function AdminAction() {
  const { logActivity } = useAdmin();
  
  const handleAction = async () => {
    try {
      // Perform action
      await performAction();
      
      // Log success
      await logActivity('action_performed', 'resource_type', 'resource_id');
    } catch (error) {
      // Log failure
      await logActivity('action_failed', 'resource_type', 'resource_id', { error: error.message });
    }
  };
}
```

## 🔍 **DEBUGGING TIPS**

### **1. Check Database Functions Directly**
```sql
-- Test in Supabase SQL Editor
SELECT public.is_admin();
SELECT public.has_permission('16');
SELECT * FROM public.get_current_user_admin_info();
```

### **2. Enable Debug Logging**
```typescript
// Add to your component
const { adminInfo } = useAdmin();
console.log('Admin Info:', adminInfo);
console.log('Is Admin:', adminInfo?.is_admin);
console.log('Total Permissions:', adminInfo?.total_permissions);
```

### **3. Test Permission Flow**
```typescript
// Test complete permission flow
const testPermissionFlow = async () => {
  console.log('1. Check admin status:', await databaseApi.isCurrentUserAdmin());
  console.log('2. Get admin info:', await databaseApi.getCurrentUserAdminInfo());
  console.log('3. Test permission 16:', await databaseApi.hasPermission('16'));
  console.log('4. Test permission 25:', await databaseApi.hasPermission('25'));
};
```

## 📝 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: Permission Always Returns False**
**Solution:** Check if user is properly authenticated and exists in `admin_users` table.

### **Issue 2: Functions Not Found**
**Solution:** Ensure database migrations have been run and functions exist in `public` schema.

### **Issue 3: RLS Blocking Access**
**Solution:** Verify RLS policies are using the correct functions and user has admin status.

## 🚀 **DEPLOYMENT CHECKLIST**

- [ ] Database functions deployed
- [ ] RLS policies applied
- [ ] Admin user created
- [ ] Permissions assigned
- [ ] Integration tests passing
- [ ] Frontend components working
- [ ] API routes protected
- [ ] Activity logging functional

## 📞 **SUPPORT**

Jika ada masalah dengan sistem admin:
1. Check database functions di Supabase SQL Editor
2. Verify user ada di `admin_users` table
3. Test permissions dengan script yang disediakan
4. Check browser console untuk error messages
