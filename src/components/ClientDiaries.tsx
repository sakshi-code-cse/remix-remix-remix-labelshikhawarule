import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  X, 
  Sparkles, 
  Share2, 
  Check,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CLIENT_DIARIES } from '../data/mockData';
import { ClientDiary } from '../types';

interface ClientDiariesProps {
  diariesList?: ClientDiary[];
  onOpenReviewModal?: () => void;
  onBookAppointment?: (preference?: string) => void;
}

export const ClientDiaries: React.FC<ClientDiariesProps> = ({ 
  diariesList,
  onOpenReviewModal, 
  onBookAppointment 
}) => {
  const [selectedDiary, setSelectedDiary] = useState<ClientDiary | null>(null);
  const [isAllDiariesModalOpen, setIsAllDiariesModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Drag & Scroll state
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const diaries = diariesList && diariesList.length > 0 ? diariesList : CLIENT_DIARIES;

  const updateScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateScrollButtons, { passive: true });
      updateScrollButtons();
      return () => slider.removeEventListener('scroll', updateScrollButtons);
    }
  }, [diaries]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.75;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDownRef.current = false;
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  };

  const handleCardClick = (diary: ClientDiary) => {
    if (!hasDraggedRef.current) {
      setSelectedDiary(diary);
    }
  };

  const handleShare = (diary: ClientDiary, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${diary.author} - Client Diaries | Label Shikha Warule`,
        text: `Explore ${diary.author}'s bespoke ensemble (${diary.category || 'Editorial'}).`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section 
      id="client-diaries-section" 
      className="bg-[#F7F4EE] text-[#171717] py-20 sm:py-24 lg:py-32 overflow-hidden transition-colors"
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ========================================================================= */}
        {/* 1. SECTION HEADER (Editorial Luxury Minimalist Hierarchy) */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-14 sm:mb-16 lg:mb-20"
        >
          {/* Eyebrow */}
          <span className="text-xs sm:text-[13px] font-sans font-medium tracking-[0.28em] text-[#77736C] uppercase mb-2.5 sm:mb-3 block">
            OUR CLIENTS
          </span>

          {/* Main Heading */}
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.16em] text-[#171717] uppercase mb-4 sm:mb-5">
            CLIENT DIARIES
          </h2>

          {/* Description */}
          <p className="font-sans text-sm sm:text-base text-[#77736C] font-light max-w-xl mx-auto tracking-wide leading-relaxed px-4">
            A glimpse into the moments, celebrations and stories created with our clients.
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* 2. HORIZONTAL EDITORIAL GALLERY & SLIDER CONTROLS */}
        {/* ========================================================================= */}
        <div className="relative">
          
          {/* Left Arrow Button (Desktop / Tablet) */}
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left in client gallery"
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 text-[#171717] border border-[#E5DFD5] shadow-sm items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-xs ${
              canScrollLeft ? 'opacity-100 hover:border-[#171717] hover:scale-105' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Right Arrow Button (Desktop / Tablet) */}
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right in client gallery"
            disabled={!canScrollRight}
            className={`hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 text-[#171717] border border-[#E5DFD5] shadow-sm items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-xs ${
              canScrollRight ? 'opacity-100 hover:border-[#171717] hover:scale-105' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Horizontal Gallery Track (Supports Drag, Trackpad, Touch & Snap) */}
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex gap-6 sm:gap-7 lg:gap-8 overflow-x-auto scroll-smooth pb-4 px-1 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {diaries.map((diary, index) => {
              const categoryLabel = diary.category || (diary.occasion ? diary.occasion.toUpperCase() : 'EDITORIAL');
              
              return (
                <motion.div
                  key={diary.id}
                  id={`client-diary-card-${diary.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: Math.min(index * 0.09, 0.4), 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  onClick={() => handleCardClick(diary)}
                  className="flex-none w-[84vw] sm:w-[320px] md:w-[360px] lg:w-[390px] xl:w-[410px] snap-start group cursor-pointer"
                >
                  {/* 4:5 Aspect Ratio Editorial Image Card */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ECE7DE] rounded-none shadow-xs">
                    
                    {/* High Fashion Portrait Photography */}
                    <img
                      src={diary.image}
                      alt={`${diary.author} - ${categoryLabel}`}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />

                    {/* Subtle Dark Vignette / Hover Overlay */}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 text-[#171717] text-xs font-cinzel font-semibold tracking-[0.2em] uppercase backdrop-blur-xs shadow-sm">
                          <span>VIEW STORY</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Minimal Card Information Below Image */}
                  <div className="pt-4 sm:pt-5 text-left">
                    <h3 className="font-cinzel text-sm sm:text-base font-semibold tracking-[0.14em] text-[#171717] uppercase transition-colors group-hover:text-[#A28B65]">
                      {diary.author}
                    </h3>
                    <p className="text-[11px] font-sans font-light tracking-[0.2em] text-[#77736C] uppercase mt-1">
                      {categoryLabel}
                    </p>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. MINIMAL EDITORIAL NAVIGATION CONTROLS & BOTTOM CTA */}
        {/* ========================================================================= */}
        <div className="mt-14 sm:mt-16 lg:mt-20 flex flex-col items-center justify-center gap-6">
          
          {/* Mobile / Tablet Minimal Slider Arrows */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous card"
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border border-[#D5CEC4] bg-white text-[#171717] flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft ? 'opacity-100 hover:border-[#171717]' : 'opacity-40 pointer-events-none'
              }`}
            >
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next card"
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border border-[#D5CEC4] bg-white text-[#171717] flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight ? 'opacity-100 hover:border-[#171717]' : 'opacity-40 pointer-events-none'
              }`}
            >
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Minimal Editorial Text CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button
              id="view-all-client-diaries-cta"
              onClick={() => setIsAllDiariesModalOpen(true)}
              className="group inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-cinzel font-medium tracking-[0.2em] text-[#171717] hover:text-[#A28B65] uppercase transition-colors cursor-pointer py-2"
            >
              <span>VIEW ALL CLIENT DIARIES</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>

            {onOpenReviewModal && (
              <span className="hidden sm:inline-block text-[#D5CEC4]">•</span>
            )}

            {onOpenReviewModal && (
              <button
                onClick={onOpenReviewModal}
                className="group inline-flex items-center gap-1.5 text-xs font-sans font-light tracking-[0.16em] text-[#77736C] hover:text-[#171717] uppercase transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit Your Atelier Story</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. LUXURY EDITORIAL STORY LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedDiary && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedDiary(null)} 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            />

            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-10 text-center">
              
              {/* Modal Window */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative inline-block w-full max-w-4xl p-0 my-4 overflow-hidden text-left align-middle bg-[#FAF6F0] text-[#171717] shadow-2xl border border-[#E5DFD5] transform"
              >
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedDiary(null)}
                  aria-label="Close client story modal"
                  className="absolute top-4 right-4 z-30 p-2 text-[#171717] hover:text-[#A28B65] bg-white/80 hover:bg-white transition-colors backdrop-blur-md cursor-pointer border border-[#E5DFD5] rounded-full shadow-xs"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
                  
                  {/* Left: Full Editorial Portrait */}
                  <div className="md:col-span-6 bg-[#ECE7DE] relative min-h-[360px] md:min-h-full overflow-hidden">
                    <img
                      src={selectedDiary.image}
                      alt={selectedDiary.author}
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Floating Category Pill */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3.5 py-1.5 bg-black/75 backdrop-blur-md text-[11px] font-cinzel font-medium tracking-[0.2em] text-white uppercase">
                        {selectedDiary.category || (selectedDiary.occasion ? selectedDiary.occasion.split('&')[0].trim() : 'EDITORIAL')}
                      </span>
                    </div>
                  </div>

                  {/* Right: Bespoke Story, Craft Details & Consultation CTA */}
                  <div className="md:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#FAF6F0]">
                    
                    <div className="space-y-5">
                      
                      {/* Eyebrow & Client Name */}
                      <div>
                        <span className="text-[11px] font-sans tracking-[0.25em] text-[#77736C] uppercase block mb-1.5">
                          PATRON LOOKBOOK
                        </span>
                        <h2 className="font-cinzel text-2xl sm:text-3xl font-normal text-[#171717] tracking-[0.14em] uppercase">
                          {selectedDiary.author}
                        </h2>

                        {/* Location & Date */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#77736C] font-light mt-2">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#A28B65]" />
                            {selectedDiary.venue || selectedDiary.city}
                          </span>
                          {selectedDiary.date && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#A28B65]" />
                                {selectedDiary.date}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Editorial Quote */}
                      <div className="py-4 border-y border-[#E5DFD5]">
                        <blockquote className="font-serif-luxury italic text-sm sm:text-base text-[#2C2420] leading-relaxed">
                          "{selectedDiary.quote}"
                        </blockquote>
                      </div>

                      {/* Ensemble & Craftsmanship Details */}
                      <div className="space-y-2">
                        <span className="text-[10.5px] font-cinzel font-semibold uppercase tracking-[0.2em] text-[#A28B65] block">
                          ENSEMBLE & ATELIER DETAILS
                        </span>
                        <p className="text-xs font-cinzel text-[#171717] font-medium tracking-wide">
                          {selectedDiary.outfit}
                        </p>
                        {selectedDiary.craftDetails && (
                          <p className="text-xs font-sans text-[#77736C] leading-relaxed font-light mt-1">
                            {selectedDiary.craftDetails}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Modal Footer Actions */}
                    <div className="pt-6 border-t border-[#E5DFD5] flex flex-col sm:flex-row items-center gap-3">
                      
                      <button
                        onClick={() => {
                          const outfitName = selectedDiary.outfit;
                          setSelectedDiary(null);
                          if (onBookAppointment) {
                            onBookAppointment(`Bespoke styling inspired by ${selectedDiary.author}'s ${outfitName}`);
                          } else {
                            const el = document.getElementById('book-appointment-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#171717] hover:bg-[#380810] text-white text-xs font-cinzel font-medium tracking-[0.18em] uppercase transition-colors cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#E6CA65]" />
                        <span>BOOK CONSULTATION FOR THIS LOOK</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(selectedDiary, e)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 bg-white hover:bg-[#F2ECE1] text-[#171717] border border-[#E5DFD5] text-xs font-cinzel font-medium tracking-wider transition-colors cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'COPIED' : 'SHARE'}</span>
                      </button>

                    </div>

                  </div>

                </div>

              </motion.div>

            </div>

          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. ALL CLIENT DIARIES FULL EDITORIAL ARCHIVE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAllDiariesModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllDiariesModalOpen(false)} 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            />

            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-10 text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 20 }}
                className="relative inline-block w-full max-w-6xl p-6 sm:p-10 my-6 overflow-hidden text-left align-middle bg-[#F7F4EE] text-[#171717] shadow-2xl border border-[#E5DFD5]"
              >
                {/* Header with Close */}
                <div className="flex items-center justify-between pb-6 border-b border-[#E5DFD5] mb-8">
                  <div>
                    <span className="text-xs font-sans font-medium tracking-[0.25em] text-[#77736C] uppercase block mb-1">
                      EDITORIAL ARCHIVE
                    </span>
                    <h2 className="font-cinzel text-2xl sm:text-3xl font-normal tracking-[0.16em] uppercase">
                      CLIENT DIARIES
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsAllDiariesModalOpen(false)}
                    className="p-2 text-[#171717] hover:text-[#A28B65] bg-white border border-[#E5DFD5] rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Grid of All Client Stories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                  {diaries.map((diary) => {
                    const categoryLabel = diary.category || (diary.occasion ? diary.occasion.toUpperCase() : 'EDITORIAL');
                    return (
                      <div
                        key={diary.id}
                        onClick={() => {
                          setIsAllDiariesModalOpen(false);
                          setSelectedDiary(diary);
                        }}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ECE7DE] rounded-none">
                          <img
                            src={diary.image}
                            alt={diary.author}
                            loading="lazy"
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="px-4 py-2 bg-white text-[#171717] text-[11px] font-cinzel font-semibold tracking-[0.2em] uppercase">
                              VIEW STORY
                            </span>
                          </div>
                        </div>
                        <div className="pt-3.5">
                          <h4 className="font-cinzel text-sm font-semibold tracking-[0.14em] text-[#171717] uppercase group-hover:text-[#A28B65] transition-colors">
                            {diary.author}
                          </h4>
                          <p className="text-[10.5px] font-sans font-light tracking-[0.2em] text-[#77736C] uppercase mt-0.5">
                            {categoryLabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
