'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchLogoSliderItems, fallbackLogoSliderData } from '@/src/lib/homepage-data';

const PIXELS_PER_SECOND = 30;

const LogoSlider: React.FC = () => {
  const logosRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationConfig, setAnimationConfig] = useState({ width: 0, duration: 20 });

  const { data: logos = fallbackLogoSliderData } = useQuery({
    queryKey: ['logoSliderItems'],
    queryFn: fetchLogoSliderItems,
    initialData: fallbackLogoSliderData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const calculateAnimation = () => {
      if (logosRef.current && containerRef.current) {
        const logosWidth = logosRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        const scrollWidth = logosWidth - containerWidth;

        if (scrollWidth > 0) {
          const duration = scrollWidth / PIXELS_PER_SECOND;
          setAnimationConfig({ width: -scrollWidth, duration });
        } else {
          setAnimationConfig({ width: 0, duration: 0 });
        }
      }
    };

    calculateAnimation();
    window.addEventListener('resize', calculateAnimation);
    return () => window.removeEventListener('resize', calculateAnimation);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gaming License & Certification
          </h3>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Trusted and verified by leading gaming authorities and security organizations worldwide.
          </p>
        </motion.div>

        {/* Logo Slider Container */}
        <div
          ref={containerRef}
          className="w-full overflow-hidden py-6"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <motion.div
            ref={logosRef}
            className="flex w-max gap-8"
            style={{ willChange: 'transform' }}
            animate={{ x: [0, animationConfig.width] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'mirror',
                duration: animationConfig.duration,
                ease: 'linear',
              },
            }}
          >
            {logos.map((logo, index) => (
              <motion.div
                key={logo.id || `${logo.name}-${index}`}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-36 h-20 sm:w-44 sm:h-24 bg-black rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer"
                  style={{ backgroundColor: '#000000' }}
                  onClick={() => logo.website_url && window.open(logo.website_url, '_blank')}
                >
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-casino-neon-green/0 via-casino-neon-green/5 to-casino-neon-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <Image
                    src={logo.logo_url}
                    alt={logo.alt_text || `${logo.name} certification`}
                    fill
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-contain p-3 filter brightness-90 group-hover:brightness-100 transition-all duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust Badge */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-casino-neon-green/10 rounded-full border border-casino-neon-green/20">
            <div className="w-2 h-2 bg-casino-neon-green rounded-full animate-pulse" />
            <span className="text-casino-neon-green text-sm font-medium">
              Verified & Trusted
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LogoSlider;
