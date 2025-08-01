'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, adminInfo, logActivity } = useAdmin();
  const router = useRouter();

  // Combined loading state
  const isLoading = authLoading || adminLoading;

  useEffect(() => {
    // If not authenticated, redirect to signin
    if (!authLoading && !user) {
      console.log('🔄 Admin page: No user, redirecting to signin');
      router.push('/signin?redirectTo=/admin');
      return;
    }

    // If authenticated but not admin, show access denied
    if (user && !adminLoading && !isAdmin) {
      console.log('🚫 Admin page: User not admin', {
        userId: user.id,
        email: user.email,
        isAdmin
      });
    }

    // Log admin dashboard access
    if (user && isAdmin) {
      logActivity('admin_dashboard_accessed', 'dashboard', 'main', {
        timestamp: new Date().toISOString(),
        userId: user.id,
        email: user.email
      }, 'info');
    }
  }, [user, authLoading, isAdmin, adminLoading, router, logActivity]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Checking authentication...' : 'Loading admin data...'}
          </p>
        </div>
      </div>
    );
  }

  // If no user, don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  // If user exists but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">
              You need admin access to view this dashboard.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Logged in as: {user.email}
              </p>
              <div className="flex space-x-2">
                <Link
                  href="/"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-block"
                >
                  Go Home
                </Link>
                <Link
                  href="/debug-admin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Debug Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const adminFeatures = [
    {
      title: '📊 Monitoring Dashboard',
      description: 'Real-time admin activity monitoring and security alerts',
      href: '/admin/monitoring',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      icon: '📊'
    },
    {
      title: '🏢 Casino Management',
      description: 'Manage casinos, bonuses, and gaming content - Full CRUD operations',
      href: '/admin/casinos',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      icon: '🏢'
    },
    {
      title: '📰 News Management',
      description: 'Create, edit, and publish news articles',
      href: '/admin/news',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      icon: '📰'
    },
    {
      title: '👥 User Management',
      description: 'Manage user accounts and permissions',
      href: '/admin/users',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      icon: '👥'
    },
    {
      title: '🔧 System Settings',
      description: 'Configure system settings and preferences',
      href: '/admin/settings',
      color: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      icon: '🔧'
    },
    {
      title: '📈 Analytics',
      description: 'View detailed analytics and reports',
      href: '/admin/analytics',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      icon: '📈'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏠 Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {adminInfo?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {adminInfo?.role?.replace('_', ' ').toUpperCase()}
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {adminInfo?.total_permissions} Permissions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome to CGSG404 Admin Panel</h2>
          <p className="text-blue-100">
            Manage your casino platform with powerful admin tools and real-time monitoring.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👤</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Role</p>
                <p className="text-lg font-semibold text-gray-900">
                  {adminInfo?.role?.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🔑</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Permissions</p>
                <p className="text-lg font-semibold text-gray-900">
                  {adminInfo?.total_permissions || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🕒</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Login</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🟢</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-semibold text-green-600">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={`border rounded-lg p-6 transition-colors ${feature.color}`}
            >
              <div className="flex items-start">
                <div className="text-3xl mr-4">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/monitoring"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              📊 View Monitoring
            </Link>
            <button
              onClick={() => logActivity('quick_action_test', 'dashboard', 'test', { action: 'test_button' }, 'info')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              🧪 Test Logging
            </button>
            <Link
              href="/admin/settings"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-center"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
