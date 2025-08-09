'use client';

import { useEffect, useState } from 'react';
import { isAdminSubdomain, redirectToAdmin } from '@/lib/subdomain';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const [isValidAccess, setIsValidAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      const isAdmin = isAdminSubdomain();
      
      if (!isAdmin) {
        // Redirect to admin subdomain if accessing admin routes from main domain
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin')) {
          redirectToAdmin(currentPath);
          return;
        }
      }
      
      setIsValidAccess(isAdmin);
      setIsLoading(false);
    };

    checkAccess();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-casino-gold mx-auto mb-4"></div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isValidAccess) {
    return (
      fallback || (
        <div className="min-h-screen bg-casino-dark flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-300 mb-6">Admin panel can only be accessed through the admin subdomain.</p>
            <button
              onClick={() => redirectToAdmin('/admin')}
              className="bg-casino-gold text-casino-dark px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Go to Admin Panel
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}