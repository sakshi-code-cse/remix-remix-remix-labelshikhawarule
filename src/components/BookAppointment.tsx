import React from 'react';
import { Calendar, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { ARCH_STROKE_PATH_D } from './ArchShape';

interface BookAppointmentProps {
  onOpenBooking: () => void;
}

export const BookAppointment: React.FC<BookAppointmentProps> = ({ onOpenBooking }) => {
  return (
    <section id="book-appointment-section" className="w-full bg-[#52131D] py-14 md:py-20 text-white border-y border-[#6B1826]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Calendar / Clock Center Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#6B1826] border border-white/30 mb-5 shadow-lg">
          <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={1.75} />
        </div>

        {/* Heading in Clean White */}
        <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.16em] uppercase text-white mb-3 leading-tight">
          BOOK AN ATELIER VISIT & CONSULTATION
        </h2>

        {/* Subtitle in Crisp White */}
        <p className="font-serif-luxury text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Enjoy a personalized styling and bespoke fitting experience with our master couturiers. We would love to craft something exceptional for you.
        </p>

        {/* Action Button */}
        <div>
          <button
            id="book-appointment-cta-button"
            onClick={onOpenBooking}
            className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 bg-[#6B1826] hover:bg-[#851E30] text-white border-2 border-white rounded-xs font-cinzel text-xs sm:text-sm font-bold tracking-[0.18em] uppercase transition-all duration-300 shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-white">BOOK ATELIER VISIT</span>
            <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Micro highlights in Pure White */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white font-light">
          <span className="flex items-center gap-1.5 text-white">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            1-on-1 Master Stylist
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="flex items-center gap-1.5 text-white">
            <Clock className="w-3.5 h-3.5 text-white" />
            Flagship Studio Visit or Virtual Consultation
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="text-white">Bespoke Measurements & Custom Weaves</span>
        </div>

      </div>
    </section>
  );
};
