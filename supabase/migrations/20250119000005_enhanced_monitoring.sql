-- Enhanced Monitoring & Audit System for CGSG404
-- This migration adds comprehensive monitoring capabilities

-- Add severity column to admin_activity_logs if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'admin_activity_logs' 
                   AND column_name = 'severity') THEN
        ALTER TABLE public.admin_activity_logs 
        ADD COLUMN severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical'));
    END IF;
END $$;

-- Add session_id for tracking user sessions
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'admin_activity_logs' 
                   AND column_name = 'session_id') THEN
        ALTER TABLE public.admin_activity_logs 
        ADD COLUMN session_id TEXT;
    END IF;
END $$;

-- Create monitoring metrics table
CREATE TABLE IF NOT EXISTS public.admin_monitoring_metrics (
  id SERIAL PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_data JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create security alerts table
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  admin_user_id UUID REFERENCES public.admin_users(id),
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES public.admin_users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced admin logging function
CREATE OR REPLACE FUNCTION public.enhanced_admin_log(
  action_name text,
  resource_type_param text DEFAULT NULL,
  resource_id_param text DEFAULT NULL,
  details_param jsonb DEFAULT NULL,
  severity_level text DEFAULT 'info',
  session_id_param text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
  current_admin_id uuid;
BEGIN
  -- Get current admin user ID
  SELECT id INTO current_admin_id 
  FROM public.admin_users 
  WHERE user_id = auth.uid();
  
  -- Insert log entry
  INSERT INTO public.admin_activity_logs (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details,
    severity,
    session_id,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    current_admin_id,
    action_name,
    resource_type_param,
    resource_id_param,
    details_param,
    severity_level,
    session_id_param,
    inet_client_addr()::text,
    current_setting('request.headers', true)::json->>'user-agent',
    now()
  ) RETURNING id INTO log_id;
  
  -- Check for suspicious activity and create alerts
  PERFORM public.check_suspicious_activity(current_admin_id, action_name);
  
  RETURN log_id;
END;
$$;

-- Function to check suspicious activity
CREATE OR REPLACE FUNCTION public.check_suspicious_activity(
  admin_id uuid,
  action_performed text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recent_actions_count integer;
  admin_email text;
BEGIN
  -- Get admin email
  SELECT email INTO admin_email FROM public.admin_users WHERE id = admin_id;
  
  -- Check for rapid successive actions (more than 20 in 5 minutes)
  SELECT COUNT(*) INTO recent_actions_count
  FROM public.admin_activity_logs
  WHERE admin_user_id = admin_id
  AND created_at > now() - interval '5 minutes';
  
  IF recent_actions_count > 20 THEN
    INSERT INTO public.security_alerts (
      alert_type,
      severity,
      message,
      details,
      admin_user_id
    ) VALUES (
      'rapid_actions',
      'medium',
      'Rapid successive actions detected',
      jsonb_build_object(
        'admin_email', admin_email,
        'action_count', recent_actions_count,
        'time_window', '5 minutes',
        'last_action', action_performed
      ),
      admin_id
    );
  END IF;
  
  -- Check for critical actions
  IF action_performed IN ('delete_casino', 'delete_news', 'delete_admin_user') THEN
    INSERT INTO public.security_alerts (
      alert_type,
      severity,
      message,
      details,
      admin_user_id
    ) VALUES (
      'critical_action',
      'high',
      'Critical action performed: ' || action_performed,
      jsonb_build_object(
        'admin_email', admin_email,
        'action', action_performed,
        'timestamp', now()
      ),
      admin_id
    );
  END IF;
END;
$$;

-- Function to get admin metrics
CREATE OR REPLACE FUNCTION public.get_admin_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Only admins can access metrics
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  SELECT jsonb_build_object(
    'active_admins_today', (
      SELECT COUNT(DISTINCT admin_user_id)
      FROM public.admin_activity_logs
      WHERE created_at > CURRENT_DATE
    ),
    'total_actions_today', (
      SELECT COUNT(*)
      FROM public.admin_activity_logs
      WHERE created_at > CURRENT_DATE
    ),
    'total_actions_this_week', (
      SELECT COUNT(*)
      FROM public.admin_activity_logs
      WHERE created_at > CURRENT_DATE - interval '7 days'
    ),
    'critical_alerts_unresolved', (
      SELECT COUNT(*)
      FROM public.security_alerts
      WHERE severity = 'critical' AND is_resolved = false
    ),
    'high_alerts_unresolved', (
      SELECT COUNT(*)
      FROM public.security_alerts
      WHERE severity = 'high' AND is_resolved = false
    ),
    'top_actions_today', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'action', action,
          'count', action_count
        )
      )
      FROM (
        SELECT action, COUNT(*) as action_count
        FROM public.admin_activity_logs
        WHERE created_at > CURRENT_DATE
        GROUP BY action
        ORDER BY COUNT(*) DESC
        LIMIT 5
      ) top_actions
    ),
    'recent_critical_alerts', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', id,
          'alert_type', alert_type,
          'message', message,
          'created_at', created_at
        )
      )
      FROM (
        SELECT id, alert_type, message, created_at
        FROM public.security_alerts
        WHERE severity IN ('critical', 'high')
        AND is_resolved = false
        ORDER BY created_at DESC
        LIMIT 5
      ) recent_alerts
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to get admin activity summary
CREATE OR REPLACE FUNCTION public.get_admin_activity_summary(
  days_back integer DEFAULT 7
)
RETURNS TABLE(
  admin_email text,
  admin_role text,
  total_actions bigint,
  unique_action_types bigint,
  last_activity timestamp with time zone,
  most_common_action text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can access this data
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    au.email,
    au.role,
    COUNT(aal.id) as total_actions,
    COUNT(DISTINCT aal.action) as unique_action_types,
    MAX(aal.created_at) as last_activity,
    (
      SELECT action 
      FROM public.admin_activity_logs aal2 
      WHERE aal2.admin_user_id = au.id 
      AND aal2.created_at > now() - (days_back || ' days')::interval
      GROUP BY action 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as most_common_action
  FROM public.admin_users au
  LEFT JOIN public.admin_activity_logs aal ON au.id = aal.admin_user_id
  WHERE aal.created_at > now() - (days_back || ' days')::interval
     OR aal.created_at IS NULL
  GROUP BY au.id, au.email, au.role
  ORDER BY total_actions DESC;
END;
$$;

-- Function to resolve security alerts
CREATE OR REPLACE FUNCTION public.resolve_security_alert(
  alert_id uuid,
  resolution_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_admin_id uuid;
BEGIN
  -- Only admins can resolve alerts
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  -- Get current admin ID
  SELECT id INTO current_admin_id 
  FROM public.admin_users 
  WHERE user_id = auth.uid();
  
  -- Update alert
  UPDATE public.security_alerts
  SET 
    is_resolved = true,
    resolved_by = current_admin_id,
    resolved_at = now(),
    details = details || jsonb_build_object('resolution_notes', resolution_notes)
  WHERE id = alert_id;
  
  -- Log the resolution
  PERFORM public.enhanced_admin_log(
    'alert_resolved',
    'security_alert',
    alert_id::text,
    jsonb_build_object('resolution_notes', resolution_notes),
    'info'
  );
  
  RETURN FOUND;
END;
$$;

-- Enable RLS on new tables
ALTER TABLE public.admin_monitoring_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for monitoring tables
CREATE POLICY "Admins can view monitoring metrics" ON public.admin_monitoring_metrics
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert monitoring metrics" ON public.admin_monitoring_metrics
FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view security alerts" ON public.security_alerts
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update security alerts" ON public.security_alerts
FOR UPDATE USING (public.is_admin());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user_id ON public.admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_action ON public.admin_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_severity ON public.admin_activity_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON public.security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_is_resolved ON public.security_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON public.security_alerts(created_at);
