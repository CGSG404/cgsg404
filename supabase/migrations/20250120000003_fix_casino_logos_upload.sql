-- Fix casino-logos upload by allowing service role to bypass RLS
-- This migration ensures that the service role can upload files without RLS restrictions

-- Drop existing policies for casino-logos bucket
DROP POLICY IF EXISTS "Authenticated users can upload casino-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update casino-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete casino-logos" ON storage.objects;

-- Create new policies that allow service role operations
-- Service role should bypass RLS, but we add these as fallback

-- Allow all operations for casino-logos bucket (since we use service role)
CREATE POLICY "Allow all operations for casino-logos" ON storage.objects
FOR ALL USING (bucket_id = 'casino-logos');

-- Alternative: Create specific policies for different operations
-- Uncomment these if the above doesn't work

/*
CREATE POLICY "Service role can upload casino-logos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'casino-logos');

CREATE POLICY "Service role can update casino-logos" ON storage.objects
FOR UPDATE USING (bucket_id = 'casino-logos');

CREATE POLICY "Service role can delete casino-logos" ON storage.objects
FOR DELETE USING (bucket_id = 'casino-logos');
*/

-- Ensure the bucket exists and is properly configured
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'casino-logos';

-- Grant necessary permissions to service role
-- Note: Service role should already have these permissions, but let's be explicit
GRANT ALL ON storage.objects TO service_role;
GRANT ALL ON storage.buckets TO service_role;
