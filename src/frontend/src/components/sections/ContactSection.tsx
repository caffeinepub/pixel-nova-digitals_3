import { forwardRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useGetContactInfo } from '@/hooks/useQueries';

const ContactSection = forwardRef<HTMLElement>((props, ref) => {
  const { data: contactInfo, isLoading } = useGetContactInfo();

  // Default values matching current hard-coded content
  const title = contactInfo?.contactTitle || 'Contact Us';
  const subtitle = contactInfo?.contactSubtitle || 'Get in touch to discuss your project';
  const email = contactInfo?.email || 'contact@pixelnovadigitals.com';
  const phone = contactInfo?.phoneNumber || contactInfo?.phone || '';
  const address = contactInfo?.mapAddressString || contactInfo?.address || 'India';
  const shortDescription = contactInfo?.shortDescription || '';
  const googleMapsUrl = contactInfo?.googleMapsEmbedUrl || '';

  if (isLoading) {
    return (
      <section ref={ref} id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-12 w-64 bg-muted animate-pulse rounded mx-auto mb-4" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {shortDescription && (
                <div className="pb-4 border-b border-border/40">
                  <p className="text-muted-foreground">{shortDescription}</p>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Location</h3>
                    <p className="text-muted-foreground">{address}</p>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-muted-foreground break-all">{email}</p>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <p className="text-muted-foreground">{phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {googleMapsUrl && (
            <Card className="overflow-hidden">
              <CardContent className="p-0 h-full">
                <iframe
                  src={googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
