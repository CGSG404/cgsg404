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
  refreshTrigger?: number;
}

export default function ForumPostsList({ categoryId, onPostCreated, refreshTrigger }: ForumPostsListProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [categoryId, refreshTrigger]);

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

  const handleDelete = async (postId: number) => {
    if (!user) return;

    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/forum/posts?id=${postId}&user_id=${user.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPosts(posts.filter(post => post.id !== postId));
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEdit = async (postId: number, newContent: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/forum/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          user_id: user.id,
          content: newContent,
          title: newContent.substring(0, 50) + (newContent.length > 50 ? '...' : ''),
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post =>
          post.id === postId ? data.post : post
        ));
      }
    } catch (error) {
      console.error('Error editing post:', error);
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
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="h-32 bg-casino-card-bg rounded-lg animate-pulse border border-casino-border-subtle"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardContent className="p-8 lg:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-casino-neon-green/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-casino-neon-green" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">No posts yet</h3>
              <p className="text-gray-400 text-sm lg:text-base leading-relaxed mb-6">
                {categoryId
                  ? 'No posts in this category yet. Be the first to start a discussion and share your casino experiences!'
                  : 'No posts in the forum yet. Be the first to start a discussion and connect with fellow casino enthusiasts!'
                }
              </p>
              {user && (
                <Button className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-casino-neon-green/25">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pb-6 mb-6 border-b border-casino-border-subtle"
      >
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
          Community Feed
        </h3>
        <p className="text-sm text-gray-400">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} • Real-time updates from the community
        </p>
      </motion.div>

      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-green/30 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {/* Mobile-First Layout */}
              <div className="space-y-3 sm:space-y-4">
                {/* Header Row */}
                <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={post.user_avatar || '/default-avatar.png'}
                      alt={post.user_name}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-casino-border-subtle"
                    />
                  </div>

                  {/* Post Header Info */}
                  <div className="flex-1 min-w-0">
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {post.is_pinned && (
                        <div className="flex items-center gap-1 text-casino-neon-green">
                          <Pin className="w-3 h-3" />
                          <span className="text-xs font-medium">Pinned</span>
                        </div>
                      )}
                      {post.is_locked && (
                        <div className="flex items-center gap-1 text-red-400">
                          <Lock className="w-3 h-3" />
                          <span className="text-xs font-medium">Locked</span>
                        </div>
                      )}
                      <Badge className={`text-xs ${getPostTypeColor(post.post_type)}`}>
                        {post.post_type}
                      </Badge>
                      {post.casino_name && (
                        <Badge variant="outline" className="text-xs text-casino-neon-green border-casino-neon-green">
                          {post.casino_name}
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white group-hover:text-casino-neon-green transition-colors leading-tight mb-1 sm:mb-2 line-clamp-2">
                      {post.title}
                    </h4>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-4 text-xs sm:text-sm text-gray-400">
                      <span className="font-medium text-white text-xs sm:text-sm">{post.user_name}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs sm:text-sm">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </span>
                      {post.forum_categories && (
                        <span className="flex items-center gap-1 text-casino-neon-green">
                          <MessageCircle className="w-3 h-3" />
                          <span className="text-xs sm:text-sm">{post.forum_categories.name}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Actions - Desktop Only */}
                  {user && user.id === post.user_id && (
                    <div className="hidden sm:flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white p-2"
                        onClick={() => {
                          const newContent = prompt('Edit your post:', post.content);
                          if (newContent && newContent.trim() !== post.content) {
                            handleEdit(post.id, newContent.trim());
                          }
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400 p-2"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Post Content Preview */}
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-3">
                    {post.content.length > 120
                      ? post.content.substring(0, 120) + '...'
                      : post.content
                    }
                  </p>

                  {/* Casino Rating */}
                  {post.rating && (
                    <div className="flex items-center gap-3 p-3 bg-casino-darker/30 rounded-lg border border-casino-border-subtle">
                      <span className="text-sm text-gray-400 font-medium">Casino Rating:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(post.rating)}
                      </div>
                      <span className="text-sm text-casino-neon-green font-bold">
                        {post.rating}/5
                      </span>
                    </div>
                  )}
                </div>

                {/* Post Stats & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-casino-border-subtle">
                  {/* Stats */}
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      disabled={!user}
                      className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm transition-all duration-200 ${
                        likedPosts.includes(post.id)
                          ? 'text-red-400 scale-105'
                          : 'text-gray-400 hover:text-red-400 hover:scale-105'
                      } ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                      <span className="font-medium">{post.likes_count}</span>
                      <span className="hidden lg:inline text-xs">likes</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-400">
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">{post.replies_count}</span>
                      <span className="hidden lg:inline text-xs">replies</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-400">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">{post.views_count}</span>
                      <span className="hidden lg:inline text-xs">views</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Mobile Actions for Post Owner */}
                    {user && user.id === post.user_id && (
                      <div className="flex sm:hidden items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white p-2"
                          onClick={() => {
                            const newContent = prompt('Edit your post:', post.content);
                            if (newContent && newContent.trim() !== post.content) {
                              handleEdit(post.id, newContent.trim());
                            }
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-red-400 p-2"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark transition-all duration-200 font-medium px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">View Discussion</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Load More Button */}
      {posts.length >= 20 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-6"
        >
          <Button
            variant="outline"
            className="border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark px-8 py-3 font-medium"
          >
            Load More Posts
          </Button>
        </motion.div>
      )}
    </div>
  );
}
