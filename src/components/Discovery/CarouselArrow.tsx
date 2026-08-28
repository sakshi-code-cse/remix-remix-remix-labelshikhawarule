import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  ariaLabel: string;
  disabled?: boolean;
}

export const CarouselArrow: React.FC<CarouselArrowProps> = ({
  direction,
  onClick,
  ariaLabel,
  disabled = false,
}) => {
  const isLeft = direction === 'left';

  return (
    <button
      type="button"
      id={isLeft ? 'discovery-arrow-left' : 'discovery-arrow-right'}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`absolute top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 text-[#2C2420] border border-[#DFCBB8]/60 shadow-[0_8px_24px_rgba(0,0,0,0.14)] backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:bg-white hover:text-[#9E472A] hover:border-[#9E472A]/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none ${
        isLeft ? 'left-3 sm:left-6 md:left-[44px]' : 'right-3 sm:right-6 md:right-[44px]'
      }`}
      style={{
        boxShadow: '0 8px 24px rgba(44,36,32,0.16)',
      }}
    >
      {isLeft ? (
        <ChevronLeft className="w-6 h-6 stroke-[1.75] -ml-0.5" />
      ) : (
        <ChevronRight className="w-6 h-6 stroke-[1.75] -mr-0.5" />
      )}
    </button>
  );
};
