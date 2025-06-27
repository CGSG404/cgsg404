"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface Profile {
  id: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  website?: string | null;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const params = useParams();
  const username = params.username as string;
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username, user?.id]);

  const fetchProfile = async () => {
    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (profileError || !profileData) {
        throw new Error('Failed to load profile or profile not found');
      }

      setProfile(profileData);
      setIsOwnProfile(user?.id === profileData.id);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-casino-dark text-white">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-casino-card-bg rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <Image 
                  src={profile.avatar_url} 
                  alt={profile.full_name || 'User avatar'}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-500">
                  {profile.full_name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{profile.full_name || 'No Name'}</h1>
              <p className="text-gray-300">@{profile.username}</p>
              {profile.bio && (
                <p className="mt-2 text-gray-200">{profile.bio}</p>
              )}
              {profile.website && (
                <a 
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-casino-neon-green hover:underline mt-2 block"
                >
                  {profile.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
