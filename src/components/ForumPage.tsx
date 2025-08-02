'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import ForumHero from '@/components/forum/ForumHero';
import ForumPostsList from '@/src/components/forum/ForumPostsList';
import TweetComposer from '@/src/components/forum/TweetComposer';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/ui/button';
import { Plus, Users, MessageCircle, TrendingUp, Refresh } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import MaintenanceWrapper from './MaintenanceWrapper';

const ForumPage = () => {
  const { user } = useAuth();
  const [isSubmittingTweet, setIsSubmittingTweet] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTweetSubmit = async (content: string) => {
    setIsSubmittingTweet(true);
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          content: content,
          post_type: 'tweet',
          user_id: user?.id,
          user_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous',
          user_avatar: user?.user_metadata?.avatar_url || null,
        })
      });

      if (response.ok) {
        // Trigger refresh of posts list
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
    } finally {
      setIsSubmittingTweet(false);
    }
  };

  return (
    <MaintenanceWrapper>
      <div className="min-h-screen bg-casino-dark">
      <ForumHero />

      {/* Content Divider */}
      <section className="py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            {/* Main Divider Line */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-casino-neon-green/30 to-transparent"></div>
            </div>

            {/* Center Icon - Perfectly Centered */}
            <div className="relative z-10 bg-casino-dark px-2 sm:px-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-casino-neon-green/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-casino-neon-green" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Forum Content */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
              <span className="text-white">Casino</span>{' '}
              <span className="bg-gradient-to-r from-casino-neon-green via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Share your thoughts, experiences, and connect with fellow casino enthusiasts in real-time.
            </p>
          </motion.div>

          {/* Tweet Composer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <TweetComposer
              onTweetSubmit={handleTweetSubmit}
              isSubmitting={isSubmittingTweet}
            />
          </motion.div>

          {/* Posts Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl mx-auto"
            data-section="forum-content"
          >
            <ForumPostsList
              categoryId={null}
              onPostCreated={() => {}}
              refreshTrigger={refreshTrigger}
            />
          </motion.div>
        </div>
      </section>

      <Footer />
      </div>
    </MaintenanceWrapper>
  );
};

export default ForumPage;
