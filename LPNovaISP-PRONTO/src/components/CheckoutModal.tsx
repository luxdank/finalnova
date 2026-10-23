import React, { useState } from 'react';
import { Plan } from '../types';
import { X, CheckCircle2, ArrowRight, ArrowLeft, MessageCircle, Loader2, AlertTriangle } from 'lucide-react';
import { getAccessToken } from '../services/googleAuth';
import { getAppsScriptUrl, getSavedSpreadsheetId, appendLeadToGoogleSheet } from '../services/googleSheets';

interface CheckoutModalProps {
  plan: Plan;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  plan,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [sheetsSent, setSheetsSent] = useState(false);
  const [sheetsError, setSheetsError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setSheetsSent(false);
    setSheetsError(null);

    const leadData = {
      name,
      cpf: '',
      phone,
      email: '',
      neighborhood: '',
      cep,
      street: '',
      number: '',
      complement: '',
      planName: `${plan.name} ${plan.subtitle}`.trim(),
      planPrice: `R$ ${plan.priceFidelity.toFixed(2).replace('.', ',')}`,
    };

    let sheetsSuccess = false;
    let sheetsErrMsg: string | null = null;

    // 1. Try sending to Google Apps Script Webhook via server-side proxy (avoids no-cors)
    try {
      const appsScriptUrl = getAppsScriptUrl();
      if (appsScriptUrl) {
        const proxyRes = await fetch('/api/leads-to-sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webhookUrl: appsScriptUrl,
            ...leadData,
            dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
          }),
        });
        const proxyJson = await proxyRes.json();
        if (proxyJson.success) {
          sheetsSuccess = true;
        } else {
          sheetsErrMsg = proxyJson.error || 'Falha ao enviar para o Google Apps Script.';
        }
      }
    } catch (err) {
      sheetsErrMsg = 'Erro ao contatar o servidor para o Google Apps Script.';
      console.warn('Apps script proxy error:', err);
    }

    // 2. Try appending directly to connected Google Sheets via OAuth API
    if (!sheetsSuccess) {
      try {
        const token = await getAccessToken();
        const spreadsheetId = getSavedSpreadsheetId();
        if (token && spreadsheetId) {
          const apiOk = await appendLeadToGoogleSheet(token, spreadsheetId, leadData);
          if (apiOk) {
            sheetsSuccess = true;
          } else {
            sheetsErrMsg = sheetsErrMsg || 'Falha ao enviar via Google Sheets API.';
          }
        }
      } catch (err) {
        sheetsErrMsg = sheetsErrMsg || 'Erro na conexão OAuth com o Google Sheets.';
        console.warn('Google Sheets append error:', err);
      }
    }

    setSheetsSent(sheetsSuccess);
    setSheetsError(sheetsErrMsg);

    // 3. Also send data to server-side backup spreadsheet (/api/leads)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          date: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('Fallback to local storage for spreadsheet recording:', err);
    }

    // 4. Backup to localStorage spreadsheet
    try {
      const existing = JSON.parse(localStorage.getItem('novaisp_planilha_leads') || '[]');
      existing.push({ ...leadData, date: new Date().toISOString() });
      localStorage.setItem('novaisp_planilha_leads', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    // 5. Format message and WhatsApp redirect
    const chosenServiceName = `${plan.name} ${plan.subtitle}`.trim();

    const message = `Olá! Acabei de me cadastrar pelo site da Nova ISP e desejo concluir minha contratação.\n\n*Serviço / Plano Escolhido:* ${chosenServiceName} (R$ ${plan.priceFidelity.toFixed(2).replace('.', ',')}/mês)\n\n*Meus Dados:*\n- *Nome:* ${name}\n- *Celular:* ${phone}\n- *CEP:* ${cep}\n\nAguardo o retorno para agendamento!`;

    const whatsappUrl = `https://wa.me/552127922350?text=${encodeURIComponent(message)}`;
    setRedirectUrl(whatsappUrl);

    // Call success callback
    onSuccess();

    // Redirect to WhatsApp
    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                step >= 1 ? 'bg-[#e6007e] text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              1
            </span>
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                step >= 2 ? 'bg-[#e6007e] text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {step === 1 ? 'Confirmar Plano' : 'Seus Dados'}
          </span>
        </div>

        {/* STEP 1: PLAN DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#7738b5] uppercase">
                  {plan.id === 'plan-telemedicina' ? 'Serviço Digital de Saúde' : 'Plano Residencial Nova ISP'}
                </span>
                <h3 className="text-2xl font-black text-[#1e1b4b]">
                  {plan.name} {plan.subtitle}
                </h3>
                <div className="text-xs text-slate-600 mt-1">
                  {plan.id === 'plan-telemedicina'
                    ? `${plan.speed} • Parceria SulAmérica`
                    : `Velocidade: ${plan.download} • ${plan.upload}`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-semibold">
                  {plan.id === 'plan-telemedicina' ? 'Valor Mensal' : 'Com fidelidade'}
                </div>
                <div className="text-2xl font-black text-[#1e1b4b] tabular-nums">
                  R$ {plan.priceFidelity.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[10px] text-slate-400">/mês</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Benefícios Inclusos na Assinatura:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.includedServices.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PERSONAL DATA */}
        {step === 2 && !redirectUrl && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Seus Dados</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Celular / WhatsApp</label>
                <input
                  type="text"
                  required
                  placeholder="(21) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CEP</label>
              <input
                type="text"
                required
                placeholder="26182-010"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
              />
            </div>
          </form>
        )}

        {/* REDIRECTION STATE TO WHATSAPP */}
        {redirectUrl && (
          <div className="py-8 text-center space-y-4">
            {sheetsSent ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Dados Salvos na Planilha com Sucesso!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Os dados foram enviados para o Google Sheets e você está sendo redirecionado para o WhatsApp da Nova ISP:{' '}
                  <strong className="text-emerald-700 font-bold">(21) 2792-2350</strong>...
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Cadastro Enviado, Mas a Planilha Não Sincronizou
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Os dados foram salvos localmente, mas não foi possível gravar na planilha do Google Sheets.{' '}
                  {sheetsError ? (
                    <span className="block mt-1 text-xs text-rose-600">{sheetsError}</span>
                  ) : null}
                </p>
              </>
            )}
            <div className="pt-2">
              <a
                href={redirectUrl}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Clique aqui se não abrir automaticamente</span>
              </a>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        {!redirectUrl && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            ) : (
              <div></div>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-gradient-to-r from-[#e6007e] to-[#7928ca] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ml-auto"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ml-auto disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando na Planilha...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar e Ir para o WhatsApp (21) 2792-2350</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
