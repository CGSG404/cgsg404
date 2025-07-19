'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { databaseApi } from '@/lib/database-api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface CasinoDetails {
  id: number;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  safety_index: string;
  bonus: string;
  description: string;
  play_url: string;
  is_new: boolean;
  is_hot: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  casino_features?: Array<{ feature: string }>;
  casino_badges?: Array<{ badge: string }>;
  casino_links?: Array<{ link_type: string; url: string }>;
}

export default function CasinoDetailPage() {
  const { isAdmin, hasPermission, logActivity } = useAdmin();
  const params = useParams();
  const router = useRouter();
  const [casino, setCasino] = useState<CasinoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const casinoId = params.id as string;

  useEffect(() => {
    if (isAdmin && hasPermission('17') && casinoId) {
      fetchCasino();
    }
  }, [isAdmin, hasPermission, casinoId]);

  const fetchCasino = async () => {
    try {
      setLoading(true);
      const data = await databaseApi.getCasino(parseInt(casinoId));
      if (data) {
        setCasino(data);
        await logActivity('casino_viewed', 'casino', casinoId, { name: data.name }, 'info');
      } else {
        setError('Casino not found');
      }
    } catch (error) {
      console.error('Failed to fetch casino:', error);
      setError('Failed to load casino details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!hasPermission('19') || !casino) {
      alert('You do not have permission to delete casinos');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${casino.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await databaseApi.deleteCasino(casino.id);
      await logActivity('casino_deleted', 'casino', casino.id.toString(), { name: casino.name }, 'critical');
      router.push('/admin/casinos');
    } catch (error) {
      console.error('Failed to delete casino:', error);
      alert('Failed to delete casino. Please try again.');
    }
  };

  const handleStatusToggle = async (field: 'is_featured' | 'is_hot' | 'is_new', currentValue: boolean) => {
    if (!hasPermission('18') || !casino) {
      alert('You do not have permission to update casinos');
      return;
    }

    try {
      await databaseApi.updateCasinoStatus(casino.id, { [field]: !currentValue });
      await logActivity('casino_status_updated', 'casino', casino.id.toString(), { field, value: !currentValue }, 'info');
      setCasino(prev => prev ? { ...prev, [field]: !currentValue } : null);
    } catch (error) {
      console.error('Failed to update casino status:', error);
      alert('Failed to update casino status. Please try again.');
    }
  };

  if (!isAdmin || !hasPermission('17')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600">You need casino read permission to view casino details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !casino) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/admin/casinos"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-block"
            >
              Back to Casinos
            </Link>
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
            <div className="flex items-center">
              <Image
                src={casino.logo}
                alt={casino.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{casino.name}</h1>
                <p className="text-gray-600 mt-1">Casino Details & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {hasPermission('18') && (
                <Link
                  href={`/admin/casinos/${casino.id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ✏️ Edit Casino
                </Link>
              )}
              <Link
                href="/admin/casinos"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{casino.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{casino.slug}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <p className="mt-1 text-sm text-gray-900">⭐ {casino.rating}/5</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Safety Index</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    casino.safety_index === 'Very High' ? 'bg-green-100 text-green-800' :
                    casino.safety_index === 'High' ? 'bg-blue-100 text-blue-800' :
                    casino.safety_index === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {casino.safety_index}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Play URL</label>
                  <a
                    href={casino.play_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800 break-all"
                  >
                    {casino.play_url}
                  </a>
                </div>
              </div>
            </div>

            {/* Bonus & Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🎁 Bonus & Description</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bonus</label>
                  <p className="mt-1 text-sm text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">
                    {casino.bonus}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {casino.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Features & Badges */}
            {(casino.casino_features?.length || casino.casino_badges?.length) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🏷️ Features & Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {casino.casino_features && casino.casino_features.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                      <div className="flex flex-wrap gap-2">
                        {casino.casino_features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {feature.feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {casino.casino_badges && casino.casino_badges.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Badges</label>
                      <div className="flex flex-wrap gap-2">
                        {casino.casino_badges.map((badge, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                          >
                            {badge.badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            {casino.casino_links && casino.casino_links.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🔗 Links</h2>
                <div className="space-y-2">
                  {casino.casino_links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {link.link_type}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 break-all"
                      >
                        {link.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Controls */}
            {hasPermission('18') && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🎛️ Status Controls</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handleStatusToggle('is_featured', casino.is_featured)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                      casino.is_featured
                        ? 'bg-purple-50 border-purple-200 text-purple-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <span>⭐ Featured</span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      casino.is_featured ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {casino.is_featured ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleStatusToggle('is_hot', casino.is_hot)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                      casino.is_hot
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <span>🔥 Hot</span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      casino.is_hot ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {casino.is_hot ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleStatusToggle('is_new', casino.is_new)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                      casino.is_new
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <span>🆕 New</span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      casino.is_new ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {casino.is_new ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Metadata</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(casino.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(casino.updated_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Casino ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">#{casino.id}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Actions</h2>
              <div className="space-y-3">
                <a
                  href={casino.play_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center block"
                >
                  🎮 Visit Casino
                </a>
                
                {hasPermission('18') && (
                  <Link
                    href={`/admin/casinos/${casino.id}/edit`}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                  >
                    ✏️ Edit Casino
                  </Link>
                )}

                {hasPermission('19') && (
                  <button
                    onClick={handleDelete}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    🗑️ Delete Casino
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
