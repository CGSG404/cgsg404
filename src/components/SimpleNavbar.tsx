'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Star,
  Gift,
  Users,
  BookOpen,
  MessageCircle,
  Newspaper,
  User,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import AdminButton from '@/src/components/AdminButton';

const SimpleNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // Check if current page is homepage
  const isHomePage = pathname === '/';

  // Ensure client-side rendering for dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simplified scroll behavior
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log(`🔍 Navbar: Page changed to ${pathname}, isHomePage: ${isHomePage}`);

    // For non-homepage, always show navbar
    if (!isHomePage) {
      console.log('✅ Setting navbar visible for non-homepage');
      setIsScrolled(true);
      return;
    }

    // For homepage, show navbar when scrolled
    console.log('🏠 Homepage detected, setting up scroll behavior');

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 50; // Simple threshold
      
      setIsScrolled(prev => {
        if (prev !== shouldShow) {
          console.log(`🏠 Scroll: ${scrollY}, shouldShow: ${shouldShow}`);
        }
        return shouldShow;
      });
    };

    // Set initial state for homepage
    setIsScrolled(false);
    console.log('🏠 Homepage initial state: navbar hidden');

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial position after page load
    const timer = setTimeout(() => {
      const currentScrollY = window.scrollY;
      const currentShow = currentScrollY > 50;
      setIsScrolled(currentShow);
      console.log(`🏠 Initial check after load: scrollY=${currentScrollY}, shouldShow=${currentShow}`);
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, isHomePage]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getDisplayName = () => {
    if (user?.email && typeof user.email === 'string') {
      try {
        const emailPart = user.email.split('@')[0];
        return emailPart.charAt(0).toUpperCase() + emailPart.slice(1).replace(/[._]/g, ' ');
      } catch (error) {
        console.error('Error processing email for display name:', error);
        return 'User';
      }
    }
    return 'User';
  };

  // Debug info
  console.log('SimpleNavbar render:', { pathname, isHomePage, isScrolled, isClient });

  return (
    <nav
      className={`glass-effect border-b border-casino-border-subtle/30 ${
        isHomePage ? 'fixed' : 'sticky'
      } top-0 z-navbar backdrop-blur-xl w-full transition-all duration-300 ease-in-out ${
        // Visibility logic: hide on homepage when at top, show when scrolled or on other pages
        isHomePage && !isScrolled
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      } ${
        // Background logic: different styles per page type
        !isHomePage
          ? 'bg-casino-dark/95 shadow-lg' // Non-homepage: always dark background
          : isScrolled
          ? 'bg-casino-dark/95 shadow-xl border-casino-neon-green/20' // Homepage scrolled
          : 'bg-transparent' // Homepage top (hidden anyway)
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-casino-neon-green via-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-casino-dark" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl text-casino-neon-green font-bold">CGSG</span>
              <span className="text-xs text-casino-neon-green/70 font-medium -mt-1">
                Casino Guide
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/top-casinos"
              className="text-white/90 hover:text-casino-neon-green transition-colors font-medium"
            >
              Best Casinos
            </Link>
            <Link
              href="/casinos"
              className="text-white/90 hover:text-casino-neon-green transition-colors font-medium"
            >
              Casinos
            </Link>
            <Link
              href="/reviews"
              className="text-white/90 hover:text-casino-neon-green transition-colors font-medium"
            >
              Reviews
            </Link>
            <Link
              href="/list-report"
              className="text-white/90 hover:text-casino-neon-green transition-colors font-medium"
            >
              List Report
            </Link>
            <Link
              href="/forum"
              className="text-white/90 hover:text-casino-neon-green transition-colors font-medium"
            >
              Forum
            </Link>
            <Link
              href="/guide"
              className="text-white/90 hover:text-casino-neon-green transition-colors font-medium"
            >
              Guide
            </Link>
            <Link
              href="/news"
              className="text-white/90 hover:text-casino-neon-green transition-colors font-medium"
            >
              News
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin Button - Only show for admin users */}
            {isClient && <AdminButton variant="default" />}

            {isClient ? (
              user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-casino-neon-green rounded-full flex items-center justify-center">
                      <span className="text-casino-dark font-semibold text-sm">
                        {user.email && typeof user.email === 'string'
                          ? user.email.charAt(0).toUpperCase()
                          : 'U'}
                      </span>
                    </div>
                    <span className="text-white text-sm font-medium">{getDisplayName()}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link href="/signin">
                  <button className="bg-gradient-to-r from-casino-neon-green to-emerald-500 hover:from-casino-neon-green/90 hover:to-emerald-500/90 text-casino-dark font-semibold px-6 py-2 rounded-xl transition-all duration-300">
                    Sign In
                  </button>
                </Link>
              )
            ) : (
              // Placeholder for SSR to prevent hydration mismatch
              <div className="w-20 h-10 bg-transparent"></div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2.5 text-white/80 hover:text-casino-neon-green hover:bg-casino-neon-green/10 transition-colors rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-casino-dark/95 border-t border-casino-neon-green/30 absolute left-0 right-0 top-full w-full z-mobile-menu">
            <div className="px-6 py-6 space-y-4 max-w-sm mx-auto">
              {/* Navigation Links */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-casino-neon-green/70 uppercase tracking-wider mb-4">
                  Navigation
                </div>

                <Link
                  href="/top-casinos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-white/90 hover:text-white hover:bg-casino-neon-green/10 transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-casino-neon-green/15 mr-3">
                    <Star className="w-4 h-4 text-casino-neon-green" />
                  </div>
                  <span>Best Casinos</span>
                </Link>

                <Link
                  href="/casinos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-white/90 hover:text-white hover:bg-casino-neon-green/10 transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-casino-neon-green/15 mr-3">
                    <Gift className="w-4 h-4 text-casino-neon-green" />
                  </div>
                  <span>Casinos</span>
                </Link>

                <Link
                  href="/forum"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-white/90 hover:text-white hover:bg-casino-neon-green/10 transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-casino-neon-green/15 mr-3">
                    <MessageCircle className="w-4 h-4 text-casino-neon-green" />
                  </div>
                  <span>Forum</span>
                </Link>

                <Link
                  href="/reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-white/90 hover:text-white hover:bg-casino-neon-green/10 transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-casino-neon-green/15 mr-3">
                    <Users className="w-4 h-4 text-casino-neon-green" />
                  </div>
                  <span>Reviews</span>
                </Link>

                <Link
                  href="/list-report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-white/90 hover:text-white hover:bg-casino-neon-green/10 transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-casino-neon-green/15 mr-3">
                    <AlertTriangle className="w-4 h-4 text-casino-neon-green" />
                  </div>
                  <span>List Report</span>
                </Link>

                <Link
                  href="/guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-white/90 hover:text-white hover:bg-casino-neon-green/10 transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-casino-neon-green/15 mr-3">
                    <BookOpen className="w-4 h-4 text-casino-neon-green" />
                  </div>
                  <span>Guide</span>
                </Link>

                <Link
                  href="/news"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-white/90 hover:text-white hover:bg-casino-neon-green/10 transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-casino-neon-green/15 mr-3">
                    <Newspaper className="w-4 h-4 text-casino-neon-green" />
                  </div>
                  <span>News</span>
                </Link>
              </div>

              {/* Account Section */}
              <div className="pt-4 border-t border-casino-neon-green/30">
                <div className="text-xs font-semibold text-casino-neon-green/70 uppercase tracking-wider mb-3">
                  Account
                </div>
                {isClient && user ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-casino-neon-green/10 rounded-lg border border-casino-neon-green/20">
                      <div className="w-10 h-10 bg-casino-neon-green rounded-full flex items-center justify-center">
                        <span className="text-casino-dark font-semibold">
                          {user.email && typeof user.email === 'string'
                            ? user.email.charAt(0).toUpperCase()
                            : 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {getDisplayName()}
                        </p>
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Admin Button - Only show for admin users */}
                    {isClient && (
                      <AdminButton variant="mobile" onClick={() => setMobileMenuOpen(false)} />
                    )}

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : isClient ? (
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full bg-casino-neon-green hover:bg-casino-neon-green/90 text-casino-dark font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Sign In to Continue</span>
                    </button>
                  </Link>
                ) : (
                  // Placeholder for SSR
                  <div className="w-full h-12 bg-transparent"></div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SimpleNavbar;
