'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';

export const AdminDebugWidget: React.FC = () => {
  // This component is deprecated - admin debugging is now handled by FloatingWidgetManager
  return null;
};
