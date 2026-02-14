import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { normalizeError } from '@/utils/userFacingError';
import type { ExtendedBackendInterface } from '@/types/extended-backend';

export interface AdminBootstrapCapabilities {
  hasAdminExistsCheck: boolean;
  hasCreateDefaultAdmin: boolean;
}

export interface DefaultAdminCredentials {
  email: string;
  password: string;
}

// Seeded default credentials matching backend
const SEEDED_CREDENTIALS: DefaultAdminCredentials = {
  email: 'vishal957041@gmail.com',
  password: 'Abhishek@2006'
};

export type AdminExistenceStatus = 
  | 'checking'
  | 'exists'
  | 'not-exists'
  | 'unknown'
  | 'check-unavailable';

export function useAdminBootstrapStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const [status, setStatus] = useState<AdminExistenceStatus>('checking');
  const [capabilities, setCapabilities] = useState<AdminBootstrapCapabilities>({
    hasAdminExistsCheck: false,
    hasCreateDefaultAdmin: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<DefaultAdminCredentials | null>(null);

  useEffect(() => {
    if (actor && !actorFetching) {
      checkCapabilitiesAndAdminStatus();
    }
  }, [actor, actorFetching]);

  const checkCapabilitiesAndAdminStatus = async () => {
    setStatus('checking');
    setError(null);

    try {
      if (!actor) {
        setStatus('unknown');
        setError('Backend connection not available');
        return;
      }

      const extendedActor = actor as unknown as ExtendedBackendInterface;

      // Check capabilities
      const hasAdminExists = typeof extendedActor.adminExists === 'function';
      const hasCreateDefault = typeof extendedActor.createDefaultAdmin === 'function';

      setCapabilities({
        hasAdminExistsCheck: hasAdminExists,
        hasCreateDefaultAdmin: hasCreateDefault,
      });

      // If adminExists is not available, we cannot determine status
      if (!hasAdminExists || !extendedActor.adminExists) {
        setStatus('check-unavailable');
        setError('Admin status check is not available. Please ensure the backend is up to date.');
        return;
      }

      // Check if admin exists - TypeScript now knows adminExists is defined
      const exists = await extendedActor.adminExists();
      setStatus(exists ? 'exists' : 'not-exists');
    } catch (err: any) {
      console.error('Error checking admin status:', err);
      setError(normalizeError(err));
      setStatus('unknown');
    }
  };

  const createDefaultAdmin = async (): Promise<boolean> => {
    if (!capabilities.hasCreateDefaultAdmin) {
      throw new Error('Admin creation is not available. The backend may need to be updated.');
    }

    setIsCreating(true);
    setError(null);

    try {
      if (!actor) {
        throw new Error('Backend connection not available');
      }

      const extendedActor = actor as unknown as ExtendedBackendInterface;
      
      // Type guard to ensure createDefaultAdmin exists
      if (!extendedActor.createDefaultAdmin) {
        throw new Error('Admin creation method is not available');
      }

      const success = await extendedActor.createDefaultAdmin();

      if (success) {
        // Admin created successfully - show the seeded credentials
        setCreatedCredentials(SEEDED_CREDENTIALS);
        setStatus('exists');
        return true;
      } else {
        // Admin already exists - this is not an error, just return false
        // Don't set error state, allow normal login flow
        setStatus('exists');
        return false;
      }
    } catch (err: any) {
      console.error('Error creating default admin:', err);
      const errorMessage = normalizeError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const acknowledgeCredentials = () => {
    setCreatedCredentials(null);
  };

  const getSeededCredentials = (): DefaultAdminCredentials => {
    return SEEDED_CREDENTIALS;
  };

  return {
    status,
    capabilities,
    error,
    isLoading: actorFetching || status === 'checking',
    isCreating,
    createdCredentials,
    createDefaultAdmin,
    acknowledgeCredentials,
    getSeededCredentials,
    recheckStatus: checkCapabilitiesAndAdminStatus,
  };
}
