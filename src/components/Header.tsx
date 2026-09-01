import React, { useState, useRef, useEffect } from 'react';
import { 
  Truck, 
  Tag, 
  Gift, 
  RotateCcw, 
  Menu, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  X, 
  ChevronDown, 
  ChevronRight,
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  MessageSquareHeart, 
  ArrowRight,
  SlidersHorizontal,
  PhoneCall,
  MapPin,
  Clock,
  Compass,
  Scissors,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CustomerUser, LogoCMSContent } from '../types';
import { InfoPageSlug } from './CoutureInfoPages';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAppointment: () => void;
  onSelectCategory: (category: string) => void;
  onNavigateCollection?: (collectionSlug: string) => void;
  onNavigatePage?: (slug: InfoPageSlug) => void;
  onOpenCustomerLogin?: () => void;
  onOpenCustomerAccount?: () => void;
  currentUser?: CustomerUser | null;
  announcementText?: string;
  cartCount: number;
  wishlistCount: number;
  activeGenderFilter?: string;
  activeCategoryFilter?: string;
  activeStyleFilter?: string;
  logoCMS?: LogoCMSContent;
}

interface MegaMenuColumn {
  heading: string;
  items: {
    label: string;
    filter?: string;
    type?: 'category' | 'gender' | 'style' | 'all';
    collectionSlug?: string;
    pageSlug?: InfoPageSlug;
    badge?: string;
    action?: 'appointment' | 'search';
  }[];
}

