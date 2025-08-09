'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, Shield, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface ModernToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  label: string;
}

const ModernToggle: React.FC<ModernToggleProps> = ({ enabled, onChange, disabled = false, label }) => {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      className={`
        relative inline-flex h-8 w-16 items-center justify-center rounded-full transition-all duration-300 ease-in-out
        ${enabled 
          ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/30' 
          : 'bg-gray-500 hover:bg-gray-400'
        }
        ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-105'}
        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-1 focus:ring-offset-casino-dark
        border-2 border-white/20
      `}
      aria-label={`Toggle ${label}`}
      disabled={disabled}
    >
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold text-white">
        <span className={`transition-opacity duration-300 ${enabled ? 'opacity-100' : 'opacity-50'}`}>ON</span>
        <span className={`transition-opacity duration-300 ${!enabled ? 'opacity-100' : 'opacity-50'}`}>OFF</span>
      </div>
      
      {/* Moving circle */}
      <span
        className={`
          absolute inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-300 ease-in-out
          shadow-lg z-10 left-1
          ${enabled ? 'translate-x-8' : 'translate-x-0'}
          ${!disabled && 'hover:scale-110'}
        `}
      />
    </button>
  );
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
        setIsVisible(true);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setIsVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(necessaryOnly);
    savePreferences(necessaryOnly);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-2 left-2 right-2 z-50 max-w-sm mx-auto lg:max-w-2xl lg:left-auto lg:right-4 lg:mx-0"
        >
          <Card className="bg-casino-dark/95 backdrop-blur-xl border-casino-neon-green/20 shadow-2xl overflow-hidden">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {!showSettings ? (
                // Main banner
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="p-1.5 bg-casino-neon-green/10 rounded-full">
                      <Cookie className="w-5 h-5 text-casino-neon-green" />
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold text-base mb-0.5">Cookie Preferences</h3>
                      <p className="text-gray-300 text-xs leading-tight">
                        We use cookies to enhance your experience and analyze site traffic.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettings(true)}
                      className="border-casino-neon-green/30 text-casino-neon-green hover:bg-casino-neon-green/10 transition-all duration-300"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Customize
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={acceptNecessary}
                      className="border-gray-500 text-gray-300 hover:bg-gray-700 transition-all duration-300"
                    >
                      Necessary Only
                    </Button>
                    <Button
                      size="sm"
                      onClick={acceptAll}
                      className="bg-gradient-to-r from-casino-neon-green to-green-400 text-casino-dark hover:from-green-400 hover:to-casino-neon-green font-semibold transition-all duration-300 shadow-lg hover:shadow-casino-neon-green/30"
                    >
                      Accept All
                    </Button>
                  </div>
                </div>
              ) : (
                // Settings panel
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <div className="p-1 bg-casino-neon-green/10 rounded-full">
                        <Shield className="w-4 h-4 text-casino-neon-green" />
                      </div>
                      Cookie Settings
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {/* Necessary Cookies */}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-casino-neon-green/10 to-green-400/5 rounded-lg border border-casino-neon-green/20">
                      <div className="flex-1 pr-3">
                        <h4 className="font-semibold text-white text-sm mb-0.5">Necessary Cookies</h4>
                        <p className="text-xs text-gray-400 leading-tight">
                          Essential for the website to function properly. Cannot be disabled.
                        </p>
                      </div>
                      <ModernToggle
                        enabled={preferences.necessary}
                        onChange={() => {}}
                        disabled={true}
                        label="Necessary Cookies"
                      />
                    </div>

                    {/* Functional Cookies */}
                    <div className="flex items-center justify-between p-3 bg-casino-dark/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                      <div className="flex-1 pr-3">
                        <h4 className="font-semibold text-white text-sm mb-0.5">Functional Cookies</h4>
                        <p className="text-xs text-gray-400 leading-tight">
                          Enable enhanced functionality like live chat and personalized content.
                        </p>
                      </div>
                      <ModernToggle
                        enabled={preferences.functional}
                        onChange={(value) => updatePreference('functional', value)}
                        label="Functional Cookies"
                      />
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-center justify-between p-3 bg-casino-dark/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                      <div className="flex-1 pr-3">
                        <h4 className="font-semibold text-white text-sm mb-0.5">Analytics Cookies</h4>
                        <p className="text-xs text-gray-400 leading-tight">
                          Help us understand how visitors interact with our website.
                        </p>
                      </div>
                      <ModernToggle
                        enabled={preferences.analytics}
                        onChange={(value) => updatePreference('analytics', value)}
                        label="Analytics Cookies"
                      />
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-center justify-between p-3 bg-casino-dark/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                      <div className="flex-1 pr-3">
                        <h4 className="font-semibold text-white text-sm mb-0.5">Marketing Cookies</h4>
                        <p className="text-xs text-gray-400 leading-tight">
                          Used to deliver relevant advertisements and track campaign performance.
                        </p>
                      </div>
                      <ModernToggle
                        enabled={preferences.marketing}
                        onChange={(value) => updatePreference('marketing', value)}
                        label="Marketing Cookies"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-600/30">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={acceptNecessary}
                      className="border-gray-500 text-gray-300 hover:bg-gray-700 flex-1 transition-all duration-300"
                    >
                      Save Necessary Only
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => savePreferences(preferences)}
                      className="bg-gradient-to-r from-casino-neon-green to-green-400 text-casino-dark hover:from-green-400 hover:to-casino-neon-green font-semibold flex-1 transition-all duration-300 shadow-lg hover:shadow-casino-neon-green/30"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}