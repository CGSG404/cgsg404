-- Debug DELETE Policy untuk Casino Reports
-- Jalankan query ini di Supabase SQL Editor untuk test delete permissions

-- 1. Cek current user dan admin status
SELECT 
  'Current User ID: ' || COALESCE(auth.uid()::text, 'NULL') as current_user,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.is_active = true
    ) THEN 'Admin Access: YES'
    ELSE 'Admin Access: NO'
  END as admin_status;

-- 2. Cek semua policies untuk casino_reports
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'casino_reports'
ORDER BY cmd, policyname;

-- 3. Test DELETE permission (simulasi)
-- Ini akan menunjukkan apakah policy mengizinkan delete
SELECT 
  id,
  casino_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.is_active = true
    ) THEN 'CAN DELETE'
    ELSE 'CANNOT DELETE'
  END as delete_permission
FROM public.casino_reports 
LIMIT 3;

-- 4. Cek admin user yang aktif
SELECT 
  email,
  role,
  is_active,
  user_id
FROM public.admin_users 
WHERE is_active = true;

-- 5. Test actual delete (HATI-HATI - ini akan menghapus data!)
-- Uncomment baris di bawah untuk test delete yang sebenarnya
-- DELETE FROM public.casino_reports WHERE id = 1 RETURNING *;
