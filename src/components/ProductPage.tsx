import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
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
  Plus,
  Minus,
  CheckCircle2,
  Info,
  Layers,
  Sparkle
} from 'lucide-react';
import { Product } from '../types';

export interface ProductPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
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
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
  onOpenAppointment,
  onOpenSizeGuide,
  onBuyNow
}) => {
  const images = [
    product.image,
    product.hoverImage || product.image,
    ...(product.images || [])
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'craftsmanship' | 'care' | 'delivery'>('details');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [customFitOpen, setCustomFitOpen] = useState(false);
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

  // Scroll to top when product changes
  useEffect(() => {
    setSelectedImage(product.image);
    setSelectedSize(product.sizes?.[0] || 'M');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Explore ${product.name} at Maison Couture`,
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
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Related products from same category or style
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.style === product.style))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#7A6F68] mb-6 sm:mb-8 font-sans overflow-x-auto whitespace-nowrap py-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 hover:text-[#9E472A] transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </button>
          <ChevronRight className="w-3 h-3 text-[#D4C3B2]" />
          <span className="capitalize">{product.gender || 'Couture'}</span>
          <ChevronRight className="w-3 h-3 text-[#D4C3B2]" />
          <span>{product.category || product.style || 'Ensembles'}</span>
          <ChevronRight className="w-3 h-3 text-[#D4C3B2]" />
          <span className="text-[#2C2420] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Product Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Image Gallery (Thumbnails + Main Showcase) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] pb-2 sm:pb-0 scrollbar-none shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-26 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 bg-[#F0EBE1] cursor-pointer ${
                      selectedImage === img
                        ? 'border-[#9E472A] shadow-md scale-102 ring-2 ring-[#9E472A]/20'
                        : 'border-[#DFCBB8]/70 opacity-70 hover:opacity-100 hover:border-[#9E472A]/50'
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

            {/* Main Showcase Image (Rectangular 3:4) */}
            <div className="relative flex-1 aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F0EBE1] border border-[#E4D7C8] shadow-lg group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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

              {/* Floating Action Buttons: Wishlist & Share */}
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
              </div>

              {/* Zoom Callout Hint */}
              <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-[11px] font-sans flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3.5 h-3.5" />
                <span>Handcrafted Artisan Details</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Meta & Purchase Controls */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Title & Category Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#9E472A] font-sans">
                  {product.category || product.style || 'Heritage Couture'}
                </span>
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
                  Taxes Included
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
                    Complimentary Custom Fitting
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomFitOpen(!customFitOpen)}
                  className="text-xs text-[#9E472A] font-semibold hover:underline cursor-pointer"
                >
                  {customFitOpen ? 'Standard Size' : '+ Add Measurements'}
                </button>
              </div>

              {customFitOpen && (
                <div className="mt-3 pt-3 border-t border-[#E7DEC8] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-[#7A6F68] font-medium mb-1">Bust (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 36"
                      value={customMeasurements.bust}
                      onChange={(e) => setCustomMeasurements({ ...customMeasurements, bust: e.target.value })}
                      className="w-full h-8 px-2 bg-white rounded border border-[#DFCBB8] text-xs focus:outline-[#9E472A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#7A6F68] font-medium mb-1">Waist (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 30"
                      value={customMeasurements.waist}
                      onChange={(e) => setCustomMeasurements({ ...customMeasurements, waist: e.target.value })}
                      className="w-full h-8 px-2 bg-white rounded border border-[#DFCBB8] text-xs focus:outline-[#9E472A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#7A6F68] font-medium mb-1">Hips (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 40"
                      value={customMeasurements.hips}
                      onChange={(e) => setCustomMeasurements({ ...customMeasurements, hips: e.target.value })}
                      className="w-full h-8 px-2 bg-white rounded border border-[#DFCBB8] text-xs focus:outline-[#9E472A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#7A6F68] font-medium mb-1">Height</label>
                    <input
                      type="text"
                      placeholder="e.g. 5ft 6in"
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
                      <span>Added to Bag!</span>
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

        {/* RELATED PIECES SECTION */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 border-t border-[#DFCBB8]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#2C2420] uppercase tracking-wider">
                  You May Also Admire
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6F68] mt-1 font-sans">
                  Curated ensembles matching this craftsmanship palette
                </p>
              </div>
            </div>

            {/* Grid of Related Pieces in Rectangular Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => {
                const relFav = isWishlisted(relProduct.id);
                return (
                  <article
                    key={relProduct.id}
                    onClick={() => onSelectProduct(relProduct)}
                    className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#E4D7C8] hover:border-[#9E472A]/60 transition-all duration-500 hover:shadow-lg cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F0EBE1]">
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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
                    </div>

                    <div className="p-3.5 flex flex-col flex-1 justify-between">
                      <div>
                        <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#9E472A] mb-1 font-sans">
                          {relProduct.category || relProduct.style}
                        </p>
                        <h3 className="font-cinzel text-xs sm:text-sm font-semibold text-[#2C2420] line-clamp-1 group-hover:text-[#9E472A] transition-colors">
                          {relProduct.name}
                        </h3>
                      </div>
                      <div className="mt-2 pt-2 border-t border-[#F0EAE1] flex items-baseline justify-between">
                        <span className="font-sans font-semibold text-xs sm:text-sm text-[#2C2420]">
                          ₹{relProduct.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#B58A3A] font-medium uppercase font-sans">
                          Bespoke Fit
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProductPage;
