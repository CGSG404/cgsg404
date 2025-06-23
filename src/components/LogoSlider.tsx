
import React from 'react';

const LogoSlider = () => {
  // Placeholder logo data
  const logos = [
    { name: 'gopuff', src: '/public/assets/gopuff-logo.png' },
    { name: 'chatbase', src: '/public/assets/chatbase-logo.png' },
    { name: 'betashares', src: '/public/assets/betashares-logo.png' },
    { name: 'submagic', src: '/public/assets/submagic-logo.png' },
    { name: 'mozilla', src: '/public/assets/mozilla-logo.png' },
    { name: 'partner1', src: '/public/assets/partner1-logo.png' },
    { name: 'partner2', src: '/public/assets/partner2-logo.png' },
    { name: 'partner3', src: '/public/assets/partner3-logo.png' },
  ];

  return (
    <section className="py-16 bg-casino-dark overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-300 mb-4">Trusted by Leading Brands</h3>
          <p className="text-gray-400">Join thousands of satisfied users worldwide</p>
        </div>
        
        <div className="relative">
          <div className="flex animate-slide-left">
            {/* First set of logos */}
            <div className="flex items-center justify-center space-x-12 min-w-full">
              {logos.map((logo, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <div className="w-24 h-12 md:w-32 md:h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs md:text-sm font-medium">
                      {logo.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center justify-center space-x-12 min-w-full">
              {logos.map((logo, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <div className="w-24 h-12 md:w-32 md:h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs md:text-sm font-medium">
                      {logo.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;
