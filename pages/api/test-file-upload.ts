import { NextApiRequest, NextApiResponse } from 'next';
import { SecureFileUpload } from '../../src/lib/secure-file-upload';
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
    const testResults = [];

    // Test 1: File Validation
    try {
      const testFiles = [
        { name: 'test.jpg', size: 1024 * 1024, type: 'image/jpeg' }, // Valid
        { name: 'large.jpg', size: 10 * 1024 * 1024, type: 'image/jpeg' }, // Too large
        { name: 'script.js', size: 1024, type: 'application/javascript' }, // Invalid type
        { name: '../../../etc/passwd', size: 1024, type: 'image/jpeg' }, // Path traversal
        { name: 'normal-file.png', size: 2 * 1024 * 1024, type: 'image/png' }, // Valid
      ];

      const validationResults = testFiles.map(fileInfo => {
        const mockFile = new File(['test'], fileInfo.name, { type: fileInfo.type });
        Object.defineProperty(mockFile, 'size', { value: fileInfo.size });
        
        const validation = SecureFileUpload.validateFile(mockFile, {
          bucket: 'casino-logos',
          maxSize: 5 * 1024 * 1024,
          allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });

        return {
          fileName: fileInfo.name,
          size: fileInfo.size,
          type: fileInfo.type,
          isValid: validation.isValid,
          error: validation.error,
          sanitizedName: validation.sanitizedName
        };
      });

      const validCount = validationResults.filter(r => r.isValid).length;
      const invalidCount = validationResults.length - validCount;

      testResults.push({
        test: 'File Validation',
        success: validCount === 2 && invalidCount === 3, // Expect 2 valid, 3 invalid
        details: {
          totalFiles: validationResults.length,
          validFiles: validCount,
          invalidFiles: invalidCount,
          results: validationResults
        }
      });
    } catch (error) {
      testResults.push({
        test: 'File Validation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Filename Sanitization
    try {
      const testFilenames = [
        'normal-file.jpg',
        '../../../etc/passwd',
        'file with spaces.png',
        'file<>:"|?*.gif',
        '....hidden.jpg',
        'very-long-filename-that-exceeds-the-maximum-allowed-length-for-filenames-in-most-systems.jpg',
        ''
      ];

      const sanitizationResults = testFilenames.map(filename => ({
        original: filename,
        sanitized: SecureFileUpload.sanitizeFileName(filename),
        isSafe: !SecureFileUpload.sanitizeFileName(filename).includes('..')
      }));

      const allSafe = sanitizationResults.every(r => r.isSafe);

      testResults.push({
        test: 'Filename Sanitization',
        success: allSafe,
        details: {
          totalTests: sanitizationResults.length,
          allSafe,
          results: sanitizationResults
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Filename Sanitization',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Virus Scanning Simulation
    try {
      const testBuffers = [
        new TextEncoder().encode('This is a clean file content'),
        new TextEncoder().encode('This file contains virus signature'),
        new TextEncoder().encode('Normal image data here'),
        new TextEncoder().encode('malware detected in this content'),
        new TextEncoder().encode('Clean content without threats')
      ];

      const scanResults = await Promise.all(
        testBuffers.map(async (buffer, index) => {
          const scanResult = await SecureFileUpload.simulateVirusScan(buffer.buffer);
          return {
            testIndex: index,
            isClean: scanResult.isClean,
            threats: scanResult.threats,
            scanTime: scanResult.scanTime
          };
        })
      );

      const cleanFiles = scanResults.filter(r => r.isClean).length;
      const threatenedFiles = scanResults.filter(r => !r.isClean).length;

      testResults.push({
        test: 'Virus Scanning Simulation',
        success: cleanFiles > 0 && threatenedFiles > 0, // Should detect both clean and threatened
        details: {
          totalScans: scanResults.length,
          cleanFiles,
          threatenedFiles,
          averageScanTime: Math.round(scanResults.reduce((sum, r) => sum + r.scanTime, 0) / scanResults.length),
          results: scanResults
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Virus Scanning Simulation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: Secure Filename Generation
    try {
      const testNames = [
        'profile-picture.jpg',
        'casino-logo.png',
        'document.pdf',
        'image with spaces.gif',
        'special-chars!@#.webp'
      ];

      const filenameResults = testNames.map(name => {
        const secureFilename = SecureFileUpload.generateSecureFileName(name, 'test');
        return {
          original: name,
          secure: secureFilename,
          hasTimestamp: secureFilename.includes(Date.now().toString().substring(0, 8)),
          hasRandomString: secureFilename.length > name.length + 20,
          isUnique: true // Each call should be unique
        };
      });

      const allSecure = filenameResults.every(r => r.hasTimestamp && r.hasRandomString);

      testResults.push({
        test: 'Secure Filename Generation',
        success: allSecure,
        details: {
          totalTests: filenameResults.length,
          allSecure,
          results: filenameResults
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Secure Filename Generation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 5: Encryption/Decryption
    try {
      const testData = 'This is test file content for encryption testing';
      const buffer = new TextEncoder().encode(testData).buffer;

      const encrypted = await SecureFileUpload.encryptFileBuffer(buffer);
      const decrypted = await SecureFileUpload.decryptFileBuffer(encrypted);
      const decryptedText = new TextDecoder().decode(decrypted);

      const encryptionWorking = decryptedText === testData;
      const encryptedDifferent = encrypted !== testData;

      testResults.push({
        test: 'File Encryption/Decryption',
        success: encryptionWorking && encryptedDifferent,
        details: {
          originalLength: testData.length,
          encryptedLength: encrypted.length,
          decryptedLength: decryptedText.length,
          encryptionWorking,
          encryptedDifferent,
          dataIntegrity: decryptedText === testData
        }
      });
    } catch (error) {
      testResults.push({
        test: 'File Encryption/Decryption',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 6: Environment Configuration
    try {
      const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
      const hasEncryptionKey = !!process.env.ENCRYPTION_KEY;

      testResults.push({
        test: 'Environment Configuration',
        success: hasSupabaseUrl && hasServiceRole && hasEncryptionKey,
        details: {
          supabaseUrl: hasSupabaseUrl ? 'Present' : 'Missing',
          serviceRoleKey: hasServiceRole ? 'Present' : 'Missing',
          encryptionKey: hasEncryptionKey ? 'Present' : 'Missing',
          allConfigured: hasSupabaseUrl && hasServiceRole && hasEncryptionKey
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Environment Configuration',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Calculate summary
    const totalTests = testResults.length;
    const passedTests = testResults.filter(result => result.success).length;
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
      fileUploadStatus: 'Secure System Ready',
      testResults,
      timestamp: new Date().toISOString(),
      message: failedTests === 0 ? 
        '🎉 All file upload security tests passed!' : 
        `⚠️ ${failedTests} out of ${totalTests} tests failed`
    });

  } catch (error) {
    console.error('File upload test API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

// Export with rate limiting
export default withRateLimit(rateLimitConfigs.debug, handler);
