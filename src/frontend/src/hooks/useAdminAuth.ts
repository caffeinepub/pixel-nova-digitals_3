import { useActor } from './useActor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSession } from '@/utils/adminSession';
import { normalizeError } from '@/utils/userFacingError';
import { normalizeAdminAuthResult } from '@/utils/adminAuthResult';
import { useAdminSession } from './useAdminSession';
import { traceAuthTransition } from '@/utils/adminAuthDiagnostics';
import { verifyAdminToken } from '@/utils/adminAuthVerification';
import type { ExtendedBackendInterface } from '@/types/extended-backend';

/**
 * Admin authentication hook - DEPRECATED
 * Admin panel is now publicly accessible and does not require authentication.
 * This hook is retained for backward compatibility but is no longer used for access control.
 */
export function useAdminAuth() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { isAuthenticated, username } = useAdminSession();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) {
        throw new Error('Backend connection not available');
      }

      const extendedActor = actor as unknown as ExtendedBackendInterface;
      if (typeof extendedActor.adminLogin !== 'function') {
        throw new Error('Admin login is not available');
      }

      const result = await extendedActor.adminLogin(email, password);
      
      // Normalize the response to handle both Result-style and Motoko-variant-style
      const normalized = normalizeAdminAuthResult(result);
      
      if (normalized.errMessage) {
        throw new Error(normalized.errMessage);
      }

      if (!normalized.okToken) {
        throw new Error('No token received from server');
      }

      return { token: normalized.okToken, email };
    },
    onSuccess: async ({ token, email }) => {
      if (!token || token.trim().length === 0) {
        throw new Error('Invalid token received');
      }

      // Store the session temporarily
      adminSession.set({ token, username: email });
      traceAuthTransition('Login success, verifying token', email);

      // Verify the token works before completing login
      const verification = await verifyAdminToken(actor, token);

      if (!verification.success) {
        // Verification failed - clear the session immediately
        traceAuthTransition('Token verification failed', verification.errorReason);
        adminSession.clearWithReason(
          verification.errorReason || 'Unable to verify your session. Please try again.'
        );
        throw new Error(verification.errorReason || 'Session verification failed');
      }

      traceAuthTransition('Token verification passed', email);
    },
    onError: (err: any) => {
      const errorMessage = normalizeError(err);
      console.error('Login error:', errorMessage);
      // Clear any session that might have been set
      adminSession.clear();
    },
  });

  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err) {
      // Error is already handled by onError callback
      throw err;
    }
  };

  const logout = async () => {
    const currentSession = adminSession.get();
    
    if (currentSession?.token && actor) {
      try {
        const extendedActor = actor as unknown as ExtendedBackendInterface;
        if (typeof extendedActor.adminLogout === 'function') {
          await extendedActor.adminLogout(currentSession.token);
        }
      } catch (err) {
        console.error('Error during logout:', err);
      }
    }

    traceAuthTransition('Explicit logout');
    adminSession.clear();
    queryClient.clear();
  };

  return {
    login,
    logout,
    isAuthenticated,
    isLoading: loginMutation.isPending,
    error: loginMutation.error ? normalizeError(loginMutation.error) : null,
    username,
  };
}
