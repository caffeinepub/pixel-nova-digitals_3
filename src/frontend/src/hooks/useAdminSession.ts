import { useState, useEffect, useRef } from 'react';
import { adminSession, AdminSession } from '@/utils/adminSession';
import { traceAuthTransition } from '@/utils/adminAuthDiagnostics';

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(adminSession.get());
  const prevAuthState = useRef<boolean>(session !== null);

  useEffect(() => {
    const unsubscribe = adminSession.subscribe(() => {
      setSession(adminSession.get());
    });

    return unsubscribe;
  }, []);

  // Trace auth state transitions (not every render)
  useEffect(() => {
    const isAuthenticated = session !== null;
    
    if (prevAuthState.current !== isAuthenticated) {
      if (isAuthenticated) {
        traceAuthTransition('Session set', session?.username);
      } else {
        traceAuthTransition('Session cleared');
      }
      prevAuthState.current = isAuthenticated;
    }
  }, [session]);

  return {
    session,
    isAuthenticated: session !== null,
    username: session?.username || null,
    token: session?.token || null
  };
}
