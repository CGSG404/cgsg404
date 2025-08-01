# 🔑 Permission Reference Guide - CGSG404

## 📋 **OVERVIEW**

Dokumentasi lengkap untuk semua permissions yang tersedia di sistem admin CGSG404. Setiap permission memiliki ID unik dan kategori yang jelas.

## 🏗️ **PERMISSION STRUCTURE**

```
Permission ID (String) → Database Function → RLS Policy → UI Component
     "16"           →   has_permission()  →   Row Access   →   Show/Hide
```

## 📊 **PERMISSION CATEGORIES**

### **🏢 CASINO MANAGEMENT (16-20)**

| ID | Name | Description | Usage Example |
|----|------|-------------|---------------|
| **16** | `casino.create` | Create new casinos | Add casino form, bulk import |
| **17** | `casino.read` | View casino details | Casino dashboard, reports |
| **18** | `casino.update` | Edit casino information | Edit forms, quick updates |
| **19** | `casino.delete` | Delete casinos | Delete buttons, bulk delete |
| **20** | `casino.publish` | Publish/unpublish casinos | Status toggles, visibility |

**Code Examples:**
```typescript
// Check casino creation permission
const canCreateCasino = await databaseApi.hasPermission('16');

// Component-level protection
const { hasPermission } = useAdmin();
{hasPermission('18') && <EditCasinoButton />}

// API route protection
if (!(await databaseApi.hasPermission('19'))) {
  return res.status(403).json({ error: 'Delete permission required' });
}
```

### **📰 NEWS MANAGEMENT (21-25)**

| ID | Name | Description | Usage Example |
|----|------|-------------|---------------|
| **21** | `news.create` | Create news articles | Article editor, draft creation |
| **22** | `news.read` | View news articles | News dashboard, analytics |
| **23** | `news.update` | Edit news articles | Edit forms, content updates |
| **24** | `news.delete` | Delete news articles | Delete buttons, archive |
| **25** | `news.publish` | Publish/unpublish news | Publish buttons, scheduling |

**Code Examples:**
```typescript
// News management permissions
const canPublishNews = await databaseApi.hasPermission('25');
const canEditNews = await databaseApi.hasPermission('23');

// Conditional rendering
{hasPermission('21') && <CreateNewsButton />}
{hasPermission('24') && <DeleteNewsButton />}
```

## 🎯 **ROLE-BASED PERMISSIONS**

### **👑 SUPER ADMIN**
- **Access:** ALL permissions (16-25)
- **Special:** Bypasses all permission checks
- **Usage:** `adminInfo.role === 'super_admin'`

```typescript
const { adminInfo } = useAdmin();
if (adminInfo?.role === 'super_admin') {
  // Has access to everything
  return <FullAdminDashboard />;
}
```

### **🔧 ADMIN**
- **Access:** Casino + News management (16-25)
- **Restrictions:** Cannot manage other admins
- **Usage:** Standard admin operations

### **👮 MODERATOR**
- **Access:** Limited permissions (varies by setup)
- **Restrictions:** Read-only or specific content moderation
- **Usage:** Content review and moderation

## 🔍 **PERMISSION CHECKING METHODS**

### **1. Quick Sync Check (UI Rendering)**
```typescript
import { useAdmin } from '@/contexts/AdminContext';

function MyComponent() {
  const { hasPermission } = useAdmin();
  
  return (
    <div>
      {hasPermission('16') && <CreateButton />}
      {hasPermission('19') && <DeleteButton />}
    </div>
  );
}
```

### **2. Async Validation (Critical Actions)**
```typescript
import { useAdmin } from '@/contexts/AdminContext';

function CriticalAction() {
  const { checkPermissionAsync } = useAdmin();
  
  const handleDelete = async () => {
    const canDelete = await checkPermissionAsync('19');
    if (!canDelete) {
      alert('You do not have permission to delete');
      return;
    }
    
    // Proceed with deletion
    await deleteItem();
  };
}
```

### **3. Direct Database Call (Server-Side)**
```typescript
import { databaseApi } from '@/lib/database-api';

// In API routes or server components
const hasCreatePermission = await databaseApi.hasPermission('16');
```

