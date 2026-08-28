import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  X, 
  Sparkles, 
  Share2, 
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CLIENT_DIARIES } from '../data/mockData';
import { ClientDiary } from '../types';

export interface ClientStoryItem {
  id: string;
  name: string;
  category: string;
  image: string;
  objectPosition?: string;
  city?: string;
  occasion?: string;
  venue?: string;
  outfit?: string;
  quote?: string;
  craftDetails?: string;
  date?: string;
}

// Initial client editorial dataset with refined object-positions for luxury framing
export const INITIAL_CLIENTS: ClientStoryItem[] = [
  {
    id: 'client-1',
    name: 'PARTIK KALARIA',
    category: 'WEDDING EDIT',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    objectPosition: 'center 18%',
    city: 'London / Ahmedabad',
    occasion: 'Heritage Palace Wedding',
    venue: 'Laxmi Vilas Palace, Vadodara',
    outfit: 'Ivory & Antique Gold Jamdani Weave Kurta Set',
    quote: 'Ordering from overseas via virtual atelier consultation was seamless. The precision of bespoke measurements and craftsmanship arrived flawlessly tailored.',
    craftDetails: 'Woven on vintage pit looms in Maheshwar with pure gold zari threads and featherlight mulmul base.',
    date: 'January 2026'
  },
  {
    id: 'client-2',
    name: 'CHIRON SINGHVI',
    category: 'CELEBRATION EDIT',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop',
    objectPosition: 'center 20%',
    city: 'Mumbai',
    occasion: 'Grand Reception & Soirée',
    venue: 'The Taj Mahal Palace, Mumbai',
    outfit: 'Bespoke Mulberry Silk Bandhgala with Mughal Pintucks',
    quote: 'The drape and comfort of the pure mulberry silk was unparalleled. Label Shikha Warule masterfully captured a timeless, minimalist heritage aesthetic that everyone admired.',
    craftDetails: 'Handcrafted with signature geometric Mughal pintucks, horn buttons, and breathable organza lining.',
    date: 'January 2026'
  },
  {
    id: 'client-3',
    name: 'DEEPAK ROONWAL',
    category: 'GROOM EDIT',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
    objectPosition: 'center 15%',
    city: 'Delhi NCR',
    occasion: 'Royal Sunset Pheras & Cocktail',
    venue: 'Fairmont, Jaipur',
    outfit: 'Raw Silk Textured Sherwani & Handwoven Zari Stole',
    quote: 'From the initial sketch to the final fitting, every cut accentuated movement and majesty. The handloom texture caught the twilight glow perfectly.',
    craftDetails: 'Handcrafted raw silk featuring antique dabka work and hand-hammered brass insignia buttons.',
    date: 'February 2026'
  },
  {
    id: 'client-4',
    name: 'NAMAN',
    category: 'WEDDING EDIT',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop',
    objectPosition: 'center 22%',
    city: 'Jaipur',
    occasion: 'Courtyard Sangeet Festivities',
    venue: 'Alila Fort Bishangarh',
    outfit: 'Draped Angrakha Silk Kurta & Tailored Churidar',
    quote: 'The subtle asymmetrical drape and fluid movement made dancing effortless while retaining regal poise throughout the night.',
    craftDetails: 'Fluid chanderi silk with tonal geometric aari threadwork along the neckline and cuffs.',
    date: 'December 2025'
  },
  {
    id: 'client-5',
    name: 'BHAVIK SOMAIYA',
    category: 'OCCASION EDIT',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop',
    objectPosition: 'center 18%',
    city: 'Pune',
    occasion: 'Festive Diwali Soirée & Gala',
    venue: 'JW Marriott, Pune',
    outfit: 'Textured Matka Silk Achkan with Tone-on-Tone Needlepainting',
    quote: 'Pure bespoke perfection. The attention to shoulder structure and custom hand-embroidery makes it my finest investment wardrobe piece.',
    craftDetails: 'Textured matka silk with tone-on-tone French knots and hand-cast copper filigree buttons.',
    date: 'October 2025'
  },
  {
    id: 'client-6',
    name: 'SANJAY',
    category: 'CELEBRATION EDIT',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    objectPosition: 'center 25%',
    city: 'Udaipur',
    occasion: 'Lakefront Evening Soirée',
    venue: 'Oberoi Udaivilas, Udaipur',
    outfit: 'Midnight Obsidian Velvet Bandhgala with Resham Needlework',
    quote: 'The velvet weight is structured yet light as air. The understated collar embroidery is a testament to true artisanal mastery.',
    craftDetails: 'Silk velvet tailored with micro-resham French knots and hand-cut mother-of-pearl buttons.',
    date: 'November 2025'
  }
];

