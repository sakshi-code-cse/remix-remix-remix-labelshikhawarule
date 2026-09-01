import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight, Sparkles, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { IndianArchCard } from './ArchShape';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const popularTags = ['Saree', 'Kurta', 'Ivory Drape', 'Festive Silk', 'Linen', 'Terracotta', 'Mulmul', 'Kids'];

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.style.toLowerCase().includes(q) ||
      p.gender.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen px-4 pt-16 pb-20 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        />

        {/* Modal Window */}
        <div className="relative inline-block w-full max-w-3xl p-6 sm:p-8 my-8 overflow-hidden text-left align-middle bg-[#FAF6F0] rounded-lg shadow-2xl transform transition-all border border-[#DFCBB8]">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="absolute top-4 right-4 p-2 text-[#2C2420] hover:text-[#9E472A] rounded-full hover:bg-[#F3E8DB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Search Input Box */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#9E472A]" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search handcrafted sarees, kurtas, drapes, fabrics..."
              className="w-full pl-13 pr-10 py-4 bg-white border-2 border-[#DFCBB8] focus:border-[#9E472A] rounded-md text-base sm:text-lg text-[#2C2420] placeholder-[#8A7E75] focus:outline-none shadow-xs font-serif-luxury"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A7E75] hover:text-[#2C2420] bg-gray-100 p-1 rounded-full"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Trending Searches */}
          <div className="mb-6">
            <span className="text-[11px] font-cinzel font-semibold text-[#8C7E74] uppercase tracking-wider block mb-2">
              Trending Curations
            </span>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1.5 bg-white hover:bg-[#F3E8DB] text-[#523A30] hover:text-[#9E472A] border border-[#DFCBB8] rounded-full text-xs font-cinzel transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          <div>
            {searchQuery.trim() !== '' ? (
              <div>
                <div className="flex items-center justify-between border-b border-[#DFCBB8] pb-2 mb-4 text-xs font-cinzel text-[#7A6F68]">
                  <span>FOUND {filteredProducts.length} DESIGNS FOR "{searchQuery}"</span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="py-12 text-center text-[#7A6F68] space-y-2">
                    <p className="font-serif-luxury text-lg">No matching handcrafted pieces found.</p>
                    <p className="text-xs">Try searching for "Saree", "Ivory", "Kurta", or "Silk".</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto pr-1">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="flex gap-3 p-2.5 bg-white rounded border border-[#EADDCF] hover:border-[#9E472A] transition-all cursor-pointer group shadow-2xs"
                      >
                        <div className="w-16 h-20 shrink-0">
                          <IndianArchCard
                            id={`search-item-${product.id}`}
                            image={product.image}
                            alt={product.name}
                            aspectRatio="aspect-[3/4]"
                            borderColor="#9E472A"
                            strokeWidth={1.5}
                            showDoubleBorder={false}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-cinzel text-xs font-semibold text-[#2C2420] group-hover:text-[#9E472A] line-clamp-1">
                              {product.name}
                            </h4>
                            <span className="text-[10px] text-[#8C7E74] block mt-0.5">
                              {product.style} • {product.category}
                            </span>
                          </div>
                          <span className="font-serif-luxury text-sm font-bold text-[#2C2420]">
                            ₹ {product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-white/60 rounded border border-[#EADDCF] flex items-center justify-between text-xs text-[#685C54]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9E472A]" />
                  <span>Looking for custom wedding trousseau or bespoke size?</span>
                </div>
                <span className="font-cinzel font-semibold text-[#9E472A]">Book Consultation</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