## 🧪 **TESTING PERMISSIONS**

### **SQL Testing (Supabase Editor)**
```sql
-- Test specific permissions
SELECT public.has_permission('16') as can_create_casino;
SELECT public.has_permission('25') as can_publish_news;
SELECT public.has_permission('999') as invalid_permission; -- Should be false

-- Get all admin info
SELECT * FROM public.get_current_user_admin_info();
```

### **Frontend Testing**
```typescript
// Test component
function PermissionTester() {
  const { hasPermission, checkPermissionAsync } = useAdmin();
  const [asyncResults, setAsyncResults] = useState({});
  
  const testPermissions = async () => {
    const permissions = ['16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
    const results = {};
    
    for (const permission of permissions) {
      results[permission] = await checkPermissionAsync(permission);
    }
    
    setAsyncResults(results);
  };
  
  return (
    <div>
      <h3>Sync Results:</h3>
      {['16', '17', '18', '19', '20'].map(id => (
        <div key={id}>
          Permission {id}: {hasPermission(id) ? '✅' : '❌'}
        </div>
      ))}
      
      <button onClick={testPermissions}>Test Async</button>
      
      <h3>Async Results:</h3>
      {Object.entries(asyncResults).map(([id, result]) => (
        <div key={id}>
          Permission {id}: {result ? '✅' : '❌'}
        </div>
      ))}
    </div>
  );
}
```

## 🔒 **SECURITY CONSIDERATIONS**

### **1. Client vs Server Validation**
```typescript
// ❌ NEVER rely only on client-side checks for security
const { hasPermission } = useAdmin();
if (hasPermission('19')) {
  // Client can manipulate this!
  await deleteImportantData();
}

// ✅ ALWAYS validate on server-side for security
const canDelete = await databaseApi.hasPermission('19');
if (canDelete) {
  // Validated by database RLS
  await deleteImportantData();
}
```

### **2. Permission Escalation Prevention**
```typescript
// ❌ BAD - Assuming super admin
if (adminInfo?.role === 'super_admin') {
  // Don't skip permission checks
  await dangerousAction();
}

// ✅ GOOD - Always check permissions
const canPerformAction = await databaseApi.hasPermission('19');
if (canPerformAction) {
  await dangerousAction();
}
```

## 📝 **PERMISSION WORKFLOW**

### **1. Adding New Permissions**
1. Add to `admin_permissions` table
2. Assign to roles in `admin_role_permissions`
3. Update this documentation
4. Add to TypeScript types if needed
5. Test with all role levels

### **2. Modifying Existing Permissions**
1. Update database records
2. Test existing functionality
3. Update documentation
4. Notify team of changes

### **3. Removing Permissions**
1. Remove from `admin_role_permissions`
2. Remove from `admin_permissions`
3. Update code references
4. Test thoroughly

## 🚨 **TROUBLESHOOTING**

### **Permission Always Returns False**
1. Check if user is in `admin_users` table
2. Verify permission exists in `admin_permissions`
3. Check `admin_role_permissions` assignment
4. Test with SQL directly

### **Permission Check Fails**
1. Verify function exists: `SELECT public.has_permission('16');`
2. Check RLS policies are active
3. Ensure user is authenticated
4. Check browser console for errors

### **Inconsistent Results**
1. Use async checks for critical actions
2. Refresh admin info: `refreshAdminInfo()`
3. Check database connection
4. Verify permission ID format (string, not number)

## 📊 **PERMISSION MATRIX**

| Role | Casino Create | Casino Delete | News Create | News Publish | Admin Manage |
|------|---------------|---------------|-------------|--------------|--------------|
| **Super Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Moderator** | ❌ | ❌ | ✅ | ❌ | ❌ |

## 🔄 **PERMISSION UPDATES**

Last Updated: 2025-01-19
Current Version: 1.0
Total Permissions: 25 (IDs 16-25)

**Change Log:**
- 2025-01-19: Initial permission system implementation
- 2025-01-19: Added casino and news management permissions
- 2025-01-19: Implemented RLS integration
