'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'casino' | 'neon';
  disabled?: boolean;
}

/**
 * Animated Hamburger Menu Button
 * Features smooth transitions between hamburger and X states
 */
export function AnimatedHamburger({
  isOpen,
  onClick,
  className,
  size = 'md',
  variant = 'casino',
  disabled = false,
}: AnimatedHamburgerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 p-1.5',
    md: 'w-6 h-6 p-2',
    lg: 'w-8 h-8 p-2.5',
  };

  const lineClasses = {
    sm: 'h-0.5',
    md: 'h-0.5',
    lg: 'h-1',
  };

  const containerSize = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'casino':
        return {
          button: 'bg-casino-card-bg/50 hover:bg-casino-neon-green/10 border border-casino-border-subtle hover:border-casino-neon-green/50',
          line: 'bg-casino-neon-green',
          glow: 'shadow-[0_0_10px_rgba(0,255,153,0.3)]',
        };
      case 'neon':
        return {
          button: 'bg-transparent hover:bg-casino-neon-green/5 border-2 border-casino-neon-green/30 hover:border-casino-neon-green',
          line: 'bg-casino-neon-green',
          glow: 'shadow-[0_0_15px_rgba(0,255,153,0.5)]',
        };
      default:
        return {
          button: 'bg-gray-100 hover:bg-gray-200 border border-gray-300',
          line: 'bg-gray-700',
          glow: '',
        };
    }
  };

  const variantStyles = getVariantClasses();

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-casino-neon-green/50',
        containerSize[size],
        variantStyles.button,
        isOpen && variant === 'casino' && variantStyles.glow,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={false}
      animate={{
        rotate: isOpen ? 180 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {/* Hamburger Lines Container */}
      <div className={cn('relative flex flex-col justify-center', sizeClasses[size])}>
        {/* Top Line */}
        <motion.div
          className={cn(
            'absolute rounded-full transition-all duration-300',
            lineClasses[size],
            variantStyles.line
          )}
          initial={false}
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : size === 'sm' ? -3 : size === 'md' ? -4 : -5,
            width: isOpen ? (size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        />

        {/* Middle Line */}
        <motion.div
          className={cn(
            'absolute rounded-full transition-all duration-300',
            lineClasses[size],
            variantStyles.line
          )}
          initial={false}
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0 : 1,
            width: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />

        {/* Bottom Line */}
        <motion.div
          className={cn(
            'absolute rounded-full transition-all duration-300',
            lineClasses[size],
            variantStyles.line
          )}
          initial={false}
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : size === 'sm' ? 3 : size === 'md' ? 4 : 5,
            width: isOpen ? (size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Ripple Effect on Click */}
      <AnimatePresence>
        {isOpen && variant === 'casino' && (
          <motion.div
            className="absolute inset-0 rounded-lg border border-casino-neon-green/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Background Pulse for Neon Variant */}
      {variant === 'neon' && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-casino-neon-green/10"
          animate={{
            scale: isOpen ? [1, 1.1, 1] : 1,
            opacity: isOpen ? [0.3, 0.6, 0.3] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: isOpen ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
}

/**
 * Simple Animated Hamburger - Minimal version
 */
export function SimpleAnimatedHamburger({
  isOpen,
  onClick,
  className,
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative w-10 h-10 flex items-center justify-center rounded-lg bg-casino-card-bg/50 hover:bg-casino-neon-green/10 border border-casino-border-subtle hover:border-casino-neon-green/50 transition-all duration-300',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-6 h-6 relative flex flex-col justify-center">
        {/* Top Line */}
        <motion.div
          className="absolute h-0.5 bg-casino-neon-green rounded-full"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : -4,
            width: isOpen ? '20px' : '18px',
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Middle Line */}
        <motion.div
          className="absolute h-0.5 w-5 bg-casino-neon-green rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />

        {/* Bottom Line */}
        <motion.div
          className="absolute h-0.5 bg-casino-neon-green rounded-full"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : 4,
            width: isOpen ? '20px' : '18px',
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </motion.button>
  );
}

export default AnimatedHamburger;
