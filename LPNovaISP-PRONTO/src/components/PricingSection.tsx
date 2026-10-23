import React, { useRef, useState } from 'react';
import { Plan } from '../types';
import { RESIDENTIAL_PLANS, NO_FIDELITY_PLANS } from '../data/mockData';
import { ArrowDown, ArrowUp, Wifi, ChevronLeft, ChevronRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: Plan) => void;
  fidelityMode?: 'fidelity' | 'noFidelity';
  onToggleFidelity?: (mode: 'fidelity' | 'noFidelity') => void;
}

const renderPlanCard = (
  plan: Plan,
  mode: 'fidelity' | 'noFidelity',
  onSelectPlan: (plan: Plan) => void,
) => {
  const isNoFidelity = mode === 'noFidelity';
  const price = isNoFidelity ? plan.priceFidelity : plan.priceFidelity;

  const themeConfig: Record<string, { bg: string; text: string; badge: string; badgeText: string }> = {
    purple: {
      bg: 'bg-[#7738b5]',
      text: 'text-[#7738b5]',
      badge: 'bg-[#f3ecfa]',
      badgeText: 'text-[#7738b5]',
    },
    magenta: {
      bg: 'bg-[#a3084e]',
      text: 'text-[#a3084e]',
      badge: 'bg-[#fcedf4]',
      badgeText: 'text-[#a3084e]',
    },
    deepPurple: {
      bg: 'bg-[#52178e]',
      text: 'text-[#52178e]',
      badge: 'bg-[#f3ecfa]',
      badgeText: 'text-[#7738b5]',
    },
  };

  const cfg = themeConfig[plan.themeColor];

  return (
    <div
      key={plan.id}
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between border border-purple-100 h-full"
    >
      <div className={`${cfg.bg} text-white py-8 px-8 text-center flex flex-col items-center justify-center min-h-[150px] relative`}>
        <div className="mb-3">
          <Wifi className="w-10 h-10 opacity-90 mx-auto" />
        </div>
        <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
          800MB
        </h3>
        <span className="text-xs font-semibold tracking-wider uppercase text-purple-100 mt-2 opacity-90">
          {plan.subtitle}
        </span>
        {isNoFidelity && (
          <span className="absolute top-4 right-4 px-2 py-1 rounded bg-[#e6007e] text-white text-[10px] font-bold uppercase tracking-wider">
            Sem fidelidade
          </span>
        )}
      </div>

      <div className="p-8 flex flex-col items-center flex-1 justify-between bg-white">
        <div className="w-full flex flex-col items-center flex-1">
          <div className="flex flex-col gap-2.5 items-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${cfg.badge} ${cfg.badgeText} text-xs font-bold tracking-wide">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>800MB DOWNLOAD</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${cfg.badge} ${cfg.badgeText} text-xs font-bold tracking-wide">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>400MB UPLOAD</span>
            </div>
          </div>

          <div className="w-full text-center mb-8 flex-1 flex flex-col">
            <h4 className="text-base font-extrabold text-slate-900 mb-3">Serviços inclusos</h4>
            <div className="flex flex-col items-center justify-center gap-2 min-h-[96px]">
              {plan.includedServices.map((srv, idx) => (
                <span
                  key={idx}
                  className="px-5 py-1.5 rounded-full bg-[#e6007e] text-white text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  {srv}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full text-center pt-6 border-t border-slate-100 mt-auto">
          <div className={`text-xs font-bold text-slate-700 mb-1 ${isNoFidelity ? 'text-rose-600' : ''}`}>
            {isNoFidelity ? 'Sem fidelidade' : 'Com fidelidade'}
          </div>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-2xl font-black text-[#1e1b4b]">R$</span>
            <span className="text-4xl font-black text-[#1e1b4b] tabular-nums">
              {price.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-xs font-bold text-slate-500">/mês</span>
          </div>

          {isNoFidelity ? (
            <div className="flex flex-col items-center gap-1.5 mb-6 min-h-[110px] justify-center">
              <span className="px-3 py-1 rounded-full bg-[#ede5f7] text-[#7738b5] text-[10px] font-extrabold tracking-wider uppercase">
                CANCELE QUANDO QUISER
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                SEM MULTAS POR RESCISÃO
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                FLEXIBILIDADE TOTAL
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 mb-6 min-h-[76px] justify-center">
              <span className="px-3 py-1 rounded-full bg-[#ede5f7] text-[#7738b5] text-[10px] font-extrabold tracking-wider uppercase">
                MELHOR CUSTO-BENEFÍCIO
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                PREÇO GARANTIDO POR 12 MESES
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                ECONOMIA DE R$ 240,00
              </span>
            </div>
          )}

          <button
            onClick={() => onSelectPlan(plan)}
            className={`block w-full py-3.5 px-6 rounded-full text-white text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg active:scale-95 transition-all text-center cursor-pointer ${isNoFidelity ? 'bg-[#e6007e] hover:#b50063' : 'bg-[#0a2540] hover:bg-[#153456]'}`}
          >
            {isNoFidelity ? 'ASSINE SEM FIDELIDADE' : 'ASSINE COM FIDELIDADE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  fidelityMode = 'fidelity',
  onToggleFidelity,
}) => {
  const [mode, setMode] = useState<'fidelity' | 'noFidelity'>(fidelityMode);
  const scrollRef = useRef<HTMLDivElement>(null);

  const plans = mode === 'noFidelity' ? NO_FIDELITY_PLANS : RESIDENTIAL_PLANS;

  const handleToggle = (next: 'fidelity' | 'noFidelity') => {
    setMode(next);
    onToggleFidelity?.(next);
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const isAtStart = (scrollRef.current?.scrollLeft ?? 0) <= 0;
  const isAtEnd =
    scrollRef.current ? scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth - 1 : false;

  return (
    <section id="planos" className="py-20 bg-white relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1f0d38] tracking-tight">
            Escolha o seu plano Nova
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Velocidades surpreendentes para jogar, trabalhar e transmitir conteúdos em 4K
            simultâneos com estabilidade absoluta.
          </p>
        </div>

        {/* Tabs: Fidelidade / Sem Fidelidade */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-2xl bg-[#f3ecfa] shadow-sm">
            <button
              onClick={() => handleToggle('fidelity')}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'fidelity'
                  ? 'bg-white text-[#7738b5] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Com Fidelidade
            </button>
            <button
              onClick={() => handleToggle('noFidelity')}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'noFidelity'
                  ? 'bg-white text-[#e6007e] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sem Fidelidade
            </button>
          </div>
        </div>

        {/* Mobile Carousel - setas para navegar de lado */}
        <div className="md:hidden relative">
          <div
            ref={scrollRef}
            className="flex flex-row snap-x snap-mandatory gap-6 px-4 pb-14 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {plans.map((plan) => (
              <div key={plan.id} className="snap-start shrink-0 w-[calc(100%-2rem)] max-w-[340px]">
                {renderPlanCard(plan, mode, onSelectPlan)}
              </div>
            ))}
          </div>

          {/* Setas de navegação mobile */}
          <div className="flex justify-between items-center px-4 mt-4">
            <button
              onClick={scrollPrev}
              disabled={isAtStart}
              className={`p-3 rounded-full bg-white text-[#7738b5] shadow-md transition-all flex items-center justify-center ${
                isAtStart ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f3ecfa]'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={isAtEnd}
              className={`p-3 rounded-full bg-white text-[#7738b5] shadow-md transition-all flex items-center justify-center ${
                isAtEnd ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f3ecfa]'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Grid - 3 colunas lado a lado */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {plans.map((plan) => renderPlanCard(plan, mode, onSelectPlan))}
          </div>
        </div>
      </div>
    </section>
  );
};
