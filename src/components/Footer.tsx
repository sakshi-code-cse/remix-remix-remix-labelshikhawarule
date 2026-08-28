import React, { useState } from 'react';
import { Instagram, Facebook, Youtube, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CustomerUser, LogoCMSContent } from '../types';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onOpenStoreLocator: () => void;
  onOpenShippingInfo: () => void;
  onOpenTrackOrder: () => void;
  onOpenAbout: () => void;
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
  onOpenCustomerLogin,
  onOpenCustomerAccount,
  currentUser,
  logoCMS,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
    <footer id="main-footer" className="bg-[#241712] text-[#EADDCF] pt-14 pb-8 border-t border-[#3E2921]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#3E2921]">
          
          {/* Column 1: Brand Logo, Tagline & Socials */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-start">
              <BrandLogo variant="light" size="md" logoCMS={logoCMS} />
            </div>
            
            <p className="font-serif-luxury italic text-sm text-[#C4B2A3] max-w-xs pt-1">
              Timeless fashion. Thoughtfully made.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2 text-[#C4B2A3]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full bg-[#34221A] hover:bg-[#9E472A] hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-full bg-[#34221A] hover:bg-[#9E472A] hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="p-2 rounded-full bg-[#34221A] hover:bg-[#9E472A] hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Concierge"
                className="p-2 rounded-full bg-[#34221A] hover:bg-[#9E472A] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.004.577 1.764.787 2.806.787h.001c3.182 0 5.77-2.587 5.77-5.766 0-3.181-2.588-5.77-5.771-5.77zm3.393 8.163c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.124-.518-1.503-.622-2.477-2.148-2.552-2.247-.075-.099-.607-.808-.607-1.543 0-.736.388-1.097.525-1.246.137-.149.3-.186.4-.186.1 0 .2.001.288.006.09.004.21-.034.33.254.12.288.41.996.446 1.07.036.074.06.16.012.257-.048.098-.073.16-.145.244-.073.085-.153.19-.218.255-.072.072-.148.15-.064.294.084.144.373.616.801.997.552.49 1.018.642 1.162.714.144.072.228.06.312-.036.084-.096.36-.42.456-.564.096-.144.192-.12.324-.072.132.048.837.395.981.467.144.072.24.108.276.168.036.06.036.348-.108.753z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#F3E7DC] uppercase">
              QUICK LINKS
            </h3>
            <ul className="space-y-2 text-xs text-[#C4B2A3]">
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer text-left">
                  Our Process
                </button>
              </li>
              <li>
                <button onClick={onOpenSizeGuide} className="hover:text-white transition-colors cursor-pointer text-left">
                  Size Guide
                </button>
              </li>
              <li>
                <button onClick={onOpenShippingInfo} className="hover:text-white transition-colors cursor-pointer text-left">
                  Returns & Exchange
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#F3E7DC] uppercase">
              CLIENT SERVICES
            </h3>
            <ul className="space-y-2 text-xs text-[#C4B2A3]">
              <li>
                <button 
                  onClick={currentUser ? onOpenCustomerAccount : onOpenCustomerLogin} 
                  className="hover:text-white transition-colors cursor-pointer text-left text-[#E08A68] font-medium"
                >
                  {currentUser ? `My Account (${currentUser.name.split(' ')[0]})` : 'Client Sign In / Register'}
                </button>
              </li>
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-white transition-colors cursor-pointer text-left">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={onOpenShippingInfo} className="hover:text-white transition-colors cursor-pointer text-left">
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button onClick={onOpenStoreLocator} className="hover:text-white transition-colors cursor-pointer text-left">
                  Flagship Atelier
                </button>
              </li>
              <li>
                <button onClick={onOpenShippingInfo} className="hover:text-white transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscribe */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#F3E7DC] uppercase">
              SUBSCRIBE
            </h3>
            <p className="text-xs text-[#C4B2A3] leading-relaxed">
              Join our world for updates on new collections & more.
            </p>

            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="relative flex items-center border border-[#523A30] rounded-xs bg-[#2F1F18] focus-within:border-[#9E472A] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-transparent px-3.5 py-2.5 text-xs text-white placeholder-[#8A766A] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-3.5 py-2.5 text-[#C4B2A3] hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-[#78C27E] mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Thank you for joining our inner circle.</span>
                </div>
              )}
            </form>

            <span className="text-[10px] text-[#8A766A] block pt-1">
              Complimentary gift wrapping on your first order.
            </span>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Clean Brand Note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A766A] font-light gap-3">
          <p>© 2025 Label Shikha Warule. All Rights Reserved. Handcrafted in India.</p>
          <div className="flex items-center gap-4 text-[11px] text-[#A89384]">
            <span>100% Artisanal Craftsmanship</span>
            <span>•</span>
            <span>Worldwide Insured Shipping</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
