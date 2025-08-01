-- Create comprehensive casino database schema
-- This migration creates all tables needed for casino data management

-- Create casinos table
CREATE TABLE public.casinos (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  safety_index TEXT NOT NULL CHECK (safety_index IN ('Low', 'Medium', 'High', 'Very High')),
  bonus TEXT NOT NULL,
  description TEXT NOT NULL,
  play_url TEXT NOT NULL,
  is_new BOOLEAN DEFAULT false,
  is_hot BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create casino_features table for normalized features
CREATE TABLE public.casino_features (
  id SERIAL PRIMARY KEY,
  casino_id INTEGER NOT NULL REFERENCES public.casinos(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create casino_badges table for normalized badges
CREATE TABLE public.casino_badges (
  id SERIAL PRIMARY KEY,
  casino_id INTEGER NOT NULL REFERENCES public.casinos(id) ON DELETE CASCADE,
  badge TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create casino_links table for casino links
CREATE TABLE public.casino_links (
  id SERIAL PRIMARY KEY,
  casino_id INTEGER NOT NULL REFERENCES public.casinos(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('bonus', 'review', 'complaint')),
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create casino_categories table for categorization
CREATE TABLE public.casino_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create casino_category_assignments table (many-to-many)
CREATE TABLE public.casino_category_assignments (
  id SERIAL PRIMARY KEY,
  casino_id INTEGER NOT NULL REFERENCES public.casinos(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES public.casino_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(casino_id, category_id)
);

-- Create user_casino_ratings table for user ratings
CREATE TABLE public.user_casino_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  casino_id INTEGER NOT NULL REFERENCES public.casinos(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, casino_id)
);

-- Create news_articles table
CREATE TABLE public.news_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  read_time TEXT,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_casinos_rating ON public.casinos(rating DESC);
CREATE INDEX idx_casinos_safety_index ON public.casinos(safety_index);
CREATE INDEX idx_casinos_is_new ON public.casinos(is_new);
CREATE INDEX idx_casinos_is_hot ON public.casinos(is_hot);
CREATE INDEX idx_casinos_is_featured ON public.casinos(is_featured);
CREATE INDEX idx_casinos_name ON public.casinos(name);
CREATE INDEX idx_casinos_slug ON public.casinos(slug);

CREATE INDEX idx_casino_features_casino_id ON public.casino_features(casino_id);
CREATE INDEX idx_casino_badges_casino_id ON public.casino_badges(casino_id);
CREATE INDEX idx_casino_links_casino_id ON public.casino_links(casino_id);
CREATE INDEX idx_casino_links_type ON public.casino_links(link_type);

CREATE INDEX idx_user_casino_ratings_user_id ON public.user_casino_ratings(user_id);
CREATE INDEX idx_user_casino_ratings_casino_id ON public.user_casino_ratings(casino_id);
CREATE INDEX idx_user_casino_ratings_rating ON public.user_casino_ratings(rating);

CREATE INDEX idx_news_articles_slug ON public.news_articles(slug);
CREATE INDEX idx_news_articles_category ON public.news_articles(category);
CREATE INDEX idx_news_articles_published ON public.news_articles(is_published, published_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.casinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casino_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casino_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casino_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casino_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casino_category_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_casino_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Casinos are viewable by everyone" ON public.casinos FOR SELECT USING (true);
CREATE POLICY "Casino features are viewable by everyone" ON public.casino_features FOR SELECT USING (true);
CREATE POLICY "Casino badges are viewable by everyone" ON public.casino_badges FOR SELECT USING (true);
CREATE POLICY "Casino links are viewable by everyone" ON public.casino_links FOR SELECT USING (true);
CREATE POLICY "Casino categories are viewable by everyone" ON public.casino_categories FOR SELECT USING (true);
CREATE POLICY "Casino category assignments are viewable by everyone" ON public.casino_category_assignments FOR SELECT USING (true);
CREATE POLICY "User casino ratings are viewable by everyone" ON public.user_casino_ratings FOR SELECT USING (true);
CREATE POLICY "Published news articles are viewable by everyone" ON public.news_articles FOR SELECT USING (is_published = true);

-- Create RLS policies for authenticated users
CREATE POLICY "Authenticated users can rate casinos" ON public.user_casino_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ratings" ON public.user_casino_ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ratings" ON public.user_casino_ratings FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_casinos_updated_at BEFORE UPDATE ON public.casinos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_casino_ratings_updated_at BEFORE UPDATE ON public.user_casino_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
