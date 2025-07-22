'use client';

import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Star, User, LogOut, Menu, X, Home, Gamepad2, Book, List, MessageCircle, Compass, Newspaper, Shield, FileText } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext'; // ✅ RE-ENABLED: Fixed double providers
import { useAdmin } from '@/src/contexts/AdminContext'; // 🔧 ADD: Admin context for admin button
import SimpleAuthButton from '@/src/components/SimpleAuthButton';
import SessionFixButton from '@/src/components/SessionFixButton'; // 🚀 PRODUCTION FIX
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

  // 🔧 DEBUG: Log admin status for troubleshooting
  console.log('🔍 Navbar: Admin status:', {
    isAdmin,
    adminInfo,
    adminLoading,
    user: user?.email,
    userLoading: loading
  });

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

  // Debug logging
  useEffect(() => {
    console.log('🔍 Navbar - Auth state:', {
      user: user ? `${user.email} (${user.id})` : 'null',
      loading
    });
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
                    console.log('🔧 Admin button clicked, navigating to /admin');
                    router.push('/admin');
                  }}
                  className="border-casino-neon-purple hover:bg-casino-neon-purple/10 text-casino-neon-purple hover:text-casino-neon-purple"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}

              {/* 🔧 DEBUG: Show admin status for troubleshooting */}
              {process.env.NODE_ENV === 'development' && user && (
                <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  Admin: {isAdmin ? '✅' : '❌'} | Loading: {adminLoading ? '⏳' : '✅'}
                </div>
              )}

              {/* 🚀 PRODUCTION FIX: Session Fix Button (only show if there are auth issues) */}
              {user && !isAdmin && process.env.NODE_ENV === 'production' && (
                <SessionFixButton
                  variant="ghost"
                  size="sm"
                  className="text-yellow-400 hover:text-yellow-300"
                />
              )}
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 relative"
              >
                <Button variant="ghost" size="icon">
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
              </button>
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

        {/* Mobile Menu Button */}
        <button
          className="flex md:hidden items-center justify-center p-2 rounded hover:bg-casino-neon-green/10 transition-colors"
          onClick={() => mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true)}
        >
          {mobileMenuOpen ? (
            <X className="w-7 h-7 text-casino-neon-green" />
          ) : (
            <Menu className="w-7 h-7 text-casino-neon-green" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-16 right-0 bottom-0 left-0 z-[200] flex justify-end">
          {/* Backdrop - only covers area below top bar */}
          <div
            className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ease-out ${
              isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={closeMobileMenu}
          />
          {/* Drawer - positioned below top bar */}
          <div className={`relative w-80 h-full bg-casino-card-bg text-white flex flex-col shadow-2xl border-l border-casino-neon-green/20 ${
            isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
          }`}>
            {/* Header with Brand Section */}
            <div className="bg-casino-card-bg border-b border-casino-border-subtle p-4 flex-shrink-0 shadow-lg shadow-casino-border-subtle/30">
              <div className="flex items-center gap-3 mb-4">
                {/* Brand Section */}
                <div className="w-10 h-10 bg-gradient-to-br from-casino-neon-green/30 to-casino-neon-blue/30 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-5 h-5 text-casino-neon-green" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">CGSG Casino Guide</h2>
                  <p className="text-xs text-casino-neon-green/80">Your trusted casino companion</p>
                </div>
              </div>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-b border-casino-border-subtle bg-casino-card-bg flex-shrink-0 shadow-md shadow-casino-border-subtle/20">
              {user ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-casino-card-bg/30 border border-casino-neon-green/20">
                  <Avatar className="w-10 h-10 border-2 border-casino-neon-green/30">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-casino-neon-green/20 text-casino-neon-green font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/20 transition-colors border border-transparent hover:border-red-500/30"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-3 rounded-lg bg-casino-card-bg/30 border border-casino-neon-green/20">
                    <User className="w-8 h-8 text-casino-neon-green mx-auto mb-2" />
                    <p className="text-sm text-gray-300 mb-3">Sign in to access exclusive features</p>
                    <SimpleAuthButton
                      className="w-full bg-casino-neon-green hover:bg-casino-neon-green/80 text-black font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-casino-neon-green/30 hover:border-casino-neon-green"
                      onClick={closeMobileMenu}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search Bar */}
            <div className="p-4 border-b border-casino-border-subtle bg-casino-card-bg flex-shrink-0 shadow-md shadow-casino-border-subtle/20">
              <EnhancedSearchBar
                className="w-full"
                placeholder="Search casinos, games..."
              />
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 bg-gradient-to-b from-slate-800/30 to-slate-900/50 overflow-y-auto">
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-casino-neon-green/80 uppercase tracking-wider mb-3 px-3">
                  Main Navigation
                </h4>
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors">
                      <Home className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <span className="group-hover:text-casino-neon-green transition-colors">Home</span>
                  </Link>
                  <Link
                    href="/casinos"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors">
                      <Gamepad2 className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <span className="group-hover:text-casino-neon-green transition-colors">Casinos</span>
                    <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded-full">Hot</span>
                  </Link>
                  <Link
                    href="/games"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors">
                      <Star className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <span className="group-hover:text-casino-neon-green transition-colors">Top Casinos</span>
                  </Link>
                  <Link
                    href="/reviews"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors">
                      <Book className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <span className="group-hover:text-casino-neon-green transition-colors">Reviews</span>
                  </Link>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-casino-neon-green/80 uppercase tracking-wider mb-3 px-3">
                  Community
                </h4>
                <div className="space-y-1">
                  <Link
                    href="/forum"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors">
                      <MessageCircle className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <span className="group-hover:text-casino-neon-green transition-colors">Forum</span>
                    <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded-full">New</span>
                  </Link>
                  <Link
                    href="/list-report"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors">
                      <List className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <span className="group-hover:text-casino-neon-green transition-colors">List Report</span>
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-casino-neon-green/80 uppercase tracking-wider mb-3 px-3">
                  Resources
                </h4>
                <div className="space-y-1">
                  <Link
                    href="/guide"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors">
                      <Compass className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <span className="group-hover:text-casino-neon-green transition-colors">Guide</span>
                  </Link>
                  <Link
                    href="/news"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-casino-neon-green/10 hover:border-casino-neon-green/30 transition-all duration-200 font-medium border border-transparent group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-casino-neon-green/10 flex items-center justify-center group-hover:bg-casino-neon-green/20 transition-colors">
                      <Newspaper className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <span className="group-hover:text-casino-neon-green transition-colors">News</span>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Footer - Legal Links */}
            <div className="p-4 border-t border-casino-border-subtle bg-casino-card-bg flex-shrink-0 shadow-lg shadow-casino-border-subtle/30">
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/privacy-policy"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-casino-neon-green/10 hover:text-casino-neon-green transition-all duration-200 text-sm border border-transparent hover:border-casino-neon-green/30"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-600/50 flex items-center justify-center">
                      <Shield className="w-3 h-3 text-gray-400" />
                    </div>
                    <span>Privacy Policy</span>
                  </Link>
                  <Link
                    href="/terms-of-service"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-casino-neon-green/10 hover:text-casino-neon-green transition-all duration-200 text-sm border border-transparent hover:border-casino-neon-green/30"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-600/50 flex items-center justify-center">
                      <FileText className="w-3 h-3 text-gray-400" />
                    </div>
                    <span>Terms of Service</span>
                  </Link>
                </div>
                <div className="text-center pt-2 border-t border-casino-border-subtle/50 shadow-sm shadow-casino-border-subtle/10">
                  <p className="text-xs text-gray-500">
                    © 2024 CGSG Casino Guide. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
