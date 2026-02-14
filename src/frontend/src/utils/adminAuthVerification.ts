/**
 * Post-login verification helper.
 * After a successful login, performs a lightweight authenticated call
 * to verify the token is valid and the user has admin permissions.
 */

import type { ExtendedBackendInterface } from '@/types/extended-backend';

export interface VerificationResult {
  success: boolean;
  errorReason?: string;
}

/**
 * Verify admin session by attempting to fetch orders with the token.
 * Returns a clear English error reason if verification fails.
 */
export async function verifyAdminToken(
  actor: any,
  token: string
): Promise<VerificationResult> {
  if (!actor || !token) {
    return {
      success: false,
      errorReason: 'Unable to verify session. Please try again.',
    };
  }

  try {
    const extendedActor = actor as unknown as ExtendedBackendInterface;

    // Check if the method exists
    if (!extendedActor.getAllOrdersWithToken) {
      return {
        success: false,
        errorReason: 'Admin features are not available. Please contact support.',
      };
    }

    // Attempt to call a token-gated endpoint
    const result = await extendedActor.getAllOrdersWithToken(token);

    // Handle Result-style response
    if (result && typeof result === 'object' && '__kind__' in result) {
      if (result.__kind__ === 'err') {
        // Token is invalid or user doesn't have admin role
        return {
          success: false,
          errorReason: 'Your account does not have admin access. Please contact support.',
        };
      }
      // Success
      return { success: true };
    }

    // If we got here without error, consider it successful
    return { success: true };
  } catch (error: any) {
    // Parse the error message
    const errorMessage = error?.message || String(error);

    // Check for explicit token errors
    if (
      errorMessage.includes('Invalid or expired admin session token') ||
      errorMessage.includes('no admin role')
    ) {
      return {
        success: false,
        errorReason: 'Your account does not have admin access. Please contact support.',
      };
    }

    // Generic error
    return {
      success: false,
      errorReason: 'Unable to verify your session. Please try logging in again.',
    };
  }
}
