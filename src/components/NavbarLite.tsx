'use client';

import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Star, User, LogOut, Search, Home, Gamepad2, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import SimpleAuthButton from '@/src/components/SimpleAuthButton';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const NavbarLite = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const router = useRouter();

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-casino-card-bg border-b border-casino-border-subtle sticky top-0 z-50 w-full shadow-lg">
      <div className="w-full flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-casino-neon-green rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-casino-dark" />
          </div>
          <span className="text-xl gradient-text font-normal">CGSG</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/casinos" className="text-white hover:text-casino-neon-green transition-colors">
            Casinos
          </Link>
          <Link href="/games" className="text-white hover:text-casino-neon-green transition-colors">
            Games
          </Link>
          <Link href="/news" className="text-white hover:text-casino-neon-green transition-colors">
            News
          </Link>
          <Link href="/reviews" className="text-white hover:text-casino-neon-green transition-colors">
            Reviews
          </Link>
        </div>

        {/* Desktop User Section */}
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
                  {user.user_metadata?.full_name || (user.email && typeof user.email === 'string' ? user.email.split('@')[0] : 'User')}
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-casino-neon-green hover:bg-casino-neon-green/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-casino-card-bg border-t border-casino-border-subtle">
          <div className="px-6 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link 
                href="/casinos" 
                onClick={closeMobileMenu}
                className="block text-white hover:text-casino-neon-green transition-colors py-2"
              >
                Casinos
              </Link>
              <Link 
                href="/games" 
                onClick={closeMobileMenu}
                className="block text-white hover:text-casino-neon-green transition-colors py-2"
              >
                Games
              </Link>
              <Link 
                href="/news" 
                onClick={closeMobileMenu}
                className="block text-white hover:text-casino-neon-green transition-colors py-2"
              >
                News
              </Link>
              <Link 
                href="/reviews" 
                onClick={closeMobileMenu}
                className="block text-white hover:text-casino-neon-green transition-colors py-2"
              >
                Reviews
              </Link>
              
              {/* Admin Link for Mobile */}
              {isAdmin && (
                <Link 
                  href="/admin" 
                  onClick={closeMobileMenu}
                  className="block text-casino-neon-green hover:text-casino-neon-green/80 transition-colors py-2 font-semibold"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-casino-border-subtle pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 py-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-casino-neon-green text-casino-dark text-sm font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {user.user_metadata?.full_name || (user.email && typeof user.email === 'string' ? user.email.split('@')[0] : 'User')}
                      </p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left text-red-400 hover:text-red-300 transition-colors py-2 text-sm flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <SimpleAuthButton
                  className="w-full bg-casino-neon-green hover:bg-casino-neon-green/80 text-black font-semibold py-2 px-4 rounded-lg"
                  onClick={closeMobileMenu}
                  customText="Sign In"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarLite;
