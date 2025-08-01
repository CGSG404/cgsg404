'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image as ImageIcon, 
  Smile, 
  X,
  Lock,
  Globe,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { Card, CardContent } from '@/src/components/ui/card';
import { useAuth } from '@/src/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface TweetComposerProps {
  onTweetSubmit: (content: string) => void;
  isSubmitting?: boolean;
}

export default function TweetComposer({ onTweetSubmit, isSubmitting = false }: TweetComposerProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 280;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= maxChars) {
      setContent(newContent);
      setCharCount(newContent.length);
    }
  };

  const handleSubmit = () => {
    if (content.trim() && user) {
      onTweetSubmit(content.trim());
      setContent('');
      setCharCount(0);
      setIsExpanded(false);
    }
  };

  const handleFocus = () => {
    if (user) {
      setIsExpanded(true);
    }
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardContent className="p-6 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-casino-neon-green/10 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-casino-neon-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Join the Conversation</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Sign in with your Google account to share your thoughts, experiences, and connect with fellow casino enthusiasts.
              </p>
              <Link href="/auth">
                <Button className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-casino-neon-green/25">
                  <Globe className="w-5 h-5 mr-2" />
                  Sign in with Google
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-casino-card-bg border-casino-border-subtle">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex gap-2 sm:gap-3 lg:gap-4">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <Image
                src={user.user_metadata?.avatar_url || '/default-avatar.png'}
                alt={user.user_metadata?.full_name || 'User'}
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-casino-border-subtle"
              />
            </div>

            {/* Composer */}
            <div className="flex-1 min-w-0">
              <div className="space-y-3">
                {/* Textarea */}
                <Textarea
                  value={content}
                  onChange={handleContentChange}
                  onFocus={handleFocus}
                  placeholder="What's happening in the casino world?"
                  className={`bg-transparent border-none resize-none text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base lg:text-lg leading-relaxed transition-all duration-200 ${
                    isExpanded ? 'min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]' : 'min-h-[40px] sm:min-h-[50px] lg:min-h-[60px]'
                  }`}
                  disabled={isSubmitting}
                />

                {/* Expanded Options */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Character Count & Warning */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {charCount > maxChars * 0.8 && (
                            <div className="flex items-center gap-1 text-orange-400">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">Character limit approaching</span>
                            </div>
                          )}
                        </div>
                        <div className={`text-sm font-medium ${
                          charCount > maxChars * 0.9 
                            ? 'text-red-400' 
                            : charCount > maxChars * 0.8 
                              ? 'text-orange-400' 
                              : 'text-gray-400'
                        }`}>
                          {charCount}/{maxChars}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-casino-border-subtle">
                        <div className="flex items-center gap-2">
                          {/* Future: Image Upload */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-casino-neon-green p-2"
                            disabled
                          >
                            <ImageIcon className="w-5 h-5" />
                          </Button>
                          
                          {/* Future: Emoji Picker */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-casino-neon-green p-2"
                            disabled
                          >
                            <Smile className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Cancel Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsExpanded(false);
                              setContent('');
                              setCharCount(0);
                            }}
                            className="text-gray-400 hover:text-white"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>

                          {/* Submit Button */}
                          <Button
                            onClick={handleSubmit}
                            disabled={!content.trim() || isSubmitting || charCount > maxChars}
                            className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark font-semibold px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2 text-xs sm:text-sm lg:text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-casino-neon-green/25 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-casino-dark border-t-transparent rounded-full animate-spin"></div>
                                <span className="hidden sm:inline">Posting...</span>
                                <span className="sm:hidden">...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Post</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
