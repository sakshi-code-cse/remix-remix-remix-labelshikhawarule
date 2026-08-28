import React, { useRef, useState, useEffect } from 'react';
import { Star, Play, Pause, Volume2, VolumeX, Clapperboard } from 'lucide-react';
import { DiscoveryProduct } from './types';

interface DiscoveryCardProps {
  product: DiscoveryProduct;
  onSelect: (product: DiscoveryProduct) => void;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ product, onSelect }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Autoplay video loop muted
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted by browser until user interaction
      });
    }
  }, [isMuted]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(product);
  };

  return (
    <article
      id={`discovery-card-${product.slug}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-none rounded-[18px] overflow-hidden bg-[#1A1412] cursor-pointer select-none transition-all duration-500 shadow-[0_16px_36px_rgba(0,0,0,0.18)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.28)]
        w-[82vw] sm:w-[60vw] md:w-[320px] lg:w-[315px] xl:w-[325px]
        h-[520px] sm:h-[550px] lg:h-[560px]
        aspect-[9/16] scroll-snap-align-start flex flex-col justify-between border border-[#4A382C]/30"
      style={{
        flex: '0 0 auto',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Background Instagram Video Loop (9:16 format) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
        {product.videoUrl ? (
          <video
            ref={videoRef}
            src={product.videoUrl}
            poster={product.image}
            loop
            muted={isMuted}
            playsInline
            autoPlay
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.04] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.04] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        )}

        {/* Subtle Bottom-To-Top Dark Cinematic Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(14, 10, 8, 0.45) 0%, rgba(14, 10, 8, 0.05) 25%, rgba(14, 10, 8, 0.55) 60%, rgba(14, 10, 8, 0.96) 100%)',
          }}
        />
      </div>

      {/* TOP BRAND LABEL & INSTAGRAM REEL BADGES */}
      <div className="relative z-10 pt-[18px] px-[15px] flex items-center justify-between">
        {/* Brand Name */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#E5C38C] inline-block shadow-sm animate-pulse"
            aria-hidden="true"
          />
          <span className="text-[10px] font-bold tracking-[0.1em] text-white uppercase font-sans">
            LABEL SHIKHA WARULE
          </span>
        </div>

        {/* Instagram Reel Badge & Audio Control */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white text-[10px] font-medium tracking-wider">
            <Clapperboard className="w-3 h-3 text-[#E8C88A]" />
            <span>{product.videoDuration || 'REEL'}</span>
          </div>

          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/80 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-[#E8C88A]" />}
          </button>
        </div>
      </div>

      {/* CENTER FLOATING PLAY/PAUSE INDICATOR (Appears on hover or pause) */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          !isPlaying || isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="pointer-events-auto w-12 h-12 rounded-full bg-black/55 hover:bg-[#9E472A] border border-white/30 text-white flex items-center justify-center shadow-xl backdrop-blur-sm transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>
      </div>

      {/* BOTTOM PRODUCT INFORMATION & SHOP NOW BUTTON */}
      <div className="relative z-10 pb-[16px] flex flex-col">
        {/* Product Details Section */}
        <div className="px-[16px] mb-2.5">
          {/* Category */}
          <span className="block text-[10.5px] font-semibold tracking-[0.2em] text-[#E8C88A] uppercase font-sans mb-0.5">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="text-[14.5px] sm:text-[15.5px] font-semibold text-white tracking-wide uppercase font-cinzel leading-snug line-clamp-1 mb-1 drop-shadow-sm">
            {product.name}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex items-center gap-0.5 text-[#E8C88A]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-[#E8C88A] text-[#E8C88A]"
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-[11px] text-[#F3E7D8]/90 font-medium">
              {product.reviews} reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-[14.5px] font-semibold text-white tracking-wider font-sans">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[11.5px] text-[#D4C3B2]/75 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* SHOP NOW Outlined Pill Button */}
        <div className="px-[14px]">
          <button
            type="button"
            id={`shop-now-${product.slug}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="group/btn relative w-full h-[48px] sm:h-[50px] flex items-center justify-center gap-2 rounded-[25px] bg-transparent text-white border border-white/65 hover:border-white/95 hover:bg-white/10 active:bg-white/20 transition-all duration-300 ease-out cursor-pointer backdrop-blur-[2px]"
          >
            <span className="text-[11px] font-semibold tracking-[0.18em] text-white uppercase font-sans">
              SHOP NOW
            </span>
            <span
              className="text-[14px] font-light text-white transition-transform duration-300 ease-out group-hover/btn:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
