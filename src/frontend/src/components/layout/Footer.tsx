import { SiFacebook, SiX, SiInstagram, SiLinkedin } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'pixel-nova-digitals';

  return (
    <footer className="bg-card/50 border-t border-border/40 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">PIXEL NOVA DIGITALS</h3>
            <p className="text-muted-foreground text-sm">
              Professional freelancing services for businesses & content creators. Founded by Abhishek Yadav.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-muted-foreground text-sm">India</p>
            <p className="text-muted-foreground text-sm">Founder: Abhishek Yadav</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-chart-1 transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-chart-1 transition-colors"
                aria-label="Twitter"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-chart-1 transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-chart-1 transition-colors"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear} PIXEL NOVA DIGITALS. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-chart-1 hover:underline"
              >
                caffeine.ai
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
