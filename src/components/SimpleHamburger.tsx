'use client';

import React from 'react';

interface SimpleHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const SimpleHamburger: React.FC<SimpleHamburgerProps> = ({
  isOpen,
  onClick,
  className = ''
}) => {
  const handleClick = () => {
    console.log('SimpleHamburger clicked, isOpen:', isOpen);
    onClick();
  };

  return (
    <button
      className={`relative p-1.5 hover:bg-casino-neon-green/10 transition-all duration-200 focus:outline-none ${className}`}
      onClick={handleClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      type="button"
    >
      <div className="w-6 h-5 relative flex flex-col justify-center">
        {/* Top line */}
        <span
          className="block h-0.5 w-6 bg-casino-neon-green rounded-full absolute transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: '#00ff99',
            transformOrigin: 'center',
            transform: isOpen
              ? 'rotate(45deg) translateY(0px)'
              : 'rotate(0deg) translateY(-8px)'
          }}
        />

        {/* Middle line */}
        <span
          className="block h-0.5 w-5 bg-casino-neon-green rounded-full absolute transition-all duration-200 ease-in-out"
          style={{
            backgroundColor: '#00ff99',
            transformOrigin: 'center',
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? 'scale(0.75)' : 'scale(1)'
          }}
        />

        {/* Bottom line */}
        <span
          className="block h-0.5 bg-casino-neon-green rounded-full absolute transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: '#00ff99',
            transformOrigin: 'center',
            width: isOpen ? '24px' : '16px',
            transform: isOpen
              ? 'rotate(-45deg) translateY(0px)'
              : 'rotate(0deg) translateY(8px)'
          }}
        />
      </div>
    </button>
  );
};

export default SimpleHamburger;
