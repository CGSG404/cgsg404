import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Disable default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Debug environment variables
    console.log('Environment check:', {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
      serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
    });

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing');
    }

    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
    }

    // Create service role client (bypasses RLS)
    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey, // Service role key
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`
          }
        }
      }
    );

    // Parse form data
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.mimetype || '')) {
      return res.status(400).json({
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        error: 'File too large. Maximum size is 5MB.'
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalFilename?.split('.').pop() || 'jpg';
    const fileName = `casino-logo-${timestamp}-${randomString}.${fileExtension}`;

    // Read file buffer
    const buffer = fs.readFileSync(file.filepath);

    // Upload to Supabase Storage using service role
    console.log('🔄 Attempting upload to Supabase:', {
      bucket: 'casino-logos',
      fileName,
      fileSize: buffer.length,
      contentType: file.mimetype
    });

    const { data, error } = await supabase.storage
      .from('casino-logos')
      .upload(fileName, buffer, {
        contentType: file.mimetype || 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload error:', {
        error,
        message: error.message,
        statusCode: error.statusCode,
        details: error
      });

      return res.status(500).json({
        error: 'Failed to upload file to storage',
        details: error.message,
        statusCode: error.statusCode || 500,
        supabaseError: error
      });
    }

    console.log('Upload successful:', { fileName, path: data?.path });

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('casino-logos')
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      return res.status(500).json({ error: 'Failed to get public URL' });
    }

    // Clean up URL to remove double slashes
    const cleanUrl = urlData.publicUrl.replace(/\/+/g, '/').replace(':/', '://');

    console.log('URL generation:', {
      original: urlData.publicUrl,
      cleaned: cleanUrl,
      fileName
    });

    // Clean up temporary file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      url: cleanUrl,
      fileName: fileName,
      size: file.size,
      type: file.mimetype
    });

  } catch (error) {
    console.error('Upload API error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
