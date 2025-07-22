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

  if (!user) {
    return (
      <div className="p-1 sm:p-1.5 border-b border-casino-border-subtle/30">
        <div className="bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 rounded-sm p-1 sm:p-1.5 border border-casino-neon-green/20">
          <div className="text-center">
            <p className="text-xs text-gray-300 mb-0.5">Welcome to CGSG</p>
            <p className="text-xs text-gray-400 leading-tight">
              Sign in to access features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-1.5 border-b border-casino-border-subtle/30">
      <div className="bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 rounded-sm p-1 sm:p-1.5 border border-casino-neon-green/20">
        <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
          <div className="relative user-avatar flex-shrink-0">
            <Avatar className="w-6 h-6 sm:w-7 sm:h-7 border border-casino-neon-green/30">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-casino-card-bg text-casino-neon-green text-xs">
                {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-casino-neon-green rounded-full border border-casino-dark pulse-neon">
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate leading-tight">
              {user.user_metadata?.name || 'Player'}
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-casino-neon-green rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
        </div>

        <div className="flex gap-0.5">
          <Link href="/profile" className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-5 sm:h-6 px-1 sm:px-1.5 border-casino-border-subtle hover:border-casino-neon-green/50 hover:bg-casino-neon-green/10"
            >
              <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline text-xs ml-1">Profile</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="text-xs h-5 sm:h-6 px-1 sm:px-1.5 border-casino-border-subtle hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SidebarQuickStats() {
  return (
    <div className="p-1 sm:p-1.5 md:p-2 border-b border-casino-border-subtle/30">
      <div className="grid grid-cols-2 gap-1">
        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-sm p-1 sm:p-1.5 text-center border border-casino-border-subtle/30 hover:border-casino-neon-green/30 transition-colors group">
          <div className="flex items-center justify-center mb-0.5">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-casino-neon-green/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-casino-neon-green">50</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-tight">Casinos</p>
        </div>

        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-sm p-1 sm:p-1.5 text-center border border-casino-border-subtle/30 hover:border-casino-neon-purple/30 transition-colors group">
          <div className="flex items-center justify-center mb-0.5">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-casino-neon-purple/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-casino-neon-purple">200</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-tight">Reviews</p>
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
