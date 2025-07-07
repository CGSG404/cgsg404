import type { AppProps } from 'next/app';
import '../../app/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import LiveChat from '@/components/LiveChat';
import PageLoader from '@/components/PageLoader';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Component {...pageProps} />
          <Toaster position="top-right" />
          <LiveChat />
          <PageLoader />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
