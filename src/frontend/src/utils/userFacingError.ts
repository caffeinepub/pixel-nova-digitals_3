/**
 * Normalizes unknown errors into safe, English-only, emoji-free user-facing messages.
 * Maps common connectivity/unavailable/unauthorized cases and falls back to a generic English message.
 * Does NOT include token invalidation heuristics - that is handled by adminTokenError.ts.
 */

export function normalizeError(error: any): string {
  if (!error) {
    return 'An unexpected error occurred';
  }

  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || String(error);

  const lowerMessage = errorMessage.toLowerCase();

  // Admin setup errors - must be checked BEFORE unauthorized mapping
  if (
    lowerMessage.includes('admin not setup') ||
    lowerMessage.includes('admin not set up') ||
    lowerMessage.includes('no admin exists')
  ) {
    return 'Admin account has not been set up yet. Please initialize the default admin account to continue.';
  }

  // Contact info validation errors - pass through as-is
  if (
    lowerMessage.includes('email') ||
    lowerMessage.includes('phone') ||
    lowerMessage.includes('address') ||
    lowerMessage.includes('url') ||
    lowerMessage.includes('required') ||
    lowerMessage.includes('invalid') ||
    lowerMessage.includes('must be')
  ) {
    return errorMessage;
  }

  // Unauthorized / permission errors
  if (
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('permission') ||
    lowerMessage.includes('access denied') ||
    lowerMessage.includes('forbidden')
  ) {
    return 'Access denied. Please check your permissions.';
  }

  // Backend unavailable
  if (
    lowerMessage.includes('backend connection') ||
    lowerMessage.includes('not available') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('timeout')
  ) {
    return 'Unable to connect to the backend. Please check your connection and try again.';
  }

  // Authentication errors
  if (
    lowerMessage.includes('invalid credentials') ||
    lowerMessage.includes('authentication failed') ||
    lowerMessage.includes('login failed')
  ) {
    return 'Invalid credentials. Please check your email and password.';
  }

  // Not found errors
  if (lowerMessage.includes('not found')) {
    return 'The requested resource was not found.';
  }

  // Validation errors
  if (lowerMessage.includes('validation')) {
    return errorMessage; // Pass through validation messages as-is
  }

  // Default fallback
  return errorMessage || 'An unexpected error occurred';
}
