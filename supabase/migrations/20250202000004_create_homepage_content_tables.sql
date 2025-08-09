-- Migration: Create Homepage Content Management Tables
-- Created: 2025-02-02
-- Purpose: Create tables for managing all homepage components

-- Enable RLS
ALTER DATABASE postgres SET row_security = on;

-- 1. Hero Slider (Casino Cards) Table
CREATE TABLE IF NOT EXISTS public.hero_slider_casinos (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    bonus TEXT NOT NULL,
    safety_index INTEGER NOT NULL CHECK (safety_index >= 0 AND safety_index <= 100),
    url TEXT NOT NULL,
    logo_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Banner Info (Features & Stats) Table
CREATE TABLE IF NOT EXISTS public.banner_info_content (
    id BIGSERIAL PRIMARY KEY,
    section_type VARCHAR(50) NOT NULL CHECK (section_type IN ('feature', 'statistic')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    value VARCHAR(100), -- For statistics (e.g., "500+", "98%")
    icon_name VARCHAR(100), -- Icon identifier
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. FAQ Section Table
CREATE TABLE IF NOT EXISTS public.faq_items (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Logo Slider (Trust Badges) Table
CREATE TABLE IF NOT EXISTS public.logo_slider_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Chart Section Data Table
CREATE TABLE IF NOT EXISTS public.chart_data (
    id BIGSERIAL PRIMARY KEY,
    chart_type VARCHAR(50) NOT NULL CHECK (chart_type IN ('review_timeline', 'safety_distribution')),
    data_key VARCHAR(100) NOT NULL, -- e.g., 'Jan', 'Very High'
    data_value INTEGER NOT NULL,
    additional_data JSONB, -- For extra properties like colors, etc.
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Running Text Ticker Table
CREATE TABLE IF NOT EXISTS public.ticker_items (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    highlight VARCHAR(255),
    type VARCHAR(50) NOT NULL CHECK (type IN ('bonus', 'news', 'promo', 'winner', 'update', 'vip', 'tournament')),
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Hero Section Content Table
CREATE TABLE IF NOT EXISTS public.hero_section_content (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    cta_text VARCHAR(100),
    cta_url TEXT,
    background_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_hero_slider_casinos_active_order ON public.hero_slider_casinos(is_active, display_order);
CREATE INDEX idx_banner_info_content_type_order ON public.banner_info_content(section_type, is_active, display_order);
CREATE INDEX idx_faq_items_active_order ON public.faq_items(is_active, display_order);
CREATE INDEX idx_logo_slider_items_active_order ON public.logo_slider_items(is_active, display_order);
CREATE INDEX idx_chart_data_type_order ON public.chart_data(chart_type, is_active, display_order);
CREATE INDEX idx_ticker_items_active_order ON public.ticker_items(is_active, display_order);
CREATE INDEX idx_hero_section_content_active ON public.hero_section_content(is_active);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_slider_casinos_updated_at BEFORE UPDATE ON public.hero_slider_casinos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_banner_info_content_updated_at BEFORE UPDATE ON public.banner_info_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_logo_slider_items_updated_at BEFORE UPDATE ON public.logo_slider_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chart_data_updated_at BEFORE UPDATE ON public.chart_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ticker_items_updated_at BEFORE UPDATE ON public.ticker_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_section_content_updated_at BEFORE UPDATE ON public.hero_section_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.hero_slider_casinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_info_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logo_slider_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticker_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_section_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access" ON public.hero_slider_casinos FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.banner_info_content FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.faq_items FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.logo_slider_items FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.chart_data FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.ticker_items FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.hero_section_content FOR SELECT USING (is_active = true);

-- Create RLS policies for admin access
CREATE POLICY "Allow admin full access" ON public.hero_slider_casinos FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON public.banner_info_content FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON public.faq_items FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON public.logo_slider_items FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON public.chart_data FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON public.ticker_items FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON public.hero_section_content FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert default data
-- Hero Slider Casinos (from existing static data)
INSERT INTO public.hero_slider_casinos (name, rating, bonus, safety_index, url, display_order) VALUES
('OnePlay Singapore', 4.8, '168% Welcome Bonus', 90, 'https://1playsg.vip/RF29551A809', 1),
('Mega888 Singapore', 4.7, '100% Welcome Bonus', 85, 'https://mega888sg.com', 2),
('Kiss918 Singapore', 4.6, '150% Welcome Bonus', 88, 'https://kiss918sg.com', 3),
('Pussy888 Singapore', 4.5, '120% Welcome Bonus', 82, 'https://pussy888sg.com', 4),
('Joker123 Singapore', 4.4, '200% Welcome Bonus', 80, 'https://joker123sg.com', 5);

-- Banner Info Features
INSERT INTO public.banner_info_content (section_type, title, description, icon_name, display_order) VALUES
('feature', 'Trusted & Secure', 'Licensed and regulated platforms with advanced security measures', 'Shield', 1),
('feature', 'Exclusive Bonuses', 'Access to special promotions and welcome bonuses', 'Gift', 2),
('feature', 'Community Driven', 'Join thousands of players sharing experiences and tips', 'Users', 3),
('feature', 'Expert Reviews', 'In-depth analysis by our team of gaming professionals', 'Award', 4);

-- Banner Info Statistics
INSERT INTO public.banner_info_content (section_type, title, value, display_order) VALUES
('statistic', 'Casinos Reviewed', '500+', 1),
('statistic', 'Active Members', '50K+', 2),
('statistic', 'Bonus Offers', '1000+', 3),
('statistic', 'Success Rate', '98%', 4);

-- FAQ Items (from existing static data)
INSERT INTO public.faq_items (question, answer, display_order) VALUES
('Are the recommended casinos legal in Singapore?', 'We only list internationally licensed online casinos that accept Singaporean players and are regulated by trusted authorities.', 1),
('How do we rate the casinos?', 'CGSG experts evaluate license, security, game variety, bonuses, and player reviews before assigning a rating.', 2),
('Do I have to pay to join?', 'No. Our guides, reviews, and forum are 100% free for all users.', 3),
('How do I claim the welcome bonus?', 'Click the ''Claim Bonus'' button on the casino page and follow the sign-up instructions on the partner site.', 4);

-- Logo Slider Items (from existing static data)
INSERT INTO public.logo_slider_items (name, logo_url, alt_text, display_order) VALUES
('Game Curacao', '/logos/gaming_curacao.png', 'Game Curacao certification', 1),
('PAGCOR', '/logos/PAGCOR.png', 'PAGCOR certification', 2),
('BMM', '/logos/bmm-logo.png', 'BMM certification', 3),
('iTechLabs', '/logos/itechlabs.png', 'iTechLabs certification', 4),
('GoDaddy', '/logos/godaddy.png', 'GoDaddy security', 5),
('Iovation', '/logos/iovation.png', 'Iovation security', 6),
('ThreatMetrix', '/logos/TM.jpg', 'ThreatMetrix security', 7),
('TST Verified', '/logos/TST.jpg', 'TST verification', 8);

-- Chart Data (from existing static data)
INSERT INTO public.chart_data (chart_type, data_key, data_value, display_order) VALUES
('review_timeline', 'Jan', 0, 1),
('review_timeline', 'Feb', 0, 2),
('review_timeline', 'Mar', 0, 3),
('review_timeline', 'Apr', 20, 4),
('review_timeline', 'May', 91, 5),
('review_timeline', 'Jun', 106, 6),
('safety_distribution', 'Very High', 10, 1),
('safety_distribution', 'High', 10, 2),
('safety_distribution', 'Medium', 129, 3),
('safety_distribution', 'Low', 203, 4);

-- Ticker Items (from existing static data)
INSERT INTO public.ticker_items (text, highlight, type, display_order) VALUES
('Find Your Best Bonuses In Our Platform & Claim Your Bonus Now!', 'Exclusive Bonuses', 'bonus', 1),
('Check Our Best Recommend CGSG Platform & Start Playing Now!', 'Best Casinos', 'news', 2),
('Join Our Community Forum & Share Your Gaming Experience!', 'Community', 'news', 3),
('Weekly Tournament: Win Your Share of $10,000 Prize Pool', 'Tournament', 'tournament', 4),
('VIP Program: Unlock Exclusive Benefits and Higher Cashback Rates', 'VIP Benefits', 'vip', 5),
('Flash Promo: 50 Free Spins No Deposit Required - Limited Time!', 'Free Spins', 'promo', 6);

-- Hero Section Content
INSERT INTO public.hero_section_content (title, subtitle, description, cta_text, cta_url) VALUES
('Casino Guide Singapore', 'Your Trusted Source for Online Casino Reviews', 'Discover the best online casinos in Singapore with our expert reviews, exclusive bonuses, and comprehensive guides.', 'Explore Casinos', '/casinos');

COMMIT;