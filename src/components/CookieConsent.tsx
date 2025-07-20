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
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    
    // Apply preferences
    if (prefs.analytics) {
      // Enable analytics
      console.log('🍪 Analytics cookies enabled');
    }
    if (prefs.marketing) {
      // Enable marketing
      console.log('🍪 Marketing cookies enabled');
    }
    if (prefs.functional) {
      // Enable functional
      console.log('🍪 Functional cookies enabled');
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(necessaryOnly);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <Card className="bg-casino-dark/95 backdrop-blur-lg border-casino-neon-green/20 shadow-2xl">
            <CardContent className="p-6">
              {!showSettings ? (
                // Main banner
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Cookie className="w-8 h-8 text-casino-neon-green flex-shrink-0" />
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">🍪 Cookie Preferences</h3>
                      <p className="text-gray-300 text-sm">
                        We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                        Choose your preferences or accept all to continue.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(true)}
                      className="border-casino-neon-green/30 text-casino-neon-green hover:bg-casino-neon-green/10"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                    <Button
                      variant="outline"
                      onClick={acceptNecessary}
                      className="border-gray-500 text-gray-300 hover:bg-gray-700"
                    >
                      Necessary Only
                    </Button>
                    <Button
                      onClick={acceptAll}
                      className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold"
                    >
                      Accept All
                    </Button>
                  </div>
                </div>
              ) : (
                // Settings panel
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Shield className="w-6 h-6 text-casino-neon-green" />
                      Cookie Settings
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Necessary Cookies */}
                    <div className="flex items-center justify-between p-4 bg-casino-dark/50 rounded-lg border border-casino-neon-green/20">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">Necessary Cookies</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Essential for the website to function properly. Cannot be disabled.
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-12 h-6 bg-casino-neon-green rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-casino-dark rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Functional Cookies */}
                    <div className="flex items-center justify-between p-4 bg-casino-dark/30 rounded-lg border border-gray-600">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">Functional Cookies</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Enable enhanced functionality like live chat and personalized content.
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => updatePreference('functional', !preferences.functional)}
                          className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                            preferences.functional 
                              ? 'bg-casino-neon-green justify-end' 
                              : 'bg-gray-600 justify-start'
                          } px-1`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </button>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-center justify-between p-4 bg-casino-dark/30 rounded-lg border border-gray-600">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">Analytics Cookies</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Help us understand how visitors interact with our website.
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => updatePreference('analytics', !preferences.analytics)}
                          className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                            preferences.analytics 
                              ? 'bg-casino-neon-green justify-end' 
                              : 'bg-gray-600 justify-start'
                          } px-1`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </button>
                      </div>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-center justify-between p-4 bg-casino-dark/30 rounded-lg border border-gray-600">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">Marketing Cookies</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Used to deliver relevant advertisements and track campaign performance.
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => updatePreference('marketing', !preferences.marketing)}
                          className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                            preferences.marketing 
                              ? 'bg-casino-neon-green justify-end' 
                              : 'bg-gray-600 justify-start'
                          } px-1`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={acceptNecessary}
                      className="border-gray-500 text-gray-300 hover:bg-gray-700 flex-1"
                    >
                      Save Necessary Only
                    </Button>
                    <Button
                      onClick={() => savePreferences(preferences)}
                      className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold flex-1"
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
