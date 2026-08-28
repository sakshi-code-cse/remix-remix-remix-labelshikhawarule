import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES_LIST } from '../data/mockData';
import { CategoryItem } from '../types';

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
    <section id="shop-by-category-section" className="py-10 md:py-16 bg-[#FAF6F0]">
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

        {/* Clean Rectangular Category/Collection Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory?.toLowerCase() === cat.title.toLowerCase();

            return (
              <div
                key={cat.id}
                id={`category-card-${cat.id}`}
                onClick={() => onSelectCategory(cat.title)}
                className="group flex flex-col items-center w-full max-w-[280px] cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
              >
                {/* Clean Rectangle Frame */}
                <div
                  className={`relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-[#F0EBE1] border transition-all duration-500 shadow-sm ${
                    isSelected
                      ? 'border-[#9E472A] ring-2 ring-[#9E472A]/40 shadow-md scale-105'
                      : 'border-[#E4D7C8] hover:border-[#9E472A]/60 hover:shadow-lg'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={`${cat.title} Collection`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Category Title */}
                <span className={`mt-3 font-cinzel text-sm sm:text-base font-semibold tracking-wider transition-colors duration-200 text-center ${
                  isSelected ? 'text-[#9E472A]' : 'text-[#2C2420] group-hover:text-[#9E472A]'
                }`}>
                  {cat.title}
                </span>

                <span className="text-[11px] sm:text-xs text-[#7A6F68] font-normal mt-0.5 opacity-80 font-sans">
                  {cat.itemCount} Ensembles
                </span>
              </div>
            );
          })}
        </div>

        {/* View All Categories Link */}
        <div className="mt-10 flex justify-center">
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
