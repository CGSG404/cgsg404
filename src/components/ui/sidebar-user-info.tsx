'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/contexts/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

export function SidebarUserInfo() {
  const { user, signOut, signInWithGoogle } = useAuth();

  if (!user) {
    return (
      <div className="p-4 border-b border-casino-border-subtle/30">
        <div className="bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 rounded-lg p-3 border border-casino-neon-green/20">
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-3">Join CGSG Community</p>
            <Button 
              onClick={signInWithGoogle}
              className="w-full bg-neon-gradient text-casino-dark text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Sign In with Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-casino-border-subtle/30">
      <div className="bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 rounded-lg p-3 border border-casino-neon-green/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative user-avatar">
            <Avatar className="w-10 h-10 border-2 border-casino-neon-green/30">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-casino-card-bg text-casino-neon-green">
                {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-casino-neon-green rounded-full border-2 border-casino-dark flex items-center justify-center pulse-neon">
              <div className="w-2 h-2 bg-casino-dark rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.user_metadata?.name || 'Casino Player'}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-casino-neon-green/30 text-casino-neon-green">
                Level 1
              </Badge>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-casino-neon-green rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href="/profile" className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs border-casino-border-subtle hover:border-casino-neon-green/50 hover:bg-casino-neon-green/10"
            >
              <User className="w-3 h-3 mr-1" />
              Profile
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="text-xs border-casino-border-subtle hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
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
    <div className="p-4 border-b border-casino-border-subtle/30">
      <div className="grid grid-cols-2 gap-2">
        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-3 text-center border border-casino-border-subtle/30 hover:border-casino-neon-green/30 transition-colors group">
          <div className="flex items-center justify-center mb-1">
            <div className="w-6 h-6 bg-casino-neon-green/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-casino-neon-green">50</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Casinos</p>
        </div>

        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-3 text-center border border-casino-border-subtle/30 hover:border-casino-neon-purple/30 transition-colors group">
          <div className="flex items-center justify-center mb-1">
            <div className="w-6 h-6 bg-casino-neon-purple/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-casino-neon-purple">200</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Reviews</p>
        </div>

        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-3 text-center border border-casino-border-subtle/30 hover:border-yellow-500/30 transition-colors group">
          <div className="flex items-center justify-center mb-1">
            <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-500">15</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Active</p>
        </div>

        <div className="stats-card bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/40 rounded-lg p-3 text-center border border-casino-border-subtle/30 hover:border-blue-500/30 transition-colors group">
          <div className="flex items-center justify-center mb-1">
            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
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
    <div className="p-4 border-t border-casino-border-subtle/30">
      <div className="featured-casino bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 rounded-lg p-3 border border-casino-neon-green/20 hover:border-casino-neon-green/40 transition-colors group neon-border-flow">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-casino-neon-green rounded-full pulse-neon"></div>
            <p className="text-xs font-semibold text-casino-neon-green">🔥 Featured Casino</p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-casino-dark">T1</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">TOP1 Casino</p>
              <p className="text-xs text-gray-400">80% Welcome Bonus</p>
            </div>
          </div>
          <button className="w-full bg-neon-gradient text-casino-dark text-xs font-bold py-2 rounded-md hover:opacity-90 transition-all duration-200 group-hover:scale-105 transform hover:shadow-[0_0_20px_rgba(0,255,153,0.3)]">
            Play Now & Get Bonus
          </button>
        </div>
      </div>
    </div>
  );
}
