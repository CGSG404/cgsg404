
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PostForm from '@/components/profile/PostForm';
import PostTimeline from '@/components/profile/PostTimeline';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  bio: string;
  avatar_url: string | null;
  created_at: string;
}

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username, user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
      setIsOwnProfile(user?.id === data.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-casino-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl text-white">Profile not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={isOwnProfile}
          onProfileUpdate={fetchProfile}
        />
        
        {isOwnProfile && (
          <div className="mt-8">
            <PostForm />
          </div>
        )}
        
        <div className="mt-8">
          <PostTimeline userId={profile.id} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
