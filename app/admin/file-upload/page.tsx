'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { 
  Upload, 
  Shield, 
  FileCheck, 
  Lock, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

interface FileUploadTestResult {
  test: string;
  success: boolean;
  details?: any;
  error?: string;
}

interface FileUploadMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: string;
}

export default function AdminFileUploadPage() {
  const { isAdmin, isLoading } = useAdmin();
  const [testResults, setTestResults] = useState<FileUploadTestResult[]>([]);
  const [metrics, setMetrics] = useState<FileUploadMetrics | null>(null);
  const [testing, setTesting] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Auto-run security test on load
  useEffect(() => {
    if (isAdmin && !isLoading) {
      runSecurityTest();
    }
  }, [isAdmin, isLoading]);

  const runSecurityTest = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/test-file-upload');
      const data = await response.json();
      
      if (data.success) {
        setTestResults(data.testResults || []);
        setMetrics(data.summary);
        setLastTestTime(new Date().toLocaleString());
      } else {
        setTestResults([{
          test: 'File Upload Security',
          success: false,
          error: data.error || 'Unknown error'
        }]);
      }
    } catch (error) {
      setTestResults([{
        test: 'File Upload Security',
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }]);
    } finally {
      setTesting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadResult(null);
    }
  };

  const handleSecureUpload = async () => {
    if (!uploadFile) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('bucket', 'secure-files');
      formData.append('encrypt', 'true');
      formData.append('virusScan', 'true');
      formData.append('adminOnly', 'true');

      const response = await fetch('/api/secure-upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setUploadResult(data);

    } catch (error) {
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setUploading(false);
    }
  };

  const openFileUploadDashboard = () => {
    window.open('/file-upload-dashboard.html', '_blank');
  };

  const openEncryptionDashboard = () => {
    window.open('/encryption-dashboard.html', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin file upload panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark">
      {/* Header */}
      <div className="bg-casino-card-bg border-b border-casino-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Upload className="h-8 w-8 text-casino-neon-blue" />
                File Upload Security
              </h1>
              <p className="text-gray-400 mt-1">
                Secure file upload with encryption, virus scanning, and validation
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-casino-neon-blue text-casino-neon-blue">
                Admin Panel
              </Badge>
              {lastTestTime && (
                <Badge variant="outline" className="border-gray-500 text-gray-400">
                  Last Test: {lastTestTime}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-casino-neon-blue flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Run comprehensive file upload security tests</p>
              <Button 
                onClick={runSecurityTest} 
                disabled={testing}
                className="w-full bg-casino-neon-blue text-white hover:bg-casino-neon-blue/80"
              >
                {testing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Run Security Tests
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-casino-neon-green flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Upload Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Interactive file upload testing dashboard</p>
              <Button 
                onClick={openFileUploadDashboard}
                className="w-full bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80"
              >
                <Activity className="h-4 w-4 mr-2" />
                Open Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-casino-neon-purple flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Encryption Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Monitor encryption system and security</p>
              <Button 
                onClick={openEncryptionDashboard}
                className="w-full bg-casino-neon-purple text-white hover:bg-casino-neon-purple/80"
              >
                <Lock className="h-4 w-4 mr-2" />
                Open Monitor
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Security Tests</p>
                    <p className="text-2xl font-bold text-white">{metrics.totalTests}</p>
                  </div>
                  <Shield className="h-8 w-8 text-casino-neon-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Passed</p>
                    <p className="text-2xl font-bold text-green-500">{metrics.passedTests}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Failed</p>
                    <p className="text-2xl font-bold text-red-500">{metrics.failedTests}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold text-casino-neon-green">{metrics.successRate}</p>
                  </div>
                  <Zap className="h-8 w-8 text-casino-neon-green" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Secure File Upload Test */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Secure Upload Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="w-full p-3 bg-casino-dark border border-casino-border-subtle rounded-lg text-white"
                    accept="image/*,.pdf,.txt,.json,.zip"
                  />
                </div>
                
                {uploadFile && (
                  <div className="bg-casino-dark p-3 rounded-lg">
                    <p className="text-white text-sm">
                      <strong>Selected:</strong> {uploadFile.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Size: {Math.round(uploadFile.size / 1024)}KB | Type: {uploadFile.type}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleSecureUpload}
                  disabled={!uploadFile || uploading}
                  className="w-full bg-casino-neon-blue text-white hover:bg-casino-neon-blue/80"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Uploading Securely...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Secure Upload (Encrypted + Scanned)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Upload Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadResult ? (
                <div className="space-y-3">
                  {uploadResult.success ? (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-500 font-medium">Upload Successful!</span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p><strong>File:</strong> {uploadResult.fileName}</p>
                        <p><strong>Size:</strong> {Math.round(uploadResult.size / 1024)}KB</p>
                        <p><strong>Encrypted:</strong> {uploadResult.security?.encrypted ? '🔐 Yes' : '❌ No'}</p>
                        <p><strong>Virus Scanned:</strong> {uploadResult.security?.virusScanned ? '🦠 Clean' : '❌ No'}</p>
                        {uploadResult.scanResult && (
                          <p><strong>Scan Time:</strong> {uploadResult.scanResult.scanTime}ms</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-500 font-medium">Upload Failed</span>
                      </div>
                      <p className="text-sm text-gray-300">{uploadResult.error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Select and upload a file to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Test Results */}
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No test results yet. Run security tests to see results.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-casino-dark rounded-lg border border-casino-border-subtle"
                  >
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-white font-medium">{result.test}</p>
                        {result.details && (
                          <p className="text-gray-400 text-sm">
                            {typeof result.details === 'object' 
                              ? `${result.details.totalTests || result.details.totalFiles || 0} tests completed`
                              : result.details
                            }
                          </p>
                        )}
                        {result.error && (
                          <p className="text-red-400 text-sm">{result.error}</p>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={result.success ? "default" : "destructive"}
                      className={result.success ? "bg-green-500/20 text-green-500" : ""}
                    >
                      {result.success ? 'PASS' : 'FAIL'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
