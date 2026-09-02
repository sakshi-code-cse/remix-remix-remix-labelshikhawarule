import React, { useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  showArrows?: boolean;
  showProgressBar?: boolean;
  scrollStep?: number; // Pixels to scroll on arrow click (or calculated from child)
  gap?: string; // CSS gap class, defaults to 'gap-4 sm:gap-6'
  padding?: string; // Track padding
  ariaLabel?: string;
}

export const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
  id,
  children,
  className = '',
  showArrows = true,
  showProgressBar = true,
  scrollStep,
  gap = 'gap-4 sm:gap-6',
  padding = 'px-4 sm:px-6 lg:px-8',
  ariaLabel = 'Horizontal carousel',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.25);

  // Mouse Drag States
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);

  // Update bounds & progress
  const updateScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < maxScroll - 6);

    if (maxScroll > 0) {
      const progress = Math.min(Math.max(scrollLeft / maxScroll, 0), 1);
      setScrollProgress(progress);
      const ratio = Math.min(Math.max(clientWidth / scrollWidth, 0.15), 0.6);
      setThumbRatio(ratio);
    } else {
      setScrollProgress(0);
      setThumbRatio(1);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScroll();
    el.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    return () => {
      el.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [updateScroll, children]);

  // Handle arrow click
  const handleScroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;

    const firstChild = el.querySelector(':scope > *') as HTMLElement | null;
    const step = scrollStep || (firstChild ? firstChild.offsetWidth + 20 : el.clientWidth * 0.75);

    const target = direction === 'left' ? el.scrollLeft - step : el.scrollLeft + step;
    el.scrollTo({
      left: target,
      behavior: 'smooth',
    });
  };

  // Mouse Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;

    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!isDragging || !el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.4; // smooth drag sensitivity

    if (Math.abs(walk) > 4) {
      setDragMoved(true);
    }
    el.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      updateScroll();
    }
  };

  // Intercept click on children if dragging happened
  const handleCaptureClick = (e: React.MouseEvent) => {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className={`relative w-full select-none group/hcarousel ${className}`}>
      {/* DESKTOP LEFT ARROW */}
      {showArrows && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Previous items"
          className={`hidden md:flex absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer border ${
            canScrollLeft
              ? 'bg-[#FAF6F0]/95 hover:bg-[#9E472A] text-[#9E472A] hover:text-white border-[#DFCBB8] hover:border-[#9E472A] hover:scale-105 active:scale-95'
              : 'bg-[#FAF6F0]/40 text-[#DFCBB8] border-[#DFCBB8]/40 opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* DESKTOP RIGHT ARROW */}
      {showArrows && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Next items"
          className={`hidden md:flex absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer border ${
            canScrollRight
              ? 'bg-[#FAF6F0]/95 hover:bg-[#9E472A] text-[#9E472A] hover:text-white border-[#DFCBB8] hover:border-[#9E472A] hover:scale-105 active:scale-95'
              : 'bg-[#FAF6F0]/40 text-[#DFCBB8] border-[#DFCBB8]/40 opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* HORIZONTALLY SCROLLABLE TRACK */}
      <div
        ref={containerRef}
        id={id}
        role="region"
        aria-label={ariaLabel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleCaptureClick}
        className={`w-full flex items-stretch ${gap} ${padding} overflow-x-auto py-2 no-scrollbar ${
          isDragging ? 'scroll-auto cursor-grabbing' : 'scroll-smooth cursor-grab'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: isDragging ? 'none' : 'x proximity',
        }}
      >
        {children}
      </div>

      {/* SUBTLE LUXURY PROGRESS BAR INDICATOR */}
      {showProgressBar && (
        <div className="flex items-center justify-center mt-5 sm:mt-7">
          <div 
            className="w-32 sm:w-44 h-[2.5px] bg-[#D4C3B2]/40 rounded-full overflow-hidden relative"
            role="progressbar"
            aria-valuenow={Math.round(scrollProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-[#9E472A] rounded-full transition-transform duration-100 ease-out"
              style={{
                width: `${thumbRatio * 100}%`,
                transform: `translateX(${scrollProgress * ((1 - thumbRatio) / thumbRatio) * 100}%)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
