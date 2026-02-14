import { SiFacebook, SiInstagram, SiLinkedin, SiWhatsapp, SiTelegram, SiTiktok } from 'react-icons/si';
import { Heart } from 'lucide-react';
import { useGetContactInfo, useGetAppContent } from '@/hooks/useQueries';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'pixel-nova-digitals';
  const { data: contactInfo } = useGetContactInfo();
  const { data: appContent } = useGetAppContent();

  // Default values
  const footerText = contactInfo?.footerContactText || 'Professional freelancing services for businesses & content creators. Founded by Abhishek Yadav.';
  const location = contactInfo?.mapAddressString || contactInfo?.address || appContent?.address || 'India';
  
  // Social links from both sources (appContent takes precedence for new fields)
  const facebookUrl = appContent?.facebook || contactInfo?.facebookUrl || '';
  const instagramUrl = contactInfo?.instagramUrl || '';
  const linkedinUrl = contactInfo?.linkedinUrl || '';
  const whatsappUrl = appContent?.whatsapp || contactInfo?.whatsappUrl || '';
  const telegramUrl = appContent?.telegram || '';
  const tiktokUrl = appContent?.tiktok || '';

  // Only show social links that have URLs
  const socialLinks = [
    { url: facebookUrl, icon: SiFacebook, label: 'Facebook' },
    { url: instagramUrl, icon: SiInstagram, label: 'Instagram' },
    { url: linkedinUrl, icon: SiLinkedin, label: 'LinkedIn' },
    { url: whatsappUrl, icon: SiWhatsapp, label: 'WhatsApp' },
    { url: telegramUrl, icon: SiTelegram, label: 'Telegram' },
    { url: tiktokUrl, icon: SiTiktok, label: 'TikTok' },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <footer className="bg-card/50 border-t border-border/40 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">PIXEL NOVA DIGITALS</h3>
            <p className="text-muted-foreground text-sm">
              {footerText}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-muted-foreground text-sm">{location}</p>
          </div>
          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4 flex-wrap">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-chart-1 transition-colors"
                      aria-label={link.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
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
