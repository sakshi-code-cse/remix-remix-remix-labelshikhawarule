import React, { useState } from 'react';

/**
 * Architectural SVG Constants preserved for hero and branding elements
 */
export const ARCH_CLIP_PATH_D = `
  M 0,1
  L 0,0.36
  C 0,0.30 0.045,0.275 0.145,0.275
  L 0.22,0.275
  L 0.22,0.195
  C 0.22,0.135 0.28,0.125 0.345,0.165
  C 0.38,0.115 0.44,0.065 0.50,0.042
  C 0.56,0.065 0.62,0.115 0.655,0.165
  C 0.72,0.125 0.78,0.135 0.78,0.195
  L 0.78,0.275
  L 0.855,0.275
  C 0.955,0.275 1,0.30 1,0.36
  L 1,1
  Z
`.trim().replace(/\s+/g, ' ');

export const ARCH_STROKE_PATH_D = `
  M 0,560
  L 0,201.6
  C 0,168 18,154 58,154
  L 88,154
  L 88,109.2
  C 88,75.6 112,70 138,92.4
  C 152,64.4 176,36.4 200,23.5
  C 224,36.4 248,64.4 262,92.4
  C 288,70 312,75.6 312,109.2
  L 312,154
  L 342,154
  C 382,154 400,168 400,201.6
  L 400,560
`.trim().replace(/\s+/g, ' ');

export const ARCH_OUTER_STROKE_PATH_D = `
  M -5,560
  L -5,198
  C -5,160 14,146 54,146
  L 82,146
  L 82,102
  C 82,67 108,60 135,84
  C 150,55 174,27 200,14
  C 226,27 250,55 265,84
  C 292,60 318,67 318,102
  L 318,146
  L 346,146
  C 386,146 405,160 405,198
  L 405,560
`.trim().replace(/\s+/g, ' ');

export const ARCH_INNER_STROKE_PATH_D = `
  M 6,560
  L 6,204
  C 6,174 22,161 61,161
  L 93,161
  L 93,115
  C 93,83 115,78 140,99
  C 154,72 177,44 200,31
  C 223,44 246,72 260,99
  C 285,78 307,83 307,115
  L 307,161
  L 339,161
  C 378,161 394,174 394,204
  L 394,560
`.trim().replace(/\s+/g, ' ');

export interface IndianArchCardProps {
  id: string;
  image: string;
  hoverImage?: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  showDoubleBorder?: boolean;
  showInnerGoldInlay?: boolean;
  borderColor?: string;
  strokeWidth?: number;
  overlayGradient?: boolean;
  objectPosition?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}

/**
 * Premium Rectangular Product Card Component
 * Restores all product, category, and style images to crisp, clean rectangles (3:4 ratio)
 * with smooth zoom, secondary hover crossfade, and clean luxury borders.
 */
export const IndianArchCard: React.FC<IndianArchCardProps> = ({
  id,
  image,
  hoverImage,
  alt,
  aspectRatio = 'aspect-[3/4]',
  className = '',
  overlayGradient = true,
  objectPosition = 'object-top',
  onClick,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      id={`rect-card-${id}`}
      className={`group relative w-full ${aspectRatio} overflow-hidden rounded-md bg-[#F3E8DB] border border-[#DFCBB8]/80 hover:border-[#9E472A]/70 shadow-2xs transition-all duration-300 select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Primary Image */}
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${objectPosition} transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 ${
          hoverImage && isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Secondary Hover Image (if present) */}
      {hoverImage && (
        <img
          src={hoverImage}
          alt={`${alt} alternate angle`}
          loading="lazy"
          className={`w-full h-full object-cover ${objectPosition} absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Subtle royal vignette shadow at bottom */}
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420]/35 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Interactive children inside the card (badges, wishlist, quick actions) */}
      {children}
    </div>
  );
};
