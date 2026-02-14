import { forwardRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { serviceCatalog } from '@/components/services/serviceCatalog';

interface ServicesSectionProps {
  onOpenOrderDialog: (prefill: { service: string }) => void;
}

const ServicesSection = forwardRef<HTMLElement, ServicesSectionProps>(
  ({ onOpenOrderDialog }, ref) => {
    return (
      <section ref={ref} id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground">
              Professional digital solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {serviceCatalog.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.id}
                  className="group hover:border-chart-1/50 transition-all duration-300 hover:shadow-lg hover:shadow-chart-1/10"
                >
                  <CardHeader>
                    <div className="mb-4 inline-flex p-3 rounded-lg bg-chart-1/10 text-chart-1 group-hover:bg-chart-1/20 transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => onOpenOrderDialog({ service: service.title })}
                      variant="outline"
                      className="w-full group-hover:border-chart-1/50 group-hover:text-chart-1"
                    >
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-muted-foreground italic">
            More advanced services coming soon.
          </p>
        </div>
      </section>
    );
  }
);

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;
