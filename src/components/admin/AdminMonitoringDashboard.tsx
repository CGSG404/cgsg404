'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { databaseApi } from '@/src/lib/database-api';

interface AdminMetrics {
  active_admins_today: number;
  total_actions_today: number;
  total_actions_this_week: number;
  critical_alerts_unresolved: number;
  high_alerts_unresolved: number;
  top_actions_today: Array<{ action: string; count: number }>;
  recent_critical_alerts: Array<{
    id: string;
    alert_type: string;
    message: string;
    created_at: string;
  }>;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: any;
  is_resolved: boolean;
  created_at: string;
  admin_users?: { email: string; role: string };
}

export default function AdminMonitoringDashboard() {
  const { isAdmin } = useAdmin();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [metricsData, alertsData] = await Promise.all([
        databaseApi.getAdminMetrics(),
        databaseApi.getSecurityAlerts(true) // Only unresolved
      ]);
      
      setMetrics(metricsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const resolveAlert = async (alertId: string, notes?: string) => {
    try {
      await databaseApi.resolveSecurityAlert(alertId, notes);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
        <p className="text-red-600">You need admin access to view monitoring dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📊 Admin Monitoring Dashboard
        </h2>
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Admins Today"
          value={metrics?.active_admins_today || 0}
          icon="👥"
          color="bg-blue-50 border-blue-200"
        />
        <MetricCard
          title="Actions Today"
          value={metrics?.total_actions_today || 0}
          icon="⚡"
          color="bg-green-50 border-green-200"
        />
        <MetricCard
          title="Actions This Week"
          value={metrics?.total_actions_this_week || 0}
          icon="📈"
          color="bg-purple-50 border-purple-200"
        />
        <MetricCard
          title="Unresolved Alerts"
          value={(metrics?.critical_alerts_unresolved || 0) + (metrics?.high_alerts_unresolved || 0)}
          icon="🚨"
          color="bg-red-50 border-red-200"
        />
      </div>

      {/* Top Actions Today */}
      {metrics?.top_actions_today && metrics.top_actions_today.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🔥 Top Actions Today</h3>
          <div className="space-y-2">
            {metrics.top_actions_today.map((action, index) => (
              <div key={action.action} className="flex justify-between items-center bg-white p-2 rounded">
                <span className="font-medium text-gray-700">
                  #{index + 1} {action.action.replace(/_/g, ' ').toUpperCase()}
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                  {action.count} times
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Alerts */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          🚨 Security Alerts ({alerts.length})
        </h3>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">✅</div>
            <p>No unresolved security alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">
                      {alert.alert_type.replace(/_/g, ' ').toUpperCase()}
                    </h4>
                    <p className="text-sm opacity-75">{alert.message}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-white bg-opacity-50">
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-xs opacity-75 mb-3">
                  <p>Admin: {alert.admin_users?.email || 'Unknown'}</p>
                  <p>Time: {new Date(alert.created_at).toLocaleString()}</p>
                </div>
                
                <button
                  onClick={() => resolveAlert(alert.id, 'Resolved from dashboard')}
                  className="bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  ✅ Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="mt-4 text-center text-sm text-gray-500">
        🔄 Auto-refreshes every 30 seconds
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className={`border rounded-lg p-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}
