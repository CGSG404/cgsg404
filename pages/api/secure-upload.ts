import { NextApiRequest, NextApiResponse } from 'next';
import { SecureFileUpload } from '../../src/lib/secure-file-upload';
import { withRateLimit, rateLimitConfigs } from '../../src/lib/rateLimiter';
import formidable from 'formidable';
import fs from 'fs';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        error: 'Server configuration error',
        details: 'Missing required environment variables'
      });
    }

    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB max
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Get upload options from form fields
    const bucket = Array.isArray(fields.bucket) ? fields.bucket[0] : fields.bucket || 'casino-logos';
    const encryptFile = Array.isArray(fields.encrypt) ? fields.encrypt[0] === 'true' : fields.encrypt === 'true';
    const virusScan = Array.isArray(fields.virusScan) ? fields.virusScan[0] === 'true' : fields.virusScan === 'true';
    const adminOnly = Array.isArray(fields.adminOnly) ? fields.adminOnly[0] === 'true' : fields.adminOnly === 'true';

    // Convert formidable file to File object
    const buffer = fs.readFileSync(file.filepath);
    const fileObj = new File([buffer], file.originalFilename || 'upload', {
      type: file.mimetype || 'application/octet-stream'
    });

    // Define upload options based on bucket
    const uploadOptions = {
      bucket,
      encryptFile,
      virusScan: virusScan || bucket === 'secure-files', // Always scan secure files
      adminOnly,
      maxSize: getMaxSizeForBucket(bucket),
      allowedTypes: getAllowedTypesForBucket(bucket)
    };

    console.log('🔄 Secure upload starting:', {
      fileName: file.originalFilename,
      size: file.size,
      type: file.mimetype,
      bucket,
      encrypted: encryptFile,
      virusScan: uploadOptions.virusScan
    });

    // Upload file securely
    const result = await SecureFileUpload.uploadSecure(fileObj, uploadOptions);

    // Clean up temporary file
    fs.unlinkSync(file.filepath);

    if (!result.success) {
      return res.status(400).json({
        error: result.error,
        scanResult: result.scanResult
      });
    }

    console.log('✅ Secure upload successful:', {
      fileName: result.fileName,
      encrypted: !!result.encryptedFileName,
      scanResult: result.scanResult
    });

    return res.status(200).json({
      success: true,
      url: result.url,
      fileName: result.fileName,
      encryptedFileName: result.encryptedFileName,
      size: result.size,
      type: result.type,
      scanResult: result.scanResult,
      security: {
        encrypted: encryptFile,
        virusScanned: !!result.scanResult,
        isClean: result.scanResult?.isClean ?? true
      }
    });

  } catch (error) {
    console.error('Secure upload API error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Get maximum file size for bucket
 */
function getMaxSizeForBucket(bucket: string): number {
  const sizeMap: Record<string, number> = {
    'avatars': 2 * 1024 * 1024,        // 2MB
    'casino-logos': 5 * 1024 * 1024,   // 5MB
    'post-images': 10 * 1024 * 1024,   // 10MB
    'news-images': 10 * 1024 * 1024,   // 10MB
    'secure-files': 50 * 1024 * 1024,  // 50MB
  };
  
  return sizeMap[bucket] || 5 * 1024 * 1024; // Default 5MB
}

/**
 * Get allowed file types for bucket
 */
function getAllowedTypesForBucket(bucket: string): string[] {
  const typeMap: Record<string, string[]> = {
    'avatars': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    'casino-logos': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    'post-images': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    'news-images': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    'secure-files': [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Documents
      'application/pdf', 'text/plain', 'application/json',
      // Archives
      'application/zip', 'application/x-zip-compressed'
    ],
  };
  
  return typeMap[bucket] || ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
}

// Export with rate limiting
export default withRateLimit(rateLimitConfigs.general, handler);
