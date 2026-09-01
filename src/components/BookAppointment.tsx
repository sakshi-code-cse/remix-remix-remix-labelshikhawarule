import React from 'react';
import { Calendar, ArrowRight, Sparkles, Video } from 'lucide-react';

interface BookAppointmentProps {
  onOpenBooking: () => void;
}

export const BookAppointment: React.FC<BookAppointmentProps> = ({ onOpenBooking }) => {
  return (
    <section 
      id="book-appointment-section" 
      className="relative w-full bg-gradient-to-br from-[#450E18] via-[#52131D] to-[#360911] text-white py-16 sm:py-20 lg:py-24 border-y border-[#6B1826]/80 overflow-hidden"
    >
      {/* Subtle luxury ambient glow and delicate grain atmosphere */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#851E30]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#2B060C]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow with refined icon */}
        <div className="inline-flex items-center justify-center gap-2 mb-4 text-[#EADDCF]/90">
          <Sparkles className="w-3.5 h-3.5 text-[#EADDCF]" />
          <span className="font-cinzel text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase text-[#EADDCF]">
            A PERSONALIZED COUTURE EXPERIENCE
          </span>
        </div>

        {/* Main High-Fashion Serif Heading */}
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-normal tracking-[0.05em] uppercase text-[#FAF6F0] leading-[1.15] mb-5 max-w-3xl mx-auto">
          BOOK AN ATELIER VISIT <br className="hidden sm:inline" />
          <span className="font-light text-[#EADDCF]">&amp; CONSULTATION</span>
        </h2>

        {/* Editorial Description */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-[#EADDCF]/85 font-light leading-relaxed max-w-2xl mx-auto mb-9">
          Step into our atelier for a private styling consultation, bespoke fitting and a truly personal couture experience.
        </p>

        {/* Action Buttons: Atelier Visit & Virtual Consultation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 mb-14">
          <button
            id="book-appointment-cta-button"
            onClick={onOpenBooking}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-4 bg-[#6B1826]/60 hover:bg-[#FAF6F0] text-[#FAF6F0] hover:text-[#52131D] border border-[#FAF6F0]/40 hover:border-[#FAF6F0] rounded-xs font-cinzel text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-xl cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#FAF6F0] group-hover:text-[#52131D] transition-colors" />
            <span>BOOK YOUR PRIVATE VISIT</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>

          <button
            id="book-virtual-consultation-button"
            type="button"
            onClick={onOpenBooking}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-4 bg-white/5 hover:bg-[#FAF6F0] text-[#FAF6F0] hover:text-[#52131D] border border-white/30 hover:border-[#FAF6F0] rounded-xs font-cinzel text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-md backdrop-blur-sm cursor-pointer"
          >
            <Video className="w-4 h-4 text-[#EADDCF] group-hover:text-[#52131D] transition-colors" />
            <span>PREFER VIRTUAL CONSULTATION?</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>

        {/* 3 Refined Experience Detail Blocks */}
        <div className="pt-10 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-left">
          
          {/* Block 01 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left bg-white/[0.03] md:bg-transparent p-5 md:p-0 rounded-lg md:rounded-none border border-white/5 md:border-none">
            <span className="font-cinzel text-[11px] font-bold text-[#EADDCF]/60 tracking-[0.18em] mb-2">
              01
            </span>
            <h4 className="font-cinzel text-xs sm:text-sm font-semibold text-[#FAF6F0] tracking-[0.14em] uppercase mb-1.5">
              ONE-ON-ONE STYLING
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#EADDCF]/75 font-light leading-relaxed">
              Personalized styling with our master couturiers.
            </p>
          </div>

          {/* Block 02 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left bg-white/[0.03] md:bg-transparent p-5 md:p-0 rounded-lg md:rounded-none border border-white/5 md:border-none md:border-l md:border-white/15 md:pl-6 lg:pl-8">
            <span className="font-cinzel text-[11px] font-bold text-[#EADDCF]/60 tracking-[0.18em] mb-2">
              02
            </span>
            <h4 className="font-cinzel text-xs sm:text-sm font-semibold text-[#FAF6F0] tracking-[0.14em] uppercase mb-1.5">
              ATELIER OR VIRTUAL
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#EADDCF]/75 font-light leading-relaxed">
              Visit our flagship studio or consult virtually.
            </p>
          </div>

          {/* Block 03 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left bg-white/[0.03] md:bg-transparent p-5 md:p-0 rounded-lg md:rounded-none border border-white/5 md:border-none md:border-l md:border-white/15 md:pl-6 lg:pl-8">
            <span className="font-cinzel text-[11px] font-bold text-[#EADDCF]/60 tracking-[0.18em] mb-2">
              03
            </span>
            <h4 className="font-cinzel text-xs sm:text-sm font-semibold text-[#FAF6F0] tracking-[0.14em] uppercase mb-1.5">
              BESPOKE FITTING
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#EADDCF]/75 font-light leading-relaxed">
              Precise measurements and custom couture detailing.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

