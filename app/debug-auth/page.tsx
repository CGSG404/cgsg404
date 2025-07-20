'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export default function DebugAuthPage() {
  // const { user, loading, signInWithGoogle, signOut } = useAuth(); // TEMPORARILY DISABLED
  return (
    <div className="min-h-screen bg-casino-dark p-8">
      <Card className="max-w-4xl mx-auto bg-casino-card-bg border-casino-border-subtle">
        <CardHeader>
          <CardTitle className="text-2xl gradient-text">Debug Auth - TEMPORARILY DISABLED</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Auth debugging is temporarily disabled while we isolate the infinite loop issue.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}