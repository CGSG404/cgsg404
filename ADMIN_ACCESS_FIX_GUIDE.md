# 🚨 Admin Access Fix Guide - CGSG404

## **Problem Description**
Admin button tidak muncul di navbar dan tidak bisa mengakses halaman `/admin` meskipun sudah login dengan akun Google yang seharusnya memiliki role admin.

## **🔍 Diagnosis Steps**

### **Step 1: Check Current Status**
1. Buka browser dan login ke website dengan akun Google Anda
2. Buka halaman debug: `https://yoursite.com/debug-admin`
3. Klik tombol "Refresh Admin Status"
4. Periksa hasil debug information

### **Step 2: Identify the Issue**
Dari debug information, periksa:
- **User Info**: Apakah user ID dan email sudah benar?
- **Admin Status**: Apakah `is_admin` menunjukkan `false`?
- **Database**: Apakah ada error saat mengakses database?

## **🛠 Solution Methods**

### **Method 1: Using Debug Page (Recommended)**
1. Buka `/debug-admin`
2. Klik "Setup as Super Admin (Function)" - coba ini dulu
3. Jika gagal, coba "Manual Admin Setup"
4. Refresh halaman dan cek status

### **Method 2: Using Script (Production)**
1. Pastikan Anda memiliki akses ke server/environment variables
2. Tambahkan `SUPABASE_SERVICE_ROLE_KEY` ke `.env.local`
3. Jalankan script:
   ```bash
   node scripts/setup-admin-user.js your-email@example.com super_admin
   ```

### **Method 3: Direct Database Access**
Jika Anda memiliki akses ke Supabase dashboard:

1. Buka Supabase Dashboard → SQL Editor
2. Jalankan query ini (ganti email dengan email Anda):
   ```sql
   -- Check if user exists
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   
   -- Setup admin user (ganti YOUR_USER_ID dengan ID dari query di atas)
   SELECT public.setup_admin_user('your-email@example.com', 'super_admin');
   ```

### **Method 4: Manual Database Insert**
Jika function tidak bekerja:
```sql
-- Insert admin user manually
INSERT INTO public.admin_users (
  user_id, 
  email, 
  role, 
  is_active,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_FROM_AUTH_USERS',
  'your-email@example.com',
  'super_admin',
  true,
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  updated_at = now();
```

## **✅ Verification Steps**

Setelah setup, verifikasi bahwa semuanya bekerja:

1. **Refresh Browser**: Hard refresh (Ctrl+F5 atau Cmd+Shift+R)
2. **Check Navbar**: Admin button harus muncul di navbar
3. **Test Access**: Klik admin button atau buka `/admin` langsung
4. **Debug Check**: Buka `/debug-admin` dan pastikan status menunjukkan admin

## **🔧 Expected Results**

Setelah berhasil setup, Anda harus melihat:
- ✅ Admin button muncul di navbar (desktop)
- ✅ Bisa mengakses `/admin` dashboard
- ✅ Debug page menunjukkan `Is Admin: ✅ Yes`
- ✅ Role menunjukkan `super_admin`

## **🚨 Troubleshooting**

### **Issue: Function `setup_admin_user` not found**
**Solution**: Database migration mungkin belum dijalankan
```sql
-- Run this in Supabase SQL Editor
CREATE OR REPLACE FUNCTION public.setup_admin_user(
  admin_email TEXT,
  admin_role TEXT DEFAULT 'admin'
)
RETURNS TEXT AS $$
-- [Function code from migration file]
```

### **Issue: Permission denied**
**Solution**: RLS policies mungkin terlalu ketat
```sql
-- Temporarily disable RLS for setup
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
-- Run your insert
-- Then re-enable
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
```

### **Issue: User not found in auth.users**
**Solution**: User belum login dengan Google
1. Logout dari aplikasi
2. Login ulang dengan Google OAuth
3. Coba setup admin lagi

### **Issue: Context not updating**
**Solution**: Clear browser cache dan restart
1. Clear browser cache/cookies
2. Hard refresh (Ctrl+F5)
3. Atau restart browser

## **📞 Support**

Jika masih bermasalah:
1. Buka `/debug-admin` dan screenshot debug information
2. Check browser console untuk error messages
3. Periksa Supabase logs untuk database errors

## **🔒 Security Notes**

- Hanya berikan role `super_admin` kepada orang yang dipercaya
- Role `admin` sudah cukup untuk operasi sehari-hari
- Selalu verifikasi email sebelum memberikan akses admin
- Monitor admin activity melalui dashboard monitoring
