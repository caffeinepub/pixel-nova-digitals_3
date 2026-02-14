/**
 * Normalizes unknown errors into safe, English-only, emoji-free user-facing messages.
 * Maps common connectivity/unavailable/unauthorized cases and falls back to a generic English message.
 * Does NOT include token invalidation heuristics - that logic is in adminTokenError.ts
 */
export function normalizeError(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  let message = '';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (typeof error === 'object' && 'message' in error) {
    message = String((error as any).message);
  }

  const lowerMessage = message.toLowerCase();

  // Map common error patterns to user-friendly English messages
  if (lowerMessage.includes('not available') || lowerMessage.includes('actor not available')) {
    return 'Backend service is not available. Please try again.';
  }

  if (lowerMessage.includes('connection') || lowerMessage.includes('network')) {
    return 'Unable to connect to server. Please check your connection.';
  }

  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('access denied')) {
    return 'Access denied. Please check your permissions.';
  }

  if (lowerMessage.includes('session expired') || lowerMessage.includes('invalid session') || lowerMessage.includes('expired session')) {
    return 'Session expired. Please log in again.';
  }

  if (lowerMessage.includes('authentication required') || lowerMessage.includes('not authenticated')) {
    return 'Authentication required. Please log in.';
  }

  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return 'Request timed out. Please try again.';
  }

  if (lowerMessage.includes('not found')) {
    return 'Resource not found.';
  }

  // Email-based credential errors
  if (lowerMessage.includes('invalid email') || lowerMessage.includes('invalid password') || lowerMessage.includes('invalid credentials')) {
    return 'Invalid email or password.';
  }

  if (lowerMessage.includes('email and password are required')) {
    return 'Email and password are required.';
  }

  // If we have a message, return it (stripped of emojis)
  if (message) {
    return stripEmojis(message);
  }

  // Fallback
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Removes emoji characters from a string
 */
function stripEmojis(text: string): string {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
}
