-- Create content management tables for CGSG404 project
-- Migration: 20250202000003_create_content_tables.sql

-- 1. Hero Banner Slider Table
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    highlight VARCHAR(255),
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    image_url VARCHAR(500) NOT NULL,
    gradient_class VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Running Text Ticker Table
CREATE TABLE IF NOT EXISTS public.running_texts (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Hero Section Table
CREATE TABLE IF NOT EXISTS public.hero_content (
    id BIGSERIAL PRIMARY KEY,
    main_title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    primary_cta_text VARCHAR(100),
    primary_cta_link VARCHAR(500),
    secondary_cta_text VARCHAR(100),
    secondary_cta_link VARCHAR(500),
    background_image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Top Casinos Section (using existing casinos table but adding featured section)
CREATE TABLE IF NOT EXISTS public.featured_casinos (
    id BIGSERIAL PRIMARY KEY,
    casino_id INTEGER NOT NULL REFERENCES public.casinos(id) ON DELETE CASCADE,
    section_type VARCHAR(50) DEFAULT 'hero_slider',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(casino_id, section_type)
);

-- 5. Banner Info Table
CREATE TABLE IF NOT EXISTS public.info_banners (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FAQ Section Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    icon VARCHAR(100),
    category VARCHAR(100) DEFAULT 'general',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Logo Slider (Partner Logos) Table
CREATE TABLE IF NOT EXISTS public.partner_logos (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500) NOT NULL,
    website_url VARCHAR(500),
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Chart Section (Statistics) Table
CREATE TABLE IF NOT EXISTS public.statistics (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    chart_type VARCHAR(50) DEFAULT 'number',
    color VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hero_banners_active_order ON public.hero_banners(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_running_texts_active_priority ON public.running_texts(is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_hero_content_active ON public.hero_content(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_casinos_section_order ON public.featured_casinos(section_type, display_order);
CREATE INDEX IF NOT EXISTS idx_info_banners_active_order ON public.info_banners(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_category_order ON public.faqs(category, display_order);
CREATE INDEX IF NOT EXISTS idx_partner_logos_active_order ON public.partner_logos(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_statistics_active_order ON public.statistics(is_active, display_order);

-- Create updated_at triggers
CREATE TRIGGER update_hero_banners_updated_at 
    BEFORE UPDATE ON public.hero_banners 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_running_texts_updated_at 
    BEFORE UPDATE ON public.running_texts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_content_updated_at 
    BEFORE UPDATE ON public.hero_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_info_banners_updated_at 
    BEFORE UPDATE ON public.info_banners 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at 
    BEFORE UPDATE ON public.faqs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_logos_updated_at 
    BEFORE UPDATE ON public.partner_logos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_statistics_updated_at 
    BEFORE UPDATE ON public.statistics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.running_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_casinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.info_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Hero banners are viewable by everyone" ON public.hero_banners FOR SELECT USING (is_active = true);
CREATE POLICY "Running texts are viewable by everyone" ON public.running_texts FOR SELECT USING (is_active = true);
CREATE POLICY "Hero content is viewable by everyone" ON public.hero_content FOR SELECT USING (is_active = true);
CREATE POLICY "Featured casinos are viewable by everyone" ON public.featured_casinos FOR SELECT USING (is_active = true);
CREATE POLICY "Info banners are viewable by everyone" ON public.info_banners FOR SELECT USING (is_active = true);
CREATE POLICY "FAQs are viewable by everyone" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Partner logos are viewable by everyone" ON public.partner_logos FOR SELECT USING (is_active = true);
CREATE POLICY "Statistics are viewable by everyone" ON public.statistics FOR SELECT USING (is_active = true);

-- Grant necessary permissions
GRANT SELECT ON public.hero_banners TO anon;
GRANT SELECT ON public.running_texts TO anon;
GRANT SELECT ON public.hero_content TO anon;
GRANT SELECT ON public.featured_casinos TO anon;
GRANT SELECT ON public.info_banners TO anon;
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT ON public.partner_logos TO anon;
GRANT SELECT ON public.statistics TO anon;

GRANT SELECT ON public.hero_banners TO authenticated;
GRANT SELECT ON public.running_texts TO authenticated;
GRANT SELECT ON public.hero_content TO authenticated;
GRANT SELECT ON public.featured_casinos TO authenticated;
GRANT SELECT ON public.info_banners TO authenticated;
GRANT SELECT ON public.faqs TO authenticated;
GRANT SELECT ON public.partner_logos TO authenticated;
GRANT SELECT ON public.statistics TO authenticated;

GRANT ALL ON public.hero_banners TO service_role;
GRANT ALL ON public.running_texts TO service_role;
GRANT ALL ON public.hero_content TO service_role;
GRANT ALL ON public.featured_casinos TO service_role;
GRANT ALL ON public.info_banners TO service_role;
GRANT ALL ON public.faqs TO service_role;
GRANT ALL ON public.partner_logos TO service_role;
GRANT ALL ON public.statistics TO service_role;