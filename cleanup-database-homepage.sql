-- CGSG404 Database Cleanup & Reconfiguration Script
-- Focus: Homepage CRUD System Rebuild
-- Date: 2025

-- =====================================================
-- PHASE 1: BACKUP & CLEANUP EXISTING TABLES
-- =====================================================

-- Step 1: Drop Casino-related tables (Main conflict source)
DROP TABLE IF EXISTS casino_reports CASCADE;
DROP TABLE IF EXISTS casino_category_assignments CASCADE;
DROP TABLE IF EXISTS casino_features CASCADE;
DROP TABLE IF EXISTS casino_badges CASCADE;
DROP TABLE IF EXISTS casino_links CASCADE;
DROP TABLE IF EXISTS casino_categories CASCADE;
DROP TABLE IF EXISTS user_casino_ratings CASCADE;
DROP TABLE IF EXISTS casinos CASCADE;

-- Step 2: Drop conflicting admin tables (if needed)
DROP TABLE IF EXISTS admin_activity_logs CASCADE;
DROP TABLE IF EXISTS admin_role_permissions CASCADE;
DROP TABLE IF EXISTS admin_monitoring_metrics CASCADE;

-- Step 3: Drop forum/chat tables (not homepage priority)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS forum_posts CASCADE;
DROP TABLE IF EXISTS forum_replies CASCADE;
DROP TABLE IF EXISTS forum_post_likes CASCADE;
DROP TABLE IF EXISTS forum_reply_likes CASCADE;
DROP TABLE IF EXISTS forum_user_activity CASCADE;
DROP TABLE IF EXISTS forum_categories CASCADE;

-- =====================================================
-- PHASE 2: CREATE HOMEPAGE-FOCUSED TABLES
-- =====================================================

-- Table 1: Page Contents Management
CREATE TABLE IF NOT EXISTS page_contents (
  id SERIAL PRIMARY KEY,
  page_name VARCHAR(100) NOT NULL,
  section_name VARCHAR(100) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  content_key VARCHAR(100) NOT NULL,
  content_value TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_name, section_name, content_key)
);

-- Table 2: Site Statistics Management
CREATE TABLE IF NOT EXISTS site_statistics (
  id SERIAL PRIMARY KEY,
  stat_key VARCHAR(100) NOT NULL UNIQUE,
  stat_value VARCHAR(50) NOT NULL,
  stat_label VARCHAR(255) NOT NULL,
  icon_name VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: Site Features Management
CREATE TABLE IF NOT EXISTS site_features (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100),
  color_class VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  page_type VARCHAR(50) DEFAULT 'home',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: Banners Management
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  highlight VARCHAR(255),
  cta_text VARCHAR(100),
  cta_link VARCHAR(500),
  image_url VARCHAR(500),
  gradient_class VARCHAR(255),
  page_type VARCHAR(50) DEFAULT 'home',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 5: Admin Users Management
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email)
);

-- Table 6: Media Files Management
CREATE TABLE IF NOT EXISTS media_files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  alt_text VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PHASE 3: INSERT DEFAULT DATA FOR HOMEPAGE
-- =====================================================

-- Insert default statistics
INSERT INTO site_statistics (stat_key, stat_value, stat_label, icon_name, display_order) VALUES
('casinos_reviewed', '87+', 'Casinos Reviewed', 'Star', 1),
('active_members', '1081+', 'Active Members', 'Users', 2),
('bonus_offers', '800+', 'Bonus Offers', 'Gift', 3),
('success_rate', '99%', 'Success Rate', 'TrendingUp', 4)
ON CONFLICT (stat_key) DO UPDATE SET
  stat_value = EXCLUDED.stat_value,
  stat_label = EXCLUDED.stat_label,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order;

-- Insert default banners
INSERT INTO banners (title, subtitle, highlight, cta_text, cta_link, image_url, gradient_class, display_order) VALUES
('Welcome to CGSG404', 'Your trusted casino guide platform', 'Discover the best online casinos', 'Get Started', '/casinos', '/cgsg-logos.png', 'from-blue-600 to-purple-600', 1),
('Exclusive Bonuses', 'Access premium casino offers', 'Up to $5000 welcome bonus', 'Claim Now', '/bonuses', '/bonus-banner.jpg', 'from-green-500 to-blue-500', 2);

