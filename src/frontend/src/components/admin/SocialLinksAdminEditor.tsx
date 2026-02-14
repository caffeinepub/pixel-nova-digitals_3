import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useGetAppContent, useUpdateAppContent } from '@/hooks/useQueries';
import { toast } from 'sonner';
import type { AppContent } from '@/backend';

export default function SocialLinksAdminEditor() {
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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (appContent) {
      setFormData(appContent);
    }
  }, [appContent]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Optional URL validation
    const urlFields: (keyof AppContent)[] = ['whatsapp', 'telegram', 'tiktok', 'facebook'];
    urlFields.forEach(field => {
      const value = formData[field] as string;
      if (value && value.trim() !== '') {
        try {
          const url = new URL(value);
          if (!url.protocol.startsWith('http')) {
            errors[field] = 'URL must start with http:// or https://';
          }
        } catch {
          errors[field] = 'Please enter a valid URL';
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Social links updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update social links');
    }
  };

  const handleChange = (field: keyof AppContent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Add your social media profile URLs. Leave blank to hide a link. All URLs must start with http:// or https://
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={formData.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
              placeholder="https://facebook.com/yourpage"
              className={validationErrors.facebook ? 'border-destructive' : ''}
            />
            {validationErrors.facebook && (
              <p className="text-sm text-destructive">{validationErrors.facebook}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp URL</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="https://wa.me/1234567890"
              className={validationErrors.whatsapp ? 'border-destructive' : ''}
            />
            {validationErrors.whatsapp && (
              <p className="text-sm text-destructive">{validationErrors.whatsapp}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram URL</Label>
            <Input
              id="telegram"
              value={formData.telegram}
              onChange={(e) => handleChange('telegram', e.target.value)}
              placeholder="https://t.me/yourusername"
              className={validationErrors.telegram ? 'border-destructive' : ''}
            />
            {validationErrors.telegram && (
              <p className="text-sm text-destructive">{validationErrors.telegram}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok URL</Label>
            <Input
              id="tiktok"
              value={formData.tiktok}
              onChange={(e) => handleChange('tiktok', e.target.value)}
              placeholder="https://tiktok.com/@yourusername"
              className={validationErrors.tiktok ? 'border-destructive' : ''}
            />
            {validationErrors.tiktok && (
              <p className="text-sm text-destructive">{validationErrors.tiktok}</p>
            )}
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
