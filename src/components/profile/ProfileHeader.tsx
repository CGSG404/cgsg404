
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Edit, Upload } from 'lucide-react';
import AvatarUpload from './AvatarUpload';
import ProfileEdit from './ProfileEdit';

interface Profile {
  id: string;
  username: string;
  bio: string;
  avatar_url: string | null;
  created_at: string;
}

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  onProfileUpdate: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isOwnProfile, onProfileUpdate }) => {
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getAvatarUrl = () => {
    if (!profile.avatar_url) return null;
    if (profile.avatar_url.startsWith('http')) return profile.avatar_url;
    return `https://hyuomkqzebyiagrmjlks.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`;
  };

  return (
    <>
      <Card className="bg-casino-card-bg border-casino-border-subtle">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32">
                  <AvatarImage src={getAvatarUrl() || undefined} alt={profile.username} />
                  <AvatarFallback className="bg-casino-neon-green text-casino-dark text-xl font-bold">
                    {profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-casino-card-bg border-casino-border-subtle hover:bg-casino-dark"
                    onClick={() => setShowAvatarUpload(true)}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-0">
                  @{profile.username}
                </h1>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditProfile(true)}
                    className="border-casino-border-subtle hover:bg-casino-dark"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
              
              <p className="text-gray-300 mb-4 text-sm md:text-base">
                {profile.bio || 'No bio yet.'}
              </p>
              
              <div className="flex items-center justify-center md:justify-start text-gray-400 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Joined {formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AvatarUpload
        isOpen={showAvatarUpload}
        onClose={() => setShowAvatarUpload(false)}
        onSuccess={onProfileUpdate}
        userId={profile.id}
      />

      <ProfileEdit
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSuccess={onProfileUpdate}
        profile={profile}
      />
    </>
  );
};

export default ProfileHeader;
