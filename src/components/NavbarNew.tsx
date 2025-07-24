'use client';

import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Star, User, LogOut, Search, Home, Gamepad2, Book, Shield, List, MessageCircle, Compass, Newspaper, FileText } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import SimpleAuthButton from '@/src/components/SimpleAuthButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import EnhancedSearchBar from '@/src/components/EnhancedSearchBar';

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const router = useRouter();

  // Mobile menu functions
  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const toggleMobileMenu = () => {
    mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
    if (!showMobileSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeMobileSearch = () => {
    setShowMobileSearch(false);
    document.body.style.overflow = 'auto';
  };

  // Handle body scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showMobileSearch) {
          closeMobileSearch();
        } else if (mobileMenuOpen) {
          closeMobileMenu();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMobileSearch, mobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      setShowProfile(false);
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="bg-casino-card-bg border-b border-casino-border-subtle sticky top-0 z-50 w-full shadow-lg">
      <div className="w-full flex items-center justify-between h-16 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-casino-dark" />
          </div>
          <span className="text-xl gradient-text font-normal">CGSG</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <EnhancedSearchBar />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {/* Admin Button */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="bg-casino-neon-green/10 border-casino-neon-green/30 text-casino-neon-green hover:bg-casino-neon-green/20 hover:border-casino-neon-green/50 transition-all duration-200"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}

          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 hover:bg-casino-neon-green/10"
                disabled={loading}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-casino-neon-green text-casino-dark text-sm font-semibold">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-medium hidden lg:block">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </Button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-casino-card-bg border border-casino-border-subtle rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <SimpleAuthButton
              className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-black font-semibold py-2 px-6 rounded-lg"
              customText="Sign In"
            />
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileSearch}
            className="text-casino-neon-green hover:bg-casino-neon-green/10"
          >
            <Search className="w-5 h-5" />
          </Button>

          <motion.div
            className="relative cursor-pointer p-2 rounded-lg"
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 h-5 relative flex flex-col justify-center">
              <motion.div
                className="h-0.5 bg-casino-neon-green rounded-full absolute"
                animate={{
                  rotate: mobileMenuOpen ? 45 : 0,
                  y: mobileMenuOpen ? 0 : -8,
                  width: 24,
                }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: 'center' }}
              />
              <motion.div
                className="h-0.5 bg-casino-neon-green rounded-full absolute"
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  scale: mobileMenuOpen ? 0.8 : 1,
                }}
                transition={{ duration: 0.2 }}
                style={{ width: '20px' }}
              />
              <motion.div
                className="h-0.5 bg-casino-neon-green rounded-full absolute"
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? 0 : 8,
                  width: mobileMenuOpen ? 24 : 16,
                }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: 'center' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed top-16 right-0 bottom-0 left-0 z-[100] flex justify-end md:hidden">
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="relative w-[70vw] max-w-[300px] min-w-[240px] h-full bg-gradient-to-b from-casino-card-bg to-casino-card-bg/95 text-white flex flex-col shadow-2xl border-l border-casino-neon-green/30"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header dengan User Info */}
              <div className="flex-shrink-0 p-4 border-b border-casino-border-subtle/50">
                {user ? (
                  <div className="flex items-center justify-between p-3 bg-casino-neon-green/5 rounded-lg border border-casino-neon-green/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-casino-neon-green text-casino-dark text-sm font-semibold">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
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
                          handleSignOut();
                          closeMobileMenu();
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors border border-transparent hover:border-red-500/30"
                        title="Sign Out"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                      </button>
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

              {/* Navigation Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  {/* Main Navigation */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
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

                  {/* Community Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
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

                  {/* Admin Section */}
                  {isAdmin && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider px-1">
                        Admin Panel
                      </h4>
                      <div className="space-y-1">
                        <Link
                          href="/admin"
                          onClick={closeMobileMenu}
                          className="flex items-center justify-end gap-2 pl-0 pr-1 py-2.5 rounded-lg text-white hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200 font-medium border border-transparent group"
                        >
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full flex-shrink-0">Admin</span>
                          <span className="group-hover:text-red-400 transition-colors">Dashboard</span>
                          <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors flex-shrink-0">
                            <Shield className="w-4 h-4 text-red-400" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Resources Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
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
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex-shrink-0 p-4 border-t border-casino-border-subtle/50">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileSearch}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 bg-casino-dark/95 backdrop-blur-md border-b border-casino-neon-green/30 shadow-lg md:hidden"
            >
              <div className="p-4">
                <EnhancedSearchBar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
