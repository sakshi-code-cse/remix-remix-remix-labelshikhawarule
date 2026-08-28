import React from 'react';
import { STYLE_CATEGORIES } from '../data/mockData';
import { StyleCategory } from '../types';

interface ShopByStyleProps {
  onSelectStyle: (styleId: string) => void;
  selectedStyle?: string;
  stylesList?: StyleCategory[];
}

export const ShopByStyle: React.FC<ShopByStyleProps> = ({ onSelectStyle, selectedStyle, stylesList }) => {
  const styles = stylesList && stylesList.length > 0 ? stylesList : STYLE_CATEGORIES;

  return (
    <section id="shop-by-style-section" className="py-10 md:py-16 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Elegant Divider Line */}
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
            <h2 className="font-cinzel text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#2C2420] uppercase text-center">
              SHOP BY STYLE
            </h2>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
          </div>
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
        </div>

        {/* 4 Clean Rectangular Style Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {styles.map((style) => {
            const isSelected = selectedStyle?.toLowerCase() === style.title.toLowerCase();

            return (
              <div
                key={style.id}
                id={`style-card-${style.id}`}
                onClick={() => onSelectStyle(style.title)}
                className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
              >
                {/* Clean Luxury Rectangle Card */}
                <div
                  className={`relative w-full max-w-[280px] aspect-[3/4] overflow-hidden rounded-xl bg-[#F0EBE1] border transition-all duration-500 shadow-sm ${
                    isSelected
                      ? 'border-[#9E472A] ring-2 ring-[#9E472A]/40 shadow-md scale-105'
                      : 'border-[#E4D7C8] hover:border-[#9E472A]/60 hover:shadow-lg'
                  }`}
                >
                  <img
                    src={style.image}
                    alt={`${style.title} Style Fabric`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Card Title Below */}
                <span className={`mt-3 font-cinzel text-sm sm:text-base font-semibold tracking-wider transition-colors duration-200 ${
                  isSelected ? 'text-[#9E472A]' : 'text-[#2C2420] group-hover:text-[#9E472A]'
                }`}>
                  {style.title}
                </span>

                <span className="text-[11px] text-[#7A6F68] font-normal mt-0.5 opacity-80 font-sans">
                  {style.itemCount} Designs
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
