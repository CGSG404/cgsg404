import { supabase } from '@/src/lib/supabaseClient';

export interface HeroSliderCasino {
  id: number;
  name: string;
  rating: number;
  bonus: string;
  safety_index: number;
  url: string;
  logo_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BannerInfoContent {
  id: number;
  section_type: 'feature' | 'statistic';
  title: string;
  description?: string;
  value?: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LogoSliderItem {
  id: number;
  name: string;
  logo_url: string;
  alt_text?: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChartDataPoint {
  id: number;
  chart_type: 'review_timeline' | 'safety_distribution';
  data_key: string;
  data_value: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TickerItem {
  id: number;
  text: string;
  highlight?: string;
  type: 'bonus' | 'news' | 'promo' | 'winner' | 'update' | 'vip' | 'tournament';
  link_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSectionContent {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  cta_text?: string;
  cta_url?: string;
  background_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch functions for each component
export async function fetchHeroSliderCasinos(): Promise<HeroSliderCasino[]> {
  const { data, error } = await supabase
    .from('hero_slider_casinos')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching hero slider casinos:', error);
    return [];
  }

  return data || [];
}

export async function fetchBannerInfoContent(): Promise<{
  features: BannerInfoContent[];
  statistics: BannerInfoContent[];
}> {
  const { data, error } = await supabase
    .from('banner_info_content')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching banner info content:', error);
    return { features: [], statistics: [] };
  }

  const features = data?.filter(item => item.section_type === 'feature') || [];
  const statistics = data?.filter(item => item.section_type === 'statistic') || [];

  return { features, statistics };
}

export async function fetchFaqItems(): Promise<FaqItem[]> {
  const { data, error } = await supabase
    .from('faq_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching FAQ items:', error);
    return [];
  }

  return data || [];
}

export async function fetchLogoSliderItems(): Promise<LogoSliderItem[]> {
  const { data, error } = await supabase
    .from('logo_slider_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching logo slider items:', error);
    return [];
  }

  return data || [];
}

export async function fetchChartData(): Promise<{
  reviewData: ChartDataPoint[];
  safetyData: ChartDataPoint[];
}> {
  const { data, error } = await supabase
    .from('chart_data')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching chart data:', error);
    return { reviewData: [], safetyData: [] };
  }

  const reviewData = data?.filter(item => item.chart_type === 'review_timeline') || [];
  const safetyData = data?.filter(item => item.chart_type === 'safety_distribution') || [];

  return { reviewData, safetyData };
}

export async function fetchTickerItems(): Promise<TickerItem[]> {
  const { data, error } = await supabase
    .from('ticker_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching ticker items:', error);
    return [];
  }

  return data || [];
}

export async function fetchHeroSectionContent(): Promise<HeroSectionContent | null> {
  const { data, error } = await supabase
    .from('hero_section_content')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching hero section content:', error);
    return null;
  }

  return data;
}

// Fallback static data (for development/fallback purposes)
export const fallbackHeroSliderData: Omit<HeroSliderCasino, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: "Betway Casino",
    rating: 4.8,
    bonus: "100% up to $1000",
    safety_index: 95,
    url: "https://betway.com",
    logo_url: "/images/casinos/betway.png",
    display_order: 1,
    is_active: true
  },
  {
    name: "888 Casino",
    rating: 4.7,
    bonus: "$88 Free Play",
    safety_index: 92,
    url: "https://888casino.com",
    logo_url: "/images/casinos/888.png",
    display_order: 2,
    is_active: true
  },
  {
    name: "LeoVegas",
    rating: 4.6,
    bonus: "200% up to $500",
    safety_index: 90,
    url: "https://leovegas.com",
    logo_url: "/images/casinos/leovegas.png",
    display_order: 3,
    is_active: true
  }
];

export const fallbackBannerInfoData = {
  features: [
    {
      title: "Trusted & Secure",
      description: "Licensed and regulated platforms with top-tier security",
      icon_name: "Shield",
      section_type: "feature" as const,
      display_order: 1,
      is_active: true
    },
    {
      title: "Exclusive Bonuses",
      description: "Access to special promotions and bonus offers",
      icon_name: "Gift",
      section_type: "feature" as const,
      display_order: 2,
      is_active: true
    },
    {
      title: "Community Driven",
      description: "Real reviews from verified players",
      icon_name: "Users",
      section_type: "feature" as const,
      display_order: 3,
      is_active: true
    },
    {
      title: "Expert Reviews",
      description: "In-depth analysis by gambling professionals",
      icon_name: "Star",
      section_type: "feature" as const,
      display_order: 4,
      is_active: true
    }
  ],
  statistics: [
    {
      title: "Casinos Reviewed",
      value: "500+",
      section_type: "statistic" as const,
      display_order: 1,
      is_active: true
    },
    {
      title: "Active Members",
      value: "50K+",
      section_type: "statistic" as const,
      display_order: 2,
      is_active: true
    },
    {
      title: "Bonus Offers",
      value: "1000+",
      section_type: "statistic" as const,
      display_order: 3,
      is_active: true
    },
    {
      title: "Success Rate",
      value: "98%",
      section_type: "statistic" as const,
      display_order: 4,
      is_active: true
    }
  ]
};

