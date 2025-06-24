
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Star, User, LogOut, UserCircle, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { user, signOut, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

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
      navigate('/');
      
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
      navigate('/signin', { state: { from: window.location.pathname } });
      return;
    }
    navigate('/profile');
    setShowProfile(false);
    
    setIsNavigating(true);
    setShowProfile(false);
    
    try {
      const { data, error } = await import('@/integrations/supabase/client').then(module => 
        module.supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()
      );
      
      navigate(`/profile/${data.username}`);
    } catch (error) {
      console.error('Profile navigation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <nav className="bg-casino-card-bg/80 backdrop-blur-md border-b border-casino-border-subtle sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-neon-gradient rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-casino-dark" />
            </div>
            <span className="text-xl font-bold gradient-text">CGSG</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-300 hover:text-casino-neon-green transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
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
                  className="border-casino-border-subtle hover:bg-casino-dark"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-casino-border-subtle hover:bg-casino-dark"
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
            className="md:hidden text-gray-300 hover:text-casino-neon-green transition-transform duration-200 active:scale-90"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="md:hidden py-4 border-t border-casino-border-subtle"
            >
              <div className="space-y-4 py-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {user ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await signInWithGoogle();
                        setIsMenuOpen(false);
                      } catch (error) {
                        console.error('Error signing in with Google:', error);
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
