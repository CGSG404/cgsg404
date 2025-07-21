-- Fix Admin Access Issues - CGSG404
-- This script diagnoses and fixes admin access problems

-- 1. Check current user session
SELECT 
  'Current User Info' as check_type,
  auth.uid() as user_id,
  u.email,
  u.created_at
FROM auth.users u 
WHERE u.id = auth.uid();

-- 2. Check if user exists in admin_users table
SELECT 
  'Admin User Check' as check_type,
  au.id,
  au.user_id,
  au.email,
  au.role,
  au.is_active,
  au.created_at
FROM public.admin_users au 
WHERE au.user_id = auth.uid();

-- 3. Test is_admin function
SELECT 
  'is_admin Function Test' as check_type,
  public.is_admin() as result;

-- 4. Check admin permissions
SELECT 
  'Admin Permissions' as check_type,
  ap.name,
  ap.description
FROM public.admin_users au
JOIN public.admin_role_permissions arp ON au.id = arp.admin_user_id
JOIN public.admin_permissions ap ON arp.permission_id = ap.id
WHERE au.user_id = auth.uid();

-- 5. Get current user admin info
SELECT 
  'Current User Admin Info' as check_type,
  *
FROM public.get_current_user_admin_info();

-- 6. Check if there are any admin users at all
SELECT 
  'All Admin Users' as check_type,
  COUNT(*) as total_admins,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_admins
FROM public.admin_users;

-- 7. List all admin users (if any)
SELECT 
  'Admin Users List' as check_type,
  email,
  role,
  is_active,
  created_at
FROM public.admin_users
ORDER BY created_at DESC
LIMIT 10;

-- DIAGNOSTIC QUERIES END HERE
-- FIXES START BELOW

-- Fix 1: Setup current user as super admin (UNCOMMENT TO EXECUTE)
/*
DO $$
DECLARE
  current_user_email TEXT;
  current_user_id UUID;
BEGIN
  -- Get current user info
  SELECT auth.uid(), u.email INTO current_user_id, current_user_email
  FROM auth.users u 
  WHERE u.id = auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE NOTICE 'No authenticated user found';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Setting up admin for user: % (ID: %)', current_user_email, current_user_id;
  
  -- Insert or update admin user
  INSERT INTO public.admin_users (
    user_id, 
    email, 
    role, 
    is_active,
    created_at,
    updated_at
  ) VALUES (
    current_user_id,
    current_user_email,
    'super_admin',
    true,
    now(),
    now()
  ) ON CONFLICT (user_id) DO UPDATE SET
    role = 'super_admin',
    is_active = true,
    updated_at = now();
    
  -- Grant all permissions to super admin
  INSERT INTO public.admin_role_permissions (admin_user_id, permission_id, granted_by)
  SELECT 
    au.id,
    ap.id,
    current_user_id
  FROM public.admin_users au
  CROSS JOIN public.admin_permissions ap
  WHERE au.user_id = current_user_id
  ON CONFLICT (admin_user_id, permission_id) DO NOTHING;
  
  RAISE NOTICE 'Admin setup completed successfully';
END $$;
*/

-- Fix 2: Recreate is_admin function if needed
/*
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  -- Add debug logging
  RAISE LOG 'is_admin called for user: %', user_uuid;
  
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

-- Fix 3: Grant proper permissions
/*
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_admin_info() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT, UUID) TO authenticated;
*/
