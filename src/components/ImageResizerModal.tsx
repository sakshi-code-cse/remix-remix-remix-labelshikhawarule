import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Move,
  Maximize2,
  RefreshCw,
  Laptop,
  Smartphone,
  Crop,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export interface ImageResizerModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onSave: (croppedDataUrl: string) => void;
  title?: string;
  mode?: 'hero' | 'product' | 'general';
}

type AspectRatioOption = {
  label: string;
  ratio: number; // width / height, or -1 for original
  desc: string;
  recommended?: boolean;
};

const HERO_ASPECT_RATIOS: AspectRatioOption[] = [
  { label: '16:9 Hero Wide', ratio: 16 / 9, desc: 'Recommended Standard Desktop', recommended: true },
  { label: '21:9 Ultra-Wide', ratio: 21 / 9, desc: 'Cinematic Full-Width Canvas' },
  { label: '16:7 Classic Banner', ratio: 16 / 7, desc: 'Fashion Runway Hero Height' },
  { label: '4:3 Atelier Focus', ratio: 4 / 3, desc: 'Split Arch & Centered Look' },
  { label: '3:2 Studio Portrait', ratio: 3 / 2, desc: 'Full Model Silhouette' },
  { label: '1:1 Square', ratio: 1, desc: 'Compact Balanced View' },
  { label: 'Original Ratio', ratio: -1, desc: 'Keep Original Image Aspect' },
];

const PRODUCT_ASPECT_RATIOS: AspectRatioOption[] = [
  { label: '3:4 Lookbook Portrait', ratio: 3 / 4, desc: 'Standard Luxury E-Commerce & Lookbook', recommended: true },
  { label: '4:5 Catalog Frame', ratio: 4 / 5, desc: 'Instagram & Premium Grid Ratio' },
  { label: '1:1 Square Box', ratio: 1, desc: 'Symmetrical Clean Product Card' },
  { label: '2:3 Full Silhouette', ratio: 2 / 3, desc: 'Tall Editorial & Full Garment View' },
  { label: '16:9 Landscape Wide', ratio: 16 / 9, desc: 'Horizontal Feature Promo' },
  { label: 'Original Ratio', ratio: -1, desc: 'Keep Original Dimensions' },
];

