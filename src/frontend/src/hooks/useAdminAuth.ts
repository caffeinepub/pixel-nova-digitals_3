import { useState } from 'react';
import { useActor } from './useActor';
import { adminSession } from '@/utils/adminSession';
import { normalizeError } from '@/utils/userFacingError';

export function useAdminAuth() {
  const { actor } = useActor();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!actor) {
        const errorMsg = 'Backend connection not available';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const result = await actor.adminLogin(email, password);
      
      // Handle Result type response
      if (result.__kind__ === 'err') {
        const errorMsg = result.err;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const token = result.ok;
      
      // Store session with token and email as username
      adminSession.set({
        token,
        username: email.split('@')[0], // Use email prefix as display name
        expiresAt: undefined // Backend manages expiry
      });
      
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMsg = normalizeError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const session = adminSession.get();
      if (session && actor) {
        try {
          const result = await actor.adminLogout(session.token);
          if (result.__kind__ === 'err') {
            console.error('Backend logout error:', result.err);
          }
        } catch (err) {
          console.error('Backend logout error:', err);
          // Continue with local logout even if backend call fails
        }
      }
      adminSession.clear();
    } catch (err: any) {
      console.error('Logout error:', err);
      // Always clear session locally even if backend call fails
      adminSession.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = (): boolean => {
    return adminSession.get() !== null;
  };

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
    error
  };
}
