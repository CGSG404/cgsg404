# 🔐 Admin Role System Setup Guide - CGSG404

## 🎯 **OVERVIEW**

Sistem admin role telah diimplementasikan dengan security yang ketat untuk melindungi dashboard admin. Hanya email yang telah didaftarkan sebagai admin yang dapat mengakses fitur admin dashboard.

## ✅ **YANG TELAH DIIMPLEMENTASIKAN**

### **1. Database Schema** 🗄️
- **`admin_users`** - Tabel untuk menyimpan admin users
- **`admin_permissions`** - Tabel untuk permissions granular
- **`admin_role_permissions`** - Many-to-many relationship
- **`admin_activity_logs`** - Audit trail untuk semua aktivitas admin

### **2. Role Hierarchy** 👑
- **Super Admin** - Full access ke semua fitur
- **Admin** - Access ke casino & news management
- **Moderator** - Access ke content moderation saja

### **3. Permission System** 🔑
- **Casino Management** - Create, read, update, delete casinos
- **News Management** - Manage news articles
- **User Management** - Manage user accounts
- **Content Moderation** - Moderate comments & ratings
- **Analytics** - View platform statistics
- **System Administration** - Manage admin users & settings

### **4. Security Features** 🛡️
- **Row Level Security (RLS)** - Database level protection
- **Permission-based Access** - Granular permission checking
- **Activity Logging** - Audit trail untuk semua actions
- **Context Protection** - React context untuk state management

## 🚀 **SETUP INSTRUCTIONS**

### **STEP 1: Jalankan Database Migrations**

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com
   - Pilih project CGSG404

2. **Jalankan Admin Schema Migration**
   - Buka SQL Editor
   - Copy paste isi file `supabase/migrations/20250119000003_create_admin_roles.sql`
   - Klik "Run" untuk membuat admin tables

3. **Jalankan Admin Setup Migration**
   - Copy paste isi file `supabase/migrations/20250119000004_setup_initial_admin.sql`
   - Klik "Run" untuk setup admin functions

### **STEP 2: Setup Your Admin Account**

1. **Sign In dengan Google**
   - Buka aplikasi Anda di http://localhost:3000
   - Klik "Sign In" dan login dengan Google menggunakan email yang ingin dijadikan admin

2. **Get Your User ID**
   - Di Supabase Dashboard, buka SQL Editor
   - Jalankan query ini untuk mendapatkan user ID Anda:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```

3. **Setup Admin User**
   - Jalankan function untuk setup admin:
   ```sql
   SELECT public.setup_admin_user('your-email@example.com', 'super_admin');
   ```
   - Ganti `'your-email@example.com'` dengan email Anda yang sebenarnya

### **STEP 3: Verify Admin Access**

1. **Check Admin Status**
   ```sql
   SELECT * FROM public.get_current_user_admin_info();
   ```

2. **Test Admin Functions**
   ```sql
   -- Check if you're admin
   SELECT public.is_admin();
   
   -- Check specific permission
   SELECT public.has_permission('casino.create');
   
   -- View all admin users
   SELECT * FROM public.get_all_admin_users();
   ```

## 🔧 **USAGE IN CODE**

### **Check Admin Status**
```typescript
import { useAdmin } from '@/contexts/AdminContext';

function MyComponent() {
  const { isAdmin, adminInfo, hasPermission, checkPermissionAsync } = useAdmin();

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Welcome Admin: {adminInfo?.email}</h1>
      <p>Role: {adminInfo?.role}</p>
      <p>Total Permissions: {adminInfo?.total_permissions}</p>

      {/* Quick permission check (sync) */}
      {hasPermission('16') && (
        <button>Quick Action</button>
      )}

      {/* Accurate permission check (async) */}
      <AsyncPermissionButton permissionId="25" />
    </div>
  );
}

// Component with async permission checking
function AsyncPermissionButton({ permissionId }: { permissionId: string }) {
  const { checkPermissionAsync } = useAdmin();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissionAsync(permissionId).then(setHasAccess);
  }, [permissionId, checkPermissionAsync]);

  if (hasAccess === null) return <div>Checking permission...</div>;
  if (!hasAccess) return null;

  return <button>Restricted Action</button>;
}
```

### **Protect Admin Routes**
```typescript
import { withAdminAuth } from '@/contexts/AdminContext';

const AdminDashboard = () => {
  return <div>Admin Dashboard Content</div>;
};

// Protect entire component
export default withAdminAuth(AdminDashboard);

// Protect with specific permission
export default withAdminAuth(AdminDashboard, 'casino.create');
```

### **Log Admin Activity**
```typescript
import { useAdmin } from '@/contexts/AdminContext';

