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
  content: string;
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
      const randomCount = Math.floor(Math.random() * 101) + 20;
      setOnlineCount(randomCount);
      
      const nextUpdate = Math.floor(Math.random() * 5000) + 5000;
      onlineTimerRef.current = setTimeout(updateOnlineCount, nextUpdate);
    };
    
    updateOnlineCount();
    
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
      setIsLoading(true);
      try {
        const { data: messages, error: messagesError } = await supabase
          .from('chat_messages')
          .select(`
            *,
            profiles:user_id (username, avatar_url)
          `)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Messages error:', messagesError);
          throw messagesError;
        }
        
        if (messages) {
          const formattedMessages = messages.map(msg => ({
            ...msg,
            content: msg.message,
            username: msg.profiles?.username || `User-${msg.user_id.slice(0, 6)}`,
            avatar_url: msg.profiles?.avatar_url || undefined
          } as Message));
          
          setMessages(formattedMessages);
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error('Error in fetchMessages:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat pesan. Silakan refresh halaman.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Set up realtime subscription
    const setupRealtime = () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }

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
            
            const { data: userProfile } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', newMsg.user_id)
              .single();
              
            setMessages(prev => [
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
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.error('Realtime subscription error, reconnecting...');
            setTimeout(setupRealtime, 1000);
          }
        });
    };

    fetchMessages();
    setupRealtime();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Autentikasi Diperlukan',
        description: 'Silakan masuk untuk mengirim pesan',
        variant: 'destructive',
      });
      return;
    }

    const messageContent = newMessage.trim();
    if (!messageContent) return;
    
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      user_id: user.id,
      content: messageContent,
      username: user.user_metadata?.full_name || `User-${user.id.slice(0, 6)}`,
      avatar_url: user.user_metadata?.avatar_url,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setIsTyping(false);
    setIsLoading(true);
    
    setTimeout(scrollToBottom, 100);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: messageContent,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Remove the temporary message - it will be replaced by the real one via subscription
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      toast({
        title: 'Error',
        description: 'Gagal mengirim pesan. Silakan coba lagi.',
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
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-casino-neon-green text-casino-dark p-4 rounded-full shadow-lg hover:bg-casino-neon-green/90 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Buka obrolan global"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-casino-neon-green text-casino-dark p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-bold">Global Chat</h3>
          <div className="flex items-center text-xs bg-black/10 px-2 py-0.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            {onlineCount} online
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-casino-dark hover:text-casino-dark/80"
          aria-label="Tutup obrolan"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto max-h-96">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-500">
            <MessageCircle className="h-8 w-8 mb-2 text-gray-400" />
            <p className="font-medium">Belum ada pesan</p>
            <p className="text-sm">Jadilah yang pertama mengirim pesan!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'} mb-4`}
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
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none'
                }`}
              >
                {message.user_id !== user?.id && (
                  <div className="font-semibold text-xs mb-1">{message.username}</div>
                )}
                <p className="break-words">{message.content}</p>
                <div className={`text-xs mt-1 ${
                  message.user_id === user?.id ? 'text-casino-dark/70' : 'text-gray-500'
                }`}>
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

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              placeholder="Ketik pesan..."
              className={`pr-10 ${isTyping ? 'text-black' : 'text-casino-neon-green'}`}
              disabled={isLoading}
            />
            <button 
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <Button 
            type="submit" 
            className="bg-casino-neon-green hover:bg-casino-neon-green/90 text-casino-dark"
            disabled={!newMessage.trim() || isLoading}
          >
            {isLoading ? 'Mengirim...' : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LiveChat;
