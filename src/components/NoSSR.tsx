'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Higher-order component to disable SSR for components that cause hydration issues
 */
function NoSSR<P extends object>(Component: ComponentType<P>) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] md:h-[550px] lg:h-[650px] bg-gradient-to-br from-casino-dark via-casino-darker to-casino-dark flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    ),
  });
}

export default NoSSR;
