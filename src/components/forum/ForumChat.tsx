
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface ChatMessage {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  profiles: Profile | null;
  is_edited?: boolean;
}

interface Message {
  id: string;
  text: string;
}

const ForumChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const initChat = async () => {
      await fetchMessages();
      const unsubscribe = setupRealtimeSubscription();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    };
    
    initChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, fetch all messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (messagesError) throw messagesError;

      // Then, fetch profiles for all unique user IDs
      const userIds = [...new Set(messagesData?.map(msg => msg.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile]) || []);

      // Combine messages with their respective profiles
      const formattedMessages = (messagesData || []).map(msg => ({
        id: msg.id,
        message: msg.message,
        created_at: msg.created_at,
        user_id: msg.user_id,
        is_edited: false,
        profiles: profilesMap.get(msg.user_id) || null
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching forum messages:', error);
      toast.error('Failed to load forum messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: 'event=eq.insert'
        },
        async (payload: any) => {
          if (payload.new) {
            const profile = await fetchUserProfile(payload.new.user_id);
            setMessages((prev) => [
              ...prev,
              {
                id: payload.new.id,
                message: payload.new.message,
                created_at: payload.new.created_at,
                user_id: payload.new.user_id,
                is_edited: false,
                profiles: profile
              }
            ]);
          }
        }
      )
      .subscribe((status) => {
        console.log('Forum chat subscription status:', status);
      });

    return () => {
      channel.unsubscribe();
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      if (editingMessage) {
        // Update existing message
        const { error } = await supabase
          .from('chat_messages')
          .update({ 
            message: newMessage.trim(),
            updated_at: new Date().toISOString() 
          })
          .eq('id', editingMessage.id);
          
        if (error) throw error;
        setEditingMessage(null);
      } else {
        // Send new message
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            message: newMessage.trim(),
            user_id: user.id
          });
          
        if (error) throw error;
      }

      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  const handleEditMessage = (message: ChatMessage) => {
    setEditingMessage({ id: message.id, text: message.message });
    setNewMessage(message.message);
    inputRef.current?.focus();
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Update UI by removing the deleted message
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getAvatarUrl = (avatarUrl: string | null) => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith('http')) return avatarUrl;
    return `https://hyuomkqzebyiagrmjlks.supabase.co/storage/v1/object/public/avatars/${avatarUrl}`;
  };

  if (loading) {
    return (
      <Card className="bg-casino-card-bg border-casino-border-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageCircle className="w-5 h-5 text-casino-neon-green" />
            Live Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded mb-2 w-1/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-casino-card-bg border-casino-border-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <MessageCircle className="w-5 h-5 text-casino-neon-green" />
            <span>Live Chat</span>
            {isTyping && (
              <span className="text-xs text-gray-400 flex items-center">
                <span className="animate-pulse">•</span> Someone is typing...
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-96 overflow-y-auto space-y-3 border border-casino-border-subtle rounded-lg p-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`group flex gap-3 hover:bg-casino-dark/30 p-2 rounded-lg transition-colors ${
                  message.user_id === user?.id ? 'pl-10' : ''
                }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={getAvatarUrl(message.profiles?.avatar_url || null) || undefined} />
                  <AvatarFallback className="bg-casino-neon-green text-casino-dark text-xs">
                    {message.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm truncate">
                      {message.profiles?.username || 'Unknown User'}
                    </span>
                    <span className="text-gray-400 text-xs whitespace-nowrap">
                      {formatTime(message.created_at)}
                      {message.is_edited && (
                        <span className="text-xs text-gray-500 ml-1">(edited)</span>
                      )}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm break-words">{message.message}</p>
                  
                  {message.user_id === user?.id && (
                    <div className="mt-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditMessage(message)}
                        className="text-xs text-gray-400 hover:text-casino-neon-green"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-xs text-gray-400 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {user ? (
          <form onSubmit={sendMessage} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  // Show typing indicator
                  setIsTyping(true);
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }
                  typingTimeoutRef.current = setTimeout(() => {
                    setIsTyping(false);
                  }, 2000);
                }}
                placeholder={editingMessage ? 'Edit your message...' : 'Type your message...'}
                className="w-full bg-casino-dark border-casino-border-subtle text-white placeholder-gray-500 pr-10"
                disabled={sending}
                maxLength={500}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                {newMessage.length}/500
              </div>
            </div>
            <Button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 whitespace-nowrap"
            >
              {editingMessage ? (
                <span>Update</span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  <span>Send</span>
                </>
              )}
            </Button>
            {editingMessage && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingMessage(null);
                  setNewMessage('');
                }}
                className="text-gray-400 border-gray-600 hover:bg-gray-800"
              >
                Cancel
              </Button>
            )}
          </form>
        ) : (
          <div className="text-center p-4 bg-casino-dark/50 rounded-lg">
            <p className="text-gray-400 mb-2">Please sign in to join the chat</p>
            <Button 
              onClick={() => (window.location.href = '/auth')}
              className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
            >
              Sign In
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForumChat;
