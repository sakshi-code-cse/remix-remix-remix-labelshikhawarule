import React from 'react';
import { motion } from 'motion/react';

interface FlagshipStoreProps {
  storeAddress?: string;
  storeLocationName?: string;
  googleMapsUrl?: string;
  storeImage?: string;
}

export const FlagshipStore: React.FC<FlagshipStoreProps> = ({
  storeAddress = 'Sector 19A, Nerul West, Navi Mumbai, Maharashtra 400706',
  storeLocationName = 'Nerul',
  googleMapsUrl = 'https://maps.google.com/?q=Label+Shikha+Warule,+Sector+19A,+Nerul+West,+Navi+Mumbai,+Maharashtra+400706',
  storeImage = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
}) => {
  return (
    <section
      id="flagship-store-section"
      aria-label="Experience Our Flagship Store"
      className="w-full bg-[#F8F4EC] pt-[60px] pb-[70px] sm:pt-[80px] sm:pb-[90px] lg:pt-[95px] lg:pb-[100px] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==================================================
            SECTION HEADER - Matching WATCH OUR DISCOVERY Style
            ================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3 sm:gap-4"
          >
            <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[80px] sm:max-w-[160px] md:max-w-[220px]" />
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" aria-hidden="true" />
              <h2 className="font-cinzel text-lg sm:text-2xl md:text-[26px] font-bold tracking-[0.22em] text-[#2C2420] uppercase text-center">
                EXPERIENCE OUR FLAGSHIP STORE
              </h2>
              <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" aria-hidden="true" />
            </div>
            <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[80px] sm:max-w-[160px] md:max-w-[220px]" />
          </motion.div>
        </div>

        {/* ==================================================
            SINGLE FLAGSHIP STORE CARD (NERUL ONLY)
            ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center w-full"
        >
          <article
            id="flagship-store-card-nerul"
            className="group relative w-full max-w-[800px] h-[520px] sm:h-[580px] md:h-[620px] lg:h-[640px] rounded-[14px] sm:rounded-[16px] md:rounded-[18px] overflow-hidden select-none"
            style={{
              boxShadow: '0 20px 50px rgba(50, 35, 20, 0.14)',
            }}
          >
            {/* STORE PHOTOGRAPH WITH SUBTLE DESKTOP ZOOM */}
            <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#241712]">
              <img
                src={storeImage}
                alt="Label Shikha Warule Nerul Flagship Store"
                loading="lazy"
                onError={(e) => {
                  // Graceful fallback to luxury atelier interior photo
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1600&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.035] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              />

              {/* DARK CINEMATIC GRADIENT OVERLAY */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.72) 100%)',
                }}
              />
            </div>

            {/* INNER GOLD BORDER (16px inset on desktop, 12px on mobile) */}
            <div
              className="absolute inset-[12px] sm:inset-[16px] rounded-[10px] sm:rounded-[12px] md:rounded-[14px] pointer-events-none z-20 transition-colors duration-300"
              style={{
                border: '1px solid rgba(190, 145, 65, 0.65)',
              }}
              aria-hidden="true"
            />

            {/* TOP-LEFT BRAND LABEL */}
            <div className="absolute top-6 left-6 sm:top-[30px] sm:left-[30px] z-30 flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#B58A3A] inline-block shadow-sm"
                aria-hidden="true"
              />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.7px] text-white uppercase font-sans">
                LABEL SHIKHA WARULE
              </span>
            </div>

            {/* BOTTOM-LEFT STORE INFORMATION & GET DIRECTIONS BUTTON */}
            <div className="absolute bottom-6 left-6 sm:bottom-[30px] sm:left-[30px] md:bottom-9 md:left-9 z-30 max-w-[90%] sm:max-w-[480px]">
              {/* Store Location Title */}
              <h3
                className="text-[34px] sm:text-[40px] md:text-[46px] lg:text-[48px] font-normal text-white leading-tight mb-2 drop-shadow-sm"
                style={{
                  fontFamily:
                    "'Marove', 'Maove', 'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                }}
              >
                {storeLocationName}
              </h3>

              {/* Store Address */}
              <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.7] text-white/85 max-w-[380px] mb-6 drop-shadow-sm font-sans">
                {storeAddress}
              </p>

              {/* Outlined Luxury GET DIRECTIONS Button */}
              <div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="get-directions-button-nerul"
                  aria-label={`Get directions to Label Shikha Warule ${storeLocationName} flagship store on Google Maps`}
                  className="group/btn inline-flex items-center justify-between gap-4 px-7 h-[54px] sm:h-[58px] min-w-[200px] sm:min-w-[220px] rounded-[28px] bg-transparent border border-[#B58A3A] hover:border-[#E2C275] hover:bg-[#B58A3A]/15 active:bg-[#B58A3A]/25 backdrop-blur-[2px] transition-all duration-300 ease-out cursor-pointer"
                >
                  <span className="text-[11px] font-medium tracking-[3px] text-[#DFC07B] group-hover/btn:text-[#F3D794] uppercase font-sans transition-colors duration-300">
                    GET DIRECTIONS
                  </span>
                  <span
                    className="text-[15px] text-[#DFC07B] group-hover/btn:text-[#F3D794] transition-all duration-300 ease-out transform group-hover/btn:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              </div>
            </div>
          </article>
        </motion.div>
      </div>
    </section>
  );
};

export default FlagshipStore;
