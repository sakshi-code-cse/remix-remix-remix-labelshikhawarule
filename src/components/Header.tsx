import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  X, 
  ChevronDown, 
  ChevronRight,
  Sparkles, 
  Calendar, 
  Phone, 
  MapPin, 
  ArrowRight,
  Plus,
  Minus
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

interface NavSubItem {
  label: string;
  filter?: string;
  type?: 'category' | 'gender' | 'style' | 'all';
  collectionSlug?: string;
  pageSlug?: InfoPageSlug;
  badge?: string;
  action?: 'appointment' | 'search';
}

interface NavMenuItem {
  id: string;
  label: string;
  filter?: string;
  type?: 'category' | 'gender' | 'style' | 'all';
  collectionSlug?: string;
  pageSlug?: InfoPageSlug;
  badgeText?: string;
  isHighlight?: boolean;
  action?: 'appointment' | 'search';
  items?: NavSubItem[];
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
  // Mobile/Drawer Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Desktop Dropdown Navigation (Hover + Click support)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  // 100% Muktika & Kavith Casa Authentic Vertical Hierarchy
  const navMenuItems: NavMenuItem[] = [
    {
      id: 'shop-all',
      label: 'SHOP ALL',
      filter: 'All',
      type: 'all',
      collectionSlug: 'all',
      items: [
        { label: 'All Creations', filter: 'All', type: 'all', collectionSlug: 'all' },
        { label: 'Bandhgala', filter: 'Bandhgala', type: 'category' },
        { label: 'Formals', filter: 'Classic', type: 'style' },
        { label: 'Indo Western', filter: 'Classic', type: 'style' },
        { label: 'Jacket Set', filter: 'Sets', type: 'category' },
        { label: 'Jodhpuri', filter: 'Bandhgala', type: 'category' },
        { label: 'Jutti', filter: 'Accessories', type: 'category' },
        { label: 'Kurtas', filter: 'Kurtas', type: 'category' },
        { label: 'Sherwanis', filter: 'Sherwanis', type: 'category' },
        { label: 'Tuxedos', filter: 'Classic', type: 'style' },
        { label: 'Footwear', filter: 'Accessories', type: 'category' },
      ],
    },
    {
      id: 'new-arrivals',
      label: 'NEW ARRIVALS',
      collectionSlug: 'new-arrivals',
      filter: 'New',
      type: 'all',
      badgeText: 'NEW',
      items: [
        { label: 'Festive Symphony 2026', collectionSlug: 'festive-zardozi' },
        { label: 'Chanderi Gold Edit', collectionSlug: 'chanderi-gold' },
        { label: 'Royal Banarasi Heirlooms', collectionSlug: 'royal-banarasi' },
        { label: 'Velvet Midnight Bandhgalas', filter: 'Bandhgala', type: 'category' },
        { label: 'Pastel Organza Drapes', filter: 'Sarees', type: 'category' },
        { label: 'Zero-Waste Khadi Kurtas', filter: 'Kurtas', type: 'category' },
      ],
    },
    {
      id: 'shop-by-style',
      label: 'SHOP BY STYLE',
      items: [
        { label: 'Bandhgala', filter: 'Bandhgala', type: 'category' },
        { label: 'Formals', filter: 'Classic', type: 'style' },
        { label: 'Indo Western', filter: 'Classic', type: 'style' },
        { label: 'Jacket Set', filter: 'Sets', type: 'category' },
        { label: 'Jodhpuri', filter: 'Bandhgala', type: 'category' },
        { label: 'Jutti', filter: 'Accessories', type: 'category' },
        { label: 'Kurtas', filter: 'Kurtas', type: 'category' },
        { label: 'Sherwanis', filter: 'Sherwanis', type: 'category' },
        { label: 'Tuxedos', filter: 'Classic', type: 'style' },
      ],
    },
    {
      id: 'collections',
      label: 'COLLECTIONS',
      items: [
        { label: 'The Chanderi Gold Symphony', collectionSlug: 'chanderi-gold' },
        { label: 'Banarasi Heritage Weaves', collectionSlug: 'royal-banarasi' },
        { label: 'Festive Zardozi Splendour', collectionSlug: 'festive-zardozi' },
        { label: 'Pure Handloom Silk Edit', collectionSlug: 'heritage-silk' },
        { label: 'View All Collections', collectionSlug: 'all' },
      ],
    },
    {
      id: 'occasions',
      label: 'OCCASIONS',
      items: [
        { label: 'Wedding', filter: 'Festive', type: 'style' },
        { label: 'Sangeet & Mehendi', filter: 'Ethnic', type: 'style' },
        { label: 'Haldi & Puja', filter: 'Kurtas', type: 'category' },
        { label: 'Reception & Grand Gala', filter: 'Classic', type: 'style' },
      ],
    },
    {
      id: 'footwear',
      label: 'FOOTWEAR',
      filter: 'Accessories',
      type: 'category',
      items: [
        { label: 'Handcrafted Leather Juttis', filter: 'Accessories', type: 'category' },
        { label: 'Embroidered Mojaris', filter: 'Accessories', type: 'category' },
        { label: 'Silk Pocket Squares', filter: 'Accessories', type: 'category' },
      ],
    },
    {
      id: 'book-appointment',
      label: 'BOOK AN APPOINTMENT',
      action: 'appointment',
      isHighlight: true,
    },
    {
      id: 'blogs',
      label: 'BLOGS',
      pageSlug: 'our-process',
    },
    {
      id: 'about-us',
      label: 'ABOUT US',
      pageSlug: 'about-us',
      items: [
        { label: 'Our Story & Philosophy', pageSlug: 'about-us' },
        { label: 'The 5-Step Artisan Process', pageSlug: 'our-process' },
        { label: 'Flagship Atelier Navi Mumbai', pageSlug: 'flagship-atelier' },
        { label: 'Bespoke Sizing & Fit Guide', pageSlug: 'size-guide' },
      ],
    },
    {
      id: 'contact-us',
      label: 'CONTACT US',
      pageSlug: 'contact-us',
      items: [
        { label: 'Atelier Concierge Desk', pageSlug: 'contact-us' },
        { label: 'Book 1-on-1 Private Fitting', action: 'appointment' },
        { label: 'Track Client Order', pageSlug: 'track-order' },
        { label: 'Shipping & Exchange Policy', pageSlug: 'shipping-returns' },
      ],
    },
    {
      id: 'sale',
      label: 'SALE',
      isHighlight: true,
      badgeText: 'SALE',
      filter: 'All',
      type: 'all',
      collectionSlug: 'all',
    },
  ];

