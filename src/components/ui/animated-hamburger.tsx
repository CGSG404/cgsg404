'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'casino' | 'neon' | 'morphing' | 'elastic' | 'magnetic';
  disabled?: boolean;
  animationType?: 'rotate' | 'morph' | 'elastic' | 'magnetic' | 'squeeze';
}

/**
 * Advanced Animated Hamburger Menu Button
 * Features multiple smooth animation types and professional transitions
 */
export function AnimatedHamburger({
  isOpen,
  onClick,
  className,
  size = 'md',
  variant = 'casino',
  animationType = 'morph',
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
      case 'morphing':
        return {
          button: 'bg-casino-card-bg/60 hover:bg-casino-neon-green/15 border border-casino-border-subtle hover:border-casino-neon-green/60 backdrop-blur-sm',
          line: 'bg-gradient-to-r from-casino-neon-green to-casino-neon-blue',
          glow: 'shadow-[0_0_20px_rgba(0,255,153,0.4)]',
        };
      case 'elastic':
        return {
          button: 'bg-casino-card-bg/70 hover:bg-casino-neon-green/20 border-2 border-casino-neon-green/40 hover:border-casino-neon-green/80',
          line: 'bg-casino-neon-green',
          glow: 'shadow-[0_0_25px_rgba(0,255,153,0.6)]',
        };
      case 'magnetic':
        return {
          button: 'bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/60 hover:from-casino-neon-green/20 hover:to-casino-neon-green/10 border border-casino-neon-green/30 hover:border-casino-neon-green',
          line: 'bg-casino-neon-green',
          glow: 'shadow-[0_0_30px_rgba(0,255,153,0.5)]',
        };
      default:
        return {
          button: 'bg-gray-100 hover:bg-gray-200 border border-gray-300',
          line: 'bg-gray-700',
          glow: '',
        };
    }
  };

  // Animation configurations for different types
  const getAnimationConfig = () => {
    switch (animationType) {
      case 'morph':
        return {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth morph
          stagger: 0.05,
        };
      case 'elastic':
        return {
          duration: 0.6,
          ease: [0.68, -0.55, 0.265, 1.55], // Elastic ease
          stagger: 0.08,
        };
      case 'magnetic':
        return {
          duration: 0.5,
          ease: [0.175, 0.885, 0.32, 1.275], // Magnetic ease
          stagger: 0.1,
        };
      case 'squeeze':
        return {
          duration: 0.35,
          ease: [0.25, 0.1, 0.25, 1], // Squeeze ease
          stagger: 0.03,
        };
      default: // rotate
        return {
          duration: 0.3,
          ease: "easeInOut",
          stagger: 0,
        };
    }
  };

  const variantStyles = getVariantClasses();
  const animConfig = getAnimationConfig();

  // Enhanced hover and tap animations based on variant
  const getInteractionAnimations = () => {
    switch (variant) {
      case 'elastic':
        return {
          whileHover: { scale: disabled ? 1 : 1.08, rotate: disabled ? 0 : 2 },
          whileTap: { scale: disabled ? 1 : 0.92, rotate: disabled ? 0 : -2 },
        };
      case 'magnetic':
        return {
          whileHover: { scale: disabled ? 1 : 1.06, y: disabled ? 0 : -1 },
          whileTap: { scale: disabled ? 1 : 0.94, y: disabled ? 0 : 1 },
        };
      case 'morphing':
        return {
          whileHover: { scale: disabled ? 1 : 1.07, rotateY: disabled ? 0 : 5 },
          whileTap: { scale: disabled ? 1 : 0.93, rotateY: disabled ? 0 : -5 },
        };
      default:
        return {
          whileHover: { scale: disabled ? 1 : 1.05 },
          whileTap: { scale: disabled ? 1 : 0.95 },
        };
    }
  };

  const interactions = getInteractionAnimations();

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-casino-neon-green/50 overflow-hidden',
        containerSize[size],
        variantStyles.button,
        isOpen && (variant === 'casino' || variant === 'morphing' || variant === 'elastic' || variant === 'magnetic') && variantStyles.glow,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...interactions}
      initial={false}
      animate={{
        rotate: animationType === 'rotate' ? (isOpen ? 180 : 0) : 0,
      }}
      transition={{
        duration: animConfig.duration,
        ease: animConfig.ease,
      }}
    >
      {/* Advanced Hamburger Lines Container */}
      <div className={cn('relative flex flex-col justify-center', sizeClasses[size])}>
        {animationType === 'morph' ? (
          // Morphing Animation - Smooth transformation
          <>
            {/* Top Line - Morphs to top part of X */}
            <motion.div
              className={cn(
                'absolute rounded-full',
                lineClasses[size],
                variantStyles.line
              )}
              initial={false}
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : size === 'sm' ? -3 : size === 'md' ? -4 : -5,
                width: isOpen ? (size === 'sm' ? '18px' : size === 'md' ? '22px' : '26px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
                scaleX: isOpen ? 1.1 : 1,
              }}
              transition={{
                duration: animConfig.duration,
                ease: animConfig.ease,
                delay: isOpen ? 0 : animConfig.stagger,
              }}
            />

            {/* Middle Line - Fades and scales out */}
            <motion.div
              className={cn(
                'absolute rounded-full',
                lineClasses[size],
                variantStyles.line
              )}
              initial={false}
              animate={{
                opacity: isOpen ? 0 : 1,
                scale: isOpen ? 0.3 : 1,
                rotate: isOpen ? 90 : 0,
                width: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
              }}
              transition={{
                duration: animConfig.duration * 0.7,
                ease: animConfig.ease,
                delay: isOpen ? 0 : animConfig.stagger * 2,
              }}
            />

            {/* Bottom Line - Morphs to bottom part of X */}
            <motion.div
              className={cn(
                'absolute rounded-full',
                lineClasses[size],
                variantStyles.line
              )}
              initial={false}
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : size === 'sm' ? 3 : size === 'md' ? 4 : 5,
                width: isOpen ? (size === 'sm' ? '18px' : size === 'md' ? '22px' : '26px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
                scaleX: isOpen ? 1.1 : 1,
              }}
              transition={{
                duration: animConfig.duration,
                ease: animConfig.ease,
                delay: isOpen ? animConfig.stagger : 0,
              }}
            />
          </>
        ) : animationType === 'elastic' ? (
          // Elastic Animation - Bouncy transformation
          <>
            <motion.div
              className={cn('absolute rounded-full', lineClasses[size], variantStyles.line)}
              initial={false}
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : size === 'sm' ? -3 : size === 'md' ? -4 : -5,
                width: isOpen ? (size === 'sm' ? '18px' : size === 'md' ? '22px' : '26px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
                scaleY: isOpen ? [1, 1.3, 1] : [1, 0.8, 1],
              }}
              transition={{
                duration: animConfig.duration,
                ease: animConfig.ease,
                times: isOpen ? [0, 0.6, 1] : [0, 0.4, 1],
              }}
            />
            <motion.div
              className={cn('absolute rounded-full', lineClasses[size], variantStyles.line)}
              initial={false}
              animate={{
                opacity: isOpen ? 0 : 1,
                scale: isOpen ? [1, 0.5, 0] : [0, 0.5, 1],
                rotate: isOpen ? [0, 180, 360] : [360, 180, 0],
                width: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
              }}
              transition={{
                duration: animConfig.duration,
                ease: animConfig.ease,
                times: [0, 0.5, 1],
              }}
            />
            <motion.div
              className={cn('absolute rounded-full', lineClasses[size], variantStyles.line)}
              initial={false}
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : size === 'sm' ? 3 : size === 'md' ? 4 : 5,
                width: isOpen ? (size === 'sm' ? '18px' : size === 'md' ? '22px' : '26px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
                scaleY: isOpen ? [1, 1.3, 1] : [1, 0.8, 1],
              }}
              transition={{
                duration: animConfig.duration,
                ease: animConfig.ease,
                times: isOpen ? [0, 0.6, 1] : [0, 0.4, 1],
              }}
            />
          </>
        ) : animationType === 'magnetic' ? (
          // Magnetic Animation - Smooth magnetic pull effect
          <>
            <motion.div
              className={cn('absolute rounded-full', lineClasses[size], variantStyles.line)}
              initial={false}
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : size === 'sm' ? -3 : size === 'md' ? -4 : -5,
                x: isOpen ? [0, -2, 0] : [0, 1, 0],
                width: isOpen ? (size === 'sm' ? '18px' : size === 'md' ? '22px' : '26px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
              }}
              transition={{
                duration: animConfig.duration,
                ease: animConfig.ease,
                times: [0, 0.5, 1],
              }}
            />
            <motion.div
              className={cn('absolute rounded-full', lineClasses[size], variantStyles.line)}
              initial={false}
              animate={{
                opacity: isOpen ? 0 : 1,
                scale: isOpen ? 0 : 1,
                x: isOpen ? [0, 5, 0] : [0, -2, 0],
                width: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
              }}
              transition={{
                duration: animConfig.duration * 0.8,
                ease: animConfig.ease,
                times: [0, 0.6, 1],
              }}
            />
            <motion.div
              className={cn('absolute rounded-full', lineClasses[size], variantStyles.line)}
              initial={false}
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : size === 'sm' ? 3 : size === 'md' ? 4 : 5,
                x: isOpen ? [0, 2, 0] : [0, -1, 0],
                width: isOpen ? (size === 'sm' ? '18px' : size === 'md' ? '22px' : '26px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
              }}
              transition={{
                duration: animConfig.duration,
                ease: animConfig.ease,
                times: [0, 0.5, 1],
              }}
            />
          </>
        ) : (
          // Default/Rotate Animation - Classic smooth rotation
          <>
            <motion.div
              className={cn('absolute rounded-full', lineClasses[size], variantStyles.line)}
              initial={false}
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : size === 'sm' ? -3 : size === 'md' ? -4 : -5,
                width: isOpen ? (size === 'sm' ? '18px' : size === 'md' ? '22px' : '26px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
              }}
              transition={{
                duration: animConfig.duration,
                ease: animConfig.ease,
              }}
            />
            <motion.div
              className={cn('absolute rounded-full', lineClasses[size], variantStyles.line)}
              initial={false}
              animate={{
                opacity: isOpen ? 0 : 1,
                scale: isOpen ? 0 : 1,
                width: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
              }}
              transition={{
                duration: animConfig.duration * 0.7,
                ease: animConfig.ease,
              }}
            />
            <motion.div
              className={cn('absolute rounded-full', lineClasses[size], variantStyles.line)}
              initial={false}
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : size === 'sm' ? 3 : size === 'md' ? 4 : 5,
                width: isOpen ? (size === 'sm' ? '18px' : size === 'md' ? '22px' : '26px') : (size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px'),
              }}
              transition={{
                duration: animConfig.duration,
                ease: animConfig.ease,
              }}
            />
          </>
        )}
      </div>

      {/* Enhanced Visual Effects */}
      <AnimatePresence>
        {/* Ripple Effect for Casino/Morphing variants */}
        {isOpen && (variant === 'casino' || variant === 'morphing') && (
          <motion.div
            className="absolute inset-0 rounded-lg border border-casino-neon-green/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}

        {/* Elastic Bounce Effect */}
        {isOpen && variant === 'elastic' && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-casino-neon-green/60"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.4, 0.9, 1.1, 1],
              opacity: [0, 0.8, 0.4, 0.2, 0],
            }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              times: [0, 0.3, 0.6, 0.8, 1]
            }}
          />
        )}

        {/* Magnetic Field Effect */}
        {isOpen && variant === 'magnetic' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-lg bg-casino-neon-green/5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.2, 1],
                opacity: [0, 0.6, 0],
              }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-lg border border-casino-neon-green/40"
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1.05],
                opacity: [0, 0.8, 0],
              }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            />
          </>
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

      {/* Morphing Glow Effect */}
      {variant === 'morphing' && isOpen && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-blue/10"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
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

/**
 * Preset Hamburger Components - Ready to use with different animations
 */

// Professional Morphing Hamburger - Smooth and elegant
export function MorphingHamburger({
  isOpen,
  onClick,
  className,
  size = 'md',
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <AnimatedHamburger
      isOpen={isOpen}
      onClick={onClick}
      className={className}
      size={size}
      variant="morphing"
      animationType="morph"
    />
  );
}

// Elastic Hamburger - Bouncy and playful
export function ElasticHamburger({
  isOpen,
  onClick,
  className,
  size = 'md',
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <AnimatedHamburger
      isOpen={isOpen}
      onClick={onClick}
      className={className}
      size={size}
      variant="elastic"
      animationType="elastic"
    />
  );
}

// Magnetic Hamburger - Smooth magnetic effect
export function MagneticHamburger({
  isOpen,
  onClick,
  className,
  size = 'md',
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <AnimatedHamburger
      isOpen={isOpen}
      onClick={onClick}
      className={className}
      size={size}
      variant="magnetic"
      animationType="magnetic"
    />
  );
}

// Casino Hamburger - Perfect for casino themes
export function CasinoHamburger({
  isOpen,
  onClick,
  className,
  size = 'md',
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <AnimatedHamburger
      isOpen={isOpen}
      onClick={onClick}
      className={className}
      size={size}
      variant="casino"
      animationType="morph"
    />
  );
}

export default AnimatedHamburger;
