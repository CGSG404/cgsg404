'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isAdminSubdomain } from '@/lib/subdomain';

/**
 * Component to block admin routes from main domain
 */
export default function AdminRedirect() {
  const pathname = usePathname();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Check if current path is admin route but not on admin subdomain
    if (pathname.startsWith('/admin') && !isAdminSubdomain()) {
      // Show 404 error instead of redirecting
      setShowError(true);
    }
  }, [pathname]);

  // Show 404 error page if accessing admin from main domain
  if (showError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // This component doesn't render anything for valid routes
  return null;
}