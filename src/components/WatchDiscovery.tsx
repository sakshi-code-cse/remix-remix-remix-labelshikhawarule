import React from 'react';
import { Play } from 'lucide-react';
import { DISCOVERY_STORIES } from '../data/mockData';
import { DiscoveryStory } from '../types';
import { HorizontalScrollSection } from './common/HorizontalScrollSection';

interface WatchDiscoveryProps {
  onSelectStory: (story: DiscoveryStory) => void;
  storiesList?: DiscoveryStory[];
}

export const WatchDiscovery: React.FC<WatchDiscoveryProps> = ({ onSelectStory, storiesList }) => {
  const stories = storiesList && storiesList.length > 0 ? storiesList : DISCOVERY_STORIES;

  return (
    <section id="watch-discovery-section" className="py-10 md:py-16 bg-[#FAF6F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
            <h2 className="font-cinzel text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#2C2420] uppercase text-center">
              WATCH OUR DISCOVERY
            </h2>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9E472A]" />
          </div>
          <div className="h-[1px] bg-[#D4C3B2] flex-1 max-w-[120px] sm:max-w-[200px]" />
        </div>

        {/* Horizontally Scrollable Video UGC Reel Carousel */}
        <HorizontalScrollSection
          id="watch-discovery-track"
          ariaLabel="Watch Our Discovery video stories"
          gap="gap-4 sm:gap-6"
          padding="px-1"
          showArrows={true}
          showProgressBar={true}
        >
          {stories.map((story) => (
            <div
              key={story.id}
              id={`discovery-story-${story.id}`}
              onClick={() => onSelectStory(story)}
              className="flex-none w-[68vw] sm:w-[44vw] md:w-[28vw] lg:w-[260px] xl:w-[270px] snap-start group/item cursor-pointer transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Instagram Reel Size 9:16 Thumbnail Tile */}
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#2C2420] shadow-lg group-hover/item:shadow-2xl border border-[#DFCBB8]/50">
                
                <img
                  src={story.thumbnail}
                  alt={story.title}
                  draggable="false"
                  loading="lazy"
                  className="w-full h-full object-cover filter brightness-95 group-hover/item:brightness-105 group-hover/item:scale-105 transition-all duration-700"
                />

                {/* Dark Terracotta Reel Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420]/95 via-[#2C2420]/25 to-black/30 transition-opacity" />

                {/* Top Reel Header Badges */}
                <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9.5px] font-cinzel font-semibold tracking-wider text-white border border-white/20 uppercase">
                    REEL
                  </span>
                  <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/20">
                    {story.videoDuration || '01:45'}
                  </div>
                </div>

                {/* Center Reel Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/70 flex items-center justify-center text-white transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-[#9E472A] group-hover/item:border-[#9E472A] shadow-xl">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Story & Artisan Info */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 text-center z-10">
                  <h3 className="font-cinzel text-xs sm:text-sm font-semibold text-white tracking-wider leading-snug drop-shadow-md">
                    {story.title}
                  </h3>
                  <span className="text-[11px] text-[#F3D7C5] font-light mt-1 block opacity-95 line-clamp-1">
                    {story.subtitle}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </HorizontalScrollSection>

      </div>
    </section>
  );
};

