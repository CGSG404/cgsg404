
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SimpleErrorPage } from '@/components/ErrorPage';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LiveChat from '@/components/LiveChat';

// Types
type ProtectedRouteProps = {
  children: React.ReactNode;
};

// Lazy load pages
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const BestBonuses = lazy(() => import('@/pages/BestBonuses'));
const Bonuses = lazy(() => import('@/pages/Bonuses'));
const Casinos = lazy(() => import('@/pages/Casinos'));
const Forum = lazy(() => import('@/pages/Forum'));
const Games = lazy(() => import('@/pages/Games'));
const Guide = lazy(() => import('@/pages/Guide'));
const ListReport = lazy(() => import('@/pages/ListReport'));
const News = lazy(() => import('@/pages/News'));
const Profile = lazy(() => import('@/pages/Profile'));
const Reviews = lazy(() => import('@/pages/Reviews'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));

// Initialize React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component
const LoadingSpinner = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <LoadingSpinner className="h-12 w-12" />
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode | (({ user }: { user: any }) => React.ReactNode) }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  if (typeof children === 'function') {
    return <>{children({ user })}</>;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Check for maintenance mode
  const isMaintenance = import.meta.env.VITE_ENABLE_MAINTENANCE === 'true';

  if (isMaintenance) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <h1 className="mb-4 text-2xl font-bold">Under Maintenance</h1>
          <p>We're currently performing scheduled maintenance. Please check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div data-testid="app">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/best-bonuses" element={<BestBonuses />} />
                  <Route path="/bonuses" element={<Bonuses />} />
                  <Route path="/casinos" element={<Casinos />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/list-report" element={<ListReport />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/error" element={<SimpleErrorPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
              <Toaster position="top-right" />
              <LiveChat />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </div>
    </ErrorBoundary>
  );
};

export default App;
