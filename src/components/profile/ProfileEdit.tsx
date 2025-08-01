
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface Profile {
  id: string;
  username: string;
  bio: string;
  avatar_url: string | null;
  created_at: string;
}

interface ProfileEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profile: Profile;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ isOpen, onClose, onSuccess, profile }) => {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          bio: bio.trim()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.code === '23505') {
        toast.error('Username is already taken');
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-casino-card-bg border-casino-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="bg-casino-dark border-casino-border-subtle text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="bg-casino-dark border-casino-border-subtle text-white resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-casino-border-subtle hover:bg-casino-dark"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEdit;
