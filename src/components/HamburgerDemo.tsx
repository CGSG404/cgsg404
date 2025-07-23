'use client';

import { useState } from 'react';
import { 
  AnimatedHamburger, 
  MorphingHamburger, 
  ElasticHamburger, 
  MagneticHamburger, 
  CasinoHamburger 
} from '@/src/components/ui/animated-hamburger';

/**
 * Demo component to showcase different hamburger animations
 * Perfect for testing and choosing the best animation for your navbar
 */
export default function HamburgerDemo() {
  const [states, setStates] = useState({
    morphing: false,
    elastic: false,
    magnetic: false,
    casino: false,
    default: false,
    neon: false,
  });

  const toggleState = (key: keyof typeof states) => {
    setStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-casino-dark p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            🍔 Hamburger Animation Showcase
          </h1>
          <p className="text-casino-text-secondary text-lg">
            Professional hamburger menu animations for modern web applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Morphing Hamburger */}
          <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Morphing</h3>
            <p className="text-casino-text-secondary text-sm mb-6">
              Smooth morphing transformation with elegant easing
            </p>
            <div className="flex justify-center mb-4">
              <MorphingHamburger
                isOpen={states.morphing}
                onClick={() => toggleState('morphing')}
                size="lg"
              />
            </div>
            <div className="text-xs text-casino-neon-green">
              ✨ Professional & Smooth
            </div>
          </div>

          {/* Elastic Hamburger */}
          <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Elastic</h3>
            <p className="text-casino-text-secondary text-sm mb-6">
              Bouncy elastic animation with playful character
            </p>
            <div className="flex justify-center mb-4">
              <ElasticHamburger
                isOpen={states.elastic}
                onClick={() => toggleState('elastic')}
                size="lg"
              />
            </div>
            <div className="text-xs text-casino-neon-green">
              🎈 Playful & Bouncy
            </div>
          </div>

          {/* Magnetic Hamburger */}
          <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Magnetic</h3>
            <p className="text-casino-text-secondary text-sm mb-6">
              Magnetic field effect with smooth attraction
            </p>
            <div className="flex justify-center mb-4">
              <MagneticHamburger
                isOpen={states.magnetic}
                onClick={() => toggleState('magnetic')}
                size="lg"
              />
            </div>
            <div className="text-xs text-casino-neon-green">
              🧲 Magnetic & Fluid
            </div>
          </div>

          {/* Casino Hamburger */}
          <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Casino</h3>
            <p className="text-casino-text-secondary text-sm mb-6">
              Perfect for casino themes with neon glow effects
            </p>
            <div className="flex justify-center mb-4">
              <CasinoHamburger
                isOpen={states.casino}
                onClick={() => toggleState('casino')}
                size="lg"
              />
            </div>
            <div className="text-xs text-casino-neon-green">
              🎰 Casino Themed
            </div>
          </div>

          {/* Default Hamburger */}
          <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Default</h3>
            <p className="text-casino-text-secondary text-sm mb-6">
              Classic rotation animation with smooth transitions
            </p>
            <div className="flex justify-center mb-4">
              <AnimatedHamburger
                isOpen={states.default}
                onClick={() => toggleState('default')}
                size="lg"
                variant="casino"
                animationType="rotate"
              />
            </div>
            <div className="text-xs text-casino-neon-green">
              🔄 Classic Rotation
            </div>
          </div>

          {/* Neon Hamburger */}
          <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Neon</h3>
            <p className="text-casino-text-secondary text-sm mb-6">
              Glowing neon effect with pulsing background
            </p>
            <div className="flex justify-center mb-4">
              <AnimatedHamburger
                isOpen={states.neon}
                onClick={() => toggleState('neon')}
                size="lg"
                variant="neon"
                animationType="morph"
              />
            </div>
            <div className="text-xs text-casino-neon-green">
              💫 Neon Glow
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-16 bg-casino-card-bg border border-casino-border-subtle rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Usage Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-casino-neon-green mb-2">Morphing Hamburger</h3>
              <div className="bg-casino-dark rounded-lg p-4 font-mono text-sm text-casino-text-secondary">
                <code>{`<MorphingHamburger
  isOpen={isMenuOpen}
  onClick={toggleMenu}
  size="md"
/>`}</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-casino-neon-green mb-2">Custom Animation</h3>
              <div className="bg-casino-dark rounded-lg p-4 font-mono text-sm text-casino-text-secondary">
                <code>{`<AnimatedHamburger
  isOpen={isMenuOpen}
  onClick={toggleMenu}
  size="lg"
  variant="magnetic"
  animationType="elastic"
/>`}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">✨ Features</h3>
            <ul className="space-y-2 text-casino-text-secondary text-sm">
              <li>• Smooth Framer Motion animations</li>
              <li>• Multiple animation types</li>
              <li>• Casino-themed variants</li>
              <li>• Responsive design</li>
              <li>• Accessibility support</li>
              <li>• TypeScript support</li>
            </ul>
          </div>

          <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">🎯 Best Practices</h3>
            <ul className="space-y-2 text-casino-text-secondary text-sm">
              <li>• Use Morphing for professional sites</li>
              <li>• Use Elastic for playful interfaces</li>
              <li>• Use Magnetic for modern apps</li>
              <li>• Use Casino for gaming themes</li>
              <li>• Consider user preferences</li>
              <li>• Test on mobile devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
