-- 🔧 FIX get_current_user_admin_info FUNCTION - CGSG404
-- This fixes the GROUP BY issue that causes empty results

-- Drop and recreate the function with proper handling
CREATE OR REPLACE FUNCTION public.get_current_user_admin_info()
RETURNS TABLE (
  is_admin BOOLEAN,
  role TEXT,
  email TEXT,
  permissions TEXT[]
) AS $$
BEGIN
  RETURN QUERY
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
  
  -- UNION to ensure we always return a row even if user is not admin
  UNION ALL
  
  SELECT 
    false as is_admin,
    NULL::TEXT as role,
    u.email,
    ARRAY[]::TEXT[] as permissions
  FROM auth.users u
  WHERE u.id = auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = u.id AND au.is_active = true
  )
  
  -- Order to ensure admin result comes first if exists
  ORDER BY is_admin DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_current_user_admin_info() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_admin_info() TO service_role;

-- Test the fixed function
SELECT 'Testing fixed function...' as test_name;
SELECT * FROM public.get_current_user_admin_info();
