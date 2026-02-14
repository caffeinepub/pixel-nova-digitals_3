import { useState, useEffect } from 'react';
import { adminSession, AdminSession } from '@/utils/adminSession';

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(adminSession.get());

  useEffect(() => {
    const unsubscribe = adminSession.subscribe(() => {
      setSession(adminSession.get());
    });

    return unsubscribe;
  }, []);

  return {
    session,
    isAuthenticated: session !== null,
    username: session?.username || null,
    token: session?.token || null
  };
}