interface NavMenuItem {
  id: string;
  label: string;
  filter?: string;
  type?: 'category' | 'gender' | 'style' | 'all';
  collectionSlug?: string;
  pageSlug?: InfoPageSlug;
  isMegaMenu?: boolean;
  megaColumns?: MegaMenuColumn[];
  featuredImage?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  featuredLink?: {
    type: 'collection' | 'filter' | 'page';
    target: string;
  };
  isSpecial?: boolean;
  isHighlight?: boolean;
  badgeText?: string;
  action?: 'appointment' | 'search';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAppointment,
  onSelectCategory,
  onNavigateCollection,
  onNavigatePage,
  onOpenCustomerLogin,
  onOpenCustomerAccount,
  currentUser,
  announcementText,
  cartCount,
  wishlistCount,
  activeGenderFilter,
  activeCategoryFilter,
  activeStyleFilter,
  logoCMS,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Muktika Vith Casa inspired Menu Hierarchy
  const navMenuItems: NavMenuItem[] = [
    {
      id: 'shop-all',
      label: 'SHOP ALL',
      filter: 'All',
      type: 'all',
      collectionSlug: 'all',
      isMegaMenu: true,
      megaColumns: [
        {
          heading: 'BY CATEGORY',
          items: [
            { label: 'All Creations', filter: 'All', type: 'all', collectionSlug: 'all' },
            { label: 'Handcrafted Kurtas', filter: 'Kurtas', type: 'category' },
            { label: 'Heritage Sarees', filter: 'Sarees', type: 'category' },
            { label: 'Artisanal Bandhgalas', filter: 'Bandhgala', type: 'category' },
            { label: 'Royal Sherwanis', filter: 'Sherwanis', type: 'category' },
            { label: 'Silk Dresses & Tunics', filter: 'Dresses', type: 'category' },
            { label: 'Coordinated Sets', filter: 'Sets', type: 'category' },
          ],
        },
        {
          heading: 'BY AUDIENCE',
          items: [
            { label: 'Women’s Couture', filter: 'Women', type: 'gender' },
            { label: 'Men’s Heritage Atelier', filter: 'Men', type: 'gender' },
            { label: 'Little Royals (Kids)', filter: 'Kids', type: 'gender' },
            { label: 'Bespoke Footwear & Juttis', filter: 'Accessories', type: 'category' },
            { label: 'Luxury Stoles & Dupattas', filter: 'Dupattas', type: 'category' },
          ],
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Masterpiece Handlooms',
      featuredSubtitle: '120+ hours of hand zardozi & pure silk',
      featuredLink: { type: 'collection', target: 'all' },
    },
    {
      id: 'new-arrivals',
      label: 'NEW ARRIVALS',
      collectionSlug: 'new-arrivals',
      filter: 'New',
      type: 'all',
      badgeText: 'NEW',
      isMegaMenu: true,
      megaColumns: [
        {
          heading: 'SEASONAL EDITS',
          items: [
            { label: 'Festive Symphony 2026', collectionSlug: 'festive-zardozi' },
            { label: 'Chanderi Gold Edit', collectionSlug: 'chanderi-gold' },
            { label: 'Royal Banarasi Heirlooms', collectionSlug: 'royal-banarasi' },
            { label: 'Contemporary Belgian Linens', filter: 'Shirts', type: 'category' },
          ],
        },
        {
          heading: 'TRENDING ATELIER',
          items: [
            { label: 'Groom & Bride Twin Ensembles', filter: 'Ethnic', type: 'style' },
            { label: 'Pastel Organza Drapes', filter: 'Sarees', type: 'category' },
            { label: 'Velvet Midnight Bandhgalas', filter: 'Bandhgala', type: 'category' },
            { label: 'Zero-Waste Khadi Kurtas', filter: 'Kurtas', type: 'category' },
          ],
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Spring-Summer Festive 2026',
      featuredSubtitle: 'Explore fresh silken silhouettes',
      featuredLink: { type: 'collection', target: 'new-arrivals' },
    },
    {
      id: 'shop-by-style',
      label: 'SHOP BY STYLE',
      isMegaMenu: true,
      megaColumns: [
        {
          heading: 'ETHNIC & REGAL',
          items: [
            { label: 'Bandhgalas & Achkans', filter: 'Bandhgala', type: 'category' },
            { label: 'Classic Sherwanis', filter: 'Sherwanis', type: 'category' },
            { label: 'Traditional Kurtas & Pyjamas', filter: 'Kurtas', type: 'category' },
            { label: 'Zari Weave Heritage Sarees', filter: 'Sarees', type: 'category' },
            { label: 'Anarkalis & Regal Sets', filter: 'Sets', type: 'category' },
          ],
        },
        {
          heading: 'MODERN & INDO-WESTERN',
          items: [
            { label: 'Indo-Western Tuxedos', filter: 'Classic', type: 'style' },
            { label: 'Jacket & Kurta Sets', filter: 'Sets', type: 'category' },
            { label: 'Draped Tunics & Silk Dresses', filter: 'Dresses', type: 'category' },
            { label: 'Tailored Waistcoats & Nehrus', filter: 'Bandhgala', type: 'category' },
            { label: 'Everyday Relaxed Linen', filter: 'Everyday', type: 'style' },
          ],
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Couture Tailoring',
      featuredSubtitle: 'Architectural precision meets imperial craft',
      featuredLink: { type: 'filter', target: 'Ethnic' },
    },
    {
      id: 'collections',
      label: 'COLLECTIONS',
      isMegaMenu: true,
      megaColumns: [
        {
          heading: 'SIGNATURE EDITIONS',
          items: [
            { label: 'The Chanderi Gold Symphony', collectionSlug: 'chanderi-gold' },
            { label: 'Banarasi Heritage Weaves', collectionSlug: 'royal-banarasi' },
            { label: 'Festive Zardozi Splendour', collectionSlug: 'festive-zardozi' },
            { label: 'Pure Handloom Silk Edit', collectionSlug: 'heritage-silk' },
          ],
        },
        {
          heading: 'CURATED CAPSULES',
          items: [
            { label: 'Organza Bloom & Sheer Magic', filter: 'Sarees', type: 'category' },
            { label: 'Handspun Khadi Artisanal', filter: 'Kurtas', type: 'category' },
            { label: 'Royal Velvet Eveningwear', filter: 'Bandhgala', type: 'category' },
            { label: 'View All Curations', collectionSlug: 'all' },
          ],
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Heirloom Wardrobes',
      featuredSubtitle: 'Crafted to be cherished across generations',
      featuredLink: { type: 'collection', target: 'chanderi-gold' },
    },
    {
      id: 'occasions',
      label: 'OCCASIONS',
      isMegaMenu: true,
      megaColumns: [
        {
          heading: 'WEDDING & CELEBRATION',
          items: [
            { label: 'The Royal Groom & Bride', filter: 'Festive', type: 'style' },
            { label: 'Sangeet & Mehendi Revelry', filter: 'Ethnic', type: 'style' },
            { label: 'Haldi & Puja Pastel Tones', filter: 'Kurtas', type: 'category' },
            { label: 'Reception & Grand Gala', filter: 'Classic', type: 'style' },
          ],
        },
        {
          heading: 'SOIREE & GUEST WEAR',
          items: [
            { label: 'Intimate Festivities', filter: 'Everyday', type: 'style' },
            { label: 'Groomsmen & Bridesmaids', filter: 'Sets', type: 'category' },
            { label: 'Bespoke Consultation Service', action: 'appointment' },
          ],
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Celebrations of a Lifetime',
      featuredSubtitle: 'Dress the grand moments in timeless grandeur',
      featuredLink: { type: 'filter', target: 'Festive' },
    },
    {
      id: 'footwear-accessories',
      label: 'ACCESSORIES',
      filter: 'Accessories',
      type: 'category',
      isMegaMenu: true,
      megaColumns: [
        {
          heading: 'ARTISANAL ESSENTIALS',
          items: [
            { label: 'Handcrafted Leather Juttis', filter: 'Accessories', type: 'category' },
            { label: 'Pure Silk Brocade Dupattas', filter: 'Dupattas', type: 'category' },
            { label: 'Zardozi Minaudières & Bags', filter: 'Accessories', type: 'category' },
            { label: 'Silk Pocket Squares & Stoles', filter: 'Accessories', type: 'category' },
          ],
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Imperial Finishes',
      featuredSubtitle: 'Hand-sewn pure leather & metallic zari',
      featuredLink: { type: 'filter', target: 'Accessories' },
    },
    {
      id: 'the-atelier',
      label: 'THE ATELIER',
      isMegaMenu: true,
      megaColumns: [
        {
          heading: 'OUR HERITAGE',
          items: [
            { label: 'Our Philosophy & Story', pageSlug: 'about-us' },
            { label: 'The 5-Step Artisan Process', pageSlug: 'our-process' },
            { label: 'Flagship Salon (Navi Mumbai)', pageSlug: 'flagship-atelier' },
            { label: 'Bespoke Size & Measuring Guide', pageSlug: 'size-guide' },
          ],
        },
        {
          heading: 'CLIENT CONCIERGE',
          items: [
            { label: 'Complimentary Shipping & Returns', pageSlug: 'shipping-returns' },
            { label: 'Track Client Order', pageSlug: 'track-order' },
            { label: 'Atelier Contact & Concierge', pageSlug: 'contact-us' },
            { label: 'Book 1-on-1 Fitting Appointment', action: 'appointment' },
          ],
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'House of Shikha Warule',
      featuredSubtitle: 'Preserving 500-year-old weaving traditions',
      featuredLink: { type: 'page', target: 'about-us' },
    },
    {
      id: 'sale',
      label: 'SALE',
      isHighlight: true,
      badgeText: 'LIMITED',
      filter: 'All',
      type: 'all',
      collectionSlug: 'all',
    },
  ];

  const handleItemNavigation = (item: {
    label?: string;
    filter?: string;
    type?: 'category' | 'gender' | 'style' | 'all';
    collectionSlug?: string;
    pageSlug?: InfoPageSlug;
    action?: 'appointment' | 'search';
  }) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (item.action === 'appointment') {
      onOpenAppointment();
      return;
    }

    if (item.action === 'search') {
      onOpenSearch();
      return;
    }

    if (item.pageSlug) {
      if (onNavigatePage) {
        onNavigatePage(item.pageSlug);
      } else {
        window.location.hash = `#/${item.pageSlug}`;
      }
      return;
    }

    if (item.collectionSlug && onNavigateCollection) {
      onNavigateCollection(item.collectionSlug);
      return;
    }

    if (item.filter) {
      onSelectCategory(item.filter);
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 w-full bg-[#FAF6F0] border-b border-[#EADDCF]/80 shadow-xs transition-all">
      
      {/* 1. TOP TICKER / CONCIERGE BAR (Muktika Vith Casa subtle elegance) */}
      <div id="top-announcement-bar" className="bg-[#480E16] text-[#FDF8F3] text-[11px] py-2 px-3 sm:px-6 border-b border-[#360910]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Atelier Helpline & Direct WhatsApp */}
          <div className="hidden md:flex items-center gap-4 text-[#E8D3C4] text-[11px]">
            <a 
              href="tel:+919820012345" 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#D99B72]" />
              <span>Concierge: +91 98200 12345</span>
            </a>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-[#E8D3C4]">
              <MapPin className="w-3 h-3 text-[#D99B72]" />
              <span>Flagship: Nerul, Navi Mumbai</span>
            </span>
          </div>

          {/* Center: Main Ticker Headline */}
          <div className="flex-1 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-[#E8A57D] shrink-0" />
            <span className="font-cinzel tracking-[0.2em] uppercase text-[#FAF6F0] font-medium text-[11px] sm:text-xs">
              {announcementText || 'COMPLIMENTARY WORLDWIDE EXPRESS DELIVERY ON ORDERS OVER ₹15,000'}
            </span>
            <Sparkles className="w-3 h-3 text-[#E8A57D] shrink-0 hidden sm:inline" />
          </div>

          {/* Right: Currency / Fitting Appointment Shortcut */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#E8D3C4]">
            <button 
              onClick={onOpenAppointment}
              className="hover:text-white transition-colors underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3 h-3 text-[#D99B72]" />
              <span>Book Atelier Fitting</span>
            </button>
            <span className="text-white/20">•</span>
            <span className="font-semibold text-white/90">INR ₹ (IN)</span>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER TIER: LOGO & ESSENTIAL ACTIONS (Muktika Vith Casa centered brand harmony) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        
        {/* Left: Mobile Menu Trigger + Sleek Search Bar */}
        <div className="flex items-center gap-2.5 sm:gap-4 lg:w-1/3">
          <button
            id="mobile-menu-toggle-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#2C2420] hover:text-[#58111A] hover:bg-[#F3EBE1] rounded-lg transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Search Trigger */}
          <button
            id="header-search-bar-trigger"
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-[#F3EBE1]/80 hover:bg-[#EADDCF] text-[#6E635D] hover:text-[#2C2420] rounded-full border border-[#DFCBB8]/80 text-xs transition-all w-48 xl:w-64 cursor-pointer shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-[#58111A]" />
            <span className="truncate text-[11.5px]">Search sherwanis, kurtas, sarees...</span>
          </button>

          {/* Mobile Search Icon */}
          <button
            id="header-mobile-search-btn"
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-[#2C2420] hover:text-[#58111A] rounded-full hover:bg-[#F3EBE1]"
            aria-label="Search collection"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Brand Identity */}
        <div 
          id="header-logo-container" 
          className="flex-1 flex justify-center text-center lg:w-1/3 transition-all"
        >
          <BrandLogo 
            size="md" 
            logoCMS={logoCMS}
            onClick={() => {
              onSelectCategory('All');
              if (onNavigateCollection) onNavigateCollection('all');
              window.location.hash = '#/';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        </div>

        {/* Right: Bespoke CTA, Client Account, Wishlist, Cart */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 lg:w-1/3 text-[#2C2420]">
          
          {/* Bespoke Consultation Pill (Mukti & Kavith signature CTA) */}
          <button
            onClick={onOpenAppointment}
            className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#58111A] hover:bg-[#6E1622] text-[#FDF8F3] border border-[#7A1C2B] text-xs font-cinzel font-semibold tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer mr-1"
          >
            <Calendar className="w-3.5 h-3.5 text-[#E8A57D]" />
            <span>Book Visit</span>
          </button>

          {/* Customer User Account */}
          {currentUser ? (
            <button
              id="header-customer-account-button"
              onClick={onOpenCustomerAccount}
              title={`Logged in as ${currentUser.name} (${currentUser.couturePoints} pts)`}
              aria-label="My Atelier Account"
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 bg-[#F3EBE1] hover:bg-[#EADDCF] text-[#2C2420] rounded-full border border-[#DFCBB8] transition-all cursor-pointer relative group"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-[#58111A]"
                />
              ) : (
                <User className="w-4 h-4 text-[#58111A]" />
              )}
              <span className="hidden md:inline text-xs font-semibold max-w-[85px] truncate text-[#2C2420]">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="hidden group-hover:block absolute right-0 top-full mt-1 bg-[#2C2420] text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-lg z-50">
                {currentUser.tier} • {currentUser.couturePoints} pts
              </span>
            </button>
          ) : (
            <button
              id="header-customer-login-button"
              onClick={onOpenCustomerLogin}
              title="Client Sign In / Register"
              aria-label="Client Sign In"
              className="p-2 text-[#2C2420] hover:text-[#58111A] hover:bg-[#F3EBE1] rounded-full transition-colors cursor-pointer relative group"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
              <span className="hidden group-hover:block absolute right-0 top-full mt-1 bg-[#2C2420] text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-lg z-50">
                Client Sign In
              </span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            id="header-wishlist-button"
            onClick={onOpenWishlist}
            aria-label="View wishlist"
            className="p-2 text-[#2C2420] hover:text-[#58111A] hover:bg-[#F3EBE1] rounded-full transition-colors cursor-pointer relative"
          >
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#58111A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            id="header-cart-button"
            onClick={onOpenCart}
            aria-label="View shopping bag"
            className="p-2 text-[#2C2420] hover:text-[#58111A] hover:bg-[#F3EBE1] rounded-full transition-colors cursor-pointer relative"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#58111A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* 3. SIGNATURE HORIZONTAL MENU BAR (Muktika Vith Casa Royal Presentation Bar) */}
      <div 
        id="header-menu-below-logo" 
        className="hidden lg:block bg-[#58111A] text-[#FAF6F0] border-t border-b border-[#3D0A11] shadow-md relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1 xl:gap-3 py-1 relative">
            {navMenuItems.map((item) => {
              const isItemActive = 
                (item.type === 'gender' && activeGenderFilter === item.filter) ||
                (item.type === 'category' && activeCategoryFilter === item.filter) ||
                (item.type === 'style' && activeStyleFilter === item.filter);

              const hasMegaMenu = Boolean(item.isMegaMenu && item.megaColumns && item.megaColumns.length > 0);

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => hasMegaMenu && handleMouseEnter(item.id)}
                  onMouseLeave={hasMegaMenu ? handleMouseLeave : undefined}
                  className="relative group"
                >
                  <button
                    id={`nav-menu-item-${item.id}`}
                    onClick={() => handleItemNavigation(item)}
                    className={`font-cinzel text-[11.5px] xl:text-xs font-semibold tracking-[0.14em] uppercase py-2.5 px-3 rounded transition-all duration-200 flex items-center gap-1 cursor-pointer relative whitespace-nowrap ${
                      item.isHighlight
                        ? 'text-[#FBD5C0] font-bold hover:text-white bg-[#7A1C2B]/50'
                        : isItemActive
                        ? 'text-[#FBD5C0] bg-[#430B13] font-bold'
                        : 'text-[#FAF6F0] hover:text-[#FBD5C0] hover:bg-[#6E1622]/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    
                    {hasMegaMenu && (
                      <ChevronDown className="w-3 h-3 text-[#E8A57D]/70 group-hover:rotate-180 group-hover:text-white transition-transform duration-200" />
                    )}

                    {item.badgeText && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#E08A68] text-[#480E16] text-[8.5px] font-bold tracking-wider uppercase shadow-2xs">
                        {item.badgeText}
                      </span>
                    )}

                    {/* Subtle Active Gold Line */}
                    {isItemActive && (
                      <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-[#E8A57D] rounded-full" />
                    )}
                  </button>

                  {/* HIGH-END MUKTIKA VITH CASA STYLE MEGA DROPDOWN (TEXT & CATEGORY ONLY) */}
                  {hasMegaMenu && activeDropdown === item.id && (
                    <div 
                      className={`absolute left-1/2 -translate-x-1/2 top-full pt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200 ${
                        (item.megaColumns?.length || 1) > 1 ? 'w-[480px] xl:w-[520px]' : 'w-[280px]'
                      }`}
                    >
                      <div className="bg-[#FAF6F0] rounded-xl shadow-2xl border border-[#DFCBB8] overflow-hidden p-5 text-left">
                        
                        {/* Mega Menu Columns */}
                        <div className={`grid gap-6 ${
                          (item.megaColumns?.length || 1) > 1 ? 'grid-cols-2' : 'grid-cols-1'
                        }`}>
                          {item.megaColumns?.map((col, idx) => (
                            <div key={idx} className="space-y-2.5">
                              <h4 className="font-cinzel text-[11px] font-bold tracking-[0.16em] text-[#58111A] border-b border-[#EADDCF] pb-1.5 uppercase">
                                {col.heading}
                              </h4>
                              <ul className="space-y-1">
                                {col.items.map((sub, sIdx) => (
                                  <li key={sIdx}>
                                    <button
                                      onClick={() => handleItemNavigation(sub)}
                                      className="w-full text-left py-1 text-xs text-[#4A3E39] hover:text-[#58111A] hover:font-medium flex items-center justify-between group/link transition-colors cursor-pointer"
                                    >
                                      <span className="group-hover/link:translate-x-0.5 transition-transform">
                                        {sub.label}
                                      </span>
                                      <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 text-[#58111A] transition-opacity shrink-0" />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Quality Guarantee Ticker in Mega Menu */}
                        <div className="mt-4 pt-3 border-t border-[#EADDCF] flex items-center justify-between text-[10.5px] text-[#7A6F68]">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#58111A]" />
                            100% Certified Authentic Indian Handlooms
                          </span>
                          <span className="font-cinzel font-semibold text-[#58111A]">
                            Made-To-Measure Available
                          </span>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. MOBILE OFF-CANVAS / EXPANDABLE ACCORDION DRAWER (Muktika Vith Casa Mobile UX) */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu-drawer" 
          className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 z-40 bg-[#FAF6F0] flex flex-col justify-between overflow-y-auto shadow-2xl border-t border-[#EADDCF] animate-in slide-in-from-top-2 duration-200"
        >
          
          <div className="p-4 space-y-4">
            
            {/* Quick Search on Mobile Top */}
            <div className="relative">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-[#DFCBB8] rounded-lg text-xs text-[#7A6F68]"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#58111A]" />
                  <span>Search styles, fabrics, collections...</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7A6F68]" />
              </button>
            </div>

            {/* Menu Items with Accordion Support */}
            <div className="space-y-1 border-t border-b border-[#EADDCF] py-2">
              {navMenuItems.map((item) => {
                const isExpanded = mobileExpandedItem === item.id;
                const hasChildren = Boolean(item.isMegaMenu && item.megaColumns && item.megaColumns.length > 0);

                return (
                  <div key={item.id} className="border-b border-[#EADDCF]/40 last:border-none">
                    
                    <div className="flex items-center justify-between py-2.5 px-1">
                      <button
                        onClick={() => {
                          if (hasChildren) {
                            setMobileExpandedItem(isExpanded ? null : item.id);
                          } else {
                            handleItemNavigation(item);
                          }
                        }}
                        className={`text-left font-cinzel text-xs font-semibold tracking-wider flex items-center gap-2 ${
                          item.isHighlight ? 'text-[#9E472A] font-bold' : 'text-[#2C2420]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.badgeText && (
                          <span className="px-1.5 py-0.2 rounded bg-[#58111A] text-white text-[9px] font-bold">
                            {item.badgeText}
                          </span>
                        )}
                      </button>

                      {hasChildren && (
                        <button
                          onClick={() => setMobileExpandedItem(isExpanded ? null : item.id)}
                          className="p-1 text-[#7A6F68] hover:text-[#2C2420]"
                          aria-label="Expand category"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#58111A]' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Accordion Sub-items */}
                    {hasChildren && isExpanded && (
                      <div className="pl-3 pr-1 pb-3 space-y-3 bg-[#F3EBE1]/50 rounded-lg p-2.5 mb-2">
                        {item.megaColumns?.map((col, cIdx) => (
                          <div key={cIdx} className="space-y-1.5">
                            <span className="text-[10px] font-cinzel font-bold text-[#58111A] tracking-wider uppercase block">
                              {col.heading}
                            </span>
                            <div className="grid grid-cols-1 gap-1">
                              {col.items.map((sub, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => handleItemNavigation(sub)}
                                  className="text-left text-xs py-1.5 px-2 rounded hover:bg-white text-[#4A3E39] hover:text-[#58111A] flex items-center justify-between"
                                >
                                  <span>{sub.label}</span>
                                  <ChevronRight className="w-3 h-3 text-[#7A6F68]" />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Quick Actions (Book Fitting, Client Account) */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onOpenAppointment();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 bg-[#58111A] text-white rounded-lg flex items-center justify-center gap-2 text-xs font-cinzel font-semibold shadow-md"
              >
                <Calendar className="w-4 h-4 text-[#E8A57D]" />
                <span>Book Atelier Consultation</span>
              </button>

              <button
                onClick={() => {
                  if (currentUser && onOpenCustomerAccount) {
                    onOpenCustomerAccount();
                  } else if (onOpenCustomerLogin) {
                    onOpenCustomerLogin();
                  }
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-white border border-[#DFCBB8] text-[#2C2420] rounded-lg flex items-center justify-center gap-2 text-xs font-cinzel font-medium"
              >
                <User className="w-4 h-4 text-[#58111A]" />
                <span>{currentUser ? `My Account (${currentUser.name})` : 'Client Sign In / Register'}</span>
              </button>
            </div>

          </div>

          {/* Mobile Footer Contact Note */}
          <div className="p-4 bg-[#EFE4D7] border-t border-[#DFCBB8] text-center text-xs text-[#7A6F68] space-y-1">
            <p className="font-semibold text-[#2C2420]">House of Shikha Warule Atelier</p>
            <p className="text-[11px]">Nerul West, Navi Mumbai • +91 98200 12345</p>
          </div>

        </div>
      )}

    </header>
  );
};
