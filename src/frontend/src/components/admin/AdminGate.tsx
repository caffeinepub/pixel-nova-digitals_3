import { ReactNode } from 'react';
import { useAdminBootstrap } from '@/hooks/useAdminBootstrap';
import { useAdminSession } from '@/hooks/useAdminSession';
import AdminBootstrap from './AdminBootstrap';
import AdminLogin from './AdminLogin';
import { Loader2 } from 'lucide-react';

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const { isLoading: bootstrapLoading, adminExists } = useAdminBootstrap();
  const { isAuthenticated } = useAdminSession();

  // Show loading state while checking admin existence
  if (bootstrapLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-chart-1 mx-auto" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show bootstrap screen if no admin exists
  if (adminExists === false) {
    return <AdminBootstrap />;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Show admin dashboard if authenticated
  // AdminGate does not react to query errors - only to session state
  return <>{children}</>;
}
