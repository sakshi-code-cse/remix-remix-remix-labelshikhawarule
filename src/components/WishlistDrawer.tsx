import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EADDCF] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#9E472A] fill-[#9E472A]" />
              <h2 className="font-cinzel text-base font-bold text-[#2C2420] tracking-wider uppercase">
                YOUR SAVED PIECES ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close wishlist"
              className="p-1.5 text-[#685C54] hover:text-[#9E472A] rounded-full hover:bg-[#F3E8DB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F3E8DB] text-[#9E472A] flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-cinzel text-base font-semibold text-[#2C2420]">Your Wishlist is Empty</h3>
                <p className="text-xs text-[#7A6F68] max-w-xs mx-auto">
                  Save your favorite silhouettes and festive ensembles to curate your personalized trousseau.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#9E472A] text-white text-xs font-cinzel font-semibold tracking-wider rounded uppercase"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 bg-white rounded-md border border-[#EADDCF] shadow-xs group"
                  >
                    {/* Thumbnail */}
                    <div 
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="w-20 h-26 bg-[#EFE5D8] rounded overflow-hidden shrink-0 cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 
                            onClick={() => {
                              onSelectProduct(product);
                              onClose();
                            }}
                            className="font-cinzel text-xs font-semibold text-[#2C2420] line-clamp-1 cursor-pointer hover:text-[#9E472A]"
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveFromWishlist(product.id)}
                            className="text-[#8A7E75] hover:text-[#9E472A] p-1"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="font-serif-luxury text-sm font-bold text-[#2C2420] mt-1">
                          ₹ {product.price.toLocaleString('en-IN')}
                        </div>

                        <span className="text-[10px] text-[#7A6F68] block mt-0.5">
                          Style: {product.style} • {product.category}
                        </span>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => {
                          onMoveToCart(product);
                          onRemoveFromWishlist(product.id);
                        }}
                        className="mt-2 w-full py-1.5 px-3 bg-[#9E472A] hover:bg-[#7E331B] text-white text-[11px] font-cinzel font-semibold tracking-wider uppercase rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move To Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 bg-white border-t border-[#EADDCF]">
              <button
                onClick={() => {
                  wishlist.forEach((p) => onMoveToCart(p));
                  onClose();
                }}
                className="w-full py-3 bg-[#2C2420] hover:bg-[#9E472A] text-white rounded font-cinzel text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Move All To Bag
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
