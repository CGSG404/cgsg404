
import React, { useEffect, useRef } from 'react';

const LogoSlider = () => {
  const logos = [
    { id: 1, name: 'gopuff', src: '/public/assets/gopuff-logo.png' },
    { id: 2, name: 'chatbase', src: '/public/assets/chatbase-logo.png' },
    { id: 3, name: 'betashares', src: '/public/assets/betashares-logo.png' },
    { id: 4, name: 'submagic', src: '/public/assets/submagic-logo.png' },
    { id: 5, name: 'mozilla', src: '/public/assets/mozilla-logo.png' },
    { id: 6, name: 'partner1', src: '/public/assets/partner1-logo.png' },
    { id: 7, name: 'partner2', src: '/public/assets/partner2-logo.png' },
    { id: 8, name: 'partner3', src: '/public/assets/partner3-logo.png' },
  ];

  // Duplicate logos for seamless loop
  const allLogos = [...logos, ...logos, ...logos];
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const isPaused = useRef(false);

  // Animation function
  const animate = () => {
    if (!sliderRef.current || isPaused.current) return;
    
    const slider = sliderRef.current;
    const firstItem = slider.firstElementChild as HTMLElement;
    if (!firstItem) return;
    
    const itemWidth = firstItem.offsetWidth + 32; // width + margin
    
    slider.style.transition = 'transform 0.5s ease-in-out';
    
    // Move to next item
    const currentTransform = slider.style.transform || 'translateX(0)';
    const currentX = parseInt(currentTransform.replace(/[^0-9-]/g, '') || '0');
    let newX = currentX - 1;
    
    // Reset position when reaching the end of the first set
    if (Math.abs(newX) >= itemWidth * (allLogos.length / 3)) {
      slider.style.transition = 'none';
      newX = 0;
    }
    
    slider.style.transform = `translateX(${newX}px)`;
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Pause on hover
    const slider = sliderRef.current;
    if (!slider) return;
    
    const handleMouseEnter = () => {
      isPaused.current = true;
      if (slider) {
        slider.style.transition = 'transform 0.3s ease-in-out';
      }
    };
    
    const handleMouseLeave = () => {
      isPaused.current = false;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-12 md:py-16 bg-casino-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12 px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Trusted by Leading Brands
          </h3>
          <p className="text-gray-400 text-sm md:text-base">
            Join thousands of satisfied users worldwide
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex items-center py-4 w-max"
            style={{ willChange: 'transform' }}
          >
            {allLogos.map((logo, index) => (
              <div 
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 mx-4 transition-all duration-300 transform hover:scale-110"
              >
                <div className="w-28 h-14 md:w-36 md:h-16 bg-gray-800/50 rounded-lg flex items-center justify-center 
                          border border-gray-700/50 hover:border-casino-neon-green/30 transition-all duration-300
                          group">
                  <span className="text-gray-400 group-hover:text-casino-neon-green text-xs md:text-sm font-medium transition-colors duration-300">
                    {logo.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gradient overlays for fade effect */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-casino-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-casino-dark to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;
