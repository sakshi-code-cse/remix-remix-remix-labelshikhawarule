import React, { useState } from 'react';
import { X, MapPin, Calendar, Sparkles, Share2, Check, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClientDiary } from '../types';
import { HorizontalScrollSection } from './common/HorizontalScrollSection';

export interface ClientItem {
  id?: string;
  name: string;
  image: string;
  category?: string;
  city?: string;
  occasion?: string;
  venue?: string;
  outfit?: string;
  quote?: string;
  craftDetails?: string;
  date?: string;
}

export const DEFAULT_CLIENTS: ClientItem[] = [
  {
    id: 'client-01',
    name: "PARTIK KALARIA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    category: "WEDDING EDIT",
    city: "London / Ahmedabad",
    occasion: "Heritage Palace Wedding",
    venue: "Laxmi Vilas Palace, Vadodara",
    outfit: "Ivory & Antique Gold Jamdani Weave Kurta Set",
    quote: "Ordering from overseas via virtual atelier consultation was seamless. The precision of bespoke measurements and craftsmanship arrived flawlessly tailored.",
    craftDetails: "Woven on vintage pit looms in Maheshwar with pure gold zari threads and featherlight mulmul base.",
    date: "January 2026"
  },
  {
    id: 'client-02',
    name: "CHIRON SINGHVI",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
    category: "CELEBRATION EDIT",
    city: "Mumbai",
    occasion: "Grand Reception & Soirée",
    venue: "The Taj Mahal Palace, Mumbai",
    outfit: "Bespoke Mulberry Silk Bandhgala with Mughal Pintucks",
    quote: "The drape and comfort of the pure mulberry silk was unparalleled. Label Shikha Warule masterfully captured a timeless, minimalist heritage aesthetic that everyone admired.",
    craftDetails: "Handcrafted with signature geometric Mughal pintucks, horn buttons, and breathable organza lining.",
    date: "January 2026"
  },
  {
    id: 'client-03',
    name: "DEEPAK ROONWAL",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    category: "GROOM EDIT",
    city: "Delhi NCR",
    occasion: "Royal Sunset Pheras & Cocktail",
    venue: "Fairmont, Jaipur",
    outfit: "Raw Silk Textured Sherwani & Handwoven Zari Stole",
    quote: "From the initial sketch to the final fitting, every cut accentuated movement and majesty. The handloom texture caught the twilight glow perfectly.",
    craftDetails: "Handcrafted raw silk featuring antique dabka work and hand-hammered brass insignia buttons.",
    date: "February 2026"
  },
  {
    id: 'client-04',
    name: "NAMAN",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
    category: "WEDDING EDIT",
    city: "Jaipur",
    occasion: "Courtyard Sangeet Festivities",
    venue: "Alila Fort Bishangarh",
    outfit: "Draped Angrakha Silk Kurta & Tailored Churidar",
    quote: "The subtle asymmetrical drape and fluid movement made dancing effortless while retaining regal poise throughout the night.",
    craftDetails: "Fluid chanderi silk with tonal geometric aari threadwork along the neckline and cuffs.",
    date: "December 2025"
  },
  {
    id: 'client-05',
    name: "BHAVIK SOMAIYA",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop",
    category: "OCCASION EDIT",
    city: "Pune",
    occasion: "Festive Diwali Soirée & Gala",
    venue: "JW Marriott, Pune",
    outfit: "Textured Matka Silk Achkan with Tone-on-Tone Needlepainting",
    quote: "Pure bespoke perfection. The attention to shoulder structure and custom hand-embroidery makes it my finest investment wardrobe piece.",
    craftDetails: "Textured matka silk with tone-on-tone French knots and hand-cast copper filigree buttons.",
    date: "October 2025"
  },
  {
    id: 'client-06',
    name: "SANJAY",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    category: "CELEBRATION EDIT",
    city: "Udaipur",
    occasion: "Lakefront Evening Soirée",
    venue: "Oberoi Udaivilas, Udaipur",
    outfit: "Midnight Obsidian Velvet Bandhgala with Resham Needlework",
    quote: "The velvet weight is structured yet light as air. The understated collar embroidery is a testament to true artisanal mastery.",
    craftDetails: "Silk velvet tailored with micro-resham French knots and hand-cut mother-of-pearl buttons.",
    date: "November 2025"
  }
];

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
  const [selectedStory, setSelectedStory] = useState<ClientItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync with prop list or default clients
  const clients: ClientItem[] = React.useMemo(() => {
    if (diariesList && diariesList.length > 0) {
      return diariesList.map((d, index) => ({
        id: d.id || `client-${index + 1}`,
        name: d.author.toUpperCase(),
        category: d.category || (d.occasion ? d.occasion.toUpperCase() : 'EDITORIAL'),
        image: d.image || DEFAULT_CLIENTS[index % DEFAULT_CLIENTS.length].image,
        city: d.city,
        occasion: d.occasion,
        venue: d.venue,
        outfit: d.outfit,
        quote: d.quote,
        craftDetails: d.craftDetails,
        date: d.date,
      }));
    }
    return DEFAULT_CLIENTS;
  }, [diariesList]);

  const handleShare = (story: ClientItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${story.name} — Client Diaries | Label Shikha Warule`,
        text: `Explore ${story.name}'s bespoke ensemble (${story.category || 'Editorial'}).`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section id="client-diaries-section" className="py-10 md:py-16 bg-[#FAF6F0] overflow-hidden">
      
      {/* 1. SECTION HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
            <h2 className="font-cinzel text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#2C2420] uppercase text-center">
              CLIENT DIARIES
            </h2>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
          </div>
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
        </div>
      </div>

      {/* 2. HORIZONTAL SCROLLING CLIENT CAROUSEL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HorizontalScrollSection
          id="client-diaries-track"
          ariaLabel="Client Diaries patron carousel"
          gap="gap-5 sm:gap-6 lg:gap-7"
          padding="px-1"
          showArrows={true}
          showProgressBar={true}
        >
          {clients.map((client, index) => (
            <div
              key={client.id || client.name || index}
              id={`client-card-${index}`}
              onClick={() => setSelectedStory(client)}
              className="group flex flex-col flex-none w-[76vw] sm:w-[48vw] md:w-[34vw] lg:w-[300px] xl:w-[320px] snap-start cursor-pointer transition-all duration-300 hover:-translate-y-2"
            >
              {/* Editorial Frame with non-cropped face positioning */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#2C2420] shadow-md group-hover:shadow-2xl border border-[#DFCBB8]/50 transition-all duration-500">
                <img
                  src={client.image}
                  alt={client.name}
                  draggable="false"
                  loading="lazy"
                  className="w-full h-full object-cover object-[center_16%] filter brightness-[0.97] group-hover:brightness-105 group-hover:scale-105 transition-all duration-700 ease-out"
                />

                {/* Subtle Luxury Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/30 opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Badge: Category */}
                {client.category && (
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[9.5px] font-cinzel font-semibold tracking-[0.18em] text-white uppercase rounded-full border border-white/20">
                      {client.category}
                    </span>
                  </div>
                )}

                {/* Hover Story Prompt Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                  <div className="px-3.5 py-1.5 rounded-full bg-white/90 text-[#2C2420] text-xs font-cinzel font-semibold tracking-wider flex items-center gap-1.5 shadow-xl">
                    <Eye className="w-3.5 h-3.5 text-[#9E472A]" />
                    <span>View Story</span>
                  </div>
                </div>

                {/* Bottom Overlay Info inside card */}
                <div className="absolute inset-x-0 bottom-0 p-4 z-10 text-center">
                  <h3 className="font-cinzel text-sm sm:text-base font-bold tracking-[0.16em] text-white uppercase drop-shadow-md">
                    {client.name}
                  </h3>
                  {(client.venue || client.city || client.occasion) && (
                    <p className="text-[11px] text-[#F3D7C5] font-light mt-0.5 line-clamp-1 opacity-90">
                      {client.venue || client.city || client.occasion}
                    </p>
                  )}
                </div>
              </div>

              {/* Outfit details subtitle below card */}
              {client.outfit && (
                <span className="text-[11px] text-[#7A6F68] font-sans text-center mt-2.5 line-clamp-1 px-1 opacity-85">
                  {client.outfit}
                </span>
              )}
            </div>
          ))}
        </HorizontalScrollSection>

        {/* 3. SUBMIT ATELIER STORY LINK */}
        {onOpenReviewModal && (
          <div className="text-center mt-6">
            <button
              onClick={onOpenReviewModal}
              className="text-[11px] font-sans text-[#7A6F68] hover:text-[#9E472A] tracking-[0.2em] uppercase transition-colors cursor-pointer"
            >
              Submit Your Atelier Story
            </button>
          </div>
        )}
      </div>

      {/* 4. LIGHTBOX STORY MODAL */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedStory(null)} 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            />

            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-10 text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative inline-block w-full max-w-4xl p-0 my-4 overflow-hidden text-left align-middle bg-[#FAF6F0] text-[#171717] shadow-2xl border border-[#E5DFD5] rounded-xl transform"
              >
                <button
                  onClick={() => setSelectedStory(null)}
                  aria-label="Close client story modal"
                  className="absolute top-4 right-4 z-30 p-2 text-[#171717] hover:text-[#A28B65] bg-white/80 hover:bg-white transition-colors backdrop-blur-md cursor-pointer border border-[#E5DFD5] rounded-full shadow-xs"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
                  <div className="md:col-span-6 bg-[#ECE7DE] relative min-h-[360px] md:min-h-full overflow-hidden">
                    <img
                      src={selectedStory.image}
                      alt={selectedStory.name}
                      className="w-full h-full object-cover object-[center_16%]"
                    />
                    {selectedStory.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3.5 py-1.5 bg-black/75 backdrop-blur-md text-[11px] font-serif font-medium tracking-[0.2em] text-white uppercase">
                          {selectedStory.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#FAF6F0]">
                    <div className="space-y-5">
                      <div>
                        <span className="text-[11px] font-sans tracking-[0.25em] text-[#77736C] uppercase block mb-1.5">
                          PATRON LOOKBOOK
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#171717] tracking-[0.14em] uppercase">
                          {selectedStory.name}
                        </h2>

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

                      {selectedStory.quote && (
                        <div className="py-4 border-y border-[#E5DFD5]">
                          <blockquote className="italic text-sm sm:text-base text-[#2C2420] leading-relaxed">
                            "{selectedStory.quote}"
                          </blockquote>
                        </div>
                      )}

                      {selectedStory.outfit && (
                        <div className="space-y-2">
                          <span className="text-[10.5px] font-serif font-semibold uppercase tracking-[0.2em] text-[#A28B65] block">
                            ENSEMBLE & ATELIER DETAILS
                          </span>
                          <p className="text-xs font-serif text-[#171717] font-medium tracking-wide">
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
                        className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#171717] hover:bg-[#380810] text-white text-xs font-serif font-medium tracking-[0.18em] uppercase transition-colors cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#E6CA65]" />
                        <span>BOOK CONSULTATION FOR THIS LOOK</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(selectedStory, e)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 bg-white hover:bg-[#F2ECE1] text-[#171717] border border-[#E5DFD5] text-xs font-serif font-medium tracking-wider transition-colors cursor-pointer"
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

    </section>
  );
};

export default ClientDiaries;

