-- Enable RLS on critical tables for admin functionality
-- This fixes the auth.uid() context issue

-- 1. Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Enable RLS on other admin tables
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 3. Create permissive policies for admin functionality

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

CREATE POLICY "Allow all operations for authenticated users" ON public.users
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Admin users table policies
DROP POLICY IF EXISTS "Admin users can view themselves" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

CREATE POLICY "Allow all operations for authenticated users" ON public.admin_users
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- Admin permissions table policies
CREATE POLICY "Allow all operations for authenticated users" ON public.admin_permissions
    FOR ALL USING (auth.role() = 'authenticated');

-- Admin role permissions table policies
CREATE POLICY "Allow all operations for authenticated users" ON public.admin_role_permissions
    FOR ALL USING (auth.role() = 'authenticated');

-- Admin activity logs table policies
CREATE POLICY "Allow all operations for authenticated users" ON public.admin_activity_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Test auth.uid() function
DO $$
BEGIN
    RAISE NOTICE 'Testing auth.uid(): %', auth.uid();
    RAISE NOTICE 'Testing auth.role(): %', auth.role();
END $$;

-- Create a test function to verify auth context
CREATE OR REPLACE FUNCTION public.test_auth_context()
RETURNS TABLE (
    current_user_id UUID,
    current_role TEXT,
    session_valid BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        auth.uid(),
        auth.role()::TEXT,
        (auth.uid() IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.test_auth_context() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_auth_context() TO service_role;

-- 🧪 TEST QUERIES - Run these after enabling RLS
-- Test 1: Check auth context
SELECT 'Testing auth context...' as test_name;
SELECT * FROM public.test_auth_context();

-- Test 2: Check admin status
SELECT 'Testing admin status...' as test_name;
SELECT public.is_admin() as is_admin_result;

-- Test 3: Get admin info
SELECT 'Testing admin info...' as test_name;
SELECT * FROM public.get_current_user_admin_info();

-- Test 4: Check if RLS is enabled
SELECT 'Checking RLS status...' as test_name;
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'admin_users', 'admin_permissions', 'admin_role_permissions', 'admin_activity_logs');
