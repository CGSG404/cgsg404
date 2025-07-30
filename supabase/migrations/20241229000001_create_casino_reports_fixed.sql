-- Create casino_reports table (Fixed version)
-- This migration creates the casino reports table with proper admin integration

-- Create casino_reports table
CREATE TABLE IF NOT EXISTS public.casino_reports (
  id SERIAL PRIMARY KEY,
  casino_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('Unlicensed', 'Scam Indicated', 'Many Users Reported')),
  last_reported DATE NOT NULL,
  summary TEXT NOT NULL,
  url VARCHAR(500) DEFAULT '#',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_casino_reports_casino_name ON public.casino_reports(casino_name);
CREATE INDEX IF NOT EXISTS idx_casino_reports_status ON public.casino_reports(status);
CREATE INDEX IF NOT EXISTS idx_casino_reports_last_reported ON public.casino_reports(last_reported);
CREATE INDEX IF NOT EXISTS idx_casino_reports_created_at ON public.casino_reports(created_at);

-- Insert sample data from existing reportData
INSERT INTO public.casino_reports (casino_name, status, last_reported, summary, url) VALUES
('ScamCasino Example', 'Unlicensed', '2024-12-15', 'Multiple users reported withdrawal issues. Casino operates without proper license and has been unresponsive to customer complaints. Users report delayed payments and account restrictions without valid reasons.', '#'),
('FakeBet Casino', 'Scam Indicated', '2024-12-10', 'Reported for rigged games and unfair terms. Several players have complained about manipulated slot machines and impossible bonus wagering requirements. Customer support is non-existent.', '#'),
('NoPayCasino', 'Many Users Reported', '2024-12-08', 'Consistent reports of non-payment of winnings. Users report that after winning significant amounts, their accounts are suspended or closed without explanation. Withdrawal requests are ignored.', '#'),
('FraudGaming Site', 'Unlicensed', '2024-12-05', 'Operating without valid gambling license. Site uses fake licensing information and has been reported for identity theft. Users personal and financial information may be at risk.', '#'),
('BadLuck Casino', 'Scam Indicated', '2024-12-01', 'Reported for aggressive marketing tactics and hidden fees. Users are charged unexpected fees and bonuses come with impossible terms. Multiple complaints about unauthorized charges.', '#'),
('TrickyCasino', 'Many Users Reported', '2024-11-28', 'Users report confusing terms and conditions that change frequently. Withdrawal processes are deliberately complicated and customer service provides misleading information.', '#');

-- Enable Row Level Security (RLS)
ALTER TABLE public.casino_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow public read access (for displaying reports on the website)
CREATE POLICY "Allow public read access to casino reports" ON public.casino_reports
  FOR SELECT USING (true);

-- Allow admin users to insert, update, and delete
CREATE POLICY "Allow admin users to manage casino reports" ON public.casino_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_casino_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_casino_reports_updated_at
  BEFORE UPDATE ON public.casino_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_casino_reports_updated_at();

-- Grant necessary permissions
GRANT SELECT ON public.casino_reports TO anon;
GRANT ALL ON public.casino_reports TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.casino_reports_id_seq TO authenticated;

-- Add comment for documentation
COMMENT ON TABLE public.casino_reports IS 'Table storing casino reports and warnings from the community';
COMMENT ON COLUMN public.casino_reports.status IS 'Report status: Unlicensed, Scam Indicated, or Many Users Reported';
COMMENT ON COLUMN public.casino_reports.last_reported IS 'Date when the issue was last reported';
COMMENT ON COLUMN public.casino_reports.summary IS 'Detailed description of the issues with the casino';
COMMENT ON COLUMN public.casino_reports.url IS 'Casino website URL or # if not available';
