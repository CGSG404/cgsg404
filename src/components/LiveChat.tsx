import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, X, Users, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

declare global {
  interface Window {
    // Add any global window properties here if needed
  }
}

interface DatabaseMessage {
  id: string;
  message: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string | null;
  email?: string;
}

interface Message extends Omit<DatabaseMessage, 'message'> {
  content: string; // Alias for message to match component usage
  username: string;
  avatar_url?: string;
}

const LiveChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const onlineTimerRef = useRef<NodeJS.Timeout>();
  const channelRef = useRef<any>(null);

  // Simulate online users count
  useEffect(() => {
    const updateOnlineCount = () => {
      // Generate random number between 20-120
      const randomCount = Math.floor(Math.random() * 101) + 20;
      setOnlineCount(randomCount);
      
      // Schedule next update between 5-10 seconds
      const nextUpdate = Math.floor(Math.random() * 5000) + 5000;
      onlineTimerRef.current = setTimeout(updateOnlineCount, nextUpdate);
    };
    
    // Initial update
    updateOnlineCount();
    
    // Cleanup on unmount
    return () => {
      if (onlineTimerRef.current) {
        clearTimeout(onlineTimerRef.current);
      }
    };
  }, []);

  // Fetch initial messages and set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        // First, get all messages
        const { data: messages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        
        if (messages && messages.length > 0) {
          // Get unique user IDs from messages
          const userIds = [...new Set(messages.map(msg => msg.user_id))];
          
          // Fetch user profiles in a single query
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', userIds);
            
          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            throw new Error('Failed to load user profiles');
          }
          
          // Create a map of user profiles for quick lookup
          const profilesMap = new Map<string, UserProfile>(
            (profilesData || []).map(profile => [profile.id, profile as UserProfile])
          );
          
          // Combine messages with user data
          const formattedMessages = messages.map(msg => {
            const userProfile = profilesMap.get(msg.user_id);
            return {
              ...msg,
              content: msg.message,
              username: userProfile?.username || `User-${msg.user_id.slice(0, 6)}`,
              avatar_url: userProfile?.avatar_url || undefined
            } as Message;
          });
          
          setMessages(formattedMessages);
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages. Please refresh the page.',
          variant: 'destructive',
        });
      }
    };

    // Set up realtime subscription
    channelRef.current = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
        },
        async (payload) => {
          const newMsg = payload.new as DatabaseMessage;
          
          // Fetch user profile for the new message
          // Get user profile for the new message
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', newMsg.user_id)
            .single();
            
          setMessages((prev) => [
            ...prev, 
            {
              ...newMsg,
              content: newMsg.message,
              username: userProfile?.username || `User-${newMsg.user_id.slice(0, 6)}`,
              avatar_url: userProfile?.avatar_url || undefined
            }
          ]);
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    fetchMessages();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to send messages',
        variant: 'destructive',
      });
      return;
    }

    if (!newMessage.trim()) return;
    
    const messageToSend = newMessage.trim();
    setNewMessage('');
    setIsTyping(false);
    setIsLoading(true);

    try {
      // Insert the message with content
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: messageToSend
        });

      if (error) throw error;
      
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 -translate-y-1/2 right-6 bg-casino-neon-green text-casino-dark p-4 rounded-full shadow-lg hover:bg-casino-neon-green/90 transition-colors z-50"
        aria-label="Toggle Live Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-casino-neon-green text-casino-dark p-4 rounded-full shadow-lg hover:bg-casino-neon-green/90 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open global chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-casino-neon-green hover:bg-casino-neon-green/90 text-casino-dark font-semibold rounded-full shadow-lg z-50 flex items-center gap-2 transition-all hover:scale-105"
      >
        <MessageCircle className="w-6 h-6" />
        <span>Chat</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-2 right-2 w-full max-w-[95vw] h-[70vh] sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] bg-gradient-to-br from-casino-dark-800 to-casino-darker rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden border border-casino-neon-green/20 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-green/5 border-b border-casino-neon-green/20 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-casino-neon-green/20 rounded-lg">
            <MessageCircle className="w-5 h-5 text-casino-neon-green" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {user ? 'Global Chat' : 'Please Sign In'}
          </h3>
          {user && (
            <div className="flex items-center gap-1.5 text-sm text-casino-neon-green bg-casino-neon-green/10 px-3 py-1.5 rounded-full border border-casino-neon-green/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-casino-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-casino-neon-green"></span>
              </span>
              <span className="text-sm font-medium text-white">{onlineCount} online</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Online users"
          >
            <Users className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-casino-dark-900/80 to-casino-darker/90">
        {!user ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <MessageCircle className="w-12 h-12 text-casino-neon-green/50 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Sign In to Chat</h3>
            <p className="text-gray-400 mb-6">Please sign in to join the conversation</p>
            <Button 
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${window.location.origin}/forum`
                    }
                  });
                  
                  if (error) throw error;
                } catch (error) {
                  console.error('Error signing in with Google:', error);
                  toast({
                    title: 'Sign In Error',
                    description: 'Failed to sign in with Google. Please try again.',
                    variant: 'destructive',
                  });
                }
              }}
              className="bg-casino-neon-green hover:bg-casino-neon-green/90 text-casino-dark font-medium"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-center p-4">
            <div>
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm">Be the first to send a message!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              {message.user_id !== user?.id && (
                <Avatar className="h-8 w-8 mt-1 mr-2">
                  <AvatarImage src={message.avatar_url} alt={message.username} />
                  <AvatarFallback>
                    {message.username ? message.username.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`max-w-[75%] p-3 rounded-2xl ${
                  message.user_id === user?.id 
                    ? 'bg-casino-neon-green text-casino-dark rounded-br-none' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-sm'
                }`}
              >
                {message.user_id !== user?.id && (
                  <div className="text-xs font-semibold mb-1 text-casino-neon-green">
                    {message.username}
                  </div>
                )}
                <p className="text-sm break-words">{message.content}</p>
                <div className={`text-xs mt-1 opacity-70 ${message.user_id === user?.id ? 'text-right' : 'text-left'}`}>
                  {formatDistanceToNow(new Date(message.created_at), { 
                    addSuffix: true,
                    locale: id 
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {user && (
        <div className="p-4 border-t border-casino-neon-green/10 bg-casino-dark-800/80 backdrop-blur-sm">
          <form onSubmit={sendMessage} className="space-y-2">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    setIsTyping(true);
                  }}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  placeholder="Type your message..."
                  className={`pr-12 rounded-xl border-casino-neon-green/30 bg-casino-dark-700/50 placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-casino-neon-green/50 focus-visible:ring-offset-0 focus-visible:border-casino-neon-green/50 ${
                    isTyping ? 'text-black' : 'text-casino-neon-green'
                  }`}
                  disabled={isLoading}
                />
                <div className="absolute right-2 bottom-2 flex space-x-1">
                  <button 
                    type="button"
                    className="p-1 rounded-full text-gray-400 hover:text-casino-neon-green transition-colors"
                    aria-label="Add emoji"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!newMessage.trim() || isLoading}
                className="h-10 w-10 p-0 rounded-full bg-gradient-to-br from-casino-neon-green to-emerald-500 hover:from-casino-neon-green/90 hover:to-emerald-500/90 text-casino-dark font-medium shadow-lg shadow-casino-neon-green/20 hover:shadow-casino-neon-green/30 transition-all duration-300 hover:scale-105 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-casino-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              <span className="bg-gradient-to-r from-casino-neon-green to-emerald-400 bg-clip-text text-transparent font-medium">Global chat</span> is visible to all users. Be kind and respectful.
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
