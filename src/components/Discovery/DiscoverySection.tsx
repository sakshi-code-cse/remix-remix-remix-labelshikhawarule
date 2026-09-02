import React, { useMemo } from 'react';
import { DISCOVERY_PRODUCTS, DiscoveryProduct, toGlobalProduct, discoveryStoryToDiscoveryProduct } from './types';
import { DiscoveryCarousel } from './DiscoveryCarousel';
import { Product, DiscoveryStory } from '../../types';

interface DiscoverySectionProps {
  onSelectProduct?: (product: Product) => void;
  products?: DiscoveryProduct[];
  discoveryStories?: DiscoveryStory[];
}

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  onSelectProduct,
  products,
  discoveryStories,
}) => {
  const renderedProducts: DiscoveryProduct[] = useMemo(() => {
    if (discoveryStories && discoveryStories.length > 0) {
      return discoveryStories
        .filter((s) => s.isActive !== false)
        .map((s, idx) => discoveryStoryToDiscoveryProduct(s, idx));
    }
    if (products && products.length > 0) {
      return products;
    }
    return DISCOVERY_PRODUCTS;
  }, [discoveryStories, products]);

  const handleProductSelect = (dp: DiscoveryProduct) => {
    if (onSelectProduct) {
      onSelectProduct(toGlobalProduct(dp));
    }
  };

  return (
    <section
      id="discovery-section"
      aria-label="Discovery Collection"
      className="w-full py-10 sm:py-14 md:py-16 bg-[#FAF6F0] relative overflow-hidden"
    >
      {/* SECTION HEADER - Minimal Luxury-Fashion Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 md:mb-10">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[80px] sm:max-w-[160px] md:max-w-[220px]" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" aria-hidden="true" />
            <h2 className="font-cinzel text-lg sm:text-2xl md:text-[26px] font-bold tracking-[0.22em] text-[#2C2420] uppercase text-center">
              WATCH OUR DISCOVERY
            </h2>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" aria-hidden="true" />
          </div>
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[80px] sm:max-w-[160px] md:max-w-[220px]" />
        </div>
      </div>

      {/* HORIZONTAL DISCOVERY CAROUSEL */}
      <DiscoveryCarousel
        products={renderedProducts}
        onSelectProduct={handleProductSelect}
      />
    </section>
  );
};
export default DiscoverySection;