function CasinoForm() {
  const { logActivity } = useAdmin();

  const handleCreateCasino = async (casinoData) => {
    // Create casino logic...

    // Log the activity
    await logActivity(
      'casino_created',
      'casino',
      casinoId,
      { name: casinoData.name, rating: casinoData.rating }
    );
  };
}
```

### **Direct Database API Usage**
```typescript
import { databaseApi } from '@/lib/database-api';

// Check admin status
const isAdmin = await databaseApi.isCurrentUserAdmin();

// Get detailed admin info
const adminInfo = await databaseApi.getCurrentUserAdminInfo();
console.log(adminInfo); // { is_admin: true, role: 'super_admin', email: '...', total_permissions: 25 }

// Check specific permission
const canCreateCasino = await databaseApi.hasPermission('16');

// Get all permissions
const permissions = await databaseApi.getAdminPermissions();

// Log activity
await databaseApi.logAdminActivity('user_login', 'auth', userId);
```

### **Database Functions (SQL)**
```sql
-- Check if current user is admin
SELECT public.is_admin();

-- Check specific permission
SELECT public.has_permission('16');

-- Get admin info
SELECT * FROM public.get_current_user_admin_info();
```
```

## 🎯 **PERMISSION CATEGORIES**

### **Casino Management**
- `casino.create` - Create new casinos
- `casino.read` - View casino details
- `casino.update` - Edit casino information
- `casino.delete` - Delete casinos
- `casino.publish` - Publish/unpublish casinos

### **News Management**
- `news.create` - Create news articles
- `news.read` - View news articles
- `news.update` - Edit news articles
- `news.delete` - Delete news articles
- `news.publish` - Publish/unpublish news

### **User Management**
- `user.read` - View user profiles
- `user.update` - Edit user profiles
- `user.ban` - Ban/unban users
- `user.delete` - Delete user accounts

### **Content Moderation**
- `comment.moderate` - Moderate user comments
- `rating.moderate` - Moderate user ratings
- `report.handle` - Handle user reports

### **Analytics & Reports**
- `analytics.view` - View analytics dashboard
- `report.generate` - Generate reports
- `stats.view` - View platform statistics

### **System Administration**
- `admin.create` - Create new admin users
- `admin.update` - Edit admin users
- `admin.delete` - Delete admin users
- `system.settings` - Manage system settings
- `backup.manage` - Manage backups

## 🛡️ **SECURITY FEATURES**

### **Database Level Security**
- **RLS Policies** - Row level security untuk semua admin tables
- **Function Security** - SECURITY DEFINER functions
- **Permission Checks** - Database level permission validation

### **Application Level Security**
- **Context Protection** - React context untuk admin state
- **Route Protection** - HOC untuk protect admin routes
- **Permission Guards** - Component level permission checking

### **Audit Trail**
- **Activity Logging** - Semua admin actions ter-log
- **IP Tracking** - Track IP address untuk security
- **User Agent** - Track browser/device information

## 🔍 **TROUBLESHOOTING**

### **Common Issues:**

1. **"User is not an admin" Error**
   - Pastikan Anda sudah menjalankan `setup_admin_user` function
   - Check apakah email Anda ada di `admin_users` table

2. **Permission Denied**
   - Check permissions dengan `SELECT * FROM admin_role_permissions WHERE admin_user_id = 'your-id'`
   - Pastikan role Anda memiliki permission yang diperlukan

3. **RLS Policy Errors**
   - Pastikan Anda login dengan user yang benar
   - Check apakah `is_active = true` di admin_users table

### **Debug Queries:**
```sql
-- Check your admin status
SELECT 
  au.*,
  array_agg(ap.name) as permissions
FROM admin_users au
LEFT JOIN admin_role_permissions arp ON au.id = arp.admin_user_id
LEFT JOIN admin_permissions ap ON arp.permission_id = ap.id
WHERE au.email = 'your-email@example.com'
GROUP BY au.id;

-- Check all admin users
SELECT email, role, is_active, created_at FROM admin_users ORDER BY created_at;

-- Check recent admin activity
SELECT 
  al.*,
  au.email
FROM admin_activity_logs al
JOIN admin_users au ON al.admin_user_id = au.id
ORDER BY al.created_at DESC
LIMIT 10;
```

## 🎉 **NEXT STEPS**

Setelah admin system setup selesai:

1. **Test Admin Access** - Login dan verify admin status
2. **Add More Admins** - Gunakan `setup_admin_user` function
3. **Build Admin Dashboard** - Mulai development dashboard admin
4. **Setup Monitoring** - Monitor admin activity logs

---

**🔐 Admin role system sekarang ready untuk development dashboard admin yang secure dan professional!**
