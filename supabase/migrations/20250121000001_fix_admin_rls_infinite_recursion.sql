-- Fix infinite recursion in admin_users RLS policies
-- This migration replaces recursive policies with direct auth.uid() checks

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Super admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view own record" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Create new non-recursive policies
-- Allow users to view their own admin record
CREATE POLICY "Users can view own admin record" ON public.admin_users FOR SELECT 
USING (user_id = auth.uid());

-- Allow authenticated users to insert their own admin record (for setup)
CREATE POLICY "Users can insert own admin record" ON public.admin_users FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Allow users to update their own admin record
CREATE POLICY "Users can update own admin record" ON public.admin_users FOR UPDATE 
USING (user_id = auth.uid());

-- Create a separate function for admin checks that doesn't use RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  -- Use direct query without RLS to avoid recursion
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = COALESCE(user_uuid, auth.uid())
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current user admin info without RLS recursion
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

-- Create function to setup super admin (for initial setup)
CREATE OR REPLACE FUNCTION public.setup_super_admin(admin_email TEXT DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  current_user_id UUID;
  current_email TEXT;
  admin_record_id UUID;
  result JSONB;
BEGIN
  -- Get current user info
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Get user email from auth.users
  SELECT email INTO current_email FROM auth.users WHERE id = current_user_id;
  
  IF current_email IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User email not found');
  END IF;
  
  -- Use provided email or current user email
  current_email := COALESCE(admin_email, current_email);
  
  -- Check if admin record already exists
  SELECT id INTO admin_record_id 
  FROM public.admin_users 
  WHERE user_id = current_user_id;
  
  IF admin_record_id IS NOT NULL THEN
    -- Update existing record
    UPDATE public.admin_users 
    SET 
      email = current_email,
      role = 'super_admin',
      is_active = true,
      updated_at = now()
    WHERE id = admin_record_id;
    
    result := jsonb_build_object(
      'success', true, 
      'action', 'updated',
      'admin_id', admin_record_id,
      'email', current_email,
      'role', 'super_admin'
    );
  ELSE
    -- Insert new admin record
    INSERT INTO public.admin_users (
      user_id, 
      email, 
      role, 
      is_active,
      created_by
    ) VALUES (
      current_user_id,
      current_email,
      'super_admin',
      true,
      current_user_id
    ) RETURNING id INTO admin_record_id;
    
    result := jsonb_build_object(
      'success', true, 
      'action', 'created',
      'admin_id', admin_record_id,
      'email', current_email,
      'role', 'super_admin'
    );
  END IF;
  
  -- Grant all permissions to super admin
  INSERT INTO public.admin_role_permissions (admin_user_id, permission_id, granted_by)
  SELECT admin_record_id, ap.id, current_user_id
  FROM public.admin_permissions ap
  WHERE NOT EXISTS (
    SELECT 1 FROM public.admin_role_permissions arp 
    WHERE arp.admin_user_id = admin_record_id 
    AND arp.permission_id = ap.id
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on new functions
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_admin_info() TO authenticated;
GRANT EXECUTE ON FUNCTION public.setup_super_admin(TEXT) TO authenticated;

-- Update existing RPC function to use new approach
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.is_admin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
