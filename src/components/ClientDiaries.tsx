import React, { useState, useRef } from 'react';
import { 
  Star, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquareHeart, 
  Sparkles, 
  MapPin, 
  Calendar, 
  X, 
  Heart,
  Share2,
  Check
} from 'lucide-react';
import { CLIENT_DIARIES } from '../data/mockData';
import { ClientDiary } from '../types';

interface ClientDiariesProps {
  onOpenReviewModal: () => void;
  onBookAppointment?: (preference?: string) => void;
  diariesList?: ClientDiary[];
}

export const ClientDiaries: React.FC<ClientDiariesProps> = ({ 
  onOpenReviewModal, 
  onBookAppointment,
  diariesList 
}) => {
  const [selectedDiary, setSelectedDiary] = useState<ClientDiary | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const diaries = diariesList && diariesList.length > 0 ? diariesList : CLIENT_DIARIES;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const handleShare = (diary: ClientDiary, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${diary.author} - Client Diary | Label Shikha Warule`,
        text: `See how ${diary.author} styled their bespoke ${diary.outfit} for ${diary.occasion || 'their special celebration'}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section id="client-diaries-section" className="py-12 md:py-20 bg-[#FAF6F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Classical Symmetry */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-4 w-full mb-2">
            <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[80px] sm:max-w-[160px]" />
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
              <h2 className="font-cinzel text-xl sm:text-3xl font-bold tracking-[0.2em] text-[#2C2420] uppercase">
                CLIENT DIARIES
              </h2>
              <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
            </div>
            <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[80px] sm:max-w-[160px]" />
          </div>

          <p className="font-serif-luxury italic text-sm sm:text-base text-[#7A6F68] max-w-xl mx-auto mt-1">
            Glimpses of our patrons celebrating milestone moments and weddings in bespoke Label Shikha Warule couture.
          </p>
        </div>

        {/* Carousel Slider Container with Navigation Arrows */}
        <div className="relative group/slider">
          
          {/* Left Arrow Navigation */}
          <button
            onClick={scrollLeft}
            aria-label="Previous Client Diaries"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 text-[#2C2420] hover:text-[#9E472A] hover:bg-white border border-[#DFCBB8] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Right Arrow Navigation */}
          <button
            onClick={scrollRight}
            aria-label="Next Client Diaries"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 text-[#2C2420] hover:text-[#9E472A] hover:bg-white border border-[#DFCBB8] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Horizontal Scrollable Track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth pb-4 px-1 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {diaries.map((diary) => (
              <div
                key={diary.id}
                id={`client-diary-card-${diary.id}`}
                onClick={() => setSelectedDiary(diary)}
                className="flex-none w-[280px] sm:w-[320px] md:w-[340px] snap-start group/card cursor-pointer"
              >
                {/* High-Aspect Portrait Luxury Card */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#2C2420] border border-[#DFCBB8]/70 shadow-md group-hover/card:shadow-2xl transition-all duration-500 group-hover/card:-translate-y-1.5">
                  
                  {/* Portrait Photography with Smooth Zoom */}
                  <img
                    src={diary.image}
                    alt={`Client Diary - ${diary.author}`}
                    className="w-full h-full object-cover object-center filter brightness-95 group-hover/card:brightness-100 group-hover/card:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Terracotta / Obsidian Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1714] via-[#1F1714]/40 to-transparent pointer-events-none" />

                  {/* Top Overlay Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                    {/* Occasion / City Pill */}
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10.5px] font-cinzel font-semibold tracking-wider text-white border border-white/20 uppercase">
                      {diary.occasion ? diary.occasion.split('&')[0].trim() : diary.city}
                    </span>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#E6CA65]">
                      {[...Array(diary.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#E6CA65] stroke-none" />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end text-white z-10">
                    
                    {/* Location Pin & Date */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#D8C5B5] font-light mb-1 opacity-90">
                      <MapPin className="w-3 h-3 text-[#E6CA65]" />
                      <span>{diary.venue || diary.city}</span>
                    </div>

                    {/* Client / Couple Name */}
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wide group-hover/card:text-[#F3D7C5] transition-colors leading-snug">
                      {diary.author}
                    </h3>

                    {/* Bespoke Ensemble Title */}
                    <p className="font-serif-luxury italic text-xs text-[#E6CA65] line-clamp-1 mt-0.5 mb-2">
                      {diary.outfit}
                    </p>

                    {/* Testimonial Excerpt */}
                    <blockquote className="text-xs text-[#EFE5D8]/90 font-light italic line-clamp-2 leading-relaxed mb-3">
                      "{diary.quote}"
                    </blockquote>

                    {/* Interactive "View Diary" Action Button */}
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                      <span className="font-cinzel text-[11px] font-semibold tracking-widest text-[#F3D7C5] group-hover/card:text-white uppercase transition-colors">
                        VIEW BESPOKE DIARY
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white/15 group-hover/card:bg-[#9E472A] flex items-center justify-center transition-all duration-300 text-white">
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5" />
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Section Bottom Actions */}
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="share-client-story-btn"
            onClick={onOpenReviewModal}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#9E472A] hover:bg-[#80331A] text-white rounded-xs text-xs font-cinzel font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>SHARE YOUR ATELIER STORY</span>
          </button>

          <button
            onClick={() => {
              if (onBookAppointment) {
                onBookAppointment('Bespoke Bridal & Occasion Styling');
              } else {
                const el = document.getElementById('book-appointment-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#2C2420] text-[#2C2420] hover:bg-[#2C2420] hover:text-white rounded-xs text-xs font-cinzel font-semibold tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer"
          >
            <span>BOOK BESPOKE CONSULTATION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN BESPOKE CLIENT DIARY LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {selectedDiary && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedDiary(null)} 
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
          />

          <div className="flex items-center justify-center min-h-screen p-3 sm:p-6 text-center">
            
            {/* Modal Box */}
            <div className="relative inline-block w-full max-w-4xl p-0 my-4 overflow-hidden text-left align-middle bg-[#1A120E] text-[#EFE5D8] rounded-2xl shadow-2xl border border-[#4A3227] transform transition-all">
              
              {/* Top Close Button */}
              <button
                onClick={() => setSelectedDiary(null)}
                aria-label="Close client diary modal"
                className="absolute top-4 right-4 z-30 p-2.5 text-white hover:text-[#C29342] bg-black/60 hover:bg-black/90 rounded-full transition-colors backdrop-blur-md cursor-pointer border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
                
                {/* Left: High-Fashion Portrait View */}
                <div className="md:col-span-6 bg-black relative min-h-[380px] md:min-h-full overflow-hidden">
                  <img
                    src={selectedDiary.image}
                    alt={`Client ${selectedDiary.author}`}
                    className="w-full h-full object-cover object-center filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A120E] via-transparent to-black/30 md:hidden" />
                  
                  {/* Floating Occasion Tag on Image */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-xs font-cinzel font-semibold tracking-wider text-white border border-white/20 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#E6CA65]" />
                      <span>{selectedDiary.occasion || 'Milestone Celebration'}</span>
                    </span>
                  </div>
                </div>

                {/* Right: Bespoke Story, Garment Breakdown & Actions */}
                <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#1A120E]">
                  
                  <div className="space-y-4">
                    
                    {/* Header Details */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-cinzel text-[#C29342] uppercase tracking-widest mb-1.5">
                        <span>Label Shikha Warule Patron Lookbook</span>
                      </div>

                      <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
                        {selectedDiary.author}
                      </h2>

                      {/* Location & Occasion */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#D8C5B5] mt-1.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E6CA65]" />
                          {selectedDiary.venue || selectedDiary.city}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#E6CA65]" />
                          {selectedDiary.date}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-1 text-[#E6CA65]">
                      {[...Array(selectedDiary.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#E6CA65] stroke-none" />
                      ))}
                      <span className="ml-2 text-xs font-cinzel text-white/80">5.0 Bespoke Experience</span>
                    </div>

                    {/* Client Testimonial Quote */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#281B15] border border-[#3E291F]">
                      <blockquote className="font-serif-luxury italic text-sm sm:text-base text-[#F5E4D4] leading-relaxed">
                        "{selectedDiary.quote}"
                      </blockquote>
                    </div>

                    {/* Bespoke Garment & Craftsmanship Details */}
                    <div className="space-y-2">
                      <h4 className="font-cinzel text-xs font-semibold uppercase tracking-wider text-[#E6CA65]">
                        ENSEMBLE DETAILS
                      </h4>
                      <p className="text-xs font-serif-luxury text-white font-medium">
                        {selectedDiary.outfit}
                      </p>
                      {selectedDiary.craftDetails && (
                        <p className="text-xs text-[#C4B2A3] leading-relaxed font-light">
                          {selectedDiary.craftDetails}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    {selectedDiary.tags && selectedDiary.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedDiary.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2.5 py-1 rounded-full bg-[#2A1D17] text-[#D8C5B5] text-[11px] font-cinzel tracking-wider border border-[#3E291F]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Modal Footer Actions */}
                  <div className="pt-5 border-t border-[#3E291F] flex flex-col sm:flex-row items-center gap-3">
                    
                    <button
                      onClick={() => {
                        const outfitName = selectedDiary.outfit;
                        setSelectedDiary(null);
                        if (onBookAppointment) {
                          onBookAppointment(`Bespoke fitting inspired by ${selectedDiary.author}'s ${outfitName}`);
                        } else {
                          const el = document.getElementById('book-appointment-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#9E472A] hover:bg-[#80331A] text-white rounded-xs text-xs font-cinzel font-semibold tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>BOOK CONSULTATION FOR THIS LOOK</span>
                    </button>

                    <button
                      onClick={(e) => handleShare(selectedDiary, e)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-[#281B15] hover:bg-[#34241C] text-white border border-[#4A3227] rounded-xs text-xs font-cinzel font-semibold tracking-wider transition-colors cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'COPIED' : 'SHARE'}</span>
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};

