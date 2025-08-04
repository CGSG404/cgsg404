-- Create banners table for CGSG404 project
-- Migration: 20250101000000_create_banners_table.sql

-- Enable RLS (Row Level Security)
ALTER TABLE IF EXISTS public.banners ENABLE ROW LEVEL SECURITY;

-- Create banners table
CREATE TABLE IF NOT EXISTS public.banners (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    highlight VARCHAR(255),
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    image_url VARCHAR(500) NOT NULL,
    gradient_class VARCHAR(100),
    page_type VARCHAR(50) DEFAULT 'home',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_banners_page_type ON public.banners(page_type);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_display_order ON public.banners(display_order);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_banners_updated_at 
    BEFORE UPDATE ON public.banners 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default banners data
INSERT INTO public.banners (
    title, 
    subtitle, 
    highlight, 
    cta_text, 
    cta_link, 
    image_url, 
    gradient_class, 
    page_type, 
    display_order, 
    is_active
) VALUES 
(
    'Welcome to CGSG!',
    'Your Trusted Casino Guide Singapore',
    'DISCOVER THE BEST CASINOS! 🎰',
    'Get Started',
    '/casinos',
    '/news-banner/domain.png',
    'from-casino-dark to-purple-900',
    'home',
    1,
    true
),
(
    'Exclusive Bonuses',
    'Up to 200% Welcome Bonus + Free Spins',
    'CLAIM YOUR BONUS NOW! 🎁',
    'View Bonuses',
    '/best-bonuses',
    '/news-banner/domain1.png',
    'from-casino-dark to-purple-900',
    'home',
    2,
    true
),
(
    'Success Stories',
    'Join Our Winning Community',
    'BE THE NEXT WINNER! 🏆',
    'Read Stories',
    '/success-stories',
    '/success-stories-cgsg.png',
    'from-casino-dark to-purple-900',
    'home',
    3,
    true
);

-- RLS Policies for banners table
-- Allow public read access for active banners
CREATE POLICY "Allow public read access for active banners" ON public.banners
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to manage banners (for admin)
CREATE POLICY "Allow authenticated users to manage banners" ON public.banners
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT ON public.banners TO anon;
GRANT SELECT ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role; 