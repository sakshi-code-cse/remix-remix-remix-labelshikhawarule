import React from 'react';
import { STYLE_CATEGORIES } from '../data/mockData';
import { StyleCategory } from '../types';
import { IndianArchCard } from './ArchShape';
import { HorizontalScrollSection } from './common/HorizontalScrollSection';

interface ShopByStyleProps {
  onSelectStyle: (styleId: string) => void;
  selectedStyle?: string;
  stylesList?: StyleCategory[];
}

export const ShopByStyle: React.FC<ShopByStyleProps> = ({ onSelectStyle, selectedStyle, stylesList }) => {
  const styles = stylesList && stylesList.length > 0 ? stylesList : STYLE_CATEGORIES;

  return (
    <section id="shop-by-style-section" className="py-10 md:py-16 bg-[#FAF6F0] overflow-hidden">
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

        {/* Horizontal Scrolling Style Carousel */}
        <HorizontalScrollSection
          id="shop-by-style-track"
          ariaLabel="Shop by Style carousel"
          gap="gap-4 sm:gap-6"
          padding="px-1"
          showArrows={true}
          showProgressBar={true}
        >
          {styles.map((style) => {
            const isSelected = selectedStyle?.toLowerCase() === style.title.toLowerCase();

            return (
              <div
                key={style.id}
                id={`style-card-${style.id}`}
                onClick={() => onSelectStyle(style.title)}
                className="group flex flex-col items-center flex-none w-[72vw] sm:w-[46vw] md:w-[32vw] lg:w-[calc((100%-3*24px)/4)] snap-start cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Rectangular Image Frame */}
                <div className={`w-full mb-3 transition-transform duration-300 ${isSelected ? 'scale-[1.02]' : ''}`}>
                  <IndianArchCard
                    id={`style-arch-${style.id}`}
                    image={style.image}
                    alt={`${style.title} Style Silhouette`}
                    aspectRatio="aspect-[3/4]"
                    borderColor={isSelected ? '#9E472A' : '#9E472A'}
                    strokeWidth={isSelected ? 2.2 : 1.8}
                    showDoubleBorder={true}
                    objectPosition="object-center"
                  />
                </div>

                {/* Card Title Below */}
                <span className={`font-cinzel text-sm sm:text-base font-semibold tracking-wider transition-colors duration-200 text-center ${
                  isSelected ? 'text-[#9E472A]' : 'text-[#2C2420] group-hover:text-[#9E472A]'
                }`}>
                  {style.title}
                </span>

                <span className="text-xs text-[#7A6F68] font-normal mt-1 opacity-80 font-sans">
                  {style.itemCount} Designs
                </span>
              </div>
            );
          })}
        </HorizontalScrollSection>

      </div>
    </section>
  );
};

