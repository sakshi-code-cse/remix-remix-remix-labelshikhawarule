import React, { useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, User, Tag, ArrowRight } from 'lucide-react';
import { DiscoveryStory } from '../types';

interface StoryModalProps {
  story: DiscoveryStory | null;
  isOpen: boolean;
  onClose: () => void;
  onExploreCollection: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  story,
  isOpen,
  onClose,
  onExploreCollection,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        />

        {/* Modal Window: Instagram Reel Vertical Layout */}
        <div className="relative inline-block w-full max-w-4xl p-0 my-4 sm:my-8 overflow-hidden text-left align-middle bg-[#1E1410] text-[#EFE5D8] rounded-2xl shadow-2xl transform transition-all border border-[#4A3227]">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close story player"
            className="absolute top-4 right-4 z-30 p-2 text-white hover:text-[#C29342] bg-black/60 hover:bg-black/90 rounded-full transition-colors backdrop-blur-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px]">

            {/* Left/Main: Vertical 9:16 Instagram Reel Video Player */}
            <div className="md:col-span-6 lg:col-span-5 bg-black flex items-center justify-center p-3 sm:p-5 bg-gradient-to-b from-[#140D0B] to-black">
              <div className="relative aspect-[9/16] w-full max-w-[320px] rounded-xl overflow-hidden shadow-2xl border border-[#3F2B22]">
                <img
                  src={story.thumbnail}
                  alt={story.title}
                  className={`w-full h-full object-cover filter brightness-90 transition-transform duration-1000 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Reel Gradient Shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

                {/* Top Reel Badge */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs text-white/90 z-20">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-[#9E472A] animate-ping" />
                    <span className="font-cinzel text-[10px] font-semibold tracking-wider uppercase">REEL</span>
                  </div>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white border border-white/20 cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Center Video Play/Pause Control */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 rounded-full bg-[#9E472A]/85 hover:bg-[#9E472A] text-white flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 cursor-pointer border border-white/40"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 fill-white" />}
                  </button>
                </div>

                {/* Reel Bottom Meta */}
                <div className="absolute bottom-3 inset-x-3 text-white z-20">
                  <span className="text-[10px] font-mono text-white/80 block mb-1">{story.videoDuration}</span>
                  <p className="font-cinzel text-xs font-semibold text-white tracking-wide drop-shadow-md line-clamp-1">
                    {story.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Story Narrative & Craft Details */}
            <div className="md:col-span-6 lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-[#1E1410]">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-cinzel text-[#C29342] uppercase tracking-widest mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Craft & Weave Reel Series</span>
                  </div>
                  <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    {story.title}
                  </h2>
                  <h3 className="font-serif-luxury italic text-base text-[#D4BCA9] mt-0.5">
                    {story.subtitle}
                  </h3>
                </div>

                <p className="text-sm text-[#C4B2A3] leading-relaxed font-light">
                  {story.description}
                </p>

                {/* Artisan Spotlight Quote */}
                <div className="p-4 rounded-xl bg-[#2A1D17] border border-[#3F2B22] space-y-2">
                  <blockquote className="font-serif-luxury italic text-sm sm:text-base text-[#F5E4D4]">
                    "{story.artisanQuote}"
                  </blockquote>
                  <div className="text-xs font-cinzel font-semibold text-[#C29342] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{story.artisanName}</span>
                  </div>
                </div>

                {/* Craftsmanship Highlights */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {story.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-[#34231B] text-[#D8C5B5] text-xs font-cinzel tracking-wider border border-[#4A3227]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Action */}
              <div className="pt-5 border-t border-[#3F2B22] flex flex-wrap gap-3 items-center justify-between">
                <span className="text-xs text-[#9E8B7F]">Label Shikha Warule Sustainable Atelier</span>
                <button
                  onClick={() => {
                    onClose();
                    onExploreCollection();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#9E472A] hover:bg-[#80331A] text-white text-xs font-cinzel font-semibold tracking-wider rounded-xs uppercase transition-all duration-300 shadow-md cursor-pointer"
                >
                  <span>Shop Related Styles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
