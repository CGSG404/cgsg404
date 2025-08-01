-- Step 3: Fix existing functions
-- Drop and recreate get_current_user_admin_info function
DROP FUNCTION IF EXISTS public.get_current_user_admin_info();

-- Create new function with correct signature
CREATE OR REPLACE FUNCTION public.get_current_user_admin_info()
RETURNS TABLE (
  email TEXT,
  role TEXT,
  is_admin BOOLEAN,
  total_permissions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.email,
    au.role,
    true as is_admin,
    COALESCE(COUNT(arp.permission_id), 0) as total_permissions
  FROM public.admin_users au
  LEFT JOIN public.admin_role_permissions arp ON au.id = arp.admin_user_id
  WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  GROUP BY au.email, au.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_current_user_admin_info() TO authenticated;
