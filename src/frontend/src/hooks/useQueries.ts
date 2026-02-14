import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserRole, AppContent } from '@/backend';
import { normalizeError } from '@/utils/userFacingError';
import type { NewOrder, ExtendedContactInfo, ExtendedBackendInterface } from '@/types/extended-backend';

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
        const extendedActor = actor as unknown as ExtendedBackendInterface;
        return await extendedActor.createOrder(
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
      
      try {
        const extendedActor = actor as unknown as ExtendedBackendInterface;
        
        // Defensive check: verify method exists
        if (!extendedActor.getAllOrdersWithToken) {
          throw new Error('Order management is not available. The backend may need to be updated.');
        }
        
        // Call with empty token - backend ignores it now and returns array directly
        const result = await extendedActor.getAllOrdersWithToken('');
        return result;
      } catch (err: any) {
        throw new Error(normalizeError(err));
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useDownloadFile() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const extendedActor = actor as unknown as ExtendedBackendInterface;
        
        // Defensive check: verify method exists
        if (!extendedActor.downloadFileWithToken) {
          throw new Error('File download is not available. The backend may need to be updated.');
        }
        
        // Call with empty token - backend ignores it now and returns FileData directly
        const result = await extendedActor.downloadFileWithToken('', orderId);
        
        // Backend returns FileData with base64 encoded fileData
        if (result && typeof result === 'object' && 'fileData' in result) {
          const base64 = result.fileData;
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        }
        
        return result;
      } catch (err: any) {
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
      
      try {
        const extendedActor = actor as unknown as ExtendedBackendInterface;
        
        // Defensive check: verify method exists
        if (!extendedActor.deleteOrderWithToken) {
          throw new Error('Order deletion is not available. The backend may need to be updated.');
        }
        
        // Call with empty token - backend ignores it now and returns void
        await extendedActor.deleteOrderWithToken('', orderId);
      } catch (err: any) {
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
      
      try {
        const extendedActor = actor as unknown as ExtendedBackendInterface;
        
        // Defensive check: verify method exists
        if (!extendedActor.getOrderDetailWithToken) {
          throw new Error('Order details are not available. The backend may need to be updated.');
        }
        
        // Call with empty token - backend ignores it now and returns Order directly
        const result = await extendedActor.getOrderDetailWithToken('', orderId);
        return result;
      } catch (err: any) {
        throw new Error(normalizeError(err));
      }
    },
  });
}

// Contact Us Settings Hooks
export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ExtendedContactInfo>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        const extendedActor = actor as unknown as ExtendedBackendInterface;
        return await extendedActor.getContactInfo();
      } catch (err: any) {
        throw new Error(normalizeError(err));
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactInfo: ExtendedContactInfo) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const extendedActor = actor as unknown as ExtendedBackendInterface;
        // updateContactInfo returns void, not a Result type
        await extendedActor.updateContactInfo(contactInfo);
      } catch (err: any) {
        throw new Error(normalizeError(err));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}

// App Content Hooks
export function useGetAppContent() {
  const { actor, isFetching } = useActor();

  return useQuery<AppContent>({
    queryKey: ['appContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAppContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appContent: AppContent) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        await actor.updateAppContent(appContent);
      } catch (err: any) {
        throw new Error(normalizeError(err));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appContent'] });
    },
  });
}
