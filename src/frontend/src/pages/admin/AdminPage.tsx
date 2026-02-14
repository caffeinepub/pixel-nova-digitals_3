import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminSession } from '@/hooks/useAdminSession';
import OrdersAdmin from '@/components/admin/OrdersAdmin';
import AdminGate from '@/components/admin/AdminGate';

interface AdminPageProps {
  onNavigateToHome: () => void;
}

export default function AdminPage({ onNavigateToHome }: AdminPageProps) {
  const { logout } = useAdminAuth();
  const { username } = useAdminSession();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AdminGate>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onNavigateToHome}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Site
              </Button>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              {username && (
                <span className="text-sm text-muted-foreground">
                  Logged in as <span className="font-medium text-foreground">{username}</span>
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <OrdersAdmin />
        </main>
      </div>
    </AdminGate>
  );
}
