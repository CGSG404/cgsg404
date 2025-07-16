// src/components/ReviewComments.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';

// Definisikan tipe data untuk komentar
interface Comment {
  id: number;
  created_at: string;
  content: string;
  review_slug: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

// Definisikan props untuk komponen
interface ReviewCommentsProps {
  reviewSlug: string;
}

const ReviewComments = ({ reviewSlug }: ReviewCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mengambil data pengguna dan komentar saat komponen dimuat
  useEffect(() => {
    const fetchUserAndComments = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('review_slug', reviewSlug)
        .order('created_at', { ascending: false });

      if (commentsData) {
        setComments(commentsData as Comment[]);
      }
      if (error) {
        console.error('Error fetching comments:', error);
      }
      setLoading(false);
    };

    fetchUserAndComments();
  }, [reviewSlug]);

  // Fungsi untuk mengirim komentar baru
  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const { data, error } = await supabase
      .from('comments')
      .insert([{ content: newComment, review_slug: reviewSlug, user_id: user.id }])
      .select('*, profiles(username, avatar_url)')
      .single();

    if (data) {
      setComments([data as Comment, ...comments]);
      setNewComment('');
    } else if (error) {
      console.error('Error posting comment:', error.message);
      alert('Failed to post comment. Please try again.');
    }
  };

  return (
    <div className="bg-casino-dark-secondary/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-white/10 mt-12">
      <h3 className="text-2xl font-bold text-white mb-6 border-b-2 border-casino-neon-green/30 pb-3">Visitor Comments</h3>
      <div className="space-y-6">
        {/* Form Komentar - hanya tampil jika user login */}
        {user ? (
          <form onSubmit={handlePostComment} className="pt-6 border-t border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Leave a Comment</h4>
            <textarea
              className="w-full bg-gray-800/60 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-casino-neon-green focus:border-transparent transition-all duration-300"
              rows={4}
              placeholder={`Commenting as ${user.email}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-casino-neon-green text-casino-dark font-bold rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newComment.trim()}
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="text-center py-4 border-t border-white/10">
            <p className="text-gray-300">You must be logged in to post a comment.</p>
            {/* Anda bisa menambahkan tombol login di sini */}
          </div>
        )}

        {/* Daftar Komentar */}
        <div className="space-y-4">
          {loading ? (
            <p className='text-gray-400'>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0 border border-white/10">
                  {/* Avatar bisa ditambahkan di sini: <img src={comment.profiles?.avatar_url} /> */}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{comment.profiles?.username || 'User'}</p>
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
