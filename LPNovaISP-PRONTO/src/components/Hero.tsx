import React, { useState } from 'react';
import { HOTLINK_IMAGES } from '../data/mockData';
import { ArrowRight, Check } from 'lucide-react';

interface HeroProps {
  onScrollToPlans: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToPlans }) => {
  const [imgLoaded, setImgLoaded] = useState(true);

  return (
    <section id="hero" className="relative overflow-hidden pt-16 pb-24 lg:py-32 bg-[#0e0417]">
      {/* Background Hero Image with Measured Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        {imgLoaded && (
          <img
            src={HOTLINK_IMAGES.heroFamily}
            alt="Família conectada Nova ISP Fibra"
            className="w-full h-full object-cover object-center"
            onError={() => setImgLoaded(false)}
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0417] via-[#0e0417]/80 sm:via-[#0e0417]/70 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="max-w-2xl space-y-6 text-left backdrop-blur-md"
          style={{
            textShadow: 'rgba(0, 0, 0, 0.9) 0px 4px 20px, rgba(0, 0, 0, 0.8) 0px 2px 6px',
          }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            A Internet Fibra que <br />
            <span
              className="text-[#ff2d87]"
              style={{ filter: 'drop-shadow(rgba(255, 45, 135, 0.5) 0px 2px 10px)' }}
            >
              Você Sempre Quis.
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl text-white font-medium max-w-xl leading-relaxed"
            style={{ textShadow: 'rgba(0, 0, 0, 0.8) 0px 2px 8px' }}
          >
            Nova ISP: Ultra velocidade, estabilidade e os melhores conteúdos para toda a família
            navegar sem interrupções.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={onScrollToPlans}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#e6007e] to-[#7928ca] rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>VER PLANOS E ASSINAR</span>
              <ArrowRight className="w-5 h-5 ml-2 -mr-1" />
            </button>
          </div>

          {/* Quick Trust Checks */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-xs sm:text-sm font-medium text-slate-200">
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </span>
              <span>100% Fibra Ótica</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </span>
              <span>Suporte 24 horas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </span>
              <span>Wi-Fi na Casa Toda</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
