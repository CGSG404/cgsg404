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
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Categories</h3>
        <button
          onClick={() => onCategorySelect(null)}
          className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-casino-neon-green text-casino-dark shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-casino-card-bg border border-casino-border-subtle'
          }`}
        >
          All
        </button>
      </div>

      {/* All Posts Option */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card
          className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
            selectedCategory === null
              ? 'bg-casino-neon-green/20 border-casino-neon-green shadow-lg shadow-casino-neon-green/20'
              : 'bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-green/50 hover:shadow-lg hover:shadow-casino-neon-green/10'
          }`}
          onClick={() => onCategorySelect(null)}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r from-casino-neon-green to-emerald-400 transition-all duration-200`}>
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-white mb-1">All Posts</h4>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">View all discussions</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                  selectedCategory === null
                    ? 'text-casino-neon-green rotate-90'
                    : 'text-gray-400 group-hover:text-casino-neon-green'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category List */}
      <div className="space-y-2 sm:space-y-3">
        {categories.map((category, index) => {
          const IconComponent = iconMap[category.icon_name as keyof typeof iconMap] || MessageCircle;
          const isSelected = selectedCategory === category.id;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 group ${
                  isSelected
                    ? 'bg-casino-neon-green/20 border-casino-neon-green shadow-lg shadow-casino-neon-green/20'
                    : 'bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-green/50 hover:shadow-lg hover:shadow-casino-neon-green/10'
                }`}
                onClick={() => onCategorySelect(category.id)}
              >
                <CardContent className="p-3 sm:p-4">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color_class} transition-all duration-200 ${
                          isSelected ? 'scale-110' : 'group-hover:scale-110'
                        }`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm transition-colors line-clamp-1 ${
                          isSelected ? 'text-casino-neon-green' : 'text-white group-hover:text-casino-neon-green'
                        }`}>
                          {category.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-casino-neon-green/20 text-casino-neon-green'
                              : 'bg-casino-darker text-gray-400'
                          }`}>
                            {category.posts_count} posts
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                          isSelected
                            ? 'text-casino-neon-green rotate-90'
                            : 'text-gray-400 group-hover:text-casino-neon-green group-hover:translate-x-1'
                        }`} />
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color_class} transition-all duration-200 ${
                          isSelected ? 'scale-110' : 'group-hover:scale-110'
                        }`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-base lg:text-lg transition-colors mb-1 line-clamp-1 ${
                          isSelected ? 'text-casino-neon-green' : 'text-white group-hover:text-casino-neon-green'
                        }`}>
                          {category.name}
                        </h4>
                        <p className="text-sm lg:text-base text-gray-400 line-clamp-2 mb-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            isSelected
                              ? 'bg-casino-neon-green/20 text-casino-neon-green'
                              : 'bg-casino-darker text-gray-400'
                          }`}>
                            {category.posts_count} {category.posts_count === 1 ? 'post' : 'posts'}
                          </span>

                          {category.posts_count > 0 && (
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${
                                isSelected ? 'bg-casino-neon-green' : 'bg-green-400'
                              }`} />
                              <span className="text-xs text-gray-500">Active</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ChevronRight className={`w-5 h-5 transition-all duration-200 ${
                          isSelected
                            ? 'text-casino-neon-green rotate-90'
                            : 'text-gray-400 group-hover:text-casino-neon-green group-hover:translate-x-1'
                        }`} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Forum Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 lg:mt-8 p-4 lg:p-6 bg-casino-card-bg rounded-lg border border-casino-border-subtle"
      >
        <h4 className="font-semibold text-white text-sm sm:text-base lg:text-lg mb-3 lg:mb-4">Forum Guidelines</h4>
        <ul className="space-y-2 lg:space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-casino-neon-green text-sm lg:text-base mt-0.5">•</span>
            <span className="text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
              Be respectful to all members
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-casino-neon-green text-sm lg:text-base mt-0.5">•</span>
            <span className="text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
              Share honest casino experiences
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-casino-neon-green text-sm lg:text-base mt-0.5">•</span>
            <span className="text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
              No spam or promotional content
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-casino-neon-green text-sm lg:text-base mt-0.5">•</span>
            <span className="text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
              Help others with questions
            </span>
          </li>
        </ul>
      </motion.div>

      {/* Quick Actions - Desktop Only */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="hidden lg:block mt-6 space-y-3"
      >
        <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Quick Actions</h4>

        <button className="w-full text-left p-3 rounded-lg bg-casino-card-bg border border-casino-border-subtle hover:border-casino-neon-green/50 transition-all duration-200 group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white group-hover:text-casino-neon-green transition-colors">Latest Posts</div>
              <div className="text-xs text-gray-400">View recent activity</div>
            </div>
          </div>
        </button>

        <button className="w-full text-left p-3 rounded-lg bg-casino-card-bg border border-casino-border-subtle hover:border-casino-neon-green/50 transition-all duration-200 group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white group-hover:text-casino-neon-green transition-colors">Top Contributors</div>
              <div className="text-xs text-gray-400">See active members</div>
            </div>
          </div>
        </button>
      </motion.div>
    </div>
  );
}
