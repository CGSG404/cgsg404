-- Create the forum_messages table
CREATE TABLE IF NOT EXISTS public.forum_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.forum_messages ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS forum_messages_user_id_idx ON public.forum_messages(user_id);
CREATE INDEX IF NOT EXISTS forum_messages_created_at_idx ON public.forum_messages(created_at);

-- Policies
CREATE POLICY "Enable read access for all users" 
ON public.forum_messages 
FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.forum_messages
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for message owners"
ON public.forum_messages
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for message owners"
ON public.forum_messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.is_edited = TRUE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forum_messages_updated_at
BEFORE UPDATE ON public.forum_messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
