
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Image, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PostFormProps {
  onPostCreated?: (userId?: string) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
    toast.error('You must be logged in to post');
    return;
  }
  
  if (!content.trim() && !image) {
    toast.error('Post cannot be empty');
    return;
  }
  
  if (content.length > 500) {
    toast.error('Post is too long (max 500 characters)');
    return;
  }

    setPosting(true);

    try {
      let imageUrl = null;

      // Upload image if present
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;
        imageUrl = fileName;
      }

      // Create post
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          image_url: imageUrl
        });

      if (postError) throw postError;

      toast.success('Post created successfully!');
      setContent('');
      setImage(null);
      setImagePreview(null);
      
      // Trigger post created callback if provided
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Card className="bg-casino-card-bg border-casino-border-subtle">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="bg-casino-dark border-casino-border-subtle text-white resize-none"
            rows={3}
          />
          
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 rounded-lg object-cover"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-black/50 border-white/20 hover:bg-black/70"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="post-image"
              />
              <label htmlFor="post-image">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-casino-border-subtle hover:bg-casino-dark"
                  asChild
                >
                  <span className="cursor-pointer">
                    <Image className="w-4 h-4 mr-2" />
                    Add Image
                  </span>
                </Button>
              </label>
            </div>
            
            <Button
              type="submit"
              disabled={posting || (!content.trim() && !image)}
              className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
            >
              {posting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
