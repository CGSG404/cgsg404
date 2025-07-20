'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPrefs = JSON.parse(consent);
        setPreferences(savedPrefs);
        applyCookieSettings(savedPrefs);
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const applyCookieSettings = (prefs: CookiePreferences) => {
    // Set cookies based on preferences
    if (prefs.necessary) {
      // Essential cookies for authentication and basic functionality
      document.cookie = 'sb-access-token=; path=/; secure; samesite=lax';
      document.cookie = 'sb-refresh-token=; path=/; secure; samesite=lax';
    }

    if (prefs.functional) {
      // Functional cookies for enhanced user experience
      document.cookie = 'user-preferences=; path=/; secure; samesite=lax';
      document.cookie = 'theme-preference=; path=/; secure; samesite=lax';
    }

    if (prefs.analytics) {
      // Analytics cookies (if you add Google Analytics later)
      console.log('Analytics cookies enabled');
    }

    if (prefs.marketing) {
      // Marketing cookies (if you add marketing tools later)
      console.log('Marketing cookies enabled');
    }

    // Store preferences
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    applyCookieSettings(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(necessaryOnly);
    applyCookieSettings(necessaryOnly);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    applyCookieSettings(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <Card className="bg-casino-dark/95 backdrop-blur-sm border-casino-border-subtle shadow-2xl">
          <CardContent className="p-6">
            {!showSettings ? (
              // Main banner
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Cookie className="h-8 w-8 text-casino-neon-green flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      🍪 We use cookies to enhance your experience
                    </h3>
                    <p className="text-gray-300 text-sm">
                      We use essential cookies for authentication and optional cookies to improve your experience. 
                      You can customize your preferences or accept all cookies.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    size="sm"
                    className="border-casino-border-subtle text-white hover:bg-casino-dark/50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                  <Button
                    onClick={handleAcceptNecessary}
                    variant="outline"
                    size="sm"
                    className="border-casino-border-subtle text-white hover:bg-casino-dark/50"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            ) : (
              // Settings panel
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-casino-neon-green" />
                    Cookie Preferences
                  </h3>
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-center justify-between p-3 bg-casino-dark/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Necessary Cookies</h4>
                      <p className="text-sm text-gray-400">Required for authentication and basic functionality</p>
                    </div>
                    <div className="text-casino-neon-green font-medium">Always Active</div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-center justify-between p-3 bg-casino-dark/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Functional Cookies</h4>
                      <p className="text-sm text-gray-400">Remember your preferences and settings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={() => togglePreference('functional')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-casino-neon-green"></div>
                    </label>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between p-3 bg-casino-dark/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Analytics Cookies</h4>
                      <p className="text-sm text-gray-400">Help us understand how you use our website</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => togglePreference('analytics')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-casino-neon-green"></div>
                    </label>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between p-3 bg-casino-dark/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Marketing Cookies</h4>
                      <p className="text-sm text-gray-400">Used to deliver relevant advertisements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => togglePreference('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-casino-neon-green"></div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    variant="outline"
                    className="border-casino-border-subtle text-white hover:bg-casino-dark/50"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
