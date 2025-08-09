// CGSG404 Homepage Data Management Hook
// Unified hook for all homepage content operations
// Replaces complex casino hooks with focused homepage management

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types
interface Banner {
  id: number
  title: string
  subtitle?: string
  highlight?: string
  cta_text?: string
  cta_link?: string
  image_url?: string
  gradient_class?: string
  display_order: number
}

interface Statistic {
  id: number
  key: string
  value: string
  label: string
  icon?: string
  order: number
}

interface Feature {
  id: number
  title: string
  description?: string
  icon?: string
  color_class?: string
  order: number
}

interface HomepageData {
  banners: Banner[]
  statistics: Statistic[]
  features: Feature[]
  content: Record<string, string>
  maintenance?: {
    is_maintenance: boolean
    message: string
  }
}

interface HomepageResponse {
  success: boolean
  data: HomepageData
  timestamp: string
}

// API functions
const fetchHomepageData = async (): Promise<HomepageData> => {
  const response = await fetch('/api/homepage', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch homepage data: ${response.statusText}`)
  }

  const result: HomepageResponse = await response.json()
  
  if (!result.success) {
    throw new Error('Failed to fetch homepage data')
  }

  return result.data
}

const createHomepageContent = async (type: string, data: any) => {
  const response = await fetch('/api/homepage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, data }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create ${type}: ${response.statusText}`)
  }

  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || `Failed to create ${type}`)
  }

  return result.data
}

const updateHomepageContent = async (type: string, id: number, data: any) => {
  const response = await fetch('/api/homepage', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, id, data }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update ${type}: ${response.statusText}`)
  }

  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || `Failed to update ${type}`)
  }

  return result.data
}

const deleteHomepageContent = async (type: string, id: number) => {
  const response = await fetch(`/api/homepage?type=${type}&id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete ${type}: ${response.statusText}`)
  }

  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || `Failed to delete ${type}`)
  }

  return result
}

// Main hook
export const useHomepage = () => {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Query for homepage data
  const {
    data: homepageData,
    isLoading: isQueryLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['homepage-data'],
    queryFn: fetchHomepageData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  })

  // Create mutations
  const createMutation = useMutation({
    mutationFn: ({ type, data }: { type: string; data: any }) => 
      createHomepageContent(type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-data'] })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ type, id, data }: { type: string; id: number; data: any }) => 
      updateHomepageContent(type, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-data'] })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: string; id: number }) => 
      deleteHomepageContent(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-data'] })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  // Helper functions
  const createBanner = useCallback((bannerData: Omit<Banner, 'id'>) => {
    return createMutation.mutateAsync({ type: 'banner', data: bannerData })
  }, [createMutation])

  const updateBanner = useCallback((id: number, bannerData: Partial<Banner>) => {
    return updateMutation.mutateAsync({ type: 'banner', id, data: bannerData })
  }, [updateMutation])

  const deleteBanner = useCallback((id: number) => {
    return deleteMutation.mutateAsync({ type: 'banner', id })
  }, [deleteMutation])

  const updateStatistic = useCallback((statisticData: Omit<Statistic, 'id'>) => {
    return createMutation.mutateAsync({ type: 'statistic', data: statisticData })
  }, [createMutation])

  const createFeature = useCallback((featureData: Omit<Feature, 'id'>) => {
    return createMutation.mutateAsync({ type: 'feature', data: featureData })
  }, [createMutation])

  const updateFeature = useCallback((id: number, featureData: Partial<Feature>) => {
    return updateMutation.mutateAsync({ type: 'feature', id, data: { ...featureData, id } })
  }, [updateMutation])

  const deleteFeature = useCallback((id: number) => {
    return deleteMutation.mutateAsync({ type: 'feature', id })
  }, [deleteMutation])

  const updatePageContent = useCallback((contentData: {
    page_name?: string
    section_name: string
    content_key: string
    content_value: string
    content_type?: string
  }) => {
    return createMutation.mutateAsync({ type: 'content', data: contentData })
  }, [createMutation])

  // Refresh data
  const refreshData = useCallback(() => {
    return refetch()
  }, [refetch])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Combined loading state
  const combinedLoading = isQueryLoading || 
    createMutation.isPending || 
    updateMutation.isPending || 
    deleteMutation.isPending

  // Combined error state
  const combinedError = error || 
    (queryError instanceof Error ? queryError.message : null) ||
    (createMutation.error instanceof Error ? createMutation.error.message : null) ||
    (updateMutation.error instanceof Error ? updateMutation.error.message : null) ||
    (deleteMutation.error instanceof Error ? deleteMutation.error.message : null)

  return {
    // Data
    data: homepageData,
    banners: homepageData?.banners || [],
    statistics: homepageData?.statistics || [],
    features: homepageData?.features || [],
    content: homepageData?.content || {},
    maintenance: homepageData?.maintenance,
    
    // States
    isLoading: combinedLoading,
    error: combinedError,
    
    // Banner operations
    createBanner,
    updateBanner,
    deleteBanner,
    
    // Statistics operations
    updateStatistic,
    
    // Features operations
    createFeature,
    updateFeature,
    deleteFeature,
    
    // Content operations
    updatePageContent,
    
    // Utility functions
    refreshData,
    clearError,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

// Specialized hooks for specific sections
export const useHomepageBanners = () => {
  const { banners, createBanner, updateBanner, deleteBanner, isLoading, error } = useHomepage()
  
  return {
    banners,
    createBanner,
    updateBanner,
    deleteBanner,
    isLoading,
    error
  }
}

export const useHomepageStatistics = () => {
  const { statistics, updateStatistic, isLoading, error } = useHomepage()
  
  return {
    statistics,
    updateStatistic,
    isLoading,
    error
  }
}

export const useHomepageFeatures = () => {
  const { features, createFeature, updateFeature, deleteFeature, isLoading, error } = useHomepage()
  
  return {
    features,
    createFeature,
    updateFeature,
    deleteFeature,
    isLoading,
    error
  }
}

export const useHomepageContent = () => {
  const { content, updatePageContent, isLoading, error } = useHomepage()
  
  return {
    content,
    updatePageContent,
    isLoading,
    error
  }
}

export default useHomepage