// src/components/ReviewComments.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';

// Define the data type for a comment
interface Comment {
  id: number;
  created_at: string;
  content: string;
  review_slug: string;
  user_id: string;
  profile: {
    username: string;
    avatar_url: string | null;
  } | null;
}

// Define props for the component
interface ReviewCommentsProps {
  reviewSlug: string;
}

const ReviewComments = ({ reviewSlug }: ReviewCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const MAX_CHARACTERS = 500;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to generate avatar URL with Google profile picture support
  const getAvatarUrl = (username: string, avatarUrl: string | null) => {
    if (avatarUrl) {
      return avatarUrl; // Use Google avatar or custom avatar if available
    }
    
    // Fallback to generated avatar
    const cleanUsername = username.replace(/\s+/g, '+');
    return `https://ui-avatars.com/api/?name=${cleanUsername}&size=200&background=1f2937&color=10b981&bold=true&font-size=0.6`;
  };



  // Fetch user data and comments when the component mounts
  useEffect(() => {
    const fetchUserAndComments = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profile:profiles(username, avatar_url)
        `)
        .eq('review_slug', reviewSlug)
        .order('created_at', { ascending: false });

      if (data) {
        setComments(data as Comment[]);
      }
      if (error) {
        console.error('Error fetching comments:', error);
      }
      setLoading(false);
    };

    fetchUserAndComments();
  }, [reviewSlug]);

  // Function to post a new comment
  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    // Step 1: Insert the new comment
    const { data: insertData, error: insertError } = await supabase
      .from('comments')
      .insert([{ content: newComment, review_slug: reviewSlug, user_id: user.id }])
      .select('id') // Select only the ID of the new comment
      .single();

    if (insertError) {
      console.error('Error posting comment:', insertError);
      alert('Failed to post comment. Please try again.');
      return;
    }

    if (insertData) {
      // Step 2: Fetch the new comment with the profile data joined
      const { data: newCommentData, error: selectError } = await supabase
        .from('comments')
        .select('*, profile:profiles(username, avatar_url)')
        .eq('id', insertData.id)
        .single();

      if (selectError) {
        console.error('Error fetching new comment:', selectError);
      } else if (newCommentData) {
        setComments([newCommentData as Comment, ...comments]);
        setNewComment('');
      }
    }
  };

  return (
    <div className="bg-casino-dark-secondary/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-white/10 mt-12">
      <h3 className="text-2xl font-bold text-white mb-6 border-b-2 border-casino-neon-green/30 pb-3">Visitor Comments</h3>
      <div className="space-y-6">
        {/* Comment Form - only shows if user is logged in */}
        {user ? (
          <form onSubmit={handlePostComment} className="pt-6 border-t border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Leave a Comment</h4>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-casino-dark p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-casino-neon-green focus:outline-none text-white transition-all duration-300 h-28 resize-none"
              placeholder="Share your thoughts..."
              maxLength={MAX_CHARACTERS}
            />
            <div className="text-right text-sm text-gray-400 mt-2">
              {MAX_CHARACTERS - newComment.length} characters remaining
            </div>
            <button
              type="submit"
              disabled={!newComment.trim() || newComment.length > MAX_CHARACTERS}
              className="bg-casino-neon-green text-casino-dark font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="text-center py-4 border-t border-white/10">
            <p className="text-gray-300">You must be logged in to post a comment.</p>
            {/* Login button can be added here */}
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <p className='text-gray-400'>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0 border border-white/10 overflow-hidden">
                  <img 
                    src={getAvatarUrl(comment.profile?.username || 'User', comment.profile?.avatar_url)} 
                    alt={`${comment.profile?.username}'s avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${comment.profile?.username || 'User'}&size=200&background=374151&color=fff&bold=true`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{comment.profile?.username || 'User'}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-gray-300 mt-1 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewComments;
