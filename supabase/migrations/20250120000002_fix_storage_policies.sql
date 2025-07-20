-- Fix storage policies to prevent infinite recursion
-- This migration fixes the RLS policies that were causing infinite recursion

-- Drop existing problematic policies for casino-logos bucket
DROP POLICY IF EXISTS "Admin can upload casino-logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update casino-logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete casino-logos" ON storage.objects;

-- Create new simplified policies for casino-logos bucket
-- Allow authenticated users to upload (temporary fix for testing)
CREATE POLICY "Authenticated users can upload casino-logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'casino-logos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update casino-logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'casino-logos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete casino-logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'casino-logos'
  AND auth.role() = 'authenticated'
);

-- Alternative: More restrictive policy using direct admin check
-- Uncomment these and comment above if you want admin-only access
/*
CREATE POLICY "Admin can upload casino-logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'casino-logos'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

CREATE POLICY "Admin can update casino-logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'casino-logos'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

CREATE POLICY "Admin can delete casino-logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'casino-logos'
  AND EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);
*/
