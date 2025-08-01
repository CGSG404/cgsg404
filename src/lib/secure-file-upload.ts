// src/lib/secure-file-upload.ts
import { encrypt, decrypt, generateToken } from './encryption';
import { supabase } from './supabaseClient';
import { createClient } from '@supabase/supabase-js';

interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedName?: string;
}

interface SecureUploadOptions {
  bucket: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  encryptFile?: boolean;
  virusScan?: boolean;
  adminOnly?: boolean;
  userId?: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  encryptedFileName?: string;
  size?: number;
  type?: string;
  error?: string;
  scanResult?: VirusScanResult;
}

interface VirusScanResult {
  isClean: boolean;
  threats?: string[];
  scanTime: number;
}

/**
 * Secure File Upload System with encryption and validation
 */
export class SecureFileUpload {
  private static readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly DEFAULT_ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  /**
   * Validate file before upload
   */
  static validateFile(file: File, options: SecureUploadOptions): FileValidationResult {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Sanitize filename
    const sanitizedName = this.sanitizeFileName(file.name);
    if (!sanitizedName) {
      return {
        isValid: false,
        error: 'Invalid filename'
      };
    }

    return {
      isValid: true,
      sanitizedName
    };
  }

  /**
   * Sanitize filename to prevent path traversal and other attacks
   */
  static sanitizeFileName(fileName: string): string {
    // Input validation
    if (!fileName || typeof fileName !== 'string') {
      return 'file';
    }

    // Remove path separators and dangerous characters
    let sanitized = fileName
      .replace(/[\/\\:*?"<>|]/g, '')
      .replace(/\.\./g, '')
      .replace(/^\.+/, '')
      .trim();

    // Ensure filename is not empty
    if (!sanitized) {
      sanitized = 'file';
    }

    // Limit length
    if (sanitized.length > 100) {
      try {
        const ext = sanitized.split('.').pop();
        sanitized = sanitized.substring(0, 90) + (ext ? `.${ext}` : '');
      } catch (error) {
        console.error('❌ Error splitting filename:', error);
        sanitized = sanitized.substring(0, 90);
      }
    }

    return sanitized;
  }

  /**
   * Simulate virus scanning (in production, integrate with real antivirus API)
   */
  static async simulateVirusScan(buffer: ArrayBuffer): Promise<VirusScanResult> {
    const startTime = Date.now();
    
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check for suspicious patterns (basic simulation)
    const uint8Array = new Uint8Array(buffer);
    const suspicious = [
      'virus', 'malware', 'trojan', 'worm', 'backdoor'
    ];
    
    const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array.slice(0, 1000));
    const threats = suspicious.filter(threat => 
      text.toLowerCase().includes(threat)
    );

    return {
      isClean: threats.length === 0,
      threats: threats.length > 0 ? threats : undefined,
      scanTime: Date.now() - startTime
    };
  }

  /**
   * Generate secure filename with timestamp and random string
   */
  static generateSecureFileName(originalName: string, prefix?: string): string {
    // Input validation
    if (!originalName || typeof originalName !== 'string') {
      originalName = 'file.bin';
    }

    const timestamp = Date.now();
    const randomString = generateToken(8); // 8 bytes = 16 hex chars

    let extension = 'bin';
    let nameWithoutExt = originalName;

    try {
      const parts = originalName.split('.');
      if (parts.length > 1) {
        extension = parts.pop() || 'bin';
        nameWithoutExt = parts.join('.');
      }
    } catch (error) {
      console.error('❌ Error parsing filename:', error);
      extension = 'bin';
      nameWithoutExt = 'file';
    }

    const sanitizedName = this.sanitizeFileName(nameWithoutExt);

    return `${prefix || 'file'}-${sanitizedName}-${timestamp}-${randomString}.${extension}`;
  }

  /**
   * Encrypt file buffer
   */
  static async encryptFileBuffer(buffer: ArrayBuffer): Promise<string> {
    const uint8Array = new Uint8Array(buffer);
    const base64Data = btoa(String.fromCharCode(...uint8Array));
    return encrypt(base64Data);
  }

  /**
   * Decrypt file buffer
   */
  static async decryptFileBuffer(encryptedData: string): Promise<ArrayBuffer> {
    const base64Data = decrypt(encryptedData);
    const binaryString = atob(base64Data);
    const uint8Array = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    return uint8Array.buffer;
  }

  /**
   * Upload file securely with optional encryption
   */
  static async uploadSecure(
    file: File, 
    options: SecureUploadOptions
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, options);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Read file buffer
      const buffer = await file.arrayBuffer();

      // Virus scan if enabled
      let scanResult: VirusScanResult | undefined;
      if (options.virusScan) {
        scanResult = await this.simulateVirusScan(buffer);
        if (!scanResult.isClean) {
          return {
            success: false,
            error: `File failed virus scan: ${scanResult.threats?.join(', ')}`,
            scanResult
          };
        }
      }

      // Generate secure filename
      const secureFileName = this.generateSecureFileName(
        validation.sanitizedName!,
        options.bucket
      );

      // Create Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      
      const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      let uploadBuffer: ArrayBuffer | Uint8Array = buffer;
      let contentType = file.type;
      let finalFileName = secureFileName;

      // Encrypt file if requested
      if (options.encryptFile) {
        const encryptedData = await this.encryptFileBuffer(buffer);
        uploadBuffer = new TextEncoder().encode(encryptedData);
        contentType = 'application/octet-stream';
        finalFileName = `encrypted-${secureFileName}`;
      }

      // Upload to Supabase Storage
      const { data, error } = await supabaseClient.storage
        .from(options.bucket)
        .upload(finalFileName, uploadBuffer, {
          contentType,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return {
          success: false,
          error: `Upload failed: ${error.message}`
        };
      }

      // Get public URL
      const { data: urlData } = supabaseClient.storage
        .from(options.bucket)
        .getPublicUrl(finalFileName);

      return {
        success: true,
        url: urlData.publicUrl,
        fileName: secureFileName,
        encryptedFileName: options.encryptFile ? finalFileName : undefined,
        size: file.size,
        type: file.type,
        scanResult
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Download and decrypt file
   */
  static async downloadSecure(
    fileName: string,
    bucket: string,
    isEncrypted: boolean = false
  ): Promise<{ success: boolean; data?: ArrayBuffer; error?: string }> {
    try {
      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .download(fileName);

      if (error) {
        return {
          success: false,
          error: `Download failed: ${error.message}`
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'No data received'
        };
      }

      let fileBuffer = await data.arrayBuffer();

      // Decrypt if file was encrypted
      if (isEncrypted) {
        const encryptedText = new TextDecoder().decode(fileBuffer);
        fileBuffer = await this.decryptFileBuffer(encryptedText);
      }

      return {
        success: true,
        data: fileBuffer
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed'
      };
    }
  }

  /**
   * Delete file securely
   */
  static async deleteSecure(
    fileName: string,
    bucket: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error } = await supabaseClient.storage
        .from(bucket)
        .remove([fileName]);

      if (error) {
        return {
          success: false,
          error: `Delete failed: ${error.message}`
        };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }
}
