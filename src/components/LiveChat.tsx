import React from 'react';
// import { useAuth } from '@/src/contexts/AuthContext'; // TEMPORARILY DISABLED
// import { useToast } from '@/src/components/ui/use-toast';
// import { supabase } from '@/src/lib/supabaseClient';
// import { Button } from '@/src/components/ui/button';
// import { Input } from '@/src/components/ui/input';
// import { Send, MessageCircle, X, Users, Smile } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
// import { formatDistanceToNow } from 'date-fns';
// import { enUS } from 'date-fns/locale';

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
  // TEMPORARILY DISABLED - LiveChat disabled while fixing auth issues
  return null;
};

export default LiveChat;