export const fallbackFaqData: Omit<FaqItem, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    question: "How do you ensure casino safety?",
    answer: "We conduct thorough reviews of licensing, security measures, payment methods, and player feedback to ensure only trustworthy casinos are recommended.",
    display_order: 1,
    is_active: true
  },
  {
    question: "Are the bonuses really exclusive?",
    answer: "Yes, we negotiate special bonus offers with our partner casinos that are only available through our platform.",
    display_order: 2,
    is_active: true
  },
  {
    question: "How often are reviews updated?",
    answer: "Our team continuously monitors and updates casino reviews to reflect the latest changes in services, bonuses, and player experiences.",
    display_order: 3,
    is_active: true
  }
];

export const fallbackLogoSliderData: Omit<LogoSliderItem, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: "eCOGRA",
    logo_url: "/images/certifications/ecogra.png",
    alt_text: "eCOGRA Certified",
    website_url: "https://ecogra.org",
    display_order: 1,
    is_active: true
  },
  {
    name: "Malta Gaming Authority",
    logo_url: "/images/certifications/mga.png",
    alt_text: "MGA Licensed",
    website_url: "https://mga.org.mt",
    display_order: 2,
    is_active: true
  },
  {
    name: "UK Gambling Commission",
    logo_url: "/images/certifications/ukgc.png",
    alt_text: "UKGC Licensed",
    website_url: "https://gamblingcommission.gov.uk",
    display_order: 3,
    is_active: true
  }
];

export const fallbackChartData = {
  reviewData: [
    { chart_type: "review_timeline" as const, data_key: "Jan", data_value: 45, display_order: 1, is_active: true },
    { chart_type: "review_timeline" as const, data_key: "Feb", data_value: 52, display_order: 2, is_active: true },
    { chart_type: "review_timeline" as const, data_key: "Mar", data_value: 48, display_order: 3, is_active: true },
    { chart_type: "review_timeline" as const, data_key: "Apr", data_value: 61, display_order: 4, is_active: true },
    { chart_type: "review_timeline" as const, data_key: "May", data_value: 55, display_order: 5, is_active: true },
    { chart_type: "review_timeline" as const, data_key: "Jun", data_value: 67, display_order: 6, is_active: true }
  ],
  safetyData: [
    { chart_type: "safety_distribution" as const, data_key: "Very High", data_value: 45, display_order: 1, is_active: true },
    { chart_type: "safety_distribution" as const, data_key: "High", data_value: 30, display_order: 2, is_active: true },
    { chart_type: "safety_distribution" as const, data_key: "Medium", data_value: 20, display_order: 3, is_active: true },
    { chart_type: "safety_distribution" as const, data_key: "Low", data_value: 5, display_order: 4, is_active: true }
  ]
};

export const fallbackTickerData: Omit<TickerItem, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    text: "🎰 New casino review: Betway Casino rated 4.8/5 stars",
    highlight: "4.8/5 stars",
    type: "news",
    link_url: "/reviews/betway",
    display_order: 1,
    is_active: true
  },
  {
    text: "💰 Exclusive bonus: Get 200% up to $1000 at LeoVegas",
    highlight: "200% up to $1000",
    type: "bonus",
    link_url: "/bonuses/leovegas",
    display_order: 2,
    is_active: true
  },
  {
    text: "🏆 Congratulations to John D. for winning $50,000 jackpot!",
    highlight: "$50,000 jackpot",
    type: "winner",
    display_order: 3,
    is_active: true
  }
];

export const fallbackHeroSectionData: Omit<HeroSectionContent, 'id' | 'created_at' | 'updated_at'> = {
  title: "Find Your Perfect Casino",
  subtitle: "Trusted Reviews & Exclusive Bonuses",
  description: "Discover the best online casinos with our expert reviews, safety ratings, and exclusive bonus offers. Join thousands of players who trust CGSG for their gaming needs.",
  cta_text: "Explore Casinos",
  cta_url: "/casinos",
  background_image_url: "/images/hero-bg.jpg",
  is_active: true
};