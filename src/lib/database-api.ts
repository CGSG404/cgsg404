import { supabase } from './supabaseClient';
import type {
  Casino,
  CasinoWithDetails,
  CasinoForCard,
  CasinoSearchParams,
  NewsArticle,
  NewsSearchParams,
  UserCasinoRating,
  UserCasinoRatingInsert,
  CurrentUserAdminInfo
} from '@/types/database';

export const databaseApi = {
  // ===== CASINO OPERATIONS =====
  
  // Get all casinos with details
  async getCasinos(params: CasinoSearchParams = {}): Promise<CasinoWithDetails[]> {
    let query = supabase
      .from('casinos')
      .select(`
        *,
        casino_features(feature),
        casino_badges(badge),
        casino_links(link_type, url),
        casino_category_assignments(
          casino_categories(name)
        )
      `);

    // Apply filters
    if (params.search) {
      query = query.ilike('name', `%${params.search}%`);
    }
    
    if (params.safetyIndex && params.safetyIndex.length > 0) {
      query = query.in('safety_index', params.safetyIndex);
    }
    
    if (params.rating) {
      query = query.gte('rating', params.rating);
    }
    
    if (params.isNew !== undefined) {
      query = query.eq('is_new', params.isNew);
    }
    
    if (params.isHot !== undefined) {
      query = query.eq('is_hot', params.isHot);
    }
    
    if (params.isFeatured !== undefined) {
      query = query.eq('is_featured', params.isFeatured);
    }

    // Apply sorting
    const sortBy = params.sortBy || 'rating';
    const sortOrder = params.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform data to include relationships
    return data?.map(casino => ({
      ...casino,
      features: casino.casino_features?.map(f => f) || [],
      badges: casino.casino_badges?.map(b => b) || [],
      links: casino.casino_links || [],
      categories: casino.casino_category_assignments?.map(ca => ca.casino_categories).filter(Boolean) || []
    })) || [];
  },

  // Get casinos formatted for CasinoCard component
  async getCasinosForCards(params: CasinoSearchParams = {}): Promise<CasinoForCard[]> {
    const casinos = await this.getCasinos(params);
    
    return casinos.map(casino => ({
      id: casino.id,
      name: casino.name,
      logo: casino.logo,
      rating: casino.rating,
      safetyIndex: casino.safety_index,
      bonus: casino.bonus,
      features: casino.features?.map(f => f.feature) || [],
      description: casino.description,
      badges: casino.badges?.map(b => b.badge) || [],
      isNew: casino.is_new,
      isHot: casino.is_hot,
      links: {
        bonus: casino.links?.find(l => l.link_type === 'bonus')?.url || '',
        review: casino.links?.find(l => l.link_type === 'review')?.url || '',
        complaint: casino.links?.find(l => l.link_type === 'complaint')?.url || ''
      },
      playUrl: casino.play_url
    }));
  },

  // Get single casino by ID or slug
  async getCasino(identifier: string | number): Promise<CasinoWithDetails | null> {
    const isNumeric = typeof identifier === 'number' || !isNaN(Number(identifier));
    const column = isNumeric ? 'id' : 'slug';
    
    const { data, error } = await supabase
      .from('casinos')
      .select(`
        *,
        casino_features(feature),
        casino_badges(badge),
        casino_links(link_type, url),
        casino_category_assignments(
          casino_categories(name)
        ),
        user_casino_ratings(rating, review, created_at)
      `)
      .eq(column, identifier)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    if (!data) return null;

    // Calculate average user rating
    const userRatings = data.user_casino_ratings || [];
    const averageUserRating = userRatings.length > 0 
      ? userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length 
      : 0;

    return {
      ...data,
      features: data.casino_features || [],
      badges: data.casino_badges || [],
      links: data.casino_links || [],
      categories: data.casino_category_assignments?.map(ca => ca.casino_categories).filter(Boolean) || [],
      user_ratings: userRatings,
      average_user_rating: averageUserRating,
      total_user_ratings: userRatings.length
    };
  },

  // ===== NEWS OPERATIONS =====
  
  // Get news articles
  async getNewsArticles(params: NewsSearchParams = {}): Promise<NewsArticle[]> {
    let query = supabase
      .from('news_articles')
      .select('*');

    // Apply filters
    if (params.search) {
      query = query.or(`title.ilike.%${params.search}%,excerpt.ilike.%${params.search}%`);
    }
    
    if (params.category) {
      query = query.eq('category', params.category);
    }
    
    if (params.author) {
      query = query.eq('author', params.author);
    }
    
    if (params.isPublished !== undefined) {
      query = query.eq('is_published', params.isPublished);
    }

    // Apply sorting
    const sortBy = params.sortBy || 'published_at';
    const sortOrder = params.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },

  // Get single news article
  async getNewsArticle(identifier: string | number): Promise<NewsArticle | null> {
    const isNumeric = typeof identifier === 'number' || !isNaN(Number(identifier));
    const column = isNumeric ? 'id' : 'slug';
    
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq(column, identifier)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },

  // ===== USER RATING OPERATIONS =====
  
  // Get user rating for a casino
  async getUserCasinoRating(userId: string, casinoId: number): Promise<UserCasinoRating | null> {
    const { data, error } = await supabase
      .from('user_casino_ratings')
      .select('*')
      .eq('user_id', userId)
      .eq('casino_id', casinoId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },

  // Rate a casino
  async rateCasino(rating: UserCasinoRatingInsert): Promise<UserCasinoRating> {
    const { data, error } = await supabase
      .from('user_casino_ratings')
      .upsert(rating)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== ENHANCED SEARCH OPERATIONS =====

  // Enhanced advanced search with performance optimization
  async advancedSearch(params: {
    query?: string;
    safetyIndex?: string[];
    rating?: { min?: number; max?: number };
    bonusAmount?: { min?: number; max?: number };
    features?: string[];
    categories?: string[];
    isNew?: boolean;
    isHot?: boolean;
    isFeatured?: boolean;
    sortBy?: 'relevance' | 'rating' | 'name' | 'created_at' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
    includeInactive?: boolean;
  }) {
    const startTime = Date.now();

    let query = supabase
      .from('casinos')
      .select(`
        *,
        casino_features(feature),
        casino_badges(badge),
        casino_links(link_type, url),
        casino_category_assignments(
          casino_categories(name)
        )
      `, { count: 'exact' });

    // Text search across multiple fields
    if (params.query) {
      const searchTerm = `%${params.query}%`;
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},bonus.ilike.${searchTerm}`);
    }

    // Safety index filter
    if (params.safetyIndex && params.safetyIndex.length > 0) {
      query = query.in('safety_index', params.safetyIndex);
    }

    // Rating filter
    if (params.rating) {
      if (params.rating.min !== undefined) {
        query = query.gte('rating', params.rating.min);
      }
      if (params.rating.max !== undefined) {
        query = query.lte('rating', params.rating.max);
      }
    }

    // Boolean filters
    if (params.isNew !== undefined) {
      query = query.eq('is_new', params.isNew);
    }
    if (params.isHot !== undefined) {
      query = query.eq('is_hot', params.isHot);
    }
    if (params.isFeatured !== undefined) {
      query = query.eq('is_featured', params.isFeatured);
    }

    // Sorting
    const sortBy = params.sortBy || 'rating';
    if (sortBy === 'relevance' && params.query) {
      // For relevance, we'll sort by exact name matches first, then rating
      query = query.order('rating', { ascending: false });
    } else {
      const ascending = sortBy === 'name';
      query = query.order(sortBy === 'relevance' ? 'rating' : sortBy, { ascending });
    }

    // Pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(casino => ({
      ...casino,
      features: casino.casino_features?.map(f => f) || [],
      badges: casino.casino_badges?.map(b => b) || [],
      links: casino.casino_links || [],
      categories: casino.casino_category_assignments?.map(ca => ca.casino_categories).filter(Boolean) || []
    })) || [];
  },

  // Global search across casinos and news
  async globalSearch(query: string, limit: number = 10) {
    const [casinos, news] = await Promise.all([
      this.advancedSearch({ query, limit }),
      this.getNewsArticles({ search: query, limit })
    ]);

    return {
      casinos: casinos.map(casino => ({
        id: casino.id,
        name: casino.name,
        logo: casino.logo,
        rating: casino.rating,
        safetyIndex: casino.safety_index,
        bonus: casino.bonus,
        features: casino.features?.map(f => f.feature) || [],
        description: casino.description,
        badges: casino.badges?.map(b => b.badge) || [],
        isNew: casino.is_new,
        isHot: casino.is_hot,
        links: {
          bonus: casino.links?.find(l => l.link_type === 'bonus')?.url || '',
          review: casino.links?.find(l => l.link_type === 'review')?.url || '',
          complaint: casino.links?.find(l => l.link_type === 'complaint')?.url || ''
        },
        playUrl: casino.play_url
      })),
      news,
      total: casinos.length + news.length
    };
  },

  // Smart search suggestions with autocomplete
  async getSearchSuggestions(query: string, limit: number = 8) {
    if (!query.trim()) return { suggestions: [], categories: [] };

    const [casinoSuggestions, featureSuggestions, categorySuggestions] = await Promise.all([
      // Casino name suggestions
      supabase
        .from('casinos')
        .select('name, slug, rating')
        .ilike('name', `%${query}%`)
        .order('rating', { ascending: false })
        .limit(limit),

      // Feature suggestions
      supabase
        .from('casino_features')
        .select('feature')
        .ilike('feature', `%${query}%`)
        .limit(3),

      // Category suggestions
      supabase
        .from('casino_categories')
        .select('name')
        .ilike('name', `%${query}%`)
        .limit(3)
    ]);

    const suggestions = [
      // Casino suggestions
      ...(casinoSuggestions.data || []).map(casino => ({
        type: 'casino' as const,
        text: casino.name,
        subtitle: `Rating: ${casino.rating}/5`,
        href: `/casinos/${casino.slug}`,
        icon: '🎰'
      })),

      // Feature suggestions
      ...(featureSuggestions.data || []).map(feature => ({
        type: 'feature' as const,
        text: feature.feature,
        subtitle: 'Casino Feature',
        href: `/casinos?feature=${encodeURIComponent(feature.feature)}`,
        icon: '⭐'
      })),

      // Category suggestions
      ...(categorySuggestions.data || []).map(category => ({
        type: 'category' as const,
        text: category.name,
        subtitle: 'Casino Category',
        href: `/casinos?category=${encodeURIComponent(category.name)}`,
        icon: '📂'
      }))
    ];

    return {
      suggestions: suggestions.slice(0, limit),
      categories: ['Casinos', 'Features', 'Categories']
    };
  },

  // Popular searches based on actual data
  async getPopularSearches(limit: number = 6) {
    const { data: topCasinos } = await supabase
      .from('casinos')
      .select('name')
      .order('rating', { ascending: false })
      .limit(3);

    const { data: topCategories } = await supabase
      .from('casino_categories')
      .select('name')
      .limit(3);

    const popular = [
      ...(topCasinos || []).map(casino => casino.name),
      ...(topCategories || []).map(category => category.name)
    ];

    return popular.slice(0, limit);
  },

  // Search filters data
  async getSearchFilters() {
    const [categories, features, safetyIndexes] = await Promise.all([
      supabase.from('casino_categories').select('name').order('name'),
      supabase.from('casino_features').select('feature').order('feature'),
      supabase.from('casinos').select('safety_index').order('safety_index')
    ]);

    return {
      categories: [...new Set(categories.data?.map(c => c.name) || [])],
      features: [...new Set(features.data?.map(f => f.feature) || [])],
      safetyIndexes: [...new Set(safetyIndexes.data?.map(s => s.safety_index) || [])]
    };
  },

  // ===== STATISTICS =====

  // Get platform statistics
  async getStatistics() {
    const [casinosCount, newsCount, ratingsCount] = await Promise.all([
      supabase.from('casinos').select('id', { count: 'exact', head: true }),
      supabase.from('news_articles').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('user_casino_ratings').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalCasinos: casinosCount.count || 0,
      totalNews: newsCount.count || 0,
      totalRatings: ratingsCount.count || 0
    };
  },

  // ===== ADMIN SYSTEM =====

  // Check if current user is admin
  async isCurrentUserAdmin(): Promise<boolean> {
    try {
      console.log('🔍 DatabaseAPI: Checking if current user is admin...');
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.warn('⚠️ DatabaseAPI: Error checking admin status:', error);
        // For non-admin users, this might be expected, so return false instead of throwing
        return false;
      }
      console.log('✅ DatabaseAPI: Admin check result:', data);
      return Boolean(data);
    } catch (error) {
      console.error('❌ DatabaseAPI: isCurrentUserAdmin failed:', error);
      return false;
    }
  },

  // Get current user admin info - SECURITY FIXED
  async getCurrentUserAdminInfo(): Promise<CurrentUserAdminInfo> {
    try {
      console.log('🔍 DatabaseAPI: Getting current user admin info...');

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('🔍 DatabaseAPI: No authenticated user');
        return {
          is_admin: false,
          role: null,
          email: null,
          total_permissions: 0
        };
      }

      // Direct query to admin_users table - NO RPC FUNCTIONS
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select(`
          id,
          user_id,
          email,
          role,
          is_active,
          admin_role_permissions(count)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (adminError || !adminRecord) {
        console.log('🔍 DatabaseAPI: User is not admin (no record found)');
        return {
          is_admin: false,
          role: null,
          email: null,
          total_permissions: 0
        };
      }

      console.log('✅ DatabaseAPI: User is admin:', adminRecord.email);

      // Count permissions
      const permissionCount = Array.isArray(adminRecord.admin_role_permissions)
        ? adminRecord.admin_role_permissions.length
        : 0;

      return {
        is_admin: true,
        role: adminRecord.role || 'admin',
        email: adminRecord.email,
        total_permissions: permissionCount
      };

    } catch (error) {
      console.error('❌ DatabaseAPI: getCurrentUserAdminInfo failed:', error);
      return {
        is_admin: false,
        role: null,
        email: null,
        total_permissions: 0
      };
    }
  },

  // Setup current user as super admin
  async setupSuperAdmin(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔧 DatabaseAPI: Setting up super admin...');

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Not authenticated');
      }

      // Try to call setup function if it exists
      const { data: setupResult, error: setupError } = await supabase.rpc('setup_super_admin');

      if (setupError) {
        console.warn('⚠️ DatabaseAPI: setup_super_admin RPC failed, trying direct insert:', setupError);

        // Fallback: Direct insert into admin_users table
        const { data: insertResult, error: insertError } = await supabase
          .from('admin_users')
          .upsert({
            user_id: user.id,
            email: user.email,
            role: 'super_admin',
            is_active: true,
            created_by: user.id,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        return {
          success: true,
          message: 'Super admin setup completed (direct insert)',
          data: insertResult
        };
      }

      return {
        success: true,
        message: 'Super admin setup completed',
        data: setupResult
      };
    } catch (error) {
      console.error('❌ DatabaseAPI: setupSuperAdmin failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Setup failed'
      };
    }
  },

  // Check if current user has specific permission
  async hasPermission(permission: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('has_permission', { permission_id: permission });
    if (error) throw error;
    return data || false;
  },

  // Setup admin user (for initial setup)
  async setupAdminUser(email: string, role: 'super_admin' | 'admin' | 'moderator' = 'admin') {
    const { data, error } = await supabase.rpc('setup_admin_user', {
      admin_email: email,
      admin_role: role
    });
    if (error) throw error;
    return data;
  },

  // Get all admin users (super admin only)
  async getAllAdminUsers() {
    const { data, error } = await supabase.rpc('get_all_admin_users');
    if (error) throw error;
    return data || [];
  },

  // Enhanced admin activity logging
  async logAdminActivity(
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, any>,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info',
    sessionId?: string
  ) {
    const { data, error } = await supabase.rpc('enhanced_admin_log', {
      action_name: action,
      resource_type_param: resourceType,
      resource_id_param: resourceId,
      details_param: details,
      severity_level: severity,
      session_id_param: sessionId
    });
    if (error) throw error;
    return data;
  },

  // Get admin activity logs
  async getAdminActivityLogs(limit: number = 50, offset: number = 0) {
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select(`
        *,
        admin_users!inner(email, role)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // Get admin permissions
  async getAdminPermissions() {
    const { data, error } = await supabase
      .from('admin_permissions')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // ===== MONITORING & ANALYTICS =====

  // Get admin metrics dashboard data
  async getAdminMetrics() {
    const { data, error } = await supabase.rpc('get_admin_metrics');
    if (error) throw error;
    return data || {};
  },

  // Get admin activity summary
  async getAdminActivitySummary(daysBack: number = 7) {
    const { data, error } = await supabase.rpc('get_admin_activity_summary', {
      days_back: daysBack
    });
    if (error) throw error;
    return data || [];
  },

  // Get security alerts
  async getSecurityAlerts(onlyUnresolved: boolean = true) {
    let query = supabase
      .from('security_alerts')
      .select(`
        *,
        admin_users!admin_user_id(email, role),
        resolved_admin:admin_users!resolved_by(email, role)
      `)
      .order('created_at', { ascending: false });

    if (onlyUnresolved) {
      query = query.eq('is_resolved', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Resolve security alert
  async resolveSecurityAlert(alertId: string, resolutionNotes?: string) {
    const { data, error } = await supabase.rpc('resolve_security_alert', {
      alert_id: alertId,
      resolution_notes: resolutionNotes
    });
    if (error) throw error;
    return data;
  },

  // Get recent admin activities with pagination
  async getRecentAdminActivities(limit: number = 50, offset: number = 0) {
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select(`
        *,
        admin_users!inner(email, role)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // Get admin performance metrics
  async getAdminPerformanceMetrics(adminUserId?: string, daysBack: number = 30) {
    let query = supabase
      .from('admin_activity_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString());

    if (adminUserId) {
      query = query.eq('admin_user_id', adminUserId);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Process data for metrics
    const activities = data || [];
    const actionCounts = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dailyActivity = activities.reduce((acc, activity) => {
      const date = new Date(activity.created_at).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalActions: activities.length,
      actionBreakdown: actionCounts,
      dailyActivity,
      averageActionsPerDay: activities.length / daysBack,
      mostActiveDay: Object.entries(dailyActivity).sort(([,a], [,b]) => b - a)[0]
    };
  },

  // ===== ADMIN CASINO MANAGEMENT =====

  // Create new casino
  async createCasino(casinoData: any) {
    try {
      console.log('🔍 Creating casino with data:', casinoData);

      // Use API route for server-side operations
      const response = await fetch('/api/admin/casinos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(casinoData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Casino created successfully:', data);
      return data.data; // Return the actual casino data, not the wrapper

    } catch (error) {
      console.error('❌ createCasino error:', error);
      throw error;
    }
  },

  // Get casinos with pagination for admin
  async getCasinosWithPagination(params: {
    search?: string;
    sortBy?: 'name' | 'rating' | 'created_at';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  } = {}) {
    const { search, sortBy = 'name', sortOrder = 'asc', limit = 10, offset = 0 } = params;

    let query = supabase
      .from('casinos')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      casinos: data || [],
      total: count || 0,
      page: currentPage,
      limit,
      totalPages
    };
  },

  // Update casino status
  async updateCasinoStatus(casinoId: number, updates: {
    is_featured?: boolean;
    is_hot?: boolean;
    is_new?: boolean;
  }) {
    const { data, error } = await supabase
      .from('casinos')
      .update(updates)
      .eq('id', casinoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update casino
  async updateCasino(casinoId: string | number, updates: any) {
    try {
      console.log('🔍 Updating casino:', casinoId, updates);

      const response = await fetch(`/api/admin/casinos/${casinoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Casino updated successfully:', data);
      return data.data;
    } catch (error) {
      console.error('❌ updateCasino error:', error);
      throw error;
    }
  },

  // Delete casino
  async deleteCasino(casinoId: number) {
    try {
      console.log('🔍 Deleting casino:', casinoId);

      const response = await fetch(`/api/admin/casinos/${casinoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Casino deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ deleteCasino error:', error);
      throw error;
    }
  },

  // Bulk delete casinos
  async bulkDeleteCasinos(ids: number[]) {
    try {
      console.log('🔍 Bulk deleting casinos:', ids);

      const response = await fetch('/api/admin/casinos/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Casinos bulk deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ bulkDeleteCasinos error:', error);
      throw error;
    }
  },

  // Update casino status (featured, hot, new)
  async updateCasinoStatus(id: number, status: { is_featured?: boolean; is_hot?: boolean; is_new?: boolean }) {
    try {
      console.log('🔍 Updating casino status:', id, status);

      const response = await fetch(`/api/admin/casinos/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Casino status updated successfully:', data);
      return data.data;
    } catch (error) {
      console.error('❌ updateCasinoStatus error:', error);
      throw error;
    }
  },

  // Get casinos for admin (with pagination)
  async getAdminCasinos(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: {
      safety_index?: string[];
      is_featured?: boolean;
      is_hot?: boolean;
      is_new?: boolean;
    };
  } = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {}
    } = params;

    let query = supabase
      .from('casinos')
      .select(`
        *,
        casino_features(feature),
        casino_badges(badge),
        casino_links(link_type, url),
        casino_category_assignments(
          casino_categories(name)
        )
      `, { count: 'exact' });

    // Apply search
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply filters
    if (filters.safety_index && filters.safety_index.length > 0) {
      query = query.in('safety_index', filters.safety_index);
    }

    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    if (filters.is_hot !== undefined) {
      query = query.eq('is_hot', filters.is_hot);
    }

    if (filters.is_new !== undefined) {
      query = query.eq('is_new', filters.is_new);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      casinos: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }
};
