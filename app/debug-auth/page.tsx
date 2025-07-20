'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useAuthDebug, useAuthPerformanceMonitor } from '@/src/hooks/useAuthDebug';

export default function DebugAuthPage() {
  const debug = useAuthDebug();
  const performance = useAuthPerformanceMonitor();
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto refresh every 2 seconds if enabled
  useState(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Force re-render by updating state
        setAutoRefresh(prev => prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-casino-dark p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl gradient-text">🔍 Auth Debug Dashboard</CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant={performance.isHealthy ? "default" : "destructive"}>
                  {performance.isHealthy ? "✅ Healthy" : "⚠️ Issues Detected"}
                </Badge>
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? "🔄 Auto Refresh ON" : "⏸️ Auto Refresh OFF"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Current State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-lg text-casino-neon-green">Current Auth State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">User:</span>
                <Badge variant={debug.user ? "default" : "secondary"}>
                  {debug.user ? "✅ Authenticated" : "❌ Not Authenticated"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Loading:</span>
                <Badge variant={debug.loading ? "destructive" : "default"}>
                  {debug.loading ? "🔄 Loading" : "✅ Ready"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Error:</span>
                <Badge variant={debug.error ? "destructive" : "default"}>
                  {debug.error ? "❌ Error" : "✅ No Error"}
                </Badge>
              </div>
              {debug.error && (
                <div className="mt-2 p-2 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-sm">
                  {debug.error}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-lg text-casino-neon-blue">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Render Count:</span>
                <Badge variant={debug.renderCount > 10 ? "destructive" : "default"}>
                  {debug.renderCount}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Init Count:</span>
                <Badge variant={debug.initCount > 3 ? "destructive" : "default"}>
                  {debug.initCount}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Render:</span>
                <span className="text-sm text-gray-300">{formatTime(debug.lastRender)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Update:</span>
                <span className="text-sm text-gray-300">{formatTime(debug.lastUpdate)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle">
            <CardHeader>
              <CardTitle className="text-lg text-casino-neon-purple">Latest Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Last Event:</span>
                <Badge variant="outline">{debug.lastEvent}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Error Count:</span>
                <Badge variant={debug.errorHistory.length > 0 ? "destructive" : "default"}>
                  {debug.errorHistory.length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">State Changes:</span>
                <Badge variant="outline">{debug.stateHistory.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Warnings */}
        {!performance.isHealthy && (
          <Card className="bg-red-900/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-red-400">⚠️ Performance Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {performance.warnings.highRenderCount && (
                  <div className="text-red-400">• High render count detected ({performance.metrics.renderCount})</div>
                )}
                {performance.warnings.multipleInits && (
                  <div className="text-red-400">• Multiple initializations detected ({performance.metrics.initCount})</div>
                )}
                {performance.warnings.multipleErrors && (
                  <div className="text-red-400">• Multiple errors detected ({performance.metrics.errorCount})</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* State History */}
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <CardTitle className="text-lg text-casino-neon-green">State Change History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {debug.stateHistory.slice().reverse().map((state, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-casino-dark/50 rounded">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">{state.event}</Badge>
                    <span className="text-sm text-gray-400">
                      User: {state.user ? "✅" : "❌"} | Loading: {state.loading ? "🔄" : "✅"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(state.timestamp)}</span>
                </div>
              ))}
              {debug.stateHistory.length === 0 && (
                <div className="text-center text-gray-500 py-4">No state changes recorded yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error History */}
        {debug.errorHistory.length > 0 && (
          <Card className="bg-red-900/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-red-400">Error History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {debug.errorHistory.slice().reverse().map((error, index) => (
                  <div key={index} className="p-3 bg-red-900/20 border border-red-500/20 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="destructive" className="text-xs">{error.context}</Badge>
                      <span className="text-xs text-gray-500">{formatTime(error.timestamp)}</span>
                    </div>
                    <div className="text-sm text-red-400">{error.error}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}