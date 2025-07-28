'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from './ClientOnly';

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  dismissible?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

const PromoBanner: React.FC<PromoBannerProps> = ({
  title = "🎉 Welcome Bonus Available!",
  subtitle = "Get up to 200% bonus + 100 free spins on your first deposit",
  ctaText = "Claim Now",
  ctaLink = "/best-bonuses",
  dismissible = true,
  variant = 'default'
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variantStyles = {
    default: {
      bg: 'bg-casino-card-bg/40',
      border: 'border-casino-neon-green/30',
      text: 'text-casino-neon-green',
      button: 'bg-casino-neon-green hover:bg-emerald-400'
    },
    success: {
      bg: 'bg-casino-card-bg/40',
      border: 'border-green-400/30',
      text: 'text-green-400',
      button: 'bg-green-500 hover:bg-emerald-500'
    },
    warning: {
      bg: 'bg-casino-card-bg/40',
      border: 'border-yellow-400/30',
      text: 'text-yellow-400',
      button: 'bg-yellow-500 hover:bg-orange-500'
    },
    info: {
      bg: 'bg-casino-card-bg/40',
      border: 'border-blue-400/30',
      text: 'text-blue-400',
      button: 'bg-blue-500 hover:bg-cyan-500'
    }
  };

  const currentVariant = variantStyles[variant];

  if (!isVisible) return null;

  return (
    <ClientOnly fallback={
      <div className="relative overflow-hidden bg-casino-card-bg/40 backdrop-blur-sm border border-casino-neon-green/30 rounded-2xl mx-4 my-4 shadow-lg">
        <div className="relative z-10 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-casino-neon-green">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-casino-neon-green">
                  Loading bonus offer...
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`relative overflow-hidden ${currentVariant.bg} backdrop-blur-sm border ${currentVariant.border} rounded-2xl mx-4 my-4 shadow-lg`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-2 right-4 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        <div className="absolute bottom-2 left-4 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Gift className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <Zap className="w-16 h-16 text-white" />
          </motion.div>
        </div>

        <div className="relative z-10 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${currentVariant.button}`}>
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-lg md:text-xl font-bold ${currentVariant.text} truncate`}>
                  {title}
                </h3>
              </div>
              <p className="text-white/90 text-sm md:text-base mb-4 md:mb-0">
                {subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <Link href={ctaLink} className="group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${currentVariant.button} text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-lg`}
                >
                  <span className="flex items-center gap-2 text-sm md:text-base">
                    {ctaText}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </motion.button>
              </Link>

              {dismissible && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsVisible(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl">
          <div className={`absolute inset-0 rounded-2xl border-2 ${currentVariant.border} opacity-50`}></div>
          <motion.div
            className={`absolute inset-0 rounded-2xl border-2 ${currentVariant.border}`}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          ></motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
    </ClientOnly>
  );
};

export default PromoBanner;
