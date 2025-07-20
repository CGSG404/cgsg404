'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';

export const AdminDebugWidget: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();

  // Debug logging
  console.log('🔧 AdminDebugWidget: State check:', {
    user: user?.id,
    authLoading,
    adminLoading,
    isAdmin
  });

  // Don't show anything while loading
  if (authLoading || adminLoading) {
    console.log('🔧 AdminDebugWidget: Hidden - Loading state');
    return null;
  }

  // Don't show if no user
  if (!user) {
    console.log('🔧 AdminDebugWidget: Hidden - No user');
    return null;
  }

  // Only show for admins
  if (!isAdmin) {
    console.log('🔧 AdminDebugWidget: Hidden - Not admin');
    return null;
  }

  console.log('🔧 AdminDebugWidget: Showing widget for admin user');

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-casino-card-bg border-casino-border-subtle shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-casino-neon-green text-sm font-semibold">
              🔧 Admin
            </span>
            <Button
              onClick={() => {
                console.log('🔧 AdminDebugWidget: Navigating to /debug-admin');
                router.push('/debug-admin');
              }}
              size="sm"
              className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80"
            >
              Debug
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
