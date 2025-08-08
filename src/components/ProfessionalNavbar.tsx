'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Star,
  Trophy,
  Users,
  BookOpen,
  MessageCircle,
  Newspaper,
  User,
  LogOut,
  AlertTriangle,
  Search,
  ChevronDown,
  Home,
  Shield,
  Gamepad2
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import AdminButton from '@/src/components/AdminButton';

const ProfessionalNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // Check if current page is homepage
  const isHomePage = pathname === '/';

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Scroll behavior for all pages
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldBeScrolled = scrollY > 20;
      
      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

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

  const navigationLinks = [
    { href: '/top-casinos', label: 'Best Casinos', icon: Trophy },
    { href: '/casinos', label: 'Casinos', icon: Gamepad2 },
    { href: '/reviews', label: 'Reviews', icon: Users },
    { href: '/list-report', label: 'Reports', icon: AlertTriangle },
    { href: '/forum', label: 'Forum', icon: MessageCircle },
    { href: '/guide', label: 'Guide', icon: BookOpen },
    { href: '/news', label: 'News', icon: Newspaper },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled || !isHomePage
            ? 'bg-casino-dark/95 backdrop-blur-xl border-b border-casino-neon-green/20 shadow-xl'
            : 'bg-transparent'
        }`}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-casino-neon-green via-green-400 to-emerald-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  <Star className="w-6 h-6 text-casino-dark" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-casino-neon-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl text-casino-neon-green font-bold tracking-tight">CGSG</span>
                <span className="text-xs text-casino-neon-green/70 font-medium -mt-1">
                  Casino Guide
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-casino-neon-green/15 text-casino-neon-green border border-casino-neon-green/30'
                        : 'text-white/80 hover:text-casino-neon-green hover:bg-casino-neon-green/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth & Search */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Button */}
              <button className="p-2 text-white/70 hover:text-casino-neon-green hover:bg-casino-neon-green/10 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Admin Button */}
              {isClient && <AdminButton variant="default" />}

              {/* Auth Section */}
              {isClient ? (
                user ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-3 px-3 py-2 bg-casino-neon-green/10 rounded-lg border border-casino-neon-green/20">
                      <div className="w-8 h-8 bg-gradient-to-br from-casino-neon-green to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-casino-dark font-semibold text-sm">
                          {user.email && typeof user.email === 'string'
                            ? user.email.charAt(0).toUpperCase()
                            : 'U'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{getDisplayName()}</span>
                        <span className="text-casino-neon-green/70 text-xs">{user.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link href="/signin">
                    <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-casino-neon-green to-emerald-500 hover:from-casino-neon-green/90 hover:to-emerald-500/90 text-casino-dark font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </Link>
                )
              ) : (
                <div className="w-24 h-10 bg-transparent"></div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              {/* Mobile Search */}
              <button className="p-2 text-white/70 hover:text-casino-neon-green hover:bg-casino-neon-green/10 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
              
              {/* Hamburger Menu */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-white/80 hover:text-casino-neon-green hover:bg-casino-neon-green/10 transition-colors rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-casino-dark/98 border-b border-casino-neon-green/20 shadow-2xl">
            <div className="max-w-md mx-auto px-6 py-6">
              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-semibold text-casino-neon-green/70 uppercase tracking-wider mb-4">
                  Navigation
                </div>
                
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-casino-neon-green/15 text-casino-neon-green border border-casino-neon-green/30'
                          : 'text-white/90 hover:text-white hover:bg-casino-neon-green/10'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        isActive ? 'bg-casino-neon-green/20' : 'bg-casino-neon-green/15'
                      }`}>
                        <Icon className="w-4 h-4 text-casino-neon-green" />
                      </div>
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Account Section */}
              <div className="pt-4 border-t border-casino-neon-green/20">
                <div className="text-xs font-semibold text-casino-neon-green/70 uppercase tracking-wider mb-4">
                  Account
                </div>
                
                {isClient && user ? (
                  <div className="space-y-4">
                    {/* User Info Card */}
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-casino-neon-green/10 to-emerald-500/10 rounded-lg border border-casino-neon-green/20">
                      <div className="w-12 h-12 bg-gradient-to-br from-casino-neon-green to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-casino-dark font-bold text-lg">
                          {user.email && typeof user.email === 'string'
                            ? user.email.charAt(0).toUpperCase()
                            : 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {getDisplayName()}
                        </p>
                        <p className="text-casino-neon-green/70 text-xs truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Admin Button */}
                    {isClient && (
                      <AdminButton variant="mobile" onClick={() => setMobileMenuOpen(false)} />
                    )}

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/90 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : isClient ? (
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-casino-neon-green to-emerald-500 hover:from-casino-neon-green/90 hover:to-emerald-500/90 text-casino-dark font-semibold rounded-lg transition-all duration-200">
                      <User className="w-4 h-4" />
                      <span>Sign In to Continue</span>
                    </button>
                  </Link>
                ) : (
                  <div className="w-full h-12 bg-transparent"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default ProfessionalNavbar;