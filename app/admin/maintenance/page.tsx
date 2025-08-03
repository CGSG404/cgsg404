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
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch pages data
  const fetchPages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
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
      setLastRefresh(new Date());
    } catch (err) {
      console.error('❌ Error fetching pages:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (showLoading) setLoading(false);
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
      setError(null);

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to toggle maintenance mode`);
      }

      const data = await response.json();
      
      // Optimistically update local state
      setPages(prev => prev.map(p =>
        p.id === page.id ? {
          ...p,
          is_maintenance: !p.is_maintenance,
          updated_at: new Date().toISOString()
        } : p
      ));

      // Verify the change by refetching data after a short delay
      setTimeout(() => {
        fetchPages(false);
      }, 1000);

      console.log('✅ Maintenance mode toggled:', data.message);
    } catch (err) {
      console.error('❌ Error toggling maintenance:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle maintenance');
      
      // Revert optimistic update on error
      fetchPages(false);
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

  // Load data on component mount and setup realtime
  useEffect(() => {
    fetchPages();

    // Setup realtime subscription for page_maintenance table
    const channel = supabase
      .channel('page_maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_maintenance'
        },
        (payload) => {
          console.log('🔄 Realtime update received:', payload);
          // Refresh data when changes occur
          fetchPages(false); // Don't show loading spinner for realtime updates
        }
      )
      .subscribe();

    // Auto-refresh every 30 seconds as fallback
    const autoRefreshInterval = setInterval(() => {
      fetchPages(false);
    }, 30000);

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
      clearInterval(autoRefreshInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark">
        {/* Header */}
        <div className="bg-casino-card-bg/50 backdrop-blur-sm border-b border-casino-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-casino-text-primary flex items-center gap-3">
                  <Settings className="w-8 h-8 text-casino-neon-green" />
                  Page Maintenance Management
                </h1>
                <p className="text-casino-text-secondary mt-1">
                  Control maintenance mode for each page in your application
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-casino-card-bg/80 backdrop-blur-md border border-casino-border-subtle rounded-xl p-8 text-center">
            <RefreshCw className="w-12 h-12 text-casino-neon-green animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-casino-text-primary mb-2">Loading Maintenance Settings</h3>
            <p className="text-casino-text-secondary">Please wait while we fetch the page maintenance data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark">
        {/* Header */}
        <div className="bg-casino-card-bg/50 backdrop-blur-sm border-b border-casino-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-casino-text-primary flex items-center gap-3">
                  <Settings className="w-8 h-8 text-casino-neon-green" />
                  Page Maintenance Management
                </h1>
                <p className="text-casino-text-secondary mt-1">
                  Control maintenance mode for each page in your application
                </p>
              </div>
              <button
                onClick={() => fetchPages()}
                className="bg-casino-neon-green hover:bg-casino-neon-green-dark text-casino-dark px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-casino-card-bg/80 backdrop-blur-md border border-casino-border-subtle rounded-xl p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-casino-text-primary mb-2">Connection Failed</h3>
              <p className="text-casino-text-secondary mb-6">{error}</p>

              <div className="space-y-3">
                <button
                  onClick={() => fetchPages()}
                  className="w-full bg-casino-neon-green hover:bg-casino-neon-green-dark text-casino-dark px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>

                <div className="text-sm text-casino-text-muted">
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
    <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark">
      {/* Header */}
      <div className="bg-casino-card-bg/50 backdrop-blur-sm border-b border-casino-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-casino-text-primary flex items-center gap-3">
                <Settings className="w-8 h-8 text-casino-neon-green" />
                Page Maintenance Management
              </h1>
              <p className="text-casino-text-secondary mt-1">
                Control maintenance mode for each page in your application
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-casino-text-muted">
                Last refresh: {lastRefresh.toLocaleTimeString()}
              </div>
              <button
                onClick={() => fetchPages()}
                className="bg-casino-neon-green hover:bg-casino-neon-green-dark text-casino-dark px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mock Data Warning */}
        {isMockData && (
          <div className="mb-6">
            <div className="bg-casino-neon-orange/10 border border-casino-neon-orange/30 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-casino-neon-orange flex-shrink-0" />
              <div className="flex-1">
                <span className="text-casino-neon-orange font-semibold">Development Mode Active</span>
                <p className="text-casino-text-secondary text-sm mt-1">
                  Using mock data. Database migration required for production use.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-red-400 font-semibold">Error</span>
                <p className="text-casino-text-secondary text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-casino-card-bg/80 backdrop-blur-md border border-casino-border-subtle rounded-xl">
          <div className="p-6 border-b border-casino-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-casino-text-primary">Page Maintenance Status</h2>
                <p className="text-sm text-casino-text-secondary mt-1">
                  Manage maintenance mode for {pages.length} pages
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-casino-text-muted">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-casino-neon-green"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-casino-neon-orange"></div>
                  <span>Maintenance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {pages.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-casino-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-casino-text-primary mb-2">No Pages Found</h3>
                <p className="text-casino-text-secondary mb-4">No maintenance pages are configured yet.</p>
                <button
                  onClick={() => fetchPages()}
                  className="bg-casino-neon-green hover:bg-casino-neon-green-dark text-casino-dark px-4 py-2 rounded-lg flex items-center gap-2 mx-auto font-medium transition-colors"
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
                  className={`border rounded-lg p-5 transition-colors ${
                    page.is_maintenance
                      ? 'border-casino-neon-orange/30 bg-casino-neon-orange/5'
                      : 'border-casino-border-subtle bg-casino-card-bg/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                        page.is_maintenance ? 'bg-casino-neon-orange' : 'bg-casino-neon-green'
                      }`} />
                      <div>
                        <h3 className="font-semibold text-casino-text-primary">{page.page_name}</h3>
                        <p className="text-sm text-casino-text-muted font-mono">{page.page_path}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                        page.is_maintenance
                          ? 'bg-casino-neon-orange/20 text-casino-neon-orange border border-casino-neon-orange/30'
                          : 'bg-casino-neon-green/20 text-casino-neon-green border border-casino-neon-green/30'
                      }`}>
                        {page.is_maintenance ? (
                          <>
                            <Clock className="w-3 h-3" />
                            Maintenance
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </>
                        )}
                      </span>

                      <button
                        onClick={() => toggleMaintenance(page)}
                        disabled={actionLoading === `toggle-${page.id}`}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          page.is_maintenance
                            ? 'bg-casino-neon-orange'
                            : 'bg-casino-neon-green'
                        } ${actionLoading === `toggle-${page.id}` ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          page.is_maintenance ? 'translate-x-6' : 'translate-x-1'
                        }`}>
                          {actionLoading === `toggle-${page.id}` && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Maintenance Message */}
                  <div className="mt-4 pt-4 border-t border-casino-border-subtle">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-casino-text-secondary">
                        Maintenance Message
                      </label>
                      {editingPage !== page.id && (
                        <button
                          onClick={() => startEditing(page)}
                          className="text-casino-text-muted hover:text-casino-neon-green transition-colors p-1 rounded"
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
                          className="w-full p-3 bg-casino-dark border border-casino-border-subtle rounded-lg focus:ring-2 focus:ring-casino-neon-green focus:border-casino-neon-green text-casino-text-primary resize-none"
                          rows={3}
                          placeholder="Enter maintenance message for users..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateMessage(page)}
                            disabled={actionLoading === `save-${page.id}`}
                            className="bg-casino-neon-green hover:bg-casino-neon-green-dark disabled:opacity-50 text-casino-dark px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                          >
                            {actionLoading === `save-${page.id}` ? (
                              <div className="w-4 h-4 border-2 border-casino-dark border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-casino-surface hover:bg-casino-surface-elevated text-casino-text-secondary px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-casino-dark/50 rounded-lg p-3 border border-casino-border-subtle">
                        <p className="text-casino-text-secondary text-sm leading-relaxed">
                          {page.maintenance_message || 'No maintenance message set'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-casino-border-subtle flex items-center justify-between text-xs text-casino-text-muted">
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
            <div className="px-6 py-4 bg-casino-dark/30 border-t border-casino-border-subtle rounded-b-xl">
              <div className="flex items-center justify-between text-sm text-casino-text-secondary">
                <div className="flex items-center gap-4">
                  <span>Total Pages: {pages.length}</span>
                  <span className="text-casino-neon-green">Active: {pages.filter(p => !p.is_maintenance).length}</span>
                  <span className="text-casino-neon-orange">Maintenance: {pages.filter(p => p.is_maintenance).length}</span>
                </div>
                <div className="text-xs text-casino-text-muted">
                  Auto-refresh: 30s
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