  const handleNavigate = (item: {
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
    <>
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <header id="main-header" className="sticky top-0 z-40 w-full bg-[#FAF6F0] border-b border-[#EADDCF] shadow-xs">
        
        <div id="top-announcement-bar" className="bg-[#480E16] text-[#FDF8F3] text-[11px] py-2 px-3 sm:px-6 border-b border-[#360910]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            <div className="hidden md:flex items-center gap-4 text-[#E8D3C4] text-[11px]">
              <a href="tel:+919820012345" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3 h-3 text-[#D99B72]" />
                <span>Concierge: +91 98200 12345</span>
              </a>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#D99B72]" />
                <span>Flagship: Nerul, Navi Mumbai</span>
              </span>
            </div>

            <div className="flex-1 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-[#E8A57D] shrink-0" />
              <span className="font-cinzel tracking-[0.2em] uppercase text-[#FAF6F0] font-medium text-[11px]">
                {announcementText || 'COMPLIMENTARY WORLDWIDE EXPRESS DELIVERY ON ORDERS OVER ₹15,000'}
              </span>
              <Sparkles className="w-3 h-3 text-[#E8A57D] shrink-0 hidden sm:inline" />
            </div>

            <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#E8D3C4]">
              <button 
                onClick={onOpenAppointment}
                className="hover:text-white transition-colors underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3 h-3 text-[#D99B72]" />
                <span>Book Fitting</span>
              </button>
              <span className="text-white/30">•</span>
              <span className="font-semibold text-white/90">INR ₹ (IN)</span>
            </div>

          </div>
        </div>

        {/* 2. MAIN HEADER (LOGO, DRAWER TRIGGER, USER UTILITIES) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Left: Mobile Menu Trigger + Search */}
          <div className="flex items-center gap-3 lg:w-1/3">
            <button
              id="header-side-menu-button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-[#2C2420] hover:text-[#58111A] hover:bg-[#F3EBE1] rounded transition-colors cursor-pointer border border-[#DFCBB8]/70"
              aria-label="Open menu drawer"
            >
              <Menu className="w-5 h-5 text-[#58111A]" />
              <span className="font-cinzel text-xs font-semibold tracking-wider uppercase text-[#2C2420]">
                MENU
              </span>
            </button>

            <button
              id="header-search-bar-trigger"
              onClick={onOpenSearch}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#F3EBE1] hover:bg-[#EADDCF] text-[#6E635D] hover:text-[#2C2420] rounded-full border border-[#DFCBB8] text-xs transition-all w-48 xl:w-56 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#58111A]" />
              <span className="truncate text-[11.5px]">Search sherwanis, kurtas...</span>
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div 
            id="header-logo-container" 
            className="flex-1 flex justify-center text-center lg:w-1/3"
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

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 lg:w-1/3 text-[#2C2420]">
            
            <button
              onClick={onOpenAppointment}
              className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#58111A] hover:bg-[#6E1622] text-[#FDF8F3] text-xs font-cinzel font-semibold tracking-wide transition-all shadow-xs cursor-pointer mr-1"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E8A57D]" />
              <span>Book Visit</span>
            </button>

            {/* Account */}
            {currentUser ? (
              <button
                id="header-customer-account-button"
                onClick={onOpenCustomerAccount}
                title={`Logged in as ${currentUser.name}`}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 bg-[#F3EBE1] hover:bg-[#EADDCF] text-[#2C2420] rounded-full border border-[#DFCBB8] transition-all cursor-pointer"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#58111A]" />
                )}
                <span className="hidden md:inline text-xs font-semibold max-w-[85px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                id="header-customer-login-button"
                onClick={onOpenCustomerLogin}
                title="Client Sign In"
                className="p-2 text-[#2C2420] hover:text-[#58111A] hover:bg-[#F3EBE1] rounded-full transition-colors cursor-pointer"
              >
                <User className="w-5 h-5 stroke-[1.8]" />
              </button>
            )}

            {/* Wishlist */}
            <button
              id="header-wishlist-button"
              onClick={onOpenWishlist}
              className="p-2 text-[#2C2420] hover:text-[#58111A] hover:bg-[#F3EBE1] rounded-full transition-colors cursor-pointer relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#58111A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              id="header-cart-button"
              onClick={onOpenCart}
              className="p-2 text-[#2C2420] hover:text-[#58111A] hover:bg-[#F3EBE1] rounded-full transition-colors cursor-pointer relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#58111A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* 3. HORIZONTAL NAV BAR WITH STRICT VERTICAL-ONLY TEXT DROPDOWNS */}
        <div 
          id="header-menu-below-logo" 
          className="hidden lg:block bg-[#58111A] text-[#FAF6F0] border-t border-b border-[#3D0A11] shadow-md relative"
        >
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center justify-center gap-1 xl:gap-2 py-1 relative">
              {navMenuItems.map((item) => {
                const hasSubItems = Boolean(item.items && item.items.length > 0);
                const isOpen = activeDropdown === item.id;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => hasSubItems && handleMouseEnter(item.id)}
                    onMouseLeave={hasSubItems ? handleMouseLeave : undefined}
                    className="relative"
                  >
                    <button
                      id={`nav-menu-item-${item.id}`}
                      onClick={() => {
                        if (hasSubItems) {
                          toggleDropdown(item.id);
                        } else {
                          handleNavigate(item);
                        }
                      }}
                      className={`font-cinzel text-[11.5px] xl:text-xs font-semibold tracking-[0.14em] uppercase py-2.5 px-3 rounded transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        item.isHighlight
                          ? 'text-[#FBD5C0] font-bold bg-[#7A1C2B]/50'
                          : isOpen
                          ? 'text-[#FBD5C0] bg-[#430B13]'
                          : 'text-[#FAF6F0] hover:text-[#FBD5C0] hover:bg-[#6E1622]/60'
                      }`}
                    >
                      <span>{item.label}</span>
                      {hasSubItems && (
                        <ChevronDown className={`w-3 h-3 text-[#E8A57D]/70 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                      )}
                      {item.badgeText && (
                        <span className="ml-1 px-1.5 py-0.2 rounded bg-[#E08A68] text-[#480E16] text-[8.5px] font-bold uppercase">
                          {item.badgeText}
                        </span>
                      )}
                    </button>

                    {/* 100% PURE VERTICAL TEXT LIST (NO IMAGES, NO GRIDS, NO LOOKBOOK BUTTONS) */}
                    {hasSubItems && isOpen && (
                      <div 
                        className="absolute left-0 top-full pt-1 z-50 w-60 animate-in fade-in slide-in-from-top-1 duration-150"
                      >
                        <div className="bg-[#FAF6F0] rounded-md shadow-2xl border border-[#DFCBB8] p-2 flex flex-col space-y-0.5">
                          {item.items?.map((sub, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleNavigate(sub)}
                              className="w-full text-left py-2 px-3 rounded text-xs text-[#3D312A] hover:text-[#58111A] hover:bg-[#F3EBE1] hover:font-medium flex items-center justify-between group transition-colors cursor-pointer"
                            >
                              <span className="group-hover:translate-x-1 transition-transform font-sans">
                                {sub.label}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#58111A] transition-opacity shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </nav>
          </div>
        </div>

      </header>

      {/* 4. MUKTIKA VITH CASA SIGNATURE VERTICAL SLIDE-OUT DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          <div 
            className="absolute inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs sm:max-w-sm bg-[#FAF6F0] shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#DFCBB8] animate-in slide-in-from-left duration-200">
              
              <div>
                {/* Header */}
                <div className="p-4 border-b border-[#EADDCF] flex items-center justify-between bg-[#58111A] text-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E8A57D]" />
                    <span className="font-cinzel text-xs font-bold tracking-[0.2em] uppercase">
                      NAVIGATION
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded hover:bg-white/10 text-white cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Search inside Drawer */}
                <div className="p-3 border-b border-[#EADDCF] bg-[#F3EBE1]/60">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSearch();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#DFCBB8] rounded text-xs text-[#7A6F68] shadow-2xs hover:border-[#58111A] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#58111A]" />
                      <span>Search kurtas, sherwanis...</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#7A6F68]" />
                  </button>
                </div>

                {/* Vertical Category Links */}
                <div className="p-3 flex flex-col space-y-1">
                  {navMenuItems.map((item) => {
                    const isExpanded = expandedId === item.id;
                    const hasSubItems = Boolean(item.items && item.items.length > 0);

                    return (
                      <div key={item.id} className="border-b border-[#EADDCF]/60 pb-1 pt-1">
                        
                        <div className="flex items-center justify-between py-2 px-1">
                          <button
                            onClick={() => {
                              if (hasSubItems) {
                                setExpandedId(isExpanded ? null : item.id);
                              } else {
                                handleNavigate(item);
                              }
                            }}
                            className={`flex-1 text-left font-cinzel text-xs font-semibold tracking-[0.14em] uppercase flex items-center gap-2 cursor-pointer ${
                              item.isHighlight ? 'text-[#9E472A] font-bold' : 'text-[#2C2420] hover:text-[#58111A]'
                            }`}
                          >
                            <span>{item.label}</span>
                            {item.badgeText && (
                              <span className="px-1.5 py-0.2 rounded bg-[#58111A] text-white text-[9px] font-bold">
                                {item.badgeText}
                              </span>
                            )}
                          </button>

                          {hasSubItems && (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              className="p-1.5 text-[#7A6F68] hover:text-[#58111A] cursor-pointer"
                              aria-label="Toggle subcategories"
                            >
                              {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                          )}
                        </div>

                        {/* Vertically Listed Sub-items */}
                        {hasSubItems && isExpanded && (
                          <div className="pl-3 pr-2 pb-2 pt-1 flex flex-col space-y-1 bg-[#F3EBE1]/50 rounded">
                            {item.items?.map((sub, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => handleNavigate(sub)}
                                className="text-left text-xs py-1.5 px-2 rounded hover:bg-white text-[#4A3E39] hover:text-[#58111A] flex items-center justify-between cursor-pointer transition-colors"
                              >
                                <span>{sub.label}</span>
                                <ChevronRight className="w-3 h-3 text-[#7A6F68]" />
                              </button>
                            ))}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Bottom Quick Action */}
              <div className="p-4 bg-[#EFE4D7] border-t border-[#DFCBB8] space-y-2">
                <button
                  onClick={() => {
                    onOpenAppointment();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 bg-[#58111A] hover:bg-[#6E1622] text-white rounded flex items-center justify-center gap-2 text-xs font-cinzel font-semibold uppercase cursor-pointer transition-colors shadow-md"
                >
                  <Calendar className="w-4 h-4 text-[#E8A57D]" />
                  <span>Book Atelier Fitting</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      )}
    </>
  );
};
