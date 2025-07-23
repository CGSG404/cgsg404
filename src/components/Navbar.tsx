'use client';

import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Star, User, LogOut, Home, Gamepad2, Book, List, MessageCircle, Compass, Newspaper, Shield, FileText, X } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext'; // ✅ RE-ENABLED: Fixed double providers
import { useAdmin } from '@/src/contexts/AdminContext'; // 🔧 ADD: Admin context for admin button
import SimpleAuthButton from '@/src/components/SimpleAuthButton';
// Removed hamburger imports - using professional text-based menu button

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import EnhancedSearchBar from '@/src/components/EnhancedSearchBar';

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { user, signOut, signInWithGoogle, loading } = useAuth(); // ✅ RE-ENABLED: Fixed double providers
  const { isAdmin, adminInfo, isLoading: adminLoading } = useAdmin(); // 🔧 ADD: Get admin status
  const router = useRouter();

  // 🔧 DEBUG: Log admin status for troubleshooting (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Navbar: Admin status:', {
      isAdmin,
      adminInfo,
      adminLoading,
      user: user?.email,
      userLoading: loading
    });
  }

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
      // Force reflow to ensure initial state is applied before animation
      requestAnimationFrame(() => {
        setIsClosing(false);
      });
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true);
  };

  // Auto-close mobile menu when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      // Immediate close when switching to desktop
      if (window.innerWidth >= 768) { // md breakpoint
        if (mobileMenuOpen) {
          console.log('🔧 Navbar: Auto-closing mobile menu on desktop resize');
          closeMobileMenu();
        }
      }
    };

    const handleOrientationChange = () => {
      // Small delay to allow orientation change to complete
      setTimeout(handleResize, 100);
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [mobileMenuOpen]);

  // Debug logging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Navbar - Auth state:', {
        user: user ? `${user.email} (${user.id})` : 'null',
        loading
      });
    }
  }, [user, loading]);

  if (loading) {
    return (
      <nav className="bg-casino-dark border-b border-casino-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { name: 'Casinos', href: '/casinos' },
    { name: 'Top Casinos', href: '/games' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'List Report', href: '/list-report' },
    { name: 'Forum', href: '/forum' },
    { name: 'Guide', href: '/guide' },
    { name: 'News', href: '/news' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      
      // Clear any stored session data
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
      
      toast.success('Signed out successfully');
      router.push('/');
      
      // Force page reload to clear all states
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error instanceof Error ? error.message : 'Error signing out');
    }
  };

  const handleProfileClick = async () => {
    if (!user) {
      toast.error('Please sign in to view your profile');
      router.push(`/signin?from=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setShowProfile(false);
    setIsNavigating(true);
    
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (data && data.username) {
        router.push(`/profile/${data.username}`);
      } else {
        toast.error('Profile data not found');
      }
    } catch (error) {
      console.error('Profile navigation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <nav className="bg-casino-card-bg border-b border-casino-border-subtle sticky top-0 z-50 w-full shadow-lg shadow-casino-border-subtle/20">
      <div className="w-full flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-casino-dark" />
          </div>
          <span className="text-xl gradient-text font-normal">CGSG</span>
        </Link>

        {/* Search Bar (desktop only) */}
        <div className="flex-1 justify-center px-4 hidden md:flex">
          <EnhancedSearchBar
            className="w-full max-w-md"
            placeholder="Search casinos, games, reviews..."
          />
        </div>

        {/* User Actions (desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* 🔧 FIXED: Admin Button with proper navigation and debug */}
              {isAdmin && !adminLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('🔧 Admin button clicked, navigating to /admin');
                    }
                    router.push('/admin');
                  }}
                  className="border-casino-neon-purple hover:bg-casino-neon-purple/10 text-casino-neon-purple hover:text-casino-neon-purple"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}

              {/* 🔧 DEBUG: Show admin status for troubleshooting (development only) */}
              {process.env.NODE_ENV === 'development' && user && (
                <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  Admin: {isAdmin ? '✅' : '❌'} | Loading: {adminLoading ? '⏳' : '✅'}
                </div>
              )}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2"
                >
                  {user?.user_metadata?.avatar_url ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || 'User'} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 top-12 z-50 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-casino-border-subtle hover:bg-casino-dark text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* 🔧 FIXED: Single Sign In button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/signin')}
                className="border-casino-border-subtle hover:bg-casino-dark text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Actions - Direct Implementation without Button Containers */}
        <div className="flex md:hidden items-center gap-4">
          {/* Professional Hamburger Menu - Direct Implementation */}
          <div
            className="relative cursor-pointer p-2 focus:outline-none"
            onClick={toggleMobileMenu}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
              }
            }}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {/* Professional Hamburger Lines */}
            <div className="w-6 h-5 flex flex-col justify-between">
              {/* Top Line */}
              <div
                className={`h-0.5 bg-casino-neon-green rounded-full transition-all duration-300 ease-in-out origin-center ${
                  mobileMenuOpen
                    ? 'rotate-45 translate-y-2 w-6'
                    : 'rotate-0 translate-y-0 w-6'
                }`}
              />

              {/* Middle Line */}
              <div
                className={`h-0.5 bg-casino-neon-green rounded-full transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? 'opacity-0 scale-0'
                    : 'opacity-100 scale-100 w-5'
                }`}
              />

              {/* Bottom Line */}
              <div
                className={`h-0.5 bg-casino-neon-green rounded-full transition-all duration-300 ease-in-out origin-center ${
                  mobileMenuOpen
                    ? '-rotate-45 -translate-y-2 w-6'
                    : 'rotate-0 translate-y-0 w-4'
                }`}
              />
            </div>

            {/* Professional Glow Effect */}
            {mobileMenuOpen && (
              <div className="absolute inset-0 rounded-lg bg-casino-neon-green/10 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-16 right-0 bottom-0 left-0 z-[100] flex justify-end md:hidden">
          {/* Synchronized Backdrop - matches hamburger timing */}
          <div
            className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300 ease-in-out ${
              isClosing ? 'opacity-0 backdrop-blur-none' : 'opacity-100 backdrop-blur-sm'
            }`}
            onClick={closeMobileMenu}
          />
          {/* Synchronized Drawer - matches hamburger animation exactly */}
          <div className={`relative w-[70vw] max-w-[300px] min-w-[240px] h-full bg-gradient-to-b from-casino-card-bg to-casino-card-bg/95 text-white flex flex-col shadow-2xl border-l border-casino-neon-green/30 md:hidden ${
            isClosing ? 'drawer-slide-out' : 'drawer-slide-in'
          }`}>
            {/* Header - REMOVED: Brand section moved to navbar */}

            {/* User Profile Section - Synchronized fade animation */}
            <div className={`pl-1 pr-2 py-2 border-b border-casino-border-subtle bg-casino-card-bg flex-shrink-0 ${
              isClosing ? 'sidebar-fade-out sidebar-content-1' : 'sidebar-fade-in sidebar-content-1'
            }`}>
              {user ? (
                <div className="space-y-2">
                  {/* Profile Actions Row */}
                  <div className="flex items-center justify-end gap-1 p-1 rounded-lg bg-casino-card-bg/30 border border-casino-neon-green/20">
                    <div className="flex items-center gap-2 flex-1 justify-end pr-1">
                      <div className="text-right min-w-0">
                        <div className="flex items-center gap-1 justify-end">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <p className="text-sm font-medium text-white">Online</p>
                        </div>
                      </div>
                      <Avatar className="w-9 h-9 border-2 border-casino-neon-green/30 flex-shrink-0">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-casino-neon-green/20 text-casino-neon-green font-semibold text-xs">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={closeMobileMenu}
                        className="p-1.5 rounded-lg hover:bg-casino-neon-green/10 transition-colors border border-transparent hover:border-casino-neon-green/30"
                        title="View Profile"
                      >
                        <User className="w-3.5 h-3.5 text-casino-neon-green" />
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          closeMobileMenu();
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors border border-transparent hover:border-red-500/30"
                        title="Sign Out"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Greeting Text Row */}
                  <div className="text-right pr-1">
                    <p className="text-sm text-casino-neon-green/80 font-medium">
                      Hi, <span className="text-white font-semibold">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end pr-1">
                  <SimpleAuthButton
                    className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-black font-semibold py-2 px-6 rounded-lg transition-all duration-200 border border-casino-neon-green/30 hover:border-casino-neon-green text-sm"
                    onClick={closeMobileMenu}
                    customText="Sign In"
                  />
                </div>
              )}
            </div>



            {/* Navigation - Synchronized fade animation */}
            <nav className={`flex-1 pl-1 pr-2 py-3 space-y-1 bg-gradient-to-b from-slate-800/30 to-slate-900/50 overflow-y-auto ${
              isClosing ? 'sidebar-fade-out sidebar-content-2' : 'sidebar-fade-in sidebar-content-2'
            }`}>
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-casino-neon-green/80 uppercase tracking-wider mb-2 text-right pr-1">
                  Main Navigation
                </h4>
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2.5 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <span className="group-hover:text-casino-neon-green transition-colors">Home</span>
                    <div className="w-7 h-7 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors flex-shrink-0">
                      <Home className="w-4 h-4 text-casino-neon-green" />
                    </div>
                  </Link>
                  <Link
                    href="/casinos"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2.5 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full flex-shrink-0">Hot</span>
                    <span className="group-hover:text-casino-neon-green transition-colors">Casinos</span>
                    <div className="w-7 h-7 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors flex-shrink-0">
                      <Gamepad2 className="w-4 h-4 text-casino-neon-green" />
                    </div>
                  </Link>
                  <Link
                    href="/games"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2.5 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <span className="group-hover:text-casino-neon-green transition-colors">Top Casinos</span>
                    <div className="w-7 h-7 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors flex-shrink-0">
                      <Star className="w-4 h-4 text-casino-neon-green" />
                    </div>
                  </Link>
                  <Link
                    href="/reviews"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2.5 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <span className="group-hover:text-casino-neon-green transition-colors">Reviews</span>
                    <div className="w-7 h-7 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors flex-shrink-0">
                      <Book className="w-4 h-4 text-casino-neon-green" />
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="text-xs font-semibold text-casino-neon-green/80 uppercase tracking-wider mb-2 text-right pr-1">
                  Community
                </h4>
                <div className="space-y-1">
                  <Link
                    href="/forum"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2.5 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full flex-shrink-0">New</span>
                    <span className="group-hover:text-casino-neon-green transition-colors">Forum</span>
                    <div className="w-7 h-7 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-casino-neon-green" />
                    </div>
                  </Link>
                  <Link
                    href="/list-report"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2.5 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <span className="group-hover:text-casino-neon-green transition-colors">List Report</span>
                    <div className="w-7 h-7 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors flex-shrink-0">
                      <List className="w-4 h-4 text-casino-neon-green" />
                    </div>
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-casino-neon-green/80 uppercase tracking-wider mb-2 text-right pr-1">
                  Resources
                </h4>
                <div className="space-y-1">
                  <Link
                    href="/guide"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2.5 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <span className="group-hover:text-casino-neon-green transition-colors">Guide</span>
                    <div className="w-7 h-7 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors flex-shrink-0">
                      <Compass className="w-4 h-4 text-casino-neon-green" />
                    </div>
                  </Link>
                  <Link
                    href="/news"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2.5 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <span className="group-hover:text-casino-neon-green transition-colors">News</span>
                    <div className="w-7 h-7 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors flex-shrink-0">
                      <Newspaper className="w-4 h-4 text-casino-neon-green" />
                    </div>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Footer - Synchronized fade animation */}
            <div className={`pl-1 pr-2 py-2 border-t border-casino-border-subtle bg-casino-card-bg flex-shrink-0 shadow-lg shadow-casino-border-subtle/30 ${
              isClosing ? 'sidebar-fade-out sidebar-content-3' : 'sidebar-fade-in sidebar-content-3'
            }`}>
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-1">
                  <Link
                    href="/privacy-policy"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2 rounded-lg text-gray-300 hover:bg-casino-neon-green/10 hover:text-casino-neon-green transition-all duration-200 text-sm border border-transparent hover:border-casino-neon-green/30"
                  >
                    <span>Privacy Policy</span>
                    <div className="w-5 h-5 rounded-lg bg-slate-600/50 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-3 h-3 text-gray-400" />
                    </div>
                  </Link>
                  <Link
                    href="/terms-of-service"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-end gap-2 pl-0 pr-1 py-2 rounded-lg text-gray-300 hover:bg-casino-neon-green/10 hover:text-casino-neon-green transition-all duration-200 text-sm border border-transparent hover:border-casino-neon-green/30"
                  >
                    <span>Terms of Service</span>
                    <div className="w-5 h-5 rounded-lg bg-slate-600/50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3 h-3 text-gray-400" />
                    </div>
                  </Link>
                </div>
                <div className="text-right pt-2 border-t border-casino-border-subtle/50 pr-1 space-y-1">
                  <p className="text-xs text-gray-500">
                    © 2024 CGSG Casino Guide
                  </p>
                  <p className="text-xs text-gray-500">
                    All rights reserved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay Removed - No longer using search button container */}
    </nav>
  );
};

export default Navbar;
