import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Compass, ShieldCheck } from 'lucide-react';
import { ARCH_CLIP_PATH_D, ARCH_STROKE_PATH_D, ARCH_OUTER_STROKE_PATH_D } from './ArchShape';
import defaultHeroModelImage from '../assets/images/label_sw_hero_1787218151727.jpg';
import { HeroCMSContent } from '../types';

interface HeroProps {
  onExploreClick: () => void;
  onOpenAppointment: () => void;
  cmsContent?: HeroCMSContent;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenAppointment, cmsContent }) => {
  const layout = cmsContent?.bannerLayout || 'full-size';
  const tagline = cmsContent?.tagline ?? 'Autumn / Festive Couture & Ready-to-Wear';
  const headlinePart1 = cmsContent?.headlinePart1 ?? '';
  const headlinePart2 = cmsContent?.headlinePart2 ?? '';
  const italicSubline = cmsContent?.italicSubline ?? '';
  const description = cmsContent?.description ?? '';
  const exploreButtonText = cmsContent?.exploreButtonText || 'EXPLORE COLLECTION';
  const consultButtonText = cmsContent?.consultButtonText || 'Bespoke Atelier Consultation';
  const scriptCalloutLine1 = cmsContent?.scriptCalloutLine1 || 'elegance';
  const scriptCalloutLine2 = cmsContent?.scriptCalloutLine2 || 'is in';
  const scriptCalloutLine3 = cmsContent?.scriptCalloutLine3 || 'the details.';
  
  const heroImageSrc = cmsContent?.heroImage && cmsContent.heroImage.trim() !== '' ? cmsContent.heroImage : defaultHeroModelImage;
  const floatingBadgeTitle = cmsContent?.floatingBadgeTitle || 'Label SW Atelier';
  const floatingBadgeSubtitle = cmsContent?.floatingBadgeSubtitle || 'Festive Royal Menswear';
  
  const stat1Value = cmsContent?.stat1Value || '100%';
  const stat1Label = cmsContent?.stat1Label || 'Handcrafted';
  const stat2Value = cmsContent?.stat2Value || 'Pure';
  const stat2Label = cmsContent?.stat2Label || 'Natural Silks';
  const stat3Value = cmsContent?.stat3Value || 'Custom';
  const stat3Label = cmsContent?.stat3Label || 'Fit Available';

  // Dynamic Banner Slides for Full-Size Luxury Carousel
  const bannerSlides = useMemo(() => {
    if (cmsContent?.bannerImages && cmsContent.bannerImages.length > 0) {
      return cmsContent.bannerImages
        .filter((img) => img && img.trim() !== '')
        .map((img, idx) => ({
          image: img,
          subtitle: idx === 0 ? (floatingBadgeSubtitle || 'Festive Royal Atelier') : `Atelier Campaign Vol. ${idx + 1}`,
          caption: idx === 0 ? 'Bespoke Haute Couture & Handwoven Silks' : 'Artisanal Heritage Craftsmanship'
        }));
    }

    if (cmsContent?.heroImage && cmsContent.heroImage.trim() !== '') {
      return [
        {
          image: cmsContent.heroImage,
          subtitle: floatingBadgeSubtitle || 'Festive Royal Atelier',
          caption: 'Bespoke Haute Couture & Handwoven Silks'
        },
        {
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop',
          subtitle: 'Heritage Zardozi & Weaves',
          caption: 'Pure Banarasi & Chanderi Craft'
        }
      ];
    }

    // Default Curated Atelier Presets
    return [
      {
        image: defaultHeroModelImage,
        subtitle: 'Festive Royal Atelier',
        caption: 'Bespoke Sherwanis & Handwoven Silks'
      },
      {
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop',
        subtitle: 'Heritage Zardozi & Weaves',
        caption: 'Pure Banarasi & Chanderi Craft'
      },
      {
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1920&auto=format&fit=crop',
        subtitle: 'Celebratory Festive Splendour',
        caption: 'Contemporary Cuts & Gota Patti'
      },
      {
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1920&auto=format&fit=crop',
        subtitle: 'Pure Handspun Raw Silks',
        caption: 'Modern Draped Silhouettes'
      }
    ];
  }, [cmsContent?.bannerImages, cmsContent?.heroImage, floatingBadgeSubtitle]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through slides gently if not hovered
  useEffect(() => {
    if (isHovered || layout !== 'full-size') return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, layout, bannerSlides.length]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  // 1. FULL SIZE HERO BANNER IMAGE PRESENTATION (Default)
  if (layout === 'full-size') {
    return (
      <section
        id="hero-section"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[86vh] min-h-[440px] max-h-[920px] overflow-hidden bg-[#160E0B] select-none"
      >
        {/* Full Size Background Banner Images (Cross-fading) */}
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSlide === index ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            }`}
            style={{ transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 8s ease-out' }}
          >
            <img
              id={`hero-full-banner-image-${index}`}
              src={slide.image}
              alt="Label SW Haute Couture Atelier Collection"
              className="w-full h-full object-cover object-center filter contrast-[1.02]"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}

        {/* Subtle Edge Gradients for Depth */}
        <div className="absolute inset-0 z-15 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Floating Carousel Navigation Controls (Left & Right Arrows) */}
        {bannerSlides.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-25 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#9E472A] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 shadow-xl hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handleNextSlide}
              aria-label="Next Slide"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-25 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#9E472A] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 shadow-xl hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Bottom Minimal Indicator Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
              {bannerSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === i ? 'w-8 bg-[#E08A68]' : 'w-2 bg-white/50 hover:bg-white/90'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    );
  }

  // 2. SPLIT ARCH PORTAL LAYOUT (Fallback if selected in CMS)
  return (
    <section id="hero-section" className="relative w-full overflow-hidden bg-[#FAF6F0] py-8 md:py-14 lg:py-16">
      {/* Subtle Background Texture & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#E8D7C5_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F3D7C5]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-[#9E472A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 z-10">
            {tagline && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3E8DB] border border-[#DFCBB8] text-[#8C3F24] text-xs tracking-widest uppercase font-cinzel font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tagline}</span>
              </div>
            )}

            {(headlinePart1 || headlinePart2 || italicSubline) && (
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-cinzel font-bold text-[#2C2420] tracking-tight leading-[1.05]">
                {headlinePart1 && <>{headlinePart1} <br /></>}
                {headlinePart2 && <><span className="tracking-wide">{headlinePart2}</span> <br /></>}
                {italicSubline && (
                  <span className="font-serif-luxury italic font-normal text-[#9E472A] block mt-1 tracking-normal font-playfair">
                    {italicSubline}
                  </span>
                )}
              </h1>
            )}

            {description && (
              <p className="text-[#685C54] text-base sm:text-lg max-w-lg leading-relaxed font-normal">
                {description}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="hero-explore-button"
                onClick={onExploreClick}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#9E472A] hover:bg-[#85371D] text-white text-xs sm:text-sm font-cinzel font-semibold tracking-[0.2em] uppercase rounded-sm transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{exploreButtonText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                id="hero-book-consult-button"
                onClick={onOpenAppointment}
                className="inline-flex items-center justify-center px-6 py-4 bg-[#52131D] hover:bg-[#681926] text-white text-xs sm:text-sm font-cinzel font-semibold tracking-[0.16em] uppercase rounded-sm border border-[#7A1C2B] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <span className="text-white">{consultButtonText}</span>
              </button>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#E8DACB] max-w-md text-center">
              <div>
                <span className="block font-serif-luxury text-2xl font-bold text-[#9E472A]">{stat1Value}</span>
                <span className="text-[11px] text-[#7A6F68] uppercase font-cinzel tracking-wider">{stat1Label}</span>
              </div>
              <div>
                <span className="block font-serif-luxury text-2xl font-bold text-[#9E472A]">{stat2Value}</span>
                <span className="text-[11px] text-[#7A6F68] uppercase font-cinzel tracking-wider">{stat2Label}</span>
              </div>
              <div>
                <span className="block font-serif-luxury text-2xl font-bold text-[#9E472A]">{stat3Value}</span>
                <span className="text-[11px] text-[#7A6F68] uppercase font-cinzel tracking-wider">{stat3Label}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Arched Model Image */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center mt-6 lg:mt-0">
            <div className="absolute top-2 right-4 sm:right-10 md:right-16 z-20 text-right pointer-events-none">
              <div className="font-script text-3xl sm:text-4xl md:text-5xl text-[#6D4939] leading-none select-none drop-shadow-xs">
                {scriptCalloutLine1}
              </div>
              <div className="font-script text-2xl sm:text-3xl text-[#8E5844] italic -mt-1 select-none">
                {scriptCalloutLine2}
              </div>
              <div className="font-script text-3xl sm:text-4xl text-[#5A382A] -mt-1 select-none flex items-center justify-end gap-1">
                <span>{scriptCalloutLine3}</span>
                <div className="w-10 h-[1px] bg-[#9E472A]/50 inline-block ml-1" />
              </div>
            </div>

            <div className="relative w-full max-w-[460px]">
              <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
                <defs>
                  <clipPath id="hero-mughal-arch-clip" clipPathUnits="objectBoundingBox">
                    <path d={ARCH_CLIP_PATH_D} />
                  </clipPath>
                </defs>
              </svg>

              <div className="relative aspect-[3/4] sm:aspect-[3.2/4] p-3">
                <div 
                  className="w-full h-full relative overflow-hidden bg-[#E9D9C7] shadow-2xl"
                  style={{ clipPath: 'url(#hero-mughal-arch-clip)' }}
                >
                  <img
                    id="hero-model-image"
                    src={heroImageSrc}
                    alt="Label SW by Shikha Warule couture collection"
                    className="w-full h-full object-cover object-top filter contrast-[1.03] transition-transform duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420]/35 via-transparent to-transparent pointer-events-none" />
                </div>

                <svg
                  viewBox="0 0 300 400"
                  preserveAspectRatio="none"
                  className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] pointer-events-none drop-shadow-md"
                  aria-hidden="true"
                >
                  <path
                    d={ARCH_OUTER_STROKE_PATH_D}
                    fill="none"
                    stroke="#DFCBB8"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <path
                    d={ARCH_STROKE_PATH_D}
                    fill="none"
                    stroke="#9E472A"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-28 sm:w-36 md:w-44 z-20 pointer-events-none drop-shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop"
                  alt="Terracotta botanical arrangement"
                  className="w-full h-auto rounded-full object-cover aspect-square border-4 border-[#FAF6F0] shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="absolute bottom-6 -left-4 sm:-left-6 z-20 bg-[#FAF6F0]/95 backdrop-blur-md border border-[#E3D3C1] py-2 px-3.5 rounded-lg shadow-lg">
                <span className="text-[10px] uppercase tracking-widest font-cinzel text-[#9E472A] font-semibold block">{floatingBadgeTitle}</span>
                <span className="text-xs font-serif-luxury italic text-[#2C2420]">{floatingBadgeSubtitle}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
