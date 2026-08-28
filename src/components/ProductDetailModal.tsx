import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Ruler, Sparkles, Check, Truck, RotateCcw, Award } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: string, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onOpenSizeGuide: () => void;
  onOpenAppointment: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenSizeGuide,
  onOpenAppointment,
}) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'artisan'>('details');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.image);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const images = [product.image, product.hoverImage || product.image];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        />

        {/* Modal Window */}
        <div className="relative inline-block w-full max-w-4xl p-0 my-8 overflow-hidden text-left align-middle bg-[#FAF6F0] rounded-2xl shadow-2xl transform transition-all border border-[#DFCBB8]">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close product modal"
            className="absolute top-4 right-4 z-20 p-2 text-[#2C2420] hover:text-[#9E472A] bg-white/80 hover:bg-white rounded-full shadow-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Left: Gallery & Zoom Preview */}
            <div className="md:col-span-6 bg-[#EFE5D8] p-4 sm:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#DFCBB8]">
              {/* Main Image with Clean Rectangular Frame */}
              <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-xl overflow-hidden bg-[#F0EBE1] border border-[#DFCBB8] shadow-md">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />

                {product.tags && product.tags.length > 0 && (
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
                    {product.tags.map((t) => (
                      <span key={t} className="bg-[#9E472A] text-white text-[10px] font-cinzel font-semibold px-2.5 py-1 tracking-wider uppercase rounded-xs shadow-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Selector */}
              <div className="flex items-center gap-3 mt-4 w-full justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                      selectedImage === img ? 'border-[#9E472A] scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Meta, Sizing, Add to Bag */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Category & Style */}
                <div className="flex items-center justify-between text-xs font-cinzel tracking-widest text-[#9E472A]">
                  <span>{product.gender.toUpperCase()} • {product.style.toUpperCase()} COLLECTION</span>
                  <div className="flex items-center gap-1 text-[#C29342]">
                    <Star className="w-3.5 h-3.5 fill-[#C29342] stroke-none" />
                    <span className="font-bold text-[#2C2420]">{product.rating}</span>
                    <span className="text-[#8C7E74]">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#2C2420] tracking-tight leading-snug">
                  {product.name}
                </h2>

                {/* Pricing */}
                <div className="flex items-baseline gap-3">
                  <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2420]">
                    ₹ {product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="font-serif-luxury text-lg text-[#8C7E74] line-through">
                      ₹ {product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-[11px] text-[#2D6A4F] font-semibold bg-[#EAF5EC] px-2 py-0.5 rounded">
                    Inclusive of all taxes
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#685C54] leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-xs font-bold text-[#2C2420] tracking-wider uppercase">
                      Select Size
                    </span>
                    <button
                      onClick={onOpenSizeGuide}
                      className="inline-flex items-center gap-1 text-[11px] text-[#9E472A] hover:underline font-medium"
                    >
                      <Ruler className="w-3 h-3" />
                      Size Guide & Measurements
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-2 text-xs font-cinzel font-semibold rounded-xs border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#9E472A] text-white border-[#9E472A] shadow-xs'
                            : 'bg-white text-[#2C2420] border-[#DFCBB8] hover:border-[#9E472A]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {selectedSize === 'Custom Fit' && (
                    <div className="mt-2 p-2.5 bg-[#F3E8DB] rounded text-[11px] text-[#7A3119] flex items-center justify-between">
                      <span>Our master tailor will contact you via WhatsApp for custom measurements.</span>
                      <button onClick={onOpenAppointment} className="underline font-bold">Book Slot</button>
                    </div>
                  )}
                </div>

                {/* Quantity & CTA Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#DFCBB8] rounded bg-white h-12 px-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 text-lg text-[#523A30] hover:text-[#9E472A]"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-mono font-medium text-[#2C2420]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 text-lg text-[#523A30] hover:text-[#9E472A]"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    id="modal-add-to-cart-button"
                    onClick={handleAdd}
                    className="flex-1 h-12 bg-[#9E472A] hover:bg-[#85371D] text-white font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>ADD TO BAG</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => onToggleWishlist(product)}
                    aria-label="Toggle Wishlist"
                    className={`h-12 w-12 rounded-xs border flex items-center justify-center transition-colors ${
                      isWishlisted
                        ? 'bg-[#9E472A] text-white border-[#9E472A]'
                        : 'bg-white text-[#2C2420] border-[#DFCBB8] hover:border-[#9E472A]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Tabs for Fabric, Details & Artisan Story */}
                <div className="pt-4 border-t border-[#DFCBB8]">
                  <div className="flex border-b border-[#DFCBB8] gap-4 text-xs font-cinzel font-semibold">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`pb-2 transition-colors ${
                        activeTab === 'details' ? 'text-[#9E472A] border-b-2 border-[#9E472A]' : 'text-[#7A6F68] hover:text-[#2C2420]'
                      }`}
                    >
                      Specifications
                    </button>
                    <button
                      onClick={() => setActiveTab('fabric')}
                      className={`pb-2 transition-colors ${
                        activeTab === 'fabric' ? 'text-[#9E472A] border-b-2 border-[#9E472A]' : 'text-[#7A6F68] hover:text-[#2C2420]'
                      }`}
                    >
                      Care Guide
                    </button>
                    <button
                      onClick={() => setActiveTab('artisan')}
                      className={`pb-2 transition-colors ${
                        activeTab === 'artisan' ? 'text-[#9E472A] border-b-2 border-[#9E472A]' : 'text-[#7A6F68] hover:text-[#2C2420]'
                      }`}
                    >
                      Artisan Note
                    </button>
                  </div>

                  <div className="py-3 text-xs text-[#685C54] leading-relaxed">
                    {activeTab === 'details' && (
                      <div className="space-y-1.5">
                        <p><strong>Fabric:</strong> {product.fabric}</p>
                        <p><strong>Fit:</strong> Tailored Relaxed Luxury Silhouette</p>
                        <p><strong>Origin:</strong> Handcrafted in Maharashtra Atelier, India</p>
                      </div>
                    )}
                    {activeTab === 'fabric' && (
                      <ul className="list-disc pl-4 space-y-1">
                        {product.careInstructions.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                    {activeTab === 'artisan' && (
                      <p className="italic bg-[#F4E9DC] p-2.5 rounded text-[#523A30]">
                        "{product.artisanNote}"
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Guarantees */}
              <div className="pt-2 border-t border-[#DFCBB8] grid grid-cols-2 gap-2 text-[10px] text-[#7A6F68]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#9E472A]" />
                  <span>Free Pan-India Delivery on orders &gt; ₹2,999</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#9E472A]" />
                  <span>15 Days Hassle-Free Exchange</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
