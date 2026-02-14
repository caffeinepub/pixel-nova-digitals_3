import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { normalizeError } from '@/utils/userFacingError';

interface DefaultAdminCredentials {
  username: string;
  password: string;
}

export function useAdminBootstrap() {
  const { actor, isFetching: actorFetching } = useActor();
  const [isLoading, setIsLoading] = useState(true);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [defaultCredentials, setDefaultCredentials] = useState<DefaultAdminCredentials | null>(null);
  const [credentialsShown, setCredentialsShown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (actor && !actorFetching) {
      checkAdminExists();
    }
  }, [actor, actorFetching]);

  const checkAdminExists = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!actor) {
        throw new Error('Backend connection not available');
      }

      // Check if backend has adminExists method
      if (typeof (actor as any).adminExists !== 'function') {
        // If method doesn't exist, assume admin system is not yet implemented
        // Default to showing that admin exists to prevent bootstrap loop
        setAdminExists(true);
        return;
      }

      const exists = await (actor as any).adminExists();
      setAdminExists(exists);
    } catch (err: any) {
      console.error('Error checking admin existence:', err);
      setError(normalizeError(err));
      // On error, assume admin exists to prevent bootstrap loop
      setAdminExists(true);
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultAdmin = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!actor) {
        throw new Error('Backend connection not available');
      }

      // Check if backend has createDefaultAdmin method
      if (typeof (actor as any).createDefaultAdmin !== 'function') {
        throw new Error('Admin creation is not yet implemented in the backend');
      }

      const credentials = await (actor as any).createDefaultAdmin();
      
      setDefaultCredentials({
        username: credentials.username,
        password: credentials.password
      });
      setCredentialsShown(true);
      setAdminExists(true);
      return true;
    } catch (err: any) {
      console.error('Error creating default admin:', err);
      setError(normalizeError(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const acknowledgeCredentials = () => {
    setCredentialsShown(false);
    setDefaultCredentials(null);
  };

  return {
    isLoading: actorFetching || isLoading,
    adminExists,
    defaultCredentials,
    credentialsShown,
    error,
    checkAdminExists,
    createDefaultAdmin,
    acknowledgeCredentials
  };
}
