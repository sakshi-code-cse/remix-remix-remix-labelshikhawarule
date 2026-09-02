import React, { useRef, useState, useEffect, useCallback } from 'react';
import { DiscoveryProduct } from './types';
import { DiscoveryCard } from './DiscoveryCard';
import { CarouselArrow } from './CarouselArrow';

interface DiscoveryCarouselProps {
  products: DiscoveryProduct[];
  onSelectProduct: (product: DiscoveryProduct) => void;
}

export const DiscoveryCarousel: React.FC<DiscoveryCarouselProps> = ({
  products,
  onSelectProduct,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.25);

  // Mouse Drag to Scroll States
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Check scroll boundary limits to toggle arrow states
  const updateScrollBounds = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);

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

    updateScrollBounds();
    el.addEventListener('scroll', updateScrollBounds, { passive: true });
    window.addEventListener('resize', updateScrollBounds);

    return () => {
      el.removeEventListener('scroll', updateScrollBounds);
      window.removeEventListener('resize', updateScrollBounds);
    };
  }, [updateScrollBounds, products]);

  // Arrow Navigation: scroll by 1 card step (Card width + Gap)
  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cardEl = container.querySelector('article');
    const step = cardEl ? cardEl.offsetWidth + 18 : 416;

    const target = direction === 'left' ? container.scrollLeft - step : container.scrollLeft + step;
    container.scrollTo({
      left: target,
      behavior: 'smooth',
    });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity multiplier
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    updateScrollBounds();
  };

  return (
    <div className="relative w-full overflow-hidden select-none group/carousel">
      {/* LEFT NAVIGATION ARROW */}
      <CarouselArrow
        direction="left"
        onClick={() => handleScroll('left')}
        disabled={!canScrollLeft}
        ariaLabel="Previous products"
      />

      {/* RIGHT NAVIGATION ARROW */}
      <CarouselArrow
        direction="right"
        onClick={() => handleScroll('right')}
        disabled={!canScrollRight}
        ariaLabel="Next products"
      />

      {/* HORIZONTALLY SCROLLABLE CAROUSEL CONTAINER */}
      <div
        ref={containerRef}
        id="discovery-carousel-track"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full flex items-center gap-[14px] sm:gap-[16px] lg:gap-[18px] overflow-x-auto py-2 
          pl-4 sm:pl-6 md:pl-10 lg:pl-[44px] pr-4 sm:pr-6 md:pr-10 lg:pr-8
          scroll-smooth cursor-grab active:cursor-grabbing no-scrollbar ${
            isDragging ? 'scroll-auto' : 'scroll-smooth'
          }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: isDragging ? 'none' : 'x mandatory',
        }}
      >
        {products.map((product) => (
          <DiscoveryCard
            key={product.id}
            product={product}
            onSelect={(p) => {
              if (!hasDragged) {
                onSelectProduct(p);
              }
            }}
          />
        ))}
      </div>

      {/* SUBTLE LUXURY PROGRESS BAR INDICATOR */}
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
    </div>
  );
};
