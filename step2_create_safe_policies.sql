-- Step 2: Create safe RLS policies
-- Allow users to view their own admin record
CREATE POLICY "Users can view own admin record" ON public.admin_users FOR SELECT 
USING (user_id = auth.uid());

-- Allow authenticated users to insert their own admin record (for setup)
CREATE POLICY "Users can insert own admin record" ON public.admin_users FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Allow users to update their own admin record
CREATE POLICY "Users can update own admin record" ON public.admin_users FOR UPDATE 
USING (user_id = auth.uid());
