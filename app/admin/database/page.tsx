'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { 
  Database, 
  Activity, 
  Search, 
  BarChart3, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface DatabaseTestResult {
  test: string;
  success: boolean;
  details?: any;
  error?: string;
}

interface DatabaseMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: string;
}

export default function AdminDatabasePage() {
  const { isAdmin, isLoading } = useAdmin();
  const [testResults, setTestResults] = useState<DatabaseTestResult[]>([]);
  const [metrics, setMetrics] = useState<DatabaseMetrics | null>(null);
  const [testing, setTesting] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<string | null>(null);

  // Auto-run basic test on load
  useEffect(() => {
    if (isAdmin && !isLoading) {
      runBasicTest();
    }
  }, [isAdmin, isLoading]);

  const runBasicTest = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/test-database');
      const data = await response.json();
      
      if (data.success) {
        setTestResults(data.testResults || []);
        setMetrics(data.summary);
        setLastTestTime(new Date().toLocaleString());
      } else {
        setTestResults([{
          test: 'Database Connection',
          success: false,
          error: data.error || 'Unknown error'
        }]);
      }
    } catch (error) {
      setTestResults([{
        test: 'Database Connection',
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }]);
    } finally {
      setTesting(false);
    }
  };

  const openDatabaseDashboard = () => {
    window.open('/database-dashboard.html', '_blank');
  };

  const openEncryptionDashboard = () => {
    window.open('/encryption-dashboard.html', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin database panel...</p>
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
                <Database className="h-8 w-8 text-casino-neon-green" />
                Database Operations
              </h1>
              <p className="text-gray-400 mt-1">
                Monitor database performance, test operations, and view analytics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-casino-neon-green text-casino-neon-green">
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
              <CardTitle className="text-casino-neon-green flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Database Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Run comprehensive database operation tests</p>
              <Button 
                onClick={runBasicTest} 
                disabled={testing}
                className="w-full bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80"
              >
                {testing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-casino-neon-blue flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">View detailed database performance metrics</p>
              <Button 
                onClick={openDatabaseDashboard}
                className="w-full bg-casino-neon-blue text-white hover:bg-casino-neon-blue/80"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Open Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-casino-neon-purple flex items-center gap-2">
                <Search className="h-5 w-5" />
                Encryption Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Monitor encryption system and security</p>
              <Button 
                onClick={openEncryptionDashboard}
                className="w-full bg-casino-neon-purple text-white hover:bg-casino-neon-purple/80"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Open Monitor
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Tests</p>
                    <p className="text-2xl font-bold text-white">{metrics.totalTests}</p>
                  </div>
                  <Database className="h-8 w-8 text-casino-neon-green" />
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
                  <TrendingUp className="h-8 w-8 text-casino-neon-green" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Results */}
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Database Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No test results yet. Run a test to see results.</p>
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
                              ? `${result.details.count || 0} items, ${result.details.responseTime || 'N/A'}`
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
