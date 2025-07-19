-- Setup initial admin user for CGSG404
-- This migration creates the first super admin user

-- NOTE: Replace 'your-email@example.com' with your actual email address
-- This email will become the super admin of the platform

-- First, we need to insert the admin user after they sign up
-- This is a template - you'll need to run this after your first Google sign-in

-- INSTRUCTIONS:
-- 1. Sign in to your app with Google using your admin email
-- 2. Get your user ID from auth.users table
-- 3. Replace the email and user_id below
-- 4. Run this migration

-- Example setup (REPLACE WITH YOUR ACTUAL DATA):
/*
-- Get your user ID first by running:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert admin user:
INSERT INTO public.admin_users (
  user_id, 
  email, 
  role, 
  is_active,
  created_at
) VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with your actual user ID from auth.users
  'your-email@example.com',  -- Replace with your actual email
  'super_admin',
  true,
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
  au.user_id
FROM public.admin_users au
CROSS JOIN public.admin_permissions ap
WHERE au.email = 'your-email@example.com'
ON CONFLICT (admin_user_id, permission_id) DO NOTHING;
*/

-- Create a function to easily setup admin user
CREATE OR REPLACE FUNCTION public.setup_admin_user(
  admin_email TEXT,
  admin_role TEXT DEFAULT 'admin'
)
RETURNS TEXT AS $$
DECLARE
  user_uuid UUID;
  admin_uuid UUID;
  result_message TEXT;
BEGIN
  -- Check if user exists in auth.users
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF user_uuid IS NULL THEN
    RETURN 'Error: User with email ' || admin_email || ' not found. Please sign in first with Google.';
  END IF;
  
  -- Insert or update admin user
  INSERT INTO public.admin_users (
    user_id, 
    email, 
    role, 
    is_active,
    created_at
  ) VALUES (
    user_uuid,
    admin_email,
    admin_role,
    true,
    now()
  ) ON CONFLICT (user_id) DO UPDATE SET
    role = admin_role,
    is_active = true,
    updated_at = now()
  RETURNING id INTO admin_uuid;
  
  -- Grant permissions based on role
  IF admin_role = 'super_admin' THEN
    -- Grant all permissions to super admin
    INSERT INTO public.admin_role_permissions (admin_user_id, permission_id, granted_by)
    SELECT 
      admin_uuid,
      ap.id,
      user_uuid
    FROM public.admin_permissions ap
    ON CONFLICT (admin_user_id, permission_id) DO NOTHING;
    
    result_message := 'Super admin user created successfully for ' || admin_email || ' with all permissions.';
    
  ELSIF admin_role = 'admin' THEN
    -- Grant basic admin permissions
    INSERT INTO public.admin_role_permissions (admin_user_id, permission_id, granted_by)
    SELECT 
      admin_uuid,
      ap.id,
      user_uuid
    FROM public.admin_permissions ap
    WHERE ap.name NOT IN ('admin.create', 'admin.delete', 'system.settings', 'backup.manage')
    ON CONFLICT (admin_user_id, permission_id) DO NOTHING;
    
    result_message := 'Admin user created successfully for ' || admin_email || ' with standard permissions.';
    
  ELSIF admin_role = 'moderator' THEN
    -- Grant moderator permissions
    INSERT INTO public.admin_role_permissions (admin_user_id, permission_id, granted_by)
    SELECT 
      admin_uuid,
      ap.id,
      user_uuid
    FROM public.admin_permissions ap
    WHERE ap.category IN ('Content Moderation', 'Analytics')
    OR ap.name IN ('casino.read', 'news.read', 'user.read')
    ON CONFLICT (admin_user_id, permission_id) DO NOTHING;
    
    result_message := 'Moderator user created successfully for ' || admin_email || ' with moderation permissions.';
  END IF;
  
  -- Log the activity
  INSERT INTO public.admin_activity_logs (
    admin_user_id,
    action,
    resource_type,
    details
  ) VALUES (
    admin_uuid,
    'admin_user_created',
    'admin_user',
    jsonb_build_object(
      'email', admin_email,
      'role', admin_role,
      'created_by', 'system'
    )
  );
  
  RETURN result_message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check current user admin status
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
    ARRAY_AGG(ap.name) as permissions
  FROM auth.users u
  LEFT JOIN public.admin_users au ON u.id = au.user_id AND au.is_active = true
  LEFT JOIN public.admin_role_permissions arp ON au.id = arp.admin_user_id
  LEFT JOIN public.admin_permissions ap ON arp.permission_id = ap.id
  WHERE u.id = auth.uid()
  GROUP BY au.id, au.role, au.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to list all admin users (super admin only)
CREATE OR REPLACE FUNCTION public.get_all_admin_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  role TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  permissions_count BIGINT
) AS $$
BEGIN
  -- Check if current user is super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Access denied. Super admin role required.';
  END IF;
  
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.role,
    au.is_active,
    au.created_at,
    au.last_login_at,
    COUNT(arp.permission_id) as permissions_count
  FROM public.admin_users au
  LEFT JOIN public.admin_role_permissions arp ON au.id = arp.admin_user_id
  GROUP BY au.id, au.email, au.role, au.is_active, au.created_at, au.last_login_at
  ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.setup_admin_user(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_admin_info() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_activity(TEXT, TEXT, TEXT, JSONB) TO authenticated;