export const ImageResizerModal: React.FC<ImageResizerModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onSave,
  title = 'Image Resizer',
  mode = 'general',
}) => {
  const isProductMode = mode === 'product';
  const ratiosList = isProductMode ? PRODUCT_ASPECT_RATIOS : HERO_ASPECT_RATIOS;
  const defaultRatio = isProductMode ? 3 / 4 : 16 / 9;

  const [selectedRatio, setSelectedRatio] = useState<number>(defaultRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Pan state (offset in px relative to preview viewport)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Output Resolution Quality
  const defaultWidth = isProductMode ? 1000 : 1920;
  const [targetWidth, setTargetWidth] = useState<number>(defaultWidth);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Image element & dimensions
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load Image when src changes or modal opens
  useEffect(() => {
    if (!imageSrc || !isOpen) return;

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoaded = (loadedImg: HTMLImageElement) => {
      if (!isMounted) return;
      setImgElement(loadedImg);
      setNaturalSize({ width: loadedImg.naturalWidth || 800, height: loadedImg.naturalHeight || 1000 });
      // Reset transformations
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setOffset({ x: 0, y: 0 });
      setSelectedRatio(isProductMode ? 3 / 4 : 16 / 9);
      setTargetWidth(isProductMode ? 900 : 1920);
    };

    img.onload = () => {
      handleLoaded(img);
    };

    img.onerror = () => {
      // If anonymous crossOrigin fails (e.g., third party CDN without CORS headers),
      // retry loading without crossOrigin so preview and editing still work
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        handleLoaded(fallbackImg);
      };
      fallbackImg.onerror = () => {
        console.warn('Unable to load image for resizer:', imageSrc);
        // Even if image element fails, set natural size default
        if (isMounted) {
          setNaturalSize({ width: 800, height: 1000 });
        }
      };
      fallbackImg.src = imageSrc;
    };

    img.src = imageSrc;

    return () => {
      isMounted = false;
    };
  }, [imageSrc, isOpen, isProductMode]);

  // Handle Drag / Pan Events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Quick Action Helpers
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleFitCenter = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  // Compute final crop & render to High-Quality Canvas
  const handleApplyCrop = useCallback(() => {
    if (!imgElement || !containerRef.current) return;

    setIsProcessing(true);

    try {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerW = rect.width;
      const containerH = rect.height;

      // Effective Aspect Ratio
      const effectiveRatio = selectedRatio === -1
        ? (naturalSize.width > 0 && naturalSize.height > 0 ? naturalSize.width / naturalSize.height : (isProductMode ? 3 / 4 : 16 / 9))
        : selectedRatio;

      // Desired Output Dimension
      const outWidth = targetWidth || (isProductMode ? 1000 : 1920);
      const outHeight = Math.round(outWidth / effectiveRatio);

      const canvas = document.createElement('canvas');
      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // Smooth resizing algorithm
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill background
      ctx.fillStyle = '#160E0B';
      ctx.fillRect(0, 0, outWidth, outHeight);

      // Translation and Transformation
      ctx.save();
      
      // Move to center of canvas
      ctx.translate(outWidth / 2, outHeight / 2);

      // Apply Pan Offset (scale offset from preview container to output canvas)
      const scaleXFactor = outWidth / containerW;
      const scaleYFactor = outHeight / containerH;
      ctx.translate(offset.x * scaleXFactor, offset.y * scaleYFactor);

      // Apply Rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply Flip
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Calculate Image Drawing Size inside container
      const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
      let baseDrawW = containerW;
      let baseDrawH = containerW / imgAspect;

      if (baseDrawH < containerH) {
        baseDrawH = containerH;
        baseDrawW = containerH * imgAspect;
      }

      const finalDrawW = baseDrawW * zoom * scaleXFactor;
      const finalDrawH = baseDrawH * zoom * scaleYFactor;

      ctx.drawImage(
        imgElement,
        -finalDrawW / 2,
        -finalDrawH / 2,
        finalDrawW,
        finalDrawH
      );

      ctx.restore();

      // Export as high-quality, lightweight JPEG (0.88 quality for optimal storage and sharpness)
      let croppedDataUrl: string;
      try {
        croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      } catch (canvasErr) {
        console.warn('Canvas toDataURL security/CORS fallback to original image source:', canvasErr);
        croppedDataUrl = imageSrc;
      }

      onSave(croppedDataUrl);
      onClose();
    } catch (err) {
      console.error('Error applying crop, falling back to original image:', err);
      onSave(imageSrc);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  }, [imgElement, selectedRatio, targetWidth, offset, zoom, rotation, flipH, flipV, naturalSize, isProductMode, onSave, onClose, imageSrc]);

  if (!isOpen) return null;

  // Active aspect ratio value for preview container
  const activeRatio = selectedRatio === -1
    ? (naturalSize.width > 0 && naturalSize.height > 0 ? naturalSize.width / naturalSize.height : (isProductMode ? 3 / 4 : 16 / 9))
    : selectedRatio;

  return (
    <div
      id="image-resizer-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#20050A]/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="relative w-full max-w-5xl bg-white border border-[#EAC8CE] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#FCF4F6] border-b border-[#F0D5DA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#7A1526]/10 border border-[#7A1526]/30 flex items-center justify-center text-[#7A1526]">
              {isProductMode ? <ShoppingBag className="w-5 h-5" /> : <Crop className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-cinzel font-bold text-[#4A0E17] tracking-wide flex items-center gap-2">
                {isProductMode ? 'Resize & Frame Garment Image' : 'Resize & Frame Hero Banner'}
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#7A1526] text-white font-sans font-medium uppercase tracking-wider">
                  {isProductMode ? 'Lookbook Atelier' : 'Pro Atelier Studio'}
                </span>
              </h3>
              <p className="text-xs text-[#7E4A53] mt-0.5">
                Drag to reposition, adjust zoom slider, and select the optimal aspect ratio for {title}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white hover:bg-[#FDF2F4] text-[#7E4A53] hover:text-[#4A0E17] border border-[#F0D5DA] transition-colors cursor-pointer"
              title="Close without saving"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body (Split Layout: Workspace + Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: Interactive Canvas / Viewport Workspace */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col items-center justify-center bg-[#2B050B] border-b lg:border-b-0 lg:border-r border-[#EAC8CE] relative select-none">
            
            {/* Viewport Toolbar & Device Preview Toggle */}
            <div className="w-full flex items-center justify-between mb-3 text-xs text-[#F5DDE1]">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-[11px] text-[#FCEEF0] flex items-center gap-1">
                  <Move className="w-3.5 h-3.5 text-[#E3BAC2]" /> Drag image to adjust model/garment focus
                </span>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-[#1A0307] p-1 rounded-lg border border-[#520C17]">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    previewMode === 'desktop' ? 'bg-[#851628] text-white' : 'text-[#D9AAB3] hover:text-white'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> {isProductMode ? 'Card View' : 'Desktop View'}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    previewMode === 'mobile' ? 'bg-[#851628] text-white' : 'text-[#D9AAB3] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile Cut
                </button>
              </div>
            </div>

            {/* Visual Cropping Window Frame */}
            <div
              className={`relative overflow-hidden bg-black/90 rounded-xl border-2 border-[#D9AAB3] shadow-2xl transition-all duration-300 ${
                isProductMode 
                  ? 'max-w-[420px] w-full' 
                  : (previewMode === 'mobile' ? 'w-[280px] max-w-full' : 'w-full max-w-[660px]')
              }`}
              style={{
                aspectRatio: previewMode === 'mobile' && !isProductMode ? '9/16' : `${activeRatio}`,
                maxHeight: isProductMode ? '480px' : '420px',
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Inner Transformed Image */}
              {imageSrc && (
                <div
                  className="w-full h-full flex items-center justify-center pointer-events-none"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                  }}
                >
                  <img
                    src={imageSrc}
                    alt="Resizing Banner"
                    className="max-w-none origin-center transition-transform"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                </div>
              )}

              {/* Cropping Grid Overlay / Rule of Thirds */}
              <div className="absolute inset-0 pointer-events-none border border-white/20">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  <div className="border-r border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div />
                </div>
              </div>

              {/* Floating Badge on Preview */}
              <div className="absolute bottom-2 left-2 pointer-events-none bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-stone-300 border border-white/10">
                {Math.round(targetWidth)} × {Math.round(targetWidth / activeRatio)} px
              </div>
            </div>

            {/* Quick Canvas Transform Action Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={handleRotateLeft}
                className="p-2 rounded-lg bg-[#3D0A13] hover:bg-[#540F1B] text-[#F5DDE1] hover:text-white border border-[#6B1422] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Rotate 90° Counter-Clockwise"
              >
                <RotateCcw className="w-3.5 h-3.5" /> -90°
              </button>

              <button
                type="button"
                onClick={handleRotateRight}
                className="p-2 rounded-lg bg-[#3D0A13] hover:bg-[#540F1B] text-[#F5DDE1] hover:text-white border border-[#6B1422] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-3.5 h-3.5" /> +90°
              </button>

              <button
                type="button"
                onClick={() => setFlipH(!flipH)}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  flipH ? 'bg-[#851628] text-white border-[#B31D36]' : 'bg-[#3D0A13] hover:bg-[#540F1B] text-[#F5DDE1] border-[#6B1422]'
                }`}
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-3.5 h-3.5" /> Flip H
              </button>

              <button
                type="button"
                onClick={() => setFlipV(!flipV)}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  flipV ? 'bg-[#851628] text-white border-[#B31D36]' : 'bg-[#3D0A13] hover:bg-[#540F1B] text-[#F5DDE1] border-[#6B1422]'
                }`}
                title="Flip Vertical"
              >
                <FlipVertical className="w-3.5 h-3.5" /> Flip V
              </button>

              <button
                type="button"
                onClick={handleFitCenter}
                className="p-2 rounded-lg bg-[#3D0A13] hover:bg-[#540F1B] text-[#F5DDE1] hover:text-white border border-[#6B1422] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Center & Reset Pan"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Center
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-lg bg-[#3D0A13] hover:bg-[#540F1B] text-[#F5DDE1] hover:text-white border border-[#6B1422] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset All Adjustments"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Right Column: Settings & Aspect Ratio Panel */}
          <div className="lg:col-span-4 p-5 bg-white space-y-5 overflow-y-auto">
            
            {/* Aspect Ratio Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-cinzel font-bold text-[#4A0E17] uppercase tracking-wider">
                1. Select Silhouette Ratio
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {ratiosList.map((item, idx) => {
                  const isSelected = selectedRatio === item.ratio;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedRatio(item.ratio)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#FCF0F2] border-[#7A1526] shadow-2xs'
                          : 'bg-white border-[#F0D5DA] hover:bg-[#FAF4F5]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-cinzel font-semibold ${isSelected ? 'text-[#7A1526]' : 'text-[#3B0A12]'}`}>
                            {item.label}
                          </span>
                          {item.recommended && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#7A1526]/10 text-[#7A1526] border border-[#7A1526]/20 font-sans">
                              Best Look
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#7E4A53] mt-0.5">{item.desc}</p>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#7A1526] bg-[#7A1526]' : 'border-[#DFBAC2]'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zoom Slider */}
            <div className="space-y-2 pt-3 border-t border-[#F0D5DA]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-cinzel font-bold text-[#4A0E17] uppercase tracking-wider">
                  2. Scale & Zoom
                </label>
                <span className="text-xs font-mono text-[#7A1526] font-bold">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
                  className="p-1.5 rounded bg-[#FAF4F5] hover:bg-[#FCEEF0] text-[#7A1526] border border-[#F0D5DA] cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.02"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#7A1526] cursor-pointer h-1.5 bg-[#FAF2F4] rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(3.0, prev + 0.1))}
                  className="p-1.5 rounded bg-[#FAF4F5] hover:bg-[#FCEEF0] text-[#7A1526] border border-[#F0D5DA] cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Output Resolution Setting */}
            <div className="space-y-2 pt-3 border-t border-[#F0D5DA]">
              <label className="block text-xs font-cinzel font-bold text-[#4A0E17] uppercase tracking-wider">
                3. Output Resolution Quality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(isProductMode
                  ? [
                      { label: '1000 px (Catalog HD)', width: 1000 },
                      { label: '1200 px (Lookbook 2K)', width: 1200 },
                      { label: '800 px (Fast Web)', width: 800 },
                      { label: '1600 px (Studio Detail)', width: 1600 },
                    ]
                  : [
                      { label: '1920 px (FHD)', width: 1920 },
                      { label: '2560 px (2K Ultra)', width: 2560 },
                      { label: '1440 px (Web HD)', width: 1440 },
                      { label: '1200 px (Compact)', width: 1200 },
                    ]
                ).map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTargetWidth(res.width)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-cinzel text-center border transition-all cursor-pointer ${
                      targetWidth === res.width
                        ? 'bg-[#7A1526] text-white border-[#7A1526] font-bold shadow-xs'
                        : 'bg-white text-[#5E2B34] border-[#F0D5DA] hover:bg-[#FAF4F5]'
                    }`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Details Pill */}
            {naturalSize.width > 0 && (
              <div className="p-3 bg-[#FCF4F6] rounded-xl border border-[#F0D5DA] text-[11px] text-[#6B3740] space-y-1">
                <div className="flex justify-between">
                  <span>Source Dimensions:</span>
                  <span className="text-[#3B0A12] font-mono">{naturalSize.width} × {naturalSize.height} px</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Export:</span>
                  <span className="text-[#7A1526] font-mono font-semibold">
                    {targetWidth} × {Math.round(targetWidth / activeRatio)} px
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer (Action Buttons) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#FCF4F6] border-t border-[#F0D5DA]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#DFBAC2] text-[#6B3740] hover:text-[#3B0A12] hover:bg-white text-xs font-cinzel tracking-wider uppercase transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing || !imageSrc}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7A1526] via-[#851628] to-[#991B30] hover:from-[#61101E] hover:to-[#801426] text-white text-xs font-cinzel font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isProductMode ? 'Apply & Save Product Image' : 'Apply & Save Banner'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Also export alias for compatibility
export const HeroBannerResizerModal = ImageResizerModal;
