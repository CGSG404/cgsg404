-- Step 4: Create setup function
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.setup_super_admin(TEXT) TO authenticated;
