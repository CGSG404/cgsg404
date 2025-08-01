-- ⚡ SIMPLE RLS FIX - CGSG404
-- Fixed syntax errors for PostgreSQL

-- 1. Enable RLS on admin tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

DROP POLICY IF EXISTS "Admin users can view themselves" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- 3. Create permissive policies for users table
CREATE POLICY "Allow all operations for authenticated users" ON public.users
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- 4. Create permissive policies for admin_users table
CREATE POLICY "Allow all operations for authenticated users" ON public.admin_users
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- 5. Create permissive policies for admin_permissions table
CREATE POLICY "Allow all operations for authenticated users" ON public.admin_permissions
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. Create permissive policies for admin_role_permissions table
CREATE POLICY "Allow all operations for authenticated users" ON public.admin_role_permissions
    FOR ALL USING (auth.role() = 'authenticated');

-- 7. Create permissive policies for admin_activity_logs table
CREATE POLICY "Allow all operations for authenticated users" ON public.admin_activity_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- 8. Create test function (FIXED SYNTAX)
CREATE OR REPLACE FUNCTION public.test_auth_context()
RETURNS TABLE (
    user_id UUID,
    user_role TEXT,
    is_valid BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        auth.uid(),
        auth.role()::TEXT,
        (auth.uid() IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant permissions
GRANT EXECUTE ON FUNCTION public.test_auth_context() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_auth_context() TO service_role;

-- 10. Test queries
SELECT 'RLS enabled successfully!' as status;
SELECT * FROM public.test_auth_context();
SELECT public.is_admin() as admin_check;
