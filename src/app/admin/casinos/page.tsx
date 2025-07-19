'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { databaseApi } from '@/lib/database-api';
import Link from 'next/link';
import Image from 'next/image';

interface Casino {
  id: number;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  safety_index: string;
  bonus: string;
  is_featured: boolean;
  is_hot: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

interface CasinosData {
  casinos: Casino[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminCasinosPage() {
  const { isAdmin, hasPermission, logActivity } = useAdmin();
  const [casinosData, setCasinosData] = useState<CasinosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCasinos, setSelectedCasinos] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    safety_index: [] as string[],
    is_featured: undefined as boolean | undefined,
    is_hot: undefined as boolean | undefined,
    is_new: undefined as boolean | undefined,
  });

  const fetchCasinos = async () => {
    try {
      setLoading(true);
      const data = await databaseApi.getAdminCasinos({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        sortBy,
        sortOrder,
        filters
      });
      setCasinosData(data);
    } catch (error) {
      console.error('Failed to fetch casinos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && hasPermission('17')) { // Casino read permission
      fetchCasinos();
    }
  }, [isAdmin, hasPermission, currentPage, searchTerm, sortBy, sortOrder, filters]);

  const handleDelete = async (casinoId: number, casinoName: string) => {
    if (!hasPermission('19')) { // Casino delete permission
      alert('You do not have permission to delete casinos');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${casinoName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await databaseApi.deleteCasino(casinoId);
      await logActivity('casino_deleted', 'casino', casinoId.toString(), { name: casinoName }, 'critical');
      await fetchCasinos(); // Refresh list
    } catch (error) {
      console.error('Failed to delete casino:', error);
      alert('Failed to delete casino. Please try again.');
    }
  };

  const handleBulkDelete = async () => {
    if (!hasPermission('19')) {
      alert('You do not have permission to delete casinos');
      return;
    }

    if (selectedCasinos.length === 0) {
      alert('Please select casinos to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedCasinos.length} casinos? This action cannot be undone.`)) {
      return;
    }

    try {
      await databaseApi.bulkDeleteCasinos(selectedCasinos);
      await logActivity('casinos_bulk_deleted', 'casino', 'bulk', { count: selectedCasinos.length, ids: selectedCasinos }, 'critical');
      setSelectedCasinos([]);
      await fetchCasinos();
    } catch (error) {
      console.error('Failed to delete casinos:', error);
      alert('Failed to delete casinos. Please try again.');
    }
  };

  const handleStatusToggle = async (casinoId: number, field: 'is_featured' | 'is_hot' | 'is_new', currentValue: boolean) => {
    if (!hasPermission('18')) { // Casino update permission
      alert('You do not have permission to update casinos');
      return;
    }

    try {
      await databaseApi.updateCasinoStatus(casinoId, { [field]: !currentValue });
      await logActivity('casino_status_updated', 'casino', casinoId.toString(), { field, value: !currentValue }, 'info');
      await fetchCasinos();
    } catch (error) {
      console.error('Failed to update casino status:', error);
      alert('Failed to update casino status. Please try again.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600">You need admin access to manage casinos.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasPermission('17')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Permission Required</h2>
            <p className="text-yellow-600">You need casino read permission to view this page.</p>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">🏢 Casino Management</h1>
              <p className="text-gray-600 mt-1">
                Manage casinos, bonuses, and gaming content
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {hasPermission('16') && (
                <Link
                  href="/admin/casinos/add"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ➕ Add Casino
                </Link>
              )}
              <Link
                href="/admin"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🏠 Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search casinos..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created_at">Created Date</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="updated_at">Updated Date</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            <div className="flex items-end">
              {selectedCasinos.length > 0 && hasPermission('19') && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ Delete Selected ({selectedCasinos.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Casino Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading casinos...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedCasinos.length === casinosData?.casinos.length && casinosData?.casinos.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCasinos(casinosData?.casinos.map(c => c.id) || []);
                            } else {
                              setSelectedCasinos([]);
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Casino
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Safety
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {casinosData?.casinos.map((casino) => (
                      <tr key={casino.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCasinos.includes(casino.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCasinos([...selectedCasinos, casino.id]);
                              } else {
                                setSelectedCasinos(selectedCasinos.filter(id => id !== casino.id));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image
                                src={casino.logo}
                                alt={casino.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{casino.name}</div>
                              <div className="text-sm text-gray-500">{casino.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">⭐ {casino.rating}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            casino.safety_index === 'Very High' ? 'bg-green-100 text-green-800' :
                            casino.safety_index === 'High' ? 'bg-blue-100 text-blue-800' :
                            casino.safety_index === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {casino.safety_index}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {hasPermission('18') && (
                              <>
                                <button
                                  onClick={() => handleStatusToggle(casino.id, 'is_featured', casino.is_featured)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    casino.is_featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  ⭐ Featured
                                </button>
                                <button
                                  onClick={() => handleStatusToggle(casino.id, 'is_hot', casino.is_hot)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    casino.is_hot ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  🔥 Hot
                                </button>
                                <button
                                  onClick={() => handleStatusToggle(casino.id, 'is_new', casino.is_new)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    casino.is_new ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  🆕 New
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(casino.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/casinos/${casino.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              👁️ View
                            </Link>
                            {hasPermission('18') && (
                              <Link
                                href={`/admin/casinos/${casino.id}/edit`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                ✏️ Edit
                              </Link>
                            )}
                            {hasPermission('19') && (
                              <button
                                onClick={() => handleDelete(casino.id, casino.name)}
                                className="text-red-600 hover:text-red-900"
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {casinosData && casinosData.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(casinosData.totalPages, currentPage + 1))}
                      disabled={currentPage === casinosData.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((currentPage - 1) * 20) + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * 20, casinosData.total)}
                        </span> of{' '}
                        <span className="font-medium">{casinosData.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.min(5, casinosData.totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(casinosData.totalPages, currentPage + 1))}
                          disabled={currentPage === casinosData.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
