import { useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ContactSection from '@/components/sections/ContactSection';
import OrderDialog from '@/components/order/OrderDialog';

interface HomePageProps {
  onNavigateToAdmin: () => void;
  orderDialogOpen: boolean;
  onOpenOrderDialog: (prefill?: { service?: string }) => void;
  onCloseOrderDialog: () => void;
  orderPrefill: { service?: string };
}

export default function HomePage({
  onNavigateToAdmin,
  orderDialogOpen,
  onOpenOrderDialog,
  onCloseOrderDialog,
  orderPrefill,
}: HomePageProps) {
  const servicesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      const headerOffset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToAdmin={onNavigateToAdmin}
        onScrollToServices={() => scrollToSection(servicesRef)}
        onScrollToContact={() => scrollToSection(contactRef)}
      />
      <main>
        <HeroSection
          onScrollToServices={() => scrollToSection(servicesRef)}
          onScrollToContact={() => scrollToSection(contactRef)}
          onOpenOrderDialog={() => onOpenOrderDialog()}
        />
        <AboutSection />
        <ServicesSection ref={servicesRef} onOpenOrderDialog={onOpenOrderDialog} />
        <WhyChooseUsSection />
        <PortfolioSection />
        <ContactSection ref={contactRef} />
      </main>
      <Footer />
      <OrderDialog
        open={orderDialogOpen}
        onOpenChange={onCloseOrderDialog}
        prefill={orderPrefill}
      />
    </div>
  );
}
