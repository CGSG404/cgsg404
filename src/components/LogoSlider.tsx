import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Define the logos
const logos = [
  { name: 'Game Curacao', src: '/logos/gaming_curacao.png' },
  { name: 'PAGCOR', src: '/logos/PAGCOR.png' },
  { name: 'bmm', src: '/logos/bmm-logo.png' },
  { name: 'iTechLabs', src: '/logos/itechlabs.png' },
  { name: 'GODADDY', src: '/logos/godaddy.png' },
  { name: 'iovation', src: '/logos/iovation.png' },
  { name: 'ThreatMetrix', src: '/logos/TM.jpg' },
  { name: 'TST VERIFIED', src: '/logos/TST.jpg' },
];

const PIXELS_PER_SECOND = 30;

const LogoSlider: React.FC = () => {
  const logosRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationConfig, setAnimationConfig] = useState({ width: 0, duration: 20 });

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
          setAnimationConfig({ width: 0, duration: 0 }); // No animation if content fits
        }
      }
    };

    calculateAnimation();

    window.addEventListener('resize', calculateAnimation);
    return () => window.removeEventListener('resize', calculateAnimation);
  }, []);

  return (
    <section className="py-4 sm:py-6 lg:py-8 xl:py-12 bg-black">
      {/* Responsive container matching site pattern */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-4 sm:mb-6 lg:mb-8 xl:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-2 sm:mb-3">
          Check Gaming License & Certification
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
          Real Domain Provide Safety License & Certification for you.
          </p>
        </motion.div>

        <div
          ref={containerRef}
          className="w-full overflow-hidden group py-4"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          }}
        >
          <motion.div
            ref={logosRef}
            className="flex w-max"
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
              <div
                key={`${logo.name}-${index}`}
                className="flex-shrink-0 px-4"
              >
                <div
                  className="w-40 h-20 bg-gray-800/50 rounded-lg flex items-center justify-center relative 
                            border border-gray-700/50 hover:border-casino-neon-green/30 transition-[transform,border-color] duration-300
                            transform hover:scale-110"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    fill
                    sizes="160px"
                    className="object-contain p-2 transition-colors duration-300"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;