-- Insert default features
INSERT INTO site_features (title, description, icon_name, color_class, display_order) VALUES
('Trusted & Secure', 'Licensed casinos with verified security measures', 'Shield', 'from-blue-500 to-cyan-500', 1),
('Exclusive Bonuses', 'Special offers and promotions for our members', 'Gift', 'from-purple-500 to-pink-500', 2),
('Community Driven', 'Real reviews from verified players', 'Users', 'from-green-500 to-emerald-500', 3),
('Expert Reviews', 'Professional analysis and ratings', 'Award', 'from-orange-500 to-red-500', 4);

-- Insert default page contents
INSERT INTO page_contents (page_name, section_name, content_type, content_key, content_value) VALUES
('home', 'hero', 'text', 'title', 'Your Trusted Casino Guide'),
('home', 'hero', 'text', 'subtitle', 'Discover first-class online casinos with expert reviews, trusted reports, and safe gambling platforms recommended by CGSG professionals.'),
('home', 'hero', 'image', 'main_image', '/cgsg-logos.png'),
('home', 'stats', 'text', 'section_title', 'Platform Statistics'),
('home', 'features', 'text', 'section_title', 'Why Choose CGSG?'),
('home', 'features', 'text', 'section_subtitle', 'Your trusted partner in online casino discovery')
ON CONFLICT (page_name, section_name, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value;

-- Insert default admin user
INSERT INTO admin_users (email, role, permissions, is_active) VALUES
('admin@cgsg404.com', 'super_admin', '{"all": true}', true),
('casinogurusg404@gmail.com', 'super_admin', '{"all": true}', true)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active;

-- =====================================================
-- PHASE 4: ENABLE RLS & CREATE POLICIES
-- =====================================================

-- Enable RLS for all tables
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view active page contents" ON page_contents FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can view active statistics" ON site_statistics FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can view active features" ON site_features FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can view active banners" ON banners FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can view active media" ON media_files FOR SELECT 
USING (is_active = true);

-- Admin users policies
CREATE POLICY "Admins can view admin users" ON admin_users FOR SELECT 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Admins can manage admin users" ON admin_users FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true AND role = 'super_admin'));

-- Admin management policies (if admin system exists)
CREATE POLICY "Admins can manage page contents" ON page_contents FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Admins can manage statistics" ON site_statistics FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Admins can manage features" ON site_features FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Admins can manage banners" ON banners FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Admins can manage media" ON media_files FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true));

-- =====================================================
-- PHASE 5: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Page contents indexes
CREATE INDEX IF NOT EXISTS idx_page_contents_page_section ON page_contents(page_name, section_name);
CREATE INDEX IF NOT EXISTS idx_page_contents_active ON page_contents(is_active);

-- Statistics indexes
CREATE INDEX IF NOT EXISTS idx_site_statistics_active ON site_statistics(is_active);
CREATE INDEX IF NOT EXISTS idx_site_statistics_order ON site_statistics(display_order);

-- Features indexes
CREATE INDEX IF NOT EXISTS idx_site_features_active ON site_features(is_active);
CREATE INDEX IF NOT EXISTS idx_site_features_page_order ON site_features(page_type, display_order);

-- Banners indexes
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_page_order ON banners(page_type, display_order);

-- Admin users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_files_category ON media_files(category);
CREATE INDEX IF NOT EXISTS idx_media_files_active ON media_files(is_active);

-- =====================================================
-- PHASE 6: CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to get homepage content
CREATE OR REPLACE FUNCTION get_homepage_content()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'hero_content', (
      SELECT json_object_agg(content_key, content_value)
      FROM page_contents 
      WHERE page_name = 'home' AND section_name = 'hero' AND is_active = true
    ),
    'statistics', (
      SELECT json_agg(
        json_build_object(
          'key', stat_key,
          'value', stat_value,
          'label', stat_label,
          'icon', icon_name
        ) ORDER BY display_order
      )
      FROM site_statistics WHERE is_active = true
    ),
    'features', (
      SELECT json_agg(
        json_build_object(
          'title', title,
          'description', description,
          'icon', icon_name,
          'color_class', color_class
        ) ORDER BY display_order
      )
      FROM site_features WHERE page_type = 'home' AND is_active = true
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON page_contents TO anon, authenticated;
GRANT SELECT ON site_statistics TO anon, authenticated;
GRANT SELECT ON site_features TO anon, authenticated;
GRANT SELECT ON banners TO anon, authenticated;
GRANT SELECT ON admin_users TO authenticated;
GRANT SELECT ON media_files TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_homepage_content() TO anon, authenticated;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Show completion status
SELECT 'CGSG404 Homepage Database Reconfiguration Completed!' as status,
       'Tables: page_contents, site_statistics, site_features, media_files' as created_tables,
       'RLS enabled with public read access' as security_status,
       'Helper function get_homepage_content() available' as functions_status;