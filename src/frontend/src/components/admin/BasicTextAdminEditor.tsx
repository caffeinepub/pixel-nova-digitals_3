import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useGetAppContent, useUpdateAppContent } from '@/hooks/useQueries';
import { toast } from 'sonner';
import type { AppContent } from '@/backend';

export default function BasicTextAdminEditor() {
  const { data: appContent, isLoading } = useGetAppContent();
  const updateMutation = useUpdateAppContent();

  const [formData, setFormData] = useState<AppContent>({
    address: '',
    description: '',
    whatsapp: '',
    telegram: '',
    tiktok: '',
    facebook: '',
    mail: '',
    titleTag: '',
    metaDescription: '',
    metaKeywords: '',
  });

  useEffect(() => {
    if (appContent) {
      setFormData(appContent);
    }
  }, [appContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Basic text settings updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update basic text settings');
    }
  };

  const handleChange = (field: keyof AppContent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-chart-1" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO & Meta Information</CardTitle>
          <CardDescription>
            Update page title, meta description, and keywords for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titleTag">Page Title</Label>
            <Input
              id="titleTag"
              value={formData.titleTag}
              onChange={(e) => handleChange('titleTag', e.target.value)}
              placeholder="PIXEL NOVA DIGITALS - Professional Digital Solutions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              placeholder="Professional freelancing services for businesses & content creators"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input
              id="metaKeywords"
              value={formData.metaKeywords}
              onChange={(e) => handleChange('metaKeywords', e.target.value)}
              placeholder="digital design, web development, video editing"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Update basic business details displayed across the site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="India"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of your business"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mail">Contact Email</Label>
            <Input
              id="mail"
              type="email"
              value={formData.mail}
              onChange={(e) => handleChange('mail', e.target.value)}
              placeholder="contact@example.com"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-gradient-to-r from-chart-1 to-chart-4"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
