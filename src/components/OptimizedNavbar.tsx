'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Star,
  Gift,
  Users,
  BookOpen,
  MessageCircle,
  Newspaper,
  User,
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { cn } from '@/src/lib/utils';

// Navigation items configuration
const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/casinos-singapore', label: 'Casinos', icon: Star },
  { href: '/best-bonuses', label: 'Bonuses', icon: Gift },
  { href: '/reviews', label: 'Reviews', icon: BookOpen },
  { href: '/forum', label: 'Forum', icon: MessageCircle },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/list-report', label: 'Reports', icon: Users },
];

export default function OptimizedNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const pathname = usePathname();

  // Handle scroll for navbar background
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 10;
    setIsScrolled(scrolled);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [signOut]);

  return (
    <>
      {/* Main Navbar */}
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "border-b border-casino-border-subtle/50",
          isScrolled 
            ? "bg-casino-dark/95 backdrop-blur-md shadow-lg" 
            : "bg-casino-dark/80 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex-shrink-0 group"
              aria-label="CGSG Home"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-casino-neon-green to-casino-neon-blue flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-white font-bold text-lg hidden sm:block">
                  CGSG
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-casino-neon-green/20 text-casino-neon-green"
                        : "text-casino-text-secondary hover:text-white hover:bg-casino-dark-lighter"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Admin Button */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg bg-casino-neon-purple/20 text-casino-neon-purple hover:bg-casino-neon-purple/30 transition-colors text-sm font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}

              {/* User Menu */}
              {user ? (
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-casino-dark-lighter text-sm">
                    <User className="w-4 h-4 text-casino-text-secondary" />
                    <span className="text-casino-text-secondary truncate max-w-24">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-casino-text-secondary hover:text-white hover:bg-casino-dark-lighter transition-colors text-sm"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="hidden lg:block px-4 py-2 rounded-lg bg-casino-neon-green text-casino-dark font-medium hover:bg-casino-neon-green-light transition-colors text-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg text-casino-text-secondary hover:text-white hover:bg-casino-dark-lighter transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
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
            onClick={toggleMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-casino-dark border-b border-casino-border-subtle shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Navigation Items */}
              <div className="space-y-1 mb-6">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive
                          ? "bg-casino-neon-green/20 text-casino-neon-green"
                          : "text-casino-text-secondary hover:text-white hover:bg-casino-dark-lighter"
                      )}
                      onClick={toggleMobileMenu}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* User Section */}
              <div className="border-t border-casino-border-subtle pt-4">
                {user ? (
                  <div className="space-y-2">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-4 py-2 text-casino-text-secondary">
                      <User className="w-5 h-5" />
                      <span className="text-sm">
                        {user.email}
                      </span>
                    </div>
                    
                    {/* Admin Link */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-casino-neon-purple/20 text-casino-neon-purple text-base font-medium"
                        onClick={toggleMobileMenu}
                      >
                        <Shield className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    
                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-casino-text-secondary hover:text-white hover:bg-casino-dark-lighter transition-colors text-base font-medium w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/signin"
                    className="flex items-center justify-center px-4 py-3 rounded-lg bg-casino-neon-green text-casino-dark font-medium text-base"
                    onClick={toggleMobileMenu}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}