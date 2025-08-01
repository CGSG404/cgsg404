'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { supabase } from '@/src/lib/supabaseClient';

export default function SessionDebugWidget() {
  // This component is deprecated - session debugging is now handled by FloatingWidgetManager
  return null;
}
