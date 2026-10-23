import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PricingSection } from './components/PricingSection';
import { TelemedicinaSection } from './components/TelemedicinaSection';
import { MobileAppSection } from './components/MobileAppSection';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { Plan } from './types';
import { RESIDENTIAL_PLANS, TELEMEDICINA_PLAN, NO_FIDELITY_PLANS } from './data/mockData';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [successToast, setSuccessToast] = useState('');
  const [fidelityMode, setFidelityMode] = useState<'fidelity' | 'noFidelity'>('fidelity');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCheckout = (planId?: string) => {
    if (planId === 'plan-telemedicina') {
      setCheckoutPlan(TELEMEDICINA_PLAN);
      return;
    }
    if (planId) {
      const found = RESIDENTIAL_PLANS.find((p) => p.id === planId);
      setCheckoutPlan(found || RESIDENTIAL_PLANS[1]);
    } else {
      setCheckoutPlan(RESIDENTIAL_PLANS[1]); // Default to featured 800MB + NovaEduca
    }
  };

  const handleCheckoutSuccess = () => {
    setCheckoutPlan(null);
    setSuccessToast('Contratação enviada! Verifique se a planilha do Google Sheets está conectada.');
    setTimeout(() => {
      setSuccessToast('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#faf8fc] text-slate-800 font-sans selection:bg-[#e6007e] selection:text-white relative">
      <Header
        onOpenCheckout={() => handleOpenCheckout()}
        onScrollTo={scrollTo}
      />

      <main>
        <Hero onScrollToPlans={() => scrollTo('planos')} />

        <PricingSection
          onSelectPlan={(plan) => setCheckoutPlan(plan)}
          fidelityMode={fidelityMode}
          onToggleFidelity={setFidelityMode}
        />

        <TelemedicinaSection
          onContractTelemedicina={() => handleOpenCheckout('plan-telemedicina')}
        />

        <MobileAppSection />
      </main>

      <Footer onScrollTo={scrollTo} />

      {/* Checkout / Subscription Modal */}
      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Global Success Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{successToast}</span>
        </div>
      )}
    </div>
  );
}
