// Auth utility functions - PRODUCTION SAFE

export const redirectToAdmin = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🏠 Redirecting to admin...');
  }
  window.location.href = '/admin';
};

export const redirectToSignin = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 Redirecting to signin...');
  }
  window.location.href = '/signin';
};

export const redirectToHome = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🏠 Redirecting to home...');
  }
  window.location.href = '/';
};

// Development-only functions
export const clearAuthData = () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('clearAuthData is only available in development mode');
    return false;
  }

  try {
    // Clear localStorage
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-project-auth-token');

    // Clear sessionStorage
    sessionStorage.removeItem('admin_session_id');
    sessionStorage.clear();

    console.log('✅ Auth data cleared (development only)');
    return true;
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return false;
  }
};

export const getAuthDebugInfo = () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('getAuthDebugInfo is only available in development mode');
    return null;
  }

  const info = {
    url: {
      href: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
    },
  };

  console.log('🔍 Auth Debug Info (development only):', info);
  return info;
};
