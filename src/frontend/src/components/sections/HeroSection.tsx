import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onScrollToServices: () => void;
  onScrollToContact: () => void;
  onOpenOrderDialog: () => void;
}

export default function HeroSection({
  onScrollToServices,
  onScrollToContact,
  onOpenOrderDialog,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/generated/hero-neon-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-1/10 border border-chart-1/20 text-chart-1 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Professional Digital Solutions</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-chart-1 via-chart-4 to-chart-1 bg-clip-text text-transparent animate-gradient">
              Turning Ideas Into
            </span>
            <br />
            <span className="text-foreground">Digital Reality</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Professional Freelancing Services for Businesses & Content Creators
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={onScrollToServices}
              className="bg-gradient-to-r from-chart-1 to-chart-4 hover:opacity-90 transition-opacity"
            >
              View Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={onOpenOrderDialog}>
              Order Now
            </Button>
            <Button size="lg" variant="ghost" onClick={onScrollToContact}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
