import React from 'react';
import { HOTLINK_IMAGES } from '../data/mockData';
import { Check, ArrowRight } from 'lucide-react';

interface TelemedicinaSectionProps {
  onContractTelemedicina: () => void;
}

export const TelemedicinaSection: React.FC<TelemedicinaSectionProps> = ({
  onContractTelemedicina,
}) => {
  return (
    <section id="telemedicina" className="py-20 bg-[#faf7fc] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1f0d38] tracking-tight">
            Telemedicina 24h para Toda a Família
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            Cuidado médico de qualidade na palma da mão, sem filas e disponível a qualquer momento no
            seu plano de internet.
          </p>
        </div>

        {/* Feature Hero Card with Doctor Visual */}
        <div
          className="relative rounded-3xl p-8 sm:p-12 border border-purple-900/40 shadow-2xl overflow-hidden transition-all bg-[#0e0417]"
          style={{
            backgroundImage: `url("${HOTLINK_IMAGES.doctor}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
          }}
        >
          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0417]/95 via-[#0e0417]/80 sm:via-[#0e0417]/65 to-[#0e0417]/25 z-0"></div>

          <div className="relative z-10 max-w-2xl space-y-6 text-left backdrop-blur-none">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#e6007e]/90 px-3.5 py-1 rounded-full shadow-sm">
                Parceria Ixer SulAmérica
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Saúde e tranquilidade conectadas à sua internet
            </h3>

            <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
              Tenha atendimento médico ágil e humanizado para você e seus dependentes diretamente pelo
              celular ou computador, a qualquer hora do dia ou da noite.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  <Check className="w-4 h-4" />
                </span>
                <span className="text-slate-100 text-sm font-medium">
                  Consultas online 24h por dia, 7 dias por semana
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  <Check className="w-4 h-4" />
                </span>
                <span className="text-slate-100 text-sm font-medium">
                  Médicos gerais e diversas especialidades
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  <Check className="w-4 h-4" />
                </span>
                <span className="text-slate-100 text-sm font-medium">
                  Sem carência e sem complicação no atendimento
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  <Check className="w-4 h-4" />
                </span>
                <span className="text-slate-100 text-sm font-medium">
                  Prescrições e atestados médicos válidos em todo o Brasil
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onContractTelemedicina}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#e6007e] to-[#7928ca] rounded-full hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-glow-magenta"
              >
                <span>Contratar Telemedicina</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <div className="inline-flex items-center justify-center sm:justify-start gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg select-none">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-pink-300">
                  Por apenas
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-pink-200">R$</span>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                    29,90
                  </span>
                  <span className="text-xs font-semibold text-slate-300">/mês</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
