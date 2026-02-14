import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useGetContactInfo, useUpdateContactInfo } from '@/hooks/useQueries';
import type { ExtendedContactInfo } from '@/types/extended-backend';
import { toast } from 'sonner';

export default function ContactAdminEditor() {
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const updateMutation = useUpdateContactInfo();

  const [formData, setFormData] = useState<ExtendedContactInfo>({
    email: '',
    phone: '',
    address: '',
    contactTitle: '',
    contactSubtitle: '',
    shortDescription: '',
    footerContactText: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    whatsappUrl: '',
    mapAddressString: '',
    googleMapsEmbedUrl: '',
    phoneNumber: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    // Optional URL validation
    const urlFields: (keyof ExtendedContactInfo)[] = ['facebookUrl', 'instagramUrl', 'linkedinUrl', 'whatsappUrl', 'googleMapsEmbedUrl'];
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
      toast.success('Contact settings updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update contact settings');
    }
  };

  const handleChange = (field: keyof ExtendedContactInfo, value: string) => {
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
          <CardTitle>Contact Section Content</CardTitle>
          <CardDescription>
            Update the title, subtitle, and description shown in the Contact section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactTitle">Section Title</Label>
            <Input
              id="contactTitle"
              value={formData.contactTitle}
              onChange={(e) => handleChange('contactTitle', e.target.value)}
              placeholder="Contact Us"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactSubtitle">Section Subtitle</Label>
            <Input
              id="contactSubtitle"
              value={formData.contactSubtitle}
              onChange={(e) => handleChange('contactSubtitle', e.target.value)}
              placeholder="Get in touch to discuss your project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              placeholder="Brief description about your business (optional)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Email and address are required. Phone number is optional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@example.com"
              className={validationErrors.email ? 'border-destructive' : ''}
            />
            {validationErrors.email && (
              <p className="text-sm text-destructive">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="+1 234 567 890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="City, Country"
              className={validationErrors.address ? 'border-destructive' : ''}
            />
            {validationErrors.address && (
              <p className="text-sm text-destructive">{validationErrors.address}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Map Settings</CardTitle>
          <CardDescription>
            Optional Google Maps integration for your location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapAddressString">Map Location Text</Label>
            <Input
              id="mapAddressString"
              value={formData.mapAddressString}
              onChange={(e) => handleChange('mapAddressString', e.target.value)}
              placeholder="Full address for map display"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapsEmbedUrl">Google Maps Embed URL</Label>
            <Input
              id="googleMapsEmbedUrl"
              value={formData.googleMapsEmbedUrl}
              onChange={(e) => handleChange('googleMapsEmbedUrl', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className={validationErrors.googleMapsEmbedUrl ? 'border-destructive' : ''}
            />
            {validationErrors.googleMapsEmbedUrl && (
              <p className="text-sm text-destructive">{validationErrors.googleMapsEmbedUrl}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Get embed URL from Google Maps → Share → Embed a map
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer Content</CardTitle>
          <CardDescription>
            Text displayed in the footer section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footerContactText">Footer Description</Label>
            <Textarea
              id="footerContactText"
              value={formData.footerContactText}
              onChange={(e) => handleChange('footerContactText', e.target.value)}
              placeholder="Professional freelancing services for businesses & content creators."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Add your social media profile URLs (all optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebookUrl">Facebook URL</Label>
            <Input
              id="facebookUrl"
              value={formData.facebookUrl}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
              placeholder="https://facebook.com/yourpage"
              className={validationErrors.facebookUrl ? 'border-destructive' : ''}
            />
            {validationErrors.facebookUrl && (
              <p className="text-sm text-destructive">{validationErrors.facebookUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagramUrl">Instagram URL</Label>
            <Input
              id="instagramUrl"
              value={formData.instagramUrl}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              placeholder="https://instagram.com/yourprofile"
              className={validationErrors.instagramUrl ? 'border-destructive' : ''}
            />
            {validationErrors.instagramUrl && (
              <p className="text-sm text-destructive">{validationErrors.instagramUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className={validationErrors.linkedinUrl ? 'border-destructive' : ''}
            />
            {validationErrors.linkedinUrl && (
              <p className="text-sm text-destructive">{validationErrors.linkedinUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappUrl">WhatsApp URL</Label>
            <Input
              id="whatsappUrl"
              value={formData.whatsappUrl}
              onChange={(e) => handleChange('whatsappUrl', e.target.value)}
              placeholder="https://wa.me/1234567890"
              className={validationErrors.whatsappUrl ? 'border-destructive' : ''}
            />
            {validationErrors.whatsappUrl && (
              <p className="text-sm text-destructive">{validationErrors.whatsappUrl}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="min-w-32"
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
