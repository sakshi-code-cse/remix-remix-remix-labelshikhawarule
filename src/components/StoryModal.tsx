import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, User, ArrowRight, RotateCcw, Maximize2, Bookmark, Check } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if videoUrl is a YouTube / Vimeo embed
  const isEmbedVideo = Boolean(
    story?.videoUrl && 
    (story.videoUrl.includes('youtube.com') || 
     story.videoUrl.includes('youtu.be') || 
     story.videoUrl.includes('vimeo.com') ||
     story.videoType === 'embed')
  );

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1&loop=1&muted=${isMuted ? 1 : 0}`;
    }
    return url;
  };

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setCurrentTime(0);
      setHasVideoError(false);
      setIsVideoLoaded(false);
    }
  }, [isOpen, story]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec === 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 pt-4 pb-20 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        />

        {/* Modal Window: Instagram Reel Vertical Layout */}
        <div className="relative inline-block w-full max-w-4xl p-0 my-4 sm:my-8 overflow-hidden text-left align-middle bg-[#1F080D] text-[#F9EFF1] rounded-2xl shadow-2xl transform transition-all border border-[#52131F] z-10">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close story player"
            className="absolute top-4 right-4 z-40 p-2 text-white hover:text-[#E8BDC4] bg-black/70 hover:bg-black/95 rounded-full transition-all backdrop-blur-md cursor-pointer border border-white/20 shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px]">

            {/* Left/Main: Vertical 9:16 Instagram Reel Video Player */}
            <div className="md:col-span-6 lg:col-span-5 bg-black flex items-center justify-center p-3 sm:p-6 bg-gradient-to-b from-[#140407] to-black">
              <div className="relative aspect-[9/16] w-full max-w-[320px] rounded-xl overflow-hidden shadow-2xl border border-[#48101B] bg-[#0E0204]">
                
                {/* VIDEO OR EMBED OR THUMBNAIL */}
                {story.videoUrl && !hasVideoError ? (
                  isEmbedVideo ? (
                    <iframe
                      src={getEmbedUrl(story.videoUrl)}
                      title={story.title}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={story.videoUrl}
                      poster={story.thumbnail}
                      autoPlay
                      loop
                      playsInline
                      muted={isMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={(e) => {
                        setDuration((e.target as HTMLVideoElement).duration || 0);
                        setIsVideoLoaded(true);
                      }}
                      onError={() => {
                        setHasVideoError(true);
                      }}
                      onClick={togglePlay}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  )
                ) : (
                  <img
                    src={story.thumbnail}
                    alt={story.title}
                    className={`w-full h-full object-cover filter brightness-90 transition-transform duration-1000 ${
                      isPlaying ? 'scale-105' : 'scale-100'
                    }`}
                  />
                )}

                {/* Reel Gradient Shade (only on HTML5 video/thumbnail) */}
                {!isEmbedVideo && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none" />
                )}

                {/* Top Reel Header Bar */}
                {!isEmbedVideo && (
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs text-white/90 z-20">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-md">
                      <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#C93B53] animate-ping' : 'bg-stone-400'}`} />
                      <span className="font-cinzel text-[10px] font-semibold tracking-wider uppercase">
                        {story.videoUrl ? 'VIDEO REEL' : 'REEL STORY'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {story.videoUrl && !hasVideoError && (
                        <button
                          type="button"
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = 0;
                              videoRef.current.play().catch(() => {});
                              setIsPlaying(true);
                            }
                          }}
                          className="p-1.5 rounded-full bg-black/70 backdrop-blur-md hover:bg-black text-white border border-white/20 cursor-pointer transition-colors shadow-md"
                          title="Restart Video"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button 
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1.5 rounded-full bg-black/70 backdrop-blur-md hover:bg-black text-white border border-white/20 cursor-pointer transition-colors shadow-md"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      {story.videoUrl && !hasVideoError && (
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="p-1.5 rounded-full bg-black/70 backdrop-blur-md hover:bg-black text-white border border-white/20 cursor-pointer transition-colors shadow-md"
                          title="Fullscreen"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Center Video Play/Pause Overlay Control */}
                {!isEmbedVideo && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className={`w-14 h-14 rounded-full bg-[#7A1526]/90 hover:bg-[#7A1526] text-white flex items-center justify-center shadow-2xl transition-all duration-300 pointer-events-auto cursor-pointer border border-white/40 ${
                        isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100 scale-105'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 fill-white" />}
                    </button>
                  </div>
                )}

                {/* Reel Bottom Meta & Scrubber Progress Bar */}
                {!isEmbedVideo && (
                  <div className="absolute bottom-3 inset-x-3 text-white z-20 space-y-1.5">
                    {/* Interactive Scrubber Bar */}
                    {story.videoUrl && !hasVideoError && duration > 0 ? (
                      <div className="space-y-1">
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          step={0.1}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#C93B53]"
                        />
                        <div className="flex items-center justify-between text-[9px] font-mono text-white/80">
                          <span>{formatSeconds(currentTime)}</span>
                          <span>{formatSeconds(duration)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/80">{story.videoDuration || '02:30'}</span>
                        <span className="text-[9px] font-cinzel text-[#E8BDC4] uppercase tracking-wider">Atelier Reel</span>
                      </div>
                    )}

                    <p className="font-cinzel text-xs font-semibold text-white tracking-wide drop-shadow-md line-clamp-1">
                      {story.title}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Story Narrative & Craft Details */}
            <div className="md:col-span-6 lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-[#1F080D]">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-cinzel text-[#E8BDC4] uppercase tracking-widest mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E8BDC4]" />
                    <span>Craft & Weave Documentary Series</span>
                  </div>
                  <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    {story.title}
                  </h2>
                  <h3 className="font-serif-luxury italic text-base text-[#D4A1AB] mt-0.5">
                    {story.subtitle}
                  </h3>
                </div>

                <p className="text-sm text-[#F0D5DA] leading-relaxed font-light">
                  {story.description}
                </p>

                {/* Artisan Spotlight Quote */}
                {story.artisanQuote && (
                  <div className="p-4 rounded-xl bg-[#2D0D14] border border-[#52131F] space-y-2">
                    <blockquote className="font-serif-luxury italic text-sm sm:text-base text-[#FCF4F6]">
                      "{story.artisanQuote}"
                    </blockquote>
                    {story.artisanName && (
                      <div className="text-xs font-cinzel font-semibold text-[#E8BDC4] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{story.artisanName}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Craftsmanship Highlights */}
                {story.craftsmanshipDetail && (
                  <div className="text-xs text-[#F0D5DA] bg-[#290910] p-3 rounded-lg border border-[#48101B]">
                    <strong className="text-[#E8BDC4] font-cinzel block mb-0.5 uppercase tracking-wider text-[10px]">Process Detail:</strong>
                    {story.craftsmanshipDetail}
                  </div>
                )}

                {/* Tags */}
                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {story.tags.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-[#3B0E17] text-[#F0D5DA] text-xs font-cinzel tracking-wider border border-[#5E1824]">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Action */}
              <div className="pt-5 border-t border-[#48101B] flex flex-wrap gap-3 items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-cinzel rounded-lg border transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                      : 'bg-[#290910] text-[#E8BDC4] border-[#5E1824] hover:bg-[#3B0E17]'
                  }`}
                  title={isSaved ? 'Saved to Your Stories' : 'Save / Bookmark Story'}
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Saved Reel' : 'Save Story'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onExploreCollection();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold tracking-wider rounded-lg uppercase transition-all duration-300 shadow-md cursor-pointer"
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
