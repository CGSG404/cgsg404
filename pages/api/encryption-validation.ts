import { NextApiRequest, NextApiResponse } from 'next';
import { encrypt, decrypt, hash, generateToken, encryptUserData, decryptUserData } from '../../src/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    const validationResults = [];

    // Test 1: Basic String Encryption
    try {
      const testStrings = [
        'Hello World!',
        'This is a longer test string with special characters: !@#$%^&*()',
        'Email: user@example.com',
        'Phone: +65 1234 5678',
        'JSON: {"name":"John","age":30}',
        'Unicode: 🎉🔐✅❌🚀'
      ];

      for (const testString of testStrings) {
        const encrypted = encrypt(testString);
        const decrypted = decrypt(encrypted);
        
        validationResults.push({
          test: 'Basic String Encryption',
          input: testString,
          success: decrypted === testString,
          details: {
            original: testString,
            encrypted: encrypted.substring(0, 50) + '...',
            decrypted: decrypted,
            match: decrypted === testString,
            encryptedLength: encrypted.length
          }
        });
      }
    } catch (error) {
      validationResults.push({
        test: 'Basic String Encryption',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Hash Function Validation
    try {
      const testPasswords = [
        'password123',
        'MySecurePassword!@#',
        'short',
        'very_long_password_with_many_characters_1234567890',
        '🔐🚀✅'
      ];

      for (const password of testPasswords) {
        const hash1 = hash(password);
        const hash2 = hash(password);
        
        validationResults.push({
          test: 'Hash Function Validation',
          input: password,
          success: hash1 === hash2 && hash1.length === 64,
          details: {
            password: password,
            hash1: hash1,
            hash2: hash2,
            consistent: hash1 === hash2,
            correctLength: hash1.length === 64
          }
        });
      }
    } catch (error) {
      validationResults.push({
        test: 'Hash Function Validation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Token Generation
    try {
      const tokenSizes = [8, 16, 32, 64];
      
      for (const size of tokenSizes) {
        const token1 = generateToken(size);
        const token2 = generateToken(size);
        
        validationResults.push({
          test: 'Token Generation',
          input: `${size} bytes`,
          success: token1 !== token2 && token1.length === size * 2,
          details: {
            requestedSize: size,
            token1: token1,
            token2: token2,
            unique: token1 !== token2,
            correctLength: token1.length === size * 2,
            actualLength: token1.length
          }
        });
      }
    } catch (error) {
      validationResults.push({
        test: 'Token Generation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: User Data Encryption
    try {
      const testUserData = [
        {
          email: 'user@example.com',
          phone: '+65 1234 5678',
          personalInfo: { name: 'John Doe', age: 30 }
        },
        {
          email: 'admin@casino.com',
          phone: '+1 555 123 4567',
          personalInfo: { name: 'Jane Smith', age: 25, role: 'admin' }
        },
        {
          email: 'test@unicode.com',
          phone: '+81 90 1234 5678',
          personalInfo: { name: '田中太郎', age: 35, city: '東京' }
        }
      ];

      for (const userData of testUserData) {
        const encrypted = encryptUserData(userData);
        const decrypted = decryptUserData(encrypted);
        
        validationResults.push({
          test: 'User Data Encryption',
          input: userData.email,
          success: JSON.stringify(userData) === JSON.stringify(decrypted),
          details: {
            original: userData,
            encrypted: {
              email: encrypted.email?.substring(0, 30) + '...',
              phone: encrypted.phone?.substring(0, 30) + '...',
              personalInfo: encrypted.personalInfo?.substring(0, 30) + '...'
            },
            decrypted: decrypted,
            match: JSON.stringify(userData) === JSON.stringify(decrypted)
          }
        });
      }
    } catch (error) {
      validationResults.push({
        test: 'User Data Encryption',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 5: Large Data Encryption
    try {
      const largeData = 'A'.repeat(10000); // 10KB of data
      const encrypted = encrypt(largeData);
      const decrypted = decrypt(encrypted);
      
      validationResults.push({
        test: 'Large Data Encryption',
        input: `${largeData.length} characters`,
        success: decrypted === largeData,
        details: {
          originalSize: largeData.length,
          encryptedSize: encrypted.length,
          decryptedSize: decrypted.length,
          match: decrypted === largeData
        }
      });
    } catch (error) {
      validationResults.push({
        test: 'Large Data Encryption',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Calculate summary
    const totalTests = validationResults.length;
    const passedTests = validationResults.filter(result => result.success).length;
    const failedTests = totalTests - passedTests;
    const successRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(2) : '0';

    return res.status(200).json({
      success: failedTests === 0,
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: `${successRate}%`
      },
      encryptionKeyStatus: 'Present',
      encryptionKeyLength: process.env.ENCRYPTION_KEY?.length || 0,
      validationResults,
      timestamp: new Date().toISOString(),
      message: failedTests === 0 ? 
        '🎉 All encryption validation tests passed!' : 
        `⚠️ ${failedTests} out of ${totalTests} tests failed`
    });

  } catch (error) {
    console.error('Encryption validation API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
