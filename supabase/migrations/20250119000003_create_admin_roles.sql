-- Create admin roles system for CGSG404
-- This migration creates admin management tables and functions

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Create admin_permissions table for granular permissions
CREATE TABLE public.admin_permissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_role_permissions table (many-to-many)
CREATE TABLE public.admin_role_permissions (
  id SERIAL PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES public.admin_permissions(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(admin_user_id, permission_id)
);

-- Create admin_activity_logs table for audit trail
CREATE TABLE public.admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default permissions
INSERT INTO public.admin_permissions (name, description, category) VALUES
-- Casino Management
('casino.create', 'Create new casinos', 'Casino Management'),
('casino.read', 'View casino details', 'Casino Management'),
('casino.update', 'Edit casino information', 'Casino Management'),
('casino.delete', 'Delete casinos', 'Casino Management'),
('casino.publish', 'Publish/unpublish casinos', 'Casino Management'),

-- News Management
('news.create', 'Create news articles', 'News Management'),
('news.read', 'View news articles', 'News Management'),
('news.update', 'Edit news articles', 'News Management'),
('news.delete', 'Delete news articles', 'News Management'),
('news.publish', 'Publish/unpublish news', 'News Management'),

-- User Management
('user.read', 'View user profiles', 'User Management'),
('user.update', 'Edit user profiles', 'User Management'),
('user.ban', 'Ban/unban users', 'User Management'),
('user.delete', 'Delete user accounts', 'User Management'),

-- Content Moderation
('comment.moderate', 'Moderate user comments', 'Content Moderation'),
('rating.moderate', 'Moderate user ratings', 'Content Moderation'),
('report.handle', 'Handle user reports', 'Content Moderation'),

-- Analytics & Reports
('analytics.view', 'View analytics dashboard', 'Analytics'),
('report.generate', 'Generate reports', 'Analytics'),
('stats.view', 'View platform statistics', 'Analytics'),

-- System Administration
('admin.create', 'Create new admin users', 'System Administration'),
('admin.update', 'Edit admin users', 'System Administration'),
('admin.delete', 'Delete admin users', 'System Administration'),
('system.settings', 'Manage system settings', 'System Administration'),
('backup.manage', 'Manage backups', 'System Administration');

-- Create indexes for better performance
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);
CREATE INDEX idx_admin_users_active ON public.admin_users(is_active);
CREATE INDEX idx_admin_activity_logs_admin_user_id ON public.admin_activity_logs(admin_user_id);
CREATE INDEX idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at DESC);
CREATE INDEX idx_admin_activity_logs_action ON public.admin_activity_logs(action);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin tables
-- Only super admins can view admin users
CREATE POLICY "Super admins can view admin users" ON public.admin_users FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.role = 'super_admin' 
    AND au.is_active = true
  )
);

-- Admins can view their own record
CREATE POLICY "Admins can view own record" ON public.admin_users FOR SELECT 
USING (user_id = auth.uid());

-- Only super admins can modify admin users
CREATE POLICY "Super admins can manage admin users" ON public.admin_users FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.role = 'super_admin' 
    AND au.is_active = true
  )
);

-- Admin permissions are readable by all admins
CREATE POLICY "Admins can view permissions" ON public.admin_permissions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Admin role permissions are readable by all admins
CREATE POLICY "Admins can view role permissions" ON public.admin_role_permissions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Activity logs are readable by admins (own logs) and super admins (all logs)
CREATE POLICY "Admins can view own activity logs" ON public.admin_activity_logs FOR SELECT 
USING (
  admin_user_id IN (
    SELECT id FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Super admins can view all activity logs" ON public.admin_activity_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.role = 'super_admin' 
    AND au.is_active = true
  )
);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(permission_name TEXT, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users au
    JOIN public.admin_role_permissions arp ON au.id = arp.admin_user_id
    JOIN public.admin_permissions ap ON arp.permission_id = ap.id
    WHERE au.user_id = user_uuid 
    AND au.is_active = true
    AND ap.name = permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log admin activity
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  action_name TEXT,
  resource_type_param TEXT DEFAULT NULL,
  resource_id_param TEXT DEFAULT NULL,
  details_param JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  admin_user_uuid UUID;
  log_id UUID;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_uuid 
  FROM public.admin_users 
  WHERE user_id = auth.uid() AND is_active = true;
  
  IF admin_user_uuid IS NULL THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;
  
  -- Insert activity log
  INSERT INTO public.admin_activity_logs (
    admin_user_id, 
    action, 
    resource_type, 
    resource_id, 
    details
  ) VALUES (
    admin_user_uuid,
    action_name,
    resource_type_param,
    resource_id_param,
    details_param
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at 
BEFORE UPDATE ON public.admin_users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT ON public.admin_permissions TO authenticated;
GRANT SELECT ON public.admin_role_permissions TO authenticated;
GRANT SELECT ON public.admin_activity_logs TO authenticated;
