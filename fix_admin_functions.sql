-- Fix Admin Functions - CGSG404
-- This script creates all missing admin functions needed for the system

-- 1. Create has_permission function
CREATE OR REPLACE FUNCTION public.has_permission(
  permission_name TEXT,
  user_uuid UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Super admin has all permissions
  IF EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = COALESCE(user_uuid, auth.uid())
    AND au.role = 'super_admin'
    AND au.is_active = true
  ) THEN
    RETURN true;
  END IF;
  
  -- Check specific permission
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users au
    JOIN public.admin_role_permissions arp ON au.id = arp.admin_user_id
    JOIN public.admin_permissions ap ON arp.permission_id = ap.id
    WHERE au.user_id = COALESCE(user_uuid, auth.uid())
    AND au.is_active = true
    AND ap.name = permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create has_permission function with permission ID
CREATE OR REPLACE FUNCTION public.has_permission(
  permission_id TEXT,
  user_uuid UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Super admin has all permissions
  IF EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = COALESCE(user_uuid, auth.uid())
    AND au.role = 'super_admin'
    AND au.is_active = true
  ) THEN
    RETURN true;
  END IF;
  
  -- Check specific permission by ID
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users au
    JOIN public.admin_role_permissions arp ON au.id = arp.admin_user_id
    WHERE au.user_id = COALESCE(user_uuid, auth.uid())
    AND au.is_active = true
    AND arp.permission_id::TEXT = permission_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create log_admin_activity function
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  action_name TEXT,
  resource_type_name TEXT DEFAULT NULL,
  resource_id_value TEXT DEFAULT NULL,
  details_json JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  admin_user_id UUID;
  log_id UUID;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_id
  FROM public.admin_users
  WHERE user_id = auth.uid() AND is_active = true;
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User is not an active admin';
  END IF;
  
  -- Insert activity log
  INSERT INTO public.admin_activity_logs (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    admin_user_id,
    action_name,
    resource_type_name,
    resource_id_value,
    details_json
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create simplified is_admin function (if not exists)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_activity(TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Test the functions
SELECT 'Functions created successfully!' as status;

-- Quick test queries (uncomment to test):
/*
SELECT public.is_admin() as is_admin_test;
SELECT public.has_permission('16') as has_permission_test;
SELECT * FROM public.get_current_user_admin_info();
*/