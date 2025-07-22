'use client';

import { motion } from 'framer-motion';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Sparkles, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Global Loading Page for Next.js App Router
 * Shows when navigating between pages or during initial load
 */
export default function Loading() {
  const [currentDice, setCurrentDice] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading');
  
  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const loadingTexts = [
    'Loading',
    'Shuffling cards',
    'Rolling dice',
    'Preparing games',
    'Almost ready'
  ];

  // Animate dice rotation
  useEffect(() => {
    const diceInterval = setInterval(() => {
      setCurrentDice(prev => (prev + 1) % diceIcons.length);
    }, 200);

    return () => clearInterval(diceInterval);
  }, []);

  // Animate loading text
  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingTexts.indexOf(prev);
        return loadingTexts[(currentIndex + 1) % loadingTexts.length];
      });
    }, 800);

    return () => clearInterval(textInterval);
  }, []);

  const DiceIcon = diceIcons[currentDice];

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-casino-dark via-casino-dark/95 to-black flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,153,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,153,0.02)_50%,transparent_75%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {typeof window !== 'undefined' && Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-casino-neon-green/30 rounded-full"
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

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Brand Area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-4 relative"
            >
              <div className="absolute inset-0 rounded-full border-4 border-casino-neon-green/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-casino-neon-green animate-spin" />
              <div className="absolute inset-2 rounded-full bg-casino-neon-green/10 flex items-center justify-center">
                <motion.div
                  key={currentDice}
                  initial={{ scale: 0.5, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DiceIcon className="w-8 h-8 text-casino-neon-green" />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Brand Text */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold text-white mb-2"
            >
              CGSG
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-casino-neon-green text-sm font-medium"
            >
              Casino Guide Singapore
            </motion.p>
          </div>
        </motion.div>

        {/* Loading Text with Animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg text-gray-300 mb-2"
          >
            {loadingText}
          </motion.p>
          
          {/* Animated Dots */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-casino-neon-green rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-64 mx-auto"
        >
          <div className="h-1 bg-casino-border-subtle rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-casino-neon-green to-casino-neon-purple"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-6 h-6 text-casino-neon-green/40" />
          </motion.div>
        </div>
        
        <div className="absolute -bottom-10 -right-10">
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Star className="w-5 h-5 text-casino-neon-purple/40" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <p className="text-xs text-gray-500 text-center">
          Preparing your gaming experience...
        </p>
      </motion.div>
    </div>
  );
}
