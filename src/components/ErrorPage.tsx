
import { Button } from './ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
  error?: Error;
  resetError?: () => void;
}

export const ErrorPage = ({ error, resetError }: ErrorPageProps) => {
  const errorMessage = error?.message || 'An unexpected error occurred';

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-full max-w-md space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Error
        </h1>
        
        <h2 className="text-2xl font-semibold text-foreground">
          Something went wrong
        </h2>
        
        <p className="text-muted-foreground">
          {errorMessage}
        </p>
        
        <div className="flex flex-col space-y-2 pt-6 sm:flex-row sm:justify-center sm:space-x-3 sm:space-y-0">
          <Button asChild>
            <a href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </a>
          </Button>
          
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {resetError ? 'Try Again' : 'Refresh Page'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Alias for legacy imports
export const SimpleErrorPage = ErrorPage;
