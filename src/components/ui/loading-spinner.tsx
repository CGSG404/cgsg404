import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'casino' | 'dice' | 'neon' | 'minimal';
  text?: string;
  showText?: boolean;
}

export function LoadingSpinner({
  className,
  size = 'md',
  variant = 'default',
  text = 'Loading...',
  showText = false,
  ...props
}: LoadingSpinnerProps) {
  const [currentDice, setCurrentDice] = useState(0);
  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

  // Animate dice for casino variant
  useEffect(() => {
    if (variant === 'dice') {
      const interval = setInterval(() => {
        setCurrentDice(prev => (prev + 1) % diceIcons.length);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [variant]);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  // Default spinner
  if (variant === 'default' || variant === 'minimal') {
    return (
      <div className={cn('flex flex-col items-center gap-2', className)} {...props}>
        <div
          className={cn(
            'inline-block animate-spin rounded-full border-2 border-casino-neon-green border-t-transparent',
            sizeClasses[size]
          )}
          role="status"
        >
          <span className="sr-only">{text}</span>
        </div>
        {showText && variant !== 'minimal' && (
          <span className={cn('text-gray-400', textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Casino themed spinner
  if (variant === 'casino') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)} {...props}>
        <div className={cn('relative', sizeClasses[size])}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-casino-neon-green/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-casino-neon-green border-r-casino-neon-purple"
          />
          <div className="absolute inset-2 rounded-full bg-casino-neon-green/10 flex items-center justify-center">
            <Sparkles className={cn('text-casino-neon-green', size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8')} />
          </div>
        </div>
        {showText && (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={cn('text-casino-neon-green font-medium', textSizeClasses[size])}
          >
            {text}
          </motion.span>
        )}
      </div>
    );
  }

  // Dice spinner
  if (variant === 'dice') {
    const DiceIcon = diceIcons[currentDice];
    return (
      <div className={cn('flex flex-col items-center gap-3', className)} {...props}>
        <motion.div
          key={currentDice}
          initial={{ scale: 0.8, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.2 }}
          className={cn('text-casino-neon-green', sizeClasses[size])}
        >
          <DiceIcon className="w-full h-full" />
        </motion.div>
        {showText && (
          <span className={cn('text-gray-400', textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Neon spinner
  if (variant === 'neon') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)} {...props}>
        <div className={cn('relative', sizeClasses[size])}>
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 rounded-full border-2 border-casino-neon-green shadow-[0_0_20px_rgba(0,255,153,0.5)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border-2 border-casino-neon-purple/50 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
          />
          <div className="absolute inset-3 rounded-full bg-gradient-to-r from-casino-neon-green/20 to-casino-neon-purple/20 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Loader2 className={cn('text-white', size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8')} />
            </motion.div>
          </div>
        </div>
        {showText && (
          <motion.span
            animate={{
              textShadow: [
                '0 0 5px rgba(0,255,153,0.5)',
                '0 0 20px rgba(0,255,153,0.8)',
                '0 0 5px rgba(0,255,153,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn('text-casino-neon-green font-bold', textSizeClasses[size])}
          >
            {text}
          </motion.span>
        )}
      </div>
    );
  }

  // Minimal modern spinner (default)
  if (variant === 'minimal' || variant === 'default') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)} {...props}>
        <div className={cn('relative', sizeClasses[size])}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-slate-600 border-t-blue-500"
          />
        </div>
        {showText && (
          <span className={cn('text-slate-300 font-medium', textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return null;
}

export default LoadingSpinner;
