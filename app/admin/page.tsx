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
  Cog
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { isAdmin, isLoading, adminInfo, logActivity } = useAdmin();
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
        <Card className="bg-casino-card-bg border-red-500/20 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🚫</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
            <p className="text-gray-300 mb-6">
              You need admin access to view this dashboard.
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/">
                Go Home
              </Link>
            </Button>
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
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Home className="h-8 w-8 text-casino-neon-green" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-casino-neon-green to-casino-neon-purple bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-gray-300 mt-2 flex items-center gap-2">
                Welcome back, <span className="text-casino-neon-green font-medium">{adminInfo?.email}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">{currentTime.toLocaleTimeString()}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-casino-neon-green/20 text-casino-neon-green border-casino-neon-green/30">
                {adminInfo?.role?.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline" className="border-casino-neon-purple/30 text-casino-neon-purple">
                {adminInfo?.total_permissions} Permissions
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-casino-neon-green/10 via-casino-neon-purple/10 to-casino-neon-green/10 border-casino-neon-green/20 mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 animate-pulse"></div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Welcome to CGSG404 Admin Panel</h2>
                <p className="text-gray-300 text-lg">
                  Manage your casino platform with powerful admin tools and real-time monitoring.
                </p>
              </div>
              <div className="hidden md:block opacity-20">
                <Building2 className="h-16 w-16 text-casino-neon-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-green/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-casino-neon-green/10 rounded-lg">
                  <User className="h-6 w-6 text-casino-neon-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Admin Role</p>
                  <p className="text-xl font-bold text-casino-neon-green">
                    {adminInfo?.role?.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-purple/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-casino-neon-purple/10 rounded-lg">
                  <Key className="h-6 w-6 text-casino-neon-purple" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Permissions</p>
                  <p className="text-xl font-bold text-casino-neon-purple">
                    {adminInfo?.total_permissions || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-blue-400/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Last Login</p>
                  <p className="text-xl font-bold text-blue-400">
                    {currentTime.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-green-400/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-green-500/10 rounded-lg">
                  <Wifi className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Status</p>
                  <p className="text-xl font-bold text-green-400">Online</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => (
            <Card
              key={feature.href}
              className={`bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} hover:scale-105 transition-all duration-300 group cursor-pointer ${feature.hoverGradient}`}
            >
              <Link href={feature.href} className="block">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <Badge
                      variant={feature.status === 'Active' ? 'default' : feature.status === 'Ready' ? 'secondary' : 'outline'}
                      className={
                        feature.status === 'Active'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : feature.status === 'Ready'
                          ? 'bg-casino-neon-green/20 text-casino-neon-green border-casino-neon-green/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }
                    >
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-casino-neon-green transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <CardTitle className="text-casino-neon-green flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12">
                <Link href="/admin/monitoring" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Monitoring
                </Link>
              </Button>
              <Button
                onClick={() => logActivity('quick_action_test', 'dashboard', 'test', { action: 'test_button' }, 'info')}
                className="bg-gradient-to-r from-casino-neon-green to-emerald-600 hover:from-casino-neon-green/80 hover:to-emerald-700 text-casino-dark h-12"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Logging
              </Button>
              <Button asChild className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white h-12">
                <Link href="/admin/settings" className="flex items-center gap-2">
                  <Cog className="h-4 w-4" />
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
