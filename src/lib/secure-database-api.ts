// src/lib/secure-database-api.ts
import { supabase } from './supabaseClient';
import { encrypt, decrypt, encryptUserData, decryptUserData } from './encryption';
import type {
  Casino,
  CasinoWithDetails,
  CasinoInsert,
  CasinoUpdate,
  UserCasinoRating,
  UserCasinoRatingInsert
} from '@/types/database';

/**
 * Secure database API with encryption for sensitive data
 */
export const secureDatabaseApi = {
  
  // ===== SECURE CASINO OPERATIONS =====
  
  /**
   * Create casino with encrypted sensitive data
   */
  async createSecureCasino(casinoData: CasinoInsert & {
    paymentMethods?: string[];
    affiliateLinks?: Record<string, string>;
    internalNotes?: string;
  }): Promise<Casino> {
    try {
      // Separate sensitive and non-sensitive data
      const {
        paymentMethods,
        affiliateLinks,
        internalNotes,
        ...publicData
      } = casinoData;
      
      // Encrypt sensitive data
      const encryptedData: any = { ...publicData };
      
      if (paymentMethods && paymentMethods.length > 0) {
        encryptedData.encrypted_payment_methods = encrypt(JSON.stringify(paymentMethods));
      }
      
      if (affiliateLinks && Object.keys(affiliateLinks).length > 0) {
        encryptedData.encrypted_affiliate_links = encrypt(JSON.stringify(affiliateLinks));
      }
      
      if (internalNotes) {
        encryptedData.encrypted_internal_notes = encrypt(internalNotes);
      }
      
      const { data, error } = await supabase
        .from('casinos')
        .insert([encryptedData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Failed to create secure casino:', error);
      throw new Error('Failed to create casino with encrypted data');
    }
  },
  
  /**
   * Update casino with encrypted sensitive data
   */
  async updateSecureCasino(
    casinoId: number, 
    updates: CasinoUpdate & {
      paymentMethods?: string[];
      affiliateLinks?: Record<string, string>;
      internalNotes?: string;
    }
  ): Promise<Casino> {
    try {
      // Separate sensitive and non-sensitive updates
      const {
        paymentMethods,
        affiliateLinks,
        internalNotes,
        ...publicUpdates
      } = updates;
      
      // Encrypt sensitive updates
      const encryptedUpdates: any = { ...publicUpdates };
      
      if (paymentMethods !== undefined) {
        encryptedUpdates.encrypted_payment_methods = paymentMethods.length > 0 
          ? encrypt(JSON.stringify(paymentMethods))
          : null;
      }
      
      if (affiliateLinks !== undefined) {
        encryptedUpdates.encrypted_affiliate_links = Object.keys(affiliateLinks).length > 0
          ? encrypt(JSON.stringify(affiliateLinks))
          : null;
      }
      
      if (internalNotes !== undefined) {
        encryptedUpdates.encrypted_internal_notes = internalNotes 
          ? encrypt(internalNotes)
          : null;
      }
      
      const { data, error } = await supabase
        .from('casinos')
        .update(encryptedUpdates)
        .eq('id', casinoId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Failed to update secure casino:', error);
      throw new Error('Failed to update casino with encrypted data');
    }
  },
  
  /**
   * Get casino with decrypted sensitive data (admin only)
   */
  async getSecureCasino(casinoId: number): Promise<CasinoWithDetails & {
    paymentMethods?: string[];
    affiliateLinks?: Record<string, string>;
    internalNotes?: string;
  } | null> {
    try {
      const { data, error } = await supabase
        .from('casinos')
        .select(`
          *,
          casino_features(feature),
          casino_badges(badge),
          casino_links(link_type, url),
          casino_category_assignments(
            casino_categories(name)
          )
        `)
        .eq('id', casinoId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      // Decrypt sensitive data
      const decryptedCasino: any = { ...data };
      
      if (data.encrypted_payment_methods) {
        try {
          decryptedCasino.paymentMethods = JSON.parse(decrypt(data.encrypted_payment_methods));
        } catch (decryptError) {
          console.warn('Failed to decrypt payment methods for casino', casinoId);
        }
      }
      
      if (data.encrypted_affiliate_links) {
        try {
          decryptedCasino.affiliateLinks = JSON.parse(decrypt(data.encrypted_affiliate_links));
        } catch (decryptError) {
          console.warn('Failed to decrypt affiliate links for casino', casinoId);
        }
      }
      
      if (data.encrypted_internal_notes) {
        try {
          decryptedCasino.internalNotes = decrypt(data.encrypted_internal_notes);
        } catch (decryptError) {
          console.warn('Failed to decrypt internal notes for casino', casinoId);
        }
      }
      
      return decryptedCasino;
      
    } catch (error) {
      console.error('Failed to get secure casino:', error);
      throw new Error('Failed to retrieve casino with decrypted data');
    }
  },
  
  // ===== SECURE USER RATING OPERATIONS =====
  
  /**
   * Create user rating with encrypted review
   */
  async createSecureRating(ratingData: UserCasinoRatingInsert & {
    personalInfo?: Record<string, any>;
  }): Promise<UserCasinoRating> {
    try {
      const { personalInfo, ...publicRatingData } = ratingData;
      
      // Encrypt sensitive data
      const encryptedRatingData: any = { ...publicRatingData };
      
      if (ratingData.review) {
        encryptedRatingData.encrypted_review = encrypt(ratingData.review);
        delete encryptedRatingData.review; // Remove plain text review
      }
      
      if (personalInfo && Object.keys(personalInfo).length > 0) {
        encryptedRatingData.encrypted_personal_info = encrypt(JSON.stringify(personalInfo));
      }
      
      const { data, error } = await supabase
        .from('user_casino_ratings')
        .insert([encryptedRatingData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Failed to create secure rating:', error);
      throw new Error('Failed to create rating with encrypted data');
    }
  },
  
  /**
   * Get user ratings with decrypted reviews (for admin/owner)
   */
  async getSecureRatings(casinoId: number, userId?: string): Promise<(UserCasinoRating & {
    decryptedReview?: string;
    personalInfo?: Record<string, any>;
  })[]> {
    try {
      let query = supabase
        .from('user_casino_ratings')
        .select('*')
        .eq('casino_id', casinoId);
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Decrypt sensitive data
      const decryptedRatings = (data || []).map(rating => {
        const decryptedRating: any = { ...rating };
        
        if (rating.encrypted_review) {
          try {
            decryptedRating.decryptedReview = decrypt(rating.encrypted_review);
          } catch (decryptError) {
            console.warn('Failed to decrypt review for rating', rating.id);
          }
        }
        
        if (rating.encrypted_personal_info) {
          try {
            decryptedRating.personalInfo = JSON.parse(decrypt(rating.encrypted_personal_info));
          } catch (decryptError) {
            console.warn('Failed to decrypt personal info for rating', rating.id);
          }
        }
        
        return decryptedRating;
      });
      
      return decryptedRatings;
      
    } catch (error) {
      console.error('Failed to get secure ratings:', error);
      throw new Error('Failed to retrieve ratings with decrypted data');
    }
  },
  
  // ===== SECURE USER DATA OPERATIONS =====
  
  /**
   * Store encrypted user profile data
   */
  async createSecureUserProfile(userData: {
    userId: string;
    email: string;
    phone?: string;
    personalInfo: Record<string, any>;
  }) {
    try {
      const encryptedUserData = encryptUserData({
        email: userData.email,
        phone: userData.phone,
        personalInfo: userData.personalInfo
      });
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: userData.userId,
          encrypted_email: encryptedUserData.email,
          encrypted_phone: encryptedUserData.phone,
          encrypted_personal_info: encryptedUserData.personalInfo,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Failed to create secure user profile:', error);
      throw new Error('Failed to create user profile with encrypted data');
    }
  },
  
  /**
   * Get decrypted user profile data (admin only)
   */
  async getSecureUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      // Decrypt user data
      const decryptedProfile = decryptUserData({
        email: data.encrypted_email,
        phone: data.encrypted_phone,
        personalInfo: data.encrypted_personal_info
      });
      
      return {
        ...data,
        ...decryptedProfile
      };
      
    } catch (error) {
      console.error('Failed to get secure user profile:', error);
      throw new Error('Failed to retrieve user profile with decrypted data');
    }
  }
};
