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
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  MessageSquareHeart, 
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CustomerUser, LogoCMSContent } from '../types';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAppointment: () => void;
  onSelectCategory: (category: string) => void;
  onNavigateCollection?: (collectionSlug: string) => void;
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

interface NavMenuItem {
  id: string;
  label: string;
  filter?: string;
  type?: string;
  collectionSlug?: string;
  subcategories?: { label: string; filter?: string; type?: string; collectionSlug?: string }[];
  featuredImage?: string;
  featuredTitle?: string;
  isScroll?: boolean;
  scrollTarget?: string;
  action?: string;
  isSpecial?: boolean;
  isHighlight?: boolean;
  badgeText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAppointment,
  onSelectCategory,
  onNavigateCollection,
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

  const navMenuItems: NavMenuItem[] = [
    {
      id: 'women',
      label: 'WOMEN',
      filter: 'Women',
      type: 'gender',
      subcategories: [
        { label: 'All Women Pieces', filter: 'Women', type: 'gender' },
        { label: 'Handcrafted Kurtas', filter: 'Kurtas', type: 'category' },
        { label: 'Heritage Sarees', filter: 'Sarees', type: 'category' },
        { label: 'Silk Dresses & Tunics', filter: 'Dresses', type: 'category' },
        { label: 'Coordinated Sets', filter: 'Sets', type: 'category' },
        { label: 'Brocade Dupattas', filter: 'Dupattas', type: 'category' },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Festive Chanderi Collection',
    },
    {
      id: 'men',
      label: 'MEN',
      filter: 'Men',
      type: 'gender',
      subcategories: [
        { label: 'All Men Pieces', filter: 'Men', type: 'gender' },
        { label: 'Handspun Khadi Kurtas', filter: 'Kurtas', type: 'category' },
        { label: 'Artisanal Silk Bandhgalas', filter: 'Bandhgala', type: 'category' },
        { label: 'Belgian Linen Shirts', filter: 'Shirts', type: 'category' },
        { label: 'Royal Festive Sherwanis', filter: 'Sherwanis', type: 'category' },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Handloom Linen & Mulberry Silk',
    },
    {
      id: 'kids',
      label: 'KIDS',
      filter: 'Kids',
      type: 'gender',
      subcategories: [
        { label: 'All Kids Wear', filter: 'Kids', type: 'gender' },
        { label: 'Organic Cotton Pinafores', filter: 'Kids', type: 'category' },
        { label: 'Mini Festive Sets', filter: 'Sets', type: 'category' },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Hypoallergenic Organic Cotton',
    },
    {
      id: 'accessories',
      label: 'ACCESSORIES',
      filter: 'Accessories',
      type: 'category',
      subcategories: [
        { label: 'Artisan Saddle Bags', filter: 'Accessories', type: 'category' },
        { label: 'Handwoven Tissue Dupattas', filter: 'Dupattas', type: 'category' },
        { label: 'Handcrafted Stoles', filter: 'Accessories', type: 'category' },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Full Grain & Brass Details',
    },
    {
      id: 'ready-to-wear',
      label: 'READY TO WEAR',
      filter: 'Everyday',
      type: 'style',
    },
    {
      id: 'shop-by-style',
      label: 'SHOP BY STYLE',
      filter: 'Style',
      isScroll: true,
      scrollTarget: 'shop-by-style-section',
      subcategories: [
        { label: 'Heritage Ethnic Weaves', filter: 'Ethnic', type: 'style' },
        { label: 'Timeless Classic Cuts', filter: 'Classic', type: 'style' },
        { label: 'Festive Zardozi Splendour', filter: 'Festive', type: 'style' },
        { label: 'Everyday Relaxed Grace', filter: 'Everyday', type: 'style' },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
      featuredTitle: 'Silhouettes for Every Moment',
    },
  ];

  const handleMenuClick = (item: any) => {
    setActiveDropdown(null);
    if (item.action === 'appointment') {
      onOpenAppointment();
    } else if (item.collectionSlug && onNavigateCollection) {
      onNavigateCollection(item.collectionSlug);
    } else if (item.isScroll && item.scrollTarget) {
      const el = document.getElementById(item.scrollTarget);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.filter) {
      onSelectCategory(item.filter);
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full bg-[#FAF6F0]/98 backdrop-blur-md shadow-xs border-b border-[#EADDCF]/70 transition-all">
      
      {/* 1. Top Announcement Marquee / Features Bar */}
      <div id="top-announcement-bar" className="bg-[#58111A] text-[#FDF8F3] text-xs py-2.5 px-3 sm:px-6 border-b border-[#420B13] shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F3D7C5] shrink-0" />
            <span className="font-cinzel font-semibold text-xs sm:text-sm tracking-[0.2em] text-[#FAF6F0] uppercase">
              {announcementText || 'WELCOME TO OUR STORE!'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#F3D7C5] shrink-0 hidden sm:block" />
          </div>
        </div>
      </div>

      {/* 2. Primary Tier: Centered Brand Logo & Quick Utility Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-[#EADDCF]/40">
        
        {/* Left Utility: Mobile Menu Trigger + Search Bar */}
        <div className="flex items-center gap-3 sm:gap-4 lg:w-1/3">
          <button
            id="mobile-menu-toggle-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#2C2420] hover:text-[#9E472A] hover:bg-[#F3EBE1] rounded-lg transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Search Button / Bar */}
          <button
            id="header-search-bar-trigger"
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 bg-[#F3EBE1]/70 hover:bg-[#EADDCF]/70 text-[#7A6F68] hover:text-[#2C2420] rounded-full border border-[#DFCBB8]/80 text-xs transition-all w-48 xl:w-64 cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#9E472A]" />
            <span className="truncate">Search kurtas, sarees, silks...</span>
          </button>

          {/* Mobile Search Icon */}
          <button
            id="header-mobile-search-btn"
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-[#2C2420] hover:text-[#9E472A] rounded-full hover:bg-[#F3EBE1]"
            aria-label="Search collection"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Brand Logo (Prominently Centered Above Menu) */}
        <div 
          id="header-logo-container" 
          className="flex-1 flex justify-center text-center lg:w-1/3 transition-all"
        >
          <BrandLogo 
            size="md" 
            logoCMS={logoCMS}
            onClick={() => {
              onSelectCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        </div>

        {/* Right Utility: Client Account, Wishlist, Admin Portal, Shopping Bag */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 lg:w-1/3 text-[#2C2420]">
          
          {/* Bespoke Consultation Quick Pill (Desktop) - Royal Maroon & White Text */}
          <button
            onClick={onOpenAppointment}
            className="hidden xl:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#52131D] hover:bg-[#681926] text-white border border-[#7A1C2B] text-xs font-cinzel font-semibold transition-all duration-200 cursor-pointer mr-1 shadow-sm hover:shadow-md hover:scale-[1.02]"
          >
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-cinzel font-semibold tracking-wide">Book Visit</span>
          </button>

          {/* Customer User Account / Sign In */}
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
                  className="w-5 h-5 rounded-full object-cover border border-[#9E472A]"
                />
              ) : (
                <User className="w-4 h-4 text-[#9E472A]" />
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
              className="p-2 hover:text-[#9E472A] hover:bg-[#F3EBE1] rounded-full transition-colors cursor-pointer relative group"
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
            className="p-2 hover:text-[#9E472A] hover:bg-[#F3EBE1] rounded-full transition-colors cursor-pointer relative"
          >
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#9E472A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            id="header-cart-button"
            onClick={onOpenCart}
            aria-label="View shopping bag"
            className="p-2 hover:text-[#9E472A] hover:bg-[#F3EBE1] rounded-full transition-colors cursor-pointer relative"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#9E472A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* 3. LOGO KE NICHE MENU ITEMS (Dedicated Horizontal Navigation Below Logo - Royal Maroon) */}
      <div id="header-menu-below-logo" className="hidden lg:block bg-[#58111A] border-t border-b border-[#420B13] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-6 xl:gap-8 py-2 relative">
            {navMenuItems.map((item) => {
              const isItemActive = 
                (item.type === 'gender' && activeGenderFilter === item.filter) ||
                (item.type === 'category' && activeCategoryFilter === item.filter) ||
                (item.type === 'style' && activeStyleFilter === item.filter);

              const hasSubcategories = Boolean(item.subcategories && item.subcategories.length > 0);

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => hasSubcategories && handleMouseEnter(item.id)}
                  onMouseLeave={hasSubcategories ? handleMouseLeave : undefined}
                  className="relative group"
                >
                  <button
                    id={`nav-menu-item-${item.id}`}
                    onClick={() => handleMenuClick(item)}
                    className={`font-cinzel text-xs font-semibold tracking-[0.16em] uppercase py-2 px-2.5 rounded-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer relative ${
                      item.isHighlight
                        ? 'text-[#F5C7A9] font-bold bg-[#6E1622]'
                        : item.isSpecial
                        ? 'text-[#F3D7C5] hover:text-white hover:bg-[#6E1622]/80'
                        : isItemActive
                        ? 'text-[#F5C7A9] bg-[#430B13] font-bold'
                        : 'text-[#FAF6F0] hover:text-[#F5C7A9] hover:bg-[#6E1622]/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    
                    {hasSubcategories && (
                      <ChevronDown className="w-3.5 h-3.5 text-[#F3D7C5]/70 group-hover:rotate-180 group-hover:text-white transition-all duration-200" />
                    )}

                    {item.badgeText && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#9E472A] text-white text-[9px] font-bold tracking-wider animate-pulse">
                        {item.badgeText}
                      </span>
                    )}

                    {/* Active Underline */}
                    {isItemActive && (
                      <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#E08A68] rounded-full" />
                    )}
                  </button>

                  {/* Mega Dropdown Menu below item */}
                  {hasSubcategories && activeDropdown === item.id && (
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-72 bg-white rounded-xl shadow-2xl border border-[#DFCBB8] overflow-hidden p-4 animate-in fade-in slide-in-from-top-2 duration-200 text-left"
                    >
                      {item.featuredImage && (
                        <div className="relative h-24 rounded-lg overflow-hidden mb-3 border border-[#DFCBB8]">
                          <img
                            src={item.featuredImage}
                            alt={item.label}
                            className="w-full h-full object-cover brightness-95"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                            <span className="font-cinzel text-xs font-semibold text-white tracking-wider">
                              {item.featuredTitle}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        {item.subcategories?.map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveDropdown(null);
                              if (sub.collectionSlug && onNavigateCollection) {
                                onNavigateCollection(sub.collectionSlug);
                              } else if (sub.filter) {
                                onSelectCategory(sub.filter);
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#2C2420] hover:text-[#58111A] hover:bg-[#FAF6F0] flex items-center justify-between transition-colors group/sub cursor-pointer"
                          >
                            <span>{sub.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/sub:opacity-100 text-[#58111A] transition-opacity" />
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#F0E6D8] flex items-center justify-between text-[11px] text-[#7A6F68]">
                        <span>Handcrafted in India</span>
                        <span className="font-semibold text-[#58111A]">100% Pure Silk</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. Mobile Navigation Drawer (Below Logo for Small Screens) */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden bg-[#FAF6F0] border-t border-[#EADDCF] px-4 pt-3 pb-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
          
          <div className="pb-2 border-b border-[#EADDCF]/70">
            <span className="text-[10px] font-cinzel font-bold tracking-widest uppercase text-[#7A6F68] block mb-2">
              Explore Collections
            </span>
            <div className="grid grid-cols-2 gap-2">
              {navMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleMenuClick(item);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left font-cinzel text-xs py-2.5 px-3 rounded-md font-semibold transition-colors flex items-center justify-between ${
                    item.isHighlight
                      ? 'bg-[#9E472A]/10 text-[#9E472A] border border-[#9E472A]/30'
                      : 'bg-white text-[#2C2420] hover:text-[#9E472A] border border-[#DFCBB8]/70'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badgeText && (
                    <span className="text-[9px] bg-[#9E472A] text-white px-1.5 py-0.5 rounded font-bold">
                      Sale
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Account & Appointment Quick Actions */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              id="mobile-customer-account-btn"
              onClick={() => {
                if (currentUser && onOpenCustomerAccount) {
                  onOpenCustomerAccount();
                } else if (onOpenCustomerLogin) {
                  onOpenCustomerLogin();
                }
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3.5 bg-[#F3EBE1] border border-[#DFCBB8] rounded-lg flex items-center justify-between text-xs font-cinzel font-semibold text-[#2C2420]"
            >
              <div className="flex items-center gap-2">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#9E472A]"
                  />
                ) : (
                  <User className="w-4 h-4 text-[#9E472A]" />
                )}
                <span>
                  {currentUser ? `My Account (${currentUser.name})` : 'Client Sign In / Register'}
                </span>
              </div>
              {currentUser ? (
                <span className="text-[10px] bg-[#9E472A] text-white px-2 py-0.5 rounded font-bold">
                  {currentUser.couturePoints} pts
                </span>
              ) : (
                <span className="text-[10px] text-[#9E472A] font-bold uppercase">
                  Join Circle
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onOpenAppointment();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3.5 bg-[#52131D] hover:bg-[#681926] text-white border border-[#7A1C2B] rounded-lg flex items-center justify-between text-xs font-cinzel font-semibold shadow-md transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2 text-white font-cinzel font-semibold">
                <Calendar className="w-4 h-4 text-white" /> Book Atelier Visit
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>
      )}

    </header>
  );
};
