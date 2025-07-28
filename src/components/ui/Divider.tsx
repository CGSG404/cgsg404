'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ClientOnly from '../ClientOnly';

interface DividerProps {
  variant?: 'default' | 'gradient' | 'dotted' | 'thick' | 'minimal' | 'casino' | 'neon' | 'animated';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children?: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const Divider: React.FC<DividerProps> = ({
  variant = 'default',
  orientation = 'horizontal',
  className,
  children,
  spacing = 'md',
  animated = false
}) => {
  const spacingClasses = {
    sm: 'my-4',
    md: 'my-8',
    lg: 'my-12',
    xl: 'my-16'
  };

  const variantClasses = {
    default: 'border-casino-border-subtle',
    gradient: 'border-0 h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-transparent',
    dotted: 'border-casino-border-subtle border-dotted',
    thick: 'border-casino-neon-green/30 border-2',
    minimal: 'border-gray-600/30',
    casino: 'border-casino-neon-green/40 border-2 shadow-sm shadow-casino-neon-green/20',
    neon: 'border-0 h-0.5 bg-casino-neon-green shadow-lg shadow-casino-neon-green/50',
    animated: 'border-0 h-px bg-casino-neon-green/30'
  };

  if (orientation === 'vertical') {
    return (
      <div className={cn(
        'border-l h-full',
        variantClasses[variant],
        className
      )} />
    );
  }

  if (children) {
    return (
      <ClientOnly fallback={
        <div className={cn(spacingClasses[spacing], 'flex items-center', className)}>
          <div className={cn(
            'flex-1 border-t',
            variant === 'gradient'
              ? 'border-0 h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-casino-border-subtle/50'
              : variantClasses[variant]
          )} />
          <div className="px-4 text-gray-400 text-sm font-medium">
            {children}
          </div>
          <div className={cn(
            'flex-1 border-t',
            variant === 'gradient'
              ? 'border-0 h-px bg-gradient-to-r from-casino-border-subtle/50 via-casino-neon-green/50 to-transparent'
              : variantClasses[variant]
          )} />
        </div>
      }>
        <div className={cn(spacingClasses[spacing], 'flex items-center', className)}>
          {animated || variant === 'animated' ? (
            <motion.div
              className={cn(
                'flex-1 border-t',
                variant === 'gradient'
                  ? 'border-0 h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-casino-border-subtle/50'
                  : variantClasses[variant]
              )}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'left' }}
            />
          ) : (
            <div className={cn(
              'flex-1 border-t',
              variant === 'gradient'
                ? 'border-0 h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-casino-border-subtle/50'
                : variantClasses[variant]
            )} />
          )}

          <motion.div
            className="px-4 text-gray-400 text-sm font-medium"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {children}
          </motion.div>

          {animated || variant === 'animated' ? (
            <motion.div
              className={cn(
                'flex-1 border-t',
                variant === 'gradient'
                  ? 'border-0 h-px bg-gradient-to-r from-casino-border-subtle/50 via-casino-neon-green/50 to-transparent'
                  : variantClasses[variant]
              )}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'right' }}
            />
          ) : (
            <div className={cn(
              'flex-1 border-t',
              variant === 'gradient'
                ? 'border-0 h-px bg-gradient-to-r from-casino-border-subtle/50 via-casino-neon-green/50 to-transparent'
                : variantClasses[variant]
            )} />
          )}
        </div>
      </ClientOnly>
    );
  }

  if (animated || variant === 'animated') {
    return (
      <ClientOnly fallback={
        <div className={cn(
          spacingClasses[spacing],
          'w-full',
          variant === 'gradient'
            ? 'h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-transparent'
            : `border-t ${variantClasses[variant]}`,
          className
        )} />
      }>
        <motion.div
          className={cn(spacingClasses[spacing], 'w-full', className)}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className={cn(
              'w-full',
              variant === 'gradient'
                ? 'h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-transparent'
                : `border-t ${variantClasses[variant]}`
            )}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </motion.div>
      </ClientOnly>
    );
  }

  return (
    <div className={cn(
      spacingClasses[spacing],
      'w-full',
      variant === 'gradient'
        ? 'h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-transparent'
        : `border-t ${variantClasses[variant]}`,
      className
    )} />
  );
};

export default Divider;
