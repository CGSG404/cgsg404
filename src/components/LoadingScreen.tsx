'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
  children: ReactNode;
  variant?: 'default' | 'casino' | 'dice' | 'neon' | 'minimal';
  text?: string;
  showProgress?: boolean;
  progress?: number;
  overlay?: boolean;
  className?: string;
}

/**
 * LoadingScreen - Wrapper component that shows loading state
 * Can be used as overlay or full screen replacement
 */
export function LoadingScreen({
  isLoading,
  children,
  variant = 'casino',
  text = 'Loading...',
  showProgress = false,
  progress = 0,
  overlay = true,
  className,
}: LoadingScreenProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  const loadingContent = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-6 p-8',
      overlay ? 'fixed inset-0 z-[9999] bg-casino-dark/90 backdrop-blur-sm' : 'min-h-[400px]',
      className
    )}>
      {/* Background Effects for Casino Theme */}
      {variant === 'casino' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,153,0.05),transparent_70%)]" />
          {typeof window !== 'undefined' && Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-casino-neon-green/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 10,
                opacity: 0
              }}
              animate={{
                y: -10,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Brand/Logo Area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">CGSG</h2>
          <p className="text-casino-neon-green text-sm">Casino Guide Singapore</p>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <LoadingSpinner
            variant={variant}
            size="lg"
            text={text}
            showText={true}
          />
        </motion.div>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-64 mx-auto mt-6"
          >
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-casino-border-subtle rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-casino-neon-green to-casino-neon-purple rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6"
        >
          <p className="text-xs text-gray-500">
            Preparing your gaming experience...
          </p>
        </motion.div>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loadingContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Simple Loading Overlay - For quick use cases
 */
export function LoadingOverlay({
  isLoading,
  text = 'Loading...',
  variant = 'minimal',
}: {
  isLoading: boolean;
  text?: string;
  variant?: 'minimal' | 'casino';
}) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="bg-casino-card-bg border border-casino-border-subtle rounded-lg p-6 shadow-2xl">
        <LoadingSpinner
          variant={variant}
          size="md"
          text={text}
          showText={true}
        />
      </div>
    </motion.div>
  );
}

/**
 * Inline Loading - For content areas
 */
export function InlineLoading({
  text = 'Loading...',
  variant = 'default',
  size = 'md',
  className,
}: {
  text?: string;
  variant?: 'default' | 'casino' | 'dice' | 'neon' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <LoadingSpinner
        variant={variant}
        size={size}
        text={text}
        showText={true}
      />
    </div>
  );
}

/**
 * Card Loading Skeleton - For card layouts
 */
export function CardLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-casino-card-bg rounded-lg p-6 border border-casino-border-subtle"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-casino-border-subtle rounded-lg animate-pulse" />
            <div className="flex-1">
              <div className="h-6 bg-casino-border-subtle rounded animate-pulse mb-2" />
              <div className="h-4 bg-casino-border-subtle rounded animate-pulse w-3/4" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-casino-border-subtle rounded animate-pulse" />
            <div className="h-4 bg-casino-border-subtle rounded animate-pulse w-5/6" />
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-casino-border-subtle rounded animate-pulse" />
            <div className="h-6 w-20 bg-casino-border-subtle rounded animate-pulse" />
            <div className="h-6 w-14 bg-casino-border-subtle rounded animate-pulse" />
          </div>
          <div className="h-10 bg-casino-border-subtle rounded animate-pulse" />
        </motion.div>
      ))}
    </div>
  );
}

export default LoadingScreen;
