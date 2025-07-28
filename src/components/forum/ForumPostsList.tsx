'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Eye, 
  Clock, 
  Star,
  Pin,
  Lock,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { useAuth } from '@/src/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  user_name: string;
  user_avatar: string;
  user_id: string;
  casino_name?: string;
  rating?: number;
  post_type: string;
  is_pinned: boolean;
  is_locked: boolean;
  views_count: number;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  forum_categories?: {
    name: string;
    icon_name: string;
    color_class: string;
  };
}

interface ForumPostsListProps {
  categoryId: number | null;
  onPostCreated: () => void;
}

export default function ForumPostsList({ categoryId, onPostCreated }: ForumPostsListProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [categoryId]);

  useEffect(() => {
    if (user && posts.length > 0) {
      fetchUserLikes();
    }
  }, [user, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryId) {
        params.append('category_id', categoryId.toString());
      }
      params.append('limit', '20');
      params.append('sort_by', 'created_at');
      params.append('sort_order', 'desc');

      const response = await fetch(`/api/forum/posts?${params}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikes = async () => {
    if (!user || posts.length === 0) return;

    try {
      const postIds = posts.map(post => post.id).join(',');
      const response = await fetch(`/api/forum/likes?target_type=post&target_ids=${postIds}&user_id=${user.id}`);
      const data = await response.json();
      setLikedPosts(data.likedItems || []);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const handleLike = async (postId: number) => {
    if (!user) return;

    try {
      const response = await fetch('/api/forum/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: 'post',
          target_id: postId,
          user_id: user.id
        })
      });

      const data = await response.json();
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes_count: data.likesCount }
          : post
      ));

      // Update liked posts
      if (data.isLiked) {
        setLikedPosts([...likedPosts, postId]);
      } else {
        setLikedPosts(likedPosts.filter(id => id !== postId));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'question': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'experience': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-casino-card-bg rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="bg-casino-card-bg border-casino-border-subtle">
        <CardContent className="p-8 text-center">
          <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
          <p className="text-gray-400 mb-4">
            {categoryId 
              ? 'No posts in this category yet. Be the first to start a discussion!'
              : 'No posts in the forum yet. Be the first to start a discussion!'
            }
          </p>
          {user && (
            <Button className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark">
              Create First Post
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">
          {categoryId ? 'Category Posts' : 'Recent Discussions'}
        </h3>
        <div className="text-sm text-gray-400">
          {posts.length} posts
        </div>
      </div>

      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-green/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={post.user_avatar || '/default-avatar.png'}
                    alt={post.user_name}
                    className="w-12 h-12 rounded-full border-2 border-casino-border-subtle"
                  />
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {post.is_pinned && (
                          <Pin className="w-4 h-4 text-casino-neon-green" />
                        )}
                        {post.is_locked && (
                          <Lock className="w-4 h-4 text-red-400" />
                        )}
                        <Badge className={getPostTypeColor(post.post_type)}>
                          {post.post_type}
                        </Badge>
                        {post.casino_name && (
                          <Badge variant="outline" className="text-casino-neon-green border-casino-neon-green">
                            {post.casino_name}
                          </Badge>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-semibold text-white hover:text-casino-neon-green cursor-pointer transition-colors">
                        {post.title}
                      </h4>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span className="font-medium text-white">{post.user_name}</span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Post Actions */}
                    {user && user.id === post.user_id && (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Post Content Preview */}
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.content.length > 200 
                      ? post.content.substring(0, 200) + '...'
                      : post.content
                    }
                  </p>

                  {/* Casino Rating */}
                  {post.rating && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-400">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(post.rating)}
                      </div>
                      <span className="text-sm text-casino-neon-green font-medium">
                        {post.rating}/5
                      </span>
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        disabled={!user}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          likedPosts.includes(post.id)
                            ? 'text-red-400'
                            : 'text-gray-400 hover:text-red-400'
                        } ${!user ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                        <span>{post.likes_count}</span>
                      </button>

                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies_count}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{post.views_count}</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark"
                    >
                      View Discussion
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
