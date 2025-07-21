/**
 * API Client utility for consistent API calls
 * Ensures all API calls use the correct domain and headers
 */

// Use relative URLs for same-origin requests to avoid CORS issues
const API_BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gurusingapore.com');

interface ApiOptions extends RequestInit {
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: ApiOptions = {}
  ): Promise<T> {
    const { timeout = 10000, ...fetchOptions } = options;
    
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Build full URL
    const url = `${this.baseUrl}${normalizedEndpoint}`;
    
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Merge headers
    const headers = {
      ...defaultHeaders,
      ...fetchOptions.headers,
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  // GET request
  async get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiOptions };

// Specific API functions
export const casinosApi = {
  getAll: () => apiClient.get<{ casinos: any[] }>('/api/casinos'),
  getById: (id: string) => apiClient.get<{ casino: any }>(`/api/casinos/${id}`),
  create: (data: any) => apiClient.post<{ casino: any }>('/api/casinos', data),
  update: (id: string, data: any) => apiClient.put<{ casino: any }>(`/api/casinos/${id}`, data),
  delete: (id: string) => apiClient.delete<{ success: boolean }>(`/api/casinos/${id}`),
};
