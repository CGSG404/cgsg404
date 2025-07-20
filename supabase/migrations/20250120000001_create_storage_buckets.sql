-- Create storage buckets for file uploads
-- This migration creates storage buckets for casino logos and other assets

-- Create casino-logos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'casino-logos',
  'casino-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist, then create new ones for casino-logos bucket
DROP POLICY IF EXISTS "Public Access for casino-logos" ON storage.objects;
CREATE POLICY "Public Access for casino-logos" ON storage.objects
FOR SELECT USING (bucket_id = 'casino-logos');

DROP POLICY IF EXISTS "Admin can upload casino-logos" ON storage.objects;
CREATE POLICY "Admin can upload casino-logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'casino-logos'
  AND auth.uid() IN (
    SELECT au.id
    FROM admin_users au
    WHERE au.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admin can update casino-logos" ON storage.objects;
CREATE POLICY "Admin can update casino-logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'casino-logos'
  AND auth.uid() IN (
    SELECT au.id
    FROM admin_users au
    WHERE au.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admin can delete casino-logos" ON storage.objects;
CREATE POLICY "Admin can delete casino-logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'casino-logos'
  AND auth.uid() IN (
    SELECT au.id
    FROM admin_users au
    WHERE au.id = auth.uid()
  )
);

-- Create avatars bucket for user profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist, then create new ones for avatars bucket
DROP POLICY IF EXISTS "Public Access for avatars" ON storage.objects;
CREATE POLICY "Public Access for avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create post-images bucket for forum posts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for post-images bucket
CREATE POLICY "Public Access for post-images" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post-images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own post-images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own post-images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create news-images bucket for news articles
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for news-images bucket
CREATE POLICY "Public Access for news-images" ON storage.objects
FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Admin can upload news-images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'news-images' 
  AND auth.uid() IN (
    SELECT au.id 
    FROM admin_users au 
    WHERE au.id = auth.uid()
  )
);

CREATE POLICY "Admin can update news-images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'news-images' 
  AND auth.uid() IN (
    SELECT au.id 
    FROM admin_users au 
    WHERE au.id = auth.uid()
  )
);

CREATE POLICY "Admin can delete news-images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'news-images' 
  AND auth.uid() IN (
    SELECT au.id 
    FROM admin_users au 
    WHERE au.id = auth.uid()
  )
);
