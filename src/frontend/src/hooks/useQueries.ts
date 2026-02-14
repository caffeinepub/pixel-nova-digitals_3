import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { NewOrder, UserRole } from '@/backend';
import { adminSession } from '@/utils/adminSession';
import { normalizeError } from '@/utils/userFacingError';
import { isInvalidTokenError } from '@/utils/adminTokenError';

export function useCreateOrder() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      service,
      fullName,
      email,
      whatsapp,
      description,
      fileUpload,
      budget,
      deliveryTime,
    }: {
      service: string;
      fullName: string;
      email: string;
      whatsapp: string;
      description: string;
      fileUpload: Uint8Array;
      budget: string;
      deliveryTime: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.createOrder(
          service,
          fullName,
          email,
          whatsapp,
          description,
          fileUpload,
          budget,
          deliveryTime
        );
      } catch (err: any) {
        throw new Error(normalizeError(err));
      }
    },
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<NewOrder[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      
      const token = adminSession.getToken();
      if (!token) {
        throw new Error('Session expired. Please log in again.');
      }
      
      try {
        const result = await actor.getAllOrdersWithToken(token);
        
        if (result.__kind__ === 'err') {
          // Only clear session if it's an explicit token error
          if (isInvalidTokenError(result.err)) {
            adminSession.clear();
          }
          throw new Error(result.err);
        }
        
        return result.ok;
      } catch (err: any) {
        // Only clear session on explicit token errors, not generic errors
        if (isInvalidTokenError(err)) {
          adminSession.clear();
        }
        throw new Error(normalizeError(err));
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useDownloadFile() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      const token = adminSession.getToken();
      if (!token) {
        throw new Error('Session expired. Please log in again.');
      }
      
      try {
        const result = await actor.downloadFileWithToken(token, orderId);
        
        if (result.__kind__ === 'err') {
          // Only clear session if it's an explicit token error
          if (isInvalidTokenError(result.err)) {
            adminSession.clear();
          }
          throw new Error(result.err);
        }
        
        return result.ok;
      } catch (err: any) {
        // Only clear session on explicit token errors
        if (isInvalidTokenError(err)) {
          adminSession.clear();
        }
        throw new Error(normalizeError(err));
      }
    },
  });
}

export function useDeleteOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      const token = adminSession.getToken();
      if (!token) {
        throw new Error('Session expired. Please log in again.');
      }
      
      try {
        const result = await actor.deleteOrderWithToken(token, orderId);
        
        if (result.__kind__ === 'err') {
          // Only clear session if it's an explicit token error
          if (isInvalidTokenError(result.err)) {
            adminSession.clear();
          }
          throw new Error(result.err);
        }
        
        return result.ok;
      } catch (err: any) {
        // Only clear session on explicit token errors
        if (isInvalidTokenError(err)) {
          adminSession.clear();
        }
        throw new Error(normalizeError(err));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) return 'guest' as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrderDetail() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      const token = adminSession.getToken();
      if (!token) {
        throw new Error('Session expired. Please log in again.');
      }
      
      try {
        const result = await actor.getOrderDetailWithToken(token, orderId);
        
        if (result.__kind__ === 'err') {
          // Only clear session if it's an explicit token error
          if (isInvalidTokenError(result.err)) {
            adminSession.clear();
          }
          throw new Error(result.err);
        }
        
        return result.ok;
      } catch (err: any) {
        // Only clear session on explicit token errors
        if (isInvalidTokenError(err)) {
          adminSession.clear();
        }
        throw new Error(normalizeError(err));
      }
    },
  });
}
