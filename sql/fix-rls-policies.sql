-- Safe RLS Policy Setup for CGSG404 Banners Table
-- This script handles existing policies without errors

-- 1. Enable RLS (safe - won't error if already enabled)
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access for active banners" ON public.banners;
DROP POLICY IF EXISTS "Allow authenticated users to manage banners" ON public.banners;

-- 3. Create new policies
CREATE POLICY "Allow public read access for active banners" ON public.banners
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage banners" ON public.banners
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. Verify policies (optional - for checking)
-- SELECT policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'banners' AND schemaname = 'public';

-- 5. Test access (optional - for verification)
-- SELECT COUNT(*) FROM public.banners WHERE is_active = true; 