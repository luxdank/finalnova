import React, { useState } from 'react';
import { HOTLINK_IMAGES } from '../data/mockData';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto', variant = 'light' }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        {/* Nova ISP Stylized Icon */}
        <div className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
          <svg viewBox="0 0 100 100" className="w-6 h-6">
            <path
              d="M30,20 C18,20 18,36 18,50 C18,64 24,78 38,78 C52,78 48,58 62,58 C74,58 82,68 82,78 C82,50 82,20 66,20 C52,20 46,38 34,38 C28,38 28,20 30,20 Z"
              fill="#120720"
            />
            <circle cx="68" cy="36" r="10" fill="#e6007e" />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline leading-none">
            <span className={`text-xl font-black tracking-tight ${variant === 'dark' ? 'text-slate-900' : 'text-white'}`}>
              nova
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#e6007e] ml-0.5 uppercase">
              ISP
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={HOTLINK_IMAGES.logo}
      alt="Nova ISP Fibra"
      className={`${className} object-contain`}
      onError={() => setImgError(true)}
      referrerPolicy="no-referrer"
    />
  );
};
