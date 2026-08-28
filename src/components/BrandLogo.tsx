import React from 'react';
import { LogoCMSContent } from '../types';

interface BrandLogoProps {
  variant?: 'gold' | 'dark' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  logoCMS?: LogoCMSContent;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'gold',
  className = '',
  size = 'md',
  onClick,
  logoCMS,
}) => {
  // Height map for responsive rendering
  const heightMap = {
    sm: 'h-10 sm:h-11',
    md: 'h-16 sm:h-18 md:h-20',
    lg: 'h-24 sm:h-28',
    xl: 'h-32 sm:h-40',
  };

  // Base colors
  const defaultGold = '#A59173';
  const defaultDark = '#3A2E26';
  const defaultLight = '#F8F2EA';

  let primaryColor = {
    gold: logoCMS?.primaryColorHex || defaultGold,
    dark: defaultDark,
    light: logoCMS?.footerColorHex || defaultLight,
  }[variant];

  // If variant is light, respect footer color override
  if (variant === 'light' && logoCMS?.footerColorHex) {
    primaryColor = logoCMS.footerColorHex;
  }

  const secondaryColor = variant === 'light' ? '#FFFFFF' : (variant === 'dark' ? '#2A201A' : '#9A8567');

  const logoType = logoCMS?.logoType || 'svg-monogram';
  const curvedText = logoCMS?.monogramCurvedText || logoCMS?.curvedArchText || 'LABEL';
  const subtitleText = logoCMS?.monogramSubtitle || logoCMS?.subtitleLine || 'BY SHIKHA WARULE';
  const brandName = logoCMS?.brandName || logoCMS?.textBrandName || 'LABEL SHIKHA WARULE';
  const brandSubtitle = logoCMS?.brandSubtitle || logoCMS?.textSubtitle || 'HAUTE COUTURE & ATELIER';

  // Handle both 0.8-1.5 multiplier and 80-150 percentage scale values
  const normalizedScale = logoCMS?.heightScale 
    ? (logoCMS.heightScale > 10 ? logoCMS.heightScale / 100 : logoCMS.heightScale)
    : 1;

  const heightScaleStyle = normalizedScale !== 1
    ? { transform: `scale(${normalizedScale})`, transformOrigin: 'center center' }
    : undefined;

  // 1. CUSTOM IMAGE LOGO MODE
  if (logoType === 'custom-image' && (logoCMS?.customImageUrl || logoCMS?.customImageDarkUrl)) {
    const imgSrc = (variant === 'light' && logoCMS.customImageDarkUrl)
      ? logoCMS.customImageDarkUrl
      : (logoCMS.customImageUrl || logoCMS.customImageDarkUrl);

    return (
      <div
        id="brand-logo-container"
        onClick={onClick}
        style={heightScaleStyle}
        className={`inline-flex items-center justify-center cursor-pointer select-none transition-transform duration-300 hover:opacity-95 ${className}`}
      >
        <img
          src={imgSrc}
          alt={brandName}
          className={`${heightMap[size]} w-auto object-contain max-w-[280px] sm:max-w-[340px] drop-shadow-sm`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // 2. LUXURY TYPOGRAPHY WORDMARK MODE
  if (logoType === 'text-luxury') {
    return (
      <div
        id="brand-logo-container"
        onClick={onClick}
        style={heightScaleStyle}
        className={`inline-flex flex-col items-center justify-center cursor-pointer select-none transition-transform duration-300 hover:opacity-95 text-center ${className}`}
      >
        <span 
          style={{ color: primaryColor }}
          className="font-cinzel font-bold text-lg sm:text-2xl md:text-3xl tracking-[0.24em] uppercase leading-tight"
        >
          {brandName}
        </span>
        <div className="flex items-center gap-2 mt-1 w-full justify-center opacity-85">
          <div className="h-[1px] w-6 sm:w-10 bg-current" style={{ backgroundColor: primaryColor }} />
          <span 
            style={{ color: primaryColor }}
            className="text-[9px] sm:text-[10px] md:text-xs font-serif-luxury italic tracking-[0.32em] uppercase font-light"
          >
            {brandSubtitle}
          </span>
          <div className="h-[1px] w-6 sm:w-10 bg-current" style={{ backgroundColor: primaryColor }} />
        </div>
      </div>
    );
  }

  // 3. SIGNATURE SVG VECTOR MONOGRAM MODE (Default)
  const isDefaultSubtitle = subtitleText.toUpperCase().trim() === 'BY SHIKHA WARULE';

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      style={heightScaleStyle}
      className={`inline-flex items-center justify-center cursor-pointer select-none transition-transform duration-300 hover:opacity-95 ${className}`}
    >
      <svg
        viewBox="0 0 520 440"
        className={`${heightMap[size]} w-auto max-w-full drop-shadow-none`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Label SW by Shikha Warule"
      >
        <defs>
          {/* Precise radial arc for curved 'LABEL' text matching image curvature */}
          <path
            id="label-arch-curve"
            d="M 125,160 A 115,115 0 0,1 255,148"
            fill="none"
          />
        </defs>

        {/* 1. Curved 'LABEL' Text above 'S' */}
        <text
          fill={primaryColor}
          fontSize="28"
          fontFamily="'Cinzel', 'Tenor Sans', 'Montserrat', 'Bodoni MT', sans-serif"
          fontWeight="400"
          letterSpacing="0.34em"
        >
          <textPath
            href="#label-arch-curve"
            startOffset="50%"
            textAnchor="middle"
          >
            {curvedText}
          </textPath>
        </text>

        {/* 2. Main Monogram 'S' - High-Contrast Luxury Serif */}
        <g fill={primaryColor}>
          {/* Main 'S' Body with Didone Contrast Spine & Terminals */}
          <path
            d="M 238,168 
               C 236,153 226,142 210,137 
               C 192,130 170,132 153,142 
               C 134,153 125,172 127,196 
               C 130,221 146,238 171,250 
               L 194,261 
               C 220,273 238,289 237,317 
               C 235,346 214,367 186,375 
               C 159,383 129,377 110,359 
               C 107,356 106,352 108,350 
               C 110,347 114,349 118,353 
               C 134,368 159,372 181,365 
               C 205,357 220,338 219,315 
               C 217,293 199,277 174,265 
               L 152,254 
               C 127,241 110,222 113,194 
               C 115,165 136,142 163,131 
               C 189,122 220,126 239,144 
               C 243,148 244,155 241,162 
               Z"
          />
          {/* Top 'S' Terminal wedge / flourish */}
          <path
            d="M 222,143 
               C 240,149 246,166 238,181 
               C 234,181 228,174 227,164 
               C 224,153 216,148 211,146 
               Z"
          />
          {/* Bottom 'S' Left Straight Vertical Cut Terminal */}
          <path
            d="M 110,359 
               L 110,278 
               C 111,280 120,296 132,310 
               C 121,327 114,343 110,359 
               Z"
          />
        </g>

        {/* 3. Main Monogram 'W' with Signature Couture Thread Wing Loop */}
        <g fill={primaryColor}>
          {/* 1st Thick Downward Diagonal Stem (\) */}
          <polygon
            points="254,152 278,152 342,365 318,365"
          />
          {/* Thin Center Upward Diagonal Connector (/) */}
          <polygon
            points="318,365 328,365 348,152 338,152"
            opacity="0.95"
          />
          {/* 2nd Thick Downward Diagonal Stem (\) */}
          <polygon
            points="338,152 362,152 426,365 402,365"
          />
        </g>

        {/* Right Couture Ribbon / Heart Loop Outline connected to 'W' */}
        <path
          d="M 402,365 
             L 426,236 
             C 434,188 456,152 478,152 
             C 499,152 512,176 507,212 
             C 500,262 462,326 416,365"
          fill="none"
          stroke={primaryColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. Horizontal Bottom Subtitle */}
        {isDefaultSubtitle ? (
          <g>
            {/* 'BY SH' */}
            <text
              x="208"
              y="410"
              fill={secondaryColor}
              fontSize="23"
              fontFamily="'Tenor Sans', 'Montserrat', 'Cinzel', sans-serif"
              fontWeight="400"
              letterSpacing="0.32em"
              textAnchor="end"
            >
              BY SH
            </text>

            {/* Couture Sewing Needle with Thread Looped through Eye replacing 'I' */}
            <g transform="translate(216, 378)">
              <line
                x1="6.5"
                y1="4"
                x2="6.5"
                y2="34"
                stroke={secondaryColor}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <ellipse
                cx="6.5"
                cy="9"
                rx="1.2"
                ry="2.6"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="1.1"
              />
              <path
                d="M 6.5,9 
                   C 9.5,4 16,6 14,13 
                   C 12,17 7,14 6.5,10"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </g>

            {/* 'KHA WARULE' */}
            <text
              x="242"
              y="410"
              fill={secondaryColor}
              fontSize="23"
              fontFamily="'Tenor Sans', 'Montserrat', 'Cinzel', sans-serif"
              fontWeight="400"
              letterSpacing="0.32em"
              textAnchor="start"
            >
              KHA WARULE
            </text>
          </g>
        ) : (
          <text
            x="260"
            y="410"
            fill={secondaryColor}
            fontSize="22"
            fontFamily="'Tenor Sans', 'Montserrat', 'Cinzel', sans-serif"
            fontWeight="400"
            letterSpacing="0.32em"
            textAnchor="middle"
          >
            {subtitleText}
          </text>
        )}
      </svg>
    </div>
  );
};
