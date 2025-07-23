'use client';

import { useLoading, useAsyncLoading } from '@/src/contexts/LoadingContext';
import { Button } from '@/src/components/ui/button';

/**
 * Test component for loading system
 * This can be removed after testing
 */
export default function LoadingTest() {
  const { showLoading, hideLoading, isLoading, loadingText } = useLoading();
  const { withLoading } = useAsyncLoading();

  const testBasicLoading = () => {
    showLoading('Testing basic loading...');
    setTimeout(() => {
      hideLoading();
    }, 2000);
  };

  const testAsyncLoading = async () => {
    await withLoading(async () => {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 3000));
    }, 'Testing async operation...');
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 p-4 rounded-lg border border-slate-600 z-50">
      <h3 className="text-white font-semibold mb-2">Loading Test</h3>
      <div className="space-y-2">
        <Button 
          onClick={testBasicLoading}
          size="sm"
          variant="outline"
          className="w-full"
        >
          Test Basic Loading
        </Button>
        <Button 
          onClick={testAsyncLoading}
          size="sm"
          variant="outline"
          className="w-full"
        >
          Test Async Loading
        </Button>
        <div className="text-xs text-gray-400">
          Status: {isLoading ? `Loading: ${loadingText}` : 'Ready'}
        </div>
      </div>
    </div>
  );
}
