'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/contexts/AuthContext'; // ✅ RE-ENABLED: Fixed double providers
import { User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

export function SidebarUserInfo() {
  const { user, signOut } = useAuth(); // ✅ RE-ENABLED: Fixed double providers

  // Helper function to get display name
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email && typeof user.email === 'string') {
      try {
        const emailPart = user.email.split('@')[0];
        // Capitalize first letter and replace dots/underscores with spaces
        return emailPart.charAt(0).toUpperCase() + emailPart.slice(1).replace(/[._]/g, ' ');
      } catch (error) {
        console.error('Error processing email for display name:', error);
        return 'User';
      }
    }
    return 'User';
  };



  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development' && user) {
    console.log('🔍 SidebarUserInfo - User data:', {
      email: user.email,
      full_name: user.user_metadata?.full_name,
      name: user.user_metadata?.name,
      user_metadata: user.user_metadata,
      displayName: getDisplayName()
    });
  }

  if (!user) {
    return (
      <div className="p-3 border-b border-casino-border-subtle/30">
        <div className="bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-purple/10 rounded-lg p-3 border border-casino-neon-green/20">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-casino-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-casino-neon-green" />
            </div>
            <p className="text-base font-semibold text-white">Welcome to CGSG</p>
            <p className="text-sm text-gray-400">
              Sign in to access exclusive features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-casino-border-subtle/30">
      <div className="bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-purple/10 rounded-lg p-4 border border-casino-neon-green/20">
        {/* User Avatar & Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 border-2 border-casino-neon-green/30 shadow-lg">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-casino-neon-green/20 text-casino-neon-green font-semibold text-lg">
              {user.email?.charAt(0).toUpperCase() || 'C'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white">
              {getDisplayName()}
            </h3>
          </div>
        </div>

        {/* Level and Online Status */}
        <div className="flex items-center justify-between mt-4 mb-4">
          <Badge variant="outline" className="text-xs bg-casino-neon-green/20 text-casino-neon-green border-casino-neon-green/30 px-3 py-1 font-semibold">
            Level 1
          </Badge>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-casino-neon-green rounded-full animate-pulse shadow-sm shadow-casino-neon-green/50"></div>
            <span className="text-xs text-gray-300 font-medium">Online</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2">
          <Link href="/profile" className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-casino-border-subtle hover:border-casino-neon-green/50 hover:bg-casino-neon-green/10 h-8 font-medium transition-all duration-200"
            >
              <User className="w-3.5 h-3.5 mr-1.5" />
              Profile
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="text-xs border-casino-border-subtle hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 h-8 px-2.5 transition-all duration-200"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SidebarQuickStats() {
  return (
    <div className="p-4 border-b border-casino-border-subtle/30">
      <div className="grid grid-cols-2 gap-3">
        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-3 text-center border border-casino-border-subtle/30 hover:border-casino-neon-green/40 transition-all duration-200 group cursor-pointer">
          <div className="text-2xl font-bold text-casino-neon-green mb-1">50</div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors font-medium">Casinos</p>
        </div>

        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-3 text-center border border-casino-border-subtle/30 hover:border-casino-neon-purple/40 transition-all duration-200 group cursor-pointer">
          <div className="text-2xl font-bold text-casino-neon-purple mb-1">200</div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors font-medium">Reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-3 text-center border border-casino-border-subtle/30 hover:border-yellow-500/40 transition-all duration-200 group cursor-pointer">
          <div className="text-2xl font-bold text-yellow-500 mb-1">15</div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors font-medium">Active</p>
        </div>

        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-3 text-center border border-casino-border-subtle/30 hover:border-blue-500/40 transition-all duration-200 group cursor-pointer">
          <div className="text-2xl font-bold text-blue-500 mb-1">8</div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors font-medium">New</p>
        </div>
      </div>
    </div>
  );
}

export function SidebarFeaturedCasino() {
  return (
    <div className="p-1.5 sm:p-2 md:p-3 border-t border-casino-border-subtle/30">
      <div className="featured-casino bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 rounded-md p-1.5 sm:p-2 border border-casino-neon-green/20 hover:border-casino-neon-green/40 transition-colors group neon-border-flow">
        <div className="relative z-10">
          <div className="flex items-center gap-1 mb-1.5">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-casino-neon-green rounded-full pulse-neon"></div>
            <p className="text-xs font-semibold text-casino-neon-green">🔥 Featured</p>
          </div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-xs font-bold text-casino-dark">T1</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">TOP1 Casino</p>
              <p className="text-xs text-gray-400 truncate leading-tight">80% Bonus</p>
            </div>
          </div>
          <button className="w-full bg-neon-gradient text-casino-dark text-xs font-bold py-1 sm:py-1.5 rounded-sm hover:opacity-90 transition-all duration-200 group-hover:scale-105 transform hover:shadow-[0_0_20px_rgba(0,255,153,0.3)]">
            <span className="hidden sm:inline">Play Now & Get Bonus</span>
            <span className="sm:hidden">Play Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
