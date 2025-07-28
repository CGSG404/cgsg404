'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  MessageCircle, 
  HelpCircle, 
  Trophy,
  Send
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { useAuth } from '@/src/contexts/AuthContext';

interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  color_class: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const postTypes = [
  { value: 'discussion', label: 'General Discussion', icon: MessageCircle, color: 'from-blue-500 to-cyan-500' },
  { value: 'review', label: 'Casino Review', icon: Star, color: 'from-yellow-500 to-orange-500' },
  { value: 'question', label: 'Question', icon: HelpCircle, color: 'from-purple-500 to-pink-500' },
  { value: 'experience', label: 'Experience Share', icon: Trophy, color: 'from-green-500 to-emerald-500' }
];

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    content: '',
    post_type: 'discussion',
    casino_name: '',
    rating: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/forum/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category_id: parseInt(formData.category_id),
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
          user_avatar: user.user_metadata?.avatar_url || null,
          rating: formData.post_type === 'review' ? formData.rating : null
        })
      });

      if (response.ok) {
        onPostCreated();
        setFormData({
          category_id: '',
          title: '',
          content: '',
          post_type: 'discussion',
          casino_name: '',
          rating: 0
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData({ ...formData, rating: i + 1 })}
        className={`w-8 h-8 ${
          i < formData.rating ? 'text-yellow-400' : 'text-gray-600'
        } hover:text-yellow-400 transition-colors`}
      >
        <Star className={`w-full h-full ${i < formData.rating ? 'fill-current' : ''}`} />
      </button>
    ));
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-casino-card-bg border-casino-border-subtle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-bold text-white">Create New Post</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Post Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Post Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {postTypes.map((type) => {
                        const IconComponent = type.icon;
                        const isSelected = formData.post_type === type.value;
                        
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, post_type: type.value })}
                            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                              isSelected
                                ? 'border-casino-neon-green bg-casino-neon-green/10'
                                : 'border-casino-border-subtle hover:border-casino-neon-green/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color}`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-white">{type.label}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      required
                      className="w-full p-3 bg-casino-darker border border-casino-border-subtle rounded-lg text-white focus:border-casino-neon-green focus:outline-none"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Casino Name (for reviews) */}
                  {formData.post_type === 'review' && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Casino Name *
                      </label>
                      <Input
                        value={formData.casino_name}
                        onChange={(e) => setFormData({ ...formData, casino_name: e.target.value })}
                        placeholder="Enter casino name"
                        required={formData.post_type === 'review'}
                        className="bg-casino-darker border-casino-border-subtle text-white focus:border-casino-neon-green"
                      />
                    </div>
                  )}

                  {/* Rating (for reviews) */}
                  {formData.post_type === 'review' && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Rating *
                      </label>
                      <div className="flex items-center space-x-2">
                        {renderStars()}
                        <span className="text-sm text-gray-400 ml-4">
                          {formData.rating > 0 ? `${formData.rating}/5` : 'Click to rate'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter post title"
                      required
                      className="bg-casino-darker border-casino-border-subtle text-white focus:border-casino-neon-green"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Content *
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Share your thoughts, experience, or question..."
                      required
                      rows={6}
                      className="bg-casino-darker border-casino-border-subtle text-white focus:border-casino-neon-green resize-none"
                    />
                    <div className="text-sm text-gray-400 mt-1">
                      {formData.content.length}/1000 characters
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !formData.category_id || !formData.title || !formData.content}
                      className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-casino-dark border-t-transparent rounded-full animate-spin" />
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Create Post</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
