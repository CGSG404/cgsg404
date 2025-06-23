
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Star, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, signOut } = useAuth();
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
    if (!user) return;
    
    try {
      const { data, error } = await import('@/integrations/supabase/client').then(module => 
        module.supabase.from('profiles').select('username').eq('id', user.id).single()
      );
      
      if (error || !data) {
        toast.error('Profile not found');
        return;
      }
      
      navigate(`/profile/${data.username}`);
    } catch (error) {
      toast.error('Error loading profile');
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
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 hover:text-casino-neon-green transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-casino-neon-green text-casino-dark text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-300 text-sm">Profile</span>
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
                <Link to="/best-bonuses">
                  <Button className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold px-6">
                    Best Bonuses
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-casino-neon-green"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-casino-border-subtle">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-300 hover:text-casino-neon-green transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-3 border-t border-casino-border-subtle space-y-3">
                  <button
                    onClick={() => {
                      handleProfileClick();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-casino-neon-green py-2 block w-full text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-casino-neon-green py-2 block w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-casino-border-subtle space-y-3">
                  <Link
                    to="/auth"
                    className="block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-casino-border-subtle hover:bg-casino-dark"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/best-bonuses">
                    <Button className="w-full bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90">
                      Best Bonuses
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
