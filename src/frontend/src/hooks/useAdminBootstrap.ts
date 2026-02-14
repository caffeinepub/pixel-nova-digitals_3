import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { normalizeError } from '@/utils/userFacingError';

interface DefaultAdminCredentials {
  username: string;
  password: string;
}

const SEEDED_CREDENTIALS = {
  username: 'vishal957041@gmail.com',
  password: 'Abhishek@2006'
};

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

      if (typeof (actor as any).adminExists !== 'function') {
        console.warn('adminExists method not available on backend - assuming admin exists');
        setAdminExists(true);
        return;
      }

      const exists = await (actor as any).adminExists();
      setAdminExists(exists);
    } catch (err: any) {
      console.error('Error checking admin existence:', err);
      setError(normalizeError(err));
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

      if (typeof (actor as any).createDefaultAdmin !== 'function') {
        const errorMsg = 'Admin creation is not available. The backend may need to be updated.';
        setError(errorMsg);
        return false;
      }

      const success = await (actor as any).createDefaultAdmin();
      
      if (success) {
        // Always display the seeded credentials
        setDefaultCredentials(SEEDED_CREDENTIALS);
        setCredentialsShown(true);
        setAdminExists(true);
        return true;
      } else {
        setError('Admin already exists or creation failed');
        return false;
      }
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