// =========================================================================
// SUB-COMPONENT: 1. ClientDiariesHeader (Left-Aligned Minimal Editorial Header)
// =========================================================================
interface ClientDiariesHeaderProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export const ClientDiariesHeader: React.FC<ClientDiariesHeaderProps> = ({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 lg:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl"
      >
        {/* Eyebrow */}
        <span className="text-[11px] sm:text-xs font-sans font-medium tracking-[0.32em] text-[#77736C] uppercase mb-3 block">
          OUR CLIENTS
        </span>

        {/* Large Editorial Heading */}
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.14em] text-[#171717] uppercase leading-[1.15]">
          CLIENT DIARIES
        </h2>

        {/* Supporting Editorial Manifesto */}
        <p className="font-sans text-sm sm:text-base text-[#77736C] font-light tracking-wide leading-relaxed mt-3.5 sm:mt-4 max-w-xl">
          A glimpse into the moments, celebrations and stories created with our clients.
        </p>
      </motion.div>

      {/* Desktop Navigation Controls (Top Right) */}
      <div className="hidden md:flex items-center gap-6 mt-6 md:mt-0 self-end">
        <ClientDiariesControls
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={onScrollLeft}
          onScrollRight={onScrollRight}
        />
      </div>
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: 2. ClientDiaryCard (Fixed Editorial Ratio, Image Hover & Typography)
// =========================================================================
interface ClientDiaryCardProps {
  client: ClientStoryItem;
  index: number;
  onSelect: (client: ClientStoryItem) => void;
}

export const ClientDiaryCard: React.FC<ClientDiaryCardProps> = ({
  client,
  index,
  onSelect,
}) => {
  return (
    <motion.div
      id={`client-diary-card-${client.id}`}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: Math.min(index * 0.09, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => onSelect(client)}
      className="flex-none snap-start group cursor-pointer select-none"
      style={{
        /* Responsive Card Width:
           - Desktop: 27-29vw (min 330px, max 420px) -> produces 3 full cards + ~25-35% of the 4th card
           - Tablet: ~42vw (min 280px, max 340px) -> produces 2 full cards + ~25% of 3rd card
           - Mobile: 82-86vw (min 290px, max 360px) -> produces 1 full card + ~14% of 2nd card
        */
        width: 'var(--diary-card-width, clamp(330px, 28vw, 420px))',
      }}
    >
      {/* Editorial Image Container (aspect ratio 0.72 / 1 or approx 4:5, height ~480-570px) */}
      <div 
        className="relative w-full aspect-[0.72/1] overflow-hidden bg-[#ECE7DE] rounded-none shadow-none"
        style={{ borderRadius: '0px' }}
      >
        {/* High-Resolution Fashion Photograph with Individual Positioning */}
        <img
          src={client.image}
          alt={`${client.name} — ${client.category}`}
          loading="lazy"
          style={{ objectPosition: client.objectPosition || 'center 20%' }}
          className="w-full h-full object-cover transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        {/* Subtle Dark Vignette Overlay (0.12–0.18 opacity) */}
        <div className="absolute inset-0 bg-black/16 opacity-0 group-hover:opacity-100 transition-opacity duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none flex items-end justify-center pb-8 sm:pb-10">
          {/* VIEW STORY Reveal Pill */}
          <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 text-[#171717] text-[11px] sm:text-xs font-cinzel font-semibold tracking-[0.22em] uppercase backdrop-blur-xs shadow-xs">
              <span>VIEW STORY</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>

      {/* Minimal Card Information Below Image */}
      <div className="pt-4 sm:pt-5 text-left">
        <h3 className="font-cinzel text-sm sm:text-base font-semibold tracking-[0.14em] text-[#171717] uppercase transition-colors group-hover:text-[#A28B65]">
          {client.name}
        </h3>
        <p className="text-[11px] font-sans font-light tracking-[0.22em] text-[#77736C] uppercase mt-1">
          {client.category}
        </p>
      </div>
    </motion.div>
  );
};

// =========================================================================
// SUB-COMPONENT: 3. ClientDiariesControls (Minimal Text/Arrow Controls)
// =========================================================================
interface ClientDiariesControlsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export const ClientDiariesControls: React.FC<ClientDiariesControlsProps> = ({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}) => {
  return (
    <div className="inline-flex items-center gap-4">
      {/* Left Arrow Button */}
      <button
        onClick={onScrollLeft}
        aria-label="Scroll gallery left"
        disabled={!canScrollLeft}
        className={`group p-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
          canScrollLeft
            ? 'text-[#171717] hover:text-[#A28B65]'
            : 'text-[#C5BFAF] opacity-40 cursor-not-allowed'
        }`}
      >
        <ArrowLeft className="w-5 h-5 stroke-[1.4] transition-transform duration-300 group-hover:-translate-x-1" />
      </button>

      <span className="h-3.5 w-px bg-[#DCD5C9]" />

      {/* Right Arrow Button */}
      <button
        onClick={onScrollRight}
        aria-label="Scroll gallery right"
        disabled={!canScrollRight}
        className={`group p-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
          canScrollRight
            ? 'text-[#171717] hover:text-[#A28B65]'
            : 'text-[#C5BFAF] opacity-40 cursor-not-allowed'
        }`}
      >
        <ArrowRight className="w-5 h-5 stroke-[1.4] transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: 4. ClientDiariesCarousel (Horizontal Scrolling Track & Snap)
// =========================================================================
interface ClientDiariesCarouselProps {
  clients: ClientStoryItem[];
  onSelectClient: (client: ClientStoryItem) => void;
  sliderRef: React.RefObject<HTMLDivElement | null>;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUpOrLeave: () => void;
}

export const ClientDiariesCarousel: React.FC<ClientDiariesCarouselProps> = ({
  clients,
  onSelectClient,
  sliderRef,
  onMouseDown,
  onMouseMove,
  onMouseUpOrLeave,
}) => {
  return (
    <div
      ref={sliderRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUpOrLeave}
      onMouseLeave={onMouseUpOrLeave}
      className="w-full flex gap-6 sm:gap-7 lg:gap-8 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {clients.map((client, index) => (
        <ClientDiaryCard
          key={client.id}
          client={client}
          index={index}
          onSelect={onSelectClient}
        />
      ))}

      {/* Trailing padding space so last card can be brought into full view comfortably */}
      <div className="flex-none w-[4vw] pointer-events-none" />
    </div>
  );
};

// =========================================================================
// MAIN COMPONENT: <ClientDiaries />
// =========================================================================
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
  const [selectedStory, setSelectedStory] = useState<ClientStoryItem | null>(null);
  const [isAllDiariesModalOpen, setIsAllDiariesModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Drag & Scroll state
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Normalize incoming diaries or fallback to luxury editorial initial clients
  const clients: ClientStoryItem[] = React.useMemo(() => {
    if (diariesList && diariesList.length > 0) {
      return diariesList.map((d, index) => ({
        id: d.id || `client-${index + 1}`,
        name: d.author.toUpperCase(),
        category: d.category || (d.occasion ? d.occasion.toUpperCase() : 'EDITORIAL'),
        image: d.image || INITIAL_CLIENTS[index % INITIAL_CLIENTS.length].image,
        objectPosition: INITIAL_CLIENTS[index % INITIAL_CLIENTS.length]?.objectPosition || 'center 20%',
        city: d.city,
        occasion: d.occasion,
        venue: d.venue,
        outfit: d.outfit,
        quote: d.quote,
        craftDetails: d.craftDetails,
        date: d.date,
      }));
    }
    return INITIAL_CLIENTS;
  }, [diariesList]);

  // Update arrow states based on scroll position
  const updateScrollButtons = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateScrollButtons, { passive: true });
      updateScrollButtons();
      window.addEventListener('resize', updateScrollButtons);
      return () => {
        slider.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [updateScrollButtons, clients]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.clientWidth * (window.innerWidth < 768 ? 0.85 : 0.65);
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
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
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 6) {
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

  const handleSelectClient = (client: ClientStoryItem) => {
    if (!hasDraggedRef.current) {
      setSelectedStory(client);
    }
  };

  const handleShare = (story: ClientStoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${story.name} — Client Diaries | Label Shikha Warule`,
        text: `Explore ${story.name}'s bespoke ensemble (${story.category}).`,
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
      className="w-full bg-[#F7F4EE] text-[#171717] py-24 sm:py-28 lg:py-32 overflow-hidden transition-colors"
      style={{
        // Define card width CSS variable matching responsive breakpoints
        // Desktop (>=1200px): clamp(330px, 28vw, 420px)
        // Tablet (768px-1199px): clamp(280px, 42vw, 360px)
        // Mobile (<=767px): clamp(280px, 84vw, 360px)
      }}
    >
      <style>{`
        #client-diaries-section {
          --diary-card-width: clamp(290px, 84vw, 350px);
        }
        @media (min-width: 768px) {
          #client-diaries-section {
            --diary-card-width: clamp(300px, 40vw, 370px);
          }
        }
        @media (min-width: 1200px) {
          #client-diaries-section {
            --diary-card-width: clamp(330px, 27.5vw, 420px);
          }
        }
      `}</style>

      {/* Full-width container with 3-4vw horizontal inset padding, bleeding out on the right */}
      <div className="w-full pl-[4vw] sm:pl-[4vw] lg:pl-[4.5vw] pr-0">
        
        {/* 1. Header (Left-aligned with start of image gallery) */}
        <div className="pr-[4vw] sm:pr-[4vw] lg:pr-[4.5vw]">
          <ClientDiariesHeader
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            onScrollLeft={() => handleScroll('left')}
            onScrollRight={() => handleScroll('right')}
          />
        </div>

        {/* 2. Horizontal Editorial Gallery Track */}
        <ClientDiariesCarousel
          clients={clients}
          onSelectClient={handleSelectClient}
          sliderRef={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUpOrLeave={handleMouseUpOrLeave}
        />

        {/* 3. Bottom Controls & Minimal Editorial CTA */}
        <div className="mt-12 sm:mt-14 lg:mt-16 pr-[4vw] sm:pr-[4vw] lg:pr-[4.5vw] flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Mobile Bottom Arrow Controls */}
          <div className="flex md:hidden items-center justify-center">
            <ClientDiariesControls
              canScrollLeft={canScrollLeft}
              canScrollRight={canScrollRight}
              onScrollLeft={() => handleScroll('left')}
              onScrollRight={() => handleScroll('right')}
            />
          </div>

          {/* Minimal Editorial Text CTA */}
          <div className="flex items-center gap-6 sm:ml-auto">
            <button
              id="view-all-client-diaries-cta"
              onClick={() => setIsAllDiariesModalOpen(true)}
              className="group inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-cinzel font-medium tracking-[0.22em] text-[#171717] hover:text-[#A28B65] uppercase transition-colors cursor-pointer py-2"
            >
              <span>VIEW ALL CLIENT DIARIES</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>

            {onOpenReviewModal && (
              <>
                <span className="hidden sm:inline-block text-[#D5CEC4]">•</span>
                <button
                  onClick={onOpenReviewModal}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans font-light tracking-[0.18em] text-[#77736C] hover:text-[#171717] uppercase transition-colors cursor-pointer"
                >
                  <span>Submit Atelier Story</span>
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. LUXURY EDITORIAL STORY LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedStory(null)} 
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
                  onClick={() => setSelectedStory(null)}
                  aria-label="Close client story modal"
                  className="absolute top-4 right-4 z-30 p-2 text-[#171717] hover:text-[#A28B65] bg-white/80 hover:bg-white transition-colors backdrop-blur-md cursor-pointer border border-[#E5DFD5] rounded-full shadow-xs"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
                  
                  {/* Left: Full Editorial Portrait */}
                  <div className="md:col-span-6 bg-[#ECE7DE] relative min-h-[360px] md:min-h-full overflow-hidden">
                    <img
                      src={selectedStory.image}
                      alt={selectedStory.name}
                      style={{ objectPosition: selectedStory.objectPosition || 'center 20%' }}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating Category Pill */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3.5 py-1.5 bg-black/75 backdrop-blur-md text-[11px] font-cinzel font-medium tracking-[0.2em] text-white uppercase">
                        {selectedStory.category}
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
                          {selectedStory.name}
                        </h2>

                        {/* Location & Date */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#77736C] font-light mt-2">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#A28B65]" />
                            {selectedStory.venue || selectedStory.city || 'Atelier Consultation'}
                          </span>
                          {selectedStory.date && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#A28B65]" />
                                {selectedStory.date}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Editorial Quote */}
                      {selectedStory.quote && (
                        <div className="py-4 border-y border-[#E5DFD5]">
                          <blockquote className="font-serif-luxury italic text-sm sm:text-base text-[#2C2420] leading-relaxed">
                            "{selectedStory.quote}"
                          </blockquote>
                        </div>
                      )}

                      {/* Ensemble & Craftsmanship Details */}
                      {selectedStory.outfit && (
                        <div className="space-y-2">
                          <span className="text-[10.5px] font-cinzel font-semibold uppercase tracking-[0.2em] text-[#A28B65] block">
                            ENSEMBLE & ATELIER DETAILS
                          </span>
                          <p className="text-xs font-cinzel text-[#171717] font-medium tracking-wide">
                            {selectedStory.outfit}
                          </p>
                          {selectedStory.craftDetails && (
                            <p className="text-xs font-sans text-[#77736C] leading-relaxed font-light mt-1">
                              {selectedStory.craftDetails}
                            </p>
                          )}
                        </div>
                      )}

                    </div>

                    {/* Modal Footer Actions */}
                    <div className="pt-6 border-t border-[#E5DFD5] flex flex-col sm:flex-row items-center gap-3">
                      
                      <button
                        onClick={() => {
                          const outfitName = selectedStory.outfit || selectedStory.name;
                          setSelectedStory(null);
                          if (onBookAppointment) {
                            onBookAppointment(`Bespoke styling inspired by ${selectedStory.name}'s ${outfitName}`);
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
                        onClick={(e) => handleShare(selectedStory, e)}
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
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => {
                        setIsAllDiariesModalOpen(false);
                        setSelectedStory(client);
                      }}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[0.72/1] w-full overflow-hidden bg-[#ECE7DE] rounded-none">
                        <img
                          src={client.image}
                          alt={client.name}
                          loading="lazy"
                          style={{ objectPosition: client.objectPosition || 'center 20%' }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-black/16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="px-4 py-2 bg-white text-[#171717] text-[11px] font-cinzel font-semibold tracking-[0.2em] uppercase">
                            VIEW STORY
                          </span>
                        </div>
                      </div>
                      <div className="pt-3.5">
                        <h4 className="font-cinzel text-sm font-semibold tracking-[0.14em] text-[#171717] uppercase group-hover:text-[#A28B65] transition-colors">
                          {client.name}
                        </h4>
                        <p className="text-[10.5px] font-sans font-light tracking-[0.2em] text-[#77736C] uppercase mt-0.5">
                          {client.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
