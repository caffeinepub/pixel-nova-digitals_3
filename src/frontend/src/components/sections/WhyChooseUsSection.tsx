import { Card, CardContent } from '@/components/ui/card';
import { Zap, DollarSign, Award, MessageCircle, Shield } from 'lucide-react';

const reasons = [
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Quick turnaround times without compromising quality',
  },
  {
    icon: DollarSign,
    title: 'Affordable Pricing',
    description: 'Competitive rates that fit your budget',
  },
  {
    icon: Award,
    title: 'Professional Work',
    description: 'High-quality results from experienced professionals',
  },
  {
    icon: MessageCircle,
    title: 'Clear Communication',
    description: 'Transparent updates throughout your project',
  },
  {
    icon: Shield,
    title: 'Reliable Support',
    description: 'Dedicated assistance whenever you need it',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-xl text-muted-foreground">
            What makes us stand out from the rest
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Card
                key={index}
                className="text-center hover:border-chart-1/50 transition-all duration-300 hover:shadow-lg hover:shadow-chart-1/10"
              >
                <CardContent className="pt-6 space-y-3">
                  <div className="inline-flex p-4 rounded-full bg-chart-1/10 text-chart-1">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{reason.title}</h3>
                  <p className="text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
