// src/lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm'; // Upgraded to GCM for authentication
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits
const KEY_LENGTH = 32; // 256 bits

// Validate encryption key
if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

if (ENCRYPTION_KEY.length !== KEY_LENGTH * 2) { // Hex string should be 64 chars
  throw new Error(`ENCRYPTION_KEY must be ${KEY_LENGTH * 2} characters (${KEY_LENGTH} bytes in hex)`);
}

// Convert hex string to buffer and validate
const key = Buffer.from(ENCRYPTION_KEY, 'hex');
if (key.length !== KEY_LENGTH) {
  throw new Error(`Invalid key length: expected ${KEY_LENGTH} bytes, got ${key.length} bytes`);
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param text - The plaintext to encrypt
 * @returns Encrypted data in format: iv:authTag:encryptedData (all hex encoded)
 */
export function encrypt(text: string): string {
  try {
    // Input validation
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid input: text must be a non-empty string');
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Combine iv + authTag + encrypted data (all hex encoded)
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  } catch (error) {
    // Secure logging - don't expose sensitive details in production
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Encryption failed:', error);
    }
    throw new Error('Encryption operation failed');
  }
}

/**
 * Decrypt sensitive data using AES-256-GCM
 * @param encryptedData - Encrypted data in format: iv:authTag:encryptedData (all hex encoded)
 * @returns Decrypted plaintext
 */
export function decrypt(encryptedData: string): string {
  try {
    // Input validation
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error('Invalid input: encryptedData must be a non-empty string');
    }

    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format: expected iv:authTag:encryptedData');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    // Validate IV and authTag lengths
    if (iv.length !== IV_LENGTH) {
      throw new Error(`Invalid IV length: expected ${IV_LENGTH} bytes`);
    }
    if (authTag.length !== TAG_LENGTH) {
      throw new Error(`Invalid auth tag length: expected ${TAG_LENGTH} bytes`);
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // Secure logging - don't expose sensitive details in production
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Decryption failed:', error);
    }
    throw new Error('Decryption operation failed');
  }
}

/**
 * Hash sensitive data (one-way)
 */
export function hash(text: string): string {
  return crypto.createHash('sha256').update(text + ENCRYPTION_KEY).digest('hex');
}

/**
 * Generate secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Encrypt user sensitive data before storing
 */
export function encryptUserData(userData: {
  email?: string;
  phone?: string;
  personalInfo?: any;
}): any {
  const encrypted = { ...userData };
  
  if (userData.email) {
    encrypted.email = encrypt(userData.email);
  }
  
  if (userData.phone) {
    encrypted.phone = encrypt(userData.phone);
  }
  
  if (userData.personalInfo) {
    encrypted.personalInfo = encrypt(JSON.stringify(userData.personalInfo));
  }
  
  return encrypted;
}

/**
 * Decrypt user sensitive data after retrieving
 */
export function decryptUserData(encryptedData: any): any {
  const decrypted = { ...encryptedData };
  
  try {
    if (encryptedData.email && typeof encryptedData.email === 'string') {
      decrypted.email = decrypt(encryptedData.email);
    }
    
    if (encryptedData.phone && typeof encryptedData.phone === 'string') {
      decrypted.phone = decrypt(encryptedData.phone);
    }
    
    if (encryptedData.personalInfo && typeof encryptedData.personalInfo === 'string') {
      decrypted.personalInfo = JSON.parse(decrypt(encryptedData.personalInfo));
    }
  } catch (error) {
    console.error('❌ User data decryption failed:', error);
    // Return original data if decryption fails (backward compatibility)
    return encryptedData;
  }
  
  return decrypted;
}
