import React from 'react';
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

const LogoSlider: React.FC = () => {
  // Duplicate logos to create a seamless loop effect
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-12 md:py-16 bg-casino-dark">
      <div className="container mx-auto px-4">
        {/* Header section with animation */}
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

        {/* Slider container */}
        <div className="relative flex overflow-hidden group">
          <motion.div
            className="flex"
            animate={{
              x: ['0%', '-100%'],
            }}
            transition={{
              ease: 'linear',
              duration: 25,
              repeat: Infinity,
            }}
          >
            {/* Render the logos twice for the loop */}
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex-shrink-0 p-4"
                style={{ width: '200px' }} // Fixed width for each logo container
              >
                <div
                  className="w-full h-20 bg-gray-800/50 rounded-lg flex items-center justify-center 
                            border border-gray-700/50 group-hover:border-casino-neon-green/30 transition-all duration-300
                            transform hover:scale-110"
                >
                  <span className="text-gray-400 group-hover:text-casino-neon-green text-sm font-medium transition-colors duration-300">
                    {logo.name}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Gradient overlays for fade effect */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-casino-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-casino-dark to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;
