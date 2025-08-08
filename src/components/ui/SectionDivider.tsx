'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star, Sparkles, Crown, Trophy, Gift } from 'lucide-react';
import ClientOnly from '../ClientOnly';

interface SectionDividerProps {
  title?: string;
  subtitle?: string;
  icon?: 'star' | 'sparkles' | 'crown' | 'trophy' | 'gift' | 'none';
  variant?: 'default' | 'premium' | 'casino' | 'minimal';
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  title,
  subtitle,
  icon = 'none',
  variant = 'default',
  className,
  spacing = 'lg'
}) => {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20'
  };

  const getIcon = () => {
    const iconProps = { className: "w-6 h-6 text-casino-neon-green" };
    switch (icon) {
      case 'star': return <Star {...iconProps} />;
      case 'sparkles': return <Sparkles {...iconProps} />;
      case 'crown': return <Crown {...iconProps} />;
      case 'trophy': return <Trophy {...iconProps} />;
      case 'gift': return <Gift {...iconProps} />;
      default: return null;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return {
          container: 'bg-gradient-to-r from-transparent via-casino-card-bg/20 to-transparent',
          line: 'bg-gradient-to-r from-transparent via-casino-neon-green/60 to-transparent',
          title: 'text-white text-3xl md:text-4xl font-bold',
          subtitle: 'text-gray-300 text-lg'
        };
      case 'casino':
        return {
          container: 'bg-casino-card-bg/10 border-y border-casino-neon-green/20',
          line: 'bg-casino-neon-green/40',
          title: 'text-casino-neon-green text-2xl md:text-3xl font-bold',
          subtitle: 'text-gray-400 text-base'
        };
      case 'minimal':
        return {
          container: '',
          line: 'bg-gray-600/30',
          title: 'text-white text-xl md:text-2xl font-semibold',
          subtitle: 'text-gray-400 text-sm'
        };
      default:
        return {
          container: '',
          line: 'bg-gradient-to-r from-transparent via-casino-neon-green/50 to-transparent',
          title: 'text-white text-2xl md:text-3xl font-bold',
          subtitle: 'text-gray-300 text-base'
        };
    }
  };

  const styles = getVariantStyles();

  if (!title && !subtitle) {
    return (
      <ClientOnly fallback={
        <div className={cn(spacingClasses[spacing], 'w-full', className)}>
          <div className={cn('h-px w-full', styles.line)} />
        </div>
      }>
        <div className={cn(spacingClasses[spacing], 'w-full', className)}>
          <motion.div
            className={cn('h-px w-full', styles.line)}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly fallback={
      <div className={cn(spacingClasses[spacing], 'w-full', styles.container, className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className={cn('flex-1 h-px', styles.line)} />

            <div className="px-8 text-center">
              {icon !== 'none' && (
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-casino-card-bg/50 border border-casino-neon-green/30">
                    {getIcon()}
                  </div>
                </div>
              )}

              {title && (
                <h2 className={cn(styles.title, 'mb-2')}>
                  {title}
                </h2>
              )}

              {subtitle && (
                <p className={styles.subtitle}>
                  {subtitle}
                </p>
              )}
            </div>

            <div className={cn('flex-1 h-px', styles.line)} />
          </div>
        </div>
      </div>
    }>
      <div className={cn(spacingClasses[spacing], 'w-full', styles.container, className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <motion.div
              className={cn('flex-1 h-px', styles.line)}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'left' }}
            />

            <motion.div
              className="px-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {icon !== 'none' && (
                <motion.div
                  className="flex justify-center mb-4"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="p-3 rounded-full bg-casino-card-bg/50 border border-casino-neon-green/30">
                    {getIcon()}
                  </div>
                </motion.div>
              )}

              {title && (
                <h2 className={cn(styles.title, 'mb-2')}>
                  {title}
                </h2>
              )}

              {subtitle && (
                <p className={styles.subtitle}>
                  {subtitle}
                </p>
              )}
            </motion.div>

            <motion.div
              className={cn('flex-1 h-px', styles.line)}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'right' }}
            />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};

export default SectionDivider;
