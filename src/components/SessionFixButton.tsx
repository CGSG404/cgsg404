'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { sessionFix } from '@/src/utils/sessionFix';
import { toast } from 'sonner';

interface SessionFixButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function SessionFixButton({ 
  className = '', 
  variant = 'outline',
  size = 'sm',
  showIcon = true 
}: SessionFixButtonProps) {
  const [isFixing, setIsFixing] = useState(false);

  const handleSessionFix = async () => {
    setIsFixing(true);
    
    try {
      toast.info('Checking session health...');
      
      // Debug current session
      await sessionFix.debugSession();
      
      // Check if session is healthy
      const isHealthy = await sessionFix.checkSessionHealth();
      
      if (isHealthy) {
        toast.success('Session is healthy! Refreshing page...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.warning('Session issues detected. Refreshing authentication...');
        await sessionFix.forceSessionRefresh();
      }
    } catch (error) {
      console.error('Session fix error:', error);
      toast.error('Failed to fix session. Please try signing out and in again.');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSessionFix}
      disabled={isFixing}
      className={`${className} ${isFixing ? 'opacity-50' : ''}`}
    >
      {showIcon && (
        isFixing ? (
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <AlertTriangle className="w-4 h-4 mr-2" />
        )
      )}
      {isFixing ? 'Fixing...' : 'Fix Session'}
    </Button>
  );
}

// Hook for programmatic session fixing
export const useSessionFix = () => {
  const [isFixing, setIsFixing] = useState(false);

  const fixSession = async () => {
    setIsFixing(true);
    try {
      const result = await sessionFix.autoFix();
      return result;
    } catch (error) {
      console.error('Session fix error:', error);
      return false;
    } finally {
      setIsFixing(false);
    }
  };

  const checkSession = async () => {
    return await sessionFix.checkSessionHealth();
  };

  const debugSession = async () => {
    return await sessionFix.debugSession();
  };

  return {
    fixSession,
    checkSession,
    debugSession,
    isFixing
  };
};
