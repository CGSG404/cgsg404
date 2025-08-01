// Database types for Supabase integration
// Auto-generated types based on database schema

export interface Database {
  public: {
    Tables: {
      casinos: {
        Row: {
          id: number;
          name: string;
          slug: string;
          logo: string;
          rating: number;
          safety_index: 'Low' | 'Medium' | 'High' | 'Very High';
          bonus: string;
          description: string;
          play_url: string;
          is_new: boolean;
          is_hot: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          logo: string;
          rating: number;
          safety_index: 'Low' | 'Medium' | 'High' | 'Very High';
          bonus: string;
          description: string;
          play_url: string;
          is_new?: boolean;
          is_hot?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          logo?: string;
          rating?: number;
          safety_index?: 'Low' | 'Medium' | 'High' | 'Very High';
          bonus?: string;
          description?: string;
          play_url?: string;
          is_new?: boolean;
          is_hot?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      casino_features: {
        Row: {
          id: number;
          casino_id: number;
          feature: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          casino_id: number;
          feature: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          casino_id?: number;
          feature?: string;
          created_at?: string;
        };
      };
      casino_badges: {
        Row: {
          id: number;
          casino_id: number;
          badge: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          casino_id: number;
          badge: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          casino_id?: number;
          badge?: string;
          created_at?: string;
        };
      };
      casino_links: {
        Row: {
          id: number;
          casino_id: number;
          link_type: 'bonus' | 'review' | 'complaint';
          url: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          casino_id: number;
          link_type: 'bonus' | 'review' | 'complaint';
          url: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          casino_id?: number;
          link_type?: 'bonus' | 'review' | 'complaint';
          url?: string;
          created_at?: string;
        };
      };
      casino_categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      casino_category_assignments: {
        Row: {
          id: number;
          casino_id: number;
          category_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          casino_id: number;
          category_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          casino_id?: number;
          category_id?: number;
          created_at?: string;
        };
      };
      user_casino_ratings: {
        Row: {
          id: string;
          user_id: string;
          casino_id: number;
          rating: number;
          review: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          casino_id: number;
          rating: number;
          review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          casino_id?: number;
          rating?: number;
          review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      news_articles: {
        Row: {
          id: number;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author: string;
          category: string;
          image_url: string | null;
          read_time: string | null;
          is_published: boolean;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author: string;
          category: string;
          image_url?: string | null;
          read_time?: string | null;
          is_published?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          author?: string;
          category?: string;
          image_url?: string | null;
          read_time?: string | null;
          is_published?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types for application use
export type Casino = Database['public']['Tables']['casinos']['Row'];
export type CasinoInsert = Database['public']['Tables']['casinos']['Insert'];
export type CasinoUpdate = Database['public']['Tables']['casinos']['Update'];

export type CasinoFeature = Database['public']['Tables']['casino_features']['Row'];
export type CasinoBadge = Database['public']['Tables']['casino_badges']['Row'];
export type CasinoLink = Database['public']['Tables']['casino_links']['Row'];
export type CasinoCategory = Database['public']['Tables']['casino_categories']['Row'];

export type UserCasinoRating = Database['public']['Tables']['user_casino_ratings']['Row'];
export type UserCasinoRatingInsert = Database['public']['Tables']['user_casino_ratings']['Insert'];

export type NewsArticle = Database['public']['Tables']['news_articles']['Row'];
export type NewsArticleInsert = Database['public']['Tables']['news_articles']['Insert'];
export type NewsArticleUpdate = Database['public']['Tables']['news_articles']['Update'];

// Extended types with relationships
export interface CasinoWithDetails extends Casino {
  features: CasinoFeature[];
  badges: CasinoBadge[];
  links: CasinoLink[];
  categories: CasinoCategory[];
  user_ratings?: UserCasinoRating[];
  average_user_rating?: number;
  total_user_ratings?: number;
}

export interface CasinoForCard {
  id: number;
  name: string;
  logo: string;
  rating: number;
  safetyIndex: 'Low' | 'Medium' | 'High' | 'Very High';
  bonus: string;
  features: string[];
  description: string;
  badges: string[];
  isNew?: boolean;
  isHot?: boolean;
  links: {
    bonus: string;
    review: string;
    complaint: string;
  };
  playUrl: string;
}

// Search and filter types
export interface CasinoSearchParams {
  search?: string;
  category?: string;
  safetyIndex?: string[];
  rating?: number;
  isNew?: boolean;
  isHot?: boolean;
  isFeatured?: boolean;
  sortBy?: 'rating' | 'name' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface NewsSearchParams {
  search?: string;
  category?: string;
  author?: string;
  isPublished?: boolean;
  sortBy?: 'published_at' | 'title' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Admin system types
export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: Record<string, any>;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface AdminPermission {
  id: number;
  name: string;
  description?: string;
  category: string;
  created_at: string;
}

export interface AdminRolePermission {
  id: number;
  admin_user_id: string;
  permission_id: number;
  granted_by?: string;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_user_id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface CurrentUserAdminInfo {
  is_admin: boolean;
  role?: 'super_admin' | 'admin' | 'moderator' | null;
  email?: string | null;
  total_permissions: number;
}

export interface AdminUserWithPermissions extends AdminUser {
  permissions_list: AdminPermission[];
  permissions_count: number;
}
