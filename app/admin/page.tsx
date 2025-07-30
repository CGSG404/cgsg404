'use client';

import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
  Home,
  BarChart3,
  Building2,
  Newspaper,
  Users,
  Settings,
  TrendingUp,
  User,
  Key,
  Clock,
  Wifi,
  Rocket,
  TestTube,
  Cog,
  Database,
  Upload,
  FileText
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { isAdmin, isLoading, adminInfo, logActivity, user } = useAdmin();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isAdmin) {
      // Log admin dashboard access
      logActivity('admin_dashboard_accessed', 'dashboard', 'main', {
        timestamp: new Date().toISOString()
      }, 'info');
    }
  }, [isAdmin, logActivity]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // 🔧 DEBUG: Log admin status
  console.log('🔍 AdminDashboard: Status:', {
    isAdmin,
    isLoading,
    adminInfo,
    user: user?.email
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-casino-neon-green border-t-transparent"></div>
          <p className="text-casino-neon-green font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark flex items-center justify-center">
        <Card className="bg-casino-card-bg border-red-500/20 max-w-lg">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🚫</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Admin Access Required</h2>
            <p className="text-gray-300 mb-6">
              You need admin privileges to access this dashboard.
            </p>

            {user && (
              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm mb-2">
                  Logged in as: <strong>{user.email}</strong>
                </p>
                <p className="text-yellow-400 text-xs">
                  If you should have admin access, use the debug page to set it up.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/">
                  Go Home
                </Link>
              </Button>
              {user && (
                <Button asChild variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10">
                  <Link href="/debug-admin">
                    Debug Admin Access
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminFeatures = [
    {
      title: 'Monitoring Dashboard',
      description: 'Real-time admin activity monitoring and security alerts',
      href: '/admin/monitoring',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      hoverGradient: 'hover:from-blue-500/30 hover:to-cyan-500/30',
      icon: BarChart3,
      status: 'Active'
    },
    {
      title: 'Casino Management',
      description: 'Manage casinos, bonuses, and gaming content - Full CRUD operations',
      href: '/admin/casinos',
      gradient: 'from-casino-neon-green/20 to-emerald-500/20',
      borderColor: 'border-casino-neon-green/30',
      hoverGradient: 'hover:from-casino-neon-green/30 hover:to-emerald-500/30',
      icon: Building2,
      status: 'Ready'
    },
    {
      title: 'News Management',
      description: 'Create, edit, and publish news articles',
      href: '/admin/news',
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      hoverGradient: 'hover:from-purple-500/30 hover:to-pink-500/30',
      icon: Newspaper,
      status: 'Coming Soon'
    },
    {
      title: 'Database Operations',
      description: 'Monitor database performance, test operations, and view analytics',
      href: '/admin/database',
      gradient: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      hoverGradient: 'hover:from-orange-500/30 hover:to-red-500/30',
      icon: Database,
      status: 'Enhanced'
    },
    {
      title: 'File Upload Security',
      description: 'Secure file upload with encryption, virus scanning, and validation',
      href: '/admin/file-upload',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
      hoverGradient: 'hover:from-cyan-500/30 hover:to-blue-500/30',
      icon: Upload,
      status: 'Secure'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      href: '/admin/users',
      gradient: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      hoverGradient: 'hover:from-orange-500/30 hover:to-red-500/30',
      icon: Users,
      status: 'Coming Soon'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      href: '/admin/settings',
      gradient: 'from-gray-500/20 to-slate-500/20',
      borderColor: 'border-gray-500/30',
      hoverGradient: 'hover:from-gray-500/30 hover:to-slate-500/30',
      icon: Settings,
      status: 'Coming Soon'
    },
    {
      title: 'List Reports Management',
      description: 'Manage casino reports and community warnings',
      href: '/admin/list-reports',
      gradient: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30',
      hoverGradient: 'hover:from-red-500/30 hover:to-pink-500/30',
      icon: FileText,
      status: 'Active'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and reports',
      href: '/admin/analytics',
      gradient: 'from-indigo-500/20 to-violet-500/20',
      borderColor: 'border-indigo-500/30',
      hoverGradient: 'hover:from-indigo-500/30 hover:to-violet-500/30',
      icon: TrendingUp,
      status: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark">
      {/* Header */}
      <div className="bg-casino-card-bg/50 backdrop-blur-sm border-b border-casino-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Home className="h-6 w-6 sm:h-8 sm:w-8 text-casino-neon-green" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-casino-neon-green to-casino-neon-purple bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <div className="text-gray-300 mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-base">
                  Welcome back, <span className="text-casino-neon-green font-medium">{adminInfo?.email}</span>
                </span>
                <span className="text-gray-500 hidden sm:inline">•</span>
                <span className="text-gray-400 text-xs sm:text-sm">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Badge variant="secondary" className="bg-casino-neon-green/20 text-casino-neon-green border-casino-neon-green/30 text-xs sm:text-sm">
                {adminInfo?.role?.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline" className="border-casino-neon-purple/30 text-casino-neon-purple text-xs sm:text-sm">
                {adminInfo?.total_permissions} Permissions
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-casino-neon-green/10 via-casino-neon-purple/10 to-casino-neon-green/10 border-casino-neon-green/20 mb-6 sm:mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 animate-pulse"></div>
          <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">Welcome to CGSG404 Admin Panel</h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                  Manage your casino platform with powerful admin tools and real-time monitoring.
                </p>
              </div>
              <div className="hidden sm:block opacity-20 flex-shrink-0">
                <Building2 className="h-12 w-12 lg:h-16 lg:w-16 text-casino-neon-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-green/30 transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="mr-2 sm:mr-3 lg:mr-4 p-1.5 sm:p-2 bg-casino-neon-green/10 rounded-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-casino-neon-green" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-400 truncate">Admin Role</p>
                  <p className="text-sm sm:text-lg lg:text-xl font-bold text-casino-neon-green truncate">
                    {adminInfo?.role?.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-purple/30 transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="mr-2 sm:mr-3 lg:mr-4 p-1.5 sm:p-2 bg-casino-neon-purple/10 rounded-lg">
                  <Key className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-casino-neon-purple" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-400 truncate">Permissions</p>
                  <p className="text-sm sm:text-lg lg:text-xl font-bold text-casino-neon-purple">
                    {adminInfo?.total_permissions || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-blue-400/30 transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="mr-2 sm:mr-3 lg:mr-4 p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-400 truncate">Last Login</p>
                  <p className="text-sm sm:text-lg lg:text-xl font-bold text-blue-400 truncate">
                    {currentTime.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-green-400/30 transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="mr-2 sm:mr-3 lg:mr-4 p-1.5 sm:p-2 bg-green-500/10 rounded-lg">
                  <Wifi className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-400 truncate">Status</p>
                  <p className="text-sm sm:text-lg lg:text-xl font-bold text-green-400">Online</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {adminFeatures.map((feature) => (
            <Card
              key={feature.href}
              className={`bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} hover:scale-105 transition-all duration-300 group cursor-pointer ${feature.hoverGradient}`}
            >
              <Link href={feature.href} className="block">
                <CardHeader className="pb-2 sm:pb-3 lg:pb-4 p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-white/10 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <Badge
                      variant={feature.status === 'Active' ? 'default' : feature.status === 'Ready' ? 'secondary' : 'outline'}
                      className={`text-xs sm:text-sm ${
                        feature.status === 'Active'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : feature.status === 'Ready'
                          ? 'bg-casino-neon-green/20 text-casino-neon-green border-casino-neon-green/30'
                          : feature.status === 'Enhanced'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          : feature.status === 'Secure'
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-casino-neon-green transition-colors line-clamp-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {feature.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 sm:mt-8 bg-casino-card-bg border-casino-border-subtle">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-casino-neon-green flex items-center gap-2 text-lg sm:text-xl">
              <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-10 sm:h-12 text-sm sm:text-base">
                <Link href="/admin/monitoring" className="flex items-center gap-2">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  View Monitoring
                </Link>
              </Button>
              <Button
                onClick={() => logActivity('quick_action_test', 'dashboard', 'test', { action: 'test_button' }, 'info')}
                className="bg-gradient-to-r from-casino-neon-green to-emerald-600 hover:from-casino-neon-green/80 hover:to-emerald-700 text-casino-dark h-10 sm:h-12 text-sm sm:text-base"
              >
                <TestTube className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Test Logging
              </Button>
              <Button asChild className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white h-10 sm:h-12 text-sm sm:text-base sm:col-span-2 lg:col-span-1">
                <Link href="/admin/settings" className="flex items-center gap-2">
                  <Cog className="h-3 w-3 sm:h-4 sm:w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
