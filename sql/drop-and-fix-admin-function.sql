-- 🔧 DROP AND FIX get_current_user_admin_info FUNCTION - CGSG404
-- This properly drops and recreates the function to fix GROUP BY issue

-- 1. Drop existing function first
DROP FUNCTION IF EXISTS public.get_current_user_admin_info();

-- 2. Recreate function with proper handling
CREATE OR REPLACE FUNCTION public.get_current_user_admin_info()
RETURNS TABLE (
  is_admin BOOLEAN,
  role TEXT,
  email TEXT,
  permissions TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  WITH admin_data AS (
    SELECT 
      CASE WHEN au.id IS NOT NULL THEN true ELSE false END as is_admin,
      au.role,
      au.email,
      COALESCE(
        ARRAY_AGG(ap.name) FILTER (WHERE ap.name IS NOT NULL), 
        ARRAY[]::TEXT[]
      ) as permissions
    FROM auth.users u
    LEFT JOIN public.admin_users au ON u.id = au.user_id AND au.is_active = true
    LEFT JOIN public.admin_role_permissions arp ON au.id = arp.admin_user_id
    LEFT JOIN public.admin_permissions ap ON arp.permission_id = ap.id
    WHERE u.id = auth.uid()
    GROUP BY au.id, au.role, au.email
  )
  SELECT 
    COALESCE(ad.is_admin, false) as is_admin,
    ad.role,
    COALESCE(ad.email, u.email) as email,
    COALESCE(ad.permissions, ARRAY[]::TEXT[]) as permissions
  FROM auth.users u
  LEFT JOIN admin_data ad ON true
  WHERE u.id = auth.uid()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION public.get_current_user_admin_info() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_admin_info() TO service_role;

-- 4. Test the fixed function
SELECT 'Testing fixed function...' as test_name;
SELECT * FROM public.get_current_user_admin_info();

-- 5. Also test other functions for comparison
SELECT 'Testing is_admin function...' as test_name;
SELECT public.is_admin() as is_admin_result;

-- 6. Test direct admin_users query
SELECT 'Direct admin_users query...' as test_name;
SELECT 
  au.email,
  au.role,
  au.is_active,
  COUNT(arp.permission_id) as permission_count
FROM public.admin_users au
LEFT JOIN public.admin_role_permissions arp ON au.id = arp.admin_user_id
WHERE au.user_id = auth.uid()
GROUP BY au.id, au.email, au.role, au.is_active;
