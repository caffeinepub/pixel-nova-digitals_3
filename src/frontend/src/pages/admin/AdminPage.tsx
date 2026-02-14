import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import OrdersAdmin from '@/components/admin/OrdersAdmin';
import ContactAdminEditor from '@/components/admin/ContactAdminEditor';
import BasicTextAdminEditor from '@/components/admin/BasicTextAdminEditor';
import SocialLinksAdminEditor from '@/components/admin/SocialLinksAdminEditor';
import AdminGate from '@/components/admin/AdminGate';

interface AdminPageProps {
  onNavigateToHome: () => void;
}

export default function AdminPage({ onNavigateToHome }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState('orders');

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
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 flex-wrap h-auto">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="basic-text">Basic Text</TabsTrigger>
              <TabsTrigger value="social-links">Social Links</TabsTrigger>
              <TabsTrigger value="contact">Contact Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <OrdersAdmin />
            </TabsContent>
            <TabsContent value="basic-text">
              <BasicTextAdminEditor />
            </TabsContent>
            <TabsContent value="social-links">
              <SocialLinksAdminEditor />
            </TabsContent>
            <TabsContent value="contact">
              <ContactAdminEditor />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGate>
  );
}
