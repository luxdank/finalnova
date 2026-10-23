import React, { useState, useEffect } from 'react';
import {
  googleSignIn,
  logoutGoogle,
  initAuth,
} from '../services/googleAuth';
import {
  getSavedSpreadsheetId,
  saveSpreadsheetId,
  createNewLeadSpreadsheet,
  getLeadSpreadsheetRows,
  GOOGLE_APPS_SCRIPT_CODE,
  getSavedAppsScriptUrl,
  saveAppsScriptUrl,
  sendLeadToAppsScript,
} from '../services/googleSheets';
import { User } from 'firebase/auth';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Table,
  Loader2,
  Link as LinkIcon,
  Code2,
  Copy,
  Send,
} from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'script' | 'oauth'>('script');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string>('');
  const [inputUrlOrId, setInputUrlOrId] = useState<string>('');
  const [appsScriptUrl, setAppsScriptUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isTestingScript, setIsTestingScript] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [rows, setRows] = useState<string[][]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );

    const savedId = getSavedSpreadsheetId();
    if (savedId) setSpreadsheetId(savedId);

    const savedScriptUrl = getSavedAppsScriptUrl();
    if (savedScriptUrl) setAppsScriptUrl(savedScriptUrl);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (accessToken && spreadsheetId) {
      loadSpreadsheetData(accessToken, spreadsheetId);
    }
  }, [accessToken, spreadsheetId]);

  const loadSpreadsheetData = async (token: string, sId: string) => {
    setIsLoading(true);
    try {
      const data = await getLeadSpreadsheetRows(token, sId);
      setRows(data);
      setStatusMessage({ type: 'success', text: 'Planilha conectada e sincronizada!' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Não foi possível carregar os dados. Verifique as permissões da planilha.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleSaveAppsScriptUrl = () => {
    if (!appsScriptUrl.trim()) return;
    saveAppsScriptUrl(appsScriptUrl.trim());
    setStatusMessage({
      type: 'success',
      text: 'URL do Google Apps Script salva com sucesso! Os próximos leads serão enviados para ela.',
    });
  };

  const handleTestAppsScript = async () => {
    if (!appsScriptUrl.trim()) return;
    setIsTestingScript(true);
    saveAppsScriptUrl(appsScriptUrl.trim());
    try {
      await sendLeadToAppsScript(appsScriptUrl.trim(), {
        name: 'Lead Teste Nova ISP',
        cpf: '000.000.000-00',
        phone: '(21) 98765-4321',
        email: 'teste@novaisp.com.br',
        neighborhood: 'Belford Roxo',
        cep: '26182-010',
        street: 'Rua Lamartine Júnior',
        number: '12',
        complement: 'Bloco C',
        planName: '800MB + NovaEduca',
        planPrice: 'R$ 135,90',
      });
      setStatusMessage({
        type: 'success',
        text: 'Linha de teste enviada para sua planilha do Google Sheets! Verifique sua planilha.',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Erro ao enviar lead de teste. Verifique se o App da Web está com acesso "Qualquer pessoa".',
      });
    } finally {
      setIsTestingScript(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
        setStatusMessage({ type: 'success', text: `Conectado como ${result.user.email}` });

        const savedId = getSavedSpreadsheetId();
        if (savedId) {
          loadSpreadsheetData(result.accessToken, savedId);
        }
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao conectar com Google.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setAccessToken(null);
    setRows([]);
    setStatusMessage(null);
  };

  const handleCreateNew = async () => {
    if (!accessToken) return;
    setIsCreating(true);
    setStatusMessage(null);
    try {
      const newId = await createNewLeadSpreadsheet(accessToken);
      setSpreadsheetId(newId);
      await loadSpreadsheetData(accessToken, newId);
      setStatusMessage({
        type: 'success',
        text: 'Nova planilha criada com sucesso no seu Google Drive!',
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao criar planilha.' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLinkExisting = () => {
    if (!inputUrlOrId.trim()) return;

    let extractedId = inputUrlOrId.trim();
    const match = inputUrlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      extractedId = match[1];
    }

    setSpreadsheetId(extractedId);
    saveSpreadsheetId(extractedId);
    if (accessToken) {
      loadSpreadsheetData(accessToken, extractedId);
    }
  };

  if (!isOpen) return null;

  const sheetsUrl = spreadsheetId
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Conexão com Google Sheets
            </h2>
            <p className="text-xs text-slate-500">
              Gere o código para o Google Apps Script da sua planilha ou conecte sua conta Google.
            </p>
          </div>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div
            className={`mb-6 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tabs Switcher */}
        <div className="flex border-b border-slate-200 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('script')}
            className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'script'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Código Apps Script (Webhook)</span>
          </button>
          <button
            onClick={() => setActiveTab('oauth')}
            className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'oauth'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Conexão Direta (Conta Google)</span>
          </button>
        </div>

        {/* TAB 1: APPS SCRIPT CODE & WEBHOOK */}
        {activeTab === 'script' && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Como instalar o código na sua Planilha Google:
              </h3>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                <li>Abra sua planilha no Google Sheets (nova ou existente).</li>
                <li>No menu superior, clique em: <strong>Extensões &gt; Apps Script</strong>.</li>
                <li>Apague o conteúdo padrão e <strong>cole o código abaixo</strong>.</li>
                <li>Clique em <strong>Salvar (ícone de disquete)</strong>.</li>
                <li>
                  Clique em <strong>Implantar &gt; Nova implantação</strong>.
                </li>
                <li>
                  Selecione o tipo <strong>App da Web</strong>, configure <em>Quem pode acessar</em> para <strong>Qualquer pessoa (Anyone)</strong> e clique em Implantar.
                </li>
                <li>Copie o link do App da Web e cole no campo abaixo para testar!</li>
              </ol>
            </div>

            {/* Code Box with Copy Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>Código Google Apps Script (JavaScript)</span>
                </span>
                <button
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedScript ? 'Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-[#0e0417] text-purple-100 p-4 font-mono text-xs overflow-x-auto max-h-64 border border-purple-900/50">
                <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
              </div>
            </div>

            {/* Webhook URL Input */}
            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 space-y-3">
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  Cole aqui a URL do App da Web gerada no Google Sheets:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={appsScriptUrl}
                    onChange={(e) => setAppsScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveAppsScriptUrl}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                  >
                    Salvar URL
                  </button>
                </div>
              </div>

              {appsScriptUrl && (
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-emerald-200/60">
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    Deseja enviar uma linha de teste para confirmar o funcionamento?
                  </span>
                  <button
                    onClick={handleTestAppsScript}
                    disabled={isTestingScript}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-60 transition-all shadow-xs"
                  >
                    {isTestingScript ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Linha de Teste</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DIRECT GOOGLE DRIVE OAUTH */}
        {activeTab === 'oauth' && (
          <div className="space-y-6">
            {!currentUser ? (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-4">
                <div className="max-w-md mx-auto">
                  <h3 className="text-base font-bold text-slate-900">Conecte sua Conta Google</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Para vincular e enviar leads para o Google Sheets em tempo real via API oficial, faça login com sua conta Google.
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-6 py-3 rounded-full border border-slate-300 shadow-sm transition-all hover:shadow cursor-pointer disabled:opacity-60"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                    <span>{isLoading ? 'Conectando...' : 'Conectar com Google'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                      <span>{currentUser.displayName || 'Usuário Google'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
                        Conectado
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-800">{currentUser.email}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Desconectar</span>
                </button>
              </div>
            )}

            {currentUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A: Create new sheet */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                        Opção Automática
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Criar Nova Planilha no Drive
                      </h4>
                      <p className="text-xs text-slate-500 mb-4">
                        Cria automaticamente uma planilha formatada com todas as colunas de leads.
                      </p>
                    </div>

                    <button
                      onClick={handleCreateNew}
                      disabled={isCreating}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Criando no Drive...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Criar Planilha no Drive</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Option B: Link existing sheet */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                        Vincular por ID
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Usar Planilha Existente
                      </h4>
                      <p className="text-xs text-slate-500 mb-3">
                        Cole o link ou ID da planilha do seu Drive.
                      </p>
                      <input
                        type="text"
                        value={inputUrlOrId}
                        onChange={(e) => setInputUrlOrId(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:border-emerald-600 focus:outline-none mb-3"
                      />
                    </div>

                    <button
                      onClick={handleLinkExisting}
                      disabled={!inputUrlOrId.trim()}
                      className="w-full py-2.5 px-4 bg-[#120720] hover:bg-purple-950 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Vincular Planilha</span>
                    </button>
                  </div>
                </div>

                {/* Active Spreadsheet Details */}
                {spreadsheetId && (
                  <div className="bg-white rounded-2xl p-5 border border-purple-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Planilha Ativa de Destino
                        </span>
                        <div className="text-xs font-mono font-bold text-slate-800 break-all">
                          ID: {spreadsheetId}
                        </div>
                      </div>

                      {sheetsUrl && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => accessToken && loadSpreadsheetData(accessToken, spreadsheetId)}
                            disabled={isLoading}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                            title="Atualizar dados"
                          >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                          </button>
                          <a
                            href={sheetsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                          >
                            <span>Abrir no Google Sheets</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Preview Table */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Table className="w-4 h-4 text-emerald-600" />
                          <span>Pré-visualização dos Leads Registrados ({rows.length > 1 ? rows.length - 1 : 0})</span>
                        </span>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-52 overflow-y-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold sticky top-0">
                              {rows[0] ? (
                                rows[0].slice(0, 6).map((header, i) => (
                                  <th key={i} className="py-2 px-3 whitespace-nowrap">
                                    {header}
                                  </th>
                                ))
                              ) : (
                                <th className="py-2 px-3">Carregando colunas...</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.length > 1 ? (
                              rows.slice(1).map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className="border-b border-slate-100 hover:bg-slate-50 text-slate-600"
                                >
                                  {row.slice(0, 6).map((cell, cIdx) => (
                                    <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-4 text-center text-slate-400">
                                  Nenhum lead registrado ainda. Envie um cadastro pelo formulário!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Nova ISP Telecomunicações • Google Sheets Integration</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
