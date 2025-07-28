'use client';

import React from 'react';

interface DebugHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const DebugHamburger: React.FC<DebugHamburgerProps> = ({ 
  isOpen, 
  onClick, 
  className = '' 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('DebugHamburger clicked!', { isOpen });
    onClick();
  };

  return (
    <button
      className={`relative p-2 bg-red-500/20 border border-red-500 hover:bg-red-500/30 transition-all duration-200 focus:outline-none ${className}`}
      onClick={handleClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      type="button"
      style={{ minWidth: '40px', minHeight: '40px' }}
    >
      <div className="w-6 h-5 relative flex flex-col justify-center mx-auto">
        {/* Simple lines without complex animations */}
        <div
          className="h-0.5 w-6 bg-white mb-1"
          style={{
            transform: isOpen ? 'rotate(45deg) translateY(6px)' : 'none',
            transition: 'all 0.3s ease'
          }}
        />
        <div
          className="h-0.5 w-6 bg-white mb-1"
          style={{
            opacity: isOpen ? 0 : 1,
            transition: 'all 0.3s ease'
          }}
        />
        <div
          className="h-0.5 w-6 bg-white"
          style={{
            transform: isOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
            transition: 'all 0.3s ease'
          }}
        />
      </div>
      
      {/* Debug text */}
      <div className="absolute -bottom-6 left-0 text-xs text-white bg-black px-1">
        {isOpen ? 'OPEN' : 'CLOSED'}
      </div>
    </button>
  );
};

export default DebugHamburger;
