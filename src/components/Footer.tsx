import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  ArrowRight, 
  CheckCircle2, 
  Gift, 
  Sparkles, 
  Globe, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CustomerUser, LogoCMSContent } from '../types';
import { InfoPageSlug } from './CoutureInfoPages';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onOpenStoreLocator: () => void;
  onOpenShippingInfo: () => void;
  onOpenTrackOrder: () => void;
  onOpenAbout: () => void;
  onNavigatePage?: (slug: InfoPageSlug) => void;
  onOpenCustomerLogin?: () => void;
  onOpenCustomerAccount?: () => void;
  currentUser?: CustomerUser | null;
  logoCMS?: LogoCMSContent;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSizeGuide,
  onOpenStoreLocator,
  onOpenShippingInfo,
  onOpenTrackOrder,
  onOpenAbout,
  onNavigatePage,
  onOpenCustomerLogin,
  onOpenCustomerAccount,
  currentUser,
  logoCMS,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [mobileQuickLinksOpen, setMobileQuickLinksOpen] = useState(true);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);

  const handleNavigate = (slug: InfoPageSlug, fallbackFn?: () => void) => {
    if (onNavigatePage) {
      onNavigatePage(slug);
    } else if (fallbackFn) {
      fallbackFn();
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <footer 
      id="main-footer" 
      className="relative bg-gradient-to-b from-[#1C120E] via-[#241712] to-[#150D0A] text-[#EADDCF] pt-16 sm:pt-20 pb-10 border-t border-[#3A241C] overflow-hidden"
    >
      {/* Subtle couture ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#52131D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3A241C]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Decorative Line & Arch Crest Motif */}
        <div className="flex items-center justify-center gap-4 mb-12 sm:mb-16 opacity-75">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#5A3B2E] to-[#C8A97E]/40" />
          <div className="flex items-center gap-2 px-2 text-[#C8A97E]">
            <span className="text-[9px] tracking-[0.3em] uppercase font-cinzel font-light text-[#C8A97E]/90">
              HAUTE COUTURE ATELIER
            </span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#5A3B2E] to-[#C8A97E]/40" />
        </div>

        {/* Main 4-Column Luxury Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#362118]">
          
          {/* COLUMN 1: Brand & Socials (3.5 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand Logo with seamless transparent integration */}
              <div className="inline-flex items-center mb-4">
                <BrandLogo variant="light" size="md" logoCMS={logoCMS} />
              </div>
              
              {/* Refined Italic Serif Tagline */}
              <p className="font-serif-luxury italic text-sm sm:text-base text-[#D4C3B4] font-light leading-relaxed max-w-xs mt-1">
                “Timeless fashion.<br />Thoughtfully made.”
              </p>
            </div>

            {/* Circular Social Media Icons with subtle gold hover */}
            <div>
              <p className="font-cinzel text-[10px] font-semibold tracking-[0.2em] uppercase text-[#A89384] mb-3">
                FOLLOW OUR JOURNEY
              </p>
              <div className="flex items-center gap-2.5 text-[#D4C3B4]">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#2B1B15]/80 border border-[#482F24] text-[#D4C3B4] hover:text-[#FAF6F0] hover:border-[#C8A97E] hover:bg-[#3D251C] transition-all duration-300 shadow-xs cursor-pointer group"
                >
                  <Instagram className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#2B1B15]/80 border border-[#482F24] text-[#D4C3B4] hover:text-[#FAF6F0] hover:border-[#C8A97E] hover:bg-[#3D251C] transition-all duration-300 shadow-xs cursor-pointer group"
                >
                  <Facebook className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#2B1B15]/80 border border-[#482F24] text-[#D4C3B4] hover:text-[#FAF6F0] hover:border-[#C8A97E] hover:bg-[#3D251C] transition-all duration-300 shadow-xs cursor-pointer group"
                >
                  <Youtube className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </a>

                {/* WhatsApp Concierge */}
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp Concierge"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#2B1B15]/80 border border-[#482F24] text-[#D4C3B4] hover:text-[#FAF6F0] hover:border-[#C8A97E] hover:bg-[#3D251C] transition-all duration-300 shadow-xs cursor-pointer group"
                >
                  <svg className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.004.577 1.764.787 2.806.787h.001c3.182 0 5.77-2.587 5.77-5.766 0-3.181-2.588-5.77-5.771-5.77zm3.393 8.163c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.124-.518-1.503-.622-2.477-2.148-2.552-2.247-.075-.099-.607-.808-.607-1.543 0-.736.388-1.097.525-1.246.137-.149.3-.186.4-.186.1 0 .2.001.288.006.09.004.21-.034.33.254.12.288.41.996.446 1.07.036.074.06.16.012.257-.048.098-.073.16-.145.244-.073.085-.153.19-.218.255-.072.072-.148.15-.064.294.084.144.373.616.801.997.552.49 1.018.642 1.162.714.144.072.228.06.312-.036.084-.096.36-.42.456-.564.096-.144.192-.12.324-.072.132.048.837.395.981.467.144.072.24.108.276.168.036.06.036.348-.108.753z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Quick Links (2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => setMobileQuickLinksOpen(!mobileQuickLinksOpen)}
              className="flex items-center justify-between cursor-pointer md:cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
                <h3 className="font-cinzel text-xs font-semibold tracking-[0.2em] text-[#FAF6F0] uppercase">
                  QUICK LINKS
                </h3>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#A89384] md:hidden transition-transform duration-300 ${mobileQuickLinksOpen ? 'rotate-180' : ''}`} />
            </div>

            <ul className={`space-y-0.5 text-xs text-[#C4B2A3] ${mobileQuickLinksOpen ? 'block' : 'hidden md:block'}`}>
              {[
                { label: 'About Us', action: () => handleNavigate('about-us', onOpenAbout) },
                { label: 'Our Process', action: () => handleNavigate('our-process', onOpenAbout) },
                { label: 'Size Guide', action: () => handleNavigate('size-guide', onOpenSizeGuide) },
                { label: 'Returns & Exchange', action: () => handleNavigate('returns-exchange', onOpenShippingInfo) },
                { label: 'Contact Us', action: () => handleNavigate('contact-us', onOpenAbout) },
              ].map((link, idx) => (
                <li key={idx} className="border-b border-white/[0.04] last:border-none">
                  <button 
                    type="button"
                    onClick={link.action} 
                    className="group w-full py-2.5 flex items-center justify-between text-left text-[#C4B2A3] hover:text-[#FAF6F0] transition-colors duration-200 cursor-pointer"
                  >
                    <span className="font-sans font-light tracking-wide">{link.label}</span>
                    <span className="text-[11px] text-[#A89384] opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Client Services (2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="flex items-center justify-between cursor-pointer md:cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
                <h3 className="font-cinzel text-xs font-semibold tracking-[0.2em] text-[#FAF6F0] uppercase">
                  CLIENT SERVICES
                </h3>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#A89384] md:hidden transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
            </div>

            <ul className={`space-y-0.5 text-xs text-[#C4B2A3] ${mobileServicesOpen ? 'block' : 'hidden md:block'}`}>
              {/* Primary Account Action Link */}
              <li className="border-b border-white/[0.04]">
                <button 
                  type="button"
                  onClick={currentUser ? onOpenCustomerAccount : onOpenCustomerLogin} 
                  className="group w-full py-2.5 flex items-center justify-between text-left text-[#E0987A] hover:text-[#FAF6F0] transition-colors duration-200 cursor-pointer"
                >
                  <span className="font-sans font-medium tracking-wide">
                    {currentUser ? `My Account (${currentUser.name.split(' ')[0]})` : 'Client Sign In / Register'}
                  </span>
                  <span className="text-[11px] text-[#E0987A] opacity-80 group-hover:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0">
                    →
                  </span>
                </button>
              </li>

              {[
                { label: 'Track Order', action: () => handleNavigate('track-order', onOpenTrackOrder) },
                { label: 'Shipping & Returns', action: () => handleNavigate('shipping-returns', onOpenShippingInfo) },
                { label: 'Flagship Atelier', action: () => handleNavigate('flagship-atelier', onOpenStoreLocator) },
                { label: 'Privacy Policy', action: () => handleNavigate('privacy-policy', onOpenShippingInfo) },
              ].map((link, idx) => (
                <li key={idx} className="border-b border-white/[0.04] last:border-none">
                  <button 
                    type="button"
                    onClick={link.action} 
                    className="group w-full py-2.5 flex items-center justify-between text-left text-[#C4B2A3] hover:text-[#FAF6F0] transition-colors duration-200 cursor-pointer"
                  >
                    <span className="font-sans font-light tracking-wide">{link.label}</span>
                    <span className="text-[11px] text-[#A89384] opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: Newsletter (Stay in the know) (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
              <h3 className="font-cinzel text-xs font-semibold tracking-[0.2em] text-[#FAF6F0] uppercase">
                STAY IN THE KNOW
              </h3>
            </div>

            <p className="text-xs text-[#C4B2A3] leading-relaxed font-light">
              Join our world for updates on new collections, private previews &amp; more.
            </p>

            {/* Newsletter Subscription Field */}
            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="relative flex items-center border border-[#482F24] focus-within:border-[#C8A97E] rounded-xs bg-[#1A100C]/90 transition-all duration-300 shadow-inner group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-transparent px-4 py-3 text-xs text-[#FAF6F0] placeholder-[#8A766A] focus:outline-none font-sans font-light"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-4 py-3 text-[#C8A97E] hover:text-[#FAF6F0] transition-all duration-300 cursor-pointer flex items-center gap-1 group-hover:translate-x-0.5"
                >
                  <span className="font-cinzel text-xs font-semibold tracking-widest hidden sm:inline uppercase">Join</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-2 text-xs text-[#78C27E] mt-2.5 font-light">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Welcome to the Label Shikha Warule inner circle.</span>
                </div>
              )}
            </form>

            {/* Complimentary Gift Wrapping Note */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#A89384] font-light">
              <Gift className="w-3.5 h-3.5 text-[#C8A97E] shrink-0" />
              <span>Complimentary gift wrapping on your first order.</span>
            </div>
          </div>

        </div>

        {/* BOTTOM FOOTER BAR: Copyright & Couture Integrity */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#9E897A] font-light gap-4">
          <p className="text-center md:text-left">
            © 2025 Label Shikha Warule. All Rights Reserved. Handcrafted in India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-[#B8A596]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#C8A97E]" />
              100% Artisanal Craftsmanship
            </span>
            <span className="text-[#4A3227]">•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-[#C8A97E]" />
              Worldwide Insured Shipping
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

