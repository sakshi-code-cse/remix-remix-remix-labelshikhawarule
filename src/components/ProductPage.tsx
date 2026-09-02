import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShoppingBag,
  Share2,
  Sparkles,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  Calendar,
  Eye,
  Scissors,
  Award,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  CheckCircle2,
  Info,
  Layers,
  Sparkle,
  Home,
  MessageCircle,
  X,
  Maximize2
} from 'lucide-react';
import { Product } from '../types';
import { IndianArchCard } from './ArchShape';
import { HorizontalScrollSection } from './common/HorizontalScrollSection';

export interface ProductPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToCollection: (slug: string) => void;
  onAddToCart: (product: Product, selectedSize: string, quantity: number, customMeasurements?: Record<string, string>) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  onSelectProduct: (product: Product) => void;
  onOpenAppointment: () => void;
  onOpenSizeGuide: () => void;
  onBuyNow?: (product: Product, selectedSize: string, quantity: number) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  allProducts,
  onBack,
  onNavigateToHome,
  onNavigateToCollection,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
  onOpenAppointment,
  onOpenSizeGuide,
  onBuyNow
}) => {
  const images = useMemo(() => {
    return [
      product.image,
      product.hoverImage || product.image,
      ...(product.images || [])
    ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);
  }, [product]);

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'craftsmanship' | 'care' | 'delivery'>('details');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [customFitOpen, setCustomFitOpen] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [customMeasurements, setCustomMeasurements] = useState({
    bust: '',
    waist: '',
    hips: '',
    height: '',
    notes: ''
  });

  const isFav = isWishlisted(product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Determine category / style slug for breadcrumbs & back links
  const categorySlug = useMemo(() => {
    if (product.category) {
      return product.category.toLowerCase().replace(/\s+/g, '-');
    }
    if (product.style) {
      return product.style.toLowerCase().replace(/\s+/g, '-');
    }
    return 'all';
  }, [product]);

  // Find index in category list for Prev/Next navigation
  const categoryProducts = useMemo(() => {
    return allProducts.filter(
      (p) =>
        (product.category && p.category === product.category) ||
        (product.style && p.style === product.style) ||
        p.gender === product.gender
    );
  }, [allProducts, product]);

  const currentIndex = useMemo(() => {
    return categoryProducts.findIndex((p) => p.id === product.id);
  }, [categoryProducts, product]);

  const prevProduct = currentIndex > 0 ? categoryProducts[currentIndex - 1] : categoryProducts[categoryProducts.length - 1];
  const nextProduct = currentIndex < categoryProducts.length - 1 ? categoryProducts[currentIndex + 1] : categoryProducts[0];

  // Scroll to top and reset image/size when product changes
  useEffect(() => {
    setSelectedImage(product.image);
    setSelectedSize(product.sizes?.[0] || 'M');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Sticky bottom action bar trigger on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setShowStickyBar(scrollPos > 420);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Explore ${product.name} at Label Shikha Warule Atelier`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity, customFitOpen ? customMeasurements : undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  // Related products from same category or style
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.style === product.style))
    .slice(0, 8);

  // Complete the look / pairing suggestions (e.g. accessories, stoles, drapes)
  const pairingProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === 'Accessories' || p.category !== product.category)
    )
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-4 sm:py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Luxury Top Navigation Bar: Breadcrumbs + Prev/Next Piece Controls (Mukti & Kavith Casa Pattern) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#DFCBB8]/70">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-[#7A6F68] font-cinzel overflow-x-auto no-scrollbar whitespace-nowrap py-1">
            <button
              onClick={onNavigateToHome}
              className="flex items-center gap-1 hover:text-[#9E472A] transition-colors font-medium cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>HOME</span>
            </button>

            <ChevronRight className="w-3 h-3 text-[#D4C3B2] shrink-0" />

            {product.gender && (
              <>
                <button
                  onClick={() => onNavigateToCollection(product.gender?.toLowerCase() === 'men' ? 'men' : 'women')}
                  className="hover:text-[#9E472A] transition-colors uppercase font-medium cursor-pointer"
                >
                  {product.gender}
                </button>
                <ChevronRight className="w-3 h-3 text-[#D4C3B2] shrink-0" />
              </>
            )}

            <button
              onClick={() => onNavigateToCollection(categorySlug)}
              className="hover:text-[#9E472A] transition-colors uppercase font-bold text-[#523A30] cursor-pointer"
            >
              {product.category || product.style || 'COLLECTIONS'}
            </button>

            <ChevronRight className="w-3 h-3 text-[#D4C3B2] shrink-0" />

            <span className="text-[#2C2420] font-bold truncate max-w-[180px] sm:max-w-[280px]">
              {product.name}
            </span>
          </nav>

          {/* Prev & Next Piece Quick Nav */}
          {categoryProducts.length > 1 && (
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs font-cinzel">
              <span className="text-[11px] text-[#7A6F68] hidden md:inline">
                {currentIndex + 1} / {categoryProducts.length} in {product.category || 'Atelier'}
              </span>

              {prevProduct && (
                <button
                  onClick={() => onSelectProduct(prevProduct)}
                  title={`Previous: ${prevProduct.name}`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#DFCBB8] bg-white text-[#523A30] hover:text-[#9E472A] hover:border-[#9E472A] transition-all cursor-pointer text-[11px] font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PREV</span>
                </button>
              )}

              {nextProduct && (
                <button
                  onClick={() => onSelectProduct(nextProduct)}
                  title={`Next: ${nextProduct.name}`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#DFCBB8] bg-white text-[#523A30] hover:text-[#9E472A] hover:border-[#9E472A] transition-all cursor-pointer text-[11px] font-semibold"
                >
                  <span className="hidden sm:inline">NEXT</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Image Gallery (Thumbnails + Signature Mughal Arch Showcase) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[620px] pb-2 sm:pb-0 scrollbar-none shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-22 sm:w-20 sm:h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 bg-[#F0EBE1] cursor-pointer ${
                      selectedImage === img
                        ? 'border-[#9E472A] shadow-md scale-102 ring-2 ring-[#9E472A]/20'
                        : 'border-[#DFCBB8]/70 opacity-75 hover:opacity-100 hover:border-[#9E472A]/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} preview ${idx + 1}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Showcase Image (Signature Mughal Arch) */}
            <div className="relative flex-1 w-full max-w-[520px] mx-auto group">
              <IndianArchCard
                id={`product-page-${product.id}`}
                image={selectedImage}
                alt={product.name}
                aspectRatio="aspect-[3/4]"
                borderColor="#9E472A"
                strokeWidth={2}
                showDoubleBorder={true}
              >
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                  {product.isNew && (
                    <span className="bg-[#9E472A] text-white text-[11px] font-medium tracking-[0.14em] px-3 py-1 uppercase rounded-md shadow-sm">
                      New In
                    </span>
                  )}
                  {product.isBestSeller && !product.isNew && (
                    <span className="bg-[#2C2420] text-[#F8F4EC] text-[11px] font-medium tracking-[0.14em] px-3 py-1 uppercase rounded-md shadow-sm">
                      Bestseller
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-[#B58A3A] text-white text-[11px] font-semibold tracking-wider px-2.5 py-1 uppercase rounded-md shadow-sm">
                      {discountPercent}% Off
                    </span>
                  )}
                </div>

                {/* Floating Action Buttons: Wishlist & Share & Fullscreen Zoom */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer ${
                      isFav
                        ? 'bg-[#9E472A] text-white scale-105'
                        : 'bg-white/90 text-[#2C2420] hover:bg-white hover:text-[#9E472A]'
                    }`}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isFav ? 'currentColor' : 'none'}
                      strokeWidth={isFav ? 0 : 1.8}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share product"
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-white/90 text-[#2C2420] hover:bg-white hover:text-[#9E472A] backdrop-blur-md shadow-md transition-all duration-300 cursor-pointer"
                    title="Share this piece"
                  >
                    {copiedLink ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-4.5 h-4.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsZoomModalOpen(true)}
                    aria-label="Zoom image"
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-white/90 text-[#2C2420] hover:bg-white hover:text-[#9E472A] backdrop-blur-md shadow-md transition-all duration-300 cursor-pointer"
                    title="Inspect embroidery details"
                  >
                    <Maximize2 className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Zoom Callout Hint */}
                <div
                  onClick={() => setIsZoomModalOpen(true)}
                  className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-sans flex items-center gap-1.5 opacity-90 hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to Zoom Karigari Details</span>
                </div>
              </IndianArchCard>
            </div>
          </div>

          {/* RIGHT: Product Meta & Purchase Controls */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Title & Category Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <button
                  onClick={() => onNavigateToCollection(categorySlug)}
                  className="text-xs font-bold tracking-[0.2em] uppercase text-[#9E472A] font-cinzel hover:underline cursor-pointer"
                >
                  {product.category || product.style || 'Heritage Couture'}
                </button>
                <span className="text-[11px] text-[#7A6F68] font-mono">
                  SKU: {product.id.toUpperCase()}
                </span>
              </div>

              <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#2C2420] leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Price & Guarantee Row */}
              <div className="mt-4 flex items-baseline gap-3 pt-3 border-t border-[#EAE0D2]">
                <span className="text-2xl sm:text-3xl font-bold text-[#2C2420] font-sans">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base sm:text-lg text-[#8C827A] line-through font-sans">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-[#2D6A4F] font-semibold font-sans bg-[#E8F3EE] px-2 py-0.5 rounded">
                  All Taxes Included
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm sm:text-[15px] text-[#5C524B] leading-relaxed">
              {product.description || 'Exquisitely hand-tailored ensemble cut from pure heritage mulberry silk and embellished with intricate bullion zari threadwork.'}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2C2420] font-sans">
                    Select Size: <strong className="text-[#9E472A]">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="text-xs text-[#9E472A] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`h-11 rounded-lg font-cinzel font-semibold text-xs transition-all duration-200 cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#2C2420] text-white shadow-md border-2 border-[#2C2420]'
                          : 'bg-white text-[#2C2420] border border-[#DFCBB8] hover:border-[#9E472A] hover:text-[#9E472A]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Made-to-Measure Accordion Toggle */}
            <div className="bg-[#FAF4EA] border border-[#E7DEC8] rounded-xl p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-[#9E472A]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2C2420]">
                    Complimentary Custom Made-to-Measure Fitting
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomFitOpen(!customFitOpen)}
                  className="text-xs text-[#9E472A] font-semibold hover:underline cursor-pointer"
                >
                  {customFitOpen ? 'Use Standard Size' : '+ Add Measurements'}
                </button>
              </div>

              {customFitOpen && (
                <div className="mt-3 pt-3 border-t border-[#E7DEC8] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-[#7A6F68] font-medium mb-1">Chest / Bust (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 38"
                      value={customMeasurements.bust}
                      onChange={(e) => setCustomMeasurements({ ...customMeasurements, bust: e.target.value })}
                      className="w-full h-8 px-2 bg-white rounded border border-[#DFCBB8] text-xs focus:outline-[#9E472A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#7A6F68] font-medium mb-1">Waist (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 32"
                      value={customMeasurements.waist}
                      onChange={(e) => setCustomMeasurements({ ...customMeasurements, waist: e.target.value })}
                      className="w-full h-8 px-2 bg-white rounded border border-[#DFCBB8] text-xs focus:outline-[#9E472A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#7A6F68] font-medium mb-1">Hips / Seat (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 40"
                      value={customMeasurements.hips}
                      onChange={(e) => setCustomMeasurements({ ...customMeasurements, hips: e.target.value })}
                      className="w-full h-8 px-2 bg-white rounded border border-[#DFCBB8] text-xs focus:outline-[#9E472A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#7A6F68] font-medium mb-1">Height (ft/in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 5ft 10in"
                      value={customMeasurements.height}
                      onChange={(e) => setCustomMeasurements({ ...customMeasurements, height: e.target.value })}
                      className="w-full h-8 px-2 bg-white rounded border border-[#DFCBB8] text-xs focus:outline-[#9E472A]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#DFCBB8] bg-white rounded-xl h-12 px-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-[#7A6F68] hover:text-[#2C2420] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm text-[#2C2420]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-[#7A6F68] hover:text-[#2C2420] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-cinzel font-bold tracking-[0.14em] uppercase transition-all duration-300 shadow-md cursor-pointer ${
                    isAdded
                      ? 'bg-[#2D6A4F] text-white'
                      : 'bg-[#9E472A] hover:bg-[#85371D] text-white hover:shadow-lg'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Added to Shopping Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add To Shopping Bag</span>
                    </>
                  )}
                </button>
              </div>

              {/* Secondary CTA: Book Flagship Trial & Buy Now */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onOpenAppointment}
                  className="h-11 rounded-xl border border-[#2C2420] text-[#2C2420] hover:bg-[#2C2420] hover:text-white text-xs font-cinzel font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Fitting</span>
                </button>

                {onBuyNow && (
                  <button
                    type="button"
                    onClick={() => onBuyNow(product, selectedSize, quantity)}
                    className="h-11 rounded-xl bg-[#2C2420] hover:bg-[#1A1412] text-white text-xs font-cinzel font-semibold tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B58A3A]" />
                    <span>Instant Buy Now</span>
                  </button>
                )}
              </div>
            </div>

            {/* Value Props & Assurance Badges */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#EAE0D2] text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-[#9E472A] mb-1" />
                <span className="text-[11px] font-semibold text-[#2C2420]">100% Authentic</span>
                <span className="text-[9px] text-[#7A6F68]">Pure mulberry silk</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-[#9E472A] mb-1" />
                <span className="text-[11px] font-semibold text-[#2C2420]">Worldwide Express</span>
                <span className="text-[9px] text-[#7A6F68]">Insured courier</span>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-5 h-5 text-[#9E472A] mb-1" />
                <span className="text-[11px] font-semibold text-[#2C2420]">Artisan Crafted</span>
                <span className="text-[9px] text-[#7A6F68]">180+ craft hours</span>
              </div>
            </div>

            {/* Detailed Tabs: Details, Craftsmanship, Care, Delivery */}
            <div className="pt-2">
              <div className="flex border-b border-[#DFCBB8] gap-6 text-xs font-cinzel font-semibold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === 'details' ? 'text-[#9E472A]' : 'text-[#7A6F68] hover:text-[#2C2420]'
                  }`}
                >
                  <span>Piece Details</span>
                  {activeTab === 'details' && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#9E472A]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('craftsmanship')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === 'craftsmanship' ? 'text-[#9E472A]' : 'text-[#7A6F68] hover:text-[#2C2420]'
                  }`}
                >
                  <span>Artisan Craft</span>
                  {activeTab === 'craftsmanship' && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#9E472A]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('care')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === 'care' ? 'text-[#9E472A]' : 'text-[#7A6F68] hover:text-[#2C2420]'
                  }`}
                >
                  <span>Wash & Care</span>
                  {activeTab === 'care' && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#9E472A]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('delivery')}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === 'delivery' ? 'text-[#9E472A]' : 'text-[#7A6F68] hover:text-[#2C2420]'
                  }`}
                >
                  <span>Shipping</span>
                  {activeTab === 'delivery' && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#9E472A]" />
                  )}
                </button>
              </div>

              <div className="py-4 text-xs sm:text-sm text-[#5C524B] leading-relaxed">
                {activeTab === 'details' && (
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Fabric: 100% Pure Mulberry Raw Silk & Metallic Organza Tissue.</li>
                    <li>Embroidery: Genuine Bullion Zari wire, pearl drops, and handcrafted sequins.</li>
                    <li>Lining: Soft breathable modal cotton inner layer for comfort.</li>
                    <li>Closure: Concealed side zipper with handcrafted fabric potli buttons.</li>
                  </ul>
                )}
                {activeTab === 'craftsmanship' && (
                  <p>
                    Every piece is crafted in our bespoke Lucknow & Varanasi ateliers. Hand-drawn motifs are transferred to wooden embroidery addas where 3rd-generation master karigars spend 120–180 needle hours hand-stitching each floral motif.
                  </p>
                )}
                {activeTab === 'care' && (
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Strictly Dry Clean Only at a certified luxury garment specialist.</li>
                    <li>Store wrapped in unbleached muslin cotton cloth away from direct sunlight.</li>
                    <li>Do not spray perfume directly on metallic zari or bullion embroidery.</li>
                  </ul>
                )}
                {activeTab === 'delivery' && (
                  <p>
                    Standard orders dispatch within 48–72 hours with worldwide express tracking. Made-to-measure custom fit orders take 10–14 business days for custom stitching and quality inspection.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* COMPLETE THE LOOK / PAIRING SUGGESTIONS */}
        {pairingProducts.length > 0 && (
          <section className="mt-16 sm:mt-20 pt-10 border-t border-[#DFCBB8]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-cinzel text-[#9E472A] tracking-widest uppercase font-semibold">
                  Atelier Styling Edit
                </span>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#2C2420]">
                  COMPLETE THE ENSEMBLE
                </h2>
              </div>
              <button
                onClick={() => onNavigateToCollection('accessories')}
                className="text-xs font-cinzel text-[#9E472A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Accessories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <HorizontalScrollSection
              id="product-pairing-track"
              ariaLabel="Complete the look styling accessories"
              gap="gap-4 sm:gap-6"
              padding="px-1"
              showArrows={true}
              showProgressBar={true}
            >
              {pairingProducts.map((pair) => (
                <div
                  key={pair.id}
                  onClick={() => onSelectProduct(pair)}
                  className="group flex flex-col items-center flex-none w-[65vw] sm:w-[42vw] md:w-[28vw] lg:w-[calc((100%-3*24px)/4)] snap-start cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="w-full mb-3">
                    <IndianArchCard
                      id={`pair-item-${pair.id}`}
                      image={pair.image}
                      alt={pair.name}
                      aspectRatio="aspect-[3/4]"
                      borderColor="#9E472A"
                      strokeWidth={1.8}
                      showDoubleBorder={true}
                    />
                  </div>

                  <span className="font-cinzel text-xs sm:text-sm font-bold tracking-wider text-[#2C2420] group-hover:text-[#9E472A] transition-colors text-center line-clamp-1">
                    {pair.name}
                  </span>
                  <span className="text-xs font-sans font-semibold text-[#523A30] mt-1">
                    ₹{pair.price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </HorizontalScrollSection>
          </section>
        )}

        {/* RELATED PIECES SECTION (MORE FROM THIS SILHOUETTE) */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-10 border-t border-[#DFCBB8]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-cinzel text-[#9E472A] tracking-widest uppercase font-semibold">
                  From {product.category || product.style || 'Our Atelier'}
                </span>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#2C2420] uppercase tracking-wider">
                  You May Also Admire
                </h2>
              </div>
              <button
                onClick={() => onNavigateToCollection(categorySlug)}
                className="text-xs font-cinzel text-[#9E472A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All {product.category || 'Pieces'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Scroll Carousel for Related Products */}
            <HorizontalScrollSection
              id="product-related-pieces-track"
              ariaLabel="Related pieces you may admire"
              gap="gap-4 sm:gap-6"
              padding="px-1"
              showArrows={true}
              showProgressBar={true}
            >
              {relatedProducts.map((relProduct) => {
                const relFav = isWishlisted(relProduct.id);
                return (
                  <div
                    key={relProduct.id}
                    onClick={() => onSelectProduct(relProduct)}
                    className="group flex flex-col items-center flex-none w-[68vw] sm:w-[44vw] md:w-[30vw] lg:w-[calc((100%-3*24px)/4)] snap-start cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
                  >
                    <div className="w-full mb-3 relative">
                      <IndianArchCard
                        id={`rel-product-${relProduct.id}`}
                        image={relProduct.image}
                        alt={relProduct.name}
                        aspectRatio="aspect-[3/4]"
                        borderColor="#9E472A"
                        strokeWidth={1.8}
                        showDoubleBorder={true}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(relProduct);
                          }}
                          aria-label="Wishlist"
                          className={`absolute top-2.5 right-2.5 p-2 rounded-full z-20 backdrop-blur-md transition-colors ${
                            relFav ? 'bg-[#9E472A] text-white shadow-md' : 'bg-white/80 text-[#2C2420] hover:bg-white hover:text-[#9E472A]'
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5" fill={relFav ? 'currentColor' : 'none'} />
                        </button>
                      </IndianArchCard>
                    </div>

                    <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#9E472A] mb-0.5 font-cinzel">
                      {relProduct.category || relProduct.style}
                    </p>
                    <h3 className="font-cinzel text-xs sm:text-sm font-semibold text-[#2C2420] line-clamp-1 group-hover:text-[#9E472A] transition-colors text-center">
                      {relProduct.name}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-sans font-semibold text-xs sm:text-sm text-[#2C2420]">
                        ₹{relProduct.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </HorizontalScrollSection>
          </section>
        )}

      </div>

      {/* STICKY BOTTOM ACTION BAR (Appears on scroll for effortless mobile & desktop purchasing) */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DFCBB8] py-2.5 px-4 shadow-2xl transition-all duration-300 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left: Product mini info */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-12 rounded object-cover border border-[#DFCBB8] shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-cinzel text-xs font-bold text-[#2C2420] truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#9E472A] font-sans">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#7A6F68] font-cinzel">
                    Size: {selectedSize}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick actions */}
            <div className="flex items-center gap-2 shrink-0">
              {product.sizes && product.sizes.length > 0 && (
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="h-10 px-2 bg-[#F5EFEB] border border-[#DFCBB8] rounded-lg text-xs font-cinzel font-semibold text-[#2C2420] cursor-pointer"
                >
                  {product.sizes.map((sz) => (
                    <option key={sz} value={sz}>
                      Size {sz}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                className="h-10 px-4 sm:px-6 rounded-lg bg-[#9E472A] hover:bg-[#85371D] text-white text-xs font-cinzel font-bold tracking-wider uppercase transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isAdded ? 'Added!' : 'Add to Bag'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN HIGH-RES ZOOM LIGHTBOX MODAL */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6" role="dialog">
          {/* Header */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/20">
            <div>
              <h3 className="font-cinzel text-sm sm:text-base font-bold">
                {product.name} • Karigari Close-Up Inspection
              </h3>
              <p className="text-[11px] text-white/70 font-sans">
                Pure silk weave & master bullion embroidery details
              </p>
            </div>
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image View */}
          <div className="flex-1 flex items-center justify-center py-4 overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-14 h-18 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === img ? 'border-[#9E472A] scale-105' : 'border-white/30 opacity-60'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

