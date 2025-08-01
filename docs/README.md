# 📚 CGSG404 Admin System Documentation

## 🎯 **OVERVIEW**

Selamat datang di dokumentasi lengkap sistem admin CGSG404! Sistem ini dibangun dengan fokus pada **keamanan**, **skalabilitas**, dan **kemudahan penggunaan**.

## 🗂️ **DOKUMENTASI INDEX**

### **🚀 GETTING STARTED**
1. **[Admin Setup Guide](../ADMIN_SETUP_GUIDE.md)**
   - Setup awal sistem admin
   - Konfigurasi database
   - Membuat admin user pertama
   - Testing instalasi

### **👨‍💻 FOR DEVELOPERS**
2. **[Developer Guide](ADMIN_DEVELOPER_GUIDE.md)**
   - Arsitektur sistem
   - Development patterns
   - Security best practices
   - Testing guidelines

3. **[Permission Reference](PERMISSION_REFERENCE.md)**
   - Daftar lengkap permissions
   - Permission categories
   - Role-based access matrix
   - Usage examples

4. **[Quick Reference](ADMIN_QUICK_REFERENCE.md)**
   - Cheat sheet untuk developer
   - Common patterns
   - Essential functions
   - Troubleshooting commands

### **🔧 SUPPORT & MAINTENANCE**
5. **[Troubleshooting Guide](ADMIN_TROUBLESHOOTING.md)**
   - Common issues & solutions
   - Diagnostic tools
   - Recovery procedures
   - Performance optimization

## 🏗️ **SYSTEM ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────┐
│                    CGSG404 Admin System                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Frontend   │    │  Supabase   │    │  Database   │     │
│  │  (Next.js)  │◄──►│   Client    │◄──►│  Functions  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ AdminContext│    │ Database API│    │ RLS Policies│     │
│  │ useAdmin()  │◄──►│ Functions   │◄──►│ Row Security│     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 **KEY COMPONENTS**

### **Database Layer**
- **Functions:** `is_admin()`, `has_permission()`, `get_current_user_admin_info()`
- **Tables:** `admin_users`, `admin_permissions`, `admin_role_permissions`
- **Security:** Row Level Security (RLS) policies

### **API Layer**
- **Database API:** TypeScript wrapper untuk database functions
- **Supabase Client:** Authentication dan real-time features
- **Error Handling:** Comprehensive error management

### **Frontend Layer**
- **AdminContext:** React context untuk state management
- **useAdmin Hook:** Easy access ke admin functionality
- **HOC Protection:** `withAdminAuth` untuk route protection

## 🎯 **QUICK START**

### **1. Check Admin Status**
```typescript
import { useAdmin } from '@/contexts/AdminContext';

function MyComponent() {
  const { isAdmin, adminInfo } = useAdmin();
  
  if (!isAdmin) return <div>Access Denied</div>;
  
  return <div>Welcome {adminInfo?.email}!</div>;
}
```

### **2. Check Permissions**
```typescript
const { hasPermission, checkPermissionAsync } = useAdmin();

// Quick check (sync)
{hasPermission('16') && <CreateButton />}

// Accurate check (async)
const canDelete = await checkPermissionAsync('19');
```

### **3. Protect Routes**
```typescript
import { withAdminAuth } from '@/contexts/AdminContext';

const AdminPage = () => <div>Admin Content</div>;
export default withAdminAuth(AdminPage, '16'); // Requires permission 16
```

## 📊 **PERMISSION SYSTEM**

### **Role Hierarchy**
```
Super Admin (super_admin)
├── All permissions (16-25)
├── Can manage other admins
└── Bypasses all checks

Admin (admin)  
├── Casino management (16-20)
├── News management (21-25)
└── Cannot manage admins

Moderator (moderator)
├── Limited permissions
└── Content moderation only
```

### **Permission Categories**
- **Casino Management (16-20):** Create, read, update, delete, publish casinos
- **News Management (21-25):** Create, read, update, delete, publish news
- **User Management:** Manage user accounts and profiles
- **System Administration:** Manage admin users and settings

## 🔒 **SECURITY FEATURES**

### **Database Level**
- ✅ **Row Level Security (RLS)** - Database-enforced access control
- ✅ **Function Security** - SECURITY DEFINER functions
- ✅ **Permission Validation** - Real-time permission checking

### **Application Level**
- ✅ **Context Protection** - React context state management
- ✅ **Route Guards** - HOC-based route protection
- ✅ **API Protection** - Server-side permission validation

### **Audit & Monitoring**
- ✅ **Activity Logging** - All admin actions logged
- ✅ **IP Tracking** - Security monitoring
- ✅ **Error Tracking** - Comprehensive error logging

## 🧪 **TESTING**

### **Database Testing**
```sql
-- Test in Supabase SQL Editor
SELECT public.is_admin();
SELECT public.has_permission('16');
SELECT * FROM public.get_current_user_admin_info();
```

### **Frontend Testing**
```typescript
// Use provided test components
import { AdminPermissionDemo } from '@/components/admin/AdminPermissionDemo';
import { testAdminIntegration } from '@/scripts/test-admin-integration';
```

## 🚨 **COMMON ISSUES**

| Issue | Quick Fix |
|-------|-----------|
| Access Denied | Check if user in `admin_users` table |
| Permission Denied | Verify permission assignment |
| Function Not Found | Re-run database migrations |
| Context Not Updating | Call `refreshAdminInfo()` |

## 📞 **SUPPORT**

### **Self-Help Resources**
1. **[Troubleshooting Guide](ADMIN_TROUBLESHOOTING.md)** - Comprehensive problem solving
2. **[Quick Reference](ADMIN_QUICK_REFERENCE.md)** - Fast solutions
3. **Browser Console** - Check for error messages
4. **Supabase Dashboard** - Test database functions directly

### **Escalation Process**
1. **Level 1:** Use diagnostic tools and troubleshooting guide
2. **Level 2:** Check database directly in Supabase SQL Editor
3. **Level 3:** Review system logs and recent changes

## 🔄 **UPDATES & MAINTENANCE**

### **Version History**
- **v1.0** (2025-01-19): Initial admin system implementation
- **v1.1** (2025-01-19): Added comprehensive documentation
- **v1.2** (2025-01-19): Enhanced permission system

### **Maintenance Tasks**
- [ ] Regular permission audits
- [ ] Activity log cleanup
- [ ] Performance monitoring
- [ ] Security reviews

## 🎯 **ROADMAP**

### **Planned Features**
- [ ] Permission management UI
- [ ] Role-based dashboard customization
- [ ] Advanced audit reporting
- [ ] Bulk user management
- [ ] API rate limiting
- [ ] Advanced security features

---

**📝 Note:** Dokumentasi ini akan terus diupdate seiring dengan perkembangan sistem. Pastikan untuk selalu menggunakan versi terbaru.

**🔗 Links:**
- [Main README](../README.md)
- [Admin Setup Guide](../ADMIN_SETUP_GUIDE.md)
- [Supabase Dashboard](https://supabase.com/dashboard)

**📧 Questions?** Check the troubleshooting guide atau test langsung di Supabase SQL Editor.
