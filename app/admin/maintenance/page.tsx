'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ToggleLeft, 
  ToggleRight, 
  Edit3, 
  Save, 
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/src/lib/supabaseClient';

interface PageMaintenance {
  id: number;
  page_path: string;
  page_name: string;
  is_maintenance: boolean;
  maintenance_message: string;
  updated_at: string;
}

interface ApiResponse {
  pages: PageMaintenance[];
  mock?: boolean;
}

const MaintenanceManagementPage = () => {
  const [pages, setPages] = useState<PageMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  // Fetch pages data
  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/page-maintenance', {
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch pages`);
      }

      const data: ApiResponse = await response.json();
      setPages(data.pages || []);
      setIsMockData(data.mock || false);
    } catch (err) {
      console.error('❌ Error fetching pages:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get auth headers
  const getAuthHeaders = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.access_token) {
        throw new Error('No valid session found');
      }

      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      };
    } catch (error) {
      console.error('❌ Error getting auth headers:', error);
      throw new Error('Authentication failed');
    }
  };

  // Toggle maintenance mode
  const toggleMaintenance = async (page: PageMaintenance) => {
    try {
      setActionLoading(`toggle-${page.id}`);

      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/page-maintenance', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          page_path: page.page_path,
          is_maintenance: !page.is_maintenance,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle maintenance mode');
      }

      const data = await response.json();
      
      // Update local state
      setPages(prev => prev.map(p => 
        p.id === page.id ? { ...p, is_maintenance: !p.is_maintenance } : p
      ));

      // Show success message (you can implement toast here)
      console.log(data.message);
    } catch (err) {
      console.error('Error toggling maintenance:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle maintenance');
    } finally {
      setActionLoading(null);
    }
  };

  // Update maintenance message
  const updateMessage = async (page: PageMaintenance) => {
    try {
      setActionLoading(`save-${page.id}`);

      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/page-maintenance', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          page_path: page.page_path,
          maintenance_message: editMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update message');
      }

      // Update local state
      setPages(prev => prev.map(p => 
        p.id === page.id ? { ...p, maintenance_message: editMessage } : p
      ));

      setEditingPage(null);
      setEditMessage('');
    } catch (err) {
      console.error('Error updating message:', err);
      setError(err instanceof Error ? err.message : 'Failed to update message');
    } finally {
      setActionLoading(null);
    }
  };

  // Start editing message
  const startEditing = (page: PageMaintenance) => {
    setEditingPage(page.id);
    setEditMessage(page.maintenance_message);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPage(null);
    setEditMessage('');
  };

  useEffect(() => {
    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Settings className="w-8 h-8 text-blue-600" />
                  Page Maintenance Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Control maintenance mode for each page in your application
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Maintenance Settings</h3>
            <p className="text-gray-600">Please wait while we fetch the page maintenance data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Settings className="w-8 h-8 text-blue-600" />
                  Page Maintenance Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Control maintenance mode for each page in your application
                </p>
              </div>
              <button
                onClick={fetchPages}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Failed</h3>
              <p className="text-gray-600 mb-6">{error}</p>

              <div className="space-y-3">
                <button
                  onClick={fetchPages}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>

                <div className="text-sm text-gray-500">
                  <p className="mb-2">If the problem persists:</p>
                  <ul className="text-left space-y-1">
                    <li>• Check your database connection</li>
                    <li>• Verify the migration has been applied</li>
                    <li>• Ensure admin permissions are set correctly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Settings className="w-8 h-8 text-blue-600" />
                Page Maintenance Management
              </h1>
              <p className="text-gray-600 mt-1">
                Control maintenance mode for each page in your application
              </p>
            </div>
            <button
              onClick={fetchPages}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mock Data Warning */}
        {isMockData && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <span className="text-yellow-800 font-semibold">Development Mode Active</span>
                <p className="text-yellow-700 text-sm mt-1">
                  Using mock data. Database migration required for production use.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <span className="text-red-800 font-semibold">Error</span>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Page Maintenance Status</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage maintenance mode for {pages.length} pages
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>Maintenance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {pages.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pages Found</h3>
                <p className="text-gray-500 mb-4">No maintenance pages are configured yet.</p>
                <button
                  onClick={fetchPages}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {pages.map((page) => (
                <div
                  key={page.id}
                  className={`border rounded-xl p-5 transition-all duration-200 hover:shadow-md ${
                    page.is_maintenance
                      ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-red-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                        page.is_maintenance ? 'bg-orange-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <h3 className="font-semibold text-gray-900">{page.page_name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{page.page_path}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                        page.is_maintenance
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {page.is_maintenance ? (
                          <>
                            <Clock className="w-3 h-3" />
                            Maintenance Mode
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Live & Active
                          </>
                        )}
                      </span>

                      <button
                        onClick={() => toggleMaintenance(page)}
                        disabled={actionLoading === `toggle-${page.id}`}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          page.is_maintenance
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-green-500 hover:bg-green-600'
                        } ${actionLoading === `toggle-${page.id}` ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          page.is_maintenance ? 'translate-x-7' : 'translate-x-1'
                        }`}>
                          {actionLoading === `toggle-${page.id}` ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center text-xs ${
                              page.is_maintenance ? 'text-orange-500' : 'text-green-500'
                            }`}>
                              {page.is_maintenance ? '⏸' : '▶'}
                            </div>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Maintenance Message */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        Maintenance Message
                      </label>
                      {editingPage !== page.id && (
                        <button
                          onClick={() => startEditing(page)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {editingPage === page.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows={3}
                          placeholder="Enter maintenance message for users..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateMessage(page)}
                            disabled={actionLoading === `save-${page.id}`}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                          >
                            {actionLoading === `save-${page.id}` ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3 border">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {page.maintenance_message || 'No maintenance message set'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Last updated: {new Date(page.updated_at).toLocaleString()}</span>
                    <span className="font-mono">ID: {page.id}</span>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {pages.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>Total Pages: {pages.length}</span>
                  <span>Active: {pages.filter(p => !p.is_maintenance).length}</span>
                  <span>Maintenance: {pages.filter(p => p.is_maintenance).length}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last refreshed: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagementPage;
