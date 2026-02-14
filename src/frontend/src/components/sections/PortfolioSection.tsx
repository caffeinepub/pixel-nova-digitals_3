import { Card, CardContent } from '@/components/ui/card';
import { Image, Globe, Youtube, Video } from 'lucide-react';

const portfolioItems = [
  {
    title: 'Social Media Design',
    icon: Image,
    description: 'Eye-catching graphics for social platforms',
  },
  {
    title: 'Business Website',
    icon: Globe,
    description: 'Professional web presence for your brand',
  },
  {
    title: 'YouTube Thumbnail',
    icon: Youtube,
    description: 'Click-worthy thumbnails that drive views',
  },
  {
    title: 'Promotional Video',
    icon: Video,
    description: 'Engaging video content for marketing',
  },
];

export default function PortfolioSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h2>
          <p className="text-xl text-muted-foreground">
            Examples of our creative work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {portfolioItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="group hover:border-chart-1/50 transition-all duration-300 hover:shadow-lg hover:shadow-chart-1/10"
              >
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="inline-flex p-4 rounded-lg bg-chart-1/10 text-chart-1 group-hover:bg-chart-1/20 transition-colors">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
