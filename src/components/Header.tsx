import React, { useState } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onOpenCheckout: (planId?: string) => void;
  onScrollTo: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCheckout,
  onScrollTo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#150a24]/95 backdrop-blur-md border-b border-purple-900/30 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onScrollTo('hero')}
          className="flex items-center gap-3 group focus:outline-none shrink-0 cursor-pointer"
          title="Nova ISP Home"
        >
          <Logo className="h-8 w-auto object-contain group-hover:scale-105 transition-transform" />
        </button>

        {/* Desktop Navigation Menu (Matching Image 4) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('planos')}
            className="hover:text-white hover:text-[#e6007e] transition-colors cursor-pointer whitespace-nowrap focus:outline-none"
          >
            Para sua casa
          </button>
          <button
            onClick={() => handleNavClick('atendimento')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap focus:outline-none"
          >
            Cobertura
          </button>
          <button
            onClick={() => handleNavClick('atendimento')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap focus:outline-none"
          >
            Atendimento
          </button>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenCheckout()}
            className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#e6007e] to-[#b50063] rounded-full shadow-lg shadow-[#e6007e]/40 hover:shadow-[#e6007e]/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            Assine Agora
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none rounded-lg hover:bg-purple-900/30"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#120720] border-b border-purple-900/40 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <button
            onClick={() => handleNavClick('planos')}
            className="block w-full text-left py-2 px-3 text-slate-200 hover:bg-purple-900/30 rounded-lg text-sm font-medium"
          >
            Para sua casa
          </button>
          <button
            onClick={() => handleNavClick('atendimento')}
            className="block w-full text-left py-2 px-3 text-slate-200 hover:bg-purple-900/30 rounded-lg text-sm font-medium"
          >
            Cobertura
          </button>
          <button
            onClick={() => handleNavClick('atendimento')}
            className="block w-full text-left py-2 px-3 text-slate-200 hover:bg-purple-900/30 rounded-lg text-sm font-medium"
          >
            Atendimento
          </button>

          <div className="pt-3 border-t border-purple-900/50">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#e6007e] to-[#b50063] text-white font-bold text-xs shadow-md"
            >
              <span>Assine Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
