-- Fix Casino Admin RLS Policies
-- This migration adds missing RLS policies for admin users to manage casinos

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can insert casinos" ON public.casinos;
DROP POLICY IF EXISTS "Admins can update casinos" ON public.casinos;
DROP POLICY IF EXISTS "Admins can delete casinos" ON public.casinos;
DROP POLICY IF EXISTS "Admins can manage casino features" ON public.casino_features;
DROP POLICY IF EXISTS "Admins can manage casino badges" ON public.casino_badges;
DROP POLICY IF EXISTS "Admins can manage casino links" ON public.casino_links;
DROP POLICY IF EXISTS "Admins can manage casino categories" ON public.casino_categories;
DROP POLICY IF EXISTS "Admins can manage casino category assignments" ON public.casino_category_assignments;

-- Create admin policies for casinos table
CREATE POLICY "Admins can insert casinos" ON public.casinos FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

CREATE POLICY "Admins can update casinos" ON public.casinos FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

CREATE POLICY "Admins can delete casinos" ON public.casinos FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Create admin policies for casino_features table
CREATE POLICY "Admins can manage casino features" ON public.casino_features FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Create admin policies for casino_badges table
CREATE POLICY "Admins can manage casino badges" ON public.casino_badges FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Create admin policies for casino_links table
CREATE POLICY "Admins can manage casino links" ON public.casino_links FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Create admin policies for casino_categories table
CREATE POLICY "Admins can manage casino categories" ON public.casino_categories FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Create admin policies for casino_category_assignments table
CREATE POLICY "Admins can manage casino category assignments" ON public.casino_category_assignments FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Create admin policies for news_articles table (if not exists)
DROP POLICY IF EXISTS "Admins can manage news articles" ON public.news_articles;
CREATE POLICY "Admins can manage news articles" ON public.news_articles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Create function to check if user is admin (helper function)
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.is_current_user_admin() IS 'Helper function to check if current authenticated user is an active admin';
