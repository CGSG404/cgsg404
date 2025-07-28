'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MessageCircle, 
  Gift, 
  Target, 
  Trophy, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';

interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  color_class: string;
  display_order: number;
  posts_count: number;
}

interface ForumCategoriesNewProps {
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

const iconMap = {
  Star,
  MessageCircle,
  Gift,
  Target,
  Trophy,
  HelpCircle
};

export default function ForumCategoriesNew({ 
  selectedCategory, 
  onCategorySelect 
}: ForumCategoriesNewProps) {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/forum/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-casino-card-bg rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
      
      {/* All Posts Option */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
            selectedCategory === null 
              ? 'bg-casino-neon-green/20 border-casino-neon-green' 
              : 'bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-green/50'
          }`}
          onClick={() => onCategorySelect(null)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r from-casino-neon-green to-emerald-400`}>
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">All Posts</h4>
                  <p className="text-sm text-gray-400">View all discussions</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${
                selectedCategory === null ? 'text-casino-neon-green rotate-90' : 'text-gray-400'
              }`} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category List */}
      {categories.map((category, index) => {
        const IconComponent = iconMap[category.icon_name as keyof typeof iconMap] || MessageCircle;
        const isSelected = selectedCategory === category.id;
        
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (index + 2) }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? 'bg-casino-neon-green/20 border-casino-neon-green' 
                  : 'bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-green/50'
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color_class}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">{category.name}</h4>
                      <p className="text-sm text-gray-400 truncate">{category.description}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-casino-neon-green font-medium">
                          {category.posts_count} posts
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform flex-shrink-0 ${
                    isSelected ? 'text-casino-neon-green rotate-90' : 'text-gray-400'
                  }`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-casino-card-bg rounded-lg border border-casino-border-subtle"
      >
        <h4 className="font-semibold text-white mb-3">Forum Guidelines</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start">
            <span className="text-casino-neon-green mr-2">•</span>
            Be respectful to all members
          </li>
          <li className="flex items-start">
            <span className="text-casino-neon-green mr-2">•</span>
            Share honest casino experiences
          </li>
          <li className="flex items-start">
            <span className="text-casino-neon-green mr-2">•</span>
            No spam or promotional content
          </li>
          <li className="flex items-start">
            <span className="text-casino-neon-green mr-2">•</span>
            Help others with questions
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
