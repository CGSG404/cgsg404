-- Step 1: Drop problematic RLS policies
DROP POLICY IF EXISTS "Super admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view own record" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;
