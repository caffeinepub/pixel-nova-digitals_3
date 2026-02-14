/**
 * Deterministic detection of invalid/expired admin token errors.
 * Only returns true for explicit token authentication failures from the backend.
 */
export function isInvalidTokenError(error: unknown): boolean {
  if (!error) return false;

  let message = '';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (typeof error === 'object' && 'message' in error) {
    message = String((error as any).message);
  }

  // Exact match for the backend's token error message
  // Backend returns: "Invalid or expired admin session token"
  const exactMatch = message.includes('Invalid or expired admin session token');
  
  // Also check for role-related errors that indicate token/permission issues
  const roleMatch = message.includes('no admin role');
  
  // Check for the normalized version that might come through error handling
  const normalizedMatch = message === 'Session expired. Please log in again.';
  
  return exactMatch || roleMatch || normalizedMatch;
}
