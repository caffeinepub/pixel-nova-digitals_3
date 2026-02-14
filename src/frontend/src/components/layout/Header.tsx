import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigateToAdmin: () => void;
  onScrollToServices: () => void;
  onScrollToContact: () => void;
}

export default function Header({
  onNavigateToAdmin,
  onScrollToServices,
  onScrollToContact,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Services', onClick: onScrollToServices },
    { label: 'Contact', onClick: onScrollToContact },
  ];

  const handleNavClick = (onClick: () => void) => {
    onClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/pixel-nova-logo.dim_512x512.png"
              alt="PIXEL NOVA DIGITALS"
              className="h-12 w-12 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">
              PIXEL NOVA DIGITALS
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToAdmin}
              className="text-muted-foreground"
            >
              Admin
            </Button>
          </nav>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.onClick)}
                  className="text-left text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                >
                  {item.label}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onNavigateToAdmin();
                  setMobileMenuOpen(false);
                }}
                className="justify-start text-muted-foreground"
              >
                Admin
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
