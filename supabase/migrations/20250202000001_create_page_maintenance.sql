-- Create page maintenance system for CGSG404
-- This migration creates table to manage maintenance mode for each page

-- Create page_maintenance table
CREATE TABLE public.page_maintenance (
  id SERIAL PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  is_maintenance BOOLEAN DEFAULT false,
  maintenance_message TEXT DEFAULT 'This page is currently under maintenance. Please check back later.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default pages from navbar
INSERT INTO public.page_maintenance (page_path, page_name, is_maintenance, maintenance_message) VALUES
('/', 'Homepage', false, 'Our homepage is currently under maintenance. We''re working to improve your experience.'),
('/top-casinos', 'Best Casinos', false, 'Our Best Casinos page is currently under maintenance. Please check back soon for the latest casino recommendations.'),
('/casinos', 'All Casinos', false, 'Our Casinos directory is currently under maintenance. We''re updating our casino database.'),
('/reviews', 'Reviews', false, 'Our Reviews section is currently under maintenance. We''re working on bringing you the latest casino reviews.'),
('/list-report', 'List Report', false, 'Our List Report feature is currently under maintenance. Please try again later.'),
('/forum', 'Forum', false, 'Our Forum is currently under maintenance. We''re improving the community experience.'),
('/guide', 'Guide', false, 'Our Guide section is currently under maintenance. We''re updating our casino guides.'),
('/news', 'News', false, 'Our News section is currently under maintenance. We''re working on bringing you the latest casino news.');

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_page_maintenance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating timestamp
CREATE TRIGGER update_page_maintenance_timestamp
  BEFORE UPDATE ON public.page_maintenance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_page_maintenance_timestamp();

-- Enable RLS
ALTER TABLE public.page_maintenance ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to check maintenance status
CREATE POLICY "Public can view page maintenance status" ON public.page_maintenance FOR SELECT 
USING (true);

-- Only admins can modify maintenance status
CREATE POLICY "Admins can manage page maintenance" ON public.page_maintenance FOR ALL 
USING (public.is_admin());

-- Create indexes for performance
CREATE INDEX idx_page_maintenance_path ON public.page_maintenance(page_path);
CREATE INDEX idx_page_maintenance_status ON public.page_maintenance(is_maintenance);

-- Create function to get maintenance status for a page
CREATE OR REPLACE FUNCTION public.get_page_maintenance_status(page_path_param TEXT)
RETURNS TABLE(
  is_maintenance BOOLEAN,
  maintenance_message TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT pm.is_maintenance, pm.maintenance_message
  FROM public.page_maintenance pm
  WHERE pm.page_path = page_path_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to toggle maintenance mode
CREATE OR REPLACE FUNCTION public.toggle_page_maintenance(
  page_path_param TEXT,
  maintenance_status BOOLEAN,
  message_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  result BOOLEAN;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Update maintenance status
  UPDATE public.page_maintenance 
  SET 
    is_maintenance = maintenance_status,
    maintenance_message = COALESCE(message_param, maintenance_message)
  WHERE page_path = page_path_param;

  -- Check if update was successful
  GET DIAGNOSTICS result = ROW_COUNT;
  
  -- Log admin activity
  INSERT INTO public.admin_activity_logs (
    admin_id,
    action,
    details,
    ip_address,
    severity
  ) VALUES (
    auth.uid(),
    'toggle_page_maintenance',
    jsonb_build_object(
      'page_path', page_path_param,
      'maintenance_status', maintenance_status,
      'message', COALESCE(message_param, 'Default message')
    ),
    inet_client_addr()::text,
    'info'
  );

  RETURN result > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON public.page_maintenance TO anon, authenticated;
GRANT ALL ON public.page_maintenance TO service_role;
GRANT EXECUTE ON FUNCTION public.get_page_maintenance_status(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_page_maintenance(TEXT, BOOLEAN, TEXT) TO authenticated;
