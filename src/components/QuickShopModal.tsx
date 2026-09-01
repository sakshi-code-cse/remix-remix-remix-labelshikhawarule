import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check, Sparkles, Ruler, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';
import { IndianArchCard } from './ArchShape';

interface QuickShopModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  onOpenFullDetail: (product: Product) => void;
  onOpenSizeGuide: () => void;
}

export const QuickShopModal: React.FC<QuickShopModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenFullDetail,
  onOpenSizeGuide,
}) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
      />

      <div className="flex items-center justify-center min-h-screen p-3 sm:p-6 text-center">
        <div className="relative inline-block w-full max-w-2xl overflow-hidden text-left align-middle bg-[#FAF6F0] rounded-2xl shadow-2xl border border-[#DFCBB8] transform transition-all">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close quick shop modal"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#2C2420] hover:text-[#9E472A] shadow-xs transition-colors cursor-pointer border border-[#DFCBB8]"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
            {/* Left: Signature Mughal Arch Product Image */}
            <div className="sm:col-span-5 p-4 sm:p-5 flex items-center justify-center bg-[#EADDCF]/60 border-b sm:border-b-0 sm:border-r border-[#DFCBB8]">
              <div className="w-full max-w-[240px]">
                <IndianArchCard
                  id={`quickshop-${product.id}`}
                  image={product.image}
                  alt={product.name}
                  aspectRatio="aspect-[3/4]"
                  borderColor="#9E472A"
                  strokeWidth={1.8}
                  showDoubleBorder={true}
                >
                  {/* Badges on image */}
                  <div className="absolute top-3 left-2.5 flex flex-col gap-1 z-20 pointer-events-none">
                    {product.isNew && (
                      <span className="px-2 py-0.5 rounded-2xs bg-[#9E472A] text-white text-[9px] font-cinzel font-semibold tracking-wider uppercase shadow-xs">
                        NEW
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 rounded-2xs bg-[#2D6A4F] text-white text-[9px] font-cinzel font-semibold tracking-wider shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    aria-label="Wishlist"
                    className="absolute bottom-2.5 right-2.5 z-20 p-2 rounded-full bg-white/90 text-[#2C2420] hover:text-[#9E472A] shadow-md transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? 'fill-[#9E472A] text-[#9E472A]' : ''}`} />
                  </button>
                </IndianArchCard>
              </div>
            </div>

            {/* Right: Quick Options */}
            <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                {/* Brand & Category */}
                <div className="flex items-center justify-between text-xs text-[#7A6F68] font-cinzel mb-1">
                  <span className="tracking-widest uppercase text-[#9E472A] font-semibold">
                    {product.category} • {product.gender}
                  </span>
                  <div className="flex items-center gap-1 text-[#C29342]">
                    <Star className="w-3.5 h-3.5 fill-[#C29342] stroke-none" />
                    <span className="font-semibold text-[#2C2420] text-xs">{product.rating}</span>
                    <span className="text-[11px] text-[#7A6F68]">({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#2C2420] tracking-wide leading-snug">
                  {product.name}
                </h3>

                {/* Fabric Subtitle */}
                <p className="font-serif-luxury italic text-xs text-[#685C54] mt-0.5">
                  {product.fabric}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2.5 mt-2.5">
                  <span className="font-cinzel text-xl font-bold text-[#2C2420]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="font-cinzel text-xs text-[#9E8B7F] line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-[11px] text-[#2D6A4F] font-cinzel font-semibold">
                    Inclusive of all taxes
                  </span>
                </div>

                {/* Color Selection if available */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-[#DFCBB8]/70">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-cinzel text-[#2C2420] font-semibold">Color:</span>
                      <span className="text-[#685C54] text-xs font-serif-luxury">{selectedColor || product.colors[0].name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          title={c.name}
                          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                            (selectedColor === c.name || (!selectedColor && c.name === product.colors?.[0]?.name))
                              ? 'border-[#9E472A] scale-110 shadow-xs'
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                <div className="mt-3.5 pt-3 border-t border-[#DFCBB8]/70">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-cinzel text-[#2C2420] font-semibold">Select Size:</span>
                    <button
                      onClick={onOpenSizeGuide}
                      className="inline-flex items-center gap-1 text-[11px] font-cinzel text-[#9E472A] hover:underline cursor-pointer"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs font-cinzel rounded border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#9E472A] text-white border-[#9E472A] font-bold shadow-xs'
                            : 'bg-white text-[#2C2420] border-[#DFCBB8] hover:border-[#9E472A]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs font-cinzel text-[#2C2420] font-semibold">Quantity:</span>
                  <div className="inline-flex items-center border border-[#DFCBB8] rounded bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-xs text-[#2C2420] hover:bg-[#F3E8DB] cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-cinzel font-semibold text-[#2C2420]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-xs text-[#2C2420] hover:bg-[#F3E8DB] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAdd}
                  disabled={addedAnimation}
                  className={`w-full py-3 px-4 rounded-xs text-xs font-cinzel font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    addedAnimation 
                      ? 'bg-[#2D6A4F] text-white' 
                      : 'bg-[#9E472A] hover:bg-[#80331A] text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO COUTURE BAG!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO BAG • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenFullDetail(product);
                  }}
                  className="w-full py-2 text-center text-xs font-cinzel text-[#7A6F68] hover:text-[#9E472A] transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>View Complete Craftsmanship & Fabric Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
