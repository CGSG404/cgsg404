// Simple auth utilities
export const validateAuthCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') {
    return false;
  }
  
  // Basic validation - should be a reasonable length and contain valid characters
  if (code.length < 10 || code.length > 2000) {
    return false;
  }
  
  // Should contain only URL-safe characters
  const validPattern = /^[A-Za-z0-9._~-]+$/;
  return validPattern.test(code);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error';
  
  if (typeof error === 'string') {
    return error.substring(0, 200);
  }
  
  if (error.message) {
    return String(error.message).substring(0, 200);
  }
  
  return String(error).substring(0, 200);
};

// Detect potentially malformed/split OAuth code values
// Returns true if suspicious delimiters or spaces are present
export const isSupabaseSplitError = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;
  // If code contains whitespace or URL query delimiters, it's likely broken
  return /\s|[&=%]/.test(code);
};
