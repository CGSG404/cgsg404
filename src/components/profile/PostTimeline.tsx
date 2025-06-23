import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface PostTimelineProps {
  userId: string;
}

const PostTimeline: React.FC<PostTimelineProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      if (postsData && postsData.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        const postsWithProfile = postsData.map(post => ({
          ...post,
          profiles: profileData
        }));

        setPosts(postsWithProfile);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://hyuomkqzebyiagrmjlks.supabase.co/storage/v1/object/public/post-images/${imageUrl}`;
  };

  const getAvatarUrl = (avatarUrl: string | null) => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith('http')) return avatarUrl;
    return `https://hyuomkqzebyiagrmjlks.supabase.co/storage/v1/object/public/avatars/${avatarUrl}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-casino-card-bg border-casino-border-subtle animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-600 rounded mb-4"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="bg-casino-card-bg border-casino-border-subtle">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">No posts yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-casino-card-bg border-casino-border-subtle">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={getAvatarUrl(post.profiles?.avatar_url || null) || undefined} />
                  <AvatarFallback className="bg-casino-neon-green text-casino-dark">
                    {post.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white">@{post.profiles?.username || 'Unknown'}</span>
                    <span className="text-gray-400 text-sm">·</span>
                    <span className="text-gray-400 text-sm">{formatDate(post.created_at)}</span>
                  </div>
                  
                  {post.content && (
                    <p className="text-gray-300 mb-3 whitespace-pre-wrap">{post.content}</p>
                  )}
                  
                  {post.image_url && (
                    <img
                      src={getImageUrl(post.image_url) || undefined}
                      alt="Post image"
                      className="rounded-lg max-w-full h-auto border border-casino-border-subtle"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostTimeline;
