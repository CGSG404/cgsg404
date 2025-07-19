'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, User, LogOut, Menu, X, Home, Gamepad2, Book, List, MessageCircle, Compass, Newspaper } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SearchBar from '@/components/SearchBar';

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  if (loading) return null;

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
      const { data, error } = await import('@/integrations/supabase/client').then(module => 
        module.supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()
      );
      
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
    <nav className="bg-casino-card-bg/80 backdrop-blur-md border-b border-casino-border-subtle sticky top-0 z-50 w-full">
      <div className="w-full flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-casino-dark" />
          </div>
          <span className="text-xl gradient-text font-normal">CGSG</span>
        </Link>

        {/* Search Bar (desktop only) */}
        <div className="flex-1 flex justify-center px-4 hidden md:flex">
          <SearchBar 
            className="w-full max-w-md"
            placeholder="Search casinos, games, reviews..."
          />
        </div>

        {/* User Actions (desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
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
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-casino-border-subtle hover:bg-casino-dark text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex md:hidden items-center justify-center p-2 rounded hover:bg-casino-neon-green/10 transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-7 h-7 text-casino-neon-green" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300 ease-out" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          {/* Drawer */}
          <div className="relative w-80 h-screen bg-slate-900 text-white flex flex-col shadow-2xl border-l border-slate-700 animate-slide-in-right">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  Menu
                </h3>
                <button 
                  className="p-2 rounded-lg hover:bg-slate-700 transition-colors" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            
            {/* Mobile Search Bar */}
            <div className="p-6 border-b border-slate-700 bg-slate-800 flex-shrink-0">
              <SearchBar 
                className="w-full"
                placeholder="Search casinos, games..."
              />
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2 bg-slate-900 overflow-y-auto">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-all duration-200 font-medium"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              <Link 
                href="/casinos" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-all duration-200 font-medium"
              >
                <Gamepad2 className="w-5 h-5" />
                Casinos
              </Link>
              <Link 
                href="/games" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-all duration-200 font-medium"
              >
                <Star className="w-5 h-5" />
                Top Casinos
              </Link>
              <Link 
                href="/reviews" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-all duration-200 font-medium"
              >
                <Book className="w-5 h-5" />
                Reviews
              </Link>
              <Link 
                href="/list-report" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-all duration-200 font-medium"
              >
                <List className="w-5 h-5" />
                List Report
              </Link>
              <Link 
                href="/forum" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-all duration-200 font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                Forum
              </Link>
              <Link 
                href="/guide" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-all duration-200 font-medium"
              >
                <Compass className="w-5 h-5" />
                Guide
              </Link>
              <Link 
                href="/news" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-all duration-200 font-medium"
              >
                <Newspaper className="w-5 h-5" />
                News
              </Link>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
