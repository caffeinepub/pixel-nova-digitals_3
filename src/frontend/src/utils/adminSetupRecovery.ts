/**
 * Utility to classify admin-auth related errors into actionable English categories.
 * Helps distinguish between "admin not set up" vs "invalid credentials" vs "backend unavailable".
 */

export type AdminAuthErrorCategory = 
  | 'admin-not-setup'
  | 'invalid-credentials'
  | 'backend-unavailable'
  | 'no-admin-role'
  | 'unknown';

export interface ClassifiedError {
  category: AdminAuthErrorCategory;
  message: string;
  canCreateDefaultAdmin: boolean;
}

/**
 * Classify an admin authentication error into an actionable category.
 * Returns English-only messages safe for display.
 */
export function classifyAdminAuthError(error: any): ClassifiedError {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error?.message || String(error);
  
  const lowerMessage = errorMessage.toLowerCase();

  // Admin not setup - must be checked FIRST before other patterns
  if (
    lowerMessage.includes('admin not setup') ||
    lowerMessage.includes('admin not set up') ||
    lowerMessage.includes('no admin exists') ||
    lowerMessage.includes('admin account has not been set up')
  ) {
    return {
      category: 'admin-not-setup',
      message: 'Admin account has not been set up yet. Please initialize the default admin account to continue.',
      canCreateDefaultAdmin: true,
    };
  }

  // Invalid credentials
  if (
    lowerMessage.includes('invalid credentials') ||
    lowerMessage.includes('wrong password') ||
    lowerMessage.includes('incorrect password') ||
    lowerMessage.includes('authentication failed')
  ) {
    return {
      category: 'invalid-credentials',
      message: 'Invalid email or password. Please check your credentials and try again.',
      canCreateDefaultAdmin: false,
    };
  }

  // Backend unavailable
  if (
    lowerMessage.includes('backend connection') ||
    lowerMessage.includes('not available') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('timeout')
  ) {
    return {
      category: 'backend-unavailable',
      message: 'Unable to connect to the backend. Please check your connection and try again.',
      canCreateDefaultAdmin: false,
    };
  }

  // No admin role - check AFTER admin-not-setup to avoid false positives
  if (
    lowerMessage.includes('no admin role') ||
    lowerMessage.includes('not have admin access')
  ) {
    return {
      category: 'no-admin-role',
      message: 'Your account does not have admin access. Please contact support.',
      canCreateDefaultAdmin: false,
    };
  }

  // Unauthorized - generic, check last
  if (
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('access denied') ||
    lowerMessage.includes('permission')
  ) {
    return {
      category: 'no-admin-role',
      message: 'Access denied. Please check your permissions.',
      canCreateDefaultAdmin: false,
    };
  }

  // Unknown error
  return {
    category: 'unknown',
    message: errorMessage || 'An unexpected error occurred. Please try again.',
    canCreateDefaultAdmin: false,
  };
}
