'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProfessionalMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'casino' | 'minimal' | 'elegant';
  disabled?: boolean;
}

/**
 * Professional Menu Button - Text-based menu toggle without icons
 * Features smooth animations and professional appearance
 */
export function ProfessionalMenuButton({
  isOpen,
  onClick,
  className,
  size = 'md',
  variant = 'casino',
  disabled = false,
}: ProfessionalMenuButtonProps) {
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm min-w-[60px]';
      case 'md':
        return 'px-4 py-2.5 text-sm min-w-[70px]';
      case 'lg':
        return 'px-5 py-3 text-base min-w-[80px]';
      default:
        return 'px-4 py-2.5 text-sm min-w-[70px]';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'casino':
        return {
          button: 'bg-casino-card-bg/60 hover:bg-casino-neon-green/15 border border-casino-border-subtle hover:border-casino-neon-green/60 backdrop-blur-sm',
          text: 'text-white',
          glow: 'shadow-[0_0_20px_rgba(0,255,153,0.4)]',
        };
      case 'minimal':
        return {
          button: 'bg-transparent hover:bg-white/10 border border-white/20 hover:border-white/40',
          text: 'text-white',
          glow: '',
        };
      case 'elegant':
        return {
          button: 'bg-gradient-to-r from-casino-card-bg/80 to-casino-card-bg/60 hover:from-casino-neon-green/20 hover:to-casino-neon-green/10 border border-casino-neon-green/30 hover:border-casino-neon-green',
          text: 'text-white',
          glow: 'shadow-[0_0_25px_rgba(0,255,153,0.5)]',
        };
      default:
        return {
          button: 'bg-gray-100 hover:bg-gray-200 border border-gray-300',
          text: 'text-gray-700',
          glow: '',
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const variantStyles = getVariantClasses();

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-casino-neon-green/50 font-medium tracking-wide overflow-hidden',
        sizeClasses,
        variantStyles.button,
        isOpen && variant === 'casino' && variantStyles.glow,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        y: disabled ? 0 : -1,
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        y: disabled ? 0 : 1,
      }}
      initial={false}
      animate={{
        rotateX: isOpen ? 5 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-green/5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Text Content */}
      <motion.span
        className={cn(
          'relative z-10 font-semibold',
          variantStyles.text
        )}
        initial={false}
        animate={{
          color: isOpen ? '#00ff99' : undefined,
        }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? 'Close' : 'Menu'}
      </motion.span>

      {/* Professional Border Animation */}
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-casino-neon-green/60"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.9,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Subtle Glow Effect */}
      {variant === 'casino' && isOpen && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-casino-neon-green/5"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1],
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
 * Preset Professional Menu Buttons
 */

// Casino-themed professional menu button
export function CasinoProfessionalMenu({
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
    <ProfessionalMenuButton
      isOpen={isOpen}
      onClick={onClick}
      className={className}
      size={size}
      variant="casino"
    />
  );
}

// Minimal professional menu button
export function MinimalProfessionalMenu({
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
    <ProfessionalMenuButton
      isOpen={isOpen}
      onClick={onClick}
      className={className}
      size={size}
      variant="minimal"
    />
  );
}

// Elegant professional menu button
export function ElegantProfessionalMenu({
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
    <ProfessionalMenuButton
      isOpen={isOpen}
      onClick={onClick}
      className={className}
      size={size}
      variant="elegant"
    />
  );
}

export default ProfessionalMenuButton;
