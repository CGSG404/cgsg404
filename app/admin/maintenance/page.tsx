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
      const response = await fetch('/api/admin/page-maintenance');

      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }

      const data: ApiResponse = await response.json();
      setPages(data.pages || []);
      setIsMockData(data.mock || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Toggle maintenance mode
  const toggleMaintenance = async (page: PageMaintenance) => {
    try {
      setActionLoading(`toggle-${page.id}`);
      
      const response = await fetch('/api/admin/page-maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      
      const response = await fetch('/api/admin/page-maintenance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading maintenance settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Mock Data Warning */}
      {isMockData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <span className="text-yellow-800 font-medium">Development Mode</span>
              <p className="text-yellow-700 text-sm mt-1">
                Using mock data. Database migration required for production use.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Page Maintenance Status
            </h2>

            <div className="space-y-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    page.is_maintenance 
                      ? 'border-orange-200 bg-orange-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        page.is_maintenance ? 'bg-orange-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <h3 className="font-medium text-gray-900">{page.page_name}</h3>
                        <p className="text-sm text-gray-500">{page.page_path}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        page.is_maintenance
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {page.is_maintenance ? (
                          <>
                            <Clock className="w-3 h-3 inline mr-1" />
                            Maintenance
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Active
                          </>
                        )}
                      </span>

                      <button
                        onClick={() => toggleMaintenance(page)}
                        disabled={actionLoading === `toggle-${page.id}`}
                        className={`p-2 rounded-lg transition-colors ${
                          page.is_maintenance
                            ? 'text-orange-600 hover:bg-orange-100'
                            : 'text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {actionLoading === `toggle-${page.id}` ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : page.is_maintenance ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Maintenance Message */}
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance Message:
                    </label>
                    
                    {editingPage === page.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Enter maintenance message..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateMessage(page)}
                            disabled={actionLoading === `save-${page.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
                          >
                            {actionLoading === `save-${page.id}` ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <p className="text-gray-600 text-sm leading-relaxed flex-1">
                          {page.maintenance_message}
                        </p>
                        <button
                          onClick={() => startEditing(page)}
                          className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Last updated: {new Date(page.updated_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagementPage;
