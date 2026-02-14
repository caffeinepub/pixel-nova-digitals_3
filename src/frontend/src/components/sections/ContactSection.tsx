import { forwardRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, User } from 'lucide-react';

const ContactSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h2>
          <p className="text-xl text-muted-foreground">
            Get in touch to discuss your project
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Founder</h3>
                  <p className="text-muted-foreground">Abhishek Yadav</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Location</h3>
                  <p className="text-muted-foreground">India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-muted-foreground">contact@pixelnovadigitals.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
