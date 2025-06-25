import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Define the logos
const logos = [
  { name: 'gopuff' },
  { name: 'chatbase' },
  { name: 'betashares' },
  { name: 'submagic' },
  { name: 'mozilla' },
  { name: 'partner1' },
  { name: 'partner2' },
  { name: 'partner3' },
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
    <section className="py-12 md:py-16 bg-casino-dark">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10 md:mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Trusted by Leading Brands
          </h3>
          <p className="text-gray-400 text-sm md:text-base">
            Join thousands of satisfied users worldwide
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
                  className="w-40 h-20 bg-gray-800/50 rounded-lg flex items-center justify-center 
                            border border-gray-700/50 hover:border-casino-neon-green/30 transition-[transform,border-color] duration-300
                            transform hover:scale-110"
                >
                  <span className="text-gray-400 hover:text-casino-neon-green text-sm font-medium transition-colors duration-300">
                    {logo.name}
                  </span>
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
