import React from 'react';
import { HOTLINK_IMAGES } from '../data/mockData';

export const MobileAppSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#21093b] via-[#3a0b5c] to-[#e6007e] text-white relative overflow-hidden">
      {/* Glow Decor */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#e6007e]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-pink-300 font-semibold text-xs tracking-wider uppercase border border-white/10">
              Aplicativo Nova ISP
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Baixe Nosso App e Tenha Controle Total na Palma da Mão
            </h2>
            <p className="text-purple-100 text-base sm:text-lg max-w-xl">
              Consulte 2ª via de fatura, monitore seu consumo de dados em tempo real, desbloqueie seu
              sinal por confiança e abra chamados de suporte instantâneo.
            </p>

            {/* Store Download Badges */}
            <div className="pt-4 flex flex-wrap gap-4">
              {/* App Store Button */}
              <a
                className="flex items-center gap-3 bg-black/60 hover:bg-black/90 px-5 py-3 rounded-2xl border border-white/20 transition-all hover:scale-105 active:scale-95"
                href="https://apps.apple.com/br/app/nova-isp/id1552940484"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-1.06 1.73-0.93 2.76 1 .08 2.02-.51 2.64-1.26z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-slate-300">
                    Disponível na
                  </div>
                  <div className="text-base font-bold leading-tight">App Store</div>
                </div>
              </a>

              {/* Google Play Button */}
              <a
                className="flex items-center gap-3 bg-black/60 hover:bg-black/90 px-5 py-3 rounded-2xl border border-white/20 transition-all hover:scale-105 active:scale-95"
                href="https://play.google.com/store/apps/details?id=br.com.portal.novanet&hl=pt_BR"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-slate-300">
                    Disponível no
                  </div>
                  <div className="text-base font-bold leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* Smartphone Mockup UI */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative flex items-center justify-center py-6"
              style={{ perspective: '1200px' }}
            >
              <div className="absolute -bottom-6 w-56 h-12 bg-black/60 rounded-full blur-xl transform -rotate-1 scale-95"></div>
              <div className="absolute -bottom-8 w-44 h-8 bg-[#e6007e]/30 rounded-full blur-2xl"></div>
              <div
                className="relative mx-auto border-gray-900 bg-gray-900 border-[10px] rounded-[2.5rem] h-[520px] w-[260px] overflow-hidden ring-1 ring-white/30 transition-transform duration-500 hover:scale-105"
                style={{
                  transform: 'rotateY(-18deg) rotateX(10deg) rotateZ(-3deg)',
                  transformStyle: 'preserve-3d',
                  boxShadow:
                    '-22px 28px 50px -10px rgba(0, 0, 0, 0.75), -8px 10px 20px -5px rgba(230, 0, 126, 0.25), inset -2px -2px 6px rgba(255, 255, 255, 0.15), inset 2px 2px 6px rgba(255, 255, 255, 0.25)',
                }}
              >
                <div className="w-[100px] h-[18px] bg-gray-900 top-0 left-1/2 -translate-x-1/2 absolute rounded-b-[1rem] z-20 flex items-center justify-center">
                  <div className="w-10 h-1 bg-gray-700 rounded-full"></div>
                </div>
                <div className="h-full w-full overflow-hidden rounded-[1.8rem] bg-[#0e0417] relative">
                  <img
                    src={HOTLINK_IMAGES.appScreen}
                    alt="Nova ISP App"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-70"
                    style={{ mixBlendMode: 'overlay' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
