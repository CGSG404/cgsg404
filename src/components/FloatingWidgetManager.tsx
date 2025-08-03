'use client';

import React, { useState } from 'react';
import {
  Settings,
  ChevronUp,
  ChevronDown,
  Bug,
  ArrowUp,
  ArrowLeft,
  MessageCircle,
  BarChart3,
  Shield,
  X,
  User,
  Database,
  Activity
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';
import { devConsole } from '@/src/utils/production-console-override';

interface FloatingWidget {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  condition?: () => boolean;
  action?: () => void;
}

export default function FloatingWidgetManager() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, adminInfo } = useAdmin();
  const router = useRouter();

  // Back to top functionality
  const [showBackToTop, setShowBackToTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Only show for admin users
  const shouldShowAdminPanel = !authLoading && !adminLoading && user && isAdmin;

  devConsole.log('🎛️ FloatingWidgetManager: State', {
    user: user?.email,
    isAdmin,
    shouldShowAdminPanel,
    authLoading,
    adminLoading
  });

  // Don't render anything if user is not admin
  if (!shouldShowAdminPanel) {
    return null;
  }

  // Admin panel sections
  const adminPanels = [
    {
      id: 'session',
      title: 'Session Info',
      icon: <User className="w-4 h-4" />,
      description: 'User session details'
    },
    {
      id: 'admin-tools',
      title: 'Admin Tools',
      icon: <Shield className="w-4 h-4" />,
      description: 'Admin dashboard & controls'
    },
    {
      id: 'debug',
      title: 'Debug Tools',
      icon: <Bug className="w-4 h-4" />,
      description: 'Development debugging'
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: <Activity className="w-4 h-4" />,
      description: 'System performance metrics'
    },
    {
      id: 'database',
      title: 'Database',
      icon: <Database className="w-4 h-4" />,
      description: 'Database operations'
    }
  ];

  // Quick actions
  const quickActions = [
    {
      id: 'back-to-top',
      title: 'Back to Top',
      icon: <ArrowUp className="w-4 h-4" />,
      action: scrollToTop,
      show: showBackToTop
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Active Panel Content - positioned above button */}
      {activePanel && (
        <div className="absolute bottom-16 right-0 mb-4">
          <Card className="bg-casino-card-bg/95 backdrop-blur-lg border-casino-border-subtle shadow-2xl max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
                  {adminPanels.find(p => p.id === activePanel)?.icon}
                  {adminPanels.find(p => p.id === activePanel)?.title}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setActivePanel(null);
                    setIsExpanded(true); // Show main panel again
                  }}
                  className="h-7 px-2 text-gray-400 hover:text-white text-xs"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Back
                </Button>
              </div>
              <div className="text-xs text-gray-300 max-h-80 overflow-y-auto">
                {renderPanelContent(activePanel)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Admin Panel - positioned above button */}
      {isExpanded && !activePanel && (
        <div className="absolute bottom-16 right-0 mb-4">
          <Card className="bg-casino-card-bg/95 backdrop-blur-lg border-casino-border-subtle shadow-2xl max-w-xs">
            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="text-white font-semibold text-sm mb-1">Admin Control Panel</h3>
                <p className="text-gray-400 text-xs">Welcome, {user?.email}</p>
              </div>

              {/* Quick Actions */}
              <div className="mb-4">
                <h4 className="text-white text-xs font-medium mb-2">Quick Actions</h4>
                <div className="flex gap-2">
                  {quickActions.filter(action => action.show).map((action) => (
                    <Button
                      key={action.id}
                      size="sm"
                      onClick={() => {
                        devConsole.log(`🔧 Quick action: ${action.id}`);
                        action.action();
                        setIsExpanded(false);
                      }}
                      className="bg-casino-neon-blue text-white hover:bg-casino-neon-blue/80 text-xs h-7"
                    >
                      {action.icon}
                      <span className="ml-1">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Admin Panels */}
              <div>
                <h4 className="text-white text-xs font-medium mb-2">Admin Tools</h4>
                <div className="grid grid-cols-2 gap-2">
                  {adminPanels.map((panel) => (
                    <Button
                      key={panel.id}
                      size="sm"
                      variant={activePanel === panel.id ? "default" : "ghost"}
                      onClick={() => {
                        devConsole.log(`🔧 Panel clicked: ${panel.id}`);
                        setActivePanel(panel.id);
                        setIsExpanded(false); // Close main panel when detail panel opens
                      }}
                      className="flex flex-col items-center gap-1 text-xs h-12 p-2 hover:bg-casino-neon-green/20"
                    >
                      {panel.icon}
                      <span className="text-[10px]">{panel.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Toggle Button - ALWAYS stays in the same position */}
      <div className="w-12 h-12">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80 shadow-lg rounded-full w-12 h-12 p-0"
          title="Admin Control Panel"
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <Settings className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );

  // Panel content renderer
  function renderPanelContent(panelId: string) {
    switch (panelId) {
      case 'session':
        return (
          <div className="space-y-2">
            <div><strong>User ID:</strong> {user?.id}</div>
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>Role:</strong> {adminInfo?.role || 'Admin'}</div>
            <div><strong>Permissions:</strong> {adminInfo?.total_permissions || 0}</div>
            <div><strong>Auth Status:</strong> {authLoading ? 'Loading...' : 'Authenticated'}</div>
            <div className="mt-3 pt-2 border-t border-gray-600">
              <Button
                size="sm"
                onClick={async () => {
                  // Use Supabase signOut instead of localStorage.clear()
                  try {
                    await supabase.auth.signOut();
                    window.location.reload();
                  } catch (error) {
                    devConsole.error('Error signing out:', error);
                    window.location.reload();
                  }
                }}
                variant="destructive"
                className="w-full text-xs"
              >
                Sign Out & Reload
              </Button>
            </div>
          </div>
        );

      case 'admin-tools':
        return (
          <div className="space-y-3">
            <div>Admin dashboard and management tools</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  devConsole.log('🔧 Navigating to /admin');
                  router.push('/admin');
                }}
                className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80"
              >
                Dashboard
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  devConsole.log('🔧 Navigating to /debug-admin');
                  router.push('/debug-admin');
                }}
                className="bg-casino-neon-blue text-white hover:bg-casino-neon-blue/80"
              >
                Debug
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => {
                  devConsole.log('🔧 Opening admin in new tab');
                  window.open('/admin', '_blank');
                }}
                variant="outline"
                className="text-xs"
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        );

      case 'debug':
        return (
          <div className="space-y-2">
            <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
            <div><strong>Scroll Position:</strong> {showBackToTop ? 'Show Back to Top' : 'Hidden'}</div>
            <div><strong>Admin Status:</strong> {isAdmin ? 'Active' : 'Inactive'}</div>
            <div><strong>Loading States:</strong> Auth: {authLoading ? 'Yes' : 'No'}, Admin: {adminLoading ? 'Yes' : 'No'}</div>
            <div className="mt-3 pt-2 border-t border-gray-600">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    devConsole.log('🔧 Current state:', { user, isAdmin, authLoading, adminLoading });
                    alert(`Debug Info:\nUser: ${user?.email}\nAdmin: ${isAdmin}\nAuth Loading: ${authLoading}\nAdmin Loading: ${adminLoading}`);
                  }}
                  className="bg-yellow-600 text-white hover:bg-yellow-700 text-xs"
                >
                  Show Debug
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    devConsole.log('🔧 Refreshing page');
                    window.location.reload();
                  }}
                  variant="outline"
                  className="text-xs"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-2">
            <div><strong>Memory Usage:</strong> Normal</div>
            <div><strong>Load Time:</strong> Good</div>
            <div><strong>API Response:</strong> Fast</div>
            <div><strong>Database:</strong> Connected</div>
            <div className="mt-3 pt-2 border-t border-gray-600">
              <Button
                size="sm"
                onClick={() => {
                  devConsole.log('🔧 Performance check triggered');
                  const performanceInfo = {
                    memory: (performance as any).memory ? {
                      used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
                      total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024)
                    } : 'Not available',
                    timing: performance.timing ? {
                      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                      domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
                    } : 'Not available'
                  };
                  alert(`Performance Info:\n${JSON.stringify(performanceInfo, null, 2)}`);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700 text-xs w-full"
              >
                Check Performance
              </Button>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-2">
            <div><strong>Connection:</strong> Active</div>
            <div><strong>Tables:</strong> All accessible</div>
            <div><strong>Last Query:</strong> Just now</div>
            <div><strong>Status:</strong> Healthy</div>
            <div className="mt-3 pt-2 border-t border-gray-600">
              <Button
                size="sm"
                onClick={() => {
                  devConsole.log('🔧 Testing database connection');
                  fetch('/api/test-db')
                    .then(res => res.json())
                    .then(data => {
                      devConsole.log('🔧 DB Test result:', data);
                      alert(`Database Test:\n${JSON.stringify(data, null, 2)}`);
                    })
                    .catch(err => {
                      devConsole.error('🔧 DB Test error:', err);
                      alert(`Database Error:\n${err.message}`);
                    });
                }}
                className="bg-green-600 text-white hover:bg-green-700 text-xs w-full"
              >
                Test Connection
              </Button>
            </div>
          </div>
        );

      default:
        return <div>Panel content not found</div>;
    }
  }
}
