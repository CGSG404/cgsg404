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
      <div className="p-2 sm:p-3 md:p-4 border-b border-casino-border-subtle/30">
        <div className="bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 rounded-lg p-2 sm:p-3 border border-casino-neon-green/20">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-300 mb-2">Welcome to CGSG</p>
            <p className="text-xs text-gray-400 leading-tight">
              Sign in from the navbar to access personalized features
            </p>
            {/* 🚨 REMOVED: Login button to prevent conflicts with navbar */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-4 border-b border-casino-border-subtle/30">
      <div className="bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 rounded-lg p-2 sm:p-3 border border-casino-neon-green/20">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="relative user-avatar">
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border-2 border-casino-neon-green/30">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-casino-card-bg text-casino-neon-green text-xs sm:text-sm">
                {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-casino-neon-green rounded-full border-2 border-casino-dark flex items-center justify-center pulse-neon">
              <div className="w-1 h-1 sm:w-2 sm:h-2 bg-casino-dark rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-white truncate">
              {user.user_metadata?.name || 'Casino Player'}
            </p>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs border-casino-neon-green/30 text-casino-neon-green px-1 py-0">
                Level 1
              </Badge>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-casino-neon-green rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <Link href="/profile" className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-7 sm:h-8 border-casino-border-subtle hover:border-casino-neon-green/50 hover:bg-casino-neon-green/10"
            >
              <User className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="text-xs h-7 sm:h-8 px-2 sm:px-3 border-casino-border-subtle hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SidebarQuickStats() {
  return (
    <div className="p-2 sm:p-3 md:p-4 border-b border-casino-border-subtle/30">
      <div className="grid grid-cols-2 gap-1 sm:gap-2">
        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-2 sm:p-3 text-center border border-casino-border-subtle/30 hover:border-casino-neon-green/30 transition-colors group">
          <div className="flex items-center justify-center mb-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-casino-neon-green/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-casino-neon-green">50</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Casinos</p>
        </div>

        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-2 sm:p-3 text-center border border-casino-border-subtle/30 hover:border-casino-neon-purple/30 transition-colors group">
          <div className="flex items-center justify-center mb-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-casino-neon-purple/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-casino-neon-purple">200</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Reviews</p>
        </div>

        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-2 sm:p-3 text-center border border-casino-border-subtle/30 hover:border-yellow-500/30 transition-colors group">
          <div className="flex items-center justify-center mb-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-500">15</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Active</p>
        </div>

        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-2 sm:p-3 text-center border border-casino-border-subtle/30 hover:border-blue-500/30 transition-colors group">
          <div className="flex items-center justify-center mb-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-500">8</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">New</p>
        </div>
      </div>
    </div>
  );
}

export function SidebarFeaturedCasino() {
  return (
    <div className="p-2 sm:p-3 md:p-4 border-t border-casino-border-subtle/30">
      <div className="featured-casino bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 rounded-lg p-2 sm:p-3 border border-casino-neon-green/20 hover:border-casino-neon-green/40 transition-colors group neon-border-flow">
        <div className="relative z-10">
          <div className="flex items-center gap-1 sm:gap-2 mb-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-casino-neon-green rounded-full pulse-neon"></div>
            <p className="text-xs font-semibold text-casino-neon-green">🔥 Featured Casino</p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white rounded-md flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-casino-dark">T1</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-white truncate">TOP1 Casino</p>
              <p className="text-xs text-gray-400 truncate">80% Welcome Bonus</p>
            </div>
          </div>
          <button className="w-full bg-neon-gradient text-casino-dark text-xs font-bold py-1.5 sm:py-2 rounded-md hover:opacity-90 transition-all duration-200 group-hover:scale-105 transform hover:shadow-[0_0_20px_rgba(0,255,153,0.3)]">
            <span className="hidden sm:inline">Play Now & Get Bonus</span>
            <span className="sm:hidden">Play Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
