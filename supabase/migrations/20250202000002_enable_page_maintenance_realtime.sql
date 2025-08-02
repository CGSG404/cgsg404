-- Enable realtime for page_maintenance table
-- This migration enables realtime subscriptions for the page_maintenance table

-- Enable realtime for page_maintenance table
ALTER TABLE public.page_maintenance REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_maintenance;
