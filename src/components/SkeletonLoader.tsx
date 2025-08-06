'use client';

import { cn } from '@/src/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function SkeletonLoader({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonLoaderProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: ''
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined
  };

  return (
    <div
      className={cn(
        'bg-gray-800',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    >
      {animation === 'wave' && (
        <div className="skeleton-wave-shine" />
      )}
    </div>
  );
}

// Card Skeleton Component
export function CardSkeleton() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
      <SkeletonLoader variant="rounded" height={200} className="mb-4" />
      <SkeletonLoader variant="text" height={24} className="mb-2" />
      <SkeletonLoader variant="text" height={16} width="80%" className="mb-4" />
      <div className="flex gap-2">
        <SkeletonLoader variant="rounded" width={80} height={32} />
        <SkeletonLoader variant="rounded" width={80} height={32} />
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonLoader variant="text" height={16} />
        </td>
      ))}
    </tr>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <SkeletonLoader variant="circular" width={48} height={48} />
      <div className="flex-1">
        <SkeletonLoader variant="text" height={20} className="mb-2" />
        <SkeletonLoader variant="text" height={16} width="60%" />
      </div>
    </div>
  );
}