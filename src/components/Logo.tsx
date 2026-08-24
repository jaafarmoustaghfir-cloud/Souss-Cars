import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/initialData';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showSlogan?: boolean;
  imageOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'light',
  showSlogan = false,
  imageOnly = false
}) => {
  const [imgError, setImgError] = useState(false);

  const imgDimensions = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10 sm:h-11 sm:w-11',
    lg: 'h-12 w-12 sm:h-14 sm:w-14',
    xl: 'h-16 w-16 sm:h-20 sm:w-20',
  };

  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Official Brand Logo Icon / Image container */}
      <div className={`relative flex items-center justify-center p-1 rounded-2xl bg-[#141414] border border-[#F5C518]/40 shadow-lg group-hover:border-[#F5C518] transition-all duration-300 overflow-hidden shrink-0`}>
        {/* Subtle glow backdrop */}
        <div className="absolute inset-0 bg-[#F5C518]/10 rounded-2xl blur-[2px] group-hover:bg-[#F5C518]/20 transition-all" />
        
        {!imgError ? (
          <img
            src={BUSINESS_INFO.logoUrl}
            alt="Sky Souss Cars Logo"
            className={`${imgDimensions[size]} relative z-10 object-contain rounded-xl transition-transform duration-300 group-hover:scale-105`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg 
            className={`${imgDimensions[size]} relative z-10 text-[#F5C518] p-1`}
            viewBox="0 0 64 36" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M8 24C9 20 13 14 18 12C23 10 37 9 44 11C49 12 55 17 58 24" 
              stroke="currentColor" 
              strokeWidth="3.2" 
              strokeLinecap="round"
            />
            <path 
              d="M23 12.5L25 22M38 10.5L37 22" 
              stroke="#FAFAFA" 
              strokeWidth="1.8" 
              strokeLinecap="round"
              opacity="0.85"
            />
            <path 
              d="M58 24L61 25.5C62.5 26.2 62.5 28 61 28.5L54 29" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            <path 
              d="M8 24L3 25C1.8 25.4 1.5 27 2.5 28L8 29" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            <path 
              d="M19 29H43" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
            <circle cx="49" cy="27.5" r="4.5" fill="#0D0D0D" stroke="#FAFAFA" strokeWidth="2.5" />
            <circle cx="49" cy="27.5" r="1.8" fill="#F5C518" />
            <circle cx="14" cy="27.5" r="4.5" fill="#0D0D0D" stroke="#FAFAFA" strokeWidth="2.5" />
            <circle cx="14" cy="27.5" r="1.8" fill="#F5C518" />
          </svg>
        )}
      </div>

      {/* Brand Text */}
      {!imageOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5 font-heading">
            <span className={`font-black uppercase tracking-wider ${isLight ? 'text-white' : 'text-[#0D0D0D]'}`}>
              SKY SOUSS
            </span>
            <span className="text-[#F5C518] font-black uppercase tracking-wider">
              CARS
            </span>
          </div>
          
          {showSlogan ? (
            <span className="text-[10px] tracking-wider uppercase text-zinc-400 font-semibold mt-1">
              Location de voitures à Agadir
            </span>
          ) : (
            <span className="text-[9px] tracking-widest uppercase text-[#F5C518] font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] inline-block animate-pulse" />
              Agadir · Dès 250 DH/j
            </span>
          )}
        </div>
      )}
    </div>
  );
};

