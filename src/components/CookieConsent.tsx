'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/src/lib/supabaseClient';
import { useAuth } from '@/src/contexts/AuthContext';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    functional: false,
    analytics: false,
    marketing: false,
  });

  // Check if current page is homepage
  const isHomePage = pathname === '/';

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        if (user) {
          // For logged-in users, try to load from Supabase
          const { data, error } = await supabase
            .from('user_preferences')
            .select('cookie_preferences')
            .eq('user_id', user.id)
            .single();

          if (!error && data?.cookie_preferences) {
            setPreferences(data.cookie_preferences);
            return;
          }
        }

        // Fallback to localStorage for cookie consent (GDPR compliance requirement)
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
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
        // Fallback to localStorage
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
          const timer = setTimeout(() => setShowBanner(true), 1000);
          return () => clearTimeout(timer);
        }
      }
    };

    loadPreferences();
  }, [user]);

  // Scroll detection for homepage - same logic as navbar
  useEffect(() => {
    if (!isHomePage || !showBanner) {
      setIsVisible(true); // Always show on non-homepage or when banner not shown
      return;
    }

    // Hide cookie banner initially on homepage (when at top)
    const initialScrollY = window.scrollY;
    setIsVisible(initialScrollY > 50);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide cookie banner when at very top (within 50px) to show fullscreen banner clearly
      if (currentScrollY <= 50) {
        setIsVisible(false);
      }
      // Show cookie banner when scrolling down past 50px
      else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        // Scrolling down - show cookie banner after passing threshold
        setIsVisible(true);
      }
      // Show cookie banner when scrolling up (regardless of position, as long as not at top)
      else if (currentScrollY > 50 && currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [isHomePage, lastScrollY, showBanner]);

  const savePreferences = async (prefs: CookiePreferences) => {
    try {
      // Always save to localStorage for GDPR compliance
      localStorage.setItem('cookie-consent', JSON.stringify(prefs));
      
      // If user is logged in, also save to Supabase
      if (user) {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            cookie_preferences: prefs,
            updated_at: new Date().toISOString()
          });
      }

      setPreferences(prefs);
      setShowBanner(false);
      setShowSettings(false);
      
      // Apply preferences
      if (prefs.analytics) {
        console.log('🍪 Analytics cookies enabled');
      }
      if (prefs.marketing) {
        console.log('🍪 Marketing cookies enabled');
      }
      if (prefs.functional) {
        console.log('🍪 Functional cookies enabled');
      }
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
      // Still save to localStorage as fallback
      localStorage.setItem('cookie-consent', JSON.stringify(prefs));
      setPreferences(prefs);
      setShowBanner(false);
      setShowSettings(false);
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
          animate={{
            y: 0,
            opacity: 1,
            // Apply visibility logic for homepage
            transform: isHomePage && !isVisible ? 'translateY(100%)' : 'translateY(0)'
          }}
          exit={{ y: 100, opacity: 0 }}
          className={`fixed bottom-0 left-0 right-0 z-40 p-4 transition-transform duration-300 ease-in-out ${
            isHomePage && !isVisible ? 'translate-y-full' : 'translate-y-0'
          }`}
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
