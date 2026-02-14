import { ReactNode } from 'react';

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  // Admin panel is now publicly accessible - no authentication required
  return <>{children}</>;
}
