'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Star, Gift, Users, BookOpen, MessageCircle, Newspaper, User, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import AdminButton from '@/src/components/AdminButton';

const SimpleNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // Check if current page is homepage
  const isHomePage = pathname === '/';

  // Ensure client-side rendering for dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Scroll detection for homepage
  useEffect(() => {
    if (!isHomePage) {
      setIsVisible(true); // Always show navbar on non-homepage
      return;
    }

    // Hide navbar initially on homepage (when at top)
    const initialScrollY = window.scrollY;
    setIsVisible(initialScrollY > 50);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar when at very top (within 50px) to show fullscreen banner clearly
      if (currentScrollY <= 50) {
        setIsVisible(false);
      }
      // Show navbar when scrolling down past 50px
      else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        // Scrolling down - show navbar after passing threshold
        setIsVisible(true);
      }
      // Show navbar when scrolling up (regardless of position, as long as not at top)
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
  }, [isHomePage, lastScrollY]);

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

  // Safe display name function
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
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

  return (
    <nav className={`glass-effect border-b border-casino-border-subtle/30 sticky top-0 z-50 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
      isHomePage && !isVisible ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-casino-neon-green via-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-casino-dark" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl text-casino-neon-green font-bold">CGSG</span>
              <span className="text-xs text-casino-neon-green/70 font-medium -mt-1">Casino Guide</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/top-casinos" className="text-white/90 hover:text-casino-neon-green transition-colors font-medium">
              Best Casinos
            </Link>
            <Link href="/casinos" className="text-white/90 hover:text-casino-neon-green transition-colors font-medium">
              Casinos
            </Link>
            <Link href="/reviews" className="text-white/90 hover:text-casino-neon-green transition-colors font-medium">
              Reviews
            </Link>
            <Link href="/list-report" className="text-white/90 hover:text-casino-neon-green transition-colors font-medium">
              List Report
            </Link>
            <Link href="/forum" className="text-white/90 hover:text-casino-neon-green transition-colors font-medium">
              Forum
            </Link>
            <Link href="/guide" className="text-white/90 hover:text-casino-neon-green transition-colors font-medium">
              Guide
            </Link>
            <Link href="/news" className="text-white/90 hover:text-casino-neon-green transition-colors font-medium">
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
                        {user.email && typeof user.email === 'string' ? user.email.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {getDisplayName()}
                    </span>
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
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-casino-dark/95 border-t border-casino-neon-green/30 absolute left-0 right-0 top-full w-full">
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
                          {user.email && typeof user.email === 'string' ? user.email.charAt(0).toUpperCase() : 'U'}
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
                      <AdminButton
                        variant="mobile"
                        onClick={() => setMobileMenuOpen(false)}
                      />
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
