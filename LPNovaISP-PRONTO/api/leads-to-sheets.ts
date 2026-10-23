/**
 * Serverless function (Vercel) que faz o proxy do lead para o Google Apps Script.
 * Mantém o mesmo contrato do endpoint /api/leads-to-sheets do server.ts (dev),
 * evitando problemas de CORS no navegador.
 */

type ApiRequest = {
  method?: string;
  body?: any;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método não permitido. Use POST.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { webhookUrl, ...lead } = body;

    if (!webhookUrl) {
      res.status(400).json({ success: false, error: 'URL do Apps Script não fornecida.' });
      return;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    const responseText = await response.text();

    if (!response.ok) {
      res.status(502).json({
        success: false,
        error: `Apps Script retornou ${response.status}: ${responseText}`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Lead enviado ao Google Apps Script com sucesso!',
      data: responseText,
    });
  } catch (err: any) {
    console.error('Error proxying to Apps Script:', err);
    res.status(502).json({ success: false, error: err.message });
  }
}
