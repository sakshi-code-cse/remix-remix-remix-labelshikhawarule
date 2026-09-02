import React from 'react';
import { Heart, ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { IndianArchCard } from './ArchShape';

interface BestSellersProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  onViewAllClick: () => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onViewAllClick,
}) => {
  const [showAllPieces, setShowAllPieces] = React.useState(false);

  const visibleProducts = showAllPieces || products.length <= 8 ? products : products.slice(0, 8);

  return (
    <section id="best-sellers-section" className="py-10 md:py-16 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" aria-hidden="true" />
            <h2 className="font-cinzel text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#2C2420] uppercase text-center">
              SHOP OUR BESTSELLERS
            </h2>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" aria-hidden="true" />
          </div>
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
        </div>

        {/* Product Cards Grid: Responsive 2-4 columns Mughal arch pattern */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {visibleProducts.map((product) => {
            const wish = isWishlisted(product.id);
            const secondImg = product.images && product.images.length > 1 ? product.images[1] : product.hoverImage;

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="group flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Rectangular Product Card (3:4 ratio) */}
                <div className="w-full mb-3">
                  <IndianArchCard
                    id={`bestseller-${product.id}`}
                    image={product.image}
                    hoverImage={secondImg}
                    alt={product.name}
                    aspectRatio="aspect-[3/4]"
                    borderColor="#9E472A"
                    strokeWidth={1.8}
                    showDoubleBorder={true}
                    onClick={() => onSelectProduct(product)}
                  >
                    {/* Wishlist Heart Icon Button */}
                    <button
                      id={`wishlist-button-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      aria-label={wish ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-20 ${
                        wish 
                          ? 'bg-[#9E472A] text-white shadow-md' 
                          : 'bg-white/85 backdrop-blur-xs text-[#2C2420] hover:bg-white hover:text-[#9E472A] shadow-xs'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${wish ? 'fill-current' : ''}`} />
                    </button>

                    {/* Tag / Badge */}
                    {product.isNew && (
                      <span className="absolute top-2.5 left-2.5 bg-[#FAF6F0]/95 backdrop-blur-xs text-[#9E472A] text-[9px] font-cinzel font-bold px-2 py-0.5 tracking-wider uppercase rounded-sm z-20 shadow-xs border border-[#DFCBB8]">
                        New
                      </span>
                    )}

                    {/* Quick Action Overlay (Slide Up on Hover) */}
                    <div className="absolute inset-x-2 bottom-2.5 p-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1.5 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="p-2 bg-white text-[#2C2420] hover:bg-[#FAF6F0] rounded text-xs font-cinzel font-medium flex items-center gap-1 shadow-md cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="flex-1 py-2 px-2 bg-[#9E472A] hover:bg-[#85371D] text-white rounded text-[10px] font-cinzel font-semibold tracking-wider flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>ADD TO BAG</span>
                      </button>
                    </div>
                  </IndianArchCard>
                </div>

                {/* Product Name */}
                <h3 
                  onClick={() => onSelectProduct(product)}
                  className="font-cinzel text-xs sm:text-sm font-semibold text-[#2C2420] group-hover:text-[#9E472A] transition-colors leading-tight text-center line-clamp-1"
                >
                  {product.name}
                </h3>

                {/* Product Price */}
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-serif-luxury text-sm sm:text-base font-semibold text-[#2C2420]">
                    ₹ {product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="font-serif-luxury text-xs text-[#8A7E75] line-through">
                      ₹ {product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All / Expand Pieces Button */}
        {products.length > 8 && (
          <div className="mt-10 md:mt-12 flex justify-center">
            <button
              id="view-all-best-sellers-button"
              onClick={() => {
                setShowAllPieces(!showAllPieces);
                onViewAllClick();
              }}
              className="group inline-flex items-center gap-2.5 px-7 py-3 border border-[#9E472A] text-[#9E472A] hover:bg-[#9E472A] hover:text-white rounded text-xs font-cinzel font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>{showAllPieces ? 'SHOW FEWER PIECES' : `VIEW ALL ${products.length} ENSEMBLES`}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
