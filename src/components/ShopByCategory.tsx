import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES_LIST } from '../data/mockData';
import { CategoryItem } from '../types';
import { IndianArchCard } from './ArchShape';
import { HorizontalScrollSection } from './common/HorizontalScrollSection';

interface ShopByCategoryProps {
  onSelectCategory: (categorySlug: string) => void;
  selectedCategory?: string;
  onViewAllCategories: () => void;
  categoriesList?: CategoryItem[];
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  onSelectCategory,
  selectedCategory,
  onViewAllCategories,
  categoriesList,
}) => {
  const categories = categoriesList && categoriesList.length > 0 ? categoriesList : CATEGORIES_LIST;

  return (
    <section id="shop-by-category-section" className="py-10 md:py-16 bg-[#FAF6F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
            <h2 className="font-cinzel text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#2C2420] uppercase text-center">
              SHOP BY COLLECTION
            </h2>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
          </div>
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
        </div>

        {/* Horizontal Scrolling Collection Carousel */}
        <HorizontalScrollSection
          id="shop-by-collection-track"
          ariaLabel="Shop by Collection carousel"
          gap="gap-4 sm:gap-6"
          padding="px-1"
          showArrows={true}
          showProgressBar={true}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory?.toLowerCase() === cat.title.toLowerCase();

            return (
              <div
                key={cat.id}
                id={`category-card-${cat.id}`}
                onClick={() => onSelectCategory(cat.title)}
                className="group flex flex-col items-center flex-none w-[72vw] sm:w-[46vw] md:w-[32vw] lg:w-[calc((100%-3*24px)/4)] snap-start cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Rectangular Image Frame */}
                <div className={`w-full mb-3 transition-transform duration-300 ${isSelected ? 'scale-[1.02]' : ''}`}>
                  <IndianArchCard
                    id={`category-arch-${cat.id}`}
                    image={cat.image}
                    alt={`${cat.title} Collection`}
                    aspectRatio="aspect-[3/4]"
                    borderColor={isSelected ? '#9E472A' : '#9E472A'}
                    strokeWidth={isSelected ? 2.2 : 1.8}
                    showDoubleBorder={true}
                    objectPosition="object-center"
                  />
                </div>

                {/* Category Title */}
                <span className={`font-cinzel text-sm sm:text-base font-semibold tracking-wider transition-colors duration-200 text-center ${
                  isSelected ? 'text-[#9E472A]' : 'text-[#2C2420] group-hover:text-[#9E472A]'
                }`}>
                  {cat.title}
                </span>

                <span className="text-xs text-[#7A6F68] font-normal mt-1 opacity-80 font-sans">
                  {cat.itemCount} Ensembles
                </span>
              </div>
            );
          })}
        </HorizontalScrollSection>

        {/* View All Categories Link */}
        <div className="mt-8 flex justify-center">
          <button
            id="view-all-categories-link"
            onClick={onViewAllCategories}
            className="group inline-flex items-center gap-1.5 px-6 py-2.5 border border-[#9E472A]/70 text-xs font-cinzel font-semibold text-[#9E472A] hover:bg-[#9E472A] hover:text-white rounded-xs tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer shadow-xs"
          >
            <span>VIEW ALL COLLECTIONS</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};

