import React, { useState } from 'react';
import { HOTLINK_IMAGES } from '../data/mockData';

interface FooterProps {
  onScrollTo: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <footer id="atendimento" className="bg-[#0e0417] text-slate-400 text-sm py-14 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {!imgError ? (
                <img
                  src={HOTLINK_IMAGES.footerLogo}
                  alt="Nova ISP"
                  className="h-8 w-auto object-contain"
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <span className="text-black font-black text-xs">n</span>
                  </div>
                  <span className="text-white font-extrabold text-base">nova ISP</span>
                </div>
              )}
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Conectando você ao futuro com fibra ótica de ultra performance e suporte humanizado de
              verdade.
            </p>
          </div>

          {/* Col 2: Planos */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Planos Residenciais
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onScrollTo('planos')}
                  className="hover:text-[#e6007e] transition-colors cursor-pointer text-left"
                >
                  Fibra 800MB Basic
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('planos')}
                  className="hover:text-[#e6007e] transition-colors cursor-pointer text-left"
                >
                  Fibra 800MB + NovaEduca
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('planos')}
                  className="hover:text-[#e6007e] transition-colors cursor-pointer text-left"
                >
                  Fibra 800MB + Seguro
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Suporte & Legal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Suporte &amp; Regulatório
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#central-de-ajuda" className="hover:text-[#e6007e] transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#anatel" className="hover:text-[#e6007e] transition-colors">
                  Regulamento Anatel
                </a>
              </li>
              <li>
                <a href="#contrato" className="hover:text-[#e6007e] transition-colors">
                  Contrato de Adesão
                </a>
              </li>
              <li>
                <a href="#privacidade" className="hover:text-[#e6007e] transition-colors">
                  Política de Privacidade (LGPD)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contato */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Atendimento
            </h4>
            <p className="text-xs text-slate-400 mb-1">Central &amp; WhatsApp:</p>
            <a
              href="https://wa.me/552127625350"
              target="_blank"
              rel="noreferrer"
              className="text-base font-extrabold text-white hover:text-emerald-400 transition-colors block"
            >
              (21) 2762-5350
            </a>
            <p className="text-xs text-slate-400 mt-2">Segunda a Domingo, 24 horas.</p>
          </div>
        </div>

        <div className="border-t border-purple-900/30 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2025 Nova ISP Telecomunicações S.A. Todos os direitos reservados.</p>
          <p className="mt-2 sm:mt-0">Velocidade anunciada sujeita a viabilidade técnica.</p>
        </div>
      </div>
    </footer>
  );
};
