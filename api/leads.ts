/**
 * Endpoint de backup de leads usado pelo CheckoutModal (POST /api/leads).
 *
 * Em produção na Vercel não existe sistema de arquivos persistente, então o CSV
 * local do server.ts não pode ser usado. O lead é registrado no log da função e
 * o backup continua sendo feito no localStorage do navegador e no WhatsApp.
 */

type ApiRequest = {
  method?: string;
  body?: any;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método não permitido. Use POST.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    console.log('Lead recebido:', JSON.stringify(body));

    res.json({
      success: true,
      persisted: false,
      message: 'Lead recebido. Em produção o backup é feito no navegador e no WhatsApp.',
    });
  } catch (err: any) {
    console.error('Error handling lead:', err);
    res.status(400).json({ success: false, error: err.message });
  }
}
