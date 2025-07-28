'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import ForumHero from '@/components/forum/ForumHero';
import ForumCategoriesNew from '@/src/components/forum/ForumCategoriesNew';
import ForumPostsList from '@/src/components/forum/ForumPostsList';
import CreatePostModal from '@/src/components/forum/CreatePostModal';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/ui/button';
import { Plus } from 'lucide-react';



const ForumPage = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="min-h-screen bg-casino-dark">
      <ForumHero />



      {/* Main Forum Content */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header with Create Post Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-white">Casino</span> <span className="gradient-text">Community Forum</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg">
                Share experiences, ask questions, and connect with fellow casino enthusiasts
              </p>
            </div>

            {user && (
              <Button
                onClick={() => setShowCreatePost(true)}
                className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark font-semibold px-6 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Post
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <ForumCategoriesNew
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>

            {/* Posts List */}
            <div className="lg:col-span-3">
              <ForumPostsList
                categoryId={selectedCategory}
                onPostCreated={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setShowCreatePost(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default ForumPage;
