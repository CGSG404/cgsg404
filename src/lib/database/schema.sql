-- Content Management System Schema for CGSG

-- Banner Management Table
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  highlight TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  image_url VARCHAR(500),
  gradient_class VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  page_type VARCHAR(50) DEFAULT 'home', -- 'home', 'games', 'casinos', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Page Content Management Table
CREATE TABLE IF NOT EXISTS page_contents (
  id SERIAL PRIMARY KEY,
  page_name VARCHAR(100) NOT NULL, -- 'home', 'games', 'casinos', etc.
  section_name VARCHAR(100) NOT NULL, -- 'hero', 'stats', 'features', etc.
  content_type VARCHAR(50) NOT NULL, -- 'text', 'image', 'json', 'html'
  content_key VARCHAR(100) NOT NULL, -- 'title', 'subtitle', 'description', etc.
  content_value TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_name, section_name, content_key)
);

-- Media/Images Management Table
CREATE TABLE IF NOT EXISTS media_files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  alt_text VARCHAR(255),
  description TEXT,
  category VARCHAR(100), -- 'banner', 'logo', 'icon', 'content'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Statistics Management Table
CREATE TABLE IF NOT EXISTS site_statistics (
  id SERIAL PRIMARY KEY,
  stat_key VARCHAR(100) NOT NULL UNIQUE, -- 'casinos_reviewed', 'active_members', etc.
  stat_value VARCHAR(50) NOT NULL,
  stat_label VARCHAR(255) NOT NULL,
  icon_name VARCHAR(100), -- lucide icon name
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Features Management Table
CREATE TABLE IF NOT EXISTS site_features (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100), -- lucide icon name
  color_class VARCHAR(255), -- gradient classes
  display_order INTEGER DEFAULT 0,
  page_type VARCHAR(50) DEFAULT 'home',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default banners
INSERT INTO banners (title, subtitle, highlight, cta_text, cta_link, image_url, gradient_class, page_type, display_order) VALUES
('Welcome to CGSG!', 'Your Trusted Casino Guide Singapore', 'DISCOVER THE BEST CASINOS! 🎰', 'Get Started', '/casinos', '/news-banner/domain.png', 'from-purple-600/80 via-blue-600/60 to-cyan-500/80', 'home', 1),
('Exclusive Bonuses', 'Up to 200% Welcome Bonus + Free Spins', 'CLAIM YOUR BONUS NOW! 🎁', 'View Bonuses', '/best-bonuses', '/news-banner/domain1.png', 'from-green-600/80 via-emerald-600/60 to-teal-500/80', 'home', 2),
('Success Stories', 'Join Our Winning Community', 'BE THE NEXT WINNER! 🏆', 'Read Stories', '/success-stories', '/success-stories-cgsg.png', 'from-orange-600/80 via-red-600/60 to-pink-500/80', 'home', 3),
('Top Casino Games', 'Play the Best Games Online', 'START WINNING TODAY! 🎮', 'Play Now', '/casinos', '/news-banner/domain.png', 'from-blue-600/80 via-purple-600/60 to-indigo-500/80', 'games', 1),
('Game Bonuses', 'Special Bonuses for Game Players', 'CLAIM GAME BONUS! 🎯', 'Get Bonus', '/best-bonuses', '/news-banner/domain1.png', 'from-cyan-600/80 via-blue-600/60 to-purple-500/80', 'games', 2);

-- Insert default statistics
INSERT INTO site_statistics (stat_key, stat_value, stat_label, icon_name, display_order) VALUES
('casinos_reviewed', '87+', 'Casinos Reviewed', 'Star', 1),
('active_members', '1081+', 'Active Members', 'Users', 2),
('bonus_offers', '800+', 'Bonus Offers', 'Gift', 3),
('success_rate', '99%', 'Success Rate', 'TrendingUp', 4);

-- Insert default features
INSERT INTO site_features (title, description, icon_name, color_class, display_order) VALUES
('Trusted & Secure', 'Licensed casinos with verified security measures', 'Shield', 'from-blue-500 to-cyan-500', 1),
('Exclusive Bonuses', 'Special offers and promotions for our members', 'Gift', 'from-purple-500 to-pink-500', 2),
('Community Driven', 'Real reviews from verified players', 'Users', 'from-green-500 to-emerald-500', 3),
('Expert Reviews', 'Professional analysis and ratings', 'Award', 'from-orange-500 to-red-500', 4);

-- Forum Categories Table
CREATE TABLE IF NOT EXISTS forum_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100), -- lucide icon name
  color_class VARCHAR(255), -- CSS color classes
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum Topics/Posts Table
CREATE TABLE IF NOT EXISTS forum_posts (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES forum_categories(id),
  casino_id INTEGER, -- Reference to casino if post is about specific casino
  casino_name VARCHAR(255), -- Casino name for easier querying
  user_id VARCHAR(255) NOT NULL, -- User ID from auth system
  user_name VARCHAR(255) NOT NULL,
  user_avatar VARCHAR(500),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  post_type VARCHAR(50) DEFAULT 'discussion', -- 'discussion', 'review', 'question', 'experience'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Casino rating if it's a review
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum Replies/Comments Table
CREATE TABLE IF NOT EXISTS forum_replies (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  parent_reply_id INTEGER REFERENCES forum_replies(id), -- For nested replies
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_avatar VARCHAR(500),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum Post Likes Table
CREATE TABLE IF NOT EXISTS forum_post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- Forum Reply Likes Table
CREATE TABLE IF NOT EXISTS forum_reply_likes (
  id SERIAL PRIMARY KEY,
  reply_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(reply_id, user_id)
);

-- Forum User Activity Table
CREATE TABLE IF NOT EXISTS forum_user_activity (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  activity_type VARCHAR(50) NOT NULL, -- 'post', 'reply', 'like', 'view'
  target_type VARCHAR(50) NOT NULL, -- 'post', 'reply'
  target_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default forum categories
INSERT INTO forum_categories (name, description, icon_name, color_class, display_order) VALUES
('Casino Reviews', 'Share your experiences and reviews about different casinos', 'Star', 'from-yellow-500 to-orange-500', 1),
('General Discussion', 'General casino and gambling discussions', 'MessageCircle', 'from-blue-500 to-cyan-500', 2),
('Bonus & Promotions', 'Discuss casino bonuses, promotions, and offers', 'Gift', 'from-green-500 to-emerald-500', 3),
('Game Strategies', 'Share tips, tricks, and strategies for casino games', 'Target', 'from-purple-500 to-pink-500', 4),
('Success Stories', 'Share your winning stories and experiences', 'Trophy', 'from-orange-500 to-red-500', 5),
('Questions & Help', 'Ask questions and get help from the community', 'HelpCircle', 'from-indigo-500 to-blue-500', 6);

-- Insert default page contents
INSERT INTO page_contents (page_name, section_name, content_type, content_key, content_value) VALUES
('home', 'hero', 'text', 'title', 'Your Trusted Casino Guide'),
('home', 'hero', 'text', 'subtitle', 'Discover first-class online casinos with expert reviews, trusted reports, and safe gambling platforms recommended by CGSG professionals.'),
('games', 'hero', 'text', 'title', 'Top Online Games for July 2025 – Expert Picks You Can Trust'),
('games', 'hero', 'text', 'subtitle', 'Discover our curated list of the TOP 5 Casinos this month, evaluated using our unique Safety Index and community insights.'),
('games', 'hero', 'image', 'main_image', '/cgsg-logos.png'),
('forum', 'hero', 'text', 'title', 'Casino Community Forum'),
('forum', 'hero', 'text', 'subtitle', 'Connect with fellow casino enthusiasts, share experiences, and discover the best casinos together.');
