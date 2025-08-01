import { NextApiRequest, NextApiResponse } from 'next';
import { encrypt, decrypt, hash, generateToken, encryptUserData, decryptUserData } from '../../src/lib/encryption';
import { withRateLimit, rateLimitConfigs } from '../../src/lib/rateLimiter';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if ENCRYPTION_KEY is available
    const hasEncryptionKey = !!process.env.ENCRYPTION_KEY;
    
    if (!hasEncryptionKey) {
      return res.status(500).json({
        success: false,
        error: 'ENCRYPTION_KEY not found in environment variables',
        tests: []
      });
    }

    const tests = [];

    // Test 1: Basic encryption/decryption
    try {
      const testData = 'Hello, this is a test message for encryption!';
      const encrypted = encrypt(testData);
      const decrypted = decrypt(encrypted);
      
      tests.push({
        name: 'Basic Encryption/Decryption',
        success: decrypted === testData,
        details: {
          original: testData,
          encrypted: encrypted.substring(0, 50) + '...',
          decrypted: decrypted,
          match: decrypted === testData
        }
      });
    } catch (error) {
      tests.push({
        name: 'Basic Encryption/Decryption',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Hash function
    try {
      const testPassword = 'mySecretPassword123';
      const hashedPassword = hash(testPassword);
      
      tests.push({
        name: 'Hash Function',
        success: hashedPassword.length === 64, // SHA-256 produces 64 char hex
        details: {
          original: testPassword,
          hashed: hashedPassword,
          length: hashedPassword.length
        }
      });
    } catch (error) {
      tests.push({
        name: 'Hash Function',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Token generation
    try {
      const token16 = generateToken(16);
      const token32 = generateToken(32);
      
      tests.push({
        name: 'Token Generation',
        success: token16.length === 32 && token32.length === 64, // Hex encoding doubles length
        details: {
          token16: token16,
          token32: token32,
          lengths: {
            token16: token16.length,
            token32: token32.length
          }
        }
      });
    } catch (error) {
      tests.push({
        name: 'Token Generation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: User data encryption (if POST request with data)
    if (req.method === 'POST' && req.body) {
      try {
        const { email, phone, personalInfo } = req.body;
        
        const userData = {
          email: email || 'test@example.com',
          phone: phone || '+65 1234 5678',
          personalInfo: personalInfo || { name: 'John Doe', age: 30 }
        };

        // Use imported user data encryption functions

        const encryptedUserData = encryptUserData(userData);
        const decryptedUserData = decryptUserData(encryptedUserData);
        
        tests.push({
          name: 'User Data Encryption',
          success: JSON.stringify(userData) === JSON.stringify(decryptedUserData),
          details: {
            original: userData,
            encrypted: {
              email: encryptedUserData.email?.substring(0, 50) + '...',
              phone: encryptedUserData.phone?.substring(0, 50) + '...',
              personalInfo: encryptedUserData.personalInfo?.substring(0, 50) + '...'
            },
            decrypted: decryptedUserData,
            match: JSON.stringify(userData) === JSON.stringify(decryptedUserData)
          }
        });
      } catch (error) {
        tests.push({
          name: 'User Data Encryption',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const allTestsPassed = tests.every(test => test.success);

    return res.status(200).json({
      success: allTestsPassed,
      encryptionKeyStatus: 'Present',
      encryptionKeyLength: process.env.ENCRYPTION_KEY?.length || 0,
      totalTests: tests.length,
      passedTests: tests.filter(test => test.success).length,
      tests,
      timestamp: new Date().toISOString(),
      message: allTestsPassed ? 
        '🎉 All encryption tests passed!' : 
        '⚠️ Some encryption tests failed'
    });

  } catch (error) {
    console.error('Encryption test API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

// Export with rate limiting
export default withRateLimit(rateLimitConfigs.encryption, handler);
