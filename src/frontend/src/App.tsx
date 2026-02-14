import { useState } from 'react';
import HomePage from './pages/HomePage';
import AdminPage from './pages/admin/AdminPage';
import { Toaster } from '@/components/ui/sonner';

type View = 'home' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderPrefill, setOrderPrefill] = useState<{
    service?: string;
  }>({});

  const openOrderDialog = (prefill?: { service?: string }) => {
    if (prefill) {
      setOrderPrefill(prefill);
    }
    setOrderDialogOpen(true);
  };

  const closeOrderDialog = () => {
    setOrderDialogOpen(false);
    setOrderPrefill({});
  };

  return (
    <>
      {currentView === 'home' ? (
        <HomePage
          onNavigateToAdmin={() => setCurrentView('admin')}
          orderDialogOpen={orderDialogOpen}
          onOpenOrderDialog={openOrderDialog}
          onCloseOrderDialog={closeOrderDialog}
          orderPrefill={orderPrefill}
        />
      ) : (
        <AdminPage
          onNavigateToHome={() => setCurrentView('home')}
        />
      )}
      <Toaster />
    </>
  );
}
