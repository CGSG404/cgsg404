
-- Create polls table for live voting system
CREATE TABLE public.polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

-- Polls policies (public read, authenticated users can vote)
CREATE POLICY "Polls are viewable by everyone" 
  ON public.polls 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can vote" 
  ON public.polls 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update their own votes" 
  ON public.polls 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable real-time for polls table
ALTER TABLE public.polls REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
