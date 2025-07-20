-- Quick fix for storage policy infinite recursion
-- Run this in Supabase SQL Editor

-- Drop problematic policies
DROP POLICY IF EXISTS "Admin can upload casino-logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update casino-logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete casino-logos" ON storage.objects;

-- Create simple authenticated user policy
CREATE POLICY "Allow authenticated upload casino-logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'casino-logos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated update casino-logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'casino-logos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated delete casino-logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'casino-logos'
  AND auth.role() = 'authenticated'
);

-- Verify policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%casino-logos%';
